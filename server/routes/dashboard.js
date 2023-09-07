const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middlewear/authorization");

router.get("/userInfos", authorization, async (req, res) => {

    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [req.user]
        );
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Erreur serveur.");
    }
});

router.get("/allUsersInfos", authorization, async (req, res) => {

    try {
        const user = await pool.query(
            "SELECT * FROM users",
            [req.user]
        );
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Erreur serveur.");
    }
});

module.exports = router;