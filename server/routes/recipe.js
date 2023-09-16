const pool = require("../db");
const router = require("express").Router();

router.post("/addRecipe", async (req, res) => {
  try {
    //Création des bdd si elle n'existe pas déjà
    await pool.query(
      "CREATE TABLE IF NOT EXISTS recettes(rct_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_name VARCHAR(255) NOT NULL, user_pseudo VARCHAR(255) NOT NULL, rct_nb INT, rct_nb_type VARCHAR(255))"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS ingredients(ing_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_ing_id VARCHAR(255) NOT NULL, ing_qty INT NOT NULL, ing_qty_unit VARCHAR(255) NOT NULL, ing_name VARCHAR(255) NOT NULL, ing_position INT NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS section_ing(section_ing_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_ing_name VARCHAR(255) NOT NULL, section_ing_position INT NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS section_step(section_step_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_step_name VARCHAR(255) NOT NULL, section_step_position INT NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS steps(step_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_step_id VARCHAR(255) NOT NULL, step_content VARCHAR(255) NOT NULL, step_position INT NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS images(img_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, img_byte VARCHAR(255) NOT NULL)"
    );

    // Ajout d'une ligne dans la table recette avec le nom transmis
    await pool.query(
      "INSERT INTO recettes (rct_name, user_pseudo, rct_nb, rct_nb_type) VALUES ($1, $2, $3, $4)",
      [req.body.rct_name, req.body.user_pseudo, 0, ""]
    );

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

router.get("/getRecipesList", async (req, res) => {
  try {
    let myRecipeList = [];
    let myVerif = false;

    // Vérification de si la table recettes existe ou non
    myBddList = await pool.query(
      "SELECT * FROM information_schema.tables WHERE table_type='BASE TABLE'"
    );

    for (i = 0; i < myBddList.rows.length; i++) {
      if (myBddList.rows[i].table_name === "recettes") {
        myVerif = true;
      }
    }

    // Récupération nom recette
    if (myVerif) {
      myRecipeList = await pool.query("SELECT rct_id, rct_name FROM recettes");
    }

    res.json({ myRecipeList });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

router.get("/getRecipeInfos", async (req, res) => {
  try {
    const rct_id = req.header("rct_id");

    // Récupération nom recette
    const myInfo = await pool.query(
      "SELECT rct_name, user_pseudo, rct_nb, rct_nb_type FROM recettes WHERE rct_id = $1",
      [rct_id]
    );

    res.json({ myInfo });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

router.post("/updateRecipeInfos", async (req, res) => {
  try {
    const rct_id = req.header("rct_id");
    const new_rct_name = req.body.rct_name;
    const new_rct_nb = req.body.rct_nb;
    const new_rct_nb_type = req.body.rct_nb_type;

    //Màj Infos
    await pool.query(
      "UPDATE recettes SET rct_name=$1, rct_nb=$2, rct_nb_type=$3 where rct_id=$4",
      [new_rct_name, new_rct_nb, new_rct_nb_type, rct_id]
    );

    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

module.exports = router;
