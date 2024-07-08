# pull official base image
FROM python:3.11.3-slim-buster

RUN apt-get -q -y update 
RUN apt-get install -y gcc

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work directory
WORKDIR /usr/src/app
COPY . /usr/src/app/

# install system dependencies
RUN apt-get update && apt-get install -y netcat
# RUN pip install --upgrade pip
# COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

RUN chmod +x service_entrypoint.sh
# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/service_entrypoint.sh"]