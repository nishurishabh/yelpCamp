
// ===========================================
        // Comments Routes
// ===========================================
// var express = require('express');
// var router  = express.Router;
const router = require('express').Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

router.get('/new', isLoggedIn ,(req, res) => {
    Campground.findById(req.params.id, function(err, campground) {
       if(err) throw err;
       else {
        res.render("./comments/new", {campground: campground});
       } 
    });
    
})

router.post("/", isLoggedIn ,function(req, res){
    // lookup camground using id
    Campground.findById(req.params.id, (err, camground) => {
        if(err) throw err;
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) throw err;
                else {
                    comment.author.id = req.user._id; 
                    comment.author.username = req.user.username;
                    comment.save();
                    camground.comments.push(comment);
                    camground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/" + camground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) throw err;
        else {
            console.log(foundComment.text);
            res.render("comments/commentEdit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id",checkCommentOwnership, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) res.redirect("back");
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err) throw err;
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
// middleware 
function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) res.redirect("/campgrounds")
                else {
                    if(foundComment.author.id.equals(req.user._id)) {
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