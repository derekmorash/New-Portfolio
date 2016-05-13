---
layout:     posts
title:      WordPress Browser Detection Plugin
date:       2016-05-13
thumbnail:  wordpress.png
assets:     /assets/post-assets/15-wordpress-browser-detect/
categories: work
tags:       wordpress browser-detection javascript
---
I want to start by saying this isn't something I'd normally want to do, things should be cross-browser compatible but in this case it was out of my control and I was asked to do this.

To download and view the code check out the [dm-browser-detect](https://github.com/derekmorash/dm-browser-detect) repo on github. Or if you want to play with the code you can do so in [this codepen](http://codepen.io/derekmorash/pen/KzrEJY).

The company I work for has an online application form on their website for allowing users to apply for a mortgage, the form is from a third party service that feeds into a backend platform for collecting the applications. I have no control over this form since it's required and is from a third party, and unfortunately it doesn't work properly on mobile iOS devices. I was asked to block it on these devices and display some kinda of message saying to open the page on a desktop or laptop.

So that's where I got the idea to make it a full plugin. I used shortcodes in wordpress to wrap content that you want to be shown or hidden based on selected browsers. It does a little more than just what was asked of me but this way it can be used in many different cases.

### The Shortcode
To start I made a simple shortcode, it doesn't do much but it's all I needed because I do the rest with javascript in the browser. The first thing this shortcode does is to grab the attributes in the shortcode block, this is the list of browsers we want to target. Next it wraps the content in a div element that has a class of "dm-browser-detect-hide" to indicate that I want to hide this content. The wrapping div also has a data attribute attached to it that holds the list of browsers.

After that I just add the shortcode and it can be used.

{% highlight php %}
<?php
function dm_browser_detect_hide( $atts, $content = null ) {
  $a = shortcode_atts( array(
    'browsers' => ''
  ), $atts );

  return '<div class="dm-browser-detect-hide"
    data-dm-detect-browsers="' . esc_attr($a['browsers']) . '">' .
    $content . '</div>';
}

add_shortcode( 'dmbrowserdetecthide', 'dm_browser_detect_hide' );
{% endhighlight %}

Using the shortcode is simple, just paste this into the editor and replace the content.

{% highlight text %}
[dmbrowserdetecthide browsers="chrome firefox"]

Hide this in chrome and firefox

[/dmbrowserdetecthide]
{% endhighlight %}

The shortcode for showing content only on the selected browsers is exactly the same, I just replaced the word hide with show in the shortcode name and the classname for the wrapper div.

### Javascript Requirements
There's a few variables needed that I declare inside the module function. I use the navigator userAgent to determine which browser the user is on. Then I also need to grab all the elements with the "dm-browser-detect-hide" and "dm-browser-detect-show" class names

{% highlight javascript %}
var userBrowser = navigator.userAgent.toLowerCase();
var hideEl = document.querySelectorAll('.dm-browser-detect-hide');
var showEl = document.querySelectorAll('.dm-browser-detect-show');
{% endhighlight %}

This is what the userAgent string looks like in chrome. All browsers are fairly similar to this.
![navigator user agent]({{ page.assets }}userAgent.png "navigator user agent")

### Module Design
I also used a Javascript design pattern called a module to protect the scope of these variables and functions. The only way to get access to them is if they are returned by the module. This is important since this plugin could be used alongside with many other plugins that could have the same function or variable names which could cause conflicts.

This is the basic module I started with, it is called by the "run" method being returned, the run method calls the hide and show functions. This is how things stay in the right scope, you can't call the hideAll function unless it is returned by the dmDetectBrowser module.

{% highlight javascript %}
var dmDetectBrowser = (function() {
  var userBrowser = navigator.userAgent.toLowerCase();
  var hideEl = document.querySelectorAll('.dm-browser-detect-hide');
  var showEl = document.querySelectorAll('.dm-browser-detect-show');

  var hideAll = function() {
  ...
  }; //hideAll

  var showAll = function() {
  ...
  }; //hideAll

  return {
    run: function() {
      if(hideEl.length > 0) {
        hideAll();
      }
      if(showEl.length > 0) {
        showAll();
      }
    }
  };
})();

dmDetectBrowser.run();
{% endhighlight %}

### Hiding Content
I made a css class that has a display property of hidden, to hide elements based on their selected browser I simply add this class to the element if the current browser is one of the selected browsers.

* Start by looping through each element we want to hide, there could be multiple on a page all with different selected browsers.
* Then put the list of browsers in the browsers data attribute for each element into an array.
* And then just loop through the array of selected browsers.

{% highlight javascript %}
var hideAll = function() {
  //loop through each element
  [].forEach.call(hideEl, function(el) {
    // get the selected browsers in the data attribute
    var selectedBrowsers = el.dataset.dmDetectBrowsers
      .toLowerCase().split(" ");

    //loop through each slected browser
    selectedBrowsers.forEach(function(thisBrowser) {
    ...
    }); //foreach selected browser
  }); //foreach el
}; //hideAll
{% endhighlight %}

When looping through each selected browser I check to see if that single selected browser is the browser being used by the user. This is done by seeing if the single selected browser name is in the userAgent string.

Well that's the simple way, but userAgent strings aren't that simple. One problem is that the string "safari" is a part of the userAgent string on every browser on mac. So if you selected safari to be hidden then it would be hidden on every browser, like chrome and firefox.

I also had to add a bit more conditional logic to be able to target mobile iOS device browsers. I have all iOS devices grouped together by just selecting ios for the elements data attribute. What I do here is check if the selected browser is ios and the userAgent string does NOT contain "window.MSStream" because microsoft puts "iphone" in their userAgent string for gmail spoofing. ([why microsoft does this](http://stackoverflow.com/questions/9038625/detect-if-device-is-ios)). Then I check the userAgent string to see if the browser is one of the iOS devices.

{% highlight javascript %}
var hideAll = function() {
  //loop through each element
  [].forEach.call(hideEl, function(el) {
    // get the selected browsers in the data attribute
    var selectedBrowsers = el.dataset.dmDetectBrowsers
      .toLowerCase().split(" ");

    //loop through each slected browser
    selectedBrowsers.forEach(function(thisBrowser) {

      // if the browser is one of the elements attributes
      if(userBrowser.indexOf(thisBrowser) > -1 && thisBrowser != 'safari' && thisBrowser != 'ios') {
          el.className += ' dm-detect-hidden';
      } else if(thisBrowser === 'safari' &&
      userBrowser.indexOf(thisBrowser) &&
      userBrowser.indexOf('ipad') < 0 &&
      userBrowser.indexOf('ipod') < 0 &&
      userBrowser.indexOf('iphone') < 0) {
        //if the slected browser is safari, but the current browser isnt a mobile ios device
        el.className += ' dm-detect-hidden';
      } else if(thisBrowser === 'ios' && userBrowser.indexOf(window.MSStream) < 0) {
        if(userBrowser.indexOf('iphone') > -1 ||
          userBrowser.indexOf('ipod') > -1 ||
          userBrowser.indexOf('ipad') > -1 ) {
          //if the selected browser is ios
          el.className += ' dm-detect-hidden';
        } //if iphone/ipad/ipod
      } //if ios is selected
    }); //foreach selected browser
  }); //foreach el
}; //hideAll
{% endhighlight %}

I did almost the exact same thing for showing content based on selected browsers. Instead of hiding the content when selected it hides it by default and then removes the hide class name if the current browser is selected. The same but opposite.

### For The Future
I need to add the ability to hide or shown on safari, I can't do that currently because the string "safari" is included in the userAgent of any browser on a mac. You could select safari as a browser and it will work but it will also block content on every browser on a mac. I'll need to make a conditional statement to determine if the browsers userAgent contains any other browser name along with safari.

I also want to add the ability to be able to added the shortcodes using a tool in the wysiwyg editor, something that gives users a list of browsers to choose from and then it automatically inserts into the page.

But for now it works as required, and I have other projects that need to be worked on before this.

__PS. Please don't use this for something critical, it's only meant for simple applications.__
