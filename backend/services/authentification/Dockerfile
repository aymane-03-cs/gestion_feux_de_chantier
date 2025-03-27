FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Exposer le port du service d'authentification
EXPOSE 5001

# Commande pour exécuter l'application
CMD ["node", "server.js"]
