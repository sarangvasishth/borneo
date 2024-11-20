# Base image
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose the application port
EXPOSE ${APP_PORT}

# Start the application
CMD ["npm", "run", "dev"]