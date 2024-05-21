# Use the official Node.js 20 image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN yarn install

# Copy the rest of the app source code to the working directory
COPY . .

# Build the app
RUN yarn build

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD [ "yarn", "run", "start:prod" ]