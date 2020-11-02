// COOKIES LIBRARY
document.cookie = "path=/";

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
    border-radius: 7px;">
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

document.getElementById("thumbnail-container").innerHTML = thumbnailString;



function setPlaylist(word) {
  selectPlaylist = word;
  console.log(selectPlaylist);
}


