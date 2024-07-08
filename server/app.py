from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = '../sites/html/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        subdomain = request.form['subdomain']
        file = request.files['file']

        if subdomain and file:
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

            return f'File uploaded successfully for subdomain: {subdomain}'

    return render_template('upload.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
