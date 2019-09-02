function runScrape() {
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

function renderArticles(data) {
    console.log(data);
    data.forEach(function(element, i) {
        var divCard = $("<div>").addClass("card")
        var divCardBody = $("<div>").addClass("card-body")
        var divCardTitle= $("<h5>").addClass("card-title").text(element.headline);
        var divCardText = $("<p>").addClass("card-text").text(element.summary);
        var divCardLink = $("<a>").attr("href", element.url).text(element.url);
        var divCardImg = $("<img>").attr("src", element.image).addClass("rounded float-left");
        var divCardAuthors = $("<p>").text("Author(s): " + element.author)
        var saveBtn = $("<a>").addClass("btn btn-primary btn-save").text("Save Article")
        divCardBody.append(divCardTitle, divCardAuthors, divCardText, divCardLink, divCardImg, saveBtn);
        divCard.append(divCardBody);
        $("#articles-div").append(divCard);
    })
}

$("#scrape-btn").on("click", function(event){
    event.preventDefault();
    // add code to hit scrape route
    runScrape().then(function(res) {
        getScrapedArticles().then(function(data) {
            renderArticles(data);
        })
        console.log(res.data);
        alert("You have scraped " + res.data + " articles")
    })
})

getScrapedArticles().then(function(data) {
    renderArticles(data);
})