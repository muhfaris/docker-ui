# Use an official Golang runtime as a parent image for the backend build
FROM golang:1.21.5-alpine AS backend-builder

# Set the Current Working Directory inside the container
WORKDIR /app/backend

# Copy the backend source code
COPY . .

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Build the Go app
RUN go build -o app .

# Use an official Node.js runtime as a parent image for the frontend build
FROM node:18-alpine AS frontend-builder

ENV NODE_ENV=production

# Set the Current Working Directory inside the container
WORKDIR /app/frontend

# Copy the package.json and yarn.lock files
COPY ui/package.json ./

# Install dependencies
RUN npm install

# Copy the frontend source code
COPY ui/ .

# Build the React app
RUN npm run build

# Use a minimal Docker image for the final stage
FROM alpine:3.14

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the backend executable from the backend builder stage
COPY --from=backend-builder /app/backend/app ./backend/

# Copy the frontend build files from the frontend builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Install a simple web server for serving the frontend files
RUN apk add --no-cache nginx

# Copy nginx configuration
COPY ./etc/nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 for the backend
EXPOSE 8080

# Expose port 80 for the frontend
EXPOSE 80

# Start both the backend and frontend servers
CMD ["/bin/sh", "-c", "./backend/app & nginx -g 'daemon off;'"]
