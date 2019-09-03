function unsaveArticles(articleID) {
    return $.ajax({
        url: "/api/unsaved/articles/" + articleID,
        type: "PUT",
        data: articleID
    })
}

function getNotes(articleID) {
    return $.ajax({
        url: "/api/notes/" + articleID,
        type: "GET"
    })
}

$(document).on("click", ".btn-unsave", articleUnsave)
$(document).on("click", ".btn-notes", openNotes)

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

function openNotes() {
    var articleElement = $(this).parents(".card")
    var articleToAddNotes = articleElement.attr("data");
    console.log(articleToAddNotes);
    getNotes(articleToAddNotes).then(function(response) {
        console.log(response);
        var noteList = $("<ul>")
        if (response.notes.length > 1) {
            response.notes.forEach(function(element) {
                var noteListItem = $("<li>").addClass("list-group-item");
                noteListItem.text(element.text)
                var deleteBtn = $("<button>").addClass("btn btn-danger delete-note").text("x");
                noteListItem.append(deleteBtn);
                noteList.append(noteListItem)

                // build modal
                $(".modal-title").text("Notes for: " + articleToAddNotes);
                console.log(articleToAddNotes);
                var modalBody =  $(".modal-body");
                modalBody.append(noteList);
                var textarea = $("<textarea>").attr("placeholder", "Add a Note");
                modalBody.append(textarea);
                $('#notes-modal').modal('show')
            })
        } else {
            var noteListItem = $("<li>").addClass("list-group-item");
            noteListItem.text("No existing notes")
            // var deleteBtn = $("<button>").addClass("btn btn-danger delete-note").text("x");
            // noteListItem.append(deleteBtn);
            noteList.append(noteListItem)

            // build modal
            $(".modal-title").text("Notes for: " + articleToAddNotes);
            console.log(articleToAddNotes);
            var modalBody =  $(".modal-body");
            modalBody.append(noteList);
            var textarea = $("<textarea>").attr("placeholder", "Add a Note").addClass("form-control rounded-0");
            modalBody.append(textarea);
            $('#notes-modal').modal('show')
        }
    })
}