var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require('./models/comment');
var data = [
    {name: "Taj Mahal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRUz7Jr5TDcA2Aq3PjDxpsPalOFjg58nQju6w2ONIvzR5SlCHt7", 
    description: "First in Seven wonders of the world list"
}, 
{
    name: "Jatayu National Park",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSysJl2YC5GeMXLZBbieZdsdHQMXWln07bx5YtkrIlBEgD6uKl1",
    description: "Biggest Bird statue in the world."
}
];

function seedDB() {
    // Comment.remove({}, function(err) {
    //     console.log("Comments removed");
    // });
    Campground.remove({}, function(err) {
        if(err) throw err;
        console.log("Campgrounds Removed");
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground){
                if(err) throw err;
                else {
                    console.log(campground.name+ " added to db!");
                    var newComment = {
                        text: "This is awasome place",
                        author: "Rishu"
                    }
                    Comment.create(newComment, function(err, comment){
                        if(err) throw err;
                        else {
                            comment.author.id = req.user._id;
                            comment.author.username = req.user.username;
                            comment.save();
                            campground.comments.push(comment);
                            campground.save();
                            console.log(comment);
                        }
                    });
                };
            });
        });
    });
};

module.exports = seedDB;