const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // for 2d 

canvas.width = 1024;
canvas.height = 576;

// fill the canvas or give background
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7;

class Sprite {

    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.isAttacking = false;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        }
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box
        if (this.isAttacking) {
            c.fillStyle = 'blue';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }

    }

    attack() {
        this.isAttacking = true;

        setTimeout(() => {
            this.isAttacking = false;
        }, 100);

    }

}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 20
    }
});

const enemy = new Sprite({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 20
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

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    if (keys.arrowleft.pressed && enemy.lastKey === 'arrowleft') {
        enemy.velocity.x = -5;
    } else if (keys.arrowright.pressed && enemy.lastKey === 'arrowright') {
        enemy.velocity.x = 5;
    }

    // detech collision
    if (player.attackBox.position.x + player.attackBox.width >= enemy.position.x
        && player.attackBox.position.x <= enemy.position.x + enemy.width
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
        && player.attackBox.position.y <= enemy.position.y + enemy.height
        && player.isAttacking
    ) {
        player.isAttacking = false;
        console.log('collided!')
    }
}

animate();

window.addEventListener('keydown', (event) => {
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
