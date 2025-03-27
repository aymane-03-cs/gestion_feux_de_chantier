SELECT 
    f.id_feu,
    f.num_serie,
    f.pays_utilisation,
    f.tension_service,
    f.tension_alimentation,
    f.id_groupe,
    NOW() AS date_derniere_maj,

    -- Positions sous forme de JSON
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_position', p.id_position,
                'latitude', p.latitude,
                'longitude', p.longitude,
                'position_physique', p.position_physique,
                'date_enregistrement', p.date_enregistrement_position
            )
        ) FILTER (WHERE p.id_position IS NOT NULL), '[]'
    ) AS positions,

    -- États optiques sous forme de JSON
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_etat_optique', eo.id_etat_optique,
                'etat_bas', eo.etat_bas,
                'etat_haut', eo.etat_haut,
                'etat_centre', eo.etat_centre,
                'etat_affichage_7_segments', eo.etat_affichage_7_segments,
                'date_enregistrement_optiques', eo.date_enregistrement_optiques
            )
        ) FILTER (WHERE eo.id_etat_optique IS NOT NULL), '[]'
    ) AS etats_optiques,

    -- États batteries sous forme de JSON
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_etat_batterie', eb.id_etat_batterie,
                'type_etat_batterie', eb.type_etat_batterie,
                'autonomie_restante', eb.autonomie_restante,
                'date_enregistrement_batterie', eb.date_enregistrement_batterie
            )
        ) FILTER (WHERE eb.id_etat_batterie IS NOT NULL), '[]'
    ) AS etats_batteries,

    -- Fonctionnements sous forme de JSON
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_fonctionnement', fn.id_fonctionnement,
                'mode_fonctionnement', fn.mode_fonctionnement,
                'date_enregistrement_fonctionnement', fn.date_enregistrement_fonctionnement
            )
        ) FILTER (WHERE fn.id_fonctionnement IS NOT NULL), '[]'
    ) AS fonctionnements,

    -- Cycles sous forme de JSON
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_cycle', c.id_cycle,
                'num_cycle', c.num_cycle,
                'num_table_cycle', c.num_table_cycle,
                'date_enregistrement_cycle', c.date_enregistrement_cycle
            )
        ) FILTER (WHERE c.id_cycle IS NOT NULL), '[]'
    ) AS cycles

FROM feu f
LEFT JOIN position_geographique p ON f.id_feu = p.id_feu
LEFT JOIN etat_optiques eo ON f.id_feu = eo.id_feu
LEFT JOIN etat_batterie eb ON f.id_feu = eb.id_feu
LEFT JOIN fonctionnement fn ON f.id_feu = fn.id_feu
LEFT JOIN cycle c ON f.id_feu = c.id_feu
GROUP BY f.id_feu
ORDER BY f.id_feu;
