---
layout: posts
title: Two Jekyll Blogs in one
date:   2015-10-10
thumbnail: two-jekyll-blogs.jpg
assets: /assets/post-assets/two-jekyll-blogs/
categories: work
tags: jekyll two-blogs-in-one
---

Jekyll is a static page blogging platform. I chose to use Jekyll because I don’t need the interface of a CMS like WordPress, though I do love WordPress, and I didn’t want the bulk of a database slowing down page loads. I wanted this site to be fast and lightweight but still be able to use it like a blog. With Jekyll I’m able to write my posts in markdown or regular html, run Jekyll build, and have my posts be shown like a regular blog.

I plan on using jekyll as a blog for two different kinds of content. My work section which is for code and project examples, how I solved certain problems, etc, and a section where I can create full page designs and small web apps to practice front end development and design. The two different blogs or sections will use a different layout template. The work section uses a basic article looking template, while the full page section will use a different template that can be customized for the specific post.

Each jekyll post requires yaml front matter, this is where things like the post title, date, and tags are specified. Here’s an example of front matter for a post on my blog.
{% highlight html %}
---
layout: posts
title: Angular Video Player
date:  2015-09-16
categories: work
tags: angular css video
---
{% endhighlight %}

This is how we separate posts into two, or more different blogs. I specify a category variable for each post to tell jekyll which blog the post belongs to.
{% highlight html %}
---
categories: work
‘or’
categories: fullpage
---
{% endhighlight %}

Next we want to display a list of blog posts for each blog. For this we will use a liquid template for loop to loop through a certain category on the site.
{% highlight html %}
{% raw %}
{% for post in site.categories.work %}
    <a href="{{ post.url }}" class="work--card">
      <h2>{{ post.title }}</h2>
      <span>{{ post.date }}</span>
      <span>{{ post.tags }}</span>
    </a>
{% endfor %}
{% endraw %}
{% endhighlight %}

Then we do the same thing for the other blog category.
{% highlight html %}
{% raw %}
{% for post in site.categories.fullpage %}
    <a href="{{ post.url }}" class="work--card">
      <h2>{{ post.title }}</h2>
      <span>{{ post.date }}</span>
      <span>{{ post.tags }}</span>
    </a>
{% endfor %}
{% endraw %}
{% endhighlight %}
