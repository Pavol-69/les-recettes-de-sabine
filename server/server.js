const express = require("express");
const app = express();
const cors = require("cors");

// Middlewear
app.use(express.json()); //req.body
app.use(cors());

// Routes
// Connexion + Inscription
app.use("/auth", require("./routes/jwtAuth"));

// Dashboard
app.use("/dashboard", require("./routes/dashboard"));

// Mot de Passe oublié
app.use("/forgottenpassword", require("./routes/forgottenPassword"));

app.listen(5000, () => {
  console.log("Le serveur fonctionne sur le port 5000");
});
