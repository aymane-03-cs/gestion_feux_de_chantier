
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());




const USERS_FILE_PATH = __dirname + "/users.json"

const users = JSON.parse(fs.readFileSync(USERS_FILE_PATH, "utf-8"));





// Route de connexion (génère un JWT)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ error: "Nom d'utilisateur incorrect" });
    }

    if (user.password !== password) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token généré:", jwt.decode(token));
    res.json({ token });
});


//  Middleware pour vérifier le JWT
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Accès interdit" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token invalide" });
        req.user = decoded;
        next();
    });
}


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth-Service sur http://localhost:${PORT}`));
