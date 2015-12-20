// /*global jQuery */
// /*!
// * FitText.js 1.2
// *
// * Copyright 2011, Dave Rupert http://daverupert.com
// * Released under the WTFPL license
// * http://sam.zoy.org/wtfpl/
// *
// * Date: Thu May 05 14:23:00 2011 -0600
// */

// (function( $ ){
//
//   $.fn.fitText = function( kompressor, options ) {
//
//     // Setup options
//     var compressor = kompressor || 1,
//         settings = $.extend({
//           'minFontSize' : Number.NEGATIVE_INFINITY,
//           'maxFontSize' : Number.POSITIVE_INFINITY
//         }, options);
//
//     return this.each(function(){
//
//       // Store the object
//       var $this = $(this);
//
//       // Resizer() resizes items based on the object width divided by the compressor * 10
//       var resizer = function () {
//         $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
//       };
//
//       // Call once to set.
//       resizer();
//
//       // Call on resize. Opera debounces their resize by default.
//       $(window).on('resize.fittext orientationchange.fittext', resizer);
//
//     });
//
//   };
//
// })( jQuery );
//
// (function($) {
//     $.fn.textfill = function(maxFontSize) {
//         maxFontSize = parseInt(maxFontSize, 10);
//         return this.each(function(){
//             var ourText = $("span", this),
//                 parent = ourText.parent(),
//                 maxHeight = parent.height(),
//                 maxWidth = parent.width(),
//                 fontSize = parseInt(ourText.css("fontSize"), 10),
//                 multiplier = maxWidth/ourText.width(),
//                 newSize = (fontSize*(multiplier-0.1));
//             ourText.css(
//                 "fontSize",
//                 (maxFontSize > 0 && newSize > maxFontSize) ?
//                     maxFontSize :
//                     newSize
//             );
//         });
//     };
// })(jQuery);
