//PRE GAME
console.log("Game loading...")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.focus()
ctx.imageSmoothingEnabled = false;
canvas.style.width = "960px";
canvas.style.height = "720px";
let ratioX = .33
let ratioY = .33

let viewX = canvas.width / 2
let viewY = canvas.height / 2

let mainArray = [] //main loop shit

// INPUT SETUP
let Input = {
  a: 0,
  d: 0,
  w: 0,
  s: 0,

  mouseX: 0,
  mouseY: 0,
  mouseDown: 0
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

canvas.addEventListener("click", () => {
  Input.mouseDown = 1
})


//BUILT IN ENGINE FUNCTIONS

// Loads a sprite
function loadSprite(path) {
  let spr = new Image();
  spr.src = path;
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

// Returns angle between two points
function pointDirection(x1, y1, x2, y2) { //
  let theta = Math.atan2(y2 - y1, x2 - x1) * 180 / 3.14;
  if (theta < 0) theta += 360
  return theta
}

// Creates an instance from a class at position
function instanceCreate(cls, x, y) {
  mainArray.push(new cls(x, y))
}


// ASSET LOADING

// LOAD SPRITES
const sprFishIdle = loadSprite("./Players/fishIdle.png")
const sprFishWalk = loadSprite("./Players/fishWalk.png")
const sprFishHurt = loadSprite("./Players/fishHurt.png")
const sprFishDead = loadSprite("./Players/fishDead.png")


const sprBigFishIdle = loadSprite("./Bosses/bigFishIdle.png")
const sprBigFishWalk = loadSprite("./Bosses/bigFishWalk.png")
const sprBigFishHurt = loadSprite("./Bosses/bigFishHurt.png")
const sprBigFishDead = loadSprite("./Bosses/bigFishDead.png")

const sprCrabIdle = loadSprite("./Enemies/crabIdle.png")

const sprBoneFishIdle = loadSprite("./Enemies/boneIdle.png")

const sprBanditIdle = loadSprite("./Enemies/banditIdle.png")


const sprAssault = loadSprite("./Weapons/assault.png")

const shd24 = loadSprite("./UI/shd24.png")
const shd32 = loadSprite("./UI/shd32.png")
const shd48 = loadSprite("./UI/shd48.png")
const shd64 = loadSprite("./UI/shd64.png")

const bckFloor1 = loadSprite("./Environment/floor1.png")
const bckFloor2 = loadSprite("./Environment/floor1b.png")

const sprAnchor = loadSprite("./Props/anchor.png")
const sprWaterPlant = loadSprite("./Props/waterPlant.png")

const sprCrosshair = loadSprite("./UI/crosshair.png")



// LOAD TILES/BCK

// LOAD SOUNDS



// LOAD CLASSES
class _Entity {
  constructor() {}
}

class Enemy extends _Entity {
  constructor() {super()}


}

class Camera {
  Update() {

  }
}

class Cursor {
  Render() {
    ctx.drawImage(sprCrosshair, Input.mouseX - 6, Input.mouseY - 6)
  }
}

class Bandit {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.Create?.()
  }

  Create() {
    this.sprite = sprBanditIdle
    this.frame = 0
  }
  Update() {
    this.frame += 0.24 
    if (this.frame > 4) this.frame = 0 
  }

  Render() {
    ctx.globalAlpha = 0.4
    ctx.drawImage(shd24, this.x - 12, this.y - 12)
    ctx.globalAlpha = 1

    ctx.drawImage(this.sprite, 24 * Math.floor(this.frame), 0, 24, 24, this.x -12, this.y -12, 24, 24)
  }
}

class BoneFish {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.Create?.()
  }

  Create() {
    this.sprite = sprBoneFishIdle
    this.frame = 0
  }
  Update() {
    this.frame += 0.24 
    if (this.frame > 6) this.frame = 0 
  }

  Render() {
    ctx.globalAlpha = 0.4
    ctx.drawImage(shd24, this.x - 12, this.y - 12)
    ctx.globalAlpha = 1

    ctx.drawImage(this.sprite, 24 * Math.floor(this.frame), 0, 24, 24, this.x -12, this.y -12, 24, 24)
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
    ctx.drawImage(shd48, this.x - 24, this.y - 24)
    ctx.globalAlpha = 1

    ctx.drawImage(this.sprite, 48 * Math.floor(this.frame), 0, 48, 48, this.x -24 + viewX, this.y -24 + viewY, 48, 48)
  }
}

class BigFish {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.Create?.()
  }

  Create() {
    this.sprite = sprBigFishIdle
    this.frame = 0
  }
  Update() {
    this.frame += 0.24 
    if (this.frame > 8) this.frame = 0 
  }

  Render() {
    ctx.globalAlpha = 0.4
    ctx.drawImage(shd64, this.x - 32, this.y - 32 - 11)
    ctx.globalAlpha = 1

    ctx.drawImage(this.sprite, 64 * Math.floor(this.frame), 0, 64, 64, this.x -32, this.y -32, 64, 64)
  }
}

class Anchor {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frame = 0
  }

  Render() {
    this.frame += 0.26 
    if (this.frame > 6) this.frame = 0 
    ctx.drawImage(sprAnchor, 48 * Math.floor(this.frame), 0, 48, 48, this.x, this.y, 48, 48)
  }
}

class WaterPlant {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frame = 0
  }

  Render() {
    this.frame += 0.24 
    if (this.frame > 10) this.frame = 0 
    ctx.drawImage(sprWaterPlant, 24 * Math.floor(this.frame), 0, 24, 24, this.x, this.y, 24, 24)
  }
}

class Tile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frame = Math.random() * 4
  }

  Render() {
    ctx.drawImage(bckFloor1, 32 * Math.floor(this.frame), 0, 32, 32, this.x, this.y, 32, 32)
  }
}

class TileB {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  Render() {
    ctx.drawImage(bckFloor2, this.x - 2, this.y - 2)
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
    this.ang = 0
    this.sheet = {idle: sprFishIdle, walk: sprFishWalk}
    this.sprite = sprFishIdle
    this.prevSprite = this.sprite
    this.frame = 0
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
    
    this.x += this.hspeed
    this.y += this.vspeed
      
    this.sprite = (Input.a || Input.d || Input.w || Input.s) ? sprFishWalk : sprFishIdle
      
    if (this.sprite !== this.prevSprite) {this.frame = 0; this.prevSprite = this.sprite;}
  }

  Render() {
    let angle = pointDirection(this.x, this.y,Input.mouseX, Input.mouseY)

    viewX = canvas.width/2 - this.x
    viewY = canvas.height/2 - this.y
    
    if (Input.mouseY <= this.y) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(angle * 3.14 / 180) //covert it back to radians
      ctx.scale( 1, (Input.mouseX > this.x) ? 1 : -1)
      ctx.drawImage(sprAssault, -4, -11)
      ctx.restore()
    }

    ctx.save()
    ctx.translate(this.x, this.y)

    ctx.globalAlpha = 0.4
    ctx.drawImage(shd24, -12, -12)
    ctx.globalAlpha = 1

    ctx.scale( (Input.mouseX > this.x) ? 1 : -1 , 1)

    ctx.drawImage(this.sprite, 24 * Math.floor(this.frame), 0, 24, 24, -12, -12, 24, 24)
    
    ctx.restore()
    
    if (Input.mouseY >= this.y) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(angle * 3.14 / 180) //covert it back to radians
      ctx.scale( 1, (Input.mouseX > this.x) ? 1 : -1)
      ctx.drawImage(sprAssault, 0 -4, 0 -11)
      ctx.restore()
    }
  
  }

}

function _tileFiller(level) {
  for(let h = 0; h < 8; h++) {
    for(let w = 0; w < 10; w++) {
      level.push({ent: Tile, x: w * 32, y: h * 32},)
    }
  }
}

function _tileBFiller(level) {
  for(let h = 0; h < 8; h++) {
    for(let w = 0; w < 10; w++) {
      Math.random() < .1 && level.push({ent: TileB, x: w * 32, y: h * 32},)
    }
  }
}

//LOAD LEVELS
const firstLevel = []

_tileFiller(firstLevel)
_tileBFiller(firstLevel)
firstLevel.push({ent: BigFish, x: 160, y: 120})
firstLevel.push({ent: Crab, x: 110, y: 120})
firstLevel.push({ent: BoneFish, x: 70, y: 120})
firstLevel.push({ent: Bandit, x: 35, y: 120})

firstLevel.push({ent: Anchor, x: 230, y: 70})
firstLevel.push({ent: WaterPlant, x: 12, y: 200})

firstLevel.push({ent: Player, x: 50, y: 50})

firstLevel.push({ent: Cursor, x: 0, y: 0})



//GAME LOOP
loadLevel(firstLevel)
requestAnimationFrame(gameLoop) //<- make it that, this will only run when assets are loaded
console.log("Game started...")

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  mainArray.forEach(ent => { ent.x += viewX; ent.y += viewY}) //viewport bullshit
  mainArray.forEach(ent => ent.Update?.())
  mainArray.forEach(ent => ent.Render?.())
  requestAnimationFrame(gameLoop)
};