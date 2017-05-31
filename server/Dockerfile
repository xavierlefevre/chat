# Retrieves latest node version image
FROM node:latest

# Creates app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundles app source
COPY . /usr/src/app

# Installs app dependencies
RUN npm install

# Exposes the server
EXPOSE 8080

# Starts the server
CMD [ "npm", "start" ]
