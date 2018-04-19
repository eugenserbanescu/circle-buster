import Ball from './ball.js';
import getUniqueId from '../utils/uniqe-id.js';
import randomInt from '../utils/random-int.js';
import { CANVAS_SIZE } from './constants.js';

export default function generateGameObjects(levelData) {
  const generated = {
    byId: {},
    list: [],
  };
  const min = 0;
  let max = randomInt(3, 1);

  while (max > 0) {
    const id = getUniqueId();
    const colour =
      levelData.availableColours[
        randomInt(levelData.availableColours.length - 1, 0)
      ];
    const position = {
      x: randomInt(max, min),
      y: CANVAS_SIZE.height + this.radius * 2,
    };
    generated.byId[id] = new Ball(colour, position);
    generated.list.push(id);
    --max;
  }

  return generated;
}
