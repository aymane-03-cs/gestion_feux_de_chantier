# Utilise l'image officielle Node.js version 18
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie l'ensemble du code de l'application dans le conteneur
COPY . .

# Expose le port sur lequel le service écoute (ici 3002)
EXPOSE 3002

# Démarre le service en exécutant le fichier src/index.js
CMD ["node", "src/index.js"]
