// Page X and Y -> Viewport se jitna bhi page scroll se hoga
// Client X and Y -> only from viewport
// Screen X and Y -> whole screen
// Offset X and Y -> Container se x and y dega na ki pure viewport se

const likethephoto = (e) => {
    let width = e.clientX;
    let height = e.clientY;
    let circle = document.createElement('img');
    circle.style.width = '80px';
    circle.style.height = '80px';
    circle.src = './assets/heart.png';
    circle.style.position = 'fixed'
    circle.style.top = (height-20)+'px';
    circle.style.left = (width-30)+'px';
    circle.classList.add('container-item-animate')
    document.querySelector('.container').appendChild(circle)
}