const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");
const {getUserData} = require("../controllers/userController");









const post = async (req , res) => {

    try{
        const {authorId , title , content} = req.body;
        coverImg = "";
        if(req.file)
            coverImg = req.file.path;
        
        if(!authorId || !title || !coverImg || !content){
            res.render("compose" , {err:"Fill All the Feilds" , isLoggedIn:true , user:req.LoggedInUser});
            // console.log("Hello from compose");
            return;
        }
        
        console.log("hello from outside");
        const author = await userModel.findOne({_id:authorId});
        
        const newBlog = new blogModel({
            authorId,
            authorUsername :author.username ,
            authorName : author.fname + " " + author.lname,
            title,
            coverImg,
            content
        });
        
        const result = await newBlog.save();
        const blogId = result._id;
        
        // console.log(authorUser);

        await userModel.updateOne(
            { _id : authorId },
            { $addToSet : { blogs : blogId } }
        );

        res.redirect("/");
        return;

    }catch(e){
        console.log(e + "Error in backEnd Post");
    }

}



const getBlogs = async () => {
    try{

        const blogs = await blogModel.find({});
        // console.log(blogs);

        blogs.sort( function( blog1 , blog2 ){
            if(blog1.likes.length > blog2.likes.length) return -1;
            return 1;
        } );
        
        return blogs;
    }catch(e){
        console.log(e + "Error in backEnd  getBlogs");
    }

}

const getBlog = async (id) => {

    try{

    const blog = await blogModel.findOne({_id:id});
    return blog;
    }catch(e){
        console.log(id);
        console.log(e + "Error in backEnd  getBlog");
    }
}
 



const like = async (req , res) => {

    try{
    const arr = req.headers.referer.split("/");
    const userId = req.LoggedInUser._id;

    let id = arr[arr.length - 1];

    id = id.substring(3 , id.length);

    const updatedBlog = await blogModel.findOneAndUpdate({_id:id} , {$push : {"likes" : userId}} , {new:true});
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({updatedBlog}));
    }catch(e){
        console.log(e + "Error in backEnd  like");
    }
    
}

const unlike = async (req , res) => {

    try{

    const arr = req.headers.referer.split("/");
    const userId = req.LoggedInUser._id;

    let id = arr[arr.length - 1];

    id = id.substring(3 , id.length);

    const updatedBlog = await blogModel.findOneAndUpdate({_id:id} , {$pull : {"likes" : userId}} , {new:true});
    
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({updatedBlog}));
    }catch(e){
        console.log(e + "Error in backEnd  unlike");
    }
}


const getBlogsOfUser = async (username) => {
    try{

    const blogs = await blogModel.find({authorUsername:username});
    return blogs;
    }catch(e){
        console.log(e + "Error in backEnd  getblogsofuser");
    }
}

const postComment = async (req , res) => {

    const {blogId , comment} = req.body;
    const commenter = req.LoggedInUser.username;


    const commentObj = {
        commenterId : req.LoggedInUser._id,
        commenterUsername : commenter,
        comment : comment,
        date : Date.now()
    };

    const updatedBlog = await blogModel.updateOne({_id:blogId} , {$push : {comments : commentObj}} , {new:true});
    
    const blog = await blogModel.findOne({_id:blogId});
    const author = await getUserData(commenter);
    // res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({updatedBlog}));

    res.redirect("/blog/id=" + blogId);
    return;

}

module.exports = {post , getBlogs , getBlog , like , unlike , getBlogsOfUser , postComment};
