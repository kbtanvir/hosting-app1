FROM python:3.9-slim


# Set the working directory inside the container
WORKDIR /app

# Set environment variables

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV=development
ENV FLASK_APP="app.py"


# Install dependencies
COPY requirements.txt .

RUN pip install -r requirements.txt

# Copy the Flask application code into the container
COPY . .

# Expose the Flask port
EXPOSE 5000

# Command to run the Flask application
CMD [ "python", "app.py"]
