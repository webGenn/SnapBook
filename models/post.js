const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postImage : {
        type : String,
        require : true
    },
    caption : {
        type : String,
        require : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
})

module.exports = mongoose.model("post", postSchema)