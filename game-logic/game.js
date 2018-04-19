import generateGameObjects from './generate-game-objects.js';
import canvasHander from './canvas.js';
import getNewCoordinates from './get-new-coordinates.js';
import randomInt from '../utils/random-int.js';
import { CANVAS_SIZE } from './constants.js';

const scoreElement = document.querySelector('#score');
let scoreElements = {};
let scoreHandler = () => {};
let score = {};
let stopped = true;
let gameObjects = {};
let addInterval = randomInt(500);
let ballsLeft = 0;
let levelData;
let click = null;
let startTime;
let lastTick;
let lastAdd;
let finished = () => {};

let renderer = canvasHander();

function gameLoop() {
  const nowTick = Date.now();
  let toRemove = [];

  //calc new positions
  gameObjects.list.forEach(id => {
    const ball = gameObjects.byId[id];
    const newCoordinates = getNewCoordinates(ball, nowTick, lastTick);
    const distanceTravelled = ball.coordinates.y - newCoordinates.y;
    ball.travelled += distanceTravelled;
    // mark to remove if it moved too much
    if (ball.travelled > 800) {
      toRemove.push(id);
      return;
    }
    // check click
    if (click) {
      const distance = Math.hypot(
        Math.abs(click.x - ball.coordinates.x),
        Math.abs(click.y - ball.coordinates.y)
      );
      const inCircle = distance <= ball.radius;
      // console.log('click', distance);
      if (inCircle) {
        updateScore(ball);
        toRemove.indexOf(id) === -1 && toRemove.push(id);
        click = null;
      }
    }
    ball.coordinates = newCoordinates;
  });

  // add if recessary
  if (nowTick - lastAdd > addInterval) {
    const newObjects = generateGameObjects(levelData);
    newObjects.list.forEach(id => {
      gameObjects.byId[id] = newObjects.byId[id];
      gameObjects.list.push(id);
    });
    lastAdd = Date.now();
    addInterval = randomInt(500);
  }

  // remove if necessary
  toRemove.forEach(id => {
    // console.log('removing', id);
    delete gameObjects.byId[id];
    gameObjects.list.splice(gameObjects.list.indexOf(id), 1);
  });

  renderer.clear();
  gameObjects.list.forEach(id => {
    const ball = gameObjects.byId[id];
    renderer.paintObject(ball);
  });

  lastTick = nowTick;
  if (nowTick - startTime > levelData.time) {
    finished();
  }
  !stopped && window.requestAnimationFrame(gameLoop);
}

function init(data) {
  levelData = data;
  Object.keys(levelData.requirements).forEach(colour => {
    let colourEl = document.createElement('span');
    colourEl.className = 'colour';
    colourEl.style.backgroundColor = colour;
    // colourEl.style.classNa
    colourEl.innerText = levelData.requirements[colour];
    scoreElements[colour] = colourEl;
    scoreElement.appendChild(colourEl);

    ballsLeft += levelData.requirements[colour];
  });

  document.querySelector('#game').appendChild(renderer.getCanvas());

  gameObjects = generateGameObjects(levelData);

  renderer.getCanvas().addEventListener('click', handleClick);

  score = {};
  levelData.availableColours.forEach(color => {
    score[color] = 0;
  });

  gameObjects.list.forEach(id => {
    renderer.paintObject(gameObjects.byId[id]);
  });

  stopped = false;
  startTime = Date.now();
  startGame();
}

function startGame() {
  lastTick = Date.now();
  lastAdd = Date.now();
  gameLoop();
}

function updateScore(ball) {
  score[ball.color] += 1;

  ballsLeft -= 1;
  if (ballsLeft === 0) finished();

  const difference = levelData.requirements[ball.color] - score[ball.color];

  scoreElements[ball.color].innerText = difference > 0 ? difference : 0;
}

function handleClick(e) {
  click = {
    x: e.offsetX,
    y: e.offsetY,
  };
}

export function game(finishCallback) {
  finished = finishCallback;
  return {
    init: function(data) {
      init(data);
    },
    pauseGame: function() {
      finished = finishCallback;
      stopped = true;
      click = null;
      renderer.getCanvas().removeEventListener('click', handleClick);
      // do stuff
    },
    resumeGame: function() {
      stopped = false;
      renderer.getCanvas().addEventListener('click', handleClick);
      lastTick = Date.now();
      lastAdd = Date.now();
      startGame();
    },
    isStopped: function() {
      return stopped;
    },
    changeLevel: function(data) {
      levelData = data;
    },
    getScore: function() {
      return score;
    },
    tearDown: function() {
      ballsLeft = 0;
      renderer.getCanvas().removeEventListener('click', handleClick);
      renderer.clear();
      gameObjects = {byId: {}, list: []};
      levelData.availableColours.forEach(colour => {
        scoreElement.removeChild(scoreElements[colour]);
      });
      scoreElements = {};
      startTime = null;

      document.querySelector('#game').removeChild(renderer.getCanvas());
    },
  };
}
