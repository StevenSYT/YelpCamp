var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
// INDEX ROUTE- show all campgrounds
router.get("/", function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to campgrounds DB
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};

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
router.get("/new", isLoggedIn,function(req, res){
    res.render("campgrounds/new")
});

//SHOW PAGE
router.get("/:id", function(req, res){
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", function(req,res){
    // is user logged in?
        if(req.isAuthenticated()){

        } else{
            console.log("You need to be logged in!");
            res.send("You need to be logged in!")
        }
        // does user own the campground
        //otherwise redirect
    // if not, redirect
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground})
        }
    })

});

//Update router
router.put("/:id/", function(req, res){
    //find and Update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// delete
router.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
})
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
