const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // for 2d 

canvas.width = 1024;
canvas.height = 576;

// fill the canvas or give background
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7;

class Sprite {

    constructor({ position, imgSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 4;
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax), // crop starts
            0,
            this.image.width / this.framesMax,
            this.image.height, // crop ends
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrame() {
        this.framesElapsed++;

        if ((this.framesElapsed % this.framesHold) === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++;
            } else
                this.frameCurrent = 0;
        }
    }

    update() {
        this.draw();
        this.animateFrame();
    }

}

class Fighter extends Sprite {

    constructor({ position, velocity, offset = { x: 0, y: 0 }, imgSrc, scale = 1, framesMax = 1, sprites, attackBox = { offset: {}, width: undefined, height: undefined } }) {
        super({
            position,
            imgSrc,
            scale,
            framesMax,
            offset
        });
        // this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.isAttacking = false;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.health = 100;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 4;
        this.sprites = sprites;
        this.death = false;

        for (const sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        }

    }

    // draw() {
    //     c.fillStyle = 'red';
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //     // attack box
    //     if (this.isAttacking) {
    //         c.fillStyle = 'blue';
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw();
        if (!this.death) this.animateFrame();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;

        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 100);

    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takehit')
        }

    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent >= (this.sprites.death.framesMax - 1))
                this.death = true;
            return
        };

        if (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.framesMax - 1) return;

        if (this.image === this.sprites.takehit.image && this.frameCurrent < this.sprites.takehit.framesMax - 1) return;


        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.frameCurrent = 0;
                }
                break;


            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'takehit':
                if (this.image !== this.sprites.takehit.image) {
                    this.image = this.sprites.takehit.image;
                    this.framesMax = this.sprites.takehit.framesMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.frameCurrent = 0;
                }
                break;
        }
    }

    instantDeath() {
        this.health = 0;
    }

}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: './background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 160,
    },
    imgSrc: './shop.png',
    scale: 2.5,
    framesMax: 6
})


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 155
    },
    imgSrc: './samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    sprites: {
        idle: {
            imgSrc: './samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imgSrc: './samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc: './samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './samuraiMack/Attack1.png',
            framesMax: 6
        },
        takehit: {
            imgSrc: './samuraiMack/Take Hit.png',
            framesMax: 4
        },
        death: {
            imgSrc: './samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 40,
        },
        width: 150,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 20
    },
    offset: {
        x: 215,
        y: 168
    },
    imgSrc: './kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    sprites: {
        idle: {
            imgSrc: './kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imgSrc: './kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc: './kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './kenji/Attack1.png',
            framesMax: 4
        },
        takehit: {
            imgSrc: './kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imgSrc: './kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 40,
        },
        width: 170,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    arrowright: {
        pressed: false
    },
    arrowleft: {
        pressed: false
    },
}

function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
        && rect1.attackBox.position.x <= rect2.position.x + rect2.width
        && rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
        && rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function determineWinner({ player, enemy, timerId }) {

    clearTimeout(timerId)
    if (player.health === enemy.health) {
        // alert('Tie')
        document.querySelector('#winner').innerHTML = `<h1>Tie</h1>`;
    }
    else if (player.health > enemy.health) {
        // alert('Player 1 Wins')
        document.querySelector('#winner').innerHTML = `<h1>Player 1 Wins</h1>`;
    } else {
        document.querySelector('#winner').innerHTML = `<h1>Player 2 Wins</h1>`;
        // alert("Enemy Wins")
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById('timer').innerText = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }

}

decreaseTimer();

function animate() {

    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    if (keys.arrowleft.pressed && enemy.lastKey === 'arrowleft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run')
    } else if (keys.arrowright.pressed && enemy.lastKey === 'arrowright') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detech collision
    if (rectangularCollision({ rect1: player, rect2: enemy }) && player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
        // enemy.health -= 20;
        enemy.takeHit();
        document.getElementById('enemyHP').style.width = enemy.health + '%';
    }

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectangularCollision({ rect1: enemy, rect2: player }) && enemy.isAttacking && player.frameCurrent === 2) {
        enemy.isAttacking = false;
        // player.health -= 20;
        player.takeHit();
        document.getElementById('playerHP').style.width = player.health + '%';
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }

    console.log('position.x', player.position.x)
    console.log('position.x', enemy.position.x)
    
    if(player.position.x > enemy.position.x+50){
        // alert('Turn around')
    }

}

let cheatcodes = ['1111', '2222']

let currentCheatcode = '';
let needToResetCheatCode = false;
let resetTime = 500;

function cheatCodeRunner(cheatcode) {
    switch (cheatcode) {
        case cheatcodes[0]:
            player.instantDeath();
            document.getElementById('enemyHP').style.width = player.health + '%';
            player.switchSprite('death');
            break;

        case cheatcodes[1]:
            enemy.instantDeath();
            document.getElementById('playerHP').style.width = enemy.health + '%';
            enemy.switchSprite('death');
            break;
    }
}

function checkCodeTimer() {
    let timer;
    return (key) => {
        clearTimeout(timer);
        if (needToResetCheatCode) {
            currentCheatcode = key
            needToResetCheatCode = false;
        }
        else
            currentCheatcode += key;

        timer = setTimeout(() => {
            needToResetCheatCode = true;
        }, resetTime)

        if (cheatcodes.includes(currentCheatcode)) {
            cheatCodeRunner(currentCheatcode);
        }

    }
}
animate();

let codeTimer = checkCodeTimer();

window.addEventListener('keydown', (event) => {
    codeTimer(event.key);

    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            // keys.w.pressed = true;
            player.velocity.y = -20;
            break;

        case 's':
            // keys.w.pressed = true;
            player.velocity.y = 20;
            break;

        case ' ':
            // keys.w.pressed = true;
            player.attack();
            break;

        case 'ArrowRight':
            keys.arrowright.pressed = true;
            enemy.lastKey = 'arrowright';
            break;
        case 'ArrowLeft':
            keys.arrowleft.pressed = true;
            enemy.lastKey = 'arrowleft';
            break;
        case 'ArrowUp':
            // keys.w.pressed = true;
            enemy.velocity.y = -20;
            break;

        case 'ArrowDown':
            // keys.w.pressed = true;
            enemy.attack();
            break;
    }
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.arrowright.pressed = false;
            break;
        case 'ArrowLeft':
            keys.arrowleft.pressed = false;
            break;
        // case 'ArrowUp':
        //     keys.w.pressed = false;
        //     break;
    }
})
