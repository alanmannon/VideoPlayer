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
    if (previousCookie === undefined) {
      //First Upload
      document.cookie = "url=" + JSON.stringify(result.info);
    } else if (previousCookie != undefined) {
      //Subsequent uploads - WILL BREAK IF THERE ARE PLAYLISTS
      var newCookie = previousCookie + ", " + JSON.stringify(result.info);
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
  thumbnailString += `<img src=${index.thumbnail_url} href=${index.url} style="width: 200px; height: 150px; margin: 10px; border: 2px solid rgb(173, 253, 47); border-radius: 7px;"></img><button style="height: 30px; width: 30px;" onclick="addToPlaylist('${index.thumbnail_url}')">+</button>`;
});

document.getElementById("thumbnail-container").innerHTML = thumbnailString;





//PLAYLIST CODE
// function addToPlaylist(thumbnailUrl) {
//   var entry = data.find(video => video["thumbnail_url"] === thumbnailUrl);
//   entry["playlistName"] = selectPlaylist;
//   var playlistArray = [];
//   playlistArray.push(JSON.stringify(entry));
//   console.log(playlistArray);
//   // //if there are no playlists before... 
//   if (previousPlaylist() === undefined) {
//     console.log('new');
//     document.cookie = "playlist=" + playlistArray;
//   } else if (previousPlaylist() !== undefined) {
//     console.log('added');
//     document.cookie = previousPlaylist() + ", " + playlistArray;
//   }
// }

// function previousPlaylist() {
//   var previousPlaylist = document.cookie.split('; ').find(row => row.startsWith('playlist'));
//   return previousPlaylist;
// }

// function findPlaylists() {
//   if (playlistNumber === 1) {
//     console.log("1st");
//     var playlistLog = playlistCookie.substring(8);
//   } else if (playlistNumber > 1) {
//     console.log("2nd");
//     var playlistLog = (playlistCookie.substring(8)).split(', ');
//   }
//   return parsePlaylist(playlistLog);
// }


// function parsePlaylist(array) {
//   var finalarray = [];
//   if (playlistNumber === 1) {
//     finalarray.push(JSON.parse(array));
//   } else if (playlistNumber > 1) {
//     for (var i = 0; i < array.length; i++) {
//       finalarray.push(JSON.parse(`${array[i]}`));
//     }
//   }
//   return finalarray;
// }

// const playlists = findPlaylists();


//Begin on Page Load, Find Data from previous cookie. 
// var playlistCookie = document.cookie.split('; ').find(row => row.startsWith('playlist'));
// if (playlistCookie !== undefined) {
//   var playlistNumber = playlistCookie.match(/"playlistName":/g).length;
//   console.log("# of Playlists Items", playlistNumber);
// } else {
//   playlistNumber = 0;
// }


// //PLAYLIST SELECTOR
// let dropdownBtn = document.querySelector('.menu-btn');
// let menuContent = document.querySelector('.menu-content');
// dropdownBtn.addEventListener('click', () => {
//   if (menuContent.style.display === "") {
//     menuContent.style.display = "block";
//   } else {
//     menuContent.style.display = "";
//   }
// });

// function setPlaylist(word) {
//   selectPlaylist = word;
//   console.log(selectPlaylist);
// }
