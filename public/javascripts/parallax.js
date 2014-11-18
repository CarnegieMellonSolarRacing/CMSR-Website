function trackPage()
{    
    var $bgobj = $(".ha-bg-parallax"); // assigning the object

    var yPos = -($(window).scrollTop() / $bgobj.data('speed'));

    // Put together our final background position

    var coords = '100% ' + yPos + 'px';

    // Move the background

    $bgobj.css({ backgroundPosition: coords });
}

function parallax()
{
    "use strict";
    trackPage();

    $(window).on("scroll", trackPage);

    $('div.product-chooser').not('.disabled').find('div.product-chooser-item').on('click', function(){
        $(this).parent().parent().find('div.product-chooser-item').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop("checked", true);       
    });
};

$(parallax);

