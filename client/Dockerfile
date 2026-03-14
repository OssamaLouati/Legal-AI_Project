# Specify the base image
FROM node:20-alpine


# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Default to dev server for local docker-compose use.
# (Production mode is faster but requires env vars to be passed in explicitly.)
CMD ["npm", "run", "dev", "--", "--port", "3000"]
