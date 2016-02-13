---
layout:     posts
title:      CSS Architecture and Semantics
date:       2016-02-11
thumbnail:  sass.png
assets:     /assets/post-assets/10-css-architecture-and-semantics/
categories: work
tags:       css-architecture sass semantics
---
## SASS

SASS variables should be used when declaring things like colors or media query break points that will be constant across the site or application. If a unit needs to be changed it can be changed in one place and have it take affect throughout the rest of the styles. This keeps you from having to search through all the styles to find each instance that the unit gets declared.

## Architecture and File Structure

![Terrible Meme]({{ page.assets }}meme.jpg "Terrible Meme")
- ([terrible meme source](http://www.sitepoint.com/architecture-sass-project/))

## Modular Inheritance
One of the most important things in any kind of programming is inheritance. Inheritance is the ability to reuse code that is already written instead of having to write the same thing over and over in different places. This is just as important in CSS as it is in any programming language. There's no reason to redefine the same styles across multiple selectors or elements when we could just do it once. Don't Repeat Yourself or DRY is the principle that should be followed when writing CSS.

Extending styles is the best way to keep code DRY. Using the comma combinator in CSS allows us to set the same style rules on multiple selectors or elements. The code below takes all heading elements and declares the same font-family, instead of declaring the font-family separately on each element.

{% highlight css %}
h1, h2, h3, h4, h5, h6 {
  font-family: sans-serif;
}
{% endhighlight %}

__Practical Example:__

Making buttons is a real world example of how inheritance can be used very well. Generally you'll want all the buttons to look the same. We can set up a SASS placeholder to declare the basic styles of the buttons we want.

{% highlight sass %}
%button
  font-size: 1rem
  text-decoration: none
  color: #e74c3c
  border: 1px #e74c3c solid
  border-radius: 3px
  padding: 0.8em 1.6em
  display: inline-block
{% endhighlight %}

Then we use the @extend directive in SASS to use these styles on the selectors we want.

{% highlight sass %}
.subscribe
  @extend %button

.buy
  @extend %button

.play
  @extend %button
{% endhighlight %}

These selectors extending the button placeholder will compile to this CSS:

{% highlight css %}
.subscribe, .buy, .play {
  font-size: 1rem;
  text-decoration: none;
  color: #e74c3c;
  border: 1px #e74c3c solid;
  border-radius: 3px;
  padding: 0.8em 1.6em;
  display: inline-block;
}
{% endhighlight %}

Now we have all of our buttons inheriting the same styles, without repeating any code. But what if we want the play button to have a green color and the buy button to have a larger font size? We can simply do this:

{% highlight sass %}
.subscribe
  @extend %button

.buy
  @extend %button
  font-size: 2rem

.play
  @extend %button
  color: green
{% endhighlight %}

This will inherit the same button styles as before but then the new styles will override the old styles, only on the specified selector. The SASS above gets compiled to:

{% highlight css %}
.subscribe, .buy, .play {
  font-size: 1rem;
  text-decoration: none;
  color: #e74c3c;
  border: 1px #e74c3c solid;
  border-radius: 3px;
  padding: 0.8em 1.6em;
  display: inline-block;
}

.buy {
  font-size: 2rem;
}

.play {
  color: green;
}
{% endhighlight %}

You can see how the basic button styles are only written once and reused by each selector. Then when we want to make a slightly different button we don't rewrite all the styles, we simply override the ones we want to change

## Class Namespacing
I created a small tweet layout based on the image below to demonstrate how I do namespacing in my markup. For this tweet module I use .tweet as the namespace prefix.

<p data-height="320" data-theme-id="0" data-slug-hash="meQwja" data-default-tab="result" data-user="derekmorash" class='codepen'>See the Pen <a href='http://codepen.io/derekmorash/pen/meQwja/'>Tweet</a> by Derek Morash (<a href='http://codepen.io/derekmorash'>@derekmorash</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

I start with a container div with the class of .tweet, this wraps around all of the markup specific to just the tweet. The first thing inside the tweet is the user avatar and name, I put this in a div called user that I give a class name of .tweet--user.

{% highlight html %}
<div class="tweet">
  <div class="tweet--user"></div>
</div>
{% endhighlight %}

Inside the user section there’s an avatar and the name/username. I mark these up with an img and a div respectively, using the namespace .tweet--user-avatar and .tweet--user-name. I use class names that describe the content of the element.

{% highlight html %}
<div class="tweet">
  <div class="tweet--user">
    <img class="tweet--user-avatar" src="http://fillmurray.com/50/50" />
    <div class="tweet--user-name">Bill Murray<span>@bill</span></div>
  </div>
</div>
{% endhighlight %}

### Now for the styles
For

{% highlight sass %}
.tweet
  &--user
    &-avatar
    &-name
{% endhighlight %}

These simple SASS selector declarations render to this output CSS:

{% highlight css %}
.tweet {}
.tweet .tweet--user {}
.tweet .tweet--user .tweet--user-avatar {}
.tweet .tweet--user .tweet--user-name {}
{% endhighlight %}

This is one of the things I love most about SASS, nesting. It allows the reader to visualize how the markup is written and laid out. One of the reasons why it's important to use namespaced classnames that describe the content of the element.

## Resources
I a couple videos to recommend for learning more on the topic of CSS architecture. The first and best video is from Caleb Meredith cohosting a video on the youtube channel called [DevTips](https://www.youtube.com/user/DevTipsForDesigners) from [Travis Neilson](https://twitter.com/travisneilson):

__watch:__ [https://www.youtube.com/watch?v=6co781JgoqQ](https://www.youtube.com/watch?v=6co781JgoqQ)

The second is a talk by [Dan Eden](https://twitter.com/_dte), a designer at Dropbox. He talks about the work he's doing to clean up the bloated CSS for Dropbox and make it more modular.

__watch:__ [https://www.youtube.com/watch?v=zmjfh099zYg](https://www.youtube.com/watch?v=zmjfh099zYg)
