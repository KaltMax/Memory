FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Expose the port
EXPOSE 3000

# Run the server
CMD ["node", "src/server.js"]