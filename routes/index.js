const express = require("express");
const userModel = require("../models/user");
const postModel = require("../models/post");
const passport = require("passport");
const flash = require("connect-flash");
const multer = require("multer");
const upload = require("../config/multer")
const router = express.Router();

// all get routes
router.get("/", (req,res)=>{
    res.render("index", {title : "SnapBook - Create Account"})
})
router.get("/login", (req,res)=>{
    res.render("login", {title : "SnapBook - Login Account"})
})
router.get("/profile", isLoggedIn , async (req,res)=>{
    let user = await req.user.populate("posts")
    console.log(user);
    res.render("profile", {title : "SnapBook - Profile Page", user})
})
router.get("/updateProfile", isLoggedIn ,(req,res)=>{
    let user = req.user
    res.render("updateProfile", {title : "SnapBook - Update Your Profile", user})
})
router.get("/feed", isLoggedIn , async (req,res)=>{
    let loggedUser = req.user
    let post = await postModel.find().populate("user");
    res.render("feed", {title : "SnapBook - Feed Page", post, loggedUser})
})
router.get("/createPost", isLoggedIn ,(req,res)=>{
    res.render("createPost", {title : "SnapBook - Create New Post"})
})
router.get("/like/post/:id", isLoggedIn ,async (req,res)=>{
    let user = req.user;
    let post = await postModel.findOne({_id : req.params.id})

    if(post.likes.indexOf(user._id) == -1){
        post.likes.push(user._id)
    }else{
        post.likes.splice(post.likes.indexOf(user._id), 1)
    }
    await post.save();
    res.redirect("/feed")
})
router.get("/logout", (req,res, next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

//all post routes
router.post("/register", upload.single("profileImage"), async (req,res)=>{
    let {name, username, password, phone, bio} = req.body
    await userModel.create({name, username, password, phone, bio, profileImage : req.file.filename})
    res.redirect("/login")
})

router.post("/login", passport.authenticate("local", 
{successRedirect : "/feed", failureRedirect : "/login"}
))

router.post("/update", upload.single("profileImage") ,async (req,res)=>{
    let user = req.user;
    let updatedUser = await userModel.findOneAndUpdate(user, {name : req.body.name, bio : req.body.bio}, {new : true})

    if(req.file){
        updatedUser.profileImage = req.file.filename;
    }
    
    await updatedUser.save()
    res.redirect("/profile")
})

router.post("/createPost", isLoggedIn, upload.single("postImage"), async (req,res)=>{
    let user = req.user
    let {caption, postImage} = req.body
    let post = await postModel.create({caption, postImage : req.file.filename, user : user._id})
    user.posts.push(post._id)
    await user.save()
    res.redirect("/feed")
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next()
    res.redirect("/login")
}

module.exports = router