FROM node:18-alpine
WORKDIR /app

# 1) Copy only package files first, so Docker can cache npm install
COPY package.json ./

# 2) Install dependencies (including socket.io-client)
RUN npm ci --production

# 3) Copy the rest of your source
COPY . .

ENV PORT=3000
CMD ["npm", "start"]
