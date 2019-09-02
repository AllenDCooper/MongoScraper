var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var async = require("async")

module.exports = function(app) {
    app.get("/api/scrape", function(req, res) {
        // utilize async library to run asynchronous API calls and database queries
        async.waterfall(
            [
                function(callback) {
                    // use axios library to call website for scraping
                    axios.get("https://www.theatlantic.com/latest/").then(function(response) {
                        // initialize scraped articles array for storing articles scraped from website
                        var allScrapedArticlesArr = [];
                        // utilize cheerio library
                        var $ = cheerio.load(response.data);
                        // scrape articles from website, building result object for each article
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
                            // scrape authors and then store them in a single array
                            var authors = [];
                            $(this).find("li.byline").children().each(function(i, element) {
                                var scrapedAuthor = $(this).attr("title")
                                authors.push(scrapedAuthor);
                            });
                            // convert author array into a string, and store it on the result object
                            result.author = authors.join(", ")
                            // push entire result object into the scraped articles array
                            allScrapedArticlesArr.push(result);
                        })
                        // callback function to pass the completed scraped articles array to the next function
                        callback(null, allScrapedArticlesArr)
                    })
                },
                function(allScrapedArticlesArr, mainCallback) {
                    // initialize array to store articles not previously scraped and saved into Mongo DB
                    var newArticlesArr = [];
                    // loop through all of the scraped articles from previous function to verify which ones are new
                    async.forEachOf(allScrapedArticlesArr, function(responseElement, i, callback) {
                        // check to see if object matches document already in Mongo DB
                        db.Article.findOne({headline: responseElement.headline}).then(function(isMatch) {
                            // if not a match, then save to Mongo DB and push to newArticles array
                            if (!isMatch) {
                                db.Article.create(responseElement)
                                .then(function() {
                                    newArticlesArr.push(responseElement);
                                    callback()
                                })
                                .catch(function(err) {
                                    console.log(err)
                                });
                            } else {
                                callback();
                            }
                        })
                    }, 
                    function(err) {
                        if(err) {
                            throw err;
                        }
                        mainCallback(null, newArticlesArr);
                    });
                }
            ],
            // return number of new articles found back to the user
            function(err, newArticlesArr) {
                res.send({ numScrapes: newArticlesArr.length })
            }
        );
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