var playlistCookie = document.cookie.split('; ').find(row => row.startsWith('playlist'));
if (playlistCookie !== undefined) {
  var playlistNumber = playlistCookie.match(/"playlistName":/g).length;
  console.log("# of Playlists Items", playlistNumber);
} else {
  playlistNumber = 0;
}




function findPlaylists() {
  if (playlistNumber === 1) {
    console.log("1st");
    var playlistLog = playlistCookie.substring(9);
  } else if (playlistNumber > 1) {
    console.log("2nd");
    var playlistLog = (playlistCookie.substring(9)).split(', ');
  }
  return parsePlaylist(playlistLog);
}


function parsePlaylist(array) {
  var finalarray = [];
  if (playlistNumber === 1) {
    finalarray.push(JSON.parse(array));
  } else if (playlistNumber > 1) {
    for (var i = 0; i < array.length; i++) {
      finalarray.push(JSON.parse(`${array[i]}`));
    }
  }
  return finalarray;
}


const playlists = findPlaylists();
console.log(playlists, "PLAYLISTS");

//makes an Object with key values from grouping identical key values in an array
const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};

const playlistDisplay = groupBy(playlists, 'playlistName');
console.log(playlistDisplay);




var playlistString = "";
for (const key in playlistDisplay) {
  var playlistEntry = "";
  playlistEntry += `<h3 style="color: lightgray; text-transform: uppercase; font-weight: 500;">${key}<h3>`;
  playlistDisplay[key].forEach(function (index) {
    playlistEntry += `<img src=${index.thumbnail_url} style="
    height: 120px; 
    margin: 30px; 
    border-radius: 7px;">
    </img>`;
    console.log(index.thumbnail_url);
  });
  playlistString += playlistEntry;
}

if (window.location.href === 'http://localhost:8080/playlist.html') {
  document.getElementById("playlist-gallery").innerHTML = playlistString;
}
