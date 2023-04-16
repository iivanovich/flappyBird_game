const f = new FontFace('flappy', 'url(https://fonts.googleapis.com/css2?family=Russo+One&display=swap)');
const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

localStorage.clear();

// Кнопка перезагрузки игры
const btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
    btn.classList.toggle("none");
    location.reload(); 
})

const img = new Image();
img.src = imgURL;
const fg = new Image();
fg.src = "img/fg.png";
const pipeUp = new Image();
pipeUp.src = "img/pipeUp.png"
const pipeDown = new Image();
pipeDown.src = "img/pipeDown.png"
const startTap = new Image();
startTap.src = "img/taptap.png"
const board = new Image();
board.src = "img/score.png"


let pointAudio = new Audio();
pointAudio.src = "audio/point.wav";
let dieAudio = new Audio();
dieAudio.src = "audio/die.wav";

const SPEED = 2;
const SIZE = [51, 36];
let index = 0;
let gap = 165;
let pipe = [];
let yPos = 320;
let xPos = 180;
let gravity = 0;
let score = 0;
let best = 0;
pipe[0] = {
    x: canvas.width,
    y: -100
}

let lose = false;
let startPipe = false;
let startPlay = true;

if (!lose) {
    document.addEventListener("keydown", () => {
        yPos -= 75;
        gravity = 2.1;
        startPipe = true;
        startPlay = false;
    });
}

const rs = JSON.parse(localStorage.getItem('user'));
if (rs === null) {
    best = 0;
} else {
    best += rs;
}

const draw = () => {
    index += 0.3;
    const backgroudX = -((index * SPEED) % canvas.width);
    const bgSource = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
    };
    const bgPartOneResult = {
        x: backgroudX + canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
    };
    const bgPartTwoResult = {
        x: backgroudX,
        y: 0,
        width: canvas.width,
        height: canvas.height,
    };
    ctx.drawImage(
        img,

        bgSource.x,
        bgSource.y,
        bgSource.width,
        bgSource.height,

        bgPartOneResult.x,
        bgPartOneResult.y,
        bgPartOneResult.width,
        bgPartOneResult.height
    );
    ctx.drawImage(
        img,

        bgSource.x,
        bgSource.y,
        bgSource.width,
        bgSource.height,

        bgPartTwoResult.x,
        bgPartTwoResult.y,
        bgPartTwoResult.width,
        bgPartTwoResult.height
    );

    if (lose) {
        ctx.drawImage(board, 80, 115);
        gravity = 0;
        startPipe = false;
        yPos = 450;
        ctx.fillStyle = "white";
        ctx.font = '48px Verdana';
        ctx.fillText(score, 134, 270);
        ctx.fillStyle = "white";
        ctx.font = '48px Verdana';
        ctx.fillText(best, 263, 270);
    }

    if(yPos < 0){
        yPos = 0;
    }

    if (startPipe) {
        for (var i = 0; i < pipe.length; i++) {
            ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

            pipe[i].x--;

            if (pipe[i].x == 100) {
                pipe.push({
                    x: canvas.width,
                    y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height - 5
                });
            }

            if (xPos + SIZE[0] >= pipe[i].x
                && xPos <= pipe[i].x + pipeUp.width
                && (yPos <= pipe[i].y + pipeUp.height
                    || yPos + SIZE[1] >= pipe[i].y + pipeUp.height + gap) || yPos + SIZE[1] >= canvas.height - fg.height) {
                // location.reload(); 
                dieAudio.play();
                btn.classList.toggle("none");
                if (score > best) {
                    localStorage.clear();
                    localStorage.setItem('user', JSON.stringify(score));
                }
                lose = true;
            }

            if (pipe[i].x == 170) {
                score++;
                pointAudio.play();
            }

            ctx.fillStyle = "white";
            ctx.font = '40px Verdana';
            ctx.fillText(score, 200, 100);
        }
    }

    if (startPlay) {
        ctx.drawImage(startTap, 120, 120);
    }

    ctx.drawImage(fg, 0, canvas.height - fg.height + 5);

    const birdSource = {
        x: 432,
        y: Math.floor((index % 9) / 3) * SIZE[1],
        width: SIZE[0],
        height: SIZE[1],
    };
    const birdResult = {
        x: xPos,
        y: yPos,
        width: SIZE[0],
        height: SIZE[1],
    };
    yPos += gravity;
    ctx.drawImage(
        img,

        birdSource.x,
        birdSource.y,
        birdSource.width,
        birdSource.height,

        birdResult.x,
        birdResult.y,
        birdResult.width,
        birdResult.height
    );

    requestAnimationFrame(draw);
};

img.onload = draw;

