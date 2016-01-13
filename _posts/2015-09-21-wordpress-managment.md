---
layout: posts
title: WordPress Site Management
date:   2015-09-21
thumbnail: wordpress-management.jpg
categories: work
tags: wordpress seo site-migration
---

### Migrating WordPress
For migrating WordPress from one host to another I use the WP Migrate DB plugin. This replaces the domain and file location paths in the database to point to the correct locations for where the site is being moved to.
I start with a fresh install of wordpress, and upload the “wp-contents” folder to the new host. If the site is currently located at the domain “localhost/clintonwilkins/” and the file location “/var/www/html/clintonwilkins/” the Migrate DB plugin will change those paths to whatever you specify, for example “//clintonwilkins.ca” and “/var/www/html/clintonwilkins/” on the new host. I then simply download the new sql file and import it into the database on the new host. This can be done in a matter of minutes, excluding the time it takes for to FTP the “wp-contents” folder.
This works whether you’re moving a site to production or copying a site that is already live to be able to test updates or new features locally before implementing them on production.

{% highlight javascript %}
$(function() {
  smoothScroll(300);
});

// smoothScroll function is applied from the document ready function
function smoothScroll (duration) {
	$('a[href^="#"]').on('click', function(event) {

	    var target = $( $(this).attr('href') );

	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, duration);
	    }
	});
}
{% endhighlight %}

![alt text](http://fillmurray.com/1000/800 "Logo Title Text 1")

### SEO
On both sites I am using the SEO plugin from Yoast, I find it has the best and most in depth features.
Unfortunately it is often difficult to improve page and post SEO since teamclinton.ca was built and published before I began working here. SEO best practices require things like the focus keyword being included in the first paragraph of the body, a header on the page, meta description, page title, and the URL, but when a page has already been published the URL can’t be changed without breaking any links to the page from external sources. It is also not always possible to change the content on the page to properly include these SEO best practices, so on some pages and posts there’s only so much I can do which gets frustrating.
I have found one inconsistency that I’ve decided to ignore, the “Page Analysis” section says the home page has no images even though it does. This is because the images aren’t added to the page as WordPress media but instead through a shortcode from the Cherry Theme Framework that was used to build the theme. This is where I decided to just take my overall knowledge of SEO and ignore the plugins warning, the page has images so there’s no need to worry about bad SEO.

Something I found great about the plugin was that the theme being used on teamclinton.ca had a hardcoded meta description, the plugin asked me if I wanted to ignore it or fix it. I clicked fix and it created a backup of the file before changing the description line so it could be used properly by the plugin. Of course I did this all on a local version of the site before doing it on the production site, just in case I broke it and ruined everything.
