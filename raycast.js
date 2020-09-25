const TILE_SIZE = 40;
const NUM_MAP_COLS = 20;
const NUM_MAP_ROWS = 14;
const WINDOW_WIDTH = NUM_MAP_COLS * TILE_SIZE;
const WINDOW_HIEGHT = NUM_MAP_ROWS * TILE_SIZE;

const RADIUN = Math.PI / 180;
const FOV_ANGLE = 60 * RADIUN;
const RAY_WIDTH = 10;
const NUM_RAYS = WINDOW_WIDTH / RAY_WIDTH;

class Map {
  constructor() {
    this.grid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
  }
  isThisWall(x, y) {
    if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HIEGHT) {
      return true;
    }
    let gridIndexX = Math.floor(x / TILE_SIZE);
    let gridIndexY = Math.floor(y / TILE_SIZE);
    return this.grid[gridIndexY][gridIndexX] != 0;
  }
  render() {
    for (let i = 0; i < NUM_MAP_ROWS; i++) {
      for (let j = 0; j < NUM_MAP_COLS; j++) {
        let tileX = j * TILE_SIZE;
        let tileY = i * TILE_SIZE;
        let tileColor = this.grid[i][j] === 1 ? "#222" : "#fff";
        stroke("#222");
        fill(tileColor);
        rect(tileX, tileY, TILE_SIZE);
      }
    }
  }
}

class Player {
  constructor() {
    this.x = WINDOW_WIDTH / 2;
    this.y = WINDOW_HIEGHT / 2;
    this.radius = 10;
    this.turnDirection = 0; //if left -1 oppeset is +1
    this.walkDirection = 0; // if back -1 opposet id +1
    this.sideDirection = 0;
    this.rotationAngle = Math.PI / 2;
    this.moveSpeed = 5.0;
    this.rotationSpeed = 5 * (Math.PI / 180);
  }
  update() {
    // TODO: update player position
    this.rotationAngle += this.turnDirection * this.rotationSpeed;
    let newPlayerX;
    let newPlayerY;
    if (keyCode == 68 || keyCode == 65) {
      let moveStep = this.sideDirection * this.moveSpeed;
      newPlayerX =
        this.x + Math.cos(this.rotationAngle - 90 * RADIUN) * moveStep;
      newPlayerY =
        this.y + Math.sin(this.rotationAngle - 90 * RADIUN) * moveStep;
    } else {
      let moveStep = this.walkDirection * this.moveSpeed;
      newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
      newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;
    }
    if (!grid.isThisWall(newPlayerX, newPlayerY)) {
      this.x = newPlayerX;
      this.y = newPlayerY;
    }
  }
  render() {
    noStroke();
    fill("red");
    circle(this.x, this.y, this.radius);
    stroke("red");
    line(
      this.x,
      this.y,
      this.x + Math.cos(this.rotationAngle) * 30,
      this.y + Math.sin(this.rotationAngle) * 30
    );
  }
}

class Ray {
  constructor(rayAngle) {
    this.rayAngle = rayAngle;
  }
  render() {
    stroke("rgba(255, 0, 0, 0.2)");
    line(
      fPlayer.x,
      fPlayer.y,
      fPlayer.x + Math.cos(this.rayAngle) * 30,
      fPlayer.y + Math.sin(this.rayAngle) * 30
    );
  }
}

var grid = new Map();
var fPlayer = new Player();
var rays = [];

function keyPressed() {
  if (keyCode == 87) {
    fPlayer.walkDirection = +1;
  } else if (keyCode == 83) {
    fPlayer.walkDirection = -1;
  } else if (keyCode == 68) {
    fPlayer.sideDirection = -1;
  } else if (keyCode == 65) {
    fPlayer.sideDirection = +1;
  } else if (keyCode == RIGHT_ARROW) {
    fPlayer.turnDirection = +1;
  } else if (keyCode == LEFT_ARROW) {
    fPlayer.turnDirection = -1;
  }
}

function keyReleased() {
  if (keyCode == 87) {
    fPlayer.walkDirection = 0;
  } else if (keyCode == 83) {
    fPlayer.walkDirection = 0;
  } else if (keyCode == 68) {
    fPlayer.sideDirection = 0;
  } else if (keyCode == 65) {
    fPlayer.sideDirection = 0;
  } else if (keyCode == RIGHT_ARROW) {
    fPlayer.turnDirection = 0;
  } else if (keyCode == LEFT_ARROW) {
    fPlayer.turnDirection = 0;
  }
}

function castAllRays() {
  var columnId = 0;
  //start first ray by subtracting half of the field of view
  var rayAngle = fPlayer.rotationAngle - FOV_ANGLE / 2;
  rays = [];
  //loop all columns casting the rays
  for (let i = 0; i < NUM_RAYS; i++) {
    // for (let i = 0; i < 1; i++) {
    var ray = new Ray(rayAngle);
    //todo: ray.cast()....
    rays.push(ray);
    rayAngle += FOV_ANGLE / NUM_RAYS;
    columnId++;
  }
}

function setup() {
  // TODO: initilize all objects;
  createCanvas(WINDOW_WIDTH, WINDOW_HIEGHT);
}

function update() {
  // TODO: update game objects efore we render the next frame;
  fPlayer.update();
  castAllRays();
}

function draw() {
  // render all objects frame by frame
  update();
  grid.render();
  for (ray of rays) {
    ray.render();
  }
  fPlayer.render();
}
