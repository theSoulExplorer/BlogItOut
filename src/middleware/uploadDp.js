const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        // console.log("hello file");
        cb(null,"src/public/images/");
    },
    filename:(req,file,cb) => {
        let ext = path.extname(file.originalname);
        cb(null,Date.now()+ext);
    }
});

var upload = multer({
    storage:storage,
    fileFilter:(req,file,callback) => {
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
            ){
            // console.log("uploadDp");
            callback(null,true);
        }else{
            console.log("only jpg & png file supported");
            callback(null,false);
        }
    },
    limits:{
        fileSize:1024*1024*10
    }
});

module.exports = upload;