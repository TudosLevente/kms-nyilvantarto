FROM node:20-slim

# Install Python and SQLite for the analytics service and database
RUN apt-get update && apt-get install -y \
    python3 \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the React frontend
RUN npm run build

# Make the start script executable
RUN chmod +x start.sh

# Expose the Node.js port (Python runs internally)
EXPOSE 3001

# Start both services
CMD ["./start.sh"]
