FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY src ./src
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV WS_PORT=4000
CMD ["node", "src/index.js"]
