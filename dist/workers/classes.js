import {str_to_array_of_words as to_arr} from "../utils.js";
export const addClass = function(el, classes){
    to_arr(classes).map(c => el.classList.add(c));
    return el;
}

export const removeClass = function(el, classes){
    to_arr(classes).map(c => el.classList.remove(c));
    return el;
}

export const className = function(el, val){
    if (!val || !typeof val === 'string') return el.className;
    el.className = val;
    return el;
}

export const hasClass = (el, val) => to_arr(val).every(cl => el.className.split(' ').includes(cl));