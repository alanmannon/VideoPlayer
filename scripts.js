// Video Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const voice = document.querySelector('.button-voice');
const volumeRange = document.getElementById('volume_range');

// Video Functions

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


function toggleMute(el) {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = video.volume;
    el.src = 'icons/volume.svg';
  } else {
    video.muted = true;
    el.src = 'icons/mute.svg';
    volumeRange.value = 0;
  }
}

function isFullScreen() {
  return (document.fullScreenElement && document.fullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null) ||
    (document.mozFullScreen || document.webkitIsFullScreen);
}

function enterFS() {
  var page = player;
  if (player.requestFullscreen) {
    player.requestFullscreen();
  } else if (page.mozRequestFullScreen) {
    page.mozRequestFullScreen();
  } else if (page.msRequestFullscreen) {
    page.msRequestFullscreen();
  } else if (page.webkitRequestFullScreen) {
    page.webkitRequestFullScreen();
  }
}

function exitFS() {
  if (document.exitFullScreen) {
    return document.exitFullScreen();
  } else if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen();
  }
}

function toggleFullScreen() {
  if (!isFullScreen()) {
    enterFS();
  } else {
    exitFS();
  }
}


// Video Events
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


canvas.width = canvas.getBoundingClientRect().width;
canvas.height = video.getBoundingClientRect().height;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.globalCompositeOperation = 'multiply';

let colorIndex = 0;
const colors = ['red', 'black', 'blue', 'yellow'];
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 1;
let direction = true;
let currentColor = colors[0];
let lineSize = 20;

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  ctx.lineWidth = 20;
  ctx.lineWidth = lineSize;

}

function clearCanvas() {
  const canvas = document.getElementById('video_canvas');
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const hotClear = document.getElementById("clear");
  hotClear.classList.add('playing');
  hotClear.addEventListener('transitionend', removeTransition);
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

//Canvas Stroke Elements
document.getElementById("color-picker").onclick = colorChanger;
document.getElementById("line-size").onchange = lineChange;
const lineSizeHotkey = document.getElementById("line-size");

function colorChanger() {
  if (colorIndex < 3) {
    colorIndex++;
    currentColor = colors[colorIndex];
    ctx.strokeStyle = currentColor;
    (document.getElementById("color-picker").style.backgroundColor = colors[colorIndex]);

  } else {
    colorIndex = 0;
    currentColor = colors[colorIndex];
    ctx.strokeStyle = currentColor;
    (document.getElementById("color-picker").style.backgroundColor = colors[colorIndex]);
  }
}

function lineChange() {
  lineSize = this.value;
  ctx.lineWidth = lineSize;
}


// Voice Recognition

function voiceStart() {
  const hotVoice = document.getElementById("voice");
  hotVoice.classList.add('playing');
  hotVoice.addEventListener('transitionend', removeTransition);
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
      if (transcript.includes('play')) {
        video.play();
      }
    } else if (transcript.includes('pause')) {
      video.pause();
    } else if (transcript.includes('skip')) {
      video.currentTime += 10;
    } else if (transcript.includes('back')) {
      video.currentTime -= 5;
    } else if (transcript.includes('volume max')) {
      video.volume = 1;
    } else if (transcript.includes('mute')) {
      video.volume = 0;
    }
  });

  recognition.addEventListener('end', recognition.start);

  recognition.start();
}
// Voice Event listener
// voice.addEventListener('click', voiceStart);

// voice.addEventListener('click', voiceStart.stop);

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

// HotKeys
window.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (e.key === 'r') {
    clearCanvas();
  } else if (e.key === 'q') {
    colorChanger();
  } else if (e.key === ' ') {
    togglePlay();
  } else if (e.key === 'f') {
    toggleFullScreen();
  } else if (e.key === 'w') {
    lineSizeHotkey.value = (lineSizeHotkey.value - 5);
    lineSize = lineSizeHotkey.value;
  } else if (e.key === 'e') {
    lineSizeHotkey.value = parseInt(lineSizeHotkey.value) + 5;
    lineSize = lineSizeHotkey.value;
  } else if (e.key === 'v') {
    voiceStart();
  }
});



function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  this.classList.remove('playing');
}