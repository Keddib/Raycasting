const TILE_SIZE = 40;
const NUM_MAP_COLS = 20;
const NUM_MAP_ROWS = 14;
const WINDOW_WIDTH = NUM_MAP_COLS * TILE_SIZE;
const WINDOW_HIEGHT = NUM_MAP_ROWS * TILE_SIZE;

const RADIUN = Math.PI / 180;
const FOV_ANGLE = 60 * RADIUN;
const RAY_WIDTH = 5;
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
        noStroke();
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
    this.rotationSpeed = 2 * (Math.PI / 180);
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
  }
}

class Ray {
  constructor(rayAngle) {
    this.rayAngle = normalizeAngle(rayAngle);
    this.wallHitX = 0;
    this.wallHitY = 0;
    this.distance = 0;
    this.wasHitVertical = false;
    this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
    this.isRayFacingUp = !this.isRayFacingDown;

    this.isRayFacingRight =
      this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
    this.isRayFacingLeft = !this.isRayFacingRight;
  }
  cast(columnId) {
    // getHwall hundle the horizontal ray grid intersection code
    // console.log("RIGHT?", this.isRayFacingRight);
    var xintercept, yintercept;
    var xstep, ystep;
    ///////////////////////////////////////////
    // HORIZONTAL RAY-GRID INTERSECTION CODE
    ///////////////////////////////////////////
    var foundHorzWallHit = false;
    var horzWallHitX = 0;
    var horzWallHitY = 0;

    // Find the y-coordinate of the closest horizontal grid intersenction
    yintercept = Math.floor(fPlayer.y / TILE_SIZE) * TILE_SIZE;
    yintercept += this.isRayFacingDown ? TILE_SIZE : 0;

    // Find the x-coordinate of the closest horizontal grid intersection
    xintercept = fPlayer.x + (yintercept - fPlayer.y) / Math.tan(this.rayAngle);

    // Calculate the increment xstep and ystep
    ystep = TILE_SIZE;
    ystep *= this.isRayFacingUp ? -1 : 1;

    xstep = TILE_SIZE / Math.tan(this.rayAngle);
    xstep *= this.isRayFacingLeft && xstep > 0 ? -1 : 1;
    xstep *= this.isRayFacingRight && xstep < 0 ? -1 : 1;
    var nextHorzTouchx = xintercept;
    var nextHorzTouchy = yintercept;
    // if (this.isRayFacingUp) {
    //   nextHorzTouchy--;
    // }
    while (isInsideGrid(nextHorzTouchx, nextHorzTouchy)) {
      if (
        grid.isThisWall(
          nextHorzTouchx,
          this.isRayFacingUp ? nextHorzTouchy - 1 : nextHorzTouchy
        )
      ) {
        foundHorzWallHit = true;
        horzWallHitX = nextHorzTouchx;
        horzWallHitY = nextHorzTouchy;
        break;
      } else {
        nextHorzTouchx += xstep;
        nextHorzTouchy += ystep;
      }
    }

    //gerVwall hundle the vertical ray grid intersection code

    var foundVerWallHit = false;
    var verWallHitX = 0;
    var verWallHitY = 0;

    // Find the x-coordinate of the closest vertical grid intersenction
    xintercept = Math.floor(fPlayer.x / TILE_SIZE) * TILE_SIZE;
    xintercept += this.isRayFacingRight ? TILE_SIZE : 0;

    // Find the y-coordinate of the closest vertical grid intersection
    yintercept = fPlayer.y + (xintercept - fPlayer.x) * Math.tan(this.rayAngle);

    // Calculate the increment xstep and ystep
    xstep = TILE_SIZE;
    xstep *= this.isRayFacingLeft ? -1 : 1;

    ystep = TILE_SIZE * Math.tan(this.rayAngle);
    ystep *= this.isRayFacingUp && ystep > 0 ? -1 : 1;
    ystep *= this.isRayFacingDown && ystep < 0 ? -1 : 1;
    var nextVerTouchx = xintercept;
    var nextVerTouchy = yintercept;
    // if (this.isRayFacingLeft) {
    //   nextVerTouchx--;
    // }
    while (isInsideGrid(nextVerTouchx, nextVerTouchy)) {
      if (
        grid.isThisWall(
          this.isRayFacingLeft ? nextVerTouchx - 1 : nextVerTouchx,
          nextVerTouchy
        )
      ) {
        foundVerWallHit = true;
        verWallHitX = nextVerTouchx;
        verWallHitY = nextVerTouchy;
        break;
      } else {
        nextVerTouchx += xstep;
        nextVerTouchy += ystep;
      }
    }

    // calculate the didtance
    var horHitDistance = foundHorzWallHit
      ? distanceBetweenPoints(fPlayer.x, fPlayer.y, horzWallHitX, horzWallHitY)
      : Number.MAX_VALUE;
    var verHitDistance = foundVerWallHit
      ? distanceBetweenPoints(fPlayer.x, fPlayer.y, verWallHitX, verWallHitY)
      : Number.MAX_VALUE;
    //only store the smallest value
    this.wallHitX =
      horHitDistance < verHitDistance ? horzWallHitX : verWallHitX;
    this.wallHitY =
      horHitDistance < verHitDistance ? horzWallHitY : verWallHitY;
    this.distance =
      horHitDistance < verHitDistance ? horHitDistance : verHitDistance;
    this.wasHitVertical = verHitDistance < horHitDistance;
  }
  render() {
    stroke("rgba(144,238,144, 0.8)");
    line(fPlayer.x, fPlayer.y, this.wallHitX, this.wallHitY);
  }
}

function normalizeAngle(angle) {
  angle = angle % (2 * Math.PI);
  if (angle < 0) {
    angle = 2 * Math.PI + angle;
  }
  return angle;
}

function isInsideGrid(x, y) {
  if (x >= 0 && x <= WINDOW_WIDTH && y >= 0 && y <= WINDOW_HIEGHT) return true;
  return false;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

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
var grid = new Map();
var fPlayer = new Player();
var rays = [];

function castAllRays() {
  var columnId = 0;
  //start first ray by subtracting half of the field of view
  var rayAngle = fPlayer.rotationAngle - FOV_ANGLE / 2;
  rays = [];
  //loop all columns casting the rays
  for (let i = 0; i < NUM_RAYS; i++) {
    // for (let i = 0; i < 1; i++) {
    var ray = new Ray(rayAngle);
    ray.cast(columnId);
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
  grid.render();
  update();
  fPlayer.render();
  for (ray of rays) {
    ray.render();
  }
}
