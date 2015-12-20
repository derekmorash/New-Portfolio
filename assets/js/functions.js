$(function() {
  smoothScroll(300); //call smoothScroll function
  $('#email').fluidText(); //call fluidText Function
  headerPosition(); //call headerPosition function
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
  var about = $('.about');
  var windowHeight;

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

  //call the reposition function on window resize
  $( window ).on("orientationchange", function() {
    reposition();
  });
} //end headerPosition

/*
 * Based on fitText.js
 * Copyright 2011, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
*/
(function($) {
  $.fn.fluidText = function() {

    //store the text element we want to resize
    var text = $(this);

    return this.each(function(){

      var parent;

      size();

      function size () {
        //get the width of the texts parent container
        parent = text.parent();

        //resize the text acording to the parent width
        text.css('font-size', parent.width() / 11.8292);
      }

      //call the size function on window resize
      $( window ).resize(function() {
        size();
      });

      //call the size function on window orientation change (for mobile devices)
      $( window ).on("orientationchange", function() {
        size();
      });

    });
  };
})(jQuery);
