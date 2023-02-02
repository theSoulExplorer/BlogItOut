const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({

    fname : {
        type : String,
        require : true,
    },

    lname : {
        type : String,
        require : true,
    },

    username : {
        type : String,
        require : true,
        unique : true
    },

    profileImg : {
        type : String,
        default : "src/public/images/default.png" 
    },

    password : {
        type : String,
        require : true
    },

    about : {
        type : String,
        default : "An About me page is one of the most important parts of your portfolio, website, or blog. This page is where prospective employers, potential         clients,    website users, and other professional and personal connections go to learn about who you are and what you do."
    },


    blogs : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Blog"
        }
    ]

});

const userModel = new mongoose.model("user" , userSchema);

module.exports = userModel;