const express = require("express");
const auth = require("../middleware/auth");
const blogRouter = express.Router();
const { post, getBlogs , getBlog , like , unlike , postComment } = require("../controllers/blogController");
const {getUserData} = require("../controllers/userController");
const upload = require("../middleware/upload");

blogRouter.get("/compose" , auth , (req,res) => {

    if(!req.isLoggedIn){
        res.redirect("/");
        returrn;
    }
    else{
        res.render("compose" , {user:req.LoggedInUser , isLoggedIn:true});
    }

});









blogRouter.post("/post", auth , upload.single("coverImg") , post);















// /blog/63415c5babe50dc34ef8fb34
// /blog/post
blogRouter.get("/id=:id" , auth , async (req , res) => {
// 63415c5babe50dc34ef8fb34

    const blogId = req.params.id;

    const reqUrl = "/blog/id=" + blogId;

    if(!req.isLoggedIn){
        res.render("login" , {reqUrl});
        return;
    }
    else{
        const blog = await getBlog(blogId);
        const authorUsername = blog.authorUsername;
        const author = await getUserData(authorUsername);
        res.render("blogPage" , {blog , user : req.LoggedInUser , isLoggedIn:true , author});
        return;
    }


});








blogRouter.post("/like" , auth , like);
blogRouter.post("/unlike" , auth , unlike);
blogRouter.post("/comment" , auth , postComment);


module.exports = blogRouter;