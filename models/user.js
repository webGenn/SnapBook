const mongoose = require("mongoose");

mongoose.connect(process.env.URI).then(()=>{
    console.log("database connection successfull");
}).catch((err)=>{
    console.log("connection failed");;
})

const userSchema = mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    username : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true,
    },
    phone : {
        type : Number,
        require : true,
    },
    profileImage : {
        type : String,
        require : true
    },
    bio : {
        type : String,
    },
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "post"
    }]
})

module.exports = mongoose.model("user", userSchema)