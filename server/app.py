import os
import io
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
from models import db, User
from dotenv import load_dotenv
from flask_migrate import Migrate
from minio import Minio
from minio.error import S3Error

load_dotenv()

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = '/sites/html/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DB_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)

# MinIO configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ROOT_USER")
MINIO_SECRET_KEY = os.getenv("MINIO_ROOT_PASSWORD")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME")

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# Ensure the bucket exists
if not minio_client.bucket_exists(MINIO_BUCKET_NAME):
    minio_client.make_bucket(MINIO_BUCKET_NAME)


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        subdomain = request.form['subdomain']
        file = request.files['file']

        if username and email and subdomain and file:
            # Save file to MinIO
            filename = secure_filename(file.filename)
            object_name = f"{subdomain}/{filename}"

            # Read the file content
            file_content = file.read()

            # Upload the file
            minio_client.put_object(
                MINIO_BUCKET_NAME,
                object_name,
                io.BytesIO(file_content),  # Use BytesIO to create a new stream
                length=len(file_content),
                content_type='text/html'
            )

            # If uploaded file is index.html, set it as the default index
            if filename.lower() == 'index.html':
                object_name = f"{subdomain}/index.html"
                minio_client.put_object(
                    MINIO_BUCKET_NAME,
                    object_name,
                    io.BytesIO(file_content),  # Use the same content
                    length=len(file_content),
                    content_type='text/html'
                )

            # Add user and subdomain information to the database
            new_user = User(username=username, email=email, subdomain=subdomain, status='Active')
            db.session.add(new_user)
            db.session.commit()

    users = User.query.all()
    return render_template('index.html', users=users)


@app.route('/delete_all', methods=['POST'])
def delete_all_users():
    users = User.query.all()
    for user in users:
        try:
            objects_to_delete = minio_client.list_objects(MINIO_BUCKET_NAME, prefix=user.subdomain, recursive=True)
            for obj in objects_to_delete:
                minio_client.remove_object(MINIO_BUCKET_NAME, obj.object_name)
        except S3Error as e:
            print(f"Error deleting objects for subdomain {user.subdomain}: {e}")
    User.query.delete()
    db.session.commit()
    return redirect(url_for('upload_file'))


@app.route('/delete/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        try:
            objects_to_delete = minio_client.list_objects(MINIO_BUCKET_NAME, prefix=user.subdomain, recursive=True)
            for obj in objects_to_delete:
                minio_client.remove_object(MINIO_BUCKET_NAME, obj.object_name)
        except S3Error as e:
            print(f"Error deleting objects for subdomain {user.subdomain}: {e}")
        db.session.delete(user)
        db.session.commit()
    return redirect(url_for('upload_file'))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        app.run(host='0.0.0.0', port=5000, debug=True)
