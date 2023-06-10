# Specify the base image
FROM node:16-alpine


# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the Next.js app
RUN npm run build

# Set the command to start the Next.js app
CMD ["npm", "run","dev"]
