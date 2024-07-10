# Use the official Node.js 18 image as the base image
FROM node:20.11.0

# Set the working directory
WORKDIR /app

COPY . .

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install
RUN pnpm generate
RUN pnpm migrate

# Copy the rest of the application code


# Expose the port that your app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "dev"]
