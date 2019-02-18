$(document).ready(function() {
  // cookie overlay

  if(document.cookie.indexOf('hidecookiedingsbums=1') != -1){
    jQuery('#cookiedingsbums').hide();
  }
  else{
    jQuery('#cookiedingsbums').prependTo('body');
    jQuery('#cookiedingsbumsCloser').show();
  }

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

  // if javascript active remove hidden class for home > social class
  $('.social').removeClass('hidden');

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
});
