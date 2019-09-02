var db = require("../models");

module.exports = function(app) {
   app.get("/api/articles", function(req, res) {
       db.Article.find({})
       .then(function(dbArticle) {
           res.json(dbArticle);
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