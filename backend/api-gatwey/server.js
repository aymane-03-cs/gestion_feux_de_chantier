/*
    Ce serveur joue le rôle d'un point d'entrée pour toutes les requêtes HTTP 
    provenant des actions de l'utilisateur. Les requêtes seront redirigées vers 
    les services correspondants.
*/

require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Autorise les requêtes du front-end Angular




//  Middleware de vérification du token avant la redirection
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Accès interdit" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token invalide" });
        req.user = decoded;
        next();
    });
};




//  Proxy vers le service d'authentification avec `onProxyReq`
app.post("/api/auth", createProxyMiddleware({
    target: "http://auth_service:5001",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/login" },
    logLevel: "debug",
}));





//  Proxy pour le service Feu avec vérification du token
app.use("/api/feux", verifyToken, createProxyMiddleware({
    target: process.env.FEU_SERVICE_URL || "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: { "^/api/feux": "" }
}));



// Proxy pour le service users avec vérification du token
app.use("/api/users", verifyToken, createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL || "http://localhost:3001", // URL du service Feu
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" } // Optionnel : réécrit le chemin si le service Feu ne s'attend pas au préfixe
}));

// Proxy pour le service alerts 
app.use("/api/alerts", verifyToken, createProxyMiddleware({
    target: process.env.ALERTS_SERVICE_URL || "http://localhost:3003", // URL du service alert
    changeOrigin: true,
    pathRewrite: { "^/api/alerts": "" } // Optionnel : réécrit le chemin si le service alert ne s'attend pas au préfixe
}));

//  Lancer l'API Gateway
app.listen(PORT, () => {
    console.log(`🚀 API Gateway démarré sur http://localhost:${PORT}`);
});
