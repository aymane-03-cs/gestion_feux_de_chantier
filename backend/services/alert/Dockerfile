# Utilise l'image officielle Node.js
FROM node:19

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json dans le conteneur
COPY src/package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source
COPY src/ .

# Expose le bon port (Assure-toi que index.js écoute bien sur 3003)
EXPOSE 3003

# Démarre l'application
CMD ["node", "index.js"]
