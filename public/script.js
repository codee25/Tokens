// Initialize Telegram WebApp
Telegram.WebApp.ready();

// Get user information
const user = Telegram.WebApp.initDataUnsafe.user;
const usernameElement = document.getElementById('username');
usernameElement.textContent = user ? user.first_name || 'Player' : 'Guest';

// Game variables
let score = 0;
let balance = 0;
let enemyHealth = 100;
let maxEnemyHealth = 100;
let level = 1;
let kills = 0;
let damage = 1; // Initial damage per click

const healthBar = document.getElementById('health');
const enemyHealthDisplay = document.getElementById('enemy-health');
const scoreDisplay = document.getElementById('score');
const balanceDisplay = document.getElementById('balance');
const levelDisplay = document.getElementById('level');
const killsDisplay = document.getElementById('kills');
const enemy = document.getElementById('enemy');

// Function to update health bar and enemy health display
function updateHealthBar() {
    healthBar.style.width = `${(enemyHealth / maxEnemyHealth) * 100}%`;
    enemyHealthDisplay.textContent = `HP: ${enemyHealth}`;
}

// Function to update game stats
function updateStats() {
    killsDisplay.textContent = `Monsters Defeated: ${kills}`;
    scoreDisplay.textContent = `HIRAM Tokens: ${score}`;
    balanceDisplay.textContent = `${balance} HIRAM`;
    levelDisplay.textContent = `Level: ${level}`;
}

// Function to handle level up
function levelUp() {
    level++;
    maxEnemyHealth = Math.floor(maxEnemyHealth * 1.2); // Increase max health by 20%
    damage += 1; // Increase player damage
    updateStats();
}

// Handle enemy click
enemy.addEventListener('click', () => {
    if (enemyHealth > 0) {
        enemyHealth -= damage; // Reduce enemy health by damage amount
        if (enemyHealth <= 0) {
            enemyHealth = 0; // Prevent negative health
            kills++;
            score++;
            balance++;

            // Check if level up is needed
            if (kills % 25 === 0) {
                levelUp();
            }

            // Reset enemy health
            enemyHealth = maxEnemyHealth;
        }
        updateHealthBar();
        updateStats();
    }
});

// Initialize the game
function initGame() {
    updateHealthBar();
    updateStats();
}

function showError(message) {
    const modal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = message;
    modal.style.display = 'flex';

    document.getElementById('close-error-modal').onclick = function () {
        modal.style.display = 'none';
    };
}

// Call initGame to initialize everything
initGame();
