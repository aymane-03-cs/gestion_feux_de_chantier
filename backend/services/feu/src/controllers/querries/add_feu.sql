WITH inserted_feu AS (
    INSERT INTO feu (num_serie, pays_utilisation, tension_service, tension_alimentation)
    VALUES ('SN123456', 'FR', '12V', '220V')  -- Adapter ces valeurs si besoin
    RETURNING id_feu
)
-- ✅ Ajouter la Position Géographique
INSERT INTO position_geographique (id_feu, latitude, longitude, position_physique)
VALUES (
    (SELECT id_feu FROM inserted_feu),
    44.84, 
    -0.57, 
    0  -- Adapter la valeur correcte pour "Position physique"
);

-- ✅ Ajouter le Mode de Fonctionnement
INSERT INTO fonctionnement (id_feu, mode_fonctionnement)
VALUES (
    (SELECT id_feu FROM inserted_feu),
    'Auto'
);

-- ✅ Ajouter l'État des Optiques (bas)
INSERT INTO etat_optiques (id_feu, etat_bas, etat_haut, etat_centre, etat_affichage_7_segments)
VALUES (
    (SELECT id_feu FROM inserted_feu),
    'Opérationnelle', 'Opérationnelle', 'Opérationnelle', 'ON'  -- Adapter selon ton système
);

-- ✅ Ajouter l'État des Batteries
INSERT INTO etat_batterie (id_feu, type_etat_batterie, autonomie_restante)
VALUES (
    (SELECT id_feu FROM inserted_feu),
    'Plein',
    '100H'  -- Adapter selon l'autonomie réelle
);
