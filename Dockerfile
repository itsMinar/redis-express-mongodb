# Use a lightweight Node.js image
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV='development'
ENV PORT=8000
ENV CORS_ORIGIN=*
ENV MONGODB_URI=mongodb://testuser:testpassword@mongodb:27017
ENV REDIS_URI=redis://:rd_minar007@redis-stack:6379

# Create and Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 8000 for the Express app
EXPOSE 8000

# Start the app using npm start
CMD [ "npm", "start" ]