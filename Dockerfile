# Start from the official Node.js LTS base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy all files
COPY . .
# Accept the NEXT_PUBLIC_API_URL as a build argument
RUN npx prisma generate
RUN npm run build

CMD [ "npm", "start" ]