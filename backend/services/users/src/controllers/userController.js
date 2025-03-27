const pool = require('../db');
const fs = require('fs');
const QUERRIES_PATH = __dirname + '/querries';

// CREATE : Ajouter un nouveau feu
exports.createUser = async (req, res) => {
  const { nom, email_utilisateur, tel_utilisateur } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO utilisateur (nom, email_utilisateur, tel_utilisateur) VALUES ($1, $2, $3) RETURNING *',
      [nom, email_utilisateur, tel_utilisateur]
    );
    res.status(201).json({ message: 'Utilisateur créé', utilisateur: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ : Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM utilisateur');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const querry = fs.readFileSync(QUERRIES_PATH + '/gen_info_user.sql', 'utf8');
  try {
    const result = await pool.query(querry, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { nom, nouveau_nom, email_utilisateur, tel_utilisateur } = req.body;
  try {
    const result = await pool.query(
      'UPDATE utilisateur SET nom = $1, email_utilisateur = $2, tel_utilisateur = $3 WHERE nom = $4 RETURNING *',
      [nouveau_nom, email_utilisateur, tel_utilisateur, nom]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour', feu: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM utilisateur WHERE id_utilisateur = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé', Utilisateur: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
