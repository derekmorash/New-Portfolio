---
layout:     posts
title:      WordPress Browser Detection Plugin
date:       2016-05-12
thumbnail:  js.png
assets:     /assets/post-assets/14-javascript-json-search/
categories: work
tags:       wordpress browser-detection javascript
---
I want to start by saying this isn't something I'd normally want to do, things should be cross-browser compatible but in this case it was out of my control and I was asked to do this.

The company I work for has an online application form on their website for allowing users to apply for a mortgage, the form is from a third party service that feeds into a backend platform for collecting the applications. I have no control over this form since it's required and is from a third party, and unfortunately it doesn't work properly on mobile iOS devices. I was asked to block it on these devices and display some kinda of message saying to open the page on a desktop or laptop.

So that's where I got the idea to make it a full plugin. I used shortcodes in wordpress to wrap content that you want to be shown or hidden based on selected browsers. It does a little more than just what was asked of me but this way it can be used in many different cases.

### How it's made
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

Using the shortcode is simple, just paste

{% highlight text %}
[dmbrowserdetecthide browsers="chrome firefox"]

Hide this in chrome and firefox

[/dmbrowserdetecthide]
{% endhighlight %}

### For The Future
I need to add the ability to hide or shown on safari, I can't do that currently because the string "safari" is included in the userAgent of any browser on a mac. You could select safari as a browser and it will work but it will also block content on every browser on a mac. I'll need to make a conditional statement to determine if the browsers userAgent contains any other browser name along with safari.

I also want to add the ability to be able to added the shortcodes using a tool in the wysiwyg editor, something that gives users a list of browsers to choose from and then it automatically inserts into the page.

But for now it works as required, and I have other projects that need to be worked on before this.
