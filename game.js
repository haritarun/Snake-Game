const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let grid = 20;  
let snake = [{ x: 160, y: 160 }];
let food = { x: 80, y: 80 };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let intervalTime = 100;
let gameInterval;
let isGameOver = false;
let hasStarted = false;

document.getElementById('high-score').textContent = highScore;


function resizeCanvas() {
    const size = Math.min(window.innerWidth - 40, 400); 
    canvas.width = size;
    canvas.height = size;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();  


function setGameInterval() {
    clearInterval(gameInterval); 
    gameInterval = setInterval(gameLoop, intervalTime);  
}


const difficultySelect = document.getElementById('difficulty-select');
difficultySelect.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value === 'easy') intervalTime = 300;
    if (value === 'medium') intervalTime = 200;
    if (value === 'hard') intervalTime = 100;
    if (hasStarted) setGameInterval();  
});

function randomFoodPosition() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

function drawBoard() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, grid, grid);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid, grid);
}

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };


    if (head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0) {
        gameOver();
        return;
    }

    
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        randomFoodPosition();
    } else {
        snake.pop();
    }

    drawSnake();
    drawFood();
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }

    setTimeout(() => {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }, 100);
}

function resetGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    snake = [{ x: 160, y: 160 }];
    direction = { x: 0, y: 0 };
    isGameOver = false;
    hasStarted = false;
    randomFoodPosition();
    initialRender();
}

function startGame() {
    if (!hasStarted) {
        hasStarted = true;
        setGameInterval();  
    }
}


document.addEventListener('keydown', (event) => {
    if (!hasStarted) startGame();

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();  
    }

    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -grid };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: grid };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -grid, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: grid, y: 0 };
            break;
    }
});

document.getElementById('up-btn').addEventListener('click', () => {
    if (!hasStarted) startGame();
    if (direction.y === 0) direction = { x: 0, y: -grid };
});

document.getElementById('down-btn').addEventListener('click', () => {
    if (!hasStarted) startGame();
    if (direction.y === 0) direction = { x: 0, y: grid };
});

document.getElementById('left-btn').addEventListener('click', () => {
    if (!hasStarted) startGame();
    if (direction.x === 0) direction = { x: -grid, y: 0 };
});

document.getElementById('right-btn').addEventListener('click', () => {
    if (!hasStarted) startGame();
    if (direction.x === 0) direction = { x: grid, y: 0 };
});


let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', (event) => {
    if (!hasStarted) startGame();

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) {
            direction = { x: grid, y: 0 };  
        } else if (deltaX < 0 && direction.x === 0) {
            direction = { x: -grid, y: 0 };  
        }
    } else {
        if (deltaY > 0 && direction.y === 0) {
            direction = { x: 0, y: grid };  
        } else if (deltaY < 0 && direction.y === 0) {
            direction = { x: 0, y: -grid };  
        }
    }

    
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});


function initialRender() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawSnake();
    drawFood();
}

initialRender();
