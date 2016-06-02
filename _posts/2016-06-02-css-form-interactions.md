---
layout:     posts
title:      CSS Form Interactions
date:       2016-06-02
thumbnail:  css3.png
assets:     /assets/post-assets/16-css-form-interactions/
categories: work
tags:       css interactions animation
---
I got the idea for this when I met Jeremy and Colin at [mode.digital](http://mode.digital/) a few weeks ago. They were showing me some things they've been working on and a form they made caught my attention, the text input boxes in the form had labels that animated up above the input text. I kept thinking about it so I decided to just build my own version, it's not exact but it's a similar idea.

Here's what I came up with:
![search]({{ page.assets }}click.gif "search")

I'm using a label element as a input placeholder, it then slides up when you click in the text box to get out of the way. Sometimes I like to only use a placeholder because it looks clean and simple, but then there's no description for what the text box represents when text has been entered. This is sort of the best of both worlds, it's good for UX and it fixes the problem of input placeholders not being supported in IE 9.

The markup is simple, I just wrapped the the input and label in a div so they can be positioned together.
{% highlight html %}
<div class="form--block">
  <input class="form--block-text" id="name" type="text">
  <label for="name" id="label-name">Name</label>
  <div></div>
</div>
{% endhighlight %}

The wrapper div is positioned relative so that the input box and label can be positioned absolute inside. For animating the label all I do is change the "top" property from 50% to 0, and add a transition.

I used the general subling combinator to target the label when the input box is focused. Then I also made a class of label-focus to by added by javascript later.

{% highlight scss %}
input {
  &:focus ~ label {
    top: 0;
  }
}

label {
  position: absolute;
  top: 50%;
  transition: top 100ms cubic-bezier(.25,.8,.25,1);

  &.label-focus {
    top: 0;
  }
}
{% endhighlight %}

For the most part all I needed was CSS to change the position of the label, but I also needed the label to stay in place when the input has text in it but is no longer focused. I wrote a little bit of Javascript to check if each input is empty or not, and if not then it adds a css class to the label to keep it positioned properly.

The script is simple, it loops through each input box and checks if the value isn't empty. Then it either adds or removes the "label-focus" classname for the label that belongs to that input box.

Labels stay above the input when content is added:
![search]({{ page.assets }}type.gif "search")

You can demo it right here through codepen!
<p data-height="450" data-theme-id="0" data-slug-hash="grqJXJ" data-default-tab="result" data-user="derekmorash" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/derekmorash/pen/grqJXJ/">Input Interactions</a> by Derek Morash (<a href="http://codepen.io/derekmorash">@derekmorash</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
