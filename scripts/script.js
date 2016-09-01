console.log('sourced');

var savedResults = [];

$(document).ready(function () {
  console.log('jquery works');
  $('#searchButton').on('click', function () {
    //make alias for readability
    var movie = $('#movieIn').val();
    //clear search field
    $('#movieIn').val('');
    //if search is blank, inform user
    if (movie === '') {
      $('#outDiv').prepend('<p id="noSearchMessage">That\'s like, not a search, man.</p>')
    }//end if
    else {
      console.log('searching for', movie);
      var searchURL = 'http://www.omdbapi.com/?s=' + movie;
      $.ajax({
        url: searchURL,
        dataType: 'JSON',
        success: function(data){
          if ($('#noSearchMessage')) {
            $('#noSearchMessage').remove();
          }
          //add most recent results to the 'front' of the array
          savedResults.unshift(data.Search);
          displayResults(savedResults);
        },// end success func
      });//end ajax call
    }//end else
  });//end searchButton on click
});//end doc ready

//function takes an array of search arrays and adds them to the DOM
var displayResults = function(resultArray){
  var movieOut = '';
  //create html for newest array
  for (var i = 0; i < resultArray[0].length; i++){
    var movie = resultArray[0][i];
    movieOut += '<div class="movie" id="' + 0 + i + '" style="display:none;margin:2vw;"><h2 style="width:150px;">' + movie.Title + '</h2><p>' +  movie.Year + '</p><button class="removalButton" onclick="removeMovie(' + 0 + ',' + i + ')" style="margin:2px;">Remove this movie</button><br /><img style="height:200px;width:150px;" src="' + movie.Poster + '" alt="Image not found"/></div>';
  }//end for
  //add newest movies to outDiv
  $('#outDiv').prepend(movieOut);
  updateIndices();
  //fadeIn each new movie sequentially
  $('.movie').each(function(movie){
    $(this).delay(500*(movie+1)).fadeIn(1000);
  });
};//end displayResults

//function takes two nums, index1, index2. Removes movie from savedResults[index1][index2] and from DOM.
var removeMovie = function(movieArray, movie){
  //remove targeted movie from it's array
  savedResults[movieArray].splice(movie, 1);
  //fadeOut targeted movie
  $('#' + movieArray + movie).fadeOut(400,'swing',function(){
    //after fadeOut, remove from DOM and update indices of the div ID and removeMovie arguments
    $(this).remove();
    updateIndices();
  });//end fadeOut
};//end removeMovie

//this one's inelegant, but it works
//updates id's for movie divs and updates removeMovie arguments for each button
var updateIndices = function(){
  //get top level array length and each sub array length
  var topLength = savedResults.map(function(index){
    return index.length;
  });
  //set counts
  var count1 = 0;
  var count2 = 0;
  //get all movie divs by class and adjust their id's
  $('.movie').each(function(index){
    $(this).attr('id', String(count1) + count2);
    if (count2 === topLength[count1] - 1) {
      count1++;
      count2 = 0;
    }
    else {
      count2++;
    }
  });//end movie.each callback
  //reset counts
  count1 = 0; count2 = 0;
  //get all removalButton buttons by class and adjust their onclick arguments
  $('.removalButton').each(function(index){
    $(this).attr('onclick', 'removeMovie(' + count1 + ',' + count2 + ')');
    if (count2 === topLength[count1] - 1) {
      count1++;
      count2 = 0;
    }
    else {
      count2++;
    }
  });//end removalButton.each callback
};//end updateButtons
