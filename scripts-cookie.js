// COOKIES LIBRARY
document.cookie = "path=/";

function parseArray(array) {
  var finalarray = [];
  if (urlNumber === 1) {
    finalarray.push(JSON.parse(array));
  } else if (urlNumber > 1) {
    for (var i = 0; i < array.length; i++) {
      finalarray.push(JSON.parse(`${array[i]}`));
    }
  }
  return finalarray;
}


function findData() {
  if (urlNumber === 1) {
    console.log("1st");
    var videoArray = previousCookie.substring(4);
  } else if (urlNumber > 1) {
    console.log("2nd");
    var videoArray = (previousCookie.substring(4)).split(', ');
  }
  return parseArray(videoArray);
}


//Begin on Page Load, Find Data from previous cookie. 
var previousCookie = document.cookie.split('; ').find(row => row.startsWith('url'));
if (previousCookie != undefined) {
  var urlNumber = previousCookie.match(/"url":/g).length;
  console.log("# of Items", urlNumber);
} else {
  urlNumber = 0;
}




//Turns Cookie Data into Object
const data = findData();
console.log("PREVIOUS:", previousCookie);
console.log("DATA:", data);

//Cloudinary Widget
var myWidget = cloudinary.createUploadWidget({
  cloudName: 'dzi01cqjq',
  uploadPreset: 'w5ixakcl'
}, (error, result) => {
  if (!error && result && result.event === "success") {
    if (previousCookie === undefined) {
      //First Upload
      document.cookie = "url=" + JSON.stringify(result.info);
    } else if (previousCookie != undefined) {
      //Subsequent uploads
      var newCookie = previousCookie + ", " + JSON.stringify(result.info);
      document.cookie = newCookie;

      console.log("Added to original cookies");

    }
    console.log('Done! Here is the image info: ', result.info);
    console.log('Cookie is:', document.cookie);
  }
})

document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);


//Sets some pieces of DATA into a called cookieKeys
// if (data === true) {
var thumbnailString = "";
data.forEach(function (index) {
  thumbnailString += `<img src=${index.thumbnail_url} href=${index.url} style="width: 600;margin: 20px;"></img><input id="clickMe" type="button" value="clickme" onclick="addToPlaylist('${index.thumbnail_url}');" />`;
});
document.getElementById("thumbnail-container").innerHTML = thumbnailString;



var playlistArray = [];


//PLAYLIST CODE
function addToPlaylist(thumbnailUrl) {
  var entry = data.find(video => video["thumbnail_url"] === thumbnailUrl);
  // entry["playlistName"] = playlistName;

  playlistArray.push(JSON.stringify(entry));
  console.log(playlistArray);
  //if there are no playlists before... 
  // if (previousPlaylist() === undefined) {
  document.cookie = "playlist=" + playlistArray;
  // } else {
  //   document.cookie = document.cookie + playlistArray;
  // }
}

function previousPlaylist() {
  var previousPlaylist = document.cookie.split('; ').find(row => row.startsWith('playlist'));
  return previousPlaylist;
}

var previousPlaylistCookie = document.cookie.split('; ').find(row => row.startsWith('playlist'));

function findPlaylist() {
  // if (urlNumber === 1) {
  //   console.log("1st");
  //   var videoArray = previousCookie.substring(4);
  // } else if (urlNumber > 1) {
  var playlistArray = (previousPlaylistCookie.substring(4)).split(', ');
  // }
  return parseArray(playlistArray);
}

var playlist = findPlaylist();
document.getElementById("playlist").innerHTML = playlistArray;



//this sets the img tag with id 'videoinfo' to have a source = to thumbnail url, resulting in an image showing!
// document.getElementById("video-thumbnail").src = cookieKeys;
// }

//Renders DATA into the div with ID: Demo
// var readCookie = document.cookie.split(';').map(cookie => cookie.split('='));

//This line takes the 
// document.getElementById("demo").innerHTML = cookieKeys;
