var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
        {
            name: "KungPao Chicken",
            image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514852018&di=601119252b1aa0b19d459ed3a06ce742&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fca1349540923dd54ba2c3952da09b3de9c8248a9.jpg",
            description: "Proin accumsan maximus elementum. Vivamus sodales nulla massa, a viverra metus tincidunt sit amet. Nulla eu pellentesque sem. Suspendisse vehicula feugiat porta. Sed vulputate purus eu neque tempor, nec volutpat magna rutrum. Nullam sit amet ante posuere, accumsan leo sed, volutpat eros. Vestibulum erat ante, bibendum in augue at, gravida commodo ante. Maecenas pellentesque sed mi non lobortis. Suspendisse sit amet commodo nibh."
        },
        {
            name: "Beijing Duck",
            image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514852108&di=5d2c700c755800e7b39a4fdc9415c1cb&imgtype=jpg&er=1&src=http%3A%2F%2F365jia.cn%2Fuploads%2Fnews%2Ffolder_338317%2Fimages%2F8a0e15d4d60f652b3183104f06ebf4d5.jpg",
            description: "Proin accumsan maximus elementum. Vivamus sodales nulla massa, a viverra metus tincidunt sit amet. Nulla eu pellentesque sem. Suspendisse vehicula feugiat porta. Sed vulputate purus eu neque tempor, nec volutpat magna rutrum. Nullam sit amet ante posuere, accumsan leo sed, volutpat eros. Vestibulum erat ante, bibendum in augue at, gravida commodo ante. Maecenas pellentesque sed mi non lobortis. Suspendisse sit amet commodo nibh."
        },
        {
            name: "Apple Pie",
            image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514852189&di=a5fb1348c9f4e25241d612491eb29387&imgtype=jpg&er=1&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201511%2F04%2F20151104201239_BMLHa.jpeg",
            description: "Fusce feugiat neque ac velit efficitur ornare. Sed dui nulla, lobortis vitae quam vel, volutpat blandit nulla. Nulla ac commodo odio. Suspendisse a ligula nisl. Ut pellentesque accumsan massa eu rutrum. Praesent eu enim vel velit venenatis elementum in quis augue. Morbi bibendum ac dui et laoreet. Pellentesque ac nisi ac turpis feugiat condimentum quis sed felis. Aenean euismod quam quis purus semper, sit amet porta sapien pharetra. Vestibulum tincidunt tortor non pulvinar dapibus. Praesent ut gravida arcu. Quisque sed nibh dictum sapien pulvinar eleifend ut vel lacus. Pellentesque metus lorem, sollicitudin ut volutpat vel, cursus ac enim."
        }
]
function seedDB(){
    Campground.remove({},function(err){
        if(err) {
            console.log(err);
        }
        console.log("removed recipes!");
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a recipe!");
                    // create comment
                    Comment.create({
                        text: "This is a good place, but I wish there was internet!",
                        author: "Steven"
                    }, function(err, comment){
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment!")
                        }
                    })
                }
            });
        });
    });

};

module.exports = seedDB;
