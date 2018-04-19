import {CANVAS_SIZE, COLOURS} from './constants.js';
import randomInt from '../utils/random-int.js';

export default class Ball {
  constructor(color, coordinates) {
    this.color = color;
    const max = CANVAS_SIZE.width - 15;
    const min = 15;

    this.radius = 25;
    this.size = {
      height: this.radius * 2,
      width: this.radius * 2,
    };
    this.travelled = 0;

    this.speed = Math.random() * (3 - 2) + 2;

    this.coordinates = coordinates;
    // {
    //   x: randomInt(max, min),
    //   y: CANVAS_SIZE.height + this.radius * 2,
    // };

    this.canvas = document.createElement('canvas');
    this.canvas.height = this.radius * 2;
    this.canvas.width = this.radius * 2;
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
