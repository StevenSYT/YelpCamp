var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride =require("method-override")
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    User        = require("./models/user"),
    Comment     = require("./models/comment");

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_v9", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); //seed the database

//passport config
app.use(require("express-session")({
    secret: "you're the best!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


// Campground.create(
//     {
//         name: "Big bend",
//         image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg",
//         description: "This is the description of Big bend. So I never been there before hahahah"
//     }, function(err, campground){
//             if(err){
//                 console.log(err);
//             } else{
//                 console.log("NEWLY CREATED CAMPGROUND: ");
//                 console.log(campground);
//             }
//     });

// var campgrounds = [
//     {name: "Yosemite", image: "https://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/09/main/yosemite-camping.jpg?itok=b-ZeHZ7v"},
//     {name: "Big bend", image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg"},
//     {name: "Zion", image: "https://static.wixstatic.com/media/6c60e6_99bb977429ae47a5a7b6d2b7fd9db640~mv2_d_3000_2400_s_4_2.jpg"},
//     {name: "Yosemite", image: "https://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/09/main/yosemite-camping.jpg?itok=b-ZeHZ7v"},
//     {name: "Big bend", image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg"},
//     {name: "Zion", image: "https://static.wixstatic.com/media/6c60e6_99bb977429ae47a5a7b6d2b7fd9db640~mv2_d_3000_2400_s_4_2.jpg"},
//     {name: "Yosemite", image: "https://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/09/main/yosemite-camping.jpg?itok=b-ZeHZ7v"},
//     {name: "Big bend", image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg"},
//     {name: "Zion", image: "https://static.wixstatic.com/media/6c60e6_99bb977429ae47a5a7b6d2b7fd9db640~mv2_d_3000_2400_s_4_2.jpg"}
// ];
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);


app.listen(2000, function(){
    console.log("The yelpcamp is running on the localhost:2000")
});
