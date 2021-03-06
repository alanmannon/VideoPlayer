// COOKIES LIBRARY



document.cookie = "path=/";
const query = window.location.search;

var selectPlaylist = "";

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

if (window.location.href !== "http://localhost:8080/library.html" && query.includes('?')) {
  console.log(query);
  const videoParameter = query.substring(1);
  console.log(videoParameter);
  document.getElementById('videourl').src = `${data[videoParameter].url}`;
}

//Cloudinary Widget
var myWidget = cloudinary.createUploadWidget({
  cloudName: 'dzi01cqjq',
  uploadPreset: 'w5ixakcl'
}, (error, result) => {
  if (!error && result && result.event === "success") {
    var libraryEntry = {
      url: result.info.url,
      thumbnail_url: result.info.thumbnail_url
    };
    if (previousCookie === undefined) {
      //First Upload

      document.cookie = "url=" + JSON.stringify(libraryEntry);
    } else if (previousCookie != undefined) {
      //Subsequent uploads - WILL BREAK IF THERE ARE PLAYLISTS
      var newCookie = previousCookie + ", " + JSON.stringify(libraryEntry);
      document.cookie = newCookie;
      console.log("Added to original cookies");

    }
    console.log('Done! Here is the image info: ', result.info);
    console.log('Cookie is:', document.cookie);
  }
});

document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);


//Sets some pieces of DATA into a called cookieKeys
// if (data === true) {
var thumbnailString = "";
data.forEach(function (index) {
  thumbnailString += `<img src=${index.thumbnail_url} href=${index.url} 
    style="width: 200px; 
    height: 150px; 
    margin: 30px; 
    border: 2px solid rgb(173, 253, 47);
    border-radius: 7px;
    cursor: pointer"
    onclick="playVideo('${index.url}')">
    </img>
  <button style=
    "height: 30px; width: 30px; 
    font-weight:700; 
    background-color: 
    rgb(50,50,50); 
    color:lightgray; 
    border: 0; 
    border-radius: 4px; 
    cursor:pointer;" 
    onclick="addToPlaylist('${index.thumbnail_url}')">
  +</button>`;
});

if (window.location.href === "http://localhost:8080/library.html") {
  document.getElementById("thumbnail-container").innerHTML = thumbnailString;
}


function setPlaylist(word) {
  selectPlaylist = word;
  console.log(selectPlaylist);
}

function playVideo(videoUrl) {
  console.log(videoUrl);
  var videoIndex = data.findIndex(video => video["url"] === videoUrl);
  console.log(videoIndex);
  window.location.href = `http://localhost:8080?${videoIndex}`;
}





function addToPlaylist(thumbnailUrl) {
  var entry = data.find(video => video["thumbnail_url"] === thumbnailUrl);
  entry["playlistName"] = selectPlaylist;
  var playlistArray = [];
  playlistArray.push(JSON.stringify(entry));
  console.log(playlistArray);
  // //if there are no playlists before... 
  if (previousPlaylist() === undefined) {
    console.log('new');
    document.cookie = "playlist=" + playlistArray;
  } else if (previousPlaylist() !== undefined) {
    console.log('added');
    document.cookie = previousPlaylist() + ", " + playlistArray;
  }
}

function previousPlaylist() {
  var previousPlaylist = document.cookie.split('; ').find(row => row.startsWith('playlist'));
  return previousPlaylist;
}

// if (query.includes("playlist") {
// var vid = document.getElementById("videourl");
// vid.onended = function () {

//   window.location.href = `http://localhost:8080?${videoIndex}`;
// };
// }