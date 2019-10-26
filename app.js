const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

//middleware of model
require("./models/user");
mongoose
  .connect("mongodb://localhost/google", { useNewUrlParser: true })
  .then(() => console.log("connected"))
  .catch(err => console.log("err"));

//load middleware of handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
//passport config
require("./config/passport")(passport);
//load keys
require("./config/keys");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//load map promise
mongoose.promise = global.Promise;
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
//load router
const Index = require("./routes/index");
const Auth = require("./routes/auth");

//load middelware of router
app.use("/auth", Auth);
app.use("/", Index);
//load get
app.get("/", (req, res) => {
  res.send(" this is our page");
});

const port = process.env.PORT || 200;
app.listen(port, (req, res) => {
  console.log(`this is the port ${port}`);
});
