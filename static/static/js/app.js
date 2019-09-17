$(document).ready(function() {

  // if we have desktop
  if($('body').innerWidth() > 1000) {

    // disable link highligthing
    $('article a').addClass('nostyle');

    // build grid system, left text, right picture and source
    $('.article__source').removeClass('hidden');
    $('.article__gallery').removeClass('hidden');

    // image and links to aside
    $('article a').each(function (idx, ele) {
        var newele = $(ele).clone();
        newele.text($(ele).prop("title"));
        $('aside div.article__source').append(newele);

        if($('.article__source a[href*="twitter"]').length > 0){
          $('.article__source a[href*="twitter"]').hide();
        }

        if($('.article__source a[href*="t.co"]').length > 0){
          $('.article__source a[href*="t.co"]').hide();
        }

    });

    $('article img').each(function (idx, ele) {
        $('aside div.article__gallery').append($(ele));
    });




    // check if linklist and gallery have values
    if ($('.article__gallery').children().length <=1) {
      $('.article__gallery').hide();
    }

    if ($('.article__source').children().length <=1) {
      $('.article__source').hide();
    }
  }

  // to top  button include
  var back_to_top_button = ['<a href="#top" class="back-to-top"><span class="icon-arrow-up" aria-hidden="true"></a>'].join("");
  $("body").append(back_to_top_button)

  // hide the button
  $('.back-to-top').hide();

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
});
