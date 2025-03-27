-- =======================================================================================
-- Générer des alertes et des notifications en selon les données qui entrent dans la base
-- =======================================================================================

-- ===========================================================
--   Drop existing fonctions
-- ===========================================================

DROP FUNCTION IF EXISTS generer_alerte_batterie;
DROP FUNCTION IF EXISTS generer_alerte_position_phy;
DROP FUNCTION IF EXISTS generer_alerte_optiques;
DROP FUNCTION IF EXISTS generer_alerte_segments;
DROP FUNCTION IF EXISTS generer_alerte_bluetooth;
DROP FUNCTION IF EXISTS generer_alerte_radio;
DROP FUNCTION IF EXISTS generer_alerte_temperature_cpu;


-- ===========================================================
--   Fonctions
-- ===========================================================

-- Création d'une alerte pour les feux dont la batterie < seuil

CREATE OR REPLACE FUNCTION generer_alerte_batterie(seuil TYPE_ETAT_BATTERIE)
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, type_etat_batterie, date_enregistrement_batterie
        FROM feux_batterie_sous_seuil(seuil)
    LOOP
        INSERT INTO alerte (id_feu, message)
        VALUES (feu_record.id_feu, 
                FORMAT('Alerte : Batterie faible (%s) pour le feu %s enregistrée le %s', 
                       feu_record.type_etat_batterie, 
                       feu_record.id_feu, 
                       feu_record.date_enregistrement_batterie));
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Création d'une alerte pour les feux qui ont un de leur optique en état NOK

CREATE OR REPLACE FUNCTION generer_alerte_optiques()
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
    optiques_nok TEXT;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, etat_bas, etat_haut, etat_centre, date_enregistrement_optiques
        FROM feux_etat_optiques('NOK')
    LOOP
        optiques_nok := '';

        IF feu_record.etat_bas = 'NOK' THEN
            optiques_nok := optiques_nok || 'Bas ';
        END IF;
        IF feu_record.etat_haut = 'NOK' THEN
            optiques_nok := optiques_nok || 'Haut ';
        END IF;
        IF feu_record.etat_centre = 'NOK' THEN
            optiques_nok := optiques_nok || 'Centre ';
        END IF;

        IF optiques_nok IS NOT NULL THEN
            INSERT INTO alerte (id_feu, message)
            VALUES (feu_record.id_feu, 
                    FORMAT('Alerte : Optique(s) défectueux détecté(s) pour le feu %s à la date %s : %s',
                           feu_record.id_feu, 
                           feu_record.date_enregistrement_optiques,
                           TRIM(optiques_nok)));
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Création d'une alerte pour les feux ayant des segments KO

CREATE OR REPLACE FUNCTION generer_alerte_segments()
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, etat_affichage_segments, date_enregistrement_optiques
        FROM feux_etat_affichage_segments()
    LOOP
        INSERT INTO alerte (id_feu, message)
        VALUES (feu_record.id_feu, 
                FORMAT('Alerte : Affichage 7 segments KO pour le feu %s à la date %s',
                       feu_record.id_feu, 
                       feu_record.date_enregistrement_optiques));
    END LOOP;
END;
$$ LANGUAGE plpgsql;
 

-- Création d'une alerte si la position physique est < seuil

CREATE OR REPLACE FUNCTION generer_alerte_position_phy(p_date TIMESTAMP, p_id_chantier INT, p_angle DECIMAL)
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, position_physique, date_enregistrement_position
        FROM feux_position_phy_seuil(p_date, p_id_chantier, p_angle)
    LOOP
        INSERT INTO alerte (id_feu, message)
        VALUES (feu_record.id_feu, 
                FORMAT('Alerte : Position physique incorrecte pour le feu %s. Position actuelle : %s°, attendue : %s°. Dernière mise à jour : %s',
                       feu_record.id_feu, 
                       feu_record.position_physique, 
                       p_angle, 
                       feu_record.date_enregistrement_position));
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Création d'une alerte pour les feux d'un chantier dont l'état du bluetooth est NOK

CREATE OR REPLACE FUNCTION generer_alerte_bluetooth(p_date TIMESTAMP, p_id_chantier INT)
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, type_etat_bluetooth, date_enregistrement_bluetooth
        FROM obtenir_etats_bluetooth(p_date, p_id_chantier)
        WHERE type_etat_bluetooth = 'NOK'
    LOOP
        INSERT INTO alerte (id_feu, message)
        VALUES (feu_record.id_feu, 
                FORMAT('Alerte : Problème Bluetooth détecté pour le feu %s à la date %s',
                       feu_record.id_feu, 
                       feu_record.date_enregistrement_bluetooth));
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Création d'une alerte pour les feux d'un chantier dont l'état de la radio est NOK

CREATE OR REPLACE FUNCTION generer_alerte_radio(p_date TIMESTAMP, p_id_chantier INT)
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, type_etat_radio, date_enregistrement_radio
        FROM obtenir_etats_radio(p_date, p_id_chantier)
        WHERE type_etat_radio = 'NOK'
    LOOP
        INSERT INTO alerte (id_feu, message)
        VALUES (feu_record.id_feu, 
                FORMAT('Alerte : Problème Radio détecté pour le feu %s à la date %s',
                       feu_record.id_feu, 
                       feu_record.date_enregistrement_radio));
    END LOOP;
END;
$$ LANGUAGE plpgsql;



-- Création d'une alerte pour les feux d'un chantier dont la température du cpu < seuil_temperature

CREATE OR REPLACE FUNCTION generer_alerte_temperature_cpu(p_date TIMESTAMP, p_id_chantier INT, seuil_temperature DECIMAL)
RETURNS VOID AS $$
DECLARE
    feu_record RECORD;
BEGIN
    FOR feu_record IN 
        SELECT id_feu, temperature_cpu, date_enregistrement_temp
        FROM obtenir_etats_cpu(p_date, p_id_chantier)
        WHERE temperature_cpu::DECIMAL < seuil_temperature
    LOOP
        INSERT INTO alerte (id_feu, message)
        VALUES (feu_record.id_feu, 
                FORMAT('Alerte : Température CPU basse pour le feu %s (%s°C, seuil : %s°C) à la date %s',
                       feu_record.id_feu, 
                       feu_record.temperature_cpu, 
                       seuil_temperature,
                       feu_record.date_enregistrement_temp));
    END LOOP;
END;
$$ LANGUAGE plpgsql;
