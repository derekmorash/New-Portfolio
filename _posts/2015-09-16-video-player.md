---
layout: posts
title: Angular Video Player
date:   2015-09-16
thumbnail: angular.png
assets: /assets/post-assets/angular-video/
categories: work
tags: angular css video
---
This video player was built from an angular.js video tutorial on <a href="http://www.lynda.com/" >Lynda.com</a>. It was a fun course for learning some ways to use angular but when I finished it I wasn’t completely happy with the look and functionality. I won’t be going through how to build the entire thing, because that’s what the course is for, I’ll only be documenting and explaining some of the thing’s I did differently.

View the <a href="http://derekmorash.github.io/AngularVideoPlayer/" >project</a> or the <a href="https://github.com/derekmorash/AngularVideoPlayer" >repo</a>.

###Progress bar/thumb scrubber
The original video player took up the whole width of the browser, it was responsive but the player got too tall when the browser was full width of the screen causing the player toolbar to be pushed down below the window. The video below demonstrates this problem.

<video controls>
  <source src="{{ page.assets }}lynda-video.mp4" type="video/mp4">
  Your browser does not support the HTML5 video tag, please upgrade.
</video>

You can also view the completed course version of the project <a href="http://derekmorash.github.io/AngularVideoPlayer/lynda.html" >here</a>.

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

![player toolbar]({{ page.assets }}video-toolbar.png "player toolbar")

###Refactoring CSS

Another thing I changed for this project was how the layout was built. The original course project was built on the bootstrap framework, which can be useful for some projects but for this I found it to be completely overkill. If the project was to build a full video hosting platform then I could see something like bootstrap being very beneficial, but for this small single page video player it is unnecessary.

The most important thing I needed to do was to get the video player container to be the right size for a 16:9 aspect ratio video.

This turned out to be easier than I expected. The main thing needed is a little trick with padding-bottom of 56.25%.

{% highlight css %}
.responsive-16by9 {
  position: relative;
  display: block;
  max-width: 100%;
  height: 0;
  margin: 0 auto;
  padding: 0 0 56.25% 0;
  overflow: hidden;
}
{% endhighlight %}

Another big change to the css that I made was how the playlist videos are displayed. They used to be in a list with just the title of each video, but I wanted to have a thumbnail and the duration of the video displayed as well.

I started by making a simple responsive grid using floats and margins for spacing.

The playlist container with a max-width, and a clearfix on the ::after pseudo class.

{% highlight css %}
.playlist-container {
  display: block;
  max-width: 1300px;
}
.playlist-container::after {
  clear:both;
  display: table;
  content: "";
}
{% endhighlight %}

Then the playlist item, which would be each video in the playlist, uses different widths at different media query break points. There's also a margin left of 4% on each item, but using an nth-child class I remove that margin left from the first item on each row.

Starting with large desktops I set each item to have a width of 22%. With 4% margin between each item there will be 4 items per row.

{% highlight css %}
.playlist-item {
  display: block;
  float: left;
  width: 22%;
  margin: 0 0 20px 4%;
  padding: 10px 0;
  background-color: #F0F2F2;
  border-radius: 2px;
}
{% endhighlight %}

Use the :nth-child selector to remove the margin-left from the playlist items that don't need it. (placeholder images and playlist items used)

![playlist grid]({{ page.assets }}margin-left.jpg "playlist grid")

While there are 4 items on each line we need to select every item that's a mulitple of 4, starting at 1.

{% highlight css %}
.playlist-item:nth-child(4n+1) {
  margin: 0 0 20px 0;
}
{% endhighlight %}

While I was able to easily reduce the project size by creating the layout from scratch, I did have to find another way to get icons for the video player. For this I used <a href="http://fontawesome.io/" >font awesome icons</a> by adding using a CDN. Font awesome is still overkill for this project since I only need a few icons, but this still creates a smaller project size than using bootstrap.
