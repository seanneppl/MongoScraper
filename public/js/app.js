$(document).ready(function () {

  // Grab the articles as a json
  var dataArray;

  $(document).on("click", "#scrape", function (e) {
    e.preventDefault();

    $.getJSON("/scrape", function (data) {
      console.log("get req: ", data)
      dataArray = data;
      $("#articles").empty();

      // For each one
      for (var i = 0; i < data.length; i++) {
        newCard(data, i);
      }
    });
  });

  $(document).on("click", "#savedArticles", function (e) {
    e.preventDefault();
    $.getJSON("/saved", function (data) {
      $("#articles").empty();
      console.log("get req: ", data)
      // For each one
      for (var i = 0; i < data.length; i++) {
        newCard(data, i, true);
      }
    });
  });

  $(document).on("click", "#saveArticle", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    // console.log(dataArray[thisId]);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/save",
      data: {
        title: dataArray[thisId].title,
        link: dataArray[thisId].link,
        image: dataArray[thisId].image,
        description: dataArray[thisId].description
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
      });
  });


  // Whenever someone clicks a #savedArticle
  $(document).on("click", "#update", function () {
    var thisId = $(this).attr("data-id");
    var noteId = $(this).parent().attr("data-id");
    var articleId = $(this).parent().attr("data-id");

    $("#articles" + articleId).hide();
    $("#notes" + articleId).show();

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        // console.log($(this).parent().find(".notes"));
        $("#notes" + noteId).append("<h2>" + data.title + "</h2>");
        // console.log("#notes" + noteId);
        // An input to enter a new title
        $("#notes" + noteId).append("<input id='titleinput" + noteId + "' name='title' >");
        // A textarea to add a new note body
        $("#notes" + noteId).append("<textarea id='bodyinput" + noteId + "' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes" + noteId).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput" + noteId).val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput" + noteId).val(data.note.body);
        }
      });
  });


  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log("this: ", thisId)
    var noteId = $(this).parent().attr("data-id");
    var articleId = $(this).parent().attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput" + noteId).val(),
        // Value taken from note textarea
        body: $("#bodyinput" + noteId).val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes" + noteId).empty();

        $("#articles" + articleId).show();
        $("#notes" + noteId).hide();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput" + noteId).val("");
    $("#bodyinput" + noteId).val("");
  });

  // When user clicks the delete button for a note
  $(document).on("click", "#delete", function () {
    // Save the p tag that encloses the button
    var selected = $(this).parent().parent();
    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    $.ajax({
      type: "GET",
      url: "/delete/" + $(this).attr("data-id"),

      // On successful call
      success: function (response) {
        // Remove the p-tag from the DOM
        selected.remove();

      }
    });
  });


  // // // // // // // // // // // // // // // // // // // // // // // // 

  // update dom
  function draggable() {
    $(".draggable").draggable({ stack: ".draggable", containment: "body" });
  };

  //call dragable on load
  draggable();

  function newCard(data, i, alt = false) {
    var containDiv = $('<div class="draggable">');
    var newDiv = $('<div class="articles" id="articles' + i + '" data-id="' + i + '">');
    var noteDiv = $('<div class="notes" id="notes' + i + '" data-id="' + i + '">');

    newDiv.append("<img src='" + data[i].image + "'>");
    newDiv.append("<a href='" + data[i].link + "'>" + data[i].title + "</a>");
    newDiv.append("<p>" + data[i].description + "</p>");

    if (alt) {
      newDiv.append("<button  data-id='" + data[i]._id + "' id='update'>Update</button>");
      newDiv.append("<button  data-id='" + data[i]._id + "' id='delete'>X</button>");
    } else {
      newDiv.append("<button  data-id='" + i + "' id='saveArticle'>Save</button>")
    }

    var randomHeight = (Math.floor(Math.random() * ($(window).height() - 475) + 50));
    var randomWidth = (Math.floor(Math.random() * ($(window).width() - 350)) + 50);
    containDiv.css("top", randomHeight);
    containDiv.css("left", randomWidth);

    noteDiv.hide();

    containDiv.append(newDiv);
    containDiv.append(noteDiv);

    $("#articles").append(containDiv);

    //call draggable whenever a newCard is created
    draggable();
  };
});