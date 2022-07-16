
import "./test.js"

//PRE GAME
console.log("Game loading...")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.focus()
ctx.imageSmoothingEnabled = false;

const viewNativeW = 320
const viewNativeH = 240

const viewRenderW = 960
const viewRenderH = 720

canvas.style.width = `${viewRenderW}px`;
canvas.style.height = `${viewRenderH}px`;
let ratioX = viewNativeW / viewRenderW
let ratioY = viewNativeH /  viewRenderH

let viewX = 0 //canvas.width / 2
let viewY = 0 //canvas.height / 2

let backArray = [] //backgroud / tiles
let mainArray = [] //main loop shit
let frontArray = [] //ui shit

// INPUT SETUP
let Input = {
  a: 0,
  d: 0,
  w: 0,
  s: 0,

  f: 0,

  mouseX: 0,
  mouseY: 0,

  mouseLeftDown: 0,
  mouseRightDown: 0,

  mouseLeftUp: 0,
  mouseRightUp: 0,

  mouseLeftHold: 0,
  mouseRightHold: 0
};
//Later implement premade inputmap defined by user

// EVENT LISTENERS
window.addEventListener("keydown", (event) => {
  Input[event.key] = 1;
});

window.addEventListener("keyup", (event) => {
  Input[event.key] = 0;
});

canvas.addEventListener("mousemove", (event) => {
  Input.mouseX = Math.round((event.x - canvas.offsetLeft) * ratioX)
  Input.mouseY = Math.round((event.y- canvas.offsetTop) * ratioY)

  //Input.mouseViewX = Input.mouseX - viewX
  //Input.mouseViewY = Input.mouseY - viewY
})

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0) { Input.mouseLeftDown = 1; Input.mouseLeftHold = 1; }
  if (event.button === 2) { Input.mouseRightDown = 1; Input.mouseRightHold = 1; }
})

canvas.addEventListener("mouseup", (event) => {
  if (event.button === 0) { Input.mouseLeftUp = 1; Input.mouseLeftHold = 0; }
  if (event.button === 2) { Input.mouseRightUp = 1; Input.mouseRightHold = 0; }
})


//BUILT IN ENGINE FUNCTIONS

// Loads a sprite
function loadSprite(path, frames=1, xo=0, yo=0) {
  let spr = new Image();
  spr.src = path;

  spr.frames = frames
  spr.xo = xo
  spr.yo = yo

  return spr;
}

// Loads a level
function loadLevel(array) {
  mainArray = []
  array.forEach(item => {
    instanceCreate(item.ent, item.x, item.y)
  })
}

function loadSound(path) {
  let snd = new Audio();
  snd.src = path
  return snd
}

// Returns angle between two points in degrees
function pointDirection(x1, y1, x2, y2) {
  let theta = Math.atan2(y2 - y1, x2 - x1) * 180 / 3.14 // <- turn rad to deg
  if (theta < 0) theta += 360
  return theta
}

function pointDistance(x1, y1, x2, y2) {
  let xx = x2 - x1
  let yy  = y2 - y1

  return Math.sqrt(xx*xx + yy*yy)
}

// Turns degrees angle to radians
function degToRad(degree) {
  return degree * 3.14 / 180
}

// Turns radians angle to degrees
function radToDeg(radian) {
  return radian * 180 / 3.14
}

// Creates an instance from a class at position
function instanceCreate(cls, x, y) {
  let inst = new cls(x, y)
  mainArray.push(inst)
  return inst
}

// Renders a sprite same as draw_sprite_ext()
function drawSprite(spr, frame, x, y, w, h, xo, yo, xs, ys, ang, alp) {
  ctx.save()
  ctx.translate(x + viewX, y + viewY)
  ctx.rotate(ang * 3.14 / 180)
  ctx.globalAlpha = alp
  ctx.scale(xs, ys)
  ctx.drawImage(spr, w * frame, 0, w, h, xo, yo, w, h)
  ctx.scale(1, 1)
  ctx.globalAlpha = 1
  ctx.restore()
}

// Renders a sprite at position, simpilfied version
function drawSpriteSimple(spr, x, y) {
  ctx.drawImage(spr, x + viewX, y - viewY)
}

function checkCollision(obj1, obj2) {
  if (
    (obj1.x + obj1.colxo) + obj1.colW > (obj2.x + obj2.colxo) &&
    (obj1.x + obj1.colxo) < (obj2.x + obj2.colxo) + obj2.colW &&
    (obj1.y + obj1.colyo) + obj1.colH > (obj2.y + obj2.colyo) &&
    (obj1.y + obj1.colyo) < (obj2.y + obj2.colyo) + obj2.colH
    )
  {
    //console.log("COLLISION")
    let angDeg = pointDirection(obj2.x + 24, obj2.y + 24, obj1.x, obj1.y)

    obj1.x += Math.round(Math.cos(degToRad(angDeg)))
    obj1.y += Math.round(Math.sin(degToRad(angDeg)))

    console.log(Math.round(Math.cos(degToRad(angDeg))), Math.round(Math.sin(degToRad(angDeg))))
  }
}

// ASSET LOADING

// LOAD SPRITES
const sprFishIdle = loadSprite("./Players/fishIdle.png")
const sprFishWalk = loadSprite("./Players/fishWalk.png")

const sprCrabIdle = loadSprite("./Enemies/crabIdle.png")

const sprAssault = loadSprite("./Weapons/assault.png")

const sprBullet = loadSprite("./Projectiles/bullet1.png")

const shd24 = loadSprite("./UI/shd24.png")
const shd48 = loadSprite("./UI/shd48.png")

const bckFloor1 = loadSprite("./Environment/floor1.png")
const bckFloor2 = loadSprite("./Environment/floor1b.png")

const sprAnchor = loadSprite("./Props/anchor.png")

const sprCrosshair = loadSprite("./UI/crosshair.png")

const sndAmbiance1 = loadSound("./Sounds/ambience1.ogg")
const mscOasis = loadSound("./Sounds/oasis.ogg")
const mscOasis2 = loadSound("./Sounds/oasis2.ogg")




// LOAD TILES/BCK

// LOAD SOUNDS


// OTHER CLASSES
class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  normalize() {
    let m = Math.sqrt(this.x * this.x + this.y * this.y)
    if (m === 0) m = 1 // if m 0 it will get NaN cuz cant divide by 0
    this.x /= m
    this.y /= m

    //console.log(this.x, this.y)
  }

  dot() {

  }
}

// GAME CLASSES
class _Entity {
  constructor() {}
}

class Enemy extends _Entity {
  constructor() {super()}


}

class Cursor {
  Render() {
    ctx.drawImage(sprCrosshair, Input.mouseX - 6, Input.mouseY - 6)  // <- local position 0-320
    /*
    ctx.fillText(`mouse x: ${Input.mouseX}`, 8, 12)
    ctx.fillText(`mouse y: ${Input.mouseY}`, 8, 24)

    ctx.fillText(`view x: ${viewX}`, 8, 38)
    ctx.fillText(`view y: ${viewY}`, 8, 48)
    */
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.angle = 0
    this.frame = 0

    this.colxo = 0
    this.colyo = -2
    this.colW = 8
    this.colH = 8
  }

  Update() {
    if (this.frame < 1) this.frame = 1 
    this.x += 7 * Math.cos(degToRad(this.angle)) //convert ange to radiant
    this.y += 7 * Math.sin(degToRad(this.angle)) //convert ange to radiant
  }

  Render() {
    ctx.save()
    ctx.translate(this.x + viewX, this.y + viewY)
    ctx.rotate(this.angle * 3.14 / 180)
    ctx.globalAlpha = 0.15
    ctx.scale(2, 2)
    ctx.drawImage(sprBullet, 16 * Math.floor(this.frame), 0, 16, 16, -4, -8, 16, 16)
    ctx.scale(1, 1)
    ctx.globalAlpha = 1
    ctx.restore()

    ctx.save()
    ctx.translate(this.x + viewX, this.y + viewY)
    ctx.rotate(this.angle * 3.14 / 180)
    ctx.drawImage(sprBullet, 16 * Math.floor(this.frame), 0, 16, 16, 0, -8, 16, 16)
    ctx.restore()
  }
}


class Crab {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.Create?.()
  }

  Create() {
    this.sprite = sprCrabIdle
    this.frame = 0
  }
  Update() {
    this.frame += 0.24 
    if (this.frame > 5) this.frame = 0
  }

  Render() {
    ctx.globalAlpha = 0.4
    ctx.drawImage(shd48, this.x - 24 + viewX, this.y - 24 + viewY)
    ctx.globalAlpha = 1

    ctx.drawImage(this.sprite, 48 * Math.floor(this.frame), 0, 48, 48, this.x - 24 + viewX, this.y - 24 + viewY, 48, 48)
  }
}

class Anchor {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frame = 0

    this.colxo = 8
    this.colyo = 8
    this.colW = 32
    this.colH = 32
  }

  Render() {
    this.frame += 0.26 
    if (this.frame > 6) this.frame = 0 
    ctx.drawImage(sprAnchor, 48 * Math.floor(this.frame), 0, 48, 48, this.x + viewX, this.y + viewY, 48, 48)
    ctx.fillStyle = "rgb(0, 0, 128, .5)"
    ctx.fillRect((this.x + this.colxo) + Math.floor(viewX), (this.y + this.colyo) + Math.floor(viewY), this.colW, this.colH )
  }
}

class TrackControler {
  constructor() {
    //sndAmbiance1.play()
    //mscOasis.play()
  }
}

class Tile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frame = Math.random() * 4
  }

  Render() {
    ctx.drawImage(bckFloor1, 32 * Math.floor(this.frame), 0, 32, 32, this.x + viewX, this.y + viewY, 32, 32)
  }
}

class TileB {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  Render() {
    ctx.drawImage(bckFloor2, this.x - 2 + viewX, this.y - 2 + viewY)
  }
}

class Player {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
    this.speed = 0
    this.hspeed = 0
    this.vspeed = 0
    this.Create?.()
  }
  
  Create() {
    this.speed = 1
    this.angle = 0
    this.sheet = {idle: sprFishIdle, walk: sprFishWalk}
    this.sprite = sprFishIdle
    this.prevSprite = this.sprite
    this.frame = 0

    this.colxo = -6
    this.colyo = -6
    this.colW = 14
    this.colH = 14
  }

  Update() {
    switch(this.sprite) {
      case sprFishWalk: {
        this.frame += 0.22 
        if (this.frame > 6) this.frame = 0 
        break
      }
      case sprFishIdle: {
        this.frame += 0.28
        if (this.frame > 4) this.frame = 0
        break
      }
    }
    
    this.hspeed = (Input.d - Input.a) * this.speed
    this.vspeed = (Input.s - Input.w) * this.speed

    /*
    let x = Input.d - Input.a
    let y = Input.s - Input.w
    let m = Math.sqrt(x*x + y*y)
    if (m === 0) m = 1 
    this.hspeed = x / m
    this.vspeed = y / m
    console.log(this.hspeed, this.vspeed)
    */
    
    this.x += this.hspeed
    this.y += this.vspeed
      
    this.sprite = (Input.a || Input.d || Input.w || Input.s) ? sprFishWalk : sprFishIdle
      
    if (this.sprite !== this.prevSprite) {this.frame = 0; this.prevSprite = this.sprite;}

    if (Input.mouseLeftDown) {
      let bullet = instanceCreate(Bullet, this.x, this.y)
      bullet.angle = this.angle
    }
    
    let toColl = mainArray.find(item=> item instanceof Anchor)
    checkCollision(this, toColl)

    //Set camera focus to these coors
    viewX = (canvas.width /2 - Math.ceil(this.x)) - Input.mouseX/3 + 160/3
    viewY = (canvas.height/2 - Math.ceil(this.y)) - Input.mouseY/3 + 120/3
  }

  Render() {
    this.angle = pointDirection(this.x, this.y, Input.mouseX - viewX, Input.mouseY - viewY)
    
    if (Input.mouseY - viewY <= this.y) {
      ctx.save()
      ctx.translate(this.x + viewX, this.y + viewY)
      ctx.rotate(this.angle * 3.14 / 180) //covert it back to radians
      ctx.scale( 1, (Input.mouseX - viewX > this.x) ? 1 : -1)
      ctx.drawImage(sprAssault, -4, -11)
      ctx.restore()
    }

    ctx.save()
    ctx.translate(this.x + viewX, this.y + viewY)

    ctx.globalAlpha = 0.4
    ctx.drawImage(shd24, -12, -12)
    ctx.globalAlpha = 1

    ctx.scale( (Input.mouseX - viewX > this.x) ? 1 : -1 , 1)

    ctx.drawImage(this.sprite, 24 * Math.floor(this.frame), 0, 24, 24, -12, -12, 24, 24)
    
    ctx.restore()
    
    if (Input.mouseY - viewY >= this.y) {
      ctx.save()
      ctx.translate(this.x + viewX, this.y + viewY)
      ctx.rotate(this.angle * 3.14 / 180) //covert it back to radians
      ctx.scale( 1, (Input.mouseX - viewX > this.x) ? 1 : -1)
      ctx.drawImage(sprAssault, -4, -11)
      ctx.restore()
    }

    ctx.fillStyle = "rgb(0, 0, 128, .5)"
    ctx.fillRect((this.x + this.colxo) + Math.floor(viewX), (this.y + this.colyo) + Math.floor(viewY), this.colW, this.colH )
  }

}

function _tileFiller(level) {
  for(let h = 0; h < 10; h++) {
    for(let w = 0; w < 12; w++) {
      level.push({ent: Tile, x: w * 32, y: h * 32},)
    }
  }
}

function _tileBFiller(level) {
  for(let h = 0; h < 10; h++) {
    for(let w = 0; w < 12; w++) {
      Math.random() < .1 && level.push({ent: TileB, x: w * 32, y: h * 32},)
    }
  }
}

//LOAD LEVELS
const firstLevel = []

_tileFiller(firstLevel)
_tileBFiller(firstLevel)

firstLevel.push({ent: Crab, x: 50, y: 120})
firstLevel.push({ent: Anchor, x: 130, y: 70})
firstLevel.push({ent: Player, x: 16, y: 16})

firstLevel.push({ent: Cursor, x: 0, y: 0})
firstLevel.push({ent: TrackControler})




//GAME LOOP
loadLevel(firstLevel)
requestAnimationFrame(gameLoop) //<- make it that, this will only run when assets are loaded
console.log("Game started...")

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  backArray.forEach(ent => ent.Render?.())

  mainArray.forEach(ent => ent.Update?.())
  mainArray.forEach(ent => ent.Render?.())

  frontArray.forEach(ent => ent.Render?.())

  Input.mouseLeftDown = 0
  Input.mouseRightDown = 0

  requestAnimationFrame(gameLoop)
};