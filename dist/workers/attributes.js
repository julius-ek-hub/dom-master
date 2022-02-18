import {str_to_array_of_words as to_arr, isElement } from "../utils.js";

export const attr = (el, details) => {
    if (typeof details === 'string' && details) {
        return el.getAttribute(details);
    }
    if (typeof details === 'object')
        for (let d in details)
            el.setAttribute(d, details[d]);

    return el;
}

export const removeAttribute = (el, attrname) => {
    to_arr(attrname).map(e => el.removeAttribute(e));
    return el;
}

export const hasAttribute = (el, val) => {
    if(isElement(el))
        return to_arr(val).every(e => el.hasAttribute(e));
    return false;
}

export const style = (el, details) => {
    if (typeof details === 'string') {
        el.style = details;
        return el;
    }
    if (typeof details === 'object')
        for (let s in details)
            el.style[s] = details[s];
    return el;
}