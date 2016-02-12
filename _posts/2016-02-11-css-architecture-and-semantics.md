---
layout: posts
title: CSS(SASS) Architecture and Semantics
date:   2016-02-11
thumbnail: css.png
assets: /assets/post-assets/10-css-architecture-and-semantics/
categories: work
tags: css-architecture sass semantics
---
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



{% highlight sass %}
.tweet
  &--user
    &-avatar
    &-name
{% endhighlight %}

This renders to:

{% highlight css %}
.tweet {}
.tweet .tweet--user {}
.tweet .tweet--user .tweet--user-avatar {}
.tweet .tweet--user .tweet--user-name {}
{% endhighlight %}

This is one of the things I love most about SASS, nesting. It allows the reader to visualize how the markup is written and laid out. One of the reasons why it's important to use namespaced classnames that describe the content of the element.
