//= ../../../node_modules/slick-carousel/slick/slick.js

$(function() {
    $('.title__link').on('click', function(e) {
    e.preventDefault();
    $('.link__article').each(function() {
    $(this).css('display', 'none');
    });
    var block = $(this).attr('href');
    $(block).css('display', 'block');
    });
    });

$('.').addClass('summary');