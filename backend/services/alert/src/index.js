
const express = require('express');
const app = express();
require('dotenv').config();


const alertRoutes = require('./routes/alertRoute');

// Middleware pour parser le JSON
app.use(express.json());

// Routes pour les feux
app.use('', alertRoutes);


const PORT = process.env.PORT || 3003;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`alert service running on port ${PORT}`);
});
