from flask import Flask, request, render_template_string, redirect, url_for
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'sites/html/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    return 'Welcome to the HTML file uploader!'


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

    return '''
    <!doctype html>
    <title>Upload new HTML file</title>
    <h1>Upload new HTML file</h1>
    <form method=post enctype=multipart/form-data>
      <p><input type=text name=subdomain placeholder="Subdomain"></p>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''


if __name__ == '__main__':
    app.run(debug=True)
