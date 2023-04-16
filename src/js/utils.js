function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function playAudio(src, loop=false){
  myAudio = new Audio(src); 
  if (loop){
    if (typeof myAudio.loop == 'boolean')
    {
        myAudio.loop = true;
    }
    else
    {
        myAudio.addEventListener('ended', function() {
          alert('done')
            this.currentTime = 0;
            this.play();
        }, false);
    }
  }
      return myAudio;
}
function fullscreen(canvas) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
      .then(() => console.log("Document Exited from Full screen mode"))
      .catch((err) => console.error(err))
  } else {
    canvas.requestFullscreen();
  }
}

function isMobile(){
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;

  return regexp.test(details);
}



module.exports = { randomIntFromRange, randomColor, distance, createImage, playAudio, fullscreen, isMobile }
