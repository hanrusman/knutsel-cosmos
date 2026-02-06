FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
ENV DATA_DIR=/app/data
CMD ["node", "index.js"]
