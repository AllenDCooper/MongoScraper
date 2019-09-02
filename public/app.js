function scrape() {
    return $.ajax({
        url: "/scrape",
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

function renderArticles(data) {
    console.log(data);
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
        var notesBtn = $("<a>").addClass("btn btn-primary btn-notes").text("Add Notes")
        divCardBody.append(divCardTitle, divCardAuthors, divCardText, divCardLink, "<br>", notesBtn, saveBtn);
        divCard.append(divCardImg, divCardBody);
        $("#articles-div").append(divCard);
    })
}

// event handler for when user clickes on "scrape articles" button
// runs scrape function when clicked
$("#scrape-btn").on("click", function(event){
    event.preventDefault();
    // add code to hit scrape route
    scrape().then(function(res) {
        getScrapedArticles().then(function(data) {
            renderArticles(data);
        })
        alert("You have scraped " + res.data + " articles")
    })
})

getScrapedArticles().then(function(data) {
    renderArticles(data);
})

$(document).on("click", ".btn-save", articleSave)

// event handler for when user clicks on "save article" button
// runs saveArticles function when clicked
function articleSave() {
    var articleToSave = $(this).parents(".card").data();
    saveArticles(articleToSave).then(function(response) {
        alert(response);
        getScrapedArticles().then(function(data) {
            renderArticles(data);
        })
    })
}