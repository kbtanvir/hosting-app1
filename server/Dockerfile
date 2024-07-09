# pull official base image
FROM python:3.11.3-slim-buster

RUN apt-get -q -y update 
# RUN apt-get install -y gcc netcat
# RUN apt-get install -y netcat

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py

# set work directory
WORKDIR /usr/src/app/
COPY . .

 
# RUN pip install --upgrade pip

RUN pip install -r requirements.txt



CMD ["python", "app.py"]

# RUN chmod +x service_entrypoint.sh
# run entrypoint.sh
# ENTRYPOINT ["/usr/src/app/service_entrypoint.sh"]