---
layout:     posts
title:      Javascript Ajax JSON Search
date:       2016-04-25
thumbnail:  css3.png
assets:     /assets/post-assets/14-javascript-json-search/
categories: work
tags:       javascript json
---
First we'll set up our HTML, it's super simple. We'll need an input text box to type our search query into, and an unordered list to display the matched results. I have these wrapped in a form element just to be able to style it, but I won't cover any CSS styling in this.

{% highlight html %}
<form class="search-form">
  <input type="text" class="search" placeholder="City or State">
  <ul class="suggestions">
    <li>Filter for a city</li>
    <li>or a state</li>
  </ul>
</form>
{% endhighlight %}

The list item elements that are already in the HTML will be replaced using javascript when the user types.

We can now get ready setup for the Ajax call. First create a variable to store the URL for the JSON file, and a variable that will end up being the array of data in the JSON file.

{% highlight javascript %}
var url = 'someData.json';
var data = [];
{% endhighlight %}

Now we'll start the actual Ajax call. We create a new XMLHttpRequest and use that to GET the file contained at the URL we specified above. We use onreadystatechange to see when there's been a change in the request, or when data has been downloaded. Every time a chunk of data is downloaded check if that was the end of the file, if it is the end of the file then when we store the entire contents into the data variable we created.

{% highlight javascript %}
var xmlhttp = new XMLHttpRequest();

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    data = JSON.parse(xmlhttp.responseText);
  }
};
{% endhighlight %}

Once we have the data we can get into the logic of the search. We'll first need to create a reference to the DOM elements we created in our HTML, the search text box and the display list.

{% highlight javascript %}
var search = document.querySelector(".search");

var list = document.querySelector(".suggestions");
{% endhighlight %}

The whole point of an Ajax search is to be able to see live results as you type. So we'll need to create an even listener on the text box to run some code each time the user types a key, everything happens in here.

{% highlight javascript %}
search.addEventListener('keyup', function() {

});
{% endhighlight %}

Each time a key is pressed there needs to be a new regular expression made to match for the query typed in the input box. We'll make a variable called myExp (my expression) that will create a new regular expression using "search.value", where search is the reference to the input box we made earlier, and the Javascript RegExp modifiers "g" and "i", "g" is a global match meaning it doesn't stop at the first match in a string and "i" means the match is case-insensitive. We'll also create a placeholder variable that will later store our matched results to be outputted to the DOM.

{% highlight javascript %}
search.addEventListener('keyup', function() {
  var myExp = new RegExp(search.value, 'gi');

  var output = '';
});
{% endhighlight %}

First thing we want to do when a key is pressed is to check if the text box is empty, if the user hits backspace to clear any characters in the box. If it is empty then we'll take the list element and set it's innerHTML to be empty.

{% highlight javascript %}
if(search.value === '') {
  //remove all list items
  list.innerHTML = '';
}
{% endhighlight %}

(note: all of this is still inside the search keyUp function)

If the text box isn't empty, then we loop through all the records in the JSON data.

{% highlight javascript %}
if(search.value === '') {
  //remove all list items
  list.innerHTML = '';
} else {
  //loop through the data
  for(var key in data) {

  } //end for

} //end else
{% endhighlight %}

For each record in the data we want to check if the city or the state of the record matches our RegExp. We check this by using the Javascript search method on the record.

For the city we take the data record at the specific key the loop is at, and search the city object for "myExp". "(data[key].city.search(myExp) != -1)" If this does NOT return a "-1" then that means the expression matches. Then we use || to if the city OR state gives a match.

{% highlight javascript %}
else {
  //loop through the data
  for(var key in data) {

    if((data[key].city.search(myExp) != -1) || (data[key].state.search(myExp) != -1)) {
      console.log('We have a match!');
    } //end if
  } //end for

  //put the contents of the output variable into the list
  list.innerHTML = output;
} //end else
{% endhighlight %}

If we find a match we want to add the record info to our "output" variable. The output variable will hold each matched record found when looping through the data. The info in each matched record will be appended to a string and wrapped in the HTML list tags.

For this example I'm using extra span tags just for styling the different info being returned to the list.

{% highlight javascript %}
if((data[key].city.search(myExp) != -1) || (data[key].state.search(myExp) != -1)) {

  output += '<li><span>' + data[key].city + ', ' +
    data[key].state + '</span>' +
    '<span class="population">' + data[key].population +'</span>' +
    '</li>';

} //end if
{% endhighlight %}

Now we have to actually display the contents of the "output" variable in the list for the user to see. An easy mistake can be made here, we don't want to update the DOM every time a match is made inside the loop because there could be hundreds of matches. Updating the DOM that frequently will cause major performance issues, the search will slow down and maybe even cause the browser to lock up or crash.

This is why we store each matched result in the output variable instead of just updating the DOM each time. Looping through each record may seem like it could take a while especially if there's thousands of records, but it's actually very fast (I have this exact code running on a JSON file of 90,000 records and it responds instantly).

So we want to update the list element in the DOM __AFTER__ the loop is finished. All we do is grab the list element and set it's innerHTML to be the contents of the "output" variable.

{% highlight javascript %}
else {
  //loop through the data
  for(var key in data) {
    if((data[key].city.search(myExp) != -1) || (data[key].state.search(myExp) != -1)) {
      ...
    } //end if
  } //end for

  list.innerHTML = output;

} //end else
{% endhighlight %}

{% highlight javascript %}
if((data[key].city.search(myExp) != -1) || (data[key].state.search(myExp) != -1)) {

  output += '<li><span>' + data[key].city.replace(myExp, function(str) {
    return '<span class="hl">'+str+'</span>'
  }) + ', ' +
  data[key].state.replace(myExp, function(str) {
    return '<span class="hl">'+str+'</span>'
  }) + '</span><span class="population">' +
  data[key].population +'</span></li>';

} //end if
{% endhighlight %}



Here's the final code with overkill comments:

{% highlight javascript %}
var url = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

//get the search box
var search = document.querySelector(".search");
//get the list
var list = document.querySelector(".suggestions");
//initialize a variable to hold the data
var data = [];
//start an HTTP request
var xmlhttp = new XMLHttpRequest();

//make the HTTP request
xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    data = JSON.parse(xmlhttp.responseText);
  }
};

//when a key is pressed
search.addEventListener('keyup', function() {
  //create a new regex
  var myExp = new RegExp(search.value, 'gi');
  //create a new output variable
  var output = '';

  //if the search box is emptied
  if(search.value === '') {
    //remove all list items
    list.innerHTML = '';
  } else {
    //loop through the data
    for(var key in data) {
      //if the city or state matches
      if((data[key].city.search(myExp) != -1) || (data[key].state.search(myExp) != -1)) {
        //apend a new list item containing the location info to the output string variable
        var newLocation = '<li><span>' + data[key].city.replace(myExp, function(str) {
        return '<span class="hl">'+str+'</span>'}) + ', ' +
          data[key].state.replace(myExp, function(str) {
        return '<span class="hl">'+str+'</span>'}) + '</span><span class="population">' +
          data[key].population +'</span></li>';

        output += newLocation;

      } //end if
    } //end for

    //put the contents of the output variable into the list
    list.innerHTML = output;
  } //end else
}); //end searchList
{% endhighlight %}
