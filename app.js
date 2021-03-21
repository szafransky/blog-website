//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// Requiring the lodash library
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const postsArray = [];

// Connect to mongodb
mongoose.connect('mongodb+srv://admin-blazej:MyNewPassword123@cluster0.pmf2b.mongodb.net/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//create Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

let posts = [];

// let post1 = new Post({title: 'How to become JS developer', content: "Required education varies; some employers want developers who hold a bachelor's degree in computer science or computer programming, while others look for people who have work experience, a strong portfolio, and are certified in various programming languages"});
//
// let post2 = new Post({title: 'How to maintain discipline', content: "Programmers need systems and discipline because programming is difficult. This is well understood. But precisely how this difficulty manifests is crucial to understanding the programmer’s job."});
//
// let postArray = [post1, post2];
// Post.insertMany(postArray, function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Success');
//     }
//   });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//home
app.get('/', (req, res) => {

Post.find({}, function(err, foundList) {
  if(!err) {
    console.log(foundList);
    posts = foundList;

    res.render('home', {
      homeDescription: homeStartingContent,
      postsList: posts
    });
  }
});



});

//about
app.get('/about', (req, res) => {
  res.render('about', {
    aboutDescription: aboutContent
  });
});

//contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    contactDescription: contactContent
  });
});

//compose a post
app.get('/add-post', (req, res) => {
  res.render('compose');
});

//post a text on da blooog
app.post('/add-post', (req, res) => {

  let post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();


  res.redirect('/');
});

app.get('/posts/:postTitle', (req, res) => {
  console.log(req.params.postTitle.toLowerCase());
  Post.find({}, function(err, foundList) {
    if(!err) {
      console.log(foundList);
      posts = foundList;

      res.render('home', {
        homeDescription: homeStartingContent,
        postsList: posts
      });
    }
  });
  posts.forEach(el => {
    let title = _.replace(req.params.postTitle, '-', ' ').toLowerCase();
    console.log(title);
    console.log(el.title.toLowerCase());
    if (el.title.toLowerCase() == title) {
      console.log('Found');
      res.render('post', {
        postTitle: el.title,
        postBody: el.content
      });
    } else {
      console.log('Not found');
    }
  });
});

app.listen(process.env.PORT || 3002, function() {
  console.log("Server started on port 3000");
});
