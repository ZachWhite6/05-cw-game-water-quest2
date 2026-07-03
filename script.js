// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;
let timeLeft = 30;

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  currentCans = 0;
  timeLeft = 30;
  updatePointsDisplay();
  updateTimerDisplay();
  clearAchievementMessage();
  startButton.textContent = 'Start Game';
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second

  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
  if (!gameActive) return;
    timeLeft -= 1;
    updateTimerDisplay();
  if (timeLeft <= 0) {
    endGame();
    document.getElementById('timer').textContent = "Game Over!";
    showEndMessage();
  }
  }, 1000);
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the countdown timer
  startButton.textContent = 'Reset?';
}

// Set up click handler for the start button
const startButton = document.getElementById('start-game');
startButton.addEventListener('click', startGame);

function updatePointsDisplay() {
const scoreDisplay = document.getElementById('current-cans');
  if (scoreDisplay) {
    scoreDisplay.textContent = currentCans;
  }
}

function updateTimerDisplay() {
const timerDisplay = document.getElementById('timer');
  if (timerDisplay) {
    timerDisplay.textContent = timeLeft;
  }
}

const grid = document.querySelector('.game-grid');
grid.addEventListener('click', function(event) {
const clickedCan = event.target.closest('.water-can');

if (!clickedCan || !gameActive) return;

  currentCans += 1;
  updatePointsDisplay();
  clickedCan.closest('.water-can-wrapper').innerHTML = '';
});
updateTimerDisplay();

function showEndMessage() {
const achievementDisplay = document.getElementById('achievements');
  if (achievementDisplay && currentCans > GOAL_CANS) {
    achievementDisplay.textContent = 'Congratulations! You win!';
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
}

function clearAchievementMessage() {
const achievementDisplay = document.getElementById('achievements');
  if (achievementDisplay) {
    achievementDisplay.textContent = '';
  }
}
