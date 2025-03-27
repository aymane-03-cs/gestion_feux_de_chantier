const express = require('express');
const app = express();
require('dotenv').config();

const rapportRoutes = require('./routes/rapportRoute');

// Middleware pour parser le JSON
app.use(express.json());

// Routes pour les rapports
app.use('/api/rapports', rapportRoutes);

const PORT = process.env.PORT || 3004;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Rapport service running on port ${PORT}`);
});