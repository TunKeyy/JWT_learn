const jwt = require("jsonwebtoken")

const middlewareController = {
    //verify token
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            //Bearer 123456
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        }
        else{
            return res.status(401).json("You are not authenticated");
        }
    },

    //verify token
    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin){
                next();
            }
            else {
                return res.status(403).json("You are not allow to delete other");
            }
        })
    }
}
module.exports = middlewareController;