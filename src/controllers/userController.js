const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const SECRETKEY = "secretkeyiswhatsecretkeyisthisverysecret"

const register = async (req , res) => {

    try{

        const {fname , lname , username , password , cpassword} = req.body;
        if(!fname || !lname || !username || !password || !cpassword){
            res.render("register" , {err:"Value Required !!"});
            return;
        }
        if(password !== cpassword){
            res.render("register" , {err:"Confirm Password doesn't Match"});
            return;
        }

        const user = await userModel.findOne({username});

        if(user){
            res.render("register" , {err:"UserName already Exists"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new userModel({
            fname : fname,
            lname : lname,
            username : username,
            password : hashedPassword
        });

        const result = await newUser.save();

        const token = jwt.sign({username:username,id:result._id} , SECRETKEY);
        res.cookie("jwt" , token , {
            maxAge:(24*60*60*1000)
        });

        res.redirect("/");

    }catch(e){
        console.log("Error!!!");
    }


};














const login = async (req , res) => {

    try{
        const {reqUrl , username , password} = req.body;

        if(!username || !password){
            res.render("login" , {err : "Value Required" , reqUrl});
            return;
        }
        
        const user = await userModel.findOne({username});
        
        if(!user){
            res.render("login" , {err:"user Not Found !!!" , reqUrl});
            return;
        }
        
        const verify = await bcrypt.compare(password , user.password);

        if(!verify){
            res.render("login" , {err:"Invalid values" , reqUrl})
            return;
        }

        const token = jwt.sign({username:username,id:user._id} , SECRETKEY);
        res.cookie("jwt" , token , {
                maxAge:(24*60*60*1000)
        });

        res.redirect(reqUrl);
    }catch(e){
        console.log("ERROR!!!!");
    }



};


const getUserData = async (username) => {
    const data = await userModel.findOne({username});
    return data;
}


const updateAbout = async(req , res) =>{

    try{

        const aboutData = req.body;
        const key = Object.keys(aboutData)[0];
        const newUser = await userModel.updateOne({_id:req.LoggedInUser._id} , {$set:{about:key}});

    }catch(e){
        console.log("Error in Backend :" , e);
    }

}


const uploadDP = async(req,res) => {
    try{
        let profileImg = "";
        console.log(req.file);
        console.log(req.body);
        if(req.file)
            profileImg = req.file.path;
        console.log(profileImg);
        const updatedUser = await userModel.updateOne({_id:req.LoggedInUser._id},{$set : {profileImg:profileImg}});
        res.redirect("/user/"+req.LoggedInUser.username);
        return;
        

    }catch(e){
        console.log("Error in Backend :" , e);
    }

}


module.exports = {register,login , getUserData, updateAbout,uploadDP};