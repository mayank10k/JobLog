# use official Node.js image
FROM node:20-alpine

# set working directory inside container
WORKDIR /app

# copy package files first (for caching)
COPY package*.json ./

# install dependencies
RUN npm install --production

# copy rest of the backend code
COPY . .

# expose the port your server runs on
EXPOSE 5000

# start the server
CMD ["node", "server.js"]