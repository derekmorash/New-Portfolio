---
layout:     posts
title:      Salesforce Web-to-Lead Form for Wordpress
date:       2016-03-23
thumbnail:  salesforce-wordpress.gif
assets:     /assets/post-assets/12-salesforce-wordpress/
categories: work
tags:       salesforce wordpress
---
### Basic Web to Lead Form
How to enable and create a basic Web-to-Lead form to put on your wordpress site to start pushing leads straight into salesforce automatically. This was something I had to do a little research on today so I thought I'd write a quick little five step guide to help people through the process. It's super easy.

This guide does not cover creating custom fields or lead views, only the web-to-lead form creation and installation.

__1.__ Start in the __setup__ section in salesforce.

* Go to __App Setup__
* Customize
* Leads
* Web-to-Lead

![setup]({{ page.assets }}menu.png "setup menu")

__2.__ Ensure Web-to-Lead enabled is checked, it should be by default. Then click the __Create Web-to-Lead Form__ button.

![login page]({{ page.assets }}enable.png "Login Page")

__3.__ This takes you to a page where you will generate your form. Select the fields you want, there’s a list of default fields and any custom fields you’ve created within your salesforce instance. Once you have selected and ordered the fields you want in your form, include the URL you want users to be redirected to after they submit the form. This could be a small landing page to give the user feedback that successfully submitted the form and that you will be in touch with them soon. After that simply hit the generate button to create the HTML for the form.

![login page]({{ page.assets }}select-fields.png "Login Page")

Here’s where things start to get tricky. When the form gets generated you’ll be given the HTML code. The first part of the code needs to be added to the head of page html. This is the META tag needed:

{% highlight html %}
<META HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8">
{% endhighlight %}

__4.__ Find the __Insert Script to <head>__ section n the wordpress editor for the page you want the Web-to-Lead form to be on, and paste that code in the text box. This will only add the meta tag to this page.

![login page]({{ page.assets }}wordpress-head.png "Login Page")

__5.__ Next open the __text(HTML)__ tab of the page editor and paste in the rest of the code from the generated form.

![login page]({{ page.assets }}wordpress-html.png "Login Page")

It’s best to leave out the comment sections that look like this:

{% highlight html %}
<!--  ----------------------------  >
{% endhighlight %}


Once you have the code pasted in you can save and view the page. Now is a good time to test the form to make sure it works properly, it’s easy to miss some code when copy and pasting.

If you get a lead generated from your test then you’re good to start sending users to the page.

Optional: Add specific class names to the form elements to give them style like the rest of your site. This requires some more knowledge on HTML and CSS and how the site was built.
