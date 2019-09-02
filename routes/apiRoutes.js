var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    app.get("/api/scrape", function(req, res) {
        axios.get("https://www.theatlantic.com/latest/").then(function(response) {
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

                // check to see if object matches document already in Mongo DB
                db.Article.findOne({headline: result.headline}).then(function(isMatch) {
                    // console.log(isMatch);
                    if (!isMatch) {
                        db.Article.create(result)
                        .then(function(dbArticle) {
                            // console.log(dbArticle);
                            numScrapes++
                            console.log(numScrapes);
                        })
                        .catch(function(err) {
                            console.log(err)
                        });
                    }
                })
                // db.Article.create(result)
                // .then(function(dbArticle) {
                //     console.log(dbArticle);
                // })
                // .catch(function(err) {
                //     console.log(err)
                // });
            })
                // console.log("Number of scrapes: " + numScrapes);
                // res.send({ numScrapes: numScrapes })
        })
    });
   
    app.get("/api/articles", function(req, res) {
       db.Article.find({ saved: false })
       .then(function(dbArticles) {
           res.json(dbArticles);
       })
       .catch(function(err) {
           res.json(err)
       })
   })

   app.put("/api/articles/:id", function(req, res) {
       db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
       .then(function(dbArticle) {
           res.send("Article saved")
       })
       .catch(function(err){
           res.send("Error")
       })
   })
};