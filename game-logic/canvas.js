import {CANVAS_HEIGHT, CANVAS_WIDTH} from './constants.js';
import getUniqueId from '../utils/uniqe-id';

export default function canvasHandler() {
  const gameCanvas = document.createElement('canvas');
  gameCanvas.width = CANVAS_WIDTH;
  gameCanvas.height = CANVAS_HEIGHT;

  const gameCtx = gameCanvas.getContext('2d');

  return {
    clear: function() {
      gameCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },

    paintObject: function(object) {
      gameCtx.drawImage(
        object.canvas,
        object.coordinates.x - Math.floor(object.size.width / 2),
        object.coordinates.y - object.size.height
      );
    },

    getCanvas() {
      return gameCanvas;
    },
  };
}
