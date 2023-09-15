const pool = require("../db");
const router = require("express").Router();

router.post("/addRecipe", async (req, res) => {
  try {
    //Création des bdd si elle n'existe pas déjà
    await pool.query(
      "CREATE TABLE IF NOT EXISTS recettes(rct_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_name VARCHAR(255) NOT NULL, rct_nb INT, rct_nb_type VARCHAR(255))"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS ingredients(ing_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, ing_qty INT NOT NULL, ing_qty_unit VARCHAR(255) NOT NULL, ing_name VARCHAR(255) NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS section_ing(section_ing_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_ing_name VARCHAR(255) NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS section_step(section_step_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_step_name VARCHAR(255) NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS steps(step_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), section_step_id VARCHAR(255) NOT NULL, step_content VARCHAR(255) NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS images(img_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, img_byte VARCHAR(255) NOT NULL)"
    );

    // Ajout d'une ligne dans la table recette avec le nom transmis
    await pool.query("INSERT INTO recettes (rct_name) VALUES ($1)", [
      req.body.rct_name,
    ]);

    // Récupération de rct_id
    const rct_id = await pool.query(
      "SELECT rct_id FROM recettes WHERE rct_name = $1",
      [req.body.rct_name]
    );

    res.json(rct_id);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

router.get("/getRecipeInfos", async (req, res) => {
  try {
    const rct_id = req.header("rct_id");

    // Récupération nom recette
    const rct_name = await pool.query(
      "SELECT rct_name FROM recettes WHERE rct_id = $1",
      [rct_id]
    );

    res.json({ rct_name });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

router.post("/changeRecipeInfos", async (req, res) => {
  try {
    const rct_id = req.header("rct_id");
    const new_rct_name = req.body.rct_name;

    //Màj Infos
    await pool.query("UPDATE recettes SET rct_name=$1 where rct_id=$2", [
      new_rct_name,
      rct_id,
    ]);

    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

module.exports = router;
