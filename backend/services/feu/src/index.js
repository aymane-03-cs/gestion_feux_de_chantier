
const express = require('express');
const app = express();
require('dotenv').config();


const feuRoutes = require('./routes/feuRoute');

// Middleware pour parser le JSON
app.use(express.json());

// Routes pour les feux
app.use('', feuRoutes);


const PORT = process.env.PORT || 3002;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Feu service running on port ${PORT}`);
});
