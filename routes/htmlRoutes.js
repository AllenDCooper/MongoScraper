var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('home');
    });

    // Route for getting the saved articles from the DB
    app.get("/saved", function(req, res) {
        db.Article.find({ saved: true}).then(function(results) {
            res.render("saved", {
                articles: results
            });
        });
    });
};

