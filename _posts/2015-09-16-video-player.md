---
layout: posts
title: Angular Video Player
date:   2015-09-16
thumbnail: wordpress-management.jpg
assets: /assets/post-assets/angular-video/
categories: work
tags: angular css video
---
This video player was built from an angular.js video tutorial on <a href="http://www.lynda.com/" target="blank">Lynda.com</a>. It was a fun course for learning some ways to use angular but when I finished it I wasn’t completely happy with the look and functionality. I won’t be going through how to build the entire thing, because that’s what the course is for, I’ll only be documenting and explaining some of the thing’s I did differently.

View the <a href="http://derekmorash.github.io/AngularVideoPlayer/" target="blank">project</a> or the <a href="https://github.com/derekmorash/AngularVideoPlayer" target="blank">repo</a>.

###Progress bar/thumb scrubber
The original video player took up the whole width of the browser, it was responsive but the player got too tall when the browser was full width of the screen causing the player toolbar to be pushed down below the window. The video below demonstrates this problem.

<video controls>
  <source src="{{ page.assets }}lynda-video.mp4" type="video/mp4">
  Your browser does not support the HTML5 video tag, please upgrade.
</video>

You can also view the completed course version of the project <a href="http://derekmorash.github.io/AngularVideoPlayer/lynda.html" target="blank">here</a>.

So I made the player a max-width of 800px, this stopped the player from getting too tall at larger screen widths but it created other problems with the video progress bar and thumb scrubber. The progress bar is the red line at the bottom of the video showing the amount of time in the video has gone by, and the thumb scrubber is the little circle used for scrubbing through the video.

The progress bar and thumb scrubber were made to transition from the left side of the window to the right, instead of the left side of the player to the right. This was fine when the player was the full width of the window, but once I added the 800px max-width the thumb scrubber would always start at the far left of the window but end at the end position on the player, while the progress bar started at the beginning of the player (like it should) and ended at the far right of the window which is past the player end.

<video controls>
  <source src="{{ page.assets }}broken-progress.mp4" type="video/mp4">
  Your browser does not support the HTML5 video tag, please upgrade.
</video>

I needed to do a couple things to fix this.

The progress bar and thumb scrubber are updated by a function that is called at an interval of 100ms. The function checks to see that the thumb scrubber isn’t currently being dragged by the user, if it’s not then the width of the bar is updated to represent the current time of the video compared to the overall duration of the video.

Three variables are needed; the current time “t”, the duration “d”, and the width of the video player “p”. The equation is “(t / d * p)”. This gives the width in pixels that the progress bar will be to represent the current time played in the video.

{% highlight javascript %}
$interval(function(){
  if(!$scope.isDragging){
      var t = $scope.videoDisplay.currentTime;
      var d = $scope.videoDisplay.duration;
      var p = document.getElementById('progressMeterFull').offsetWidth;
      $scope.scrubLeft = (t / d * p) - 7;
    }else{
      $scope.scrubLeft = document.getElementById('thumbScrubber').offsetLeft;
    }
    $scope.updateLayout();
  }, 100);
{% endhighlight %}

This only works if the width of the player is taking up the full width of the browser window. For the thumb scrubber I needed to get the distance between the left browser window and the video player and add it to the original equation. For this I used the offsetLeft method in javascript on the progress meter element. This is variable “l”, and the new equation for the thumb scrubber position is “(t / d * p) + l”. The equation for the progress bar doesn’t need to be changed, only the thumb scrubber. All together the new function looks like this:

{% highlight javascript %}
$interval(function(){
  if(!$scope.isDragging) {
    var t = $scope.videoDisplay.currentTime;
    var d = $scope.videoDisplay.duration;
    var p = document.getElementById('progressMeterFull').offsetWidth;
    var l = document.getElementById('progressMeterFull').offsetLeft; //offset left to add any space needed from browser width
    $scope.thumbLeft = (t / d * p) - 7  + l; //Set the thumb scrubber position
    $scope.scrubLeft = (t / d * p) - 7; //set the width of the progress bar
    $scope.updateLayout();
  } else {
    $scope.thumbLeft = document.getElementById('thumbScrubber').offsetLeft; //change thumb scrubber position
    $scope.scrubLeft = document.getElementById('thumbScrubber').offsetLeft; //change progress bar position
  }
  $scope.updateLayout();
},100);
{% endhighlight %}

###Video player toolbar layout

I didn’t like how the player toolbar, where all the video controls are, was below the video. I moved the toolbar to inside the the video container and positioned it absolute to be at the bottom and to be 100% the width of the video.

{% highlight css %}
.playerToolBar {
   width: 100%;
   position: absolute;
   bottom: 0;
   left: 0;
}
{% endhighlight %}

This puts the toolbar in the right place but now it’s covering part of the video. I set the toolbar opacity to 0 to hide until the user hovers over any part of the video. I also added a transition on the opacity. When the user hovers over the video the toolbar opacity changes from 0 to 1 over 0.15 seconds, and after the user moves the mouse off the video the opacity stays at 1 for a 1 second delay before fading back to 0.

{% highlight css %}
.playerToolBar {
   opacity: 0;
   transition: opacity 0.35s ease-out 1s;
}
.responsive-16by9:hover .playerToolBar {
   opacity: 100;
   transition: opacity 0.15s ease-in;
}
{% endhighlight %}
