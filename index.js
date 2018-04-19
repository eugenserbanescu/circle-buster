import {game as gameHandler} from './game-logic/game.js';
import generateLevel from './game-logic/generate-level.js';

const toggleButton = document.querySelector('#new');
// const scoreElement = document.querySelector('#score');
let started = false;
let currentLevelData;
const game = gameHandler(finishLevel);

toggleButton.addEventListener('click', () => {
  let stopped = game.isStopped();
  if (!started) {
    if (!currentLevelData) currentLevelData = generateLevel(0);
    game.init(currentLevelData);
    started = true;
    toggleButton.innerText = 'Pause Game';
  } else if (stopped) {
    game.resumeGame();
    toggleButton.innerText = 'Pause Game';
  } else {
    game.pauseGame();
    toggleButton.innerText = 'Resume Game';
  }
});

function finishLevel() {
  game.pauseGame();

  checkScore(currentLevelData.requirements, game.getScore());

  game.tearDown();

  started = false;
  toggleButton.innerText = 'Start Game';
}

function checkScore(requirements, score) {
  const passed = Object.keys(requirements).reduce((acc, colour) => {
    return acc ? requirements[colour] <= score[colour] : false;
  }, true);

  if (passed) {
    currentLevelData = generateLevel(currentLevelData.level);
    alert('You won! Onto the next level');
  } else {
    alert('You lost! Same level again for you!');
  }
}
