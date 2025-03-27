const { Pool } = require('pg');
require('dotenv').config(); // Pour charger les variables d'environnement

// Pool de connexions PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'aymane',
  password: process.env.DB_PASSWORD || 'PASSWORD_DB_25',
  database: process.env.DB_NAME || 'feux_de_chantier',
});

module.exports = pool;