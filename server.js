var express = require('express');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

// require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require models
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
app.set("view engine", "handlebars");
 
// Routes
require("./routes/htmlRoutes.js")(app);
require("./routes/apiRoutes.js")(app);

// Start server
app.listen(PORT, function() {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});

// Connect to Mongo DB
mongoose.connect("mongodb://localhost/mongoScraperDB", { useNewURLParser: true});

