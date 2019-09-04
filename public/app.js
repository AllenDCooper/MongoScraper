function scrape() {
    return $.ajax({
        url: "api/scrape",
        type: "GET"
    })
}

function getScrapedArticles() {
    return $.ajax({
        url: "/api/articles",
        type: "GET"
    })
}

function saveArticles(article) {
    return $.ajax({
        url: "/api/articles/" + article._id,
        type: "PUT",
        data: article
    })
}

function deleteAllArticles() {
    return $.ajax({
        url: "/api/articles",
        type: "DELETE"
    })
}

function renderArticles(data) {
    // console.log(data);
    $("#articles-div").empty();
    data.forEach(function(element, i) {
        var divCard = $("<div>").addClass("card").data(element);
        var divCardBody = $("<div>").addClass("card-body")
        var divCardTitle= $("<h5>").addClass("card-title").text(element.headline);
        var divCardText = $("<p>").addClass("card-text").text(element.summary);
        var divCardLink = $("<a>").attr("href", element.url).text(element.url);
        var divCardImg = $("<img>").attr("src", element.image).addClass("card-img-top");
        var divCardAuthors = $("<p>").text("Author(s): " + element.author)
        var saveBtn = $("<a>").addClass("btn btn-primary btn-save").text("Save Article")
        // var notesBtn = $("<a>").addClass("btn btn-primary btn-notes").text("Add Notes")
        divCardBody.append(divCardTitle, divCardAuthors, divCardText, divCardLink, "<br>", saveBtn);
        divCard.append(divCardImg, divCardBody);
        $("#articles-div").append(divCard);
    })
}

// event handler for when user clickes on "scrape articles" button
// runs scrape function when clicked
$("#scrape-btn").on("click", function(event){
    event.preventDefault();
    // add code to hit api scrape route
    scrape().then(function(res) {
        console.log(JSON.stringify(res.newScrapes));
        $("#modal-text").text("You have scraped " + res.numScrapes + " articles")
        $("#article-scrape-modal").modal("show");
        getScrapedArticles().then(function(dbArticles) {
            renderArticles(dbArticles);
        })
    })
})

// event handler for when user clicks on "save article" button
$(document).on("click", ".btn-save", articleSave)

// runs saveArticles function when clicked
function articleSave() {
    var articleElement = $(this).parents(".card")
    var articleToSave = articleElement.data();
    articleElement.remove();
    saveArticles(articleToSave).then(function(response) {
    window.location.href = "/saved"
    })
}

// deletes scraped articles
$("#delete-articles-btn").on("click", function(event) {
    event.preventDefault();
    deleteAllArticles().then(function() {
        getScrapedArticles().then(function(data) {
            renderArticles(data);
        })
    })
});

getScrapedArticles().then(function(data) {
    renderArticles(data);
})