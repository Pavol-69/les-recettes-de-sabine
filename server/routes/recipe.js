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
      "CREATE TABLE IF NOT EXISTS steps(step_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, section_step_id VARCHAR(255) NOT NULL, step_content TEXT NOT NULL, step_position INT NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS images(img_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL, img_byte VARCHAR(255) NOT NULL)"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS categories(cat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), cat_name VARCHAR(255) NOT NULL"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS table_categories(table_cat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), rct_id VARCHAR(255) NOT NULL"
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

    // Ajout de la section de base pour ingredients et steps
    await pool.query(
      "INSERT INTO section_ing (rct_id, section_ing_name, section_ing_position) VALUES ($1, $2, $3)",
      [rct_id.rows[0].rct_id, "no_section", 1]
    );

    await pool.query(
      "INSERT INTO section_step (rct_id, section_step_name, section_step_position) VALUES ($1, $2, $3)",
      [rct_id.rows[0].rct_id, "no_section", 1]
    );

    // Ajout d'une ligne dans la table des catégories
    await pool.query(
      "INSERT INTO table_categories (rct_id) VALUES ($1)",
      [rct_id.rows[0].rct_id]
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

    const myInfoSectionIng = await pool.query(
      "SELECT section_ing_id, section_ing_name, section_ing_position FROM section_ing WHERE rct_id = $1",
      [rct_id]
    );

    const myInfoIng = await pool.query(
      "SELECT section_ing_id, ing_qty, ing_qty_unit, ing_name, ing_position FROM ingredients WHERE rct_id = $1",
      [rct_id]
    );

    const myInfoSectionStep = await pool.query(
      "SELECT section_step_id, section_step_name, section_step_position FROM section_step WHERE rct_id = $1",
      [rct_id]
    );

    const myInfoStep = await pool.query(
      "SELECT section_step_id, step_content, step_position FROM steps WHERE rct_id = $1",
      [rct_id]
    );

    let mySectionIngList = [];
    let myIngList = [];
    let mySectionStepList = [];
    let myStepList = [];

    for (i = 0; i < myInfoSectionIng.rows.length; i++) {
      mySectionIngList.push([
        myInfoSectionIng.rows[i].section_ing_name,
        myInfoSectionIng.rows[i].section_ing_id,
      ]);
    }

    for (i = 0; i < myInfoIng.rows.length; i++) {
      myIngList.push([
        myInfoIng.rows[i].ing_qty,
        myInfoIng.rows[i].ing_qty_unit,
        myInfoIng.rows[i].ing_name,
        myInfoIng.rows[i].section_ing_id,
        myInfoIng.rows[i].ing_position,
      ]);
    }

    for (i = 0; i < myInfoSectionStep.rows.length; i++) {
      mySectionStepList.push([
        myInfoSectionStep.rows[i].section_step_name,
        myInfoSectionStep.rows[i].section_step_id,
      ]);
    }

    for (i = 0; i < myInfoStep.rows.length; i++) {
      myStepList.push([
        myInfoStep.rows[i].step_content,
        myInfoStep.rows[i].section_step_id,
        myInfoStep.rows[i].step_position,
      ]);
    }

    res.json({ myInfo, mySectionIngList, myIngList, mySectionStepList, myStepList });
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

router.post("/updateRecipeIngredients", async (req, res) => {
  try {
    const rct_id = req.header("rct_id");
    const new_rct_section_ing = req.body.rct_section_ing;
    const new_rct_ing = req.body.rct_ing;
    //Suppression de tout ce qui existe dans la bdd relatif à cette recette
    await pool.query("DELETE FROM section_ing WHERE rct_id=$1", [rct_id]);
    await pool.query("DELETE FROM ingredients WHERE rct_id=$1", [rct_id]);

    // Ajout de toutes les sections contenues dans req.body.section_ing
    for (let i = 0; i < new_rct_section_ing.length; i++) {
      await pool.query(
        "INSERT INTO section_ing (rct_id, section_ing_name, section_ing_position) VALUES ($1, $2, $3)",
        [rct_id, new_rct_section_ing[i][0], new_rct_section_ing[i][1]]
      );
    }

    // Ajout de toutes les ingrédients contenus dans req.body.ing
    for (let i = 0; i < new_rct_ing.length; i++) {
      let rct_section_id = "";
      if (new_rct_ing[3] === 1) {
        rct_section_id = "no_section";
      } else {
        rct_section_id = await pool.query(
          "SELECT section_ing_id FROM section_ing WHERE (rct_id=$1) AND (section_ing_position=$2)",
          [rct_id, new_rct_ing[i][3]]
        );
      }

      await pool.query(
        "INSERT INTO ingredients (rct_id, section_ing_id, ing_qty, ing_qty_unit, ing_name, ing_position) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          rct_id,
          rct_section_id.rows[0].section_ing_id,
          new_rct_ing[i][0],
          new_rct_ing[i][1],
          new_rct_ing[i][2],
          new_rct_ing[i][4],
        ]
      );
    }

    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

router.post("/updateRecipeSteps", async (req, res) => {
  try {
    const rct_id = req.header("rct_id");
    const new_rct_section_step = req.body.rct_section_step;
    const new_rct_step = req.body.rct_step;

    //Suppression de tout ce qui existe dans la bdd relatif à cette recette
    await pool.query("DELETE FROM section_step WHERE rct_id=$1", [rct_id]);
    await pool.query("DELETE FROM steps WHERE rct_id=$1", [rct_id]);

    // Ajout de toutes les sections contenues dans req.body.section_ing
    for (let i = 0; i < new_rct_section_step.length; i++) {
      await pool.query(
        "INSERT INTO section_step (rct_id, section_step_name, section_step_position) VALUES ($1, $2, $3)",
        [rct_id, new_rct_section_step[i][0], new_rct_section_step[i][1]]
      );
    }

    // Ajout de toutes les ingrédients contenus dans req.body.ing
    for (let i = 0; i < new_rct_step.length; i++) {
      let rct_section_id = "";
      if (new_rct_step[1] === 1) {
        rct_section_id = "no_section";
      } else {
        rct_section_id = await pool.query(
          "SELECT section_step_id FROM section_step WHERE (rct_id=$1) AND (section_step_position=$2)",
          [rct_id, new_rct_step[i][1]]
        );
      }

      await pool.query(
        "INSERT INTO steps (rct_id, section_step_id, step_content, step_position) VALUES ($1, $2, $3, $4)",
        [
          rct_id,
          rct_section_id.rows[0].section_step_id,
          new_rct_step[i][0],
          new_rct_step[i][2],
        ]
      );
    }

    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
});

module.exports = router;
