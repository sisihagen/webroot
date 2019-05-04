$(document).ready(function() {
  // cookie overlay

  if(document.cookie.indexOf('hidecookiedingsbums=1') != -1){
    jQuery('#cookiedingsbums').hide();
  }
  else{
    jQuery('#cookiedingsbums').prependTo('body');
    jQuery('#cookiedingsbumsCloser').show();
  }

  // if javascript active remove hidden class for home > social class
  $('.social').removeClass('hidden');

  // if we have desktop
  if($('body').innerWidth() > 1000) {

    // image and links to aside
    $("article a").each(function (idx, ele) {
        var newele = $(ele).clone();
        newele.text($(ele).prop("title"));
        $("aside div.linklist").append(newele);
    });
    $("article img").each(function (idx, ele) {
        $("aside div.gallery").append($(ele));
    });

    // disable link highligthing
    $('.article-wrapper a').addClass('nostyle');

    // if javascript active remove hidden class for linklist and gallery in aside of article
    $('.linklist').removeClass('hidden');
    $('.gallery').removeClass('hidden');

    // check if linklist and gallery have values
    if ($('.gallery').children().length <=1) {
      $('.gallery').hide();
    }

    if ($('.linklist').children().length <=1) {
      $('.linklist').hide();
    }
  }

  // to top  button include
  var back_to_top_button = ['<a href="#top" class="back-to-top"><svg class="icon icon-arrow-up" style="fill:black;width:2rem;height:2rem;"><use xlink:href="/static/img/symbol-defs.svg#icon-arrow-up"></use></svg></a>'].join("");
  $("body").append(back_to_top_button)

  // hide the button
  $(".back-to-top").hide();

  // scolling
  $(function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn();
      } else {
        $('.back-to-top').fadeOut();
      }
    });

    $('.back-to-top').click(function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });
  });

  // twitter
    //i variable declared to increment and assign a new class each time to the div
    var i = 1;

    //get the last 10 Twitter post and stores them in a JSON array
    $.getJSON('/static/twitter.json', function(data) {
        listTweets(data);
    });

    /**
     * Function to create the tweet div and append the tweet in the div
     * @param data
     */
    function listTweets(data) {
        $.each(data, function(index) {
            //logs data to console
            //console.log(data[index]);

            /**
             * Creates a new tweet div
             * if i = 1 need to set active
             */
            if(i == 1) {
                $('.tweetList').append('<div class="tweet-' + i + ' item active"></div>');
            } else {
                $('.tweetList').append('<div class="tweet-' + i + ' item"></div>');
            }

            //append the variable data into the new tweet div
            // $('.tweet-' + i + '').append(checkURL(convertUserMentions(convertHashtags(data[index]['text']))));
            $('.tweet-' + i + '').append(twitterLinks(data[index]['text']));
            //$('.tweet-' + i + '').append('<p>' + data[index]['created_at'] + '</p>');

            //increments the value of i
            increment();
        });
    }

    /**
     * Function to increment the value of i
     * @returns {int}
     */
    function increment(){
        i++;
        return i;
    }

    // Convert URLs (w/ or w/o protocol), @mentions, and #hashtags into anchor links
    function twitterLinks(text)
    {
        var base_url = 'http://twitter.com/';   // identica: 'http://identi.ca/'
        var hashtag_part = 'search?q=#';        // identica: 'tag/'
        // convert URLs into links
        text = text.replace(
            /(>|<a[^<>]+href=['"])?(https?:\/\/([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.,]*[^ !#?().,])?)/gi,
            function($0, $1, $2) {
                return ($1 ? $0 : '<a href="' + $2 + '" target="_blank">' + $2 + '</a>');
            });
        // convert protocol-less URLs into links
        text = text.replace(
            /(:\/\/|>)?\b(([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.]*[^ !#?().,])?)/gi,
            function($0, $1, $2) {
                return ($1 ? $0 : '<a href="http://' + $2 + '">' + $2 + '</a>');
            });
        // convert @mentions into follow links
        text = text.replace(
            /(:\/\/|>)?(@([_a-z0-9\-]+))/gi,
            function($0, $1, $2, $3) {
                return ($1 ? $0 : '<a href="' + base_url + $3
                    + '" title="Follow ' + $3 + '" target="_blank">@' + $3
                    + '</a>');
            });
        // convert #hashtags into tag search links
        text = text.replace(
            /(:\/\/[^ <]*|>)?(\#([_a-z0-9\-]+))/gi,
            function($0, $1, $2, $3) {
                return ($1 ? $0 : '<a href="' + base_url + hashtag_part + $3
                    + '" title="Search tag: ' + $3 + '" target="_blank">#' + $3
                    + '</a>');
            });
        return text;
    }
});
