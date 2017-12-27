var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v3", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


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
            res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new.ejs")
});

//SHOW PAGE
app.get("/campgrounds/:id", function(req, res){
    // Find the campground with privided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            // render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});
app.listen(2000, function(){
    console.log("The yelpcamp is running on the localhost:2000")
});
