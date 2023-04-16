import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";
import { createImage } from "./utils";

const gravity = 1.5;
class Player {
  constructor(canvas) {
    this.score = 0;
    this.canvas = canvas;
    this.c = canvas.getContext("2d");
    this.speed = 10;
    this.position = {
      x: 100,
      y: 200,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 66;
    this.height = 150;

    this.image = createImage(spriteStandRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }
  draw() {
    this.c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= this.canvas.height)
      this.velocity.y += gravity;
  }
}

class StationaryObject {
  constructor({ x, y, image, canvas }) {
    this.position = {
      x,
      y,
    };
    this.c = canvas.getContext("2d");
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    this.c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class Platform extends StationaryObject {}
class Star extends StationaryObject{
    constructor({ x, y, image, canvas }){
        super({ x, y, image, canvas })
        this.length = 50;
        this.count = 0;
        this.oy = y
        this.offset = Math.random()*0.3;
        this.visible = true;
    }
    draw(){
      this.count+= 0.03;
     super.draw()
    
      this.position.y = this.oy + Math.sin(this.offset+this.count)*this.length
    }
}

class GenericObject {
  constructor({ x, y, image, canvas }) {
    this.position = {
      x,
      y,
    };
    this.c = canvas.getContext("2d");
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    this.c.drawImage(this.image, this.position.x, this.position.y);
  }
}

export { Platform, Player, GenericObject,Star};
