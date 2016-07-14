---
layout:     posts
title:      Small Business Client Site
date:       2016-07-12
thumbnail:  x.png
assets:     /assets/post-assets/18-business-site/
categories: work
tags:       client-work case-study css jquery php
---
This is a client project I've been working on, it's a small business site that I've built from scratch. It hasn't launched yet so unfortunately I can only show screenshots for now. The site has two main aspects, the first being the single page "small business" type of site, and the second being a social media contest where users can submit content for it to be voted on as a contest. For this project I used SASS(SCSS) with Bourbon/Neat for the layout and styles, Javascript/jQuery for user interactions, and PHP for the backend work (file upload and email forms).

Read more on how I approach [SASS Architecture](/work/css-architecture-and-semantics/).

### Main Site Page
I wasn't really given much of a discovery period for this project, I was given the company logo and told to pull from the existing outdated, very very outdated, site. I would've preferred to ask the client questions about what they wanted to accomplish and create a needs assessment but that just wasn't possible in this situation, so I made do with what I had and I thing it's turned out pretty well so far. This is still an on going iterative project so this is by no means the final product, I just feel like it's a good time to show my work and look for feedback.

![site header]({{ page.assets }}1.jpg "site header")

#### Web Video UX
The client wanted this video to autoplay in the header that would give the user info on the business. Video is a great asset and I think it should be used more on the web, but it needs to be used right.

I had a few concerns with an auto playing video. If the site was loaded at a different section of the page without the video in view then the user wouldn't know what was going on, they would be this voice talking to them and they wouldn't have any way to know where it was coming from or what it was. This would likely cause a lot of people to just close the browser tab. Autoplay video should only be used where the user will expect it, like youtube.

Even if the video player is in the window view it should be up to the user if they want to play it. Even for me when I click on a link that I don't expect to have video or audio content I often quickly close the tab if something starts playing because it can be annoying. This article called [Video Usabillity written by Amy Schade](https://www.nngroup.com/articles/video-usability/) on the Nielsen Norman Group website shows that I'm not the only one either.

"When users arrive at a webpage, they don’t appreciate being surprised by video or audio content that begins playing without their consent."
<br>\- Amy Schade [(https://www.nngroup.com/articles/video-usability/)](https://www.nngroup.com/articles/video-usability/)

So this was my solution, nothing jumps out to surprise the user, they decide if they want the video, there's a clear CTA to tell the user there is a video available to watch, and they have full control over the video.

![site header]({{ page.assets }}headervideo3.gif "site header")

Read more about how I made the nav bar and the IE bug fixes I had to do here: [Internet Explorer Pseudo Class Animations](/work/internet-explorer-pseudo-class-animation/).

The rest of the home page are just content sections that can be scrolled to by selecting the section in the nav bar.

![site header]({{ page.assets }}2.jpg "site header")
![site header]({{ page.assets }}3.jpg "site header")

I wrote about how I made the "Our Brokers" section [here](/work/ajax-content-load/) using AJAX to load a JSON file containing all the broker contact info. [AJAX Content Loading](/work/ajax-content-load/)

### Contest Section
This is for a social media contest being run by the client. Users will send in videos of themselves talking about their charity experiences or image memes. Each week there will be winners based on most likes/shares/top picked etc. I made a quick screen recording to show how the contest page works, but I am only using placeholder content as the site hasn't launched and I'm still waiting to get description content from the client.

<div class="youtube" style="padding-bottom: 62.5%;">
<iframe src="https://www.youtube-nocookie.com/embed/gK14vf0drro?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
</div>

#### Viewing Content
I'm using a [firebase](https://firebase.google.com/) back end to store the info on each submission and youtube for video hosting. When a video is selected I just take the youtube video id from the url, looks like "gK14vf0drro", and insert it into the iframe src attribute. This loads that video in the video player. I also pull all the info from firebase like the video title, description, and number of likes.

Firebase is super simple, here's how I gather the data to display it in the grid of videos at the bottom. Since the data is returned as JSON it can easily be inserted into HTML.

Firebase JSON data structure:

{% highlight json %}
[ {
  "email" : "derek.morash@gmail.com",
  "likes" : 0,
  "name" : "Run The Jewels - Close Your Eyes And Count To Fuck",
  "num" : 0,
  "story" : "This is my second story",
  "video" : "q6GyTBVAF4w"
}, {
  "email" : "derek.morash@gmail.com",
  "likes" : 0,
  "name" : "Converge - Last Light",
  "num" : 1,
  "story" : "You Fail Me",
  "video" : "GNnzJJiDHok"
} ]
{% endhighlight %}

Retrieving data from firebase:

{% highlight javascript %}
pitDatabase.ref('pit-videos').once('value', function(snapshot) {
  for(var i = 0; i < snapshot.val().length; i++) {
    var post = snapshot.val()[i];

    var newVideo = '<a href="#" class="pitarchive--video" data-video-url="' + post.video + '" ' +
    'data-video-index="' + post.num + '" ' +
    'data-video-rating="' + post.likes + '">' +
    '<div class="pitarchive--video-caption" style="background-image: url(\'http://img.youtube.com/vi/' + post.video+ '/mqdefault.jpg\');">' +
    '<div class="video-caption-overlay">' +
    '<p class="video-desc">' + post.story + '</p>' +
    '</div></div><div class="pitarchive--video-title">' +
    '<h4 class="video-title">' + post.name + '</h4></div></div></a>';

    $(newVideo).prependTo('.pitarchive--list');

    if((i + 1) === snapshot.val().length) {
      payItForward();
    }
  }
});
{% endhighlight %}

#### Submissions
Users go to a page with a form to submit their videos. The form does two main things, email the info to me or my client, and upload the selected video to the server. Submissions get reviewed before being published. Here's a screen recording of the submission work flow.

<div class="youtube" style="padding-bottom: 62.5%;">
<iframe src="https://www.youtube-nocookie.com/embed/Hg2HRqjBa9c?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
</div>

I'm using two steps of validation for the form, the first is Javascript to ensure all fields have been filled in properly before the form can be submitted, the second does the same thing using PHP. I also check to make sure the selected file type is accepted to keep people from uploading bad files.

The PHP validation will never be seen unless the user turns off Javascript, but I felt it was a good idea to use anyway. When a field isn't valid an error message gets created to tell the user what went wrong.

{% highlight php %}
<?php
if ($myname === '') :
  $err_myname = '<span class="input-validate" data-input-validate="pit--submit-name">Name is required</span>';
  $formerrors = true;
endif; // input field empty
{% endhighlight %}

The error message is then inserted into the label for that input.

{% highlight php %}
<label for="pit--submit-name">Your Name
  <?php if (isset($err_myname)) { echo $err_myname; } ?>
</label>
<input name="pit--submit-name" type="text" class="pit--submit-name" id="pit--submit-name" value="<?php if (isset($myname)) { echo $myname; } ?>" placeholder="Your Name">
{% endhighlight %}

Files won't be uploaded unless the have an accepted file type. It's pretty simple, I have an array of file types that are accepted and I just check if the file extension matches an object in the array. If the file doesn't match then an error message is created just like for the rest of the inputs. If it does match then the file gets uploaded to the server.

{% highlight php %}
<?php
$allowedExtensions = array("gif","jpeg","jpg","png", "mp4", "mov", "avi", "wmv", "flv", "webm", "3gp");
$path_parts = pathinfo($uploadfilename);
$ext = $path_parts['extension'];

if(!in_array($ext,$allowedExtensions)) :
  $err_myfile = '<span class="input-validate" data-input-validate="pit--submit-name">Sorry unaccepted file type.</span>';
  $formerrors = true;
else : //check file type
  if (move_uploaded_file($tmp_name, $newfilename)) :
    $msg = "File Uploaded";
  else :
    $msg = "Sorry couldn't upload file";
    $formerrors = true;
  endif; //move uploaded file
endif; //check file type
{% endhighlight %}

And that's pretty much it for now. I'm not happy with it yet, and I probably never will be, so more iterations will come in the future but for now the project is on hold.
