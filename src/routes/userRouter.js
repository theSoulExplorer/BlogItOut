const express = require("express");
const { getBlogsOfUser } = require("../controllers/blogController");
const { login, register, getUserData,updateAbout ,uploadDP} = require("../controllers/userController");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadDp");

userRouter.get("/login", auth ,(req,res) => {

    const reqUrl = req.headers.referer;

    if(req.isLoggedIn){
        res.redirect("/");
        return;
    }
    res.render("login" , {reqUrl});
});















userRouter.post("/login",login);





















userRouter.get("/register", auth ,(req,res) => {
    if(req.isLoggedIn){
        res.redirect("/");
        return;
    }
    else{
        res.render("register");
    }
});























userRouter.get("/logout", (req,res) => {
    res.clearCookie("jwt");
    res.redirect("/");

});


























userRouter.post("/register",register);
















userRouter.get("/:username" , auth , async(req,res) => {
    const username = req.params.username;
    
    const reqUrl = "/user/" + username;
    
    if(!req.isLoggedIn){
        res.render("login" , {reqUrl});
        return;
    }

    
    const userdata = await getUserData(username);
    const blogs = await getBlogsOfUser(username);

    res.render("profilePage" , {userdata , user:req.LoggedInUser , blogs,isLoggedIn:true});
});


userRouter.post("/updateAbout" , auth , updateAbout);


userRouter.post("/uploadDp" , auth , upload.single("dp") , uploadDP);
//blogRouter.post("/post", auth , upload.single("coverImg") , post);

module.exports = userRouter;