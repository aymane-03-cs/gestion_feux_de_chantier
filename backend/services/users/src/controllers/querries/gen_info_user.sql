SELECT 
    u.id_utilisateur,
    u.nom,
    u.email_utilisateur,
    u.tel_utilisateur,

    -- Utilisation
    ut.id_utilisation,
    ut.id_groupe,
    ut.id_chantier,

    -- Chantier
    ch.ville AS chantier_ville,

    -- Groupe
    g.id_groupe,

    -- Feu (si nécessaire)
    f.id_feu,
    f.num_serie,
    f.pays_utilisation,
    f.tension_service,
    f.tension_alimentation,

    -- Position géographique (si nécessaire)
    p.latitude,
    p.longitude,
    p.position_physique,
    p.date_enregistrement_position,

    -- Fonctionnement (si nécessaire)
    fn.mode_fonctionnement,
    fn.date_enregistrement_fonctionnement,

    -- Cycle (si nécessaire)
    c.num_cycle,
    c.num_table_cycle,
    c.date_enregistrement_cycle,

    -- État optiques (si nécessaire)
    eo.etat_bas,
    eo.etat_haut,
    eo.etat_centre,
    eo.etat_affichage_7_segments,
    eo.date_enregistrement_optiques,

    -- État batterie (si nécessaire)
    eb.type_etat_batterie,
    eb.autonomie_restante,
    eb.date_enregistrement_batterie

FROM utilisateur u
LEFT JOIN utilisation ut ON u.id_utilisateur = ut.id_utilisateur
LEFT JOIN chantier ch ON ut.id_chantier = ch.id_chantier
LEFT JOIN groupe g ON ut.id_groupe = g.id_groupe
LEFT JOIN feu f ON g.id_groupe = f.id_groupe
LEFT JOIN position_geographique p ON f.id_feu = p.id_feu
LEFT JOIN fonctionnement fn ON f.id_feu = fn.id_feu
LEFT JOIN cycle c ON f.id_feu = c.id_feu
LEFT JOIN etat_optiques eo ON f.id_feu = eo.id_feu
LEFT JOIN etat_batterie eb ON f.id_feu = eb.id_feu

WHERE u.id_utilisateur = $1;