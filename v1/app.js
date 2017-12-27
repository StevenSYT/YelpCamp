var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Yosemite", image: "https://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/09/main/yosemite-camping.jpg?itok=b-ZeHZ7v"},
    {name: "Big bend", image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg"},
    {name: "Zion", image: "https://static.wixstatic.com/media/6c60e6_99bb977429ae47a5a7b6d2b7fd9db640~mv2_d_3000_2400_s_4_2.jpg"},
    {name: "Yosemite", image: "https://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/09/main/yosemite-camping.jpg?itok=b-ZeHZ7v"},
    {name: "Big bend", image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg"},
    {name: "Zion", image: "https://static.wixstatic.com/media/6c60e6_99bb977429ae47a5a7b6d2b7fd9db640~mv2_d_3000_2400_s_4_2.jpg"},
    {name: "Yosemite", image: "https://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/09/main/yosemite-camping.jpg?itok=b-ZeHZ7v"},
    {name: "Big bend", image: "https://www.gonewiththewynns.com/wp-content/uploads/2014/05/15A6413.jpg"},
    {name: "Zion", image: "https://static.wixstatic.com/media/6c60e6_99bb977429ae47a5a7b6d2b7fd9db640~mv2_d_3000_2400_s_4_2.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //get data from form and add to campgrounds array
    //redirect back to campgrounds page
    res.redirect("/campgrounds")
});

app.get("/campgrounds", function(req, res){


    res.render("campgrounds", {campgrounds: campgrounds});
});


app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs")
});
app.listen(2000, function(){
    console.log("The yelpcamp is running on the localhost:2000")
});
