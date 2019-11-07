
const router = require('express').Router({mergeParams: true});
var Campground = require('../models/campground');

router.get('/', (req, res) => {
    Campground.find({}, function(err, allCampgrounds){
        if(err) throw err;
        else {
            res.render('index', {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    
});
router.get('/new', isLoggedIn, (req, res)=> {
    res.render('newCampground');
});

router.post('/', isLoggedIn, (req, res)=> {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamground = {name, image, description, author};
    Campground.create(newCamground, function(err, campground){
        if(err) throw err;
        else {
            res.redirect('./campgrounds');
        }
    });
    
}); 

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(
        function(err, foundCampground){
            if(err) throw err;
            else {
                res.render('show', {campground: foundCampground});
            }
        }); 
    });
    
    router.get("/:id/edit",checkCampOwnership, (req, res) => {
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render('campgroundEdit', {campground: foundCampground});
        }); 
    });
    
    router.put("/:id", checkCampOwnership, function(req, res) {
        Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground) {
            if(err) res.redirect("./");
            else {
                console.log(updatedCampground);
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    })

    router.delete("/:id", checkCampOwnership, function(req, res) {
        Campground.findByIdAndDelete(req.params.id, (err) => {
            if(err) throw err;
            else res.redirect("/campgrounds");
        });
    });
    
// middleware 
function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) res.redirect("/campgrounds")
                else {
                    if(foundCampground.author.id.equals(req.user._id)) {
                        return next();
                    } else {
                        res.send("You dont have the permission for that");
                    }
                }
            });
    } else {
        res.send("login first");
    }
}

module.exports = router;