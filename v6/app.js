var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    User        = require("./models/user"),
    Comment     = require("./models/comment");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_v6", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

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

app.get("/", function(req, res){
    res.render("landing");
});


// INDEX ROUTE- show all campgrounds
app.get("/campgrounds", function(req, res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

// CREATE add new campground to DB
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds DB
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds")
        }
    })
});

// NEW -  show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
});

//SHOW PAGE
app.get("/campgrounds/:id", function(req, res){
    // Find the campground with privided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// ===============
// COMMENTS ROUTES
// ===============

//New - FORM
app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//New - POST ROUTE: add to the database
app.post("/campgrounds/:id/comments", isLoggedIn,function(req, res) {
    //look up campground by id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create comment
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            })
            //connect new comment to campground
            //redirect campground show page
        }
    })

})

// Auth ROUTE
app.get("/register", function(req, res){
    res.render("register");
});
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req, res){
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

// middleware function definition
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(2000, function(){
    console.log("The yelpcamp is running on the localhost:2000")
});
