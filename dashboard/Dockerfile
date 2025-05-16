FROM node:18-alpine
WORKDIR /app

# 1) Copy only package.json so we can cache installs
COPY package.json ./

# 2) Install everything (dev + prod) so we can build
RUN npm install

# 3) Copy the rest of your source
COPY . .

# 4) Build the Next.js production bundle
RUN npm run build

# 5) Remove devDependencies (optional)
RUN npm prune --production

# 6) Expose & start
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
