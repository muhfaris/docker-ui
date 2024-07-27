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

# Set the Current Working Directory inside the container
WORKDIR /app/frontend

# Copy the package.json and yarn.lock files
COPY ui/package.json ./

# Install dependencies
RUN npm install

RUN npm install postcss-cli autoprefixer

# Copy the frontend source code
COPY ui/ .

# Build the React app
RUN npm run build

# Use a minimal Docker image for the final stage
FROM alpine:3.14

LABEL org.opencontainers.image.author="info@muhfaris.com"
# LABEL org.opencontainers.image.description DESCRIPTION

ENV AUTH_USERNAME=root
ENV AUTH_PASSWORD=rootr00t

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the backend executable from the backend builder stage
COPY --from=backend-builder /app/backend/app ./backend/

# Copy the frontend build files from the frontend builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Install a simple web server for serving the frontend files
RUN apk add --no-cache nginx

# Copy nginx and env configuration
COPY ./deployment/etc/nginx.conf /etc/nginx/nginx.conf
COPY ./deployment/scripts/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Expose port 2121 for the backend
EXPOSE 2121

# Expose port 80 for the frontend
EXPOSE 80

# Start both the backend and frontend servers
CMD ["/bin/sh", "-c","/docker-entrypoint.d/env.sh && ./backend/app & nginx -g 'daemon off;'"]
