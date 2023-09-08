require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async(req, res, next) => {
    try {
        
        const jwtToken = req.header("token");
        if(!jwtToken) {
            
            return res.status(403).json("Non autorisé.toto");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;

        next();


    } catch (err) {
        console.log(err);
        res.status(403).json("Token non valide.");
    }
};