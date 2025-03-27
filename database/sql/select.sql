-- ============================================================
-- Séléctionner des données dans la base                
-- ============================================================

-- ============================================================
--   Requêtes de consultation
-- ============================================================

-- Informations sur les loueurs

SELECT * FROM loueur; 

-- Informations sur les feux 

SELECT * FROM feu; 

-- Informations sur les chantiers 

SELECT * FROM chantier; 

-- Informations sur les utilisateurs

SELECT * FROM utilisateur;


-- ===========================================================
--   Drop existing functions
-- ===========================================================

DROP FUNCTION IF EXISTS obtenir_etats_batterie;
DROP FUNCTION IF EXISTS obtenir_etats_optiques;
DROP FUNCTION IF EXISTS liste_etats_batterie_periode;
DROP FUNCTION IF EXISTS liste_cycles_periode;
DROP FUNCTION IF EXISTS liste_etats_optiques_periode;
DROP FUNCTION IF EXISTS liste_fonctionnements_periode;
DROP FUNCTION IF EXISTS liste_positions_geo_periode;
DROP FUNCTION IF EXISTS liste_positions_phy_periode;
DROP FUNCTION IF EXISTS feux_appartenant_loueur;
DROP FUNCTION IF EXISTS feux_geres_utilisateur;
DROP FUNCTION IF EXISTS feux_etat_affichage_segments;
DROP FUNCTION IF EXISTS feux_en_mode_fonctionnement;
DROP FUNCTION IF EXISTS feux_inactifs;
DROP FUNCTION IF EXISTS feux_appartenant_chantier;
DROP FUNCTION IF EXISTS feux_etat_optiques;
DROP FUNCTION IF EXISTS position_actuelle_feu;
DROP FUNCTION IF EXISTS liste_etats_radio_periode;
DROP FUNCTION IF EXISTS liste_etats_bluetooth_periode;
DROP FUNCTION IF EXISTS liste_etats_cpu_periode;
DROP FUNCTION IF EXISTS obtenir_etats_radio;
DROP FUNCTION IF EXISTS obtenir_etats_bluetooth;
DROP FUNCTION IF EXISTS obtenir_etats_cpu;
DROP FUNCTION IF EXISTS feux_position_phy_seuil;


-- ===========================================================
--   Fonctions
-- ===========================================================


-- Liste des états de batterie pour une date données sur tous les feux d'un même chantier

CREATE OR REPLACE FUNCTION obtenir_etats_batterie(p_date TIMESTAMP, p_id_chantier INT)
RETURNS TABLE (
    id_feu INT,
    type_etat_batterie TYPE_ETAT_BATTERIE,
    date_enregistrement_batterie TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (eb.id_feu) 
        eb.id_feu, 
        eb.type_etat_batterie, 
        eb.date_enregistrement_batterie
    FROM etat_batterie eb
    JOIN feu f ON eb.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    WHERE eb.date_enregistrement_batterie <= p_date
      AND u.id_chantier = p_id_chantier
    ORDER BY eb.id_feu, eb.date_enregistrement_batterie DESC;
END;
$$ LANGUAGE plpgsql;



-- Donne états des optiques pour une date données sur tous les feux d'un même chantier

CREATE OR REPLACE FUNCTION obtenir_etats_optiques(p_date TIMESTAMP, p_id_chantier INT)
RETURNS TABLE (
    id_feu INT,
    etat_bas TYPE_ETAT_OPTIQUES,
    etat_haut TYPE_ETAT_OPTIQUES,
    etat_centre TYPE_ETAT_OPTIQUES,
    etat_affichage_7_segments VARCHAR(3),
    date_enregistrement_optiques TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eo.id_feu, 
        eo.etat_bas, 
        eo.etat_haut, 
        eo.etat_centre, 
        eo.etat_affichage_7_segments, 
        eo.date_enregistrement_optiques
    FROM etat_optiques eo
    JOIN feu f ON eo.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON g.id_groupe = u.id_groupe
    WHERE eo.date_enregistrement_optiques <= p_date
      AND u.id_chantier = p_id_chantier
    AND eo.date_enregistrement_optiques = (
        SELECT MAX(date_enregistrement_optiques)
        FROM etat_optiques
        WHERE id_feu = eo.id_feu 
          AND date_enregistrement_optiques <= p_date
    );
END;
$$ LANGUAGE plpgsql;



-- Liste des états des batteries d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_etats_batterie_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    type_etat_batterie TYPE_ETAT_BATTERIE,
    autonomie_restante CHAR(4),
    date_enregistrement_batterie TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eb.id_feu, 
        eb.type_etat_batterie, 
        eb.autonomie_restante, 
        eb.date_enregistrement_batterie
    FROM etat_batterie eb
    WHERE eb.id_feu = p_id_feu
      AND eb.date_enregistrement_batterie BETWEEN p_date_debut AND p_date_fin
    ORDER BY eb.date_enregistrement_batterie;
END;
$$ LANGUAGE plpgsql;



-- Liste des états des optiques d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION obtenir_etats_optiques(p_date TIMESTAMP, p_id_chantier INT)
RETURNS TABLE (
    id_feu INT,
    etat_bas TYPE_ETAT_OPTIQUES,
    etat_haut TYPE_ETAT_OPTIQUES,
    etat_centre TYPE_ETAT_OPTIQUES,
    etat_affichage_7_segments VARCHAR(3),
    date_enregistrement_optiques TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eo.id_feu, 
        eo.etat_bas, 
        eo.etat_haut, 
        eo.etat_centre, 
        eo.etat_affichage_7_segments, 
        eo.date_enregistrement_optiques
    FROM etat_optiques eo
    JOIN feu f ON eo.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON g.id_groupe = u.id_groupe
    WHERE eo.date_enregistrement_optiques <= p_date
      AND u.id_chantier = p_id_chantier
    AND eo.date_enregistrement_optiques = (
        SELECT MAX(date_enregistrement_optiques)
        FROM etat_optiques
        WHERE id_feu = eo.id_feu 
          AND date_enregistrement_optiques <= p_date
    );
END;
$$ LANGUAGE plpgsql;



-- Liste des cycles d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_cycles_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    num_cycle CHAR(2),
    num_table_cycle CHAR(2),
    date_enregistrement_cycle TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id_feu, c.num_cycle, c.num_table_cycle, c.date_enregistrement_cycle
    FROM cycle c
    WHERE c.id_feu = p_id_feu
    AND c.date_enregistrement_cycle BETWEEN p_date_debut AND p_date_fin
    ORDER BY c.date_enregistrement_cycle;
END;
$$ LANGUAGE plpgsql;



-- Liste des modes de fonctionnement d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_fonctionnements_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    mode_fonctionnement TYPE_FONCTIONNEMENT,
    date_enregistrement_fonctionnement TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_feu, f.mode_fonctionnement, f.date_enregistrement_fonctionnement
    FROM fonctionnement f
    WHERE f.id_feu = p_id_feu
    AND f.date_enregistrement_fonctionnement BETWEEN p_date_debut AND p_date_fin
    ORDER BY f.date_enregistrement_fonctionnement;
END;
$$ LANGUAGE plpgsql;



-- Liste des positions géographiques d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_positions_geo_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    position_physique DECIMAL(5,2),
    date_enregistrement_position TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT pg.id_feu, pg.latitude, pg.longitude, pg.position_physique, pg.date_enregistrement_position
    FROM position_geographique pg
    WHERE pg.id_feu = p_id_feu
    AND pg.date_enregistrement_position BETWEEN p_date_debut AND p_date_fin
    ORDER BY pg.date_enregistrement_position;
END;
$$ LANGUAGE plpgsql;


 -- Liste états des optiques d'un feu une période donnée

CREATE OR REPLACE FUNCTION liste_etats_optiques_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    etat_bas TYPE_ETAT_OPTIQUES,
    etat_haut TYPE_ETAT_OPTIQUES,
    etat_centre TYPE_ETAT_OPTIQUES,
    etat_affichage_7_segments VARCHAR(3),
    date_enregistrement_optiques TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eo.id_feu, 
        eo.etat_bas, 
        eo.etat_haut, 
        eo.etat_centre, 
        eo.etat_affichage_7_segments, 
        eo.date_enregistrement_optiques
    FROM etat_optiques eo
    WHERE eo.id_feu = p_id_feu
      AND eo.date_enregistrement_optiques BETWEEN p_date_debut AND p_date_fin
    ORDER BY eo.date_enregistrement_optiques;
END;
$$ LANGUAGE plpgsql;


-- Liste des positions physiques d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_positions_phy_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    position_physique DECIMAL(5,2),
    date_enregistrement_position TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT pg.id_feu, pg.position_physique, pg.date_enregistrement_position
    FROM position_geographique pg
    WHERE pg.id_feu = p_id_feu
    AND pg.date_enregistrement_position BETWEEN p_date_debut AND p_date_fin
    ORDER BY pg.date_enregistrement_position;
END;
$$ LANGUAGE plpgsql;


-- Donne la liste des chantiers avec les feux appartenant à un loueur

CREATE OR REPLACE FUNCTION feux_appartenant_loueur(p_id_loueur INT)
RETURNS TABLE (
    id_feu INT,
    id_chantier INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_feu, c.id_chantier
    FROM feu f
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    JOIN chantier c ON u.id_chantier = c.id_chantier
    WHERE f.id_loueur = p_id_loueur
    GROUP BY f.id_feu, c.id_chantier;
END;
$$ LANGUAGE plpgsql;


-- Liste des chantiers avec les feux gérés par un utilisateur

CREATE OR REPLACE FUNCTION feux_geres_utilisateur(p_id_util INT)
RETURNS TABLE (
    id_feu INT,
    id_chantier INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_feu, u.id_chantier
    FROM feu f
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    WHERE u.id_utilisateur = p_id_util;
END;
$$ LANGUAGE plpgsql;


-- Liste feux d'un chantier

CREATE OR REPLACE FUNCTION feux_appartenant_chantier(p_id_chantier INT)
RETURNS TABLE (
    id_feu INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_feu
    FROM feu f
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    WHERE u.id_chantier = p_id_chantier;
END;
$$ LANGUAGE plpgsql;


-- Liste des feux ayant une batterie en dessous (ou égale à) d'un certain seuil pour la date la plus récente

CREATE OR REPLACE FUNCTION feux_batterie_sous_seuil(seuil TYPE_ETAT_BATTERIE)
RETURNS TABLE (
    id_feu INT, 
    type_etat_batterie TYPE_ETAT_BATTERIE, 
    date_enregistrement_batterie TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT eb.id_feu, eb.type_etat_batterie, eb.date_enregistrement_batterie
    FROM (
        SELECT DISTINCT ON (eb2.id_feu) eb2.id_feu, eb2.type_etat_batterie, eb2.date_enregistrement_batterie
        FROM etat_batterie eb2
        ORDER BY eb2.id_feu, eb2.date_enregistrement_batterie DESC
    ) eb
    WHERE eb.type_etat_batterie::TEXT <= seuil::TEXT
    ORDER BY eb.type_etat_batterie;
END ;
$$ LANGUAGE plpgsql;



-- Liste des feux ayant des optiques dans un certain état pour la date la plus récente

CREATE OR REPLACE FUNCTION feux_etat_optiques(etat TYPE_ETAT_OPTIQUES)
RETURNS TABLE (
    id_feu INT,
    etat_bas TYPE_ETAT_OPTIQUES,
    etat_haut TYPE_ETAT_OPTIQUES,
    etat_centre TYPE_ETAT_OPTIQUES,
    date_enregistrement_optiques TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT eo.id_feu, 
           eo.etat_bas, 
           eo.etat_haut, 
           eo.etat_centre, 
           eo.etat_affichage_7_segments, 
           eo.date_enregistrement_optiques
    FROM etat_optiques eo
    WHERE eo.date_enregistrement_optiques = (
        SELECT MAX(eo2.date_enregistrement_optiques)
        FROM etat_optiques eo2
        WHERE eo2.id_feu = eo.id_feu
    )
    AND (
        eo.etat_bas = etat OR 
        eo.etat_haut = etat OR 
        eo.etat_centre = etat
    );
END;
$$ LANGUAGE plpgsql;


-- Liste des feux ayant état d'affichage des segments KO

CREATE OR REPLACE FUNCTION feux_etat_affichage_segments()
RETURNS TABLE (
    id_feu INT,
    etat_affichage_segments VARCHAR(3),
    date_enregistrement_optiques TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT eo.id_feu, 
           eo.etat_affichage_7_segments, 
           eo.date_enregistrement_optiques
    FROM etat_optiques eo
    WHERE eo.date_enregistrement_optiques = (
        SELECT MAX(eo2.date_enregistrement_optiques)
        FROM etat_optiques eo2
        WHERE eo2.id_feu = eo.id_feu
    )
    AND (
        eo.etat_affichage_7_segments = 'KO'
    );
END;
$$ LANGUAGE plpgsql;


-- Liste des feux en mode de fonctionnement 'alerte'

CREATE OR REPLACE FUNCTION feux_en_mode_fonctionnement(p_mode_fonctionnement TYPE_FONCTIONNEMENT)
RETURNS TABLE (
    id_feu INT, 
    mode_fonctionnement TYPE_FONCTIONNEMENT, 
    date_enregistrement_fonctionnement TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_feu, f.mode_fonctionnement, f.date_enregistrement_fonctionnement
    FROM fonctionnement f
    WHERE f.date_enregistrement_fonctionnement = (
        SELECT MAX(f2.date_enregistrement_fonctionnement)
        FROM fonctionnement f2
        WHERE f2.id_feu = f.id_feu
    )
    AND f.mode_fonctionnement = p_mode_fonctionnement;
END;
$$ LANGUAGE plpgsql;



-- Liste des feux inactifs, i.e. ceux qui n'ont pas une une maj de leur état depuis un certain nombre de jours

CREATE OR REPLACE FUNCTION feux_inactifs(depuis_minutes INT)
RETURNS TABLE (id_feu INT, dernier_enregistrement TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id_feu, MAX(e.date_enregistrement) AS dernier_enregistrement
    FROM feu f
    LEFT JOIN (
        SELECT eb.id_feu, eb.date_enregistrement_batterie AS date_enregistrement
        FROM etat_batterie eb
        UNION ALL
        SELECT eo.id_feu, eo.date_enregistrement_optiques AS date_enregistrement
        FROM etat_optiques eo
        UNION ALL
        SELECT fct.id_feu, fct.date_enregistrement_fonctionnement AS date_enregistrement
        FROM fonctionnement fct
    ) e ON f.id_feu = e.id_feu
    GROUP BY f.id_feu
    HAVING MAX(e.date_enregistrement) < NOW() - INTERVAL '1 minute' * depuis_minutes;
END;
$$ LANGUAGE plpgsql;



-- Position géographique actuelle d'un feu (enregistrement le plus récent)

CREATE OR REPLACE FUNCTION position_actuelle_feu(id_feu_param INT)
RETURNS TABLE (
    id_feu INT, 
    latitude DECIMAL(9,6), 
    longitude DECIMAL(9,6), 
    position_physique DECIMAL(5,2), 
    date_enregistrement_position TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id_feu, p.latitude, p.longitude, p.position_physique, p.date_enregistrement_position
    FROM position_geographique p
    WHERE p.id_feu = id_feu_param
    ORDER BY p.date_enregistrement_position DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;


-- Liste des états de la radio d'un feu d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_etats_radio_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    etat_radio VARCHAR(3),
    date_enregistrement_radio TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT er.id_feu, er.type_etat_radio, er.date_enregistrement_radio
    FROM radio er
    WHERE er.id_feu = p_id_feu
    AND er.date_enregistrement_radio BETWEEN p_date_debut AND p_date_fin
    ORDER BY er.date_enregistrement_radio;
END;
$$ LANGUAGE plpgsql;


-- Liste des états du bluetooth d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_etats_bluetooth_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    etat_bluetooth VARCHAR(3),
    date_enregistrement_bluetooth TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT eb.id_feu, eb.type_etat_bluetooth, eb.date_enregistrement_bluetooth
    FROM bluetooth eb
    WHERE eb.id_feu = p_id_feu
    AND eb.date_enregistrement_bluetooth BETWEEN p_date_debut AND p_date_fin
    ORDER BY eb.date_enregistrement_bluetooth;
END;
$$ LANGUAGE plpgsql;

-- Liste des états du cpu d'un feu sur une période donnée

CREATE OR REPLACE FUNCTION liste_etats_cpu_periode(p_id_feu INT, p_date_debut TIMESTAMP, p_date_fin TIMESTAMP)
RETURNS TABLE (
    id_feu INT,
    temp_cpu VARCHAR(5),
    date_enregistrement_temp TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT tc.id_feu, tc.temperature_cpu, tc.date_enregistrement_temp
    FROM cpu_temp tc
    WHERE tc.id_feu = p_id_feu
    AND tc.date_enregistrement_temp BETWEEN p_date_debut AND p_date_fin
    ORDER BY tc.date_enregistrement_temp;
END;
$$ LANGUAGE plpgsql;



-- Liste des états de radio pour une date données sur tous les feux d'un même chantier

CREATE OR REPLACE FUNCTION obtenir_etats_radio(p_date TIMESTAMP, p_id_chantier INT)
RETURNS TABLE (
    id_feu INT,
    type_etat_radio VARCHAR(3),
    date_enregistrement_radio TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (er.id_feu) 
        er.id_feu, 
        er.type_etat_radio, 
        er.date_enregistrement_radio
    FROM radio er
    JOIN feu f ON er.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    WHERE er.date_enregistrement_radio <= p_date
      AND u.id_chantier = p_id_chantier
    ORDER BY er.id_feu, er.date_enregistrement_radio DESC;
END;
$$ LANGUAGE plpgsql;


-- Liste des états du bluetooth pour une date données sur tous les feux d'un même chantier

CREATE OR REPLACE FUNCTION obtenir_etats_bluetooth(p_date TIMESTAMP, p_id_chantier INT)
RETURNS TABLE (
    id_feu INT,
    type_etat_bluetooth VARCHAR(3),
    date_enregistrement_bluetooth TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (eb.id_feu) 
        eb.id_feu, 
        eb.type_etat_bluetooth, 
        eb.date_enregistrement_bluetooth
    FROM bluetooth eb
    JOIN feu f ON eb.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    WHERE eb.date_enregistrement_bluetooth <= p_date
      AND u.id_chantier = p_id_chantier
    ORDER BY eb.id_feu, eb.date_enregistrement_bluetooth DESC;
END;
$$ LANGUAGE plpgsql;


-- Liste des états du cpu pour une date données sur tous les feux d'un même chantier

CREATE OR REPLACE FUNCTION obtenir_etats_cpu(p_date TIMESTAMP, p_id_chantier INT)
RETURNS TABLE (
    id_feu INT,
    temperature_cpu  VARCHAR(5),
    date_enregistrement_temp TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (tc.id_feu) 
        tc.id_feu, 
        tc.temperature_cpu, 
        tc.date_enregistrement_temp
    FROM cpu_temp tc
    JOIN feu f ON tc.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON u.id_groupe = g.id_groupe
    WHERE tc.date_enregistrement_temp <= p_date
      AND u.id_chantier = p_id_chantier
    ORDER BY tc.id_feu, tc.date_enregistrement_temp DESC;
END;
$$ LANGUAGE plpgsql;


-- Liste des feux d'un chantier dont la position physique est différente d'une valeur d'angle donnée

CREATE OR REPLACE FUNCTION feux_position_phy_seuil(p_date TIMESTAMP, p_id_chantier INT, p_angle DECIMAL)
RETURNS TABLE (
    id_feu INT,
    position_physique DECIMAL,
    date_enregistrement_position TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.id_feu, 
        ep.position_physique, 
        ep.date_enregistrement_position
    FROM etat_position ep
    JOIN feu f ON ep.id_feu = f.id_feu
    JOIN groupe g ON f.id_groupe = g.id_groupe
    JOIN utilisation u ON g.id_groupe = u.id_groupe
    WHERE ep.date_enregistrement_position <= p_date
      AND u.id_chantier = p_id_chantier
      AND ep.position_physique <> p_angle
      AND ep.date_enregistrement_position = (
          SELECT MAX(ep2.date_enregistrement_position)
          FROM etat_position ep2
          WHERE ep2.id_feu = ep.id_feu
            AND ep2.date_enregistrement_position <= p_date
      );
END;
$$ LANGUAGE plpgsql;


-- ===========================================================
--   Tests functions
-- ===========================================================



-- SELECT * FROM obtenir_etats_batterie('2025-02-22 19:21:30.284102', 1); 


-- SELECT * FROM liste_etats_batterie_periode(1, '2025-02-22 19:21:30', '2025-02-22 21:00:00');


-- SELECT * FROM liste_fonctionnements_periode(1, '2025-02-23 12:00:00', '2025-02-23 15:30:00');


-- SELECT * FROM liste_positions_geo_periode(1, '2025-02-23 12:00:00', '2025-02-23 15:30:00');

-- SELECT * FROM liste_positions_phy_periode(1, '2025-02-23 12:00:00', '2025-02-23 15:30:00');

-- SELECT * FROM liste_cycle_periode(1, '2025-02-23 12:00:00', '2025-02-23 16:30:00');

-- SELECT * FROM liste_etats_optiques_periode(1, '2025-02-23 12:00:00', '2025-02-23 16:30:00');

-- SELECT * FROM feux_appartenant_loueur(1);

-- SELECT * FROM feux_geres_utilisateur(1);

-- SELECT * FROM feux_appartenant_chantier(1);

-- SELECT * FROM feux_batterie_sous_seuil('Plein');

-- SELECT * FROM feux_etat_optiques('Opérationnelle');

-- SELECT * FROM feux_etat_affichage_segments();

-- SELECT * FROM feux_en_mode_fonctionnement('Auto');

-- SELECT * FROM feux_inactifs(1);

-- SELECT * FROM position_actuelle_feu(1);


