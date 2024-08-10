# Build stage
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and related files
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install dependencies and Prisma CLI
RUN npm install --silent && npm install -g prisma

# Copy application files
COPY . .

# Generate Prisma Client
COPY prisma ./prisma

RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:lts-alpine

# Set environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy necessary files from build stage
COPY --from=build /usr/src/app/src ./src  
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install production dependencies
RUN npm install --silent --only=production

# Expose ports
EXPOSE 4100
EXPOSE 4200

# Change ownership of the app directory to the node user
RUN chown -R node:node /usr/src/app

# Switch to the node user
USER node

# Combine migration and application start in a single CMD
CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node src/index.ts"]