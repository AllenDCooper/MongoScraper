function unsaveArticles(articleID) {
    return $.ajax({
        url: "/api/unsaved/articles/" + articleID,
        type: "PUT",
        data: articleID
    })
}

$(document).on("click", ".btn-unsave", articleUnsave)

// runs unsaveArticles function when clicked
function articleUnsave() {
    var articleElement = $(this).parents(".card")
    var articleToUnsave = articleElement.attr("data");
    articleElement.remove();
    unsaveArticles(articleToUnsave).then(function(response) {
        alert(response);
    window.location.href = "/saved"
    })
}