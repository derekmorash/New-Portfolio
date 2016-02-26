---
layout:     posts
title:      CSS Architecture
date:       2016-02-23
thumbnail:  sass.png
assets:     /assets/post-assets/10-css-architecture-and-semantics/
categories: work
tags:       css-architecture sass semantics
---
CSS can quickly become a large mess that's nearly impossible to work. Keeping a project organized from the start with a clean file structure and reusing code is the only way to keep from getting overwhelmed. I tried my best to explain how I organize and write my CSS code using SASS, and some of the practices I find to be the most helpful when maintaining a project.

## Architecture and File Structure
File structure is the key to writing maintainable CSS. There's nothing worse than coming back to a project after a while and not being able to figure out the styles because you're lost in a CSS file that's a million lines long. With SASS we can break up the styles into different files to have better organization to help with maintaining the code later on, or if someone new tries to work on the project they can easily figure out how things work.

Now you don't want to just have a bunch of different files floating around, there should be some structure or layout to the way the files are broken up.

![SASS Architecture]({{ page.assets }}meme.jpg "SASS Architecture")
- [terrible meme source](http://www.sitepoint.com/architecture-sass-project/)

This is the file structure for a small project I did recreating the artist page in iTunes. This is the basic structure I use on all my projects. I have the CSS broken up into four subdirectories; Tools, Base, Modules, and Layouts. This allows me to break up the different parts of the styles and keep them organized.

<pre>
css/
| -- 0-tools/
|   | -- fonts.sass
| -- 1-base/
|   | -- base.sass
|   | -- vars.sass
| -- 2-modules/
|   | -- buttons.sass
|   | -- toggle.sass
|   | -- tools.sass
| -- 3-layouts/
|   | -- header.sass
|   | -- main.sass
|   | -- switch.sass
| -- main.sass
</pre>

1. __Tools__

   The tools directory is where I put things like fonts, prebuilt reset styles, or libraries or dependancies such as bourbon and neat. These are things you wouldn't generally make any changes to, they're tools to build off of.

2. __Base__

   The base directory is for general styles of the project. Things like setting the font-family and font-size of different typography elements, colours, and anything that you want to be consistent across the site or application. This is also a good place to create variables, again for things you want to be constants.

3. __Modules__

   Modules are for components that get used multiple times through the project. For an example on the twitter feed, a tweet would be a module. Small components that get repeated with the same style and layout.

   Another example would be buttons. You want the buttons to have the same structure throughout, with the exception of small changes like colours depending on use or need of the button. A call to action button and a login button might have the same look but the CTA might have a colour that stands out more and a large font. This is where you would create a button module that is inherited by the login and CTA buttons.

4. __Layouts__

   Layouts are for sections that are usually larger more specific than modules. Take this page for instance, I am using three layouts to make up this page. One for the header, one for the main content (the article), and one for the footer. Basically the different sections of a page get broken up into separate layouts.

   I'll use twitter again for an example. The twitter feed could have a container that is used to hold all of the tweet modules. There are other layouts on the page like a header and sidebar, the "feed container" is a specific layout separate to hold the tweet modules.

SASS imports allow you to break your stylesheets up into multiple files and then have them imported into one when everything gets compiled. It's important to import your files and dependancies in the right order. If you're using a library like bourbon then it should be one of the first things imported, otherwise you may not be able to inherit it's functionality. A mixin or placeholder needs to be declared before it can be used. This isn't strictly a SASS only thing, you can do this in other CSS preprocessors or use a build process to like [gulp.js](http://gulpjs.com/) to concatenate multiple plain CSS files together.

The reason why having all styles compiled into one file is to reduce load times. Every time a stylesheet is linked to the browser has to stop and download it before it can continue to load the content of the page. This is called render blocking. It's generally easier for a browser to download __1__ - __60kb__ file than it is to download download __6__ - __10kb__ files. The overall size of the CSS is the same but the browser only has to stop once to download it.

SASS variables should be used when declaring things like colors or media query break points that will be constant across the site or application. If a unit needs to be changed it can be changed in one place and have it take affect throughout the rest of the styles. This keeps you from having to search through all the styles to find each instance that the unit gets declared.

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

This will inherit the same button styles as before but then the new styles will override the old %button styles, only on the specified selector. The SASS above gets compiled to:

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

.buy { font-size: 2rem; }

.play { color: green; }
{% endhighlight %}

You can see how the basic button styles are only written once and reused by each selector. Then when we want to make a slightly different button we don't rewrite all the styles, we simply override the ones we want to change. This leaves us with clean and DRY CSS.

## Semantic Class Namespacing
There are two rules I like to follow when writing class names in my markup; Namespacing prefix's, and using the class name to describe what the content of the element is and not what it looks like. I try to stay away from class names like "col" or "grid" because these don't give any description of the element, and they aren't very semantic. To me the HTML is for content, and the CSS is for the structure or the look of the elements.

It might be tempting to use a classname of "col" because that element might be a column, but instead I would write a better descriptive classname and then extend the functionality of the "col" class in the CSS. The CSS is where you create the structure of a column, the markup is only for content.

I created a small tweet layout to demonstrate how I do namespacing in my markup. For this tweet module I use .tweet as the namespace prefix.

<p data-height="360" data-theme-id="0" data-slug-hash="meQwja" data-default-tab="result" data-user="derekmorash" class='codepen'>See the Pen <a href='http://codepen.io/derekmorash/pen/meQwja/'>Tweet</a> by Derek Morash (<a href='http://codepen.io/derekmorash'>@derekmorash</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
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

__Now for the styles__

SASS nesting with the "&" parent selector reference allows selectors to be written to be clean and readable. Here we take the namespaced selectors and nest them just like the elements are nested in the markup.

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

This is one of the things I love most about SASS, nesting. By just looking at the selectors you can tell how the elements in the markup are structured.

For another example of class namespacing check out this [iTunes Artist Page Clone](http://codepen.io/derekmorash/pen/JGeQpw) pen on codepen.

## Resources
I a couple videos to recommend for learning more on the topic of CSS architecture. The first and best video is from Caleb Meredith cohosting a video on the youtube channel called [DevTips](https://www.youtube.com/user/DevTipsForDesigners) from [Travis Neilson](https://twitter.com/travisneilson):

__watch:__ [https://www.youtube.com/watch?v=6co781JgoqQ](https://www.youtube.com/watch?v=6co781JgoqQ)

The second is a talk by [Dan Eden](https://twitter.com/_dte), a designer at Dropbox. He talks about the work he's doing to clean up the bloated CSS for Dropbox and make it more modular.

__watch:__ [https://www.youtube.com/watch?v=zmjfh099zYg](https://www.youtube.com/watch?v=zmjfh099zYg)
