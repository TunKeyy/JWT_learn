const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
    //register
    registerUser: async(req, res, next) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            
            // create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            //save to db
            const user = await newUser.save()
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    //generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
        process.env.JWT_ACCESS_KEY,
        {
            expiresIn: "20s"
        }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
        process.env.JWT_REFRESH_KEY,
        {
            expiresIn: "365d"
        });
    },
    //login user
    loginUser: async(req, res, next) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user) {
                return res.status(404).json("Wrong username");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword) {
                return res.status(404).json("Wrong password");
            }
            if(user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                // luu refresh token vao cookie
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                const {password, ...others} = user._doc;
                res.status(200).json({...others, accessToken, refreshToken});
            }
        }
        catch(err){
            res.status(500).json(err)
        }
    },

    //REDIS
    requestRefreshToken: async(req, res) => {
        // take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("You're not authenticated");
        if(!refreshTokens.includes(refreshToken)){
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err){
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    },
    userLogout: async(req,res) => {
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out")
    }
}
//STORE TOKEN
//1) LOCAL STORAGE
//dễ bị tấn công bởi XSS
//2) HTTPONLY COOKIES:
//CSRF -> được khắc phục bởi SAMESITE
//3) REDUX STORE để lưu ACCESS TOKEN
//HTTPONLY COOKIES ĐỂ LƯU TRỮ REFRESH TOKEN

//BFF PATTERN (BACKEND FOR FRONT END) -> TỐI ƯU BẢO MẬT NHẤT
module.exports = authController;