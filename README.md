# 🚀 Fire Alert & Management System - Angular Frontend 🔥

Ce projet est une **application web de gestion des alertes incendie** développée avec **Angular** pour le frontend et **Node.js/Express** pour le backend. Il inclut des fonctionnalités telles que **l'authentification JWT, la gestion des alertes, l'analyse des incidents et l'administration des utilisateurs**.

---

## 📌 Architecture du Projet

L'application repose sur **deux services principaux** :
1. **Backend (`Node.js/Express`)** : API REST pour gérer les alertes et l'authentification.
2. **Frontend (`Angular`)** : Interface utilisateur permettant d'afficher les alertes et de gérer les utilisateurs.

Les services sont **conteneurisés** et orchestrés avec **Docker Compose**.

---

## 🏗️ Déploiement avec Docker

Le projet est configuré avec `docker-compose.yml` pour simplifier son exécution. 

### Pour Démarrer les services avec Docker :
docker-compose up --build



### Recompiler et relancer les services : 
docker-compose down -v && docker-compose up --build



### Arrêter les services : 
docker-compose down


### Lister les conteneurs en cours d’exécution : 
docker ps
