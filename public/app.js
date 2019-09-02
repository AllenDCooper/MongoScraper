function runScrape() {
    return $.ajax({
        url: "/scrape",
    })
}

$("#scrape-btn").on("click", function(event){
    event.preventDefault();
    // add code to hit scrape route
    runScrape().then(function(res) {
        console.log(res.data);
        alert("You have scraped " + res.data + " articles")
    })
})