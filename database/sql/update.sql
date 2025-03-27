-- ============================================================
-- Ajouter des données dans la base                
-- ============================================================

-- ===========================================================
--   Drop existing fonctions
-- ===========================================================

DROP FUNCTION IF EXISTS ajouter_utilisateur;
DROP FUNCTION IF EXISTS ajouter_loueur;
DROP FUNCTION IF EXISTS ajouter_feu;
DROP FUNCTION IF EXISTS ajouter_utilisation;
DROP FUNCTION IF EXISTS ajouter_chantier;
DROP FUNCTION IF EXISTS ajouter_position_geographique;
DROP FUNCTION IF EXISTS ajouter_etat_batterie;
DROP FUNCTION IF EXISTS ajouter_etat_optiques;
DROP FUNCTION IF EXISTS ajouter_cycle;
DROP FUNCTION IF EXISTS ajouter_fonctionnement;
DROP FUNCTION IF EXISTS ajouter_radio;
DROP FUNCTION IF EXISTS ajouter_bluetooth;
DROP FUNCTION IF EXISTS ajouter_temp_cpu;

-- ===========================================================
--   Fonctions
-- ===========================================================

-- Ajouter un utilisateur

CREATE OR REPLACE FUNCTION ajouter_utilisateur(
    u_nom VARCHAR(100),
    u_email VARCHAR(100),
    u_tel VARCHAR(15)
)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM utilisateur WHERE email_utilisateur = u_email) THEN
        RAISE EXCEPTION 'L''email % est déjà utilisé par un autre utilisateur.', u_email;
    END IF;

    IF EXISTS (SELECT 1 FROM utilisateur WHERE tel_utilisateur = u_tel) THEN
        RAISE EXCEPTION 'Le numéro de téléphone % est déjà utilisé par un autre utilisateur.', u_tel;
    END IF;

    INSERT INTO utilisateur (nom, email_utilisateur, tel_utilisateur)
    VALUES (u_nom, u_email, u_tel);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un loueur

CREATE OR REPLACE FUNCTION ajouter_loueur(
    l_nom_societe VARCHAR(100),
    l_email VARCHAR(100),
    l_tel VARCHAR(15)
)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM loueur WHERE nom_societe = l_nom_societe) THEN
        RAISE EXCEPTION 'Le nom de société % est déjà utilisé par un autre loueur.', l_tel;
    END IF;

    IF EXISTS (SELECT 1 FROM loueur WHERE email_loueur = l_email) THEN
        RAISE EXCEPTION 'L''email % est déjà utilisé par un autre loueur.', l_email;
    END IF;

    IF EXISTS (SELECT 1 FROM loueur WHERE tel_loueur = l_tel) THEN
        RAISE EXCEPTION 'Le numéro de téléphone % est déjà utilisé par un autre loueur.', l_tel;
    END IF;

    INSERT INTO loueur(nom_societe, email_loueur, tel_loueur)
    VALUES (l_nom_societe, l_email, l_tel);
END;
$$ LANGUAGE plpgsql;

-- Ajouter un feu

CREATE OR REPLACE FUNCTION ajouter_feu(
    f_num_serie VARCHAR(50),
    f_pays VARCHAR(10),
    f_tension_s VARCHAR(3),
    f_tension_alim VARCHAR(5),
    f_id_loueur INT,
    f_id_groupe INT
)
RETURNS VOID AS $$
BEGIN

    IF f_id_loueur IS NOT NULL AND NOT EXISTS (SELECT 1 FROM loueur WHERE id_loueur = f_id_loueur) THEN
        RAISE EXCEPTION 'Le loueur avec l''ID % n''existe pas.', f_id_loueur;
    END IF;

    IF f_id_groupe IS NOT NULL AND NOT EXISTS (SELECT 1 FROM groupe WHERE id_groupe = f_id_groupe) THEN
        RAISE EXCEPTION 'Le groupe avec l''ID % n''existe pas.', f_id_groupe;
    END IF;

    INSERT INTO feu (num_serie, pays_utilisation, tension_service, tension_alimentation, id_loueur, id_groupe)
    VALUES (f_num_serie, f_pays, f_tension_s, f_tension_alim, f_id_loueur, f_id_groupe);
END;
$$ LANGUAGE plpgsql;

-- Ajouter utilisation 

CREATE OR REPLACE FUNCTION ajouter_utilisation(
    f_id_groupe INT,
    f_id_utilisateur INT,
    f_id_chantier INT
)
RETURNS VOID AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM groupe WHERE id_groupe = f_id_groupe) THEN
        RAISE EXCEPTION 'Le groupe avec l''ID % n''existe pas.', f_id_groupe;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM utilisateur WHERE id_utilisateur = f_id_utilisateur) THEN
        RAISE EXCEPTION 'L''utilisateur avec l''ID % n''existe pas.', f_id_utilisateur;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM chantier WHERE id_chantier = f_id_chantier) THEN
        RAISE EXCEPTION 'Le chantier avec l''ID % n''existe pas.', f_id_chantier;
    END IF;

    INSERT INTO utilisation (id_groupe, id_utilisateur, id_chantier)
    VALUES (f_id_groupe, f_id_utilisateur, f_id_chantier);
    
END;
$$ LANGUAGE plpgsql;


-- Ajouter un chantier (et une 1ère utilisation associée)

CREATE OR REPLACE FUNCTION ajouter_chantier(
    f_ville VARCHAR(100),
    f_id_groupe INT,
    f_id_utilisateur INT
)
RETURNS VOID AS $$
DECLARE
    v_id_chantier INT;
BEGIN

    IF NOT EXISTS (SELECT 1 FROM groupe WHERE id_groupe = f_id_groupe) THEN
        RAISE EXCEPTION 'Le groupe avec l''ID % n''existe pas.', f_id_groupe;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM utilisateur WHERE id_utilisateur = f_id_utilisateur) THEN
        RAISE EXCEPTION 'L''utilisateur avec l''ID % n''existe pas.', f_id_utilisateur;
    END IF;

    INSERT INTO chantier (ville)
    VALUES (f_ville)
    RETURNING id_chantier INTO v_id_chantier;

    PERFORM ajouter_utilisation(f_id_groupe, f_id_utilisateur, v_id_chantier);

END;
$$ LANGUAGE plpgsql;


-- Ajouter une position géographique

CREATE OR REPLACE FUNCTION ajouter_position_geographique(
    p_id_feu INT,
    p_latitude DECIMAL(9,6),
    p_longitude DECIMAL(9,6),
    p_position_physique DECIMAL(5,2)
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO position_geographique (id_feu, latitude, longitude, position_physique, date_enregistrement_position)
    VALUES (p_id_feu, p_latitude, p_longitude, p_position_physique, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un nouvel état de la batterie

CREATE OR REPLACE FUNCTION ajouter_etat_batterie(
    p_id_feu INT,
    p_etat_batterie TYPE_ETAT_BATTERIE,
    p_autonomie CHAR(4)
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO etat_batterie (id_feu, type_etat_batterie, autonomie_restante, date_enregistrement_batterie)
    VALUES (p_id_feu, p_etat_batterie, p_autonomie, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;



-- Ajouter un nouvel état des optiques

CREATE OR REPLACE FUNCTION ajouter_etat_optiques(
    p_id_feu INT,
    p_bas TYPE_ETAT_OPTIQUES,
    p_haut TYPE_ETAT_OPTIQUES,
    p_centre TYPE_ETAT_OPTIQUES,
    p_affichage_segments VARCHAR(3)
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO etat_optiques (id_feu, etat_bas, etat_haut, etat_centre, etat_affichage_7_segments, date_enregistrement_optiques)
    VALUES (p_id_feu, p_bas, p_haut, p_centre, p_affichage_segments, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un nouveau cycle

CREATE OR REPLACE FUNCTION ajouter_cycle(
    p_id_feu INT,
    p_num_cycle CHAR(2),
    p_table_cycle CHAR(2)
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO cycle (id_feu, num_cycle, num_table_cycle, date_enregistrement_cycle)
    VALUES (p_id_feu, p_num_cycle, p_table_cycle, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un nouveau mode de fonctionnement 

CREATE OR REPLACE FUNCTION ajouter_fonctionnement(
    p_id_feu INT,
    p_mode_fonctionnement TYPE_FONCTIONNEMENT
)
RETURNS VOID AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO fonctionnement (id_feu, mode_fonctionnement, date_enregistrement_fonctionnement)
    VALUES (p_id_feu, p_mode_fonctionnement, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un nouvel etat radio

CREATE OR REPLACE FUNCTION ajouter_radio(
    p_id_feu INT,
    p_etat_radio VARCHAR(3)
)
RETURNS VOID AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO radio(id_feu, type_etat_radio, date_enregistrement_radio)
    VALUES (p_id_feu, p_etat_radio, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un nouvel etat bluetooth

CREATE OR REPLACE FUNCTION ajouter_bluetooth(
    p_id_feu INT,
    p_etat_bluetooth VARCHAR(3)
)
RETURNS VOID AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO bluetooth(id_feu, type_etat_bluetooth, date_enregistrement_bluetooth)
    VALUES (p_id_feu, p_etat_bluetooth, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;


-- Ajouter un nouvel etat cpu

CREATE OR REPLACE FUNCTION ajouter_temp_cpu(
    p_id_feu INT,
    p_temperature VARCHAR(5)
)
RETURNS VOID AS $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM feu WHERE id_feu = p_id_feu) THEN
        RAISE EXCEPTION 'Le feu spécifié n''existe pas.';
    END IF;

    INSERT INTO cpu_temp(id_feu, temperature_cpu, date_enregistrement_temp)
    VALUES (p_id_feu, p_temperature, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;
