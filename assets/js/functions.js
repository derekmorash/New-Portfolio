$(function() {
  smoothScroll(300);

  hugeText('footer--email','email');

  $('#email').fluidText();

  headerPosition();
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

//about section margin-top to position header in the middle of the page
function headerPosition() {
  var about = $('.about'),
    windowHeight;

  reposition();

  function reposition() {
    //get the height of the window
    windowHeight = $(window).height();

    //if the window is taller than 400px
    if(windowHeight > 400) {
      //add a margin-top to the about selection-color
      //margin is half the window height minus the 100px header
      about.css('margin-top', (windowHeight/2) - 100);
    } else {
      //usually for phones in landscape
      //add margin-top of only 50px
      about.css('margin-top', 50);
    }
  }

  //call the reposition function on window resize
  $( window ).resize(function() {
    reposition();
  });
}

//Text resizing
function hugeText (p, t) {
  var parent = $('.'+p); //get parent
  var text = $('#'+t);   //get text

  // alert(parent.width() + ' and ' + text.width());

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
    // alert(parent.html());
    // alert(parent.width());
    return this.each(function(){

    });
  };
})(jQuery);
