require("dotenv").config()
const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session")
const passport = require("passport");
const { initiatingPassport } = require("./config/passport");
const port = process.env.PORT || 3000
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash())
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.SECRET
}))
app.use(passport.initialize());
app.use(passport.session())
initiatingPassport(passport)

app.set("view engine", "ejs")

app.use("/", require("./routes/index"));

app.listen(port)