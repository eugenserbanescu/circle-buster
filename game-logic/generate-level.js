import {COLOURS} from './constants.js';
import randomInt from '../utils/random-int.js';

export default function generateLevel(oldLevel) {
  const currentLevel = oldLevel + 1;
  let colours = COLOURS;
  if (currentLevel < COLOURS.length * 2) {
    colours = COLOURS.slice(0, Math.floor(currentLevel + 3 / 3));
  }

  let ballsToKill = 10;

  const requirements = {};

  // TODO: make this balanced
  const even = Math.round(ballsToKill / colours.length);

  colours.forEach(colour => {
    requirements[colour] = even;
  });

  return {
    availableColours: colours,
    level: currentLevel,
    requirements: requirements,
    time: colours.length * 30000,
  };
}
