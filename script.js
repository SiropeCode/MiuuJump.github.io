const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverText = document.getElementById("gameOver");
const scoreText = document.getElementById("score");
const startButton = document.getElementById("startButton"); // Agregado el botón "Start Game"

let cubeY, cubeVelocity, isJumping, score, obstacles, gameTimer, obstacleSpeedMultiplier;

function init() {
    cubeY = 200;
    cubeVelocity = 0;
    isJumping = false;
    score = 0;
    obstacles = [];
    obstacleSpeedMultiplier = 1.0;
    gameOverText.style.display = "none";
    scoreText.textContent = "Score: " + score;

    gameTimer = setInterval(updateGame, 10);
    generateObstacles();
}

function drawCube() {
    const cubeImage = new Image();
    cubeImage.src = 'img/picmix.com_1905157.png';

    cubeImage.onload = function () {
        ctx.drawImage(cubeImage, 50, cubeY, 40, 40);
    };
}

function drawObstacles() {
    for (let obstacle of obstacles) {
        const obstacleImage = new Image();
        obstacleImage.src = './img/uwu.png'; // Reemplaza con la ruta de tu imagen de obstáculo

        obstacleImage.onload = function () {
            ctx.drawImage(obstacleImage, obstacle.x, obstacle.y - 10, obstacle.width, obstacle.height);
        };
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCube();
    drawObstacles();

    if (isJumping) {
        cubeY -= cubeVelocity;
        cubeVelocity--;
        if (cubeY >= 200) {
            cubeY = 200;
            isJumping = false;
        }
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        obstacle.x -= 5 * obstacleSpeedMultiplier;
        if (obstacle.x < -obstacle.width) {
            obstacles.splice(i, 1);
        }

        if (50 + 40 >= obstacle.x && 50 <= obstacle.x + obstacle.width &&
            cubeY + 40 >= obstacle.y && cubeY <= obstacle.y + obstacle.height) {
            endGame();
        }

        if (50 > obstacle.x + obstacle.width && !obstacle.counted) {
            obstacle.counted = true;
            score++;
            scoreText.textContent = "Score: " + score;
            if (score % 10 === 0) {
                const achievementSound = document.getElementById("achievementSound");
                achievementSound.currentTime = 0;
                achievementSound.play();
                obstacleSpeedMultiplier *= 1.5;
            }
        }
    }
}

function generateObstacles() {
    setInterval(() => {
        obstacles.push({ x: canvas.width, y: 210, width: 40, height: 40, counted: false });
    }, 2000);
}

function endGame() {
    clearInterval(gameTimer);
    const collisionSound = document.getElementById("collisionSound");
    collisionSound.currentTime = 0;
    collisionSound.play();
    gameOverText.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    init();

    document.addEventListener("keydown", (event) => {
        if (event.key === " " && !isJumping) {
            jump();
        }
    });

    // Agregar un manejador de eventos al botón "Start Game"
    startButton.addEventListener("click", () => {
        window.location.reload();
    });
});

function jump() {
    if (!isJumping) {
        cubeVelocity = 15;
        isJumping = true;
        const jumpSound = document.getElementById("jumpSound");
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}
