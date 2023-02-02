const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema({

    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserModel"
    },

    authorUsername : {
        type : String,
        require : true
    },

    authorName : {
        type : String,
        require : true
    },

    title : {
        type : String,
        require : true
    },

    coverImg : {
        type : String,
        require : true
    },

    content : {
        type : String,
        require : true
    },

    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserModel"
        }
    ],

    tags : [
        {
            tag : 
            { 
                type:String
            }
        }
    ],

    comments : [
        {
            commenterId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "UserModel"
            },

            commenterUsername : {
                type : String,
                required : true
            },

            comment : {
                type : String,
                require:true
            },

            date : {
                type : Date,
                default : Date.now()
            }

        }
    ],

    date : {
        type : Date,
        default : Date.now() + 1000*60*60*5.5
    }
});


const blogModel = new mongoose.model("blog" , blogSchema);


module.exports = blogModel;
