const TILE_SIZE = 40;
const NUM_MAP_COLS = 20;
const NUM_MAP_ROWS = 14;

const WINDOW_WIDTH = NUM_MAP_COLS * TILE_SIZE;
const WINDOW_HIEGHT = NUM_MAP_ROWS * TILE_SIZE;

class Map {
    constructor() {
        this.grid = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
    }
    render(){
        for (let i = 0; i < NUM_MAP_ROWS ; i++){
            for(let j = 0; j < NUM_MAP_COLS; j++){
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
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180);
    }
    update() {
        // TODO: update player position
        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        let moveStep = this.walkDirection * this.moveSpeed;
        this.x += Math.cos(this.rotationAngle) * moveStep;
        this.y += Math.sin(this.rotationAngle) * moveStep;
    }
    render() {
        noStroke();
        fill("red");
        circle(this.x, this.y, this.radius);
        stroke("red");
        line(
            this.x, 
            this.y,
            this.x + Math.cos(this.rotationAngle) * 50,
            this.y + Math.sin(this.rotationAngle) * 50
        )
    }
}

let grid = new Map();
let fPlayer = new Player();


function keyPressed() {
    if (keyCode == UP_ARROW){
        fPlayer.walkDirection = +1;
    } else if (keyCode == DOWN_ARROW) {
        fPlayer.walkDirection = -1;
    } else if (keyCode == RIGHT_ARROW){
        fPlayer.turnDirection = +1;
    } else if (keyCode == LEFT_ARROW){
        fPlayer.turnDirection = -1;
    }
}


function keyReleased() {
    if (keyCode == UP_ARROW){
        fPlayer.walkDirection = 0;
    } else if (keyCode == DOWN_ARROW) {
        fPlayer.walkDirection = 0;
    } else if (keyCode == RIGHT_ARROW){
        fPlayer.turnDirection = 0;
    } else if (keyCode == LEFT_ARROW){
        fPlayer.turnDirection = 0;
    }
}


function setup(){
    // TODO: initilize all objects;
    createCanvas(WINDOW_WIDTH, WINDOW_HIEGHT);
}

function update(){
    // TODO: update game objects efore we render the next frame;
    fPlayer.update();
}

function draw(){
    // render all objects frame by frame
    update();
    grid.render();
    fPlayer.render();
}