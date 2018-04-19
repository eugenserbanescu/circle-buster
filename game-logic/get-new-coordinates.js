export default function getNewCoordinates(object, nowTick, lastTick) {
  const timeElapsed = nowTick - lastTick;
  const distance = Math.floor(object.speed * timeElapsed / 10);
  return {
    x: object.coordinates.x,
    y: object.coordinates.y - distance,
  };
}
