const pool = require('../db');

// CREATE : Ajouter un nouveau rapport
exports.createRapport = async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO rapport (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json({ message: 'Rapport créé', rapport: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ : Récupérer tous les rapports
exports.getAllRapports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rapport');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ : Récupérer un rapport par son ID
exports.getRapportById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM rapport WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE : Mettre à jour un rapport
exports.updateRapport = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'UPDATE rapport SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }
    res.json({ message: 'Rapport mis à jour', rapport: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE : Supprimer un rapport
exports.deleteRapport = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM rapport WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }
    res.json({ message: 'Rapport supprimé', rapport: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};