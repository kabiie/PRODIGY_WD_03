document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    function playMusic() {
        backgroundMusic.play().catch(error => {
            console.error('Auto-play failed:', error);
        });
    }
    document.body.addEventListener('click', playMusic, { once: true });
});

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const switchModeButton = document.getElementById('switch-mode');
const muteToggleButton = document.getElementById('mute-toggle');
const winnerGif = document.getElementById('winner-gif');
const gameoverSound = document.getElementById('gameover-sound');
const tingSound = document.getElementById('ting-sound');
const backgroundMusic = document.getElementById('background-music');

let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);
let isSoloMode = false;
let isMuted = false;

const winningCombinations = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8],
    [0, 4, 8], 
    [2, 4, 6], 
];
function handleClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] || checkWinner()) return;

    tingSound.play();
    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    const winningCells = checkWinner();
    if (winningCells) {
        highlightWinningCells(winningCells);
        winnerGif.style.display = 'block';
        if (!isMuted) gameoverSound.play(); 
        if (!isMuted) backgroundMusic.pause(); 
        alert(`${currentPlayer} Wins!`);
    } else if (!gameBoard.includes(null)) {
        if (!isMuted) gameoverSound.play(); 
        if (!isMuted) backgroundMusic.pause();
        alert('Draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isSoloMode && currentPlayer === 'O') {
            computerPlay();
        }
    }
}
function checkWinner() {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return combo; 
        }
    }
    return null;
}
function highlightWinningCells(cellsToHighlight) {
    cellsToHighlight.forEach(index => {
        cells[index].classList.add('winner');
    });
}
function computerPlay() {
    let emptyCells = gameBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    const winningCells = checkWinner();
    if (winningCells) {
        highlightWinningCells(winningCells);
        winnerGif.style.display = 'block';
        if (!isMuted) gameoverSound.play(); 
        if (!isMuted) backgroundMusic.pause(); 
        alert('O Wins!');
    } else if (!gameBoard.includes(null)) {
        if (!isMuted) gameoverSound.play(); 
        if (!isMuted) backgroundMusic.pause(); 
        alert('Draw!');
    } else {
        currentPlayer = 'X';
    }
}
function resetGame() {
    gameBoard = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner'); 
    });
    currentPlayer = 'X';
    winnerGif.style.display = 'none'; 
    gameoverSound.pause();
    gameoverSound.currentTime = 0;
    if (!isMuted) backgroundMusic.play(); 
}
function switchMode() {
    isSoloMode = !isSoloMode;
    switchModeButton.textContent = isSoloMode ? 'Switch to Two-Player Mode' : 'Switch to Solo Player Mode';
    resetGame();
}
function toggleMute() {
    isMuted = !isMuted;
    muteToggleButton.classList.toggle('muted', isMuted);
    muteToggleButton.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    if (isMuted) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
}
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
switchModeButton.addEventListener('click', switchMode);
muteToggleButton.addEventListener('click', toggleMute);
