var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    saved: {
        type: Boolean,
        required: true,
        default: false,
    },
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    author: {}
})

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;