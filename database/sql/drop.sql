-- ============================================================
--   Drop existing triggers
-- ============================================================

DROP TRIGGER IF EXISTS trigger_nb_max_feux_groupe ON feu;
DROP TRIGGER IF EXISTS trigger_nb_min_feux_groupe ON feu;
DROP TRIGGER IF EXISTS trigger_position_unique ON position_geographique;
DROP TRIGGER IF EXISTS trigger_etat_batterie_unique ON etat_batterie;
DROP TRIGGER IF EXISTS trigger_etat_optiques_unique ON etat_optiques;
DROP TRIGGER IF EXISTS trigger_cycle_unique ON cycle;
DROP TRIGGER IF EXISTS trigger_fonctionnement_unique ON fonctionnement;
DROP TRIGGER IF EXISTS trigger_email_tel_utilisateur ON utilisateur;
DROP TRIGGER IF EXISTS trigger_email_tel_admin ON loueur;

DROP FUNCTION IF EXISTS verifier_nb_min_feux_groupe;
DROP FUNCTION IF EXISTS verifier_position_unique;
DROP FUNCTION IF EXISTS verifier_cycle_unique;
DROP FUNCTION IF EXISTS verifier_etat_batterie_unique;
DROP FUNCTION IF EXISTS verifier_etat_optiques_unique;
DROP FUNCTION IF EXISTS verifier_fonctionnement_unique;
DROP FUNCTION IF EXISTS verifier_unicite_email_tel;

-- ===========================================================
--   Drop existing fonctions (select)
-- ===========================================================

DROP FUNCTION IF EXISTS obtenir_etats_batterie;
DROP FUNCTION IF EXISTS obtenir_etats_optiques;
DROP FUNCTION IF EXISTS liste_etats_batterie_periode;
DROP FUNCTION IF EXISTS liste_cycles_periode;
DROP FUNCTION IF EXISTS liste_etats_optiques_periode;
DROP FUNCTION IF EXISTS liste_fonctionnements_periode;
DROP FUNCTION IF EXISTS liste_positions_geo_periode;
DROP FUNCTION IF EXISTS liste_positions_phy_periode;
DROP FUNCTION IF EXISTS feux_appartenant_administrateur;
DROP FUNCTION IF EXISTS feux_geres_utilisateur;
DROP FUNCTION IF EXISTS feux_batterie_sous_seuil;
DROP FUNCTION IF EXISTS feux_en_mode_alerte;
DROP FUNCTION IF EXISTS feux_inactifs;
DROP FUNCTION IF EXISTS feux_appartenant_chantier;
DROP FUNCTION IF EXISTS feux_etat_optiques;
DROP FUNCTION IF EXISTS historique_feu;
DROP FUNCTION IF EXISTS position_actuelle_feu;
DROP FUNCTION IF EXISTS liste_etats_radio_periode;
DROP FUNCTION IF EXISTS liste_etats_bluetooth_periode;
DROP FUNCTION IF EXISTS liste_etats_cpu_periode;
DROP FUNCTION IF EXISTS obtenir_etats_radio;
DROP FUNCTION IF EXISTS obtenir_etats_bluetooth;
DROP FUNCTION IF EXISTS obtenir_etats_cpu;

-- ============================================================
--   Drop existing functions (update)
-- ============================================================

DROP FUNCTION IF EXISTS ajouter_utilisateur;
DROP FUNCTION IF EXISTS ajouter_admin;
DROP FUNCTION IF EXISTS ajouter_feu;
DROP FUNCTION IF EXISTS ajouter_chantier_avec_feux;
DROP FUNCTION IF EXISTS ajouter_position_geographique;
DROP FUNCTION IF EXISTS ajouter_etat_batterie;
DROP FUNCTION IF EXISTS ajouter_etat_optiques;
DROP FUNCTION IF EXISTS ajouter_cycle;
DROP FUNCTION IF EXISTS ajouter_fonctionnement;
DROP FUNCTION IF EXISTS ajouter_radio;
DROP FUNCTION IF EXISTS ajouter_bluetooth;
DROP FUNCTION IF EXISTS ajouter_temp_cpu;

-- ============================================================
--   Drop existing functions (notification)
-- ============================================================

DROP FUNCTION IF EXISTS generer_alerte_batterie;
DROP FUNCTION IF EXISTS generer_alerte_position_phy;
DROP FUNCTION IF EXISTS generer_alerte_optiques;
DROP FUNCTION IF EXISTS generer_alerte_segments;
DROP FUNCTION IF EXISTS generer_alerte_bluetooth;
DROP FUNCTION IF EXISTS generer_alerte_radio;
DROP FUNCTION IF EXISTS generer_alerte_temperature_cpu;


-- ============================================================
--   Drop existing tables
-- ============================================================

DROP TABLE IF EXISTS feu CASCADE;
DROP TABLE IF EXISTS position_geographique CASCADE;
DROP TABLE IF EXISTS etat_batterie CASCADE;
DROP TABLE IF EXISTS etat_optiques CASCADE;
DROP TABLE IF EXISTS cycle CASCADE;
DROP TABLE IF EXISTS fonctionnement CASCADE;
DROP TABLE IF EXISTS loueur CASCADE;
DROP TABLE IF EXISTS bluetooth CASCADE;
DROP TABLE IF EXISTS radio CASCADE;
DROP TABLE IF EXISTS cpu_temp CASCADE;
DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS chantier CASCADE;
DROP TABLE IF EXISTS utilisation CASCADE;
DROP TABLE IF EXISTS appartenance CASCADE;

-- ============================================================
--   Drop existing types
-- ============================================================

DROP TYPE IF EXISTS TYPE_FONCTIONNEMENT CASCADE;
DROP TYPE IF EXISTS TYPE_ETAT_BATTERIE CASCADE;
DROP TYPE IF EXISTS TYPE_ETAT_OPTIQUES CASCADE;
