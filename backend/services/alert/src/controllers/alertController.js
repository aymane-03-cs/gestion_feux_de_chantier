// src/controllers/feu.controller.js
const pool = require('../db');
const fs = require('fs');
const QUERRIES_PATH = __dirname + '/querries';

// Récuperer les alertes.
exports.getAllWarnings = async (req, res) => {
    try {
        const BatteryWarnings = await pool.query("SELECT * FROM etat_batterie WHERE type_etat_batterie IN ('Vide', '25%')");
        const OpticsWarnings = await pool.query("SELECT * FROM etat_optiques WHERE 'Défaut' IN (etat_bas, etat_haut, etat_centre)");
        
        res.json({
            batteryWarnings: BatteryWarnings.rows,
            opticsWarnings: OpticsWarnings.rows
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 🔹 Company User – alertes liées à ses feux
exports.getWarningsByUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const BatteryWarnings = await pool.query(`
        SELECT eb.*
        FROM etat_batterie eb
        JOIN feu f ON eb.id_feu = f.id_feu
        WHERE f.id_groupe IN (
          SELECT id_groupe FROM utilisation WHERE id_utilisateur = $1
        )
        AND eb.type_etat_batterie IN ('Vide', '25%')
      `, [userId]);
  
      const OpticsWarnings = await pool.query(`
        SELECT eo.*
        FROM etat_optiques eo
        JOIN feu f ON eo.id_feu = f.id_feu
        WHERE f.id_groupe IN (
          SELECT id_groupe FROM utilisation WHERE id_utilisateur = $1
        )
        AND 'Défaut' IN (eo.etat_bas, eo.etat_haut, eo.etat_centre)
      `, [userId]);
  
      res.json({
        batteryWarnings: BatteryWarnings.rows,
        opticsWarnings: OpticsWarnings.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // 🔹 Visitor – alertes liées à ses chantiers
  exports.getWarningsByVisitor = async (req, res) => {
    const visitorId = req.params.id;
    try {
      const BatteryWarnings = await pool.query(`
        SELECT eb.*
        FROM etat_batterie eb
        JOIN feu f ON eb.id_feu = f.id_feu
        WHERE f.id_groupe IN (
          SELECT id_groupe FROM utilisation WHERE id_utilisateur = $1
        )
        AND eb.type_etat_batterie IN ('Vide', '25%')
      `, [visitorId]);
  
      const OpticsWarnings = await pool.query(`
        SELECT eo.*
        FROM etat_optiques eo
        JOIN feu f ON eo.id_feu = f.id_feu
        WHERE f.id_groupe IN (
          SELECT id_groupe FROM utilisation WHERE id_utilisateur = $1
        )
        AND 'Défaut' IN (eo.etat_bas, eo.etat_haut, eo.etat_centre)
      `, [visitorId]);
  
      res.json({
        batteryWarnings: BatteryWarnings.rows,
        opticsWarnings: OpticsWarnings.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };