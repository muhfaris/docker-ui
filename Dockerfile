# Use an official Golang runtime as a parent image for the backend build
FROM golang:1.19-alpine AS backend-builder

# Set the Current Working Directory inside the container
WORKDIR /app/backend

# Copy go mod and sum files
COPY backend/go.mod backend/go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the backend source code
COPY backend/ .

# Build the Go app
RUN go build -o main .

# Use an official Node.js runtime as a parent image for the frontend build
FROM node:16-alpine AS frontend-builder

# Set the Current Working Directory inside the container
WORKDIR /app/frontend

# Copy the package.json and yarn.lock files
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the frontend source code
COPY frontend/ .

# Build the React app
RUN yarn build

# Use a minimal Docker image for the final stage
FROM alpine:3.14

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the backend executable from the backend builder stage
COPY --from=backend-builder /app/backend/main ./backend/

# Copy the frontend build files from the frontend builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Install a simple web server for serving the frontend files
RUN apk add --no-cache nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 for the backend
EXPOSE 8080

# Expose port 80 for the frontend
EXPOSE 80

# Start both the backend and frontend servers
CMD ["/bin/sh", "-c", "./backend/main & nginx -g 'daemon off;'"]
