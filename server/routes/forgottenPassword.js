const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const nodemailer = require("nodemailer");
const router = require("express").Router();
const validmail = require("../middlewear/validmail");
const authorization = require("../middlewear/authorization");

router.post("/reset", validmail, async (req, res) => {
  try {
    const mail = req.body.mail;

    // Récupération ID utilisateur
    const user = await pool.query(
      "SELECT user_id FROM users WHERE user_mail = $1",
      [mail]
    );

    // Génératon token
    const token = jwtGenerator(user.rows[0].user_id, "1hr");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.mail}`,
        pass: `${process.env.mail_password}`,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `${process.env.mail}`,
      to: `${mail}`,
      subject: "Réinitialisation Mot de Passe - Les Recettes de Sabine",
      text:
        "http://localhost:3000/connexion/reinitialisation-mot-de-passe/" +
        `${token}`,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      res.status(200).json("Email réinitialisation Mot de Passe envoyé");
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

router.post("/changepassword", authorization, async (req, res) => {
  // Récupérationd des variables
  const { password, password2 } = req.body;

  // Vérification de si les deux mdp sont identiques
  if (password !== password2) {
    return res.status(401).json("Les deux mots de passe sont différents.");
  }

  // Cryptage nouveau mdp
  // Cryptage mot de passe
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const bcryptPassword = await bcrypt.hash(password, salt);

  // Changement mdp
  await pool.query("UPDATE users SET user_password=$1 where user_id=$2", [
    bcryptPassword,
    req.user,
  ]);

  //On renvoie le token pour se connecter direct
  const token = req.header("token");
  res.json({ token });
});

module.exports = router;