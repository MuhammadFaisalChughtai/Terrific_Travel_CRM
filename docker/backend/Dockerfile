FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /usr/src/app

# Copy root configurations and workspace files
COPY package.json ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies for the monorepo workspaces
RUN npm install --legacy-peer-deps

# Copy backend application source
COPY apps/backend/ ./apps/backend/

# Generate Prisma client
WORKDIR /usr/src/app/apps/backend
RUN npx prisma generate

# Build the NestJS app
WORKDIR /usr/src/app
RUN npm run build --workspace=apps/backend

EXPOSE 3000
CMD ["npm", "run", "start:dev", "--workspace=apps/backend"]
