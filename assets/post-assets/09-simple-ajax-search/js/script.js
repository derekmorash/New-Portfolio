$('#search').keyup(function() {

  var searchField = $('#search').val();
  var myExp = new RegExp(searchField, "i");

  $.getJSON('/assets/post-assets/09-simple-ajax-search/data.json', function(data) {
    var output = '<ul class="searchresults">';
    $.each(data, function(key, val) {
      if(val.name.search(myExp) != -1) {
        output += '<li>';
        output += '<img src="/assets/post-assets/09-simple-ajax-search/images/' + val.shortname + '_tn.jpg" alt="' + val.name + '">';
        output += '<div class="info">';
        output += '<h2>' + val.name + '</h2>';
        output += '<p>' + val.bio + '</p>';
        output += '</div';
        output += '</li>';
      }
    });
    output += '</ul>';
    $('#update').html(output);
  }); //get JSON
});
