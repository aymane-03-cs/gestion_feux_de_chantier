-- ============================================================
--   Nom de la base   :  Système de gestion de feux de chantier
--   Nom de SGBD      :                      
--   Date de creation :  29/01/2025                       
-- ============================================================

-- ============================================================
--   Drop existing functions
-- ============================================================

DROP FUNCTION IF EXISTS verifier_nb_feux_groupe;
DROP FUNCTION IF EXISTS verifier_position_unique;
DROP FUNCTION IF EXISTS verifier_cycle_unique;
DROP FUNCTION IF EXISTS verifier_etat_batterie_unique;
DROP FUNCTION IF EXISTS verifier_etat_optiques_unique;
DROP FUNCTION IF EXISTS verifier_fonctionnement_unique;
DROP FUNCTION IF EXISTS verifier_unicite_email_tel;
DROP FUNCTION IF EXISTS notification_alerte;



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
DROP TRIGGER IF EXISTS trigger_email_tel_loueur ON loueur;
DROP TRIGGER IF EXISTS trigger_notification ON alerte;


-- ============================================================
--   Drop existing tables
-- ============================================================

DROP TABLE IF EXISTS loueur CASCADE;
DROP TABLE IF EXISTS groupe CASCADE;
DROP TABLE IF EXISTS feu CASCADE;
DROP TABLE IF EXISTS position_geographique CASCADE;
DROP TABLE IF EXISTS etat_batterie CASCADE;
DROP TABLE IF EXISTS etat_optiques CASCADE;
DROP TABLE IF EXISTS cycle CASCADE;
DROP TABLE IF EXISTS fonctionnement CASCADE;
DROP TABLE IF EXISTS bluetooth CASCADE;
DROP TABLE IF EXISTS radio CASCADE;
DROP TABLE IF EXISTS cpu_temp CASCADE;
DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS chantier CASCADE;
DROP TABLE IF EXISTS utilisation CASCADE;
DROP TABLE IF EXISTS alerte CASCADE;


-- ============================================================
--   Drop existing types
-- ============================================================

DROP TYPE IF EXISTS TYPE_FONCTIONNEMENT CASCADE;
DROP TYPE IF EXISTS TYPE_ETAT_BATTERIE CASCADE;
DROP TYPE IF EXISTS TYPE_ETAT_OPTIQUES CASCADE;


-- ============================================================
--   Table : Loueur
-- ============================================================

CREATE TABLE loueur (
    id_loueur SERIAL PRIMARY KEY,
    nom_societe VARCHAR(100) NOT NULL,
    email_loueur VARCHAR(100) NOT NULL UNIQUE,
    tel_loueur VARCHAR(15)
);

-- ============================================================
--   Table : Groupe
-- ============================================================

CREATE TABLE groupe (
    id_groupe SERIAL PRIMARY KEY
);

-- ============================================================
--   Table : Feu
-- ============================================================

CREATE TABLE feu (
    id_feu SERIAL PRIMARY KEY,
    num_serie VARCHAR(50) UNIQUE NOT NULL,
    pays_utilisation VARCHAR(10) NOT NULL,
    tension_service VARCHAR(3) NOT NULL,
    tension_alimentation VARCHAR(5) NOT NULL,
    id_loueur INT,
    id_groupe INT,
    FOREIGN KEY (id_loueur) REFERENCES loueur(id_loueur) ON DELETE SET NULL,
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE SET NULL
);


-- ============================================================
--   Table : Position géographique
-- ============================================================


CREATE TABLE position_geographique (
    id_position SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    date_enregistrement_position TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    position_physique DECIMAL(5,2) NOT NULL CHECK (position_physique BETWEEN 0 AND 360),
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);

-- ============================================================
--   Table : Fonctionnement
-- ============================================================

CREATE TYPE TYPE_FONCTIONNEMENT AS ENUM ('Auto', 'Clignotant', 'Rouge', 'Veille');

CREATE TABLE fonctionnement (
    id_fonctionnement SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    mode_fonctionnement TYPE_FONCTIONNEMENT NOT NULL,
    date_enregistrement_fonctionnement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);

-- ============================================================
--   Table : Cycle
-- ============================================================

CREATE TABLE cycle (
    id_cycle SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    num_cycle CHAR(2) NOT NULL CHECK (num_cycle BETWEEN '00' AND '99'),
    num_table_cycle CHAR(2) NOT NULL CHECK (num_table_cycle BETWEEN '00' AND '99'),
    date_enregistrement_cycle TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);

-- ============================================================
--   Table : Etat optiques
-- ============================================================

CREATE TYPE TYPE_ETAT_OPTIQUES AS ENUM ('Opérationnelle', 'Défaut');

CREATE TABLE etat_optiques (
    id_etat_optique SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    etat_bas TYPE_ETAT_OPTIQUES NOT NULL,
    etat_haut TYPE_ETAT_OPTIQUES NOT NULL,
    etat_centre TYPE_ETAT_OPTIQUES NOT NULL,
    etat_affichage_7_segments VARCHAR(3) NOT NULL,
    date_enregistrement_optiques TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);

-- ============================================================
--   Table : Etat batterie
-- ============================================================

CREATE TYPE TYPE_ETAT_BATTERIE AS ENUM ('Plein', '75%', '50%', '25%', 'Vide');

CREATE TABLE etat_batterie (
    id_etat_batterie SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    type_etat_batterie TYPE_ETAT_BATTERIE NOT NULL,
    autonomie_restante CHAR(4) NOT NULL CHECK (autonomie_restante ~ '^[0-9]{3}H$'),
    date_enregistrement_batterie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);

-- ============================================================
--   Table : Etat radio
-- ============================================================

CREATE TABLE radio (
    id_radio SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    type_etat_radio VARCHAR(3) NOT NULL,
    date_enregistrement_radio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);

-- ============================================================
--   Table : Etat bluetooth
-- ============================================================

CREATE TABLE bluetooth (
    id_bluetooth SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    type_etat_bluetooth VARCHAR(3)  NOT NULL,
    date_enregistrement_bluetooth TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);


-- ============================================================
--   Table : Etat cpu
-- ============================================================

CREATE TABLE cpu_temp (
    id_cpu_temp SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    temperature_cpu VARCHAR(5) NOT NULL,
    date_enregistrement_temp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);


-- ============================================================
--   Table : Chantier
-- ============================================================

CREATE TABLE chantier (
    id_chantier SERIAL PRIMARY KEY,
    ville VARCHAR(100) NOT NULL
);

-- ============================================================
--   Table : Utilisateur
-- ============================================================

CREATE TABLE utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email_utilisateur VARCHAR(100) NOT NULL UNIQUE,
    tel_utilisateur VARCHAR(15)
);


-- ============================================================
--   Table : Utilisation
-- ============================================================

CREATE TABLE utilisation (
    id_utilisation SERIAL PRIMARY KEY,
    id_groupe INT NOT NULL,
    id_utilisateur INT NOT NULL,
    id_chantier INT NOT NULL,
    FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_chantier) REFERENCES chantier(id_chantier) ON DELETE CASCADE
);

-- ============================================================
--   Table : Alerte
-- ============================================================


CREATE TABLE alertes (
    id_alerte SERIAL PRIMARY KEY,
    id_feu INT NOT NULL,
    type_alerte TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_feu FOREIGN KEY (id_feu) REFERENCES feu(id_feu) ON DELETE CASCADE
);


-- ============================================================
--   FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION verifier_nb_min_feux_groupe() 
RETURNS TRIGGER AS $$
DECLARE 
    feu_count INT;
BEGIN
    SELECT COUNT(*) INTO feu_count FROM feu WHERE id_groupe = OLD.id_groupe;
    IF feu_count <= 2 THEN
        RAISE EXCEPTION 'Un groupe doit toujours contenir au moins 2 feux.';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verifier_nb_max_feux_groupe() 
RETURNS TRIGGER AS $$
DECLARE 
    feu_count INT;
BEGIN
    SELECT COUNT(*) INTO feu_count FROM feu WHERE id_groupe = NEW.id_groupe;
    IF feu_count >= 4 THEN
        RAISE EXCEPTION 'Un groupe ne peut pas contenir plus de 4 feux.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verifier_position_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM position_geographique
        WHERE id_feu = NEW.id_feu
        AND latitude = NEW.latitude
        AND longitude = NEW.longitude
        AND position_physique = NEW.position_physique
    ) THEN
        RAISE EXCEPTION 'Un feu ne peut pas avoir deux positions identiques au même endroit.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verifier_etat_batterie_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM etat_batterie
        WHERE id_feu = NEW.id_feu
        AND type_etat_batterie = NEW.type_etat_batterie
        AND autonomie_restante = NEW.autonomie_restante
        AND date_enregistrement_batterie = NEW.date_enregistrement_batterie
    ) THEN
        RAISE EXCEPTION 'Un état des batteries identique pour ce feu existe déjà à cette date.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION verifier_etat_optiques_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM etat_optiques
        WHERE id_feu = NEW.id_feu
        AND etat_bas = NEW.etat_bas
        AND etat_haut = NEW.etat_haut
        AND etat_centre = NEW.etat_centre
        AND etat_affichage_7_segments = NEW.etat_affichage_7_segments
        AND date_enregistrement_optiques = NEW.date_enregistrement_optiques
    ) THEN
        RAISE EXCEPTION 'Un état des optiques identique pour ce feu existe déjà à cette date.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION verifier_cycle_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM cycle
        WHERE id_feu = NEW.id_feu
        AND num_cycle = NEW.num_cycle
        AND num_table_cycle = NEW.num_table_cycle
        AND date_enregistrement_cycle = NEW.date_enregistrement_cycle
    ) THEN
        RAISE EXCEPTION 'Un cycle identique pour ce feu existe déjà à cette date.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION verifier_fonctionnement_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM fonctionnement
        WHERE id_feu = NEW.id_feu
        AND mode_fonctionnement = NEW.mode_fonctionnement
        AND date_enregistrement_fonctionnement = NEW.date_enregistrement_fonctionnement
    ) THEN
        RAISE EXCEPTION 'Ce fonctionnement pour ce feu existe déjà à cette date.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

:
CREATE OR REPLACE FUNCTION notification_alerte() RETURNS TRIGGER AS $$
DECLARE
    payload JSON;
BEGIN
    payload = json_build_object(
        'id', NEW.id,
        'message', NEW.message,
        'created_at', NEW.created_at
    );

    PERFORM pg_notify('notifications', payload::text); -- envoie la notification de l'alerte sur le canal notifications
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--   TRIGGERS
-- ============================================================

-- Trigger pour vérifier au moins 2 feux par groupe et au maximum 4 
CREATE TRIGGER trigger_nb_max_feux_groupe
BEFORE INSERT ON feu
FOR EACH ROW EXECUTE FUNCTION verifier_nb_max_feux_groupe();


-- Trigger avant suppression feu pour qu'il y ait tjrs au moins 2 feux dans groupe
CREATE TRIGGER trigger_nb_min_feu_groupe
BEFORE DELETE ON feu
FOR EACH ROW EXECUTE FUNCTION verifier_nb_min_feux_groupe();


-- Trigger pour vérifier que chaque position est occupé par 1 seul feu 
CREATE TRIGGER trigger_position_unique
BEFORE INSERT ON position_geographique
FOR EACH ROW
EXECUTE FUNCTION verifier_position_unique();


-- Trigger pour vérifier que 2 états de batterie identiques pour un feu sont enregistrés
CREATE TRIGGER trigger_etat_batterie_unique
BEFORE INSERT ON etat_batterie
FOR EACH ROW
EXECUTE FUNCTION verifier_etat_batterie_unique();


-- Trigger pour vérifier que 2 états d'optiques identiques pour un feu sont enregistrés
CREATE TRIGGER trigger_etat_optiques_unique
BEFORE INSERT ON etat_optiques
FOR EACH ROW
EXECUTE FUNCTION verifier_etat_optiques_unique();


-- Trigger pour vérifier que 2 cycles identiques pour un feu sont enregistrés
CREATE TRIGGER trigger_cycle_unique
BEFORE INSERT ON cycle
FOR EACH ROW
EXECUTE FUNCTION verifier_cycle_unique();


-- Trigger pour vérifier que 2 fonctionnements identiques pour un feu sont enregistrés
CREATE TRIGGER trigger_fonctionnement_unique
BEFORE INSERT ON fonctionnement
FOR EACH ROW
EXECUTE FUNCTION verifier_fonctionnement_unique();


-- Trigger pour envoyer une notification sur le canal quand une alerte est créée
CREATE TRIGGER trigger_notification
AFTER INSERT ON alerte
FOR EACH ROW
EXECUTE FUNCTION notification_alerte();
