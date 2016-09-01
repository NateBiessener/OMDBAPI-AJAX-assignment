console.log('sourced');

var savedResults = [];

$(document).ready(function () {
  console.log('jquery works');
  $('#searchButton').on('click', function () {
    // console.log('clicked');
    var movie = $('#movieIn').val();
    if (movie === '') {
      $('#outDiv').empty();
      $('#outDiv').append('<h1>That\'s like, not a search, man.</h1>');
    }//end if
    else {
      console.log('searching for', movie);
      var searchURL = 'http://www.omdbapi.com/?s=' + movie;
      $.ajax({
        url: searchURL,
        dataType: 'JSON',
        success: function(data){
          savedResults.unshift(data.Search);
          displayResults(savedResults);
        },// end success func
      });//end ajax call
    }//end else
  });//end searchButton on click
});//end doc ready

var displayResults = function(resultArray){
  // var placeholder = $('#outDiv').html();
  // $('#outDiv').empty();
  // if (savedResults.length > 1) {
  //   $('#outDiv').append(placeholder);
  // }

  var movieOut = '';
  for (var j = 0; j < resultArray[0].length; j++){
    var movie = resultArray[0][j];
    movieOut += '<div class="movie" id="' + 0 + j + '" style="display:none;margin:2vw;"><h2 style="width:150px;">' + movie.Title + '</h2><p>' +  movie.Year + '</p><button class="removalButton" onclick="removeMovie(' + 0 + ',' + j + ')" style="margin:2px;">Remove this movie</button><br /><img style="height:200px;width:150px;" src="' + movie.Poster + '" alt="Image not found"/></div>';
  }//end nested for

  $('#outDiv').prepend(movieOut);
  updateIndices();
  $('.movie').each(function(movie){
    $(this).delay(500*(movie+1)).fadeIn(1000);
  });
};//end displayResults

//function takes two nums, index1, index2.   Will
var removeMovie = function(movieArray, movie){
  console.log('in removeMovie with:', movieArray, movie);
  console.log(savedResults);
  savedResults[movieArray].splice(movie, 1);
  $('#' + movieArray + movie).fadeOut(400,'swing',function(){
    //after fadeout, remove from DOM and update indices of the div ID and removeMovie arguments
    $(this).remove();
    updateIndices();
  });//end fadeOut
  console.log('savedResults after removeMovie:', savedResults);
};//end removeMovie

//updates id's for movie divs and updates removeMovie arguments for each button
var updateIndices = function(){
  console.log('in updateButtons');
  //get top level array length and each sub array length
  var topLength = savedResults.map(function(index){
    return index.length;
  });
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

//relevant properties from data.Search:
//Poster
//Title
//Type (movie, game, etc)
//Year
