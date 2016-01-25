---
layout: posts
title: CSS vh and calc() vs Javascript
date:   2015-12-04
thumbnail: css-vs-js.png
assets: /assets/post-assets/vh-vs-js/
categories: work
tags: css js vh calc
---
**\*Updated Dec, 30, 2015, below\***

For the about section of my portfolio site, the “Derek Morash” header, I made it appear in the middle of the window while the user is at the top of the page.

This is what I mean:

![desktop]({{ page.assets }}desktop.jpg "desktop")

I do this by adjusting the margin-top css property. I came up with two ways of doing this.

The first method is using javascript. I wrote a function that adds a margin-top to the .about section of half the window height minus 100px for the header. This function is called once on page load to set the initial margin, then the function is called whenever the window is resized or the orientation is change.

{% highlight javascript %}
function headerPosition() {
  var about = $('.about');
  var textHeight;
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
{% endhighlight %}

The second method is using the calc() method and vh units. This is a lot cleaner and only one line of css instead of the 30 lines (with comments) of java script. I simply set the margin-top on the element to “margin-top: calc(50vh - 100px)” which takes 50% of the viewport height and subtracts 100px from it.

{% highlight css %}
margin-top: calc(50vh - 100px);
{% endhighlight %}

The css option seems like the best way to do this. It’s simple, one easy to understand line of code, and it doesn’t need javascript. The two main decisions for which option to choose are browser support and performance. According to <a href="http://caniuse.com/" target="blank">caniuse.com</a> the vh unit and calc() function are both supported by all major browsers back to IE 9. I am going to make an assumption that the majority or people viewing my site will be tech savvy enough to be using a modern browser, considering the main purpose of my site is to show off my work to potential employers. So browser support isn’t an issue in my case, which just leaves performance. Using css requires much less code than my javascript implementation, but this is the difficult part because I’m not sure how to measure the performance to see which option causes the biggest hit to performance or if they’re both so minimal that it can be ignored.

I decided to uses the css vh method for the final production build, only because it gives a smaller overall file size of everything the browser needs to download. I’m leaving the javascript function in my code but commenting it out so when I compile and minify everything it will be left out in the production file.

**Update: (Dec, 30, 2015)**

I realized I didn’t have the headline text actually in the center of the window, but rather the top of the text was at the center of the window. I wanted the text to be dead center but it looked down a little bit, so I came up with a JS way to get it centered. I now subtract half the height of the “h1” in the about section. This puts the center of the text element in the center of the page.

Here are the changes I made.

I get the height of the target h1 element.

{% highlight javascript %}
//get the height of the header text
textHeight = about.find('h1').height();
{% endhighlight %}

Then I subtract half of that height from the calculated margin-top property.

{% highlight javascript %}
about.css('margin-top', (windowHeight/2) - 100 - (textHeight/2));
{% endhighlight %}

The completed function now looks like this.

{% highlight javascript %}
function headerPosition() {
  var about = $('.about');
  var textHeight;
  var windowHeight;

  reposition();

  function reposition() {
    //get the height of the window
    windowHeight = $(window).height();
    //get the height of the header text
    textHeight = about.find('h1').height();

    //if the window is taller than 400px
    if(windowHeight > 400) {
      //add a margin-top to the about selection-color
      //margin is half the window height minus the 100px header, and minus half the text height
      about.css('margin-top', (windowHeight/2) - 100 - (textHeight/2));
    } else {
      //usually for phones in landscape
      //add margin-top of only 50px
      about.css('margin-top', 50);
    }
  }
{% endhighlight %}

I will be keeping the JS option in the final build just for the better control.
