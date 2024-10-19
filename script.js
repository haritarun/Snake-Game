// Get buttons and rules section
const startGameBtn = document.getElementById('start-game-btn');
const rulesBtn = document.getElementById('rules-btn');
const rulesSection = document.getElementById('rules-section');

// Start Game Button Event
startGameBtn.addEventListener('click', function() {
    
    window.location.href = 'game.html'; // Example redirection
});

// Toggle Game Rules Section
rulesBtn.addEventListener('click', function() {
    rulesSection.style.display = rulesSection.style.display === 'block' ? 'none' : 'block';
});
