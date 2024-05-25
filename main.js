let canvas, ctx;
let xImage = new Image(), oImage = new Image(), tadaGif = new Image();
let music, audio, tada, lineaudio;
let audioPlaying = false;
let tadaPlaying = false;
let lineaudioPlaying = false;

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let player1, player2;
let input1, input2;
let winner;
let showInfo = true;
let touchable = true;
let currentPlayer = 'X';
let player1Score = 0;
let player2Score = 0;
let roundEnded = false;
let round = 1;
let exitstatus = false;
let loopcount = 0;

window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    xImage.src = 'media/x.png';
    oImage.src = 'media/o.png';
    tadaGif.src = 'media/tada.gif';

    music = new Audio('media/music.mp3');
    audio = new Audio('media/audio.mp3');
    tada = new Audio('media/tada.mp3');
    lineaudio = new Audio('media/line.mp3');

    input1 = document.getElementById('input1');
    input2 = document.getElementById('input2');
    startBtn = document.getElementById('startBtn');
    contBtn = document.getElementById('contBtn');
    exitBtn = document.getElementById('exitBtn');

    start();
    newRoundORExit();
    draw();
};

function draw() {
    requestAnimationFrame(draw);
    if (exitstatus) {
        ctx.fillStyle = '#244637';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (loopcount == 1) {
            if (!tadaPlaying) {
                tada.play();
                tadaPlaying = true;
                tada.onended = () => {
                    tadaPlaying = false;
                };
            }
        }
        loopcount++;
        ctx.drawImage(tadaGif, 0, 0, canvas.width, canvas.height);
        if (loopcount == 135) {
            return;
        }
    }
}

function start() {
    ctx.fillStyle = '#244637';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '60px Arial';
    ctx.fillText('WELCOME', 40, 70);
    ctx.font = '20px Arial';
    ctx.fillText('Enter player 1 name:', 20, 170);
    ctx.fillText('Enter player 2 name:', 20, 220);
    input1.style.display = 'inline';
    input2.style.display = 'inline';
    startBtn.style.display = 'inline';
    startBtn.onclick = startPage;
}

function startPage() {
    player1 = input1.value;
    player2 = input2.value;
    if (player1 === '' && player2 === '') {
        alert('Please enter player names');
    } else if (player1 === '') {
        alert('Please enter player 1 name');
    } else if (player2 === '') {
        alert('Please enter player 2 name');
    } else {
        music.play();
        music.currentTime = 3;
        music.volume = 0.5;
        music.loop = true;
        clear();
        input1.style.display = 'none';
        input2.style.display = 'none';
        startBtn.style.display = 'none';
        roundEnded = true;
        gameStart = true;
        drawBoard();
        playersInfo();
    }
}

function newRoundORExit() {
    roundEnd = true;
    contBtn.style.display = 'inline';
    contBtn.onclick = resetBoard;
    exitBtn.style.display = 'inline';
    exitBtn.onclick = exit;
}

function playersInfo() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Round ' + round, canvas.width / 2, 15);
    ctx.fillText(player1 + ' (X): ' + player1Score, 100, 55);
    ctx.fillText(player2 + ' (O): ' + player2Score, 300, 55);
}

function exit() {
    exitstatus = true;
    gameStart = false;
    music.pause();
    clear();
    ctx.fillStyle = '#244637';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(player1 + ' (X): ' + player1Score, 100, 55);
    ctx.fillText(player2 + ' (O): ' + player2Score, 300, 55);
    contBtn.style.display = 'none';
    exitBtn.style.display = 'none';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    if (player1Score > player2Score) {
        ctx.fillText('Congrats ' + player1, canvas.width / 2, 200);
    } else if (player1Score < player2Score) {
        ctx.fillText('Congrats ' + player2, canvas.width / 2, 200);
    } else if (player1Score === player2Score) {
        ctx.fillText('Congrats ' + player1 + ' &', canvas.width / 2, 150);
        ctx.fillText(player2 + ' it\'s a tie!!', canvas.width / 2, 250);
    }
    showInfo = false;
}

function drawBoard() {
    touchable = true;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = i * canvas.width / 3 + canvas.width / 6;
            let y = j * (canvas.height - 60) / 3 + (canvas.height - 60) / 6 + 60;
            let spot = board[i][j];
            if (spot === 'X') {
                ctx.drawImage(xImage, x - 35, y - 35, 70, 70);
                playAudio();
            } else if (spot === 'O') {
                ctx.drawImage(oImage, x - 35, y - 35, 70, 70);
                playAudio();
            }
        }
    }
}

function playAudio() {
    if (!audioPlaying) {
        audio.play();
        audio.playbackRate = 2;
        audioPlaying = true;
        audio.onended = () => {
            audioPlaying = false;
        };
    }
}

function resetBoard() {
    gameStart = true;
    roundEnd = false;
    playersInfo();
    contBtn.style.display = 'none';
    exitBtn.style.display = 'none';
    round++;
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    drawBoard();
}

canvas.addEventListener('mousedown', mousePressed);

function mousePressed(event) {
    if (gameStart && touchable) {
        if (!roundEnded) {
            let i = Math.floor(event.offsetX / (canvas.width / 3));
            let j = Math.floor((event.offsetY - 60) / ((canvas.height - 60) / 3));
            if (board[i][j] === '') {
                board[i][j] = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
            drawBoard();
            winner = checkWinner();
            if (winner != null) {
                if (winner === 'X') {
                    player1Score += 3;
                } else if (winner === 'O') {
                    player2Score += 3;
                }
                drawWinningLine();
                roundEnded = true;
            } else {
                let tie = true;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === '') {
                            tie = false;
                        }
                    }
                }
                if (tie) {
                    drawBoard();
                    roundEnded = true;
                }
            }
        }
        if (roundEnded) {
            touchable = false;
            newRoundORExit();
        }
    }
}

function drawWinningLine() {
    let w = canvas.width;
    let h = canvas.height - 60;
    let gap = w / 3;
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#244637';
    if (winner === 'X' || winner === 'O') {
        if (winner.i === 0 && winner.j === 0 && winner.di === 0 && winner.dj === 1) {
            ctx.beginPath();
            ctx.moveTo(0, h / 6 + 60);
            ctx.lineTo(w, h / 6 + 60);
            ctx.stroke();
        } else if (winner.i === 1 && winner.j === 0 && winner.di === 0 && winner.dj === 1) {
            ctx.beginPath();
            ctx.moveTo(0, h / 2 + 60);
            ctx.lineTo(w, h / 2 + 60);
            ctx.stroke();
        } else if (winner.i === 2 && winner.j === 0 && winner.di === 0 && winner.dj === 1) {
            ctx.beginPath();
            ctx.moveTo(0, h * 5 / 6 + 60);
            ctx.lineTo(w, h * 5 / 6 + 60);
            ctx.stroke();
        } else if (winner.i === 0 && winner.j === 0 && winner.di === 1 && winner.dj === 0) {
            ctx.beginPath();
            ctx.moveTo(w / 6, 60);
            ctx.lineTo(w / 6, h + 60);
            ctx.stroke();
        } else if (winner.i === 0 && winner.j === 1 && winner.di === 1 && winner.dj === 0) {
            ctx.beginPath();
            ctx.moveTo(w / 2, 60);
            ctx.lineTo(w / 2, h + 60);
            ctx.stroke();
        } else if (winner.i === 0 && winner.j === 2 && winner.di === 1 && winner.dj === 0) {
            ctx.beginPath();
            ctx.moveTo(w * 5 / 6, 60);
            ctx.lineTo(w * 5 / 6, h + 60);
            ctx.stroke();
        } else if (winner.i === 0 && winner.j === 0 && winner.di === 1 && winner.dj === 1) {
            ctx.beginPath();
            ctx.moveTo(0, 60);
            ctx.lineTo(w, h + 60);
            ctx.stroke();
        } else if (winner.i === 0 && winner.j === 2 && winner.di === 1 && winner.dj === -1) {
            ctx.beginPath();
            ctx.moveTo(w, 60);
            ctx.lineTo(0, h + 60);
            ctx.stroke();
        }
    }
    playLineAudio();
}

function playLineAudio() {
    if (!lineaudioPlaying) {
        lineaudio.play();
        lineaudio.playbackRate = 2;
        lineaudioPlaying = true;
        lineaudio.onended = () => {
            lineaudioPlaying = false;
        };
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkWinner() {
    let winner = null;
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
            winner = board[i][0];
            winner.i = i;
            winner.j = 0;
            winner.di = 0;
            winner.dj = 1;
            return winner;
        }
    }
    for (let j = 0; j < 3; j++) {
        if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[0][j] !== '') {
            winner = board[0][j];
            winner.i = 0;
            winner.j = j;
            winner.di = 1;
            winner.dj = 0;
            return winner;
        }
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        winner = board[0][0];
        winner.i = 0;
        winner.j = 0;
        winner.di = 1;
        winner.dj = 1;
        return winner;
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
        winner = board[0][2];
        winner.i = 0;
        winner.j = 2;
        winner.di = 1;
        winner.dj = -1;
        return winner;
    }
    return null;
}
