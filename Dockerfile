# Frontend Build Stage
FROM node:20 

# Set the working directory to /app
WORKDIR /app 
COPY . .

# Install dependencies
RUN npm install


# Expose port 80 for Nginx
EXPOSE 5173

# Start Nginx in the foreground
CMD ["npm", "run", "dev"]
