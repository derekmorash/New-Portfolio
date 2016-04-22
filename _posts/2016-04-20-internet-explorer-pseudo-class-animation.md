---
layout:     posts
title:      Internet Explorer Pseudo Class Animations
date:       2016-04-20
thumbnail:  salesforce-wordpress.gif
assets:     /assets/post-assets/13-internet-explorer-pseudo-class-animations/
categories: work
tags:       css pseudo-classes internet-explorer
---

TLDR: Use actual unit values like % or px on pseudo classes, "width: 0;" will break... sometimes.

I made this little interaction animation for hovering over nav links in this client project I'm working on. It's nothing crazy, just a small underline for each link that sort of looks like it's being drawn under the text as you hover.

![hover]({{ page.assets }}linkhover.gif "hover")

All I'm doing here is creating an :after pseudo class on each link with a width of 0 and transitioning the width to 100% on hover. Like this:

{% highlight scss %}
.nav--link { //the link itself
  position: relative; //allows me to position the after class absolute

  &:after {
    content: "";
    display: block;
    @include position(absolute, null null -10px 0); //bourbon mixin
    width: 0; //starting width, the line isn't visible
    height: 2px; //thickness of the line
    background-color: $base-red;
    @include transition(width 100ms ease-in-out); //bourbon mixin
  } //&:after

  &:hover:after {
    width: 100%; //underlines the whole link text
  } //hover after
}
{% endhighlight %}

Now before I made this I checked [caniuse.com](http://caniuse.com/) just in case to make sure pseudo classes work in all browsers. Sure enough they work back to IE 9, exactly what I wanted to see. Then I tested the same method of transitioning pseudo classes on some [CSS buttons I made in codepen](http://codepen.io/derekmorash/pen/XddZJY), here. It worked great with the exception of the transition effect which isn't supported in IE anyway, but that was expected and it failed gracefully by just switching to 100% width on hover without any transition. I can live with that.

After my research and testing I went into development expecting it to go smoothly and work exactly like it did in my codepen testing, but nothing is ever that easy when it comes to IE.

Here's what happened when I tested in IE...

![hover]({{ page.assets }}iehover.gif "hover")

This can't go into production.

So I slowed down the transition timing to get a better look at what was happening.

![hover]({{ page.assets }}iehoverslow.gif "hover")

What's happening is when your mouse enters the element the transition works normally, but as soon as the mouse leaves from hovering the element the after pseudo class element suddenly becomes very wide going way off page before transition back down to the 0 width. I think the width is being set to 100% of the browser width when the mouse leaves.

I thought maybe I need to set a max-width, or maybe setting an overflow hidden to hide the unwanted width, but nope neither of those worked.

Then I thought transitions might actually need a vendor prefix for IE even though caniuse.com says it doesn't and autoprefixer in my gulp build process doesn't add it even when I specify that I want IE 9 support. So I added the -ms-transition prefix myself, but still no luck.

I cleared out all those failed properties and I decided to throw a percent unit onto the width: 0 declaration, and it worked. You have to use the same units (ie. px, rem, em, %, etc) when transitioning between two values. Setting the starting width to "width: 0px;" will still break because the hover value uses a percent unit and not a pixel unit.

{% highlight scss %}
.nav--link { //the link itself
  &:after {
    ...
    width: 0%; //starting width, the line isn't visible
    @include transition(width 100ms ease-in-out); //bourbon mixin
    ...
  } //&:after
  &:hover:after {
    width: 100%; //underlines the whole link text
  } //hover after
}
{% endhighlight %}

That's it, that's all it took. A single "%" fixed the bug I was trying to fix all day. I still don't know why I needed this here but not in my codepen test, it's practically the same thing.

Please let me know if you have an idea why I needed the units are needed when the value is 0.
