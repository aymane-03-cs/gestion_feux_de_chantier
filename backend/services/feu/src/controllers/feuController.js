// src/controllers/feu.controller.js
const pool = require('../db');
const path = require('path');

const fs = require('fs');
const QUERRIES_PATH = __dirname + '/querries';

// CREATE : Ajouter un nouveau feu
// CREATE : Ajouter un nouveau feu
exports.createFeu = async (req, res) => {
  const { numSerie, numGroupe, modeFonctionnement, etatOptique, etatBatterie, positionPhysique, latitude, longitude } = req.body;
  
  try {
    // Étape 1 : Insérer un feu avec id_groupe
    const feuResult = await pool.query(
      "INSERT INTO feu (num_serie, id_groupe, pays_utilisation, tension_service, tension_alimentation) VALUES ($1, $2, 'FR', '12V', '220V') RETURNING id_feu",
      [numSerie, numGroupe]
    );
    const idFeu = feuResult.rows[0].id_feu;

    // Étape 2 : Insérer la position géographique
    await pool.query(
      "INSERT INTO position_geographique (id_feu, latitude, longitude, position_physique) VALUES ($1, $2, $3, $4)",
      [idFeu, latitude, longitude, positionPhysique]
    );

    // Étape 3 : Insérer le mode de fonctionnement
    await pool.query(
      "INSERT INTO fonctionnement (id_feu, mode_fonctionnement) VALUES ($1, $2)",
      [idFeu, modeFonctionnement]
    );

    // Étape 4 : Insérer l'état des optiques
    await pool.query(
      "INSERT INTO etat_optiques (id_feu, etat_bas, etat_haut, etat_centre, etat_affichage_7_segments) VALUES ($1, $2, 'Opérationnelle', 'Opérationnelle', 'ON')",
      [idFeu, etatOptique]
    );

    // Étape 5 : Insérer l'état des batteries
    await pool.query(
      "INSERT INTO etat_batterie (id_feu, type_etat_batterie, autonomie_restante) VALUES ($1, $2, '100H')",
      [idFeu, etatBatterie]
    );

    res.status(201).json({ message: "Feu créé avec succès", feuId: idFeu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ : Récupérer tous les feux


exports.getAllFeux = async (req, res) => {
  const querry = fs.readFileSync(QUERRIES_PATH + '/get_all_feu.sql', 'utf8');
  try {
    const result = await pool.query(querry);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ : Récupérer les feux par utilisateur ( loueur)
exports.getFeuxByUser = async (req, res) => {
  const userId = req.params.id; // :id dans la route
  try {
    // On récupère la requête de base
    let query = fs.readFileSync(path.join(QUERRIES_PATH, 'get_all_feu.sql'), 'utf8');
    // On peut faire un split sur "GROUP BY f.id_feu" et intercaler le WHERE :
    const splitMarker = 'GROUP BY f.id_feu';
    const parts = query.split(splitMarker);
    
    // On recompose en y insérant le WHERE
    let userQuery = `
      ${parts[0]}
      WHERE f.id_groupe IN (
        SELECT id_groupe
        FROM utilisation
        WHERE id_utilisateur = $1
      )
      ${splitMarker}
      ${parts[1]}
    `;

    const result = await pool.query(userQuery, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// READ : Récupérer les feux par visiteur
exports.getFeuxByVisitor = async (req, res) => {
  const visitorId = req.params.id; 
  try {
    let query = fs.readFileSync(path.join(QUERRIES_PATH, 'get_all_feu.sql'), 'utf8');
    const splitMarker = 'GROUP BY f.id_feu';
    const parts = query.split(splitMarker);

    let visitorQuery = `
      ${parts[0]}
      WHERE f.id_groupe IN (
        SELECT id_groupe
        FROM utilisation
        WHERE id_utilisateur = $1
        -- ou autre condition
      )
      ${splitMarker}
      ${parts[1]}
    `;
    const result = await pool.query(visitorQuery, [visitorId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};





// READ : Récupérer un feu par son ID
exports.getFeuById = async (req, res) => {
  const { id } = req.params;
  const querry = fs.readFileSync(QUERRIES_PATH + '/gen_info_feu.sql', 'utf8');
  try {
    const result = await pool.query(querry, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feu non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // UPDATE : Mettre à jour un feu
// exports.updateFeu = async (req, res) => {
//   console.log("🔍 Requête reçue :", JSON.stringify(req.body, null, 2)); // Debug request body

//   const { id } = req.params; // Récupération de l'ID du feu depuis les paramètres de la requête
//   const { num_serie, modeFonctionnement, etatOptique, etatBatterie, positionPhysique, latitude, longitude } = req.body;

//   try {
//     // Vérifier si le feu existe
//     const feuResult = await pool.query("SELECT id_feu FROM feu WHERE id_feu = $1", [id]);
    
//     if (feuResult.rows.length === 0) {
//       return res.status(404).json({ message: "Feu non trouvé" });
//     }

//     // Mettre à jour le feu
//     await pool.query("UPDATE feu SET num_serie = $1 WHERE id_feu = $2 RETURNING *", [num_serie, id]);

//     // Mettre à jour la position géographique
//     await pool.query(
//       "UPDATE position_geographique SET latitude = $1, longitude = $2, position_physique = $3 WHERE id_feu = $4",
//       [latitude, longitude, positionPhysique, id]
//     );

//     // Mettre à jour le mode de fonctionnement
//     await pool.query(
//       "UPDATE fonctionnement SET mode_fonctionnement = $1 WHERE id_feu = $2",
//       [modeFonctionnement, id]
//     );

//     // Mettre à jour l'état des optiques
//     await pool.query(
//       "UPDATE etat_optiques SET etat_bas = $1 WHERE id_feu = $2",
//       [etatOptique, id]
//     );

//     // Mettre à jour l'état des batteries
//     await pool.query(
//       "UPDATE etat_batterie SET type_etat_batterie = $1 WHERE id_feu = $2",
//       [etatBatterie, id]
//     );

//     res.json({ message: "Feu mis à jour avec succès", feuId: id });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateFeu = async (req, res) => {
  console.log("🔍 Requête reçue :", JSON.stringify(req.body, null, 2));

  const { id } = req.params;
  const feu = req.body;
  
  try {
    // Début de la transaction
    await pool.query('BEGIN');

    // Vérifier si le feu existe
    const feuResult = await pool.query("SELECT id_feu FROM feu WHERE id_feu = $1", [id]);
    
    if (feuResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: "Feu non trouvé" });
    }

    // 🔹 Mettre à jour le feu principal avec id_groupe
    await pool.query(
      "UPDATE feu SET num_serie = $1, id_groupe = $2, pays_utilisation = $3, tension_service = $4, tension_alimentation = $5 WHERE id_feu = $6", 
      [feu.num_serie, feu.id_groupe, feu.pays_utilisation, feu.tension_service, feu.tension_alimentation, id]
    );

    // 🔹 Mettre à jour la position
    if (feu.positions && feu.positions.length > 0) {
      const position = feu.positions[0];
      if (position.latitude !== undefined && position.longitude !== undefined) {
        await pool.query(
          "UPDATE position_geographique SET position_physique = $1, latitude = $2, longitude = $3 WHERE id_feu = $4",
          [position.position_physique, position.latitude, position.longitude, id]
        );
      }
    }

    // 🔹 Mettre à jour le fonctionnement
    if (feu.fonctionnements && feu.fonctionnements.length > 0) {
      const fonctionnement = feu.fonctionnements[0];
      await pool.query(
        "UPDATE fonctionnement SET mode_fonctionnement = $1 WHERE id_feu = $2",
        [fonctionnement.mode_fonctionnement, id]
      );
    }

    // 🔹 Mettre à jour l'état des optiques
    if (feu.etats_optiques && feu.etats_optiques.length > 0) {
      const etatOptique = feu.etats_optiques[0];
      await pool.query(
        "UPDATE etat_optiques SET etat_bas = $1, etat_haut = $2, etat_centre = $3, etat_affichage_7_segments = $4 WHERE id_feu = $5",
        [
          etatOptique.etat_bas,
          etatOptique.etat_haut,
          etatOptique.etat_centre,
          etatOptique.etat_affichage_7_segments || '',
          id
        ]
      );
    }

    // 🔹 Mettre à jour l'état des batteries
    if (feu.etats_batteries && feu.etats_batteries.length > 0) {
      const etatBatterie = feu.etats_batteries[0];
      await pool.query(
        "UPDATE etat_batterie SET type_etat_batterie = $1, autonomie_restante = $2 WHERE id_feu = $3",
        [
          etatBatterie.type_etat_batterie,
          etatBatterie.autonomie_restante,
          id
        ]
      );
    }

    await pool.query('COMMIT');

    res.json({ message: "Feu mis à jour avec succès" });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Erreur lors de la mise à jour du feu:", error);
    res.status(500).json({ error: error.message });
  }
};





// DELETE : Supprimer un feu
exports.deleteFeu = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM feu WHERE id_feu = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feu non trouvé' });
    }
    res.json({ message: 'Feu supprimé', feu: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
