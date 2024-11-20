# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

RUN npm install -g nodemon

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Copy application source
COPY . .

# Expose the application port
EXPOSE ${APP_PORT}

# Start the application
CMD ["npm", "run", "dev"]