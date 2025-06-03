FROM node:latest AS builder

WORKDIR /app/api-blood-donation

COPY package*.json ./

RUN npm install

COPY . .

FROM node:latest AS development

WORKDIR /app/api-blood-donation

COPY --from=builder /app/api-blood-donation /app/api-blood-donation

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]