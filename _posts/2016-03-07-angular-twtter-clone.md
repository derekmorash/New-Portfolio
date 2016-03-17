---
layout:     posts
title:      Angular Twitter Clone
date:       2016-03-08
thumbnail:  sass.png
assets:     /assets/post-assets/11-angular-twitter/
categories: work
tags:       javascript angular firebase
---
Okay so maybe not EXACTLY a twitter clone but that's not the point. I wanted to build a quick app and some sort of twitter/text based posting app is what came to mind. [Demo](http://derekmorash.github.io/AngularTwitter/#/login) the project, or view the [github repo](https://github.com/derekmorash/AngularTwitter) for the code.

![login page]({{ page.assets }}login.jpg "Login Page")

## Starting point
I love gulp, I use it for everything and this was no exception. My gulp process compiles my SASS, and I also use it to concatenate my javascript files into one so I only had to have one script tag to import the code I wrote. This isn't necessary the best way to do things when debugging because error messages only point to one file instead of pointing to the specific file where the error occurred, but this was a small project just for some experience so I could live with it.

I also wanted to make it look nice with a clean and simple design. I started by creating basic styles to give everything I might need a similar look and feel, like how I designed the buttons and input forms. For the styles I used SASS with the Bourbon and Neat mixin libraries just to make things quick and easy. I used the same SASS architecture for this project that I described in my last post, [here]({% post_url 2016-02-23-css-architecture-and-semantics %}).

### Angular Templates
I created a basic HTML document to structure the application and to layout the components I was going to use. Things like the login/register forms and the nav bar. I then broke these components up into their own view template files. I used a ng-include directive to pull in the nav.html template since it is a constant on each page. Next I have a main element with a ng-view that the main components of the app will be loaded into depending on the page the user is on.

### Angular MVC
Now getting into angular's magic. In my app.js file I declare an angular module named "myApp" (great name I know) that uses the ngRoute and firebase dependancies. Then in the module config I use $routeProvider to setup templates and controllers that will be used for what page the user is on, even though there's really only one page just the content of the page get's changed.

{% highlight javascript %}
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController' //created later
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController' //created later
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);
{% endhighlight %}

Now we can go to the /login page and see the login form or the /register page to see the register form. If the user tries to access any other page they are just redirected to the /login page.

## Firebase Authentication

Firebase does a great job at handling user authentication. For this project I used the basic email and password authentication but there are also APIs for Facebook, Twitter, and Google logins. It's so easy to get simple and secure authentication in any app.

The authentication service starts by declaring some variables for things needed for firebase. First is a reference to the Firebase URL for the app, and second is an instance of the Firebase authentication service for our app URL.

{% highlight javascript %}
var ref = new Firebase(FIREBASE_URL);
var auth = $firebaseAuth(ref);
{% endhighlight %}

__FIREBASE_URL__ is a constant I created in my app.js file to store the URL to my firebase app. This is so I can use it throughout the app and if I need to change the URL I can do it in just one place.

{% highlight javascript %}
var myApp = angular.module('myApp', ['ngRoute', 'firebase'])
  .constant('FIREBASE_URL', 'https://angulartwitter.firebaseio.com/');
{% endhighlight %}

### Login/Registration

When a user registers their information is first stored in Firebase's authentication but also as a data object to be used by the app. Firebase's user auth and login service stores the user email, date created, and unique user UID hash. The users password is never accessible but there are functions for reseting it.

The view stores the users info using a ng-model directive on each input box. Each input box stores it's data like this __ng-model="user.firstname"__. The user object used as in the login/register methods.

I created an angular service to handle authentication. The service returns an object that holds the methods used for login and registration. The registration method takes the data the user inputs into the register form and uses the Firebase $createUser function to create the new user.

{% highlight javascript %}
register: function(user) {
  auth.$createUser({
    email: user.email,
    password: user.password
  })...
} //register method
{% endhighlight %}

After the user is created created we get a promise back from Firebase, here we can store the rest of the user data in an object using the Firebase .set method that we key using the unique key generated by Firebase for that user __"regUser: regUser.uid,"__. After the user data is stored we also catch any errors that might occur, like if the email has already been registered.

{% highlight javascript %}
register: function(user) {
  //create firebase user, pass it an object of user info
  auth.$createUser({
    email: user.email,
    password: user.password
  }).then(function(regUser) { //callback promise from firebase

    //when the user is register, store their info as an object
    var regRef = new Firebase(FIREBASE_URL + 'users')
      .child(regUser.uid).set({
        date:      Firebase.ServerValue.TIMESTAMP,
        regUser:   regUser.uid,
        firstname: user.firstname,
        lastname:  user.lastname,
        email:     user.email
      }); //user info

    myObject.login(user);
  }).catch(function(error) {
    $rootScope.message = error.message;
  }); //auth.createUser()
} //register method
{% endhighlight %}

The user data that gets store is structured like this:

{% highlight json %}
{
  "users": {
    "0f0089bd-5ac8-4cd8-b2cc-346446a02ba0": {
      "firstname": "Derek",
      "lastname":  "Morash",
      "email":     "derek.morash@gmail.com",
      "date":      1457233194399, /*Server Value from firebase*/
      "regUser":   "0f0089bd-5ac8-4cd8-b2cc-346446a02ba0"
    },
    "a33d273e-2a3f-42a0-bfaa-a66638b6ab1b": {
      "firstname": "Carl",
      "lastname":  "Sagan",
      "email":     "carl.sagan@gmail.com",
      "date":      1458230984893, /*Server Value from firebase*/
      "regUser":   "a33d273e-2a3f-42a0-bfaa-a66638b6ab1b"
    }
  }
}
{% endhighlight %}

The login method is very similar but shorter. It takes the user object and verifies the user using the authentication service from Firebase. After the user is verified the app takes them to the /feed page where they will see all the tweets. If there are any errors like an incorrect password then they are caught and displayed to the user by a simple message using $rootScope and angular's data binding.

{% highlight javascript %}
login: function(user) {
  //pass the users login info to firebase
  auth.$authWithPassword({
    email:    user.email,
    password: user.password
  }).then(function(regUser) { //firebase callback promise
    $location.path('/feed');
  }).catch(function(error) { //cath any errors (incorrect password)
    $rootScope.message = error.message;
  });// auth
}, //login method
{% endhighlight %}


## The "Tweets"

### Data Structure

It took me a little while to figure out the best way to create the data structure for this app. I tried a few different things before settling with what I think will give me the best scaleability and ease of use.

One of the things I thought of was putting the tweets inside each user object that is created when the user registers. I thought this might be a good way to keep the tweets together and to show who they belong to. However this would cause the user object to get very large as more tweets are added, which would cause slow load times if you wanted to retrieve only the users information from the database.

So I decided to separate the tweets and the users into their own objects. Each tweet has a unique key, and also a reference to the user ID of the user who created the tweet so that the tweet can be joined with it's user.

{% highlight json %}
{
  "users": {...},
  "tweets" : {
    "-KC9s551uW1H9ZCuSGjN" : {
      "date" : 1457250132514, /*server value from firebase*/
      "tweet" : "This is a tweet",
      "userID" : "0f0089bd-5ac8-4cd8-b2cc-346446a02ba0" /*matches the users unique id*/
    },
    "-KC9zn9JADSrxL4i1I3Y" : {
      "date" : 1457252152016, /*server value from firebase*/
      "tweet" : "This is another tweet",
      "userID" : "0f0089bd-5ac8-4cd8-b2cc-346446a02ba0" /*matches the users unique id*/
    },
  }
}
{% endhighlight %}

### Adding and Retrieving Data (Tweets)

I'm using Angular Fire's ability to create three way data binding with the view, scope, and database. Whenever a tweet is added or deleted it will be automatically updated on the /feed page.

Using the reference to the the Firebase app, I get the child of "Tweets" which is the object that holds the tweets. On any change to the object, like a tweet added or deleted, I get retrieve the object as snapshot. I then loop through each tweet in the snapshot. For each tweet I grab the userID and then create another call to the database using the reference and a child of "users/" plus the userID of the current tweet. This happens only once for each tweet looped through so we can grab any user data belonging to the user who posted the current tweet.

{% highlight javascript %}
ref.child('tweets').on('value', function(snapshot) {
  //init an array to hold the tweets
  var tweetFeed = [];
  //loop through the list of tweets
  snapshot.forEach(function(childSnapshot) {
    //store the userID for each tweet
    var nextTweet = childSnapshot;
    //get the user based on the userID
    ref.child('users/' + nextTweet.val().userID).once('value', function(snapshot) {

    });
  });
});
{% endhighlight %}

Each time the user data is retrieved I create an object to hold all the data needed to display the tweets. This holds the userID, users first name, the tweet text, the unique key for the tweet (this won't be displayed but needed for CRUD actions), and the data given by firebase.

{% highlight javascript %}
var singleTweet = {
  userID: snapshot.key(),
  user: snapshot.val().firstname,
  tweet: nextTweet.val().tweet,
  tweetKey: nextTweet.key(),
  date: nextTweet.val().date
};
{% endhighlight %}

Then each singleTweet object is pushed into the tweetFeed array created when the tweets are first accessed. Once all the tweets have been looped through and stored in the tweetsFeed array I put the array in a $scope object to be used by the tweet HTML view template.

{% highlight javascript %}
ref.child('tweets').on('value', function(snapshot) {
  //init an array to hold the tweets
  var tweetFeed = [];
  //loop through the list of tweets
  snapshot.forEach(function(childSnapshot) {
    //store the userID for each tweet
    var nextTweet = childSnapshot;
    //get the user based on the userID
    ref.child('users/' + nextTweet.val().userID).once('value', function(snapshot) {
      //join the tweet and the user
      var singleTweet = {
        userID: snapshot.key(),
        user: snapshot.val().firstname,
        tweet: nextTweet.val().tweet,
        tweetKey: nextTweet.key(),
        date: nextTweet.val().date
      };
      //add the data to the array we initialized
      tweetFeed.push(singleTweet);
    });
  });
  $scope.tweetFeed = tweetFeed;
});
{% endhighlight %}

I have the tweets broken out into a custom directive. Here the tweetFeed $scope object is looped through using ng-repeat and filtered by date. For each tweet the users name is displayed with a link to their personal feed, and also the tweet itself is displayed using angular expressions.

{% highlight html %}
<div class="feed--tweet" ng-repeat="(key, tweet) in tweetFeed | orderBy: '-date'">
  <a ng-href="#/user/{% raw %}{{{% endraw %} tweet.userID {% raw %}}}{% endraw %}" class="tweet-user">{% raw %}{{{% endraw %} tweet.user {% raw %}}}{% endraw %}</a>
  <p>{% raw %}{{{% endraw %} tweet.tweet {% raw %}}}{% endraw %}</p>
</div>
{% endhighlight %}

### Next Steps

I need to add more CRUD functionality to the app. Users should be able to delete and edit their tweets. My first idea for this was to just only display the delete and edit buttons when that specific tweet belonged to the logged in user using the ngShow directive. The problem with this is that the buttons still exist in the markup, they are only being hidden, so anyone could inspect the element and remove that ngShow directive and be able to delete a tweet that doesn't belong to them. I need to think of a way to create the buttons ONLY if they belong to the person logged in instead of simply hiding them.

I'd also like to make the tweets load on scroll. Right now all tweets get loaded right away, there's no limit to how many are retrieved. It'd be nice to have a number like 20 be loaded at first and then when the user scrolls to the bottom of the page another 20 get loaded after.

And the last thing I'd like to add is the ability for users to update their account info or delete their accounts. This simply means going through Firebase's documentation and tutorials, but I think the CRUD actions are more a higher priority.
