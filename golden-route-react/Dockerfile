# Build stage
FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install all dependencies including dev dependencies
RUN npm install --silent

COPY . .

# Run build script
RUN npm run build

# Production stage
FROM node:lts-alpine

WORKDIR /usr/src/app

# Copy only the built artifacts and necessary dependencies
COPY --from=build /usr/src/app /usr/src/app

# Ensure all dependencies (including dev dependencies) are available
RUN npm install --silent

EXPOSE 4000

RUN chown -R node /usr/src/app
USER node

# Start application
CMD ["npx", "vite"]
