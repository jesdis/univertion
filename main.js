import platform3 from './public/img/platform.png';
import hills from './public/img/hills.png';
import background from './public/img/background.png';

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
    }
    draw() {
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(
            this.image, 
            177 * this.frames,
            0,
            177,
            400, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            );
    }

    update() {
        //this.position.x += this.velocity.x;
        this.frames ++;
        if(this.frames > 28) {
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
let hil = createImage(hills);
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
    hil = createImage(hills);
    genericObjects = [
                            new Platform(0, 0, hil.width, hil.height, hil),
                        ];
    platforms = [
                        new Platform(300, 200, 200, 20, createImage(platform3)),
                        new Platform(400, 350, 200, 20, createImage(platform3)),
                        new Platform(200, 300, 200, 20, createImage(platform3)),

                        new Platform(0, canvas.height - 50, canvas.width, 50, createImage(platform3)),
                        new Platform(canvas.width  + 100, canvas.height - 50, canvas.width, 50, createImage(platform3)),
                    ];
    scrollOffset = 0;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fondo.draw();
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
        } else if(keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform2 => {
                platform2.position.x += player.speed;
            });
            genericObjects.forEach(object => {
                object.position.x += player.speed * 0.66;
            });
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
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case 'ArrowUp':
            player.velocity.y = -10;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        case 'ArrowUp':
            player.velocity.y = -10;
            break;
    }
});