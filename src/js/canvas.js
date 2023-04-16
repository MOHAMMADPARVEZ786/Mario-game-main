import platform from "../img/platform.png";
import hills from "../img/hills.png";
import star from '../img/star.png';
import background from "../img/background.png";
import rocket from '../img/rocket.png'
import { Platform, Player, GenericObject, Star} from "./main";
import { createImage, fullscreen, isMobile, playAudio,randomIntFromRange } from "./utils";

import audio from '../img/audio.mp3'
import jump from '../img/jump.mp3'
import collect from '../img/collect.mp3'

import confetti from 'canvas-confetti';

const canvas = document.querySelector("canvas");
const con = document.querySelector('#con');
const c = canvas.getContext("2d");
const controls = document.getElementById('controls');
if(isMobile()){
  controls.classList.add('visible')
}
canvas.width = 1024;
canvas.height = 570;
con.width = 1024;
con.height = 570;
let maxScrolloffset = 16000;
let music = playAudio(audio, true);
let platformImage;
let starImage;
let jumpAudio, collectAudio;
let player = null;
let platforms = [];
let stars = [];
let genericObjects = [];
let rocketobj;
let lastKey;

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  platformImage = createImage(platform);
  starImage = createImage(star);
  jumpAudio = new Audio(jump);
  collectAudio = new Audio(collect);
  player = new Player(canvas);
platforms = [];
platforms.push(new Platform({ x: -301, y: 470, image: platformImage, canvas }))
platforms.push(new Platform({ x: -1, y: 470, image: platformImage, canvas }))
    let o=0;
  for(let i=0;i<18;i++){
      o+=100;
      platforms.push(
      new Platform({
        x:  700+ (platformImage.width+300) *i    - 2,
        y: 470-Math.random()*100,
        image: platformImage,
        canvas,
      }))
  }
new Platform({
      x:  700+ (platformImage.width*18+300*17)  - 2,
      y: 470-Math.random()*100,
      image: platformImage,
      canvas,
    })

    stars = platforms.map(platform=>new Star({x:randomIntFromRange(platform.position.x,platform.position.x+platform.width), y:platform.position.y-100,image:starImage,canvas}));
  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background),
      canvas,
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills),
      canvas,
    })
  ];
  rocketobj = new GenericObject({
    x:platforms.at(-1).position.x+platforms[3].width/2,
    y:platforms.at(-1).position.y-500,
    image:createImage(rocket),
    canvas
  })
  //headstart
  platforms.forEach(platform=>{
    // scrollOffset += 14640;
     platform.position.x += 300;
  })
  console.log(platforms)
  scrollOffset = 0;
}

function animate() {
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  stars.forEach(star=>{
    if (star.visible)
      star.draw();
  })
  rocketobj.draw()
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed && scrollOffset <maxScrolloffset ) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      stars.forEach(star=>{
        if(star.visible){
          star.position.x -= player.speed;
        }
      })
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
      rocketobj.position.x-=player.speed;

    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      stars.forEach(star=>{
        star.position.x += player.speed;
      })

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
      rocketobj.position.x+=player.speed;
    }
  }

  // console.log(scrollOffset);
  // star collision detection
  stars.forEach(star=>{
    if( star.visible &&
      player.position.x < star.position.x + star.width &&
        player.position.x + player.width > star.position.x &&
        player.position.y < star.position.y + star.height &&
        player.height + player.position.y > star.position.y
    ){
      if(!collectAudio.paused){
        collectAudio.pause();
        collectAudio.currentTime = 0;
      }
      collectAudio.play();
      star.visible = false;
      player.score +=1;
      console.log(player.score);

    }
  })

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      console.log(platforms.indexOf(platform))
    }
  });
  // sprite switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if(scrollOffset/maxScrolloffset>0.95){
    window.dispatchEvent(new CustomEvent('conf'));
    c.font = "100px Arial";
    c.fillText('You Win!!!',canvas.width/3,canvas.height/2);
  }
  
  // lose condition
  if (player.position.y > canvas.height) {
    init();
  }
  
  //stats
  c.rect(10,10,100,10);
  c.stroke();
  c.fillRect(10,10,(scrollOffset/maxScrolloffset)*100,10);
  c.font = "20px Arial";
  c.fillText(`Stars: ${player.score}`,10,50)
  requestAnimationFrame(animate);
}

addEventListener('conf',()=>{
  
    var myConfetti = confetti.create(con, {
      resize: true,
      useWorker: true
    });
    myConfetti({
      particleCount: 100,
      spread: 160
      // any other options from the global
      // confetti function
    });
   
    setTimeout(() => {
      myConfetti.reset();
    }, 1000);
}, {once:true});
document.querySelector('button').addEventListener('click',()=>{
    let div = document.querySelector('.start');
      console.log('hi',div)
    div.classList.add('invisible')
    fullscreen(document.getElementById('fullscreen'))
    // music.play()
    init();
});
init();
animate();

addEventListener('game-control-down',({detail:key})=>{
  console.log(key);
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;

    case 's':
    case 'ArrowDown':
      console.log("down");
      break;

    case 'd':
    case 'ArrowRight':
      console.log("right");
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 'w':
    case 'ArrowUp':
      console.log("up");
      if(player.velocity.y==0){
      player.velocity.y -= 25;
      // laserate(244)
      if(!jumpAudio.paused){
            jumpAudio.pause();
            jumpAudio.currentTime = 0;
      }
    jumpAudio.play();
    }
      break;
    case 'f':
     fullscreen(document.getElementById('fullscreen'));
    break;
    case 'm':
      if(!music.paused){
        music.pause();
        music.currentTime = 0;
      }else{
        music.play();
      }
    break;
  }

})
addEventListener('game-control-up',({detail:key})=>{
  // console.log(keyCode)
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      console.log("left");
      keys.left.pressed = false;
      break;

    case 's':
    case 'ArrowDown':
      console.log("down");
      break;

    case 'd':
    case 'ArrowRight':
      console.log("right");
      keys.right.pressed = false;

      break;
    case 'w':
    case 'ArrowUp':
      console.log("up");

      break;
  }

  console.log(keys.right.pressed);
})
addEventListener("keydown", ({ key }) => {
  window.dispatchEvent(new CustomEvent('game-control-down',{'detail':key}));
});

addEventListener("keyup", ({ key }) => {
  window.dispatchEvent(new CustomEvent('game-control-up',{'detail':key}));
});
document.querySelector('#right').addEventListener('touchstart',()=>{
  window.dispatchEvent(new CustomEvent('game-control-down',{'detail':'d'}));
})
document.querySelector('#right').addEventListener('touchend',()=>{
  window.dispatchEvent(new CustomEvent('game-control-up',{'detail':'d'}));
})
document.querySelector('#up').addEventListener('touchstart',(e)=>{
  window.dispatchEvent(new CustomEvent('game-control-down',{'detail':'w'}));
  e.stopPropagation();
})
document.querySelector('#up').addEventListener('touchend',(e)=>{
  window.dispatchEvent(new CustomEvent('game-control-down',{'detail':'w'}));
  e.stopPropagation();
})
// ?.addEventListenerListener('click',()=>{
//   alert('hi')
//   window.dispatchEvent(new CustomEvent('game-control-up',{'detail':'w'}));
// })