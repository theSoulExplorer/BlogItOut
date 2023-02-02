const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRETKEY = "secretkeyiswhatsecretkeyisthisverysecret"
const userModel = require("../models/userModel"); 

const auth = async (req , res , next) => {
    
    try{
        const token = req.cookies.jwt;

        if(!token){
            req.isLoggedIn = false;
        }
        else{
            const data = jwt.verify(token,SECRETKEY);

            const verifiedUser = await userModel.findOne({_id:data.id});

            if(!verifiedUser)
                req.isLoggedIn = false;

            else{
                req.isLoggedIn = true;
                req.LoggedInUser = verifiedUser;
            }

        }

        next();


    }catch(e){
        console.log("error in backend" + e);
    }

};

module.exports = auth;



