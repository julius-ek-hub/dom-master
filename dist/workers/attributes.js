import {str_to_array_of_words as to_arr } from "../utils.js";

export const attr = (el, details) => {
    if (typeof details === 'string' && details) {
        return el.getAttribute(details);
    }
    if (typeof details === 'object')
        for (let d in details)
            el.setAttribute(d, details[d]);

    return el;
}

export const rmAttr = (el, attrname) => {
    to_arr(attrname).map(e => el.removeAttribute(e));
    return el;
}

export const hasAttr = (el, val) => to_arr(val).every(e => el.hasAttribute(e));

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