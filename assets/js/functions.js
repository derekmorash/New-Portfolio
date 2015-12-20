$(function() {
  smoothScroll(300);
  //initialize fit text
  // $('#email').fitText(1, { minFontSize: '10px', maxFontSize: '100px' });

  hugeText('footer--email','email');

  $('#email').fluidText();
});

// smoothScroll function is applied from the document ready function
function smoothScroll (duration) {
	$('a[href^="#"]').on('click', function(event) {

	    var target = $( $(this).attr('href') );

	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, duration);
	    }
	});
}

//Text resizing
function hugeText (p, t) {
  var parent = $('.'+p); //get parent
  var text = $('#'+t);   //get text

  alert(parent.width() + ' and ' + text.width());

  size();

  function size () {
    text.css('font-size', parent.width() / 11.8292);
  }

  $( window ).resize(function() {
    size();
  });

  $( window ).on("orientationchange", function() {
    size();
  });
}


(function($) {
  $.fn.fluidText = function() {
    var parent = $(this);
    // alert(this.html());
    // alert(this.outerWidth());
    alert(parent.html());
    alert(parent.width());
    return this.each(function(){

    });
  };
})(jQuery);
