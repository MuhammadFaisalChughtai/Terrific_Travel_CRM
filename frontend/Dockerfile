FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Copy root configurations and workspace files
COPY package.json ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies for the monorepo workspaces
RUN npm install --legacy-peer-deps

# Copy frontend application source
COPY apps/frontend/ ./apps/frontend/

EXPOSE 5173
CMD ["npm", "run", "dev", "--workspace=apps/frontend", "--", "--host"]
