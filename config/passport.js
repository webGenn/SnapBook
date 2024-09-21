const localStrategy = require("passport-local").Strategy;
const userModel = require("../models/user");

exports.initiatingPassport = (passport) =>{
    passport.use(new localStrategy(async function (username, password, done){
        const user = await userModel.findOne({username})
        if(!user) return done(null, false)
        if(user.password !== password) return done(null, false)
        return done(null, user);
    }
))

passport.serializeUser((user, done)=>{
    done(null, user.id)
});
passport.deserializeUser(async (id, done)=>{
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
})
}