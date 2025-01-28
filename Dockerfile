# Use Node.js 18 Alpine base image for a small image size
FROM node:18-alpine AS base
# FROM node:16-alpine 
RUN apk add --no-cache openssl
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .
COPY .env .env

# Build the Next.js app
RUN npx prisma generate
RUN npm run build

# Expose the port for the Next.js app
EXPOSE 3000

# Run the app in production mode
CMD ["npm", "run", "start"]
