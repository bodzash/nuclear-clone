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

let deleteQueue = []

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
function loadSprite(path) {
  return new Promise(resolve => {
    let spr = new Image()
    spr.addEventListener("load", resolve(spr))
    spr.src = path
  })
}

// Loads a level
function loadLevel(array) {
  mainArray = []
  array.forEach(item => {
    instanceCreate(item.ent, item.x, item.y, item.layer) //item.layer
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

function lendirX(dist, angle) {
  return dist * Math.cos(angle)
}

function lendirY(dist, angle) {
  return dist * Math.sin(angle)
}

// Creates an instance from a class at position
function instanceCreate(cls, x, y, layer = mainArray) {
  let inst = new cls(x, y)
  layer.push(inst)
  return inst
}

function instanceDestroy(ins) {
  let del = mainArray.findIndex(item => ins == item)
  mainArray.splice(del, 1)
}

function instanceFind(className) {
  return mainArray.find(item => item instanceof className)
}

function instanceFindAll(className) {
  return mainArray.filter(item => item instanceof className)
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
    //resolveCollision(obj1, obj2)
    return true
  } else {
    return false
  }
}

function resolveCollision(obj1, obj2) {
  let angDeg = pointDirection(obj2.x, obj2.y, obj1.x, obj1.y)

  if (angDeg > 45 && angDeg < 135) obj1.y += 1
  if (angDeg > 135 && angDeg < 225) obj1.x -= 1
  if (angDeg > 225 && angDeg < 315) obj1.y -= 1
  if (angDeg > 315 || angDeg < 45) obj1.x += 1

  // for cicrcles
  //obj1.x += Math.round(Math.cos(degToRad(angDeg)))
  //obj1.y += Math.round(Math.sin(degToRad(angDeg)))
}

// ASSET LOADING

// LOAD SPRITES

const sprFishIdle = await loadSprite("./Players/fishIdle.png")
const sprFishWalk = await loadSprite("./Players/fishWalk.png")

const sprBullet = await loadSprite("./Projectiles/bullet1.png")

const shd24 = await loadSprite("./UI/shd24.png")
const shd48 = await loadSprite("./UI/shd48.png")

const bckFloor1 = await loadSprite("./Environment/floor1.png")
const bckFloor2 = await loadSprite("./Environment/floor1b.png")

const sprAnchorIdle = await loadSprite("./Props/anchor.png")
const sprAnchorHurt = await loadSprite("./Props/anchorHurt.png")
const sprAnchorDead = await loadSprite("./Props/anchorDead.png")

const sprCrosshair = await loadSprite("./UI/crosshair.png")

const sprAssault = await loadSprite("./Weapons/assault.png")

const sprCrabIdle = await loadSprite("./Enemies/crabIdle.png")
const sprCrabWalk = await loadSprite("./Enemies/crabWalk.png")
const sprCrabHurt = await loadSprite("./Enemies/crabHurt.png")
const sprCrabDead = await loadSprite("./Enemies/crabDead.png")
const sprCrabFire = await loadSprite("./Enemies/crabFire.png")


//const sndAmbiance1 = loadSound("./Sounds/ambience1.ogg")
const mscOasis = loadSound("./Sounds/oasis.ogg")
//const mscOasis = loadSound("./Sounds/oasis2.ogg")


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
  }

  dot() {

  }
}

// GAME CLASSES

class Enemy {}

class Cursor {
  Render() {
    ctx.drawImage(sprCrosshair, Input.mouseX - 6, Input.mouseY - 6)  // <- local position 0-320
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.team = 0 //0-player 1-enemy
    this.angle = 0
    this.frame = 0

    this.colxo = 0
    this.colyo = 0
    this.colW = 8
    this.colH = 8
  }

  Update() {
    if (this.frame < 1) { 
      this.frame = 1
      this.colxo = -4 - lendirX(-10, degToRad(this.angle) )
      this.colyo = -4 - lendirY(-10, degToRad(this.angle) )
    }

    this.x += 7 * Math.cos(degToRad(this.angle))
    this.y += 7 * Math.sin(degToRad(this.angle))

    if (this.x < 0 || this.x > 320 || this.y < 0 || this.y > 240) instanceDestroy(this)
  }

  Render() {
    ctx.save()
    ctx.translate(this.x + viewX, this.y + viewY)
    ctx.rotate(this.angle * 3.14 / 180) // <-
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

    //ctx.fillStyle = "rgb(0, 0, 128, .5)"
    //ctx.fillRect((this.x + this.colxo) + Math.floor(viewX), (this.y + this.colyo) + Math.floor(viewY), this.colW, this.colH )
  }
}

class Corpse {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.sprite = null
    this.width = 48
    this.height = 48
    this.frame = 0
    this.maxFrame = 1
  }

  Render() {
    if (this.frame > this.maxFrame - 1) {
      this.frame = this.maxFrame - 1
    } else {
      this.frame += 0.2
    }
    
    ctx.drawImage(this.sprite, 48 * Math.floor(this.frame), 0, 48, 48, Math.round(this.x) - 24 + viewX, Math.round(this.y) - 24 + viewY, 48, 48)
  }
}

class Crab {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.sheet = {idle: sprCrabIdle, walk: sprCrabWalk, hurt: sprCrabHurt, dead: sprCrabDead, fire: sprCrabFire}
    this.sprite = this.sheet.idle
    this.frame = 0

    this.hp = 7

    this.colxo = -16
    this.colyo = -16
    this.colW = 32
    this.colH = 32
  }

  Update() {
    this.frame += 0.24
    let maxFrame = 1
    switch(this.sprite) {
      case this.sheet.idle: maxFrame = 5; break
      case this.sheet.walk: maxFrame = 6; break
      case this.sheet.hurt: maxFrame = 3; break
    }

    if (this.sprite == this.sheet.hurt && this.frame > maxFrame) {this.frame = 0; this.sprite = this.sheet.idle}

    if (this.frame > maxFrame) this.frame = 0
   
    //Collision with Bullets
    let toColl =  instanceFindAll(Bullet)
    if (toColl) {
      toColl.forEach(bullet => {
        if (checkCollision(this, bullet)) {
          this.frame = 0
          this.sprite = this.sheet.hurt
          this.hp -= 1
          instanceDestroy(bullet)
        }
      })
    }

    //Death
    if (this.hp <= 0) {
      instanceDestroy(this)
      let corpse = instanceCreate(Corpse, this.x, this.y, backArray)
      corpse.sprite = sprCrabDead
      corpse.maxFrame = 7
    }

    let player = instanceFind(Player) //mainArray.find(item => item instanceof Player)

    let dis = pointDistance(this.x, this.y, player.x, player.y)
    let angle = pointDirection(this.x, this.y, player.x, player.y)

    if (dis <= 64 ) {
      if (this.sprite == this.sheet.hurt) return

      if (this.sprite != this.sheet.walk) {
        this.frame = 0
        this.sprite = this.sheet.walk
      }
      this.x -= .5 * Math.cos(degToRad(angle))
      this.y -= .5 * Math.sin(degToRad(angle))
    } else {
      if (this.sprite == this.sheet.walk) {
        this.frame = 0
        this.sprite = this.sheet.idle
      }
    }

  }

  Render() {
    ctx.globalAlpha = 0.4
    ctx.drawImage(shd48, this.x - 24 + viewX, this.y - 24 + viewY)
    ctx.globalAlpha = 1

    ctx.drawImage(this.sprite, 48 * Math.floor(this.frame), 0, 48, 48, this.x - 24 + viewX, this.y - 24 + viewY, 48, 48)
    
    //ctx.fillStyle = "rgb(0, 0, 128, .5)"
    //ctx.fillRect( Math.floor((this.x + this.colxo) + viewX), Math.floor((this.y + this.colyo) + viewY), this.colW, this.colH )
  }
}

class Anchor {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.sprite = sprAnchorIdle
    this.hp = 5
    this.frame = 0

    this.colxo = -16
    this.colyo = -16
    this.colW = 32
    this.colH = 32
  }

  Update() {

    //Collision with Bullets
    let toColl =  instanceFindAll(Bullet)
    if (toColl) {
      toColl.forEach(bullet => {
        if (checkCollision(this, bullet)) {
          this.frame = 0
          this.sprite = sprAnchorHurt
          this.hp -= 1
          instanceDestroy(bullet)
        }
      })
    }

    //Death
    if (this.hp <= 0) {
      instanceDestroy(this)
      let corpse = instanceCreate(Corpse, this.x, this.y, backArray)
      corpse.sprite = sprAnchorDead
      corpse.maxFrame = 6
    }
  }

  Render() {
    this.frame += 0.20
    if (this.sprite == sprAnchorIdle && this.frame > 6) this.frame = 0
    if (this.sprite == sprAnchorHurt && this.frame > 3) {this.frame = 0; this.sprite = sprAnchorIdle}

    ctx.drawImage(this.sprite, 48 * Math.floor(this.frame), 0, 48, 48, this.x - 24 + viewX, this.y - 24 + viewY, 48, 48)
    
    //ctx.fillStyle = "rgb(0, 0, 128, .5)"
    //ctx.fillRect((this.x + this.colxo) + Math.floor(viewX), (this.y + this.colyo) + Math.floor(viewY), this.colW, this.colH )
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
    this.hspeed = 0
    this.vspeed = 0
    this.speed = 1

    this.angle = 0
    this.sheet = {idle: sprFishIdle, walk: sprFishWalk}
    this.sprite = sprFishIdle
    this.prevSprite = this.sprite
    this.frame = 0

    this.fire = -1
    this.recoil = 0

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

     // fire timer
    if (this.fire >= 0) this.fire--

    // recoil smooth
    if (this.recoil > 0) this.recoil -= 1 //this.fire == -1 && 
    
    this.hspeed = (Input.d - Input.a) * this.speed
    this.vspeed = (Input.s - Input.w) * this.speed
    
    this.x += this.hspeed
    this.y += this.vspeed
      
    this.sprite = (Input.a || Input.d || Input.w || Input.s) ? sprFishWalk : sprFishIdle
      
    if (this.sprite !== this.prevSprite) {this.frame = 0; this.prevSprite = this.sprite;}

    if (Input.mouseLeftHold && this.fire == -1) {
      this.recoil = 5
      this.fire = 6
      let bullet = instanceCreate(Bullet, this.x + lendirX(8, degToRad(this.angle)), this.y + lendirY(8, degToRad(this.angle)))
      bullet.angle = this.angle + (Math.random() * 16 ) - 8
    }
    
    let toColl = instanceFind(Anchor)
    if (toColl) checkCollision(this, toColl) && resolveCollision(this, toColl)

    //Set camera focus to these coors
    viewX = (viewNativeW / 2 - this.x) - (Input.mouseX / 3) + (viewNativeW / 2 / 3)
    viewY = (viewNativeH / 2 - this.y) - (Input.mouseY / 3) + (viewNativeH / 2 / 3)
  }

  Render() {
    this.angle = pointDirection(this.x, this.y, Input.mouseX - viewX, Input.mouseY - viewY)
    
    if (Input.mouseY - viewY <= this.y) {
      ctx.save()
      ctx.translate(this.x + lendirX(-this.recoil, degToRad(this.angle)) + viewX, this.y + lendirY(-this.recoil, degToRad(this.angle)) + viewY)
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
      ctx.translate(this.x + lendirX(-this.recoil, degToRad(this.angle)) + viewX, this.y + lendirY(-this.recoil, degToRad(this.angle)) + viewY)
      ctx.rotate(this.angle * 3.14 / 180) //covert it back to radians
      ctx.scale( 1, (Input.mouseX - viewX > this.x) ? 1 : -1)
      ctx.drawImage(sprAssault, -4, -11)
      ctx.restore()
    }

    //ctx.fillStyle = "rgb(0, 0, 128, .5)"
    //ctx.fillRect((this.x + this.colxo) + Math.floor(viewX), (this.y + this.colyo) + Math.floor(viewY), this.colW, this.colH)
  }

}

function _tileFiller(level) {
  for(let h = 0; h < 8; h++) {
    for(let w = 0; w < 10; w++) {
      level.push({ent: Tile, x: w * 32, y: h * 32, layer: backArray})
    }
  }
}

function _tileBFiller(level) {
  for(let h = 0; h < 8; h++) {
    for(let w = 0; w < 10; w++) {
      Math.random() < .1 && level.push({ent: TileB, x: w * 32, y: h * 32, layer: backArray})
    }
  }
}

//LOAD LEVELS
const firstLevel = []

_tileFiller(firstLevel)
_tileBFiller(firstLevel)

firstLevel.push({ent: Anchor, x: 128, y: 64})
firstLevel.push({ent: Anchor, x: 80, y: 64})
firstLevel.push({ent: Anchor, x: 32, y: 64})

firstLevel.push({ent: Crab, x: 64, y: 128})

firstLevel.push({ent: Player, x: 16, y: 16})

firstLevel.push({ent: Cursor, x: 0, y: 0})
firstLevel.push({ent: TrackControler})




//GAME LOOP
loadLevel(firstLevel)
requestAnimationFrame(gameLoop)
console.log("Game started...")

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  //backArray.forEach(ent => ent.Update?.())
  mainArray.forEach(ent => ent.Update?.())
  //frontArray.forEach(ent => ent.Update?.())
  
  backArray.forEach(ent => ent.Render?.())
  mainArray.forEach(ent => ent.Render?.())
  frontArray.forEach(ent => ent.Render?.())

  
  Input.mouseLeftDown = 0
  Input.mouseRightDown = 0

  requestAnimationFrame(gameLoop)
}