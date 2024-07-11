# Use the official Node.js 20 image as the base image
FROM node:20.15-alpine

WORKDIR /usr/src/app
COPY package*.json ./

# installing netcat for checking that mysql server is up before trying to connect to it
# RUN apt-get update 
# RUN apt-get install -y netcat-openbsd 
RUN npm install -g pnpm 
 

# RUN npm install ts-node 
RUN pnpm install

# copy the rest of the files into
# the working directory /usr/src/app
COPY . .

# RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "dev:migrate"]