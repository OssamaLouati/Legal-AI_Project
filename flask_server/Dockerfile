# Specify the base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code
COPY . .
ENV PATH="/root/.local/bin:${PATH}"
EXPOSE 5000


# Set the command to start the Flask app
CMD ["flask", "run"]