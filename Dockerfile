# =========================
# React App Dockerfile
# =========================
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the default React port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
