// Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Functions

function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// Events
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
// ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);


// Canvas Elements
const canvas = document.querySelector('#video_canvas');
const ctx = canvas.getContext('2d');
// const playerWidth = parseInt(player.offsetWidth);
// console.log(playerWidth);
canvas.width = 650;
canvas.height = 315;
ctx.strokeStyle = '#BADASS';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.globalCompositeOperation = 'multiply';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
  ctx.lineWidth = 20;

}

function clearCanvas() {
  const canvas = document.getElementById('video_canvas');
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);


// Voice Recognition

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');



  if (e.results[0].isFinal) {
    console.log(e);
    if (transcript.includes('toggle play')) {
      togglePlay();
    }
  }
  else if (transcript.includes('srub')) {
    scrub();
  }
});

recognition.addEventListener('end', recognition.start);

recognition.start();



// COOKIES LIBRARY
// document.cookie = "path=/";

// function parseArray(array) {
//   var finalarray = [];
//   if (urlNumber === 1) {
//     finalarray.push(JSON.parse(array));
//   } else if (urlNumber > 1) {
//     for (var i = 0; i < array.length; i++) {
//       finalarray.push(JSON.parse(`${array[i]}`));
//     }
//   }
//   return finalarray;
// }


// function findData() {
//   if (urlNumber === 1) {
//     console.log("1st");
//     var videoArray = previousCookie.substring(4);
//   } else if (urlNumber > 1) {
//     console.log("2nd");
//     var videoArray = (previousCookie.substring(4)).split(', ');
//   }
//   return parseArray(videoArray);
// }


// //Begin on Page Load, Find Data from previous cookie. 
// var previousCookie = document.cookie.split('; ').find(row => row.startsWith('url'));
// if (previousCookie != undefined) {
//   var urlNumber = previousCookie.match(/"url":/g).length;
//   console.log("# of Items", urlNumber);
// } else {
//   urlNumber = 0;
// }




// //Turns Cookie Data into Object
// const data = findData();
// console.log("PREVIOUS:", previousCookie);
// console.log("DATA:", data);

// //Cloudinary Widget
// var myWidget = cloudinary.createUploadWidget({
//   cloudName: 'dzi01cqjq',
//   uploadPreset: 'w5ixakcl'
// }, (error, result) => {
//   if (!error && result && result.event === "success") {
//     if (previousCookie === undefined) {
//       //First Upload
//       document.cookie = "url=" + JSON.stringify(result.info);
//     } else if (previousCookie != undefined) {
//       //Subsequent uploads
//       var newCookie = previousCookie + ", " + JSON.stringify(result.info);
//       document.cookie = newCookie;
    
//       console.log("Added to original cookies");

//     }
//     console.log('Done! Here is the image info: ', result.info);
//     console.log('Cookie is:', document.cookie);
//   }
// })

// document.getElementById("upload_widget").addEventListener("click", function () {
//   myWidget.open();
// }, false);


// //Sets some pieces of DATA into a called cookieKeys
// if (data == true) {
//   var cookieKeys = {
//     "url": data[0].url,
//     "thumbnail": data[0].thumbnail_url,
//   }
//   //this sets the img tag with id 'videoinfo' to have a source = to thumbnail url, resulting in an image showing!
//   document.getElementById("video-thumbnail").src = cookieKeys.thumbnail;
// }

// //Renders DATA into the div with ID: Demo
// var readCookie = document.cookie.split(';').map(cookie => cookie.split('='));

// //This line takes the 
// document.getElementById("demo").innerHTML = readCookie;