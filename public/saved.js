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

function postNotes(note) {
    return $.ajax({
        url: "/api/notes/" + note._id,
        type: "POST",
        data: note
    })
}

function noteDelete(noteID) {
    return $.ajax({
        url: "/api/notes/" + noteID,
        type: "DELETE",
        data: noteID
    })
}

$(document).on("click", ".btn-unsave", articleUnsave);
$(document).on("click", ".btn-notes", openNotes);
$(document).on("click", ".save-note", saveNotes);
$(document).on("click", ".delete-note", deleteNote);

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
    $("#notes-modal").empty();
    var articleElement = $(this).parents(".card")
    var articleToAddNotes = articleElement.attr("data");
    console.log(articleToAddNotes);
    getNotes(articleToAddNotes).then(function(response) {
        console.log(response);
        console.log(response.notes);
        console.log(response.notes.length);
        var noteList = $("<ul>")
        if (response.notes.length >= 1) {
            response.notes.forEach(function(element) {
                console.log(element.text)
                console.log(element);
                var noteListItem = $("<li>").addClass("list-group-item");
                noteListItem.text(element.text)
                var deleteBtn = $("<button>").addClass("btn btn-danger delete-note").text("x").attr("data", element._id);
                noteListItem.append(deleteBtn);
                noteList.append(noteListItem)
            })
        } else {
            var noteListItem = $("<li>").addClass("list-group-item");
            noteListItem.text("No existing notes")
            noteList.append(noteListItem)
        }
        // build modal
        var modalDiv = $("#notes-modal")
        // var modalDiv = $("<div>").addClass("modal fade").attr("id", "notes-modal").attr("tabindex", "-1");
        var modalDialog = $("<div>").addClass("modal-dialog").attr("role", "documents");
        var modalContent = $("<div>").addClass("modal-content");
        // modal header
        var modalHeader = $("<div>").addClass("modal-header");
            var modalTitle =  $(".modal-title").attr("data", articleToAddNotes).text("Notes for: " + articleToAddNotes);
            var headerButton = $("<button>").addClass("close").attr("data-dismiss", "modal");
        modalHeader.append(modalTitle, headerButton);
        // modal body
        var modalBody =  $("<div>").addClass(".modal-body");
            var textarea = $("<textarea>").attr("placeholder", "Add a Note").addClass("form-control rounded-0 note-field");
        modalBody.append(noteList, textarea);
        // modal footer
        var modalFooter = $("<div>").addClass("modal-footer")
            var footerButtonClose = $("<button>").addClass("btn btn-secondary").attr("data-dismiss", "modal").text("Close")
            var footerButtonSave = $("<button>").addClass("btn btn-primary save-note").attr("data", articleToAddNotes).text("Save Note")
        modalFooter.append(footerButtonClose, footerButtonSave);
        // compose modal
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        modalDiv.append(modalDialog);
        // $(".empty-modal").append(modalDiv);
        $("#notes-modal").modal("show")
    })
}

function saveNotes() {
    var articleID = $(this).attr("data")
    console.log(articleID);
    var note = {}
    note.text = $(".note-field").val();
    note._id = articleID
    console.log(note);
    postNotes(note).then(function(response) {
        $("#notes-modal").modal("hide");
    })
}

function deleteNote() {
    var noteID = $(this).attr("data");
    console.log(noteID)
    noteDelete(noteID).then(function(response) {
        $("#notes-modal").modal("hide");
    })

}