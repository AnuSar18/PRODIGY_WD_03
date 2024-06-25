var board;
var player;
var AI;
const winCombs = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll('.cell');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    board = Array.from(Array(9).keys());

    player = document.getElementById("playerMarker").value.toUpperCase();
    AI = (player === 'X') ? 'O' : 'X';

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].classList.remove('x', 'o');
        cells[i].style.removeProperty('background-color');
        cells[i].removeEventListener('click', turnClick, false);
        cells[i].addEventListener('click', turnClick, false);
    }

    if (document.getElementById("startFirst").value === 'no') {
        turn(bestSpot(), AI);
    }
}

function turnClick(square) {
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, player);
        if (!checkTie()) turn(bestSpot(), AI);
    }
}

function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = '';
    document.getElementById(squareId).classList.add(player.toLowerCase());
    let gameWon = checkWin(board, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombs.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombs[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == player ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == player ? "YOU WIN!" : "YOU LOSE!");
}

function declareWinner(who) {
    showModal(who);
}

function emptySquares() {
    return board.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(board, AI).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player2) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, player)) {
        return { score: -10 };
    } else if (checkWin(newBoard, AI)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player2;

        if (player2 == AI) {
            var result = minimax(newBoard, player);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, AI);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player2 === AI) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function showModal(message) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            <p class="modal-text">${message}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}
