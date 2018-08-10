$(document).ready(function () {

  // Grab the articles as a json
  var dataArray;

  $(document).on("click", "#scrape", function (e) {
    e.preventDefault();

    $.getJSON("/scrape", function (data) {
      console.log("get req: ", data)
      dataArray = data;
      $("#articles").empty();

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
      .then(function (data) {
        console.log(data);
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
      .then(function (data) {
        // The title of the article
        $("#notes" + noteId).append("<h2>" + data.title + "</h2>");
        $("#notes" + noteId).append("<input id='titleinput" + noteId + "' name='title' >");
        $("#notes" + noteId).append("<textarea id='bodyinput" + noteId + "' name='body'></textarea>");
        $("#notes" + noteId).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
          $("#titleinput" + noteId).val(data.note.title);
          $("#bodyinput" + noteId).val(data.note.body);
        }
      });
  });


  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");
    console.log("this: ", thisId)
    var noteId = $(this).parent().attr("data-id");
    var articleId = $(this).parent().attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput" + noteId).val(),
        body: $("#bodyinput" + noteId).val()
      }
    })
      .then(function (data) {
        console.log(data);

        $("#notes" + noteId).empty();

        $("#articles" + articleId).show();
        $("#notes" + noteId).hide();
      });

    $("#titleinput" + noteId).val("");
    $("#bodyinput" + noteId).val("");
  });

  // When user clicks the delete button for a note
  $(document).on("click", "#delete", function () {
    var selected = $(this).parent().parent();
    $.ajax({
      type: "GET",
      url: "/delete/" + $(this).attr("data-id"),

      success: function (response) {
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