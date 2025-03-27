
const express = require('express');
const app = express();
require('dotenv').config();


const usersRoutes = require('./routes/usersRoute');

// Middleware pour parser le JSON
app.use(express.json());

// Routes pour les feux
app.use('', usersRoutes);


const PORT = process.env.PORT || 3001;

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Users service running on port ${PORT}`);
});
