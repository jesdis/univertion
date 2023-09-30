import platform3 from './public/img/plataforma.png';
import hills from './public/img/hills.png';
import background from './public/img/fondo.png';
import piso from './public/img/piso.png';
import duna from './public/img/duna.png';
import cactus from './public/img/cactus.png';
import sol from './public/img/sol.png';

import spriteRunLeft from './public/img/spriteRunLeft.png';
import spriteRunRight from './public/img/spriteRunRight.png';
import spriteStandLeft from './public/img/spriteStandLeft.png';
import spriteStandRight from './public/img/spriteStandRight.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
console.log(ctx);

canvas.width = 1024;
canvas.height = 576;
const gravity = 1;

class Player {
    constructor(x, y, width, height, color, speed) {
        this.speed = speed;
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 66
        this.height = 150;
        this.color = color;
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
            }
        }
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropWidth;
    }
    draw() {
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(
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
        this.frames ++;
        if(this.frames > 28 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
            this.frames = 0;
        } else if(this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) {
            this.frames = 0;
        }
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if(this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else { 
            this.velocity.y = 0;
        }
    }
}

class Platform {
    constructor(x, y, width, height, image) {
        this.position = {
            x: x,
            y: y
        };
        this.width = width;
        this.height = height;
        this.image = image;
    }
    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

function createImage (src) {
    const image = new Image();
    image.src = src;
    return image;
}

let player = new Player(100, 20, 66, 150, 'red', 5);
let fondo = new Platform(0, 0, canvas.width, canvas.height, createImage(background));
let imgSol = new Platform(canvas.width - 40, 40, 80, 80, createImage(sol));
let hil = createImage(hills);
let imgCactus = createImage(cactus);
let imgDunas = createImage(duna);
let genericObjects = [];
let platforms = [];
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}
let scrollOffset = 0;

function init() {
    player = new Player(100, 20, 50, 50, 'red', 5);
    fondo = new Platform(0, 0, canvas.width, canvas.height, createImage(background));
    imgSol = new Platform(canvas.width - 120, 40, 80, 80, createImage(sol));
    hil = createImage(hills);
    imgCactus = createImage(cactus);
    imgDunas = createImage(duna);
    genericObjects = [
                            new Platform(140, canvas.height - 50 - 280, 280, 280, imgDunas),

                            new Platform(300, canvas.height - 50 - 120, 60, 120, imgCactus),
                            new Platform(280, canvas.height - 50 - 60, 20, 60, imgCactus),
                            new Platform(360, canvas.height - 50 - 80, 40, 80, imgCactus),

                            new Platform(1200, canvas.height - 50 - 160, 80, 160, imgCactus),
                            new Platform(1160, canvas.height - 50 - 80, 40, 80, imgCactus),
                            new Platform(1280, canvas.height - 50 - 120, 60, 120, imgCactus),
                        ];
    platforms = [
                        new Platform(700, 380, 200, 20, createImage(platform3)),
                        new Platform(1100, 350, 200, 20, createImage(platform3)),
                        new Platform(2200, 455, 625, 121, createImage(platform3)),

                        new Platform(0, canvas.height - 50, canvas.width, 50, createImage(piso)),
                        new Platform(canvas.width  + 100, canvas.height - 50, canvas.width, 50, createImage(piso)),
                    ];
    scrollOffset = 0;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fondo.draw();
    imgSol.draw();
    genericObjects.forEach(object => {
        object.draw();
    });
    platforms.forEach(platform2 => {
        platform2.draw();
    });
   // platform.draw();
    player.update();

    if(keys.right.pressed && player.position.x < 500) {
        player.velocity.x = player.speed;
    } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0) ){
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;
        if(keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach(platform2 => {
                platform2.position.x -= player.speed;
            });
            genericObjects.forEach(object => {
                object.position.x -= player.speed * 0.66;
            });
            imgSol.position.x -= player.speed * 0.1;
        } else if(keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform2 => {
                platform2.position.x += player.speed;
            });
            genericObjects.forEach(object => {
                object.position.x += player.speed * 0.66;
            });
            imgSol.position.x += player.speed * 0.1;
        }
    }

    //sistema de coliciones
    platforms.forEach(platform2 => {
        if( player.position.y + player.height <= platform2.position.y &&
            player.position.y + player.height + player.velocity.y >= platform2.position.y &&
            player.position.x + player.width >= platform2.position.x &&
            player.position.x <= platform2.position.x + platform2.width) {
            player.velocity.y = 0;
        }
    });

    //meta
    if(scrollOffset >= 2000) {
        ctx.font = "30px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText("You Win!", 100, 100);
    }

    //perder
    if(player.position.y + player.height >= canvas.height) {
        ctx.font = "30px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText("You Lose!", 100, 100);
        init();
    }

}
init();
animate();

window.addEventListener('keydown', (e) => {
    console.log(e.key);
    switch(e.key) {
        case 'ArrowLeft':
            keys.left.pressed = true;
            player.currentSprite = player.sprites.run.left;
            player.currentCropWidth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            player.currentCropWidth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
            break;
        case 'ArrowUp':
            player.velocity.y = -15;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left.pressed = false;
            player.currentSprite = player.sprites.stand.left;
            player.currentCropWidth = player.sprites.stand.cropWidth;
            player.width = player.sprites.stand.width;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            player.currentSprite = player.sprites.stand.right;
            player.currentCropWidth = player.sprites.stand.cropWidth;
            player.width = player.sprites.stand.width;
            break;
        case 'ArrowUp':
            player.velocity.y = -15;
            break;
    }
});