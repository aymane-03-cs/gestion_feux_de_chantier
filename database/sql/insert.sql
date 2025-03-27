-- ============================================================
--   Insérer des données dans les tables
-- ============================================================


INSERT INTO loueur (nom_societe, email_loueur, tel_loueur)
VALUES 
    ('Societe A', 'contact@societea.com', '0123456789'),
    ('Societe B', 'contact@societeb.com', '0987654321');


INSERT INTO groupe DEFAULT VALUES;
INSERT INTO groupe DEFAULT VALUES;



INSERT INTO feu (num_serie, pays_utilisation, tension_service, tension_alimentation, id_loueur, id_groupe)
VALUES 
    ('ABC123456', 'FR', '230', '12V', 1, 1),
    ('DEF789012', 'FR', '230', '12V', 1, 1),
    ('GHI345678', 'FR', '230', '12V', 2, 2),
    ('JKL901234', 'FR', '230', '12V', 2, 2);



INSERT INTO position_geographique (id_feu, latitude, longitude, position_physique)
VALUES 
    (1, 48.8566, 2.3522, 45.00),
    (2, 48.98, 2.33, 180.00),   
    (3, 43.7102, 7.2620, 180.00),
    (4, 43.7102, 7.2620, 90.00); 


INSERT INTO fonctionnement (id_feu, mode_fonctionnement)
VALUES 
    (1, 'Auto'),
    (2, 'Clignotant'),
    (3, 'Auto'),
    (4, 'Clignotant');


INSERT INTO cycle (id_feu, num_cycle, num_table_cycle)
VALUES 
    (1, '01', '01'),
    (2, '02', '02'),
    (3, '01', '01'),
    (4, '02', '02');


INSERT INTO etat_optiques (id_feu, etat_bas, etat_haut, etat_centre, etat_affichage_7_segments)
VALUES 
    (1, 'Opérationnelle', 'Opérationnelle', 'Opérationnelle', 'OK'),
    (2, 'Défaut', 'Opérationnelle', 'Opérationnelle', 'KO'),
    (3, 'Opérationnelle', 'Opérationnelle', 'Opérationnelle', 'OK'),
    (4, 'Opérationnelle', 'Opérationnelle', 'Opérationnelle', 'OK');


INSERT INTO etat_batterie (id_feu, type_etat_batterie, autonomie_restante)
VALUES 
    (1, 'Plein', '300H'),
    (2, '50%', '150H'),
    (3, 'Plein', '100H'),
    (4, '25%', '075H');


INSERT INTO radio (id_feu, type_etat_radio) 
VALUES
    (1, 'OK'),
    (2, 'NOK'),
    (3, 'OK'),
    (4, 'OK');


INSERT INTO bluetooth (id_feu, type_etat_bluetooth) 
VALUES
    (1, 'OK'),
    (2, 'NOK'),
    (3, 'OK'),
    (4, 'NOK');


INSERT INTO cpu_temp (id_feu, temperature_cpu) 
VALUES
    (1, '45.2'),
    (2, '50.1'),
    (3, '47.8'),
    (4, '49.3');


INSERT INTO chantier (ville) 
VALUES 
    ('Lyon'),
    ('Marseille');


INSERT INTO utilisateur (nom, email_utilisateur, tel_utilisateur)
VALUES 
    ('user1', 'use1@example.com', '0612345678'),
    ('user2', 'use2@example.com', '0623456789');


INSERT INTO utilisation (id_groupe, id_utilisateur, id_chantier)
VALUES 
    (1, 1, 1),
    (2, 2, 2);


