module.exports = (req, res, next) => {
    
    const {mail, name, family_name, pseudo, password, password2} = req.body;
    
    function validEmail(myMail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myMail);
    };

    if (req.path === "/inscription") {
        if(![mail, name, family_name, pseudo, password, password2].every(Boolean)) {
            return res.status(401).json("Informations manquantes.");
        } else if (!validEmail(mail)) {
            return res.status(401).json("Adresse mail invalide.");
        }
    } else if (req.path === "/connexion") {
        if(![mail, password].every(Boolean)) {
            return res.status(401).json("Informations manquantes.");
        } else if (!validEmail(mail)) {
            return res.status(401).json("Adresse mail invalide.");
        };
    }
    next();
};