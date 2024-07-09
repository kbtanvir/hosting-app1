import os
import shutil
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
from models import db, User
from dotenv import load_dotenv
from flask_migrate import Migrate


load_dotenv()

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = '/sites/html/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DB_URL" , "sqlite://") 
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DB_URL" ) 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

db.init_app(app)

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        subdomain = request.form['subdomain']
        file = request.files['file']

        if username and email and subdomain and file:
            # Create subdomain directory if not exists
            subdomain_path = os.path.join(app.config['UPLOAD_FOLDER'], subdomain)
            if not os.path.exists(subdomain_path):
                os.makedirs(subdomain_path)

            # Save file
            filename = secure_filename(file.filename)
            file.save(os.path.join(subdomain_path, filename))

            # If uploaded file is index.html, set it as the default index
            if filename.lower() == 'index.html':
                os.replace(os.path.join(subdomain_path, filename), os.path.join(subdomain_path, 'index.html'))

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
        subdomain_path = os.path.join(app.config['UPLOAD_FOLDER'], user.subdomain)
        if os.path.exists(subdomain_path):
            shutil.rmtree(subdomain_path)
    User.query.delete()
    db.session.commit()
    return redirect(url_for('upload_file'))


@app.route('/delete/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        subdomain_path = os.path.join(app.config['UPLOAD_FOLDER'], user.subdomain)
        if os.path.exists(subdomain_path):
            shutil.rmtree(subdomain_path)
        db.session.delete(user)
        db.session.commit()
    return redirect(url_for('upload_file'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(host='0.0.0.0', port=5000, debug=True)
