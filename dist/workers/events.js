import {cord} from "../utils.js";

let scrollCallbacks = [];
let swipeCallbacks = [];

let makeEventRemovable = (el, callbackHolders, targetCallback, useCapture, event, remove) =>{
    let _el = el.plain(0);
    let scbs = callbackHolders.find(s => s.element == _el);
    if(remove && scbs){
        scbs.callbacks.map(cb => _el.removeEventListener(event, cb, useCapture))
    }
    if(!remove){
        _el.addEventListener(event, targetCallback, useCapture);
       if(!scbs)
          callbackHolders.push({element: _el, callbacks: [targetCallback]});
       else {
        scbs.callbacks.push(targetCallback);
        callbackHolders.map(e => (e.element == _el) ? scbs : e)
       }
    }  
}
const getScrollPercentage = el => {
    let dx = (el.scrollWidth() - el.clientWidth());
    let dy = (el.scrollHeight() - el.clientHeight());
    return {
        x: (el.scrollLeft() / (dx <= 0 ? 1 : dx)) * 100, 
        y: (el.scrollTop() / (dy <= 0 ? 1 : dy)) * 100
    }
}
const handleScroll = (el, callback, useCapture, remove) => {
    let ps_ = getScrollPercentage(el);
    let lastScrollTop = ps_.y;
    let lastScrollLeft = ps_.x;
    let dir = 'bottom';
    const onScroll = e => {
       let ps = getScrollPercentage(el);
       e.percentageYScroll = ps.y;
       e.percentageXScroll = ps.x;
        let vdiff = ps.y - lastScrollTop;
        let hdiff = ps.x - lastScrollLeft;
        if (vdiff > 0)
            dir = 'bottom';
        else if (vdiff < 0)
            dir = 'top';
        else if (hdiff > 0)
            dir = 'right';
        else if (hdiff < 0)
            dir = 'left';

        lastScrollLeft = ps.x;
        lastScrollTop = ps.y;
        e.direction = dir;
        callback(e);
    }
    makeEventRemovable(el, scrollCallbacks, onScroll, useCapture, 'scroll', remove);
}

const handleSwipe = (el, callback, useCapture, remove) => {
    let x, y, then;

    let handleTouchStart = e => {
        x = cord(e).x;
        y = cord(e).y;
        then = Date.now();
    };

    let handleTouchEnd = e => {
        let sec = (Date.now() - then) / 1000;
        let c = cord(e);
        let dx = c.x - x;
        let dy = c.y - y;
        let direction;
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
    };

    makeEventRemovable(el, swipeCallbacks, handleTouchStart, useCapture, 'touchstart', remove);
    makeEventRemovable(el, swipeCallbacks, handleTouchEnd, useCapture, 'touchend', remove);
}

export const on = (_, el, events, callback, useCapture = false) => {
    if(typeof events !== 'string' && !Array.isArray(events)) return el;

    events = typeof events === 'string' ? events.split(' ') : events; 
    for (let event of events) {
        if (event === 'swipe') {
            handleSwipe(_(el), callback, useCapture);
            continue;
        }
        if (event === 'scroll') {
            
            handleScroll(_(el), callback, useCapture)
            continue;
        }
        el.addEventListener(event, callback, useCapture);
    }
    return el;
}

export const _on = (_, el, events, callback, useCapture = false) => {
    if(typeof events !== 'string' && !Array.isArray(events)) return el;
    
    events = typeof events === 'string' ? events.split(' ') : events; 
    for (let event of events) {
        if (event === 'swipe') {
            handleSwipe(_(el), callback, useCapture, true);
            continue;
        }
        if(event == 'scroll'){
            handleScroll(_(el), callback, useCapture, true)
            continue;
        }
        el.removeEventListener(event, callback, useCapture);
    }
    return el;
}