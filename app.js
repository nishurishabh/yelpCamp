var express    =  require('express'),
    bodyParser =  require('body-parser'),
    mongoose   =  require('mongoose'),
    User       =  require('./models/user'),
    seedDB     =  require('./seed'),
    flash      =  require("connect-flash"),
    passport   =  require('passport'),
    methodOverride = require('method-override'),
    localStrategy = require('passport-local');

var campgroundsRoutes       = require('./routes/campgrounds'),
    commentsRoutes          = require('./routes/comments'),
    indexRoutes              = require('./routes/index');   

// seedDB();
var app = express();

// ------------- Passport Configuration -------------
app.use(require("express-session")({
    secret: "I am perfect",
    resave: false,
    saveUninitialized: false
})); 
app.use(flash());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// ------------------------mongoose connection  ----------------------------
mongoose.connect('mongodb://rishabh:test123@ds149806.mlab.com:49806/personal_projects',
     {
         useUnifiedTopology: true, 
         useNewUrlParser: true, 
         useCreateIndex: true 
     }
);

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(3000, () => {
    console.log("server started at 3000");
});