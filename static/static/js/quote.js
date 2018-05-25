  // guotes read from file
  $("#get-another-quote-button").on("click", function() {
    $.getJSON("/static/q.json", function(json) {
      var content = "",
          author = "",
          num = Math.floor(Math.random() * 20);
          content = json[num]["content"]
          author = json[num]["author"];
      $("#quote").html(content);
      $("#author").html("*" + author);
    });
  });
