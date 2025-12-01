FROM node:20-alpine

WORKDIR /app

# Copy entire app directory
COPY ./ /

RUN ls

# Install dependencies (recommended: npm ci)
RUN npm run install:all

WORKDIR /app/client

RUN printf "REACT_APP_AUTH_API=https://cia.devregion.com/api/v1/auth\nREACT_APP_API_BASE_URL=https://cia.devregion.com/api/v1\n" > .env

RUN ls

# Build frontend if your workspace has a build script
RUN npm run build

RUN ls

# Move frontend build into server folder (adjust target as you need)
# RUN cp -r build ../server/build

EXPOSE 4000

WORKDIR /app/server

RUN ls

CMD ["npm", "start"]
