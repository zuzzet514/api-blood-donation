# Etapa base con dependencias
FROM node:latest AS builder

# Carpeta de trabajo
WORKDIR /app/api-blood-donation

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo nodemon que está en devDependencies)
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Etapa de desarrollo
FROM node:latest AS development

# Carpeta de trabajo
WORKDIR /app/api-blood-donation

# Copiamos solo node_modules y código fuente desde la etapa builder
COPY --from=builder /app/api-blood-donation /app/api-blood-donation

# Puerto expuesto
EXPOSE 3000

# Variable de entorno
ENV NODE_ENV=development

# Comando para correr el servidor
CMD ["npm", "run", "dev"]
