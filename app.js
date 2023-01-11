//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost/blogDB',{useNewUrlParser: true});

const postsSchema = ({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postsSchema);

const day1 = new Post ({
  title: "Day 1",
  content: "To be or not to be..."
});

const listSchema = {
  name: String,
  journal: [postsSchema]
};

defaultItems = [];

const List = mongoose.model("List", listSchema);

//Created list in the app.get compose
// const list = new List ({
//   entries: []
// });

app.get("/home", function(req, res) {

  List.findOne({name: "log"}, function(err, foundList) {
    if (err) {
      console.log(err);
    }
    else if (!foundList) {
      const list = new List ({
        name: "log",
        journal: defaultItems
      });
      list.save();
      console.log("JOurnal has been made");
    }
  });

  Post.find(function(err, foundItem) {

    if (foundItem.length === 0) {
      Post.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("I was able to add those");
        };
      });
    }
    res.render("home.ejs", {homeStartingContent:homeStartingContent, posts:foundItem});
  });



});

app.get("/", function(req, res) {
  res.redirect("/home");
});

app.get("/home/:post", function(req, res) {
  const postTitle = _.capitalize(req.params.post);
  // const postTitle = _.lowerCase(req.params.post);
  // console.log(postTitle);
  // console.log(_.lowerCase(req.params.post));
  List.findOne({name: "log"}, function(err, foundList) {
    foundList.journal.forEach(function(post) {
      console.log(_.lowerCase(post.title));
      if (_.lowerCase(post.title) == _.lowerCase(req.params.post)) {
        res.render("post.ejs", {postTitle: post.title, postContent: post.content})
  }}
)
  // post.forEach(function(post) {
  //   console.log(_.lowerCase(post.title));
  //   if (_.lowerCase(post.title) == _.lowerCase(req.params.post)) {
  //     res.render("post.ejs", {postTitle: post.title, postContent: post.content})
  //     // console.log(_.lowerCase(post.title));
  //   }
  // });

});
});

app.post("home/:post", function(req, res) {
  res.redirect("/home/:post");
})

app.post("/about", function(req, res) {
  res.redirect("/about");
});

app.get("/about", function(req, res) {
  res.render("about.ejs", {aboutContent: aboutContent});
});

app.post("/contact", function(req, res) {
  res.redirect("/contact");
});

app.get("/contact", function(req, res) {
  res.render("contact.ejs", {contactContent: contactContent});
});

app.post("/home", function(req, res) {
  res.redirect("/home");
});

app.get("/compose", function(req, res) {
  res.render("compose.ejs");
});

app.post("/compose", function(req, res) {
  const title = req.body.title;
  const content = req.body.postText;
  // console.log(title);
  // console.log(content);
  const post = new Post({
    title: title,
    content: content
  });

  List.findOne({name: "log"}, function(err, foundList) {
    foundList.journal.push(post);
    foundList.save()
    Post.insertMany(post, function(err) {
        if (err) {
          console.log(err)
        } else {
          defaultItems.push(post);
          res.redirect("home");
        }
        });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
