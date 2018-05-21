$(document).ready(function() {
  // image and links to aside
  $("article a").each(function (idx, ele) {
      var newele = $(ele).clone();
      newele.text($(ele).prop("title"));
      $("aside div.linklist").append(newele);
  });
  $("article img").each(function (idx, ele) {
      $("aside div.gallery").append($(ele));
  });

  // if we have desktop
  if($('body').innerWidth() > 768) {
    // disable place holder
    $('.article-wrapper .one').removeClass('grid-item 1/4 compact-hidden').addClass('hidden');

    // change 50% for <article> tag
    $('.article-wrapper article').removeClass('2/4').addClass('1/2');

    // change 50% for <aside> tag
    $('.article-wrapper aside').removeClass('1/4').addClass('1/2');

    // disable link highligthing
    $('.article-wrapper a').addClass('nostyle');
  }

  // if javascript active remove hidden class for home > social class
  $('.social').removeClass('hidden');

  // if javascript active remove hidden class for linklist and gallery in aside of article
  $('.linklist').removeClass('hidden');
  $('.gallery').removeClass('hidden');
});
