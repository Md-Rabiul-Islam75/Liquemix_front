FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (npm ci = reproducible from lockfile)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build arguments passed from docker-compose. NEXT_PUBLIC_* are baked into the
# browser bundle at BUILD time, so they MUST be build args (not runtime env).
# The Firebase web config (NEXT_PUBLIC_FIREBASE_*) is read from .env.production,
# which is committed (those keys are public). Only the API base differs per env.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Build the Next.js app (next build also auto-loads .env.production)
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
