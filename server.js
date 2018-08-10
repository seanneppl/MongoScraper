var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 5000;

// Initialize Express
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Routes

// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  axios.get("https://www.wired.com/most-recent/").then(function(response) {

    var $ = cheerio.load(response.data);

    var articles = [];

    $(".archive-list-component__items li").each(function(i, element) {
      var result = {};

      result.link = "https://www.wired.com"

      result.title = $(this)
        .find("h2")
        .text();
      result.link += $(this)
        .children("a")
        .attr("href");
      result.image = $(this)
        .find("img")
        .attr("src");
      result.description = $(this)
        .find("p")
        .text();

      articles.push(result);

    });
    res.json(articles);
  });
});



// route for creating new saved articles and placing them in the database
app.post("/save", function (req, res) {
  db.Article.create(req.body)
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});



// Route for getting all Articles from the db
app.get("/saved", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});



// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});



// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, new: true})
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});



// Delete One from the DB
app.get("/delete/:id", function (req, res) {
  db.Article.deleteOne(
    {
      _id: req.params.id
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
