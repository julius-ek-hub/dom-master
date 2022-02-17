import {cord} from "../utils.js";

let x, y, then, direction;

export const handleTouchEnd = (e, callback) => {
    let sec = (Date.now() - then) / 1000;
    let c = cord(e);
    let dx = c.x - x;
    let dy = c.y - y;
    const abs = number => Math.abs(number);

    if (abs(dx) > 80 && abs(c.y - y) < 100 && sec < 1) {
        if (dx < 1)
            direction = 'left';
        else
            direction = 'right';
    } else if (abs(dy) > 80 && abs(c.x - x) < 100 && sec < 1) {
        if (dy < 1)
            direction = 'top'
        else
            direction = 'bottom'
    }

    if (direction) {
        e.direction = direction;
        callback(e)
    }
}
export const handleTouchStart = e => {

    x = cord(e).x;
    y = cord(e).y;
    then = Date.now();
    direction;
}