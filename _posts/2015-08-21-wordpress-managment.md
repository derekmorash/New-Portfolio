---
layout: posts
title: WordPress Site Management
date:   2015-08-21
thumbnail: wordpress.png
assets: /assets/post-assets/wordpress-managment/
categories: work
tags: wordpress seo site-migration
---
###Migrating WordPress
For migrating WordPress from one host to another I use the <a href="https://wordpress.org/plugins/wp-migrate-db/" >WP Migrate DB plugin</a>. This replaces the domain and file location paths in the database to point to the correct locations for where the site is being moved to.

I start with a fresh install of wordpress, and upload the “wp-contents” folder to the new host. If the site is currently located at the domain “localhost/clintonwilkins/” and the file location “/var/www/html/clintonwilkins/” the Migrate DB plugin will change those paths to whatever you specify, for example “//clintonwilkins.ca” and “/var/www/html/clintonwilkins/” on the new host. I then simply download the new sql file and import it into the database on the new host. This can be done in a matter of minutes, excluding the time it takes for to FTP the “wp-contents” folder.
This works whether you’re moving a site to production or copying a site that is already live to be able to test updates or new features locally before implementing them on production.

###SEO
On both sites I am using the SEO plugin from Yoast, I find it has the best and most in depth features.
Unfortunately it is often difficult to improve page and post SEO since teamclinton.ca was built and published before I began working here. SEO best practices require things like the focus keyword being included in the first paragraph of the body, a header on the page, meta description, page title, and the URL, but when a page has already been published the URL can’t be changed without breaking any links to the page from external sources. It is also not always possible to change the content on the page to properly include these SEO best practices, so on some pages and posts there’s only so much I can do which gets frustrating.

I have found one inconsistency that I’ve decided to ignore, the “Page Analysis” section says the home page has no images even though it does. This is because the images aren’t added to the page as WordPress media but instead through a shortcode from the Cherry Theme Framework that was used to build the theme. This is where I decided to just take my overall knowledge of SEO and ignore the plugins warning, the page has images so there’s no need to worry about bad SEO.

Something I found great about the plugin was that the theme being used on teamclinton.ca had a hardcoded meta description, the plugin asked me if I wanted to ignore it or fix it. I clicked fix and it created a backup of the file before changing the description line so it could be used properly by the plugin. Of course I did this all on a local version of the site before doing it on the production site, just in case I broke it and ruined everything.

###Updating to WordPress 4.3
WordPress 4.3 is here! These are the steps I take to upgrade to the newest version of wordpress.

1. Backup the site
* Get a copy of the “/wp-contents” folder from the site, this includes all the sites themes, plugins, and media. I like to start this first because it can take a while.
* While the “/wp-contents” folder is being downloaded over FTP, use the Migrate DB plugin to create a copy of the database that will work on a localhost domain and with the correct directory location for where the site is stored.
* Place the downloaded “/wp-contents” into a bare locally installed wordpress site with the same version as the production site, then drop all tables from the local site database and import the copied database. I now have an exact copy of the site running locally on my machine.
2. LOCAL UPDATES FIRST!! I never do updates on a live site without testing them locally first, updates could break a theme or plugin so it’s better to not have that happen on a production site. If updates do break the site then you’re able to figure out the problems and fix them, this way you’ll know what to do when it’s time to do updates on production.
Update themes and plugins first. WordPress theme and plugin developers often release updates for their products when WordPress updates the core, it is best to do these updates first because an old or broken theme or plugin could break the site after a core update.
Next it’s time to update the core. Pretty straight forward, just press the button and let it do it’s thing.
3. Test everything. Go through every page and post, click every link, try every widget, any theme or plugin functionality. Make sure everything still works exactly the same as before the updates. Any problems that pop up will need to be fixed before doing production updates.
4. Now that I have successfully updated the site locally and worked out any kinks that may have come up, it’s time to do the exact same thing on the live production site. I took the same steps as I did with the local site, except for the backup because that’s already done, and updated themes and plugins first before doing the core update. I’m left with two identical updated sites.

###AdWords
While this doesn’t really have anything to do with WordPress or site management, I still think it’s an important factor for not only getting traffic to a site but traffic from the specific target audience that the company is looking for. There’s no point in having someone find the site if they aren’t looking for any mortgage services.

In just four days of redoing the AdWords campaigns I was able to bring in three times the amount of clicks on ads than the previous campaign brought in from the last year. Now this might make me seem like an AdWords genius or something, I can’t take all the credit because the previous campaign was very poorly setup to begin with and was never maintained or updated.
