FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY src ./src

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV WS_PORT=4000

CMD ["npm", "start"]
