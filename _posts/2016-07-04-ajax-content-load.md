---
layout:     posts
title:      AJAX Content Loading
date:       2016-07-04
thumbnail:  jquery.png
assets:     /assets/post-assets/17-ajax-content-load/
categories: work
tags:       jquery javascript ajax
---
This is part of a project I'm working on for a client. It's a way for users to find insurance brokers in their areas in Ottawa.
My idea for this came from my laziness of not wanting to write out a ton of html for each broker in each region. So I made an MVC like component to handle it by dynamically loading data from a JSON file into a view.

![map]({{ page.assets }}map.gif "ajax map")
I will post a useable demo when the full project is done.

### The Map Layout
This was a pain in the ass and should've been done with SVG, however design isn't my strongest skill (I suck) and I had a strict design spec from the client. So I had to take the map PNGs I was given and position each one absolutely, and make it responsive. Each region of the map is individually positioned, plus they're each resized and repositioned at different browser width break points. Yes it was hell, but I'm happy with the results.

### Dynamic Content
There are two views that get loaded into a container on the homepage. The map view is loaded initially, it has no dynamic content since it's a map and Ottawa doesn't really change shapes that often. The second view is for displaying the brokers in the selected region. This is where the dynamic content comes in, depending on which region is clicked a different list of data will be loaded but it is always loaded in a single view.

#### Region View
The view for the selected broker regions is pretty simple. It has two containers, one for listing the brokers for that region, and one for displaying info for individual brokers.

{% highlight html %}
<div class="brokers--list">
  <h4 id="selected-region"><!-- region name is loaded here --></h4>
  <p>Region Broker List</p>
  <ul class="region-brokers" id="region-brokers">
    <!-- brokers list is loaded here -->
  </ul>
</div>
<div class="brokers--selected" id="selected-broker">
  <h5 class="brokers--selected-cta">Select a broker from the list</h5>
  <!-- individual selected brokers info is sloaded here -->
</div>
{% endhighlight %}

#### Map View
Each map region element has a data attribute that contains the name of that region.

{% highlight html %}
<div class="map-container">
  <div class="north map-region" data-region="Northern"></div>
  <div class="east map-region" data-region="Eastern"></div>
  <div class="northeast map-region" data-region="Northeastern"></div>
  <div class="central map-region" data-region="Central"></div>
  <div class="south map-region" data-region="Southern"></div>
  <div class="west map-region" data-region="Western"></div>
</div>
{% endhighlight %}


#### Selecting a Region
When a map region is clicked I grab the data attribute value. A JSON file containing all the brokers is loaded using AJAX with jQuery. I loop through the file and pull out all the brokers who are in the selected region. The brokers data gets structured into HTML list items and then inserted into an unordered list in the view.

Here's the region loading with overkill comments.

{% highlight javascript %}
//load the brokers JSON file
$.getJSON(brokerURL, function(data) {
  //store the brokers
  var brokersData = data;

  //user map selection
  $('.map-region').click(function() {

    //get the selected region
    var selectedRegion = $(this).attr('data-region');

    //load the region view template
    $('#brokers').hide().load('views/brokers-region.html', function() {

      //display the selected region title
      $('#selected-region').html(selectedRegion);

      //loop through all brokers
      //add broker and city to the list
      var selectedBrokers = "";
      $.each(brokersData, function(key, val) {
        if(val.Region === selectedRegion) {
          selectedBrokers += '<li class="region--list-item" data-region-broker="' + key + '">';
          selectedBrokers += val.Name;
          selectedBrokers += '<span class="broker-location">' + val.City + '</span>';
          selectedBrokers += '</li>';
        } //if selected region
      }); //each loop

      $('#region-brokers').html(selectedBrokers);

    }).fadeIn('500'); //region load
  }); //region click
}); //getJSON
{% endhighlight %}

#### Selecting a Single Broker
When a user clicks on a broker from the list they are given the contact info and address for that broker. Since this is more data being loaded from the JSON file it works exactly the same as selecting a region. Each broker is given a data attribute key, the selected key is matched in the JSON file, and that matched record is then structured and inserted into the HTML view. Exactly the same process as before.

#### Back to the Map
There's a button in the regions view that allows the user to go back to viewing the map, if the user clicked on the wrong region or wants to check out the other regions they should easily be able to do so. When the page loads the map is loaded in dynamically by calling a function, this same function is called when the back button is clicked. So it's in some way a recursive function, it calls itself.

{% highlight javascript %}
$('#map-back').click(function() {
  brokerMap();
  return;
});
{% endhighlight %}

I ended up learning a lot about loading content dynamically and I didn't have to write an insane amount of markup. When the broker list gets updated I can simply edit the JSON file and everything will work exactly the same.

One thing I might change in the future is how the JSON data is searched. Instead of looping through each record I would like to change it to use the higher order function "Filter". This would simplify the code, plus functional programming just looks cool as heck!

Also if someone wants to buy Adobe Illustrator for me so I can learn how to create SVGs then you can go right ahead! (this is a joke)

#### Here's the entire brokerMap() function

{% highlight javascript %}
function brokerMap() {
  //load the map section initialy
  $('#brokers').hide().load('views/brokers-map.html', function() {

    //load the broker data
    var brokerURL = 'assets/js/data/brokers.json';
    $.getJSON(brokerURL, function(data) {
      //store the brokers
      var brokersData = data;
      // console.log(brokersData);

      //user map selection
      $('.map-region').click(function() {

        //get the selected region
        var selectedRegion = $(this).attr('data-region');
        console.log(selectedRegion);

        //load the region view template
        $('#brokers').hide().load('views/brokers-region.html', function() {

          //display the selected region title
          $('#selected-region').html(selectedRegion);

          //loop through all brokers
            //add broker and city to the list
          var selectedBrokers = "";
          $.each(brokersData, function(key, val) {
            // console.log(val);
            if(val.Region === selectedRegion) {
              // console.log(val.Name);
              selectedBrokers += '<li class="region--list-item" data-region-broker="' + key + '">';
              selectedBrokers += val.Name;
              selectedBrokers += '<span class="broker-location">' + val.City + '</span>';
              selectedBrokers += '</li>';
            } //if selected region
          }); //each loop

          $('#region-brokers').html(selectedBrokers);

          //display the info on the First broker
          function displayBroker(selectionKey) {

            var brokerInfo = "";
            brokerInfo += '<h4>' + brokersData[selectionKey].Name + '</h4>';
            brokerInfo += '<p>' + brokersData[selectionKey].Broker_of_Record + '</p>';
            brokerInfo += '<p>' + brokersData[selectionKey].Address_1 + ', ';
            brokerInfo += brokersData[selectionKey].City + '</p>';
            brokerInfo += '<p>' + brokersData[selectionKey].Province + ' ';
            brokerInfo += brokersData[selectionKey].Postal_Code + '</p>';
            brokerInfo += '<p><a href="tel:' + brokersData[selectionKey].Brokers_Phone_No + '">' + brokersData[selectionKey].Brokers_Phone_No + '</a></p>';
            brokerInfo += '<p><a href="mailto:' + brokersData[selectionKey].Brokers_email + '">' + brokersData[selectionKey].Brokers_email + '</a></p>';

            $('#selected-broker').hide().empty().html(brokerInfo).fadeIn('500');

            //set the contact form info
          } //displayBroker

          //when a broker is clicked on
            //get the id of that broker
              //display their info instead
          $('.region--list-item').click(function() {
            //get the selected key
            var selectedBrokerKey = $(this).attr('data-region-broker');

            displayBroker(selectedBrokerKey);
          }); //region--list-item click

          //go back to the map page
          $('#map-back').click(function() {
            brokerMap();
            return;
          }); //back click
        }).fadeIn('500'); //region load
      }); //region click
    }); //getJSON
  }).fadeIn('500'); //initial map load
} //brokerMap
{% endhighlight %}
