const express = require("express");
const userRouter = require("./routes/userRouter");
const blogRouter = require("./routes/blogRouter");
const ejs = require("ejs");
var path = require('path');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const { getBlogs } = require("./controllers/blogController");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/BlogItOut");

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set("views",path.join(__dirname, './views'));
app.set("view engine","ejs");
// app.use(express.static("src/public"));
app.use(express.static(__dirname + '/public'));
app.use("/user",userRouter);
app.use("/blog",blogRouter);

app.get("/",auth,async(req,res) => {
    const blogs = await getBlogs();
    if(req.isLoggedIn)
       { res.render("home",{blogs:blogs,isLoggedIn:req.isLoggedIn,user:req.LoggedInUser});
            // console.log(req.LoggedInUser);
    }
    else
        res.render("home",{blogs:blogs,isLoggedIn:req.isLoggedIn});
});

app.listen(PORT,() => {
    console.log(`server strted on port ${PORT}`);
});