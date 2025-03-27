SELECT 
    f.id_feu,
    f.num_serie,
    f.pays_utilisation,
    f.tension_service,
    f.tension_alimentation,
    
    -- Loueur
    l.nom_societe AS loueur_nom,
    l.email_loueur,
    l.tel_loueur,

    -- Groupe
    g.id_groupe,

    -- Position géographique
    p.latitude,
    p.longitude,
    p.position_physique,
    p.date_enregistrement_position,

    -- Fonctionnement
    fn.mode_fonctionnement,
    fn.date_enregistrement_fonctionnement,

    -- Cycle
    c.num_cycle,
    c.num_table_cycle,
    c.date_enregistrement_cycle,

    -- État optiques
    eo.etat_bas,
    eo.etat_haut,
    eo.etat_centre,
    eo.etat_affichage_7_segments,
    eo.date_enregistrement_optiques,

    -- État batterie
    eb.type_etat_batterie,
    eb.autonomie_restante,
    eb.date_enregistrement_batterie

FROM feu f
LEFT JOIN loueur l ON f.id_loueur = l.id_loueur
LEFT JOIN groupe g ON f.id_groupe = g.id_groupe
LEFT JOIN position_geographique p ON f.id_feu = p.id_feu
LEFT JOIN fonctionnement fn ON f.id_feu = fn.id_feu
LEFT JOIN cycle c ON f.id_feu = c.id_feu
LEFT JOIN etat_optiques eo ON f.id_feu = eo.id_feu
LEFT JOIN etat_batterie eb ON f.id_feu = eb.id_feu

WHERE f.id_feu = $1;