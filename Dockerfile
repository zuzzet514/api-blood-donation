FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18 AS production

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
