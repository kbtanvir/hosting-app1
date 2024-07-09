import os
from flask import Flask, request, render_template
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(host='0.0.0.0', port=5000, debug=True)
