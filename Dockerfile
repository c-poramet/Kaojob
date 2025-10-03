FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
RUN npm run build || true
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server/index.js"]
