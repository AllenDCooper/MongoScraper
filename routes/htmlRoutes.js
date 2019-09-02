var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get("/scrape", function(req, res) {
        axios.get("https://www.theatlantic.com/latest/").then(function(response){
            var numScrapes = 0;
            var $ = cheerio.load(response.data);
            $("li.blog-article").each(function(i, element) {
                var result = {};
                result.headline = $(this)
                    .find("h2.hed")
                    .text();
                result.summary = $(this)
                    .children("p")
                    .text();
                result.url = "https://www.theatlantic.com" + $(this)
                    .children("a")
                    .attr("href");
                result.image = $(this)
                    .find("img.lazyload")
                    .attr("data-src");
                var authors = [];
                $(this).find("li.byline").children().each(function(i, element) {
                    var scrapedAuthor = $(this).attr("title")
                    authors.push(scrapedAuthor);
                });
                result.author = authors.join(", ")
                numScrapes++
                // console.log(result);
                db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err)
                });
            });
            console.log(numScrapes);
            res.send({data: numScrapes})
        });
    });

    // Route for getting all articles from the db
    app.get("/articles", )
};

