// ======================================== GENERAL DEPENDENCIES

require("dotenv").config(); // DOTENV for environment variables managing.
var Spotify = require("node-spotify-api"); // SPOTIFY package importing.
var keys = require("./keys.js"); // Key file importing.
var axios = require("axios"); // Package to make HTTP requests.
var fs = require("fs"); // Native "fs" package inclusion for file writing and reading.
var inquirer = require("inquirer"); // Package to beautify and amplify data input.
var moment = require("moment"); // Moment package.

var spotifyKeys = new Spotify(keys.spotify);


// ======================================== API CALL FUNCTIONS

// ============================= SPOTIFY

var spotifyCall = function (songBand) {
  if (songBand === undefined) {
    songBand = "Avientame";
  }
  spotifyKeys.search({
      type: "track",
      query: songBand,
      limit: 10
    },
    function (err, data) {
      if (err) {
        console.log("Ooops! An: " + err + " occured.");
        return;
      }
      // console.log(data);
      var songs = data.tracks.items;
      // console.log(songs);
      console.log(
        "\n\n" + songs.length.toString() +
        " INPUTS RETRIEVED: " + "\n\n");
      for (var i = 0; i < songs.length; i++) {
        console.log(
          "Searched song info =================================" + "\n" +
          "   Result: " + (i + 1).toString() + "\n" +
          "   Artist: " + songs[i].artists[0].name + "\n" +
          "   Song: " + songs[i].name + "\n" +
          "   Album: " + songs[i].album.name + "\n" +
          "   Released: " + songs[i].album.release_date + "\n" +
          "   Preview song: " + songs[i].preview_url + "\n" +
          "====================================================" + "\n\n");
      }
    }
  );
};


// ============================= OMDB

var IMDBcall = function (movie) {
  if (movie === undefined) {
    movie = "Lost in Translation";
  }
  var movieURL =
    "http://www.omdbapi.com/?t=" +
    movie +
    "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios
    .get(movieURL)
    .then(function (response) {
      // console.log(response);
      console.log(
        "Searched movie info =================================" + "\n" +
        "   Title: " + response.data.Title + "\n" +
        "   Year: " + response.data.Year + "\n" +
        "   Rated: " + response.data.Rated + "\n" +
        "   IMDB Rating: " + response.data.imdbRating + "\n" +
        "   Rotten Tomatoes Rating: " + response.data.tomatoRating + "\n" +
        "   Country: " + response.data.Country + "\n" +
        "   Language: " + response.data.Language + "\n" +
        "   Plot: " + response.data.Plot + "\n" +
        "   Actors: " + response.data.Actors + "\n" +
        "====================================================" + "\n\n");
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error: ", error.message);
      }
      console.log(error.config);
    });

};


// ============================= BANDS IN TOWN

var BandsInTownCall = function (band) {
  if (band === undefined) {
    band = "CAIFANES";
  }
  var bandURL =
    "https://rest.bandsintown.com/artists/" +
    band +
    "/events?app_id=codingbootcamp";

  axios
    .get(bandURL)
    .then(function (response) {
      // console.log(response.data.length);
      console.log(
        "\n\n" + response.data.length.toString() +
        " EVENTS RETRIEVED: " + "\n\n");
      for (var i = 0; i < response.data.length; i++) {
        console.log(
          band.toUpperCase() + " upcoming events info ==========================" + "\n" +
          "   Held at: " + response.data[i].venue.name + "\n" +
          "   City: " + response.data[i].venue.city + "\n" +
          "   Country: " + response.data[i].venue.country + "\n" +
          "   Date: " + moment(response.data[i].datetime).format("MMMM DD, YYYY") + ".\n" +
          "========================================================" + "\n\n");
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error: ", error.message);
      }
      console.log(error.config);
    });

};


// ============================= READ FROM FILE

var readFromFile = function () {
  fs.readFile('random.txt', 'utf8', function (error, data) {
    // console.log(data);
    var dataArr = data.split(',');
    console.log(dataArr);
    if (dataArr.length === 2) {
      userInputSimple(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      userInputSimple(dataArr[0]);
    }
  });
};


// ======================================== SELECT THE CALL FROM FILE

var userInputSimple = function (caseData, input) {
  switch (caseData) {
    case "spotifyIt": // SPOTIFY
      spotifyCall(input);
      break;
    case "movieIt": // IMDB
      IMDBcall(input);
      break;
    case "bandIt": // BANDS IN TOWN
      BandsInTownCall(input);
      break;
  }
};


// ======================================== SELECT THE CALL AND ASK FOR INPUT

function userInput(selectedAction, input) {
  switch (selectedAction) {
    case "spotifyIt": // SPOTIFY
      inquirer.prompt([{
        type: "input",
        message: "Type the song name you would like me to search for:",
        name: "secondArg"
      }]).then(function (soptifyResp) {
        spotifyCall(soptifyResp.secondArg);
      });
      break;
    case "movieIt": // IMDB
      inquirer.prompt([{
        type: "input",
        message: "Type the movie name you would like me to search for:",
        name: "secondArg"
      }]).then(function (movieResp) {
        IMDBcall(movieResp.secondArg);
      });
      break;
    case "bandIt": // BANDS IN TOWN
      inquirer.prompt([{
        type: "input",
        message: "Type the movie name you would like me to search for:",
        name: "secondArg"
      }]).then(function (concertsResp) {
        BandsInTownCall(concertsResp.secondArg);
      });
      break;
    case "myUsual": // Whatever default action is set on "random.txt" file. 
      console.log(
        "\n\n=================================================" + "\n" +
        "   I will be giving you my default information, \n" +
        "   Maybe you would like to try again afterwards. \n" +
        "=====================================================" + "\n\n");
      readFromFile();
  }
};


// ======================================== ASK FOR THE ACTION CALL

inquirer.prompt([{
  type: "list",
  message: "Select the action you want me to execute:",
  choices: ["spotifyIt", "movieIt", "bandIt", "myUsual"],
  name: "action"
}]).then(function (Response) {

  userInput(Response.action);

});