import { isJQL, _array, isElement, oneArrayElements, _object, toHTML, _string } from "../utils.js";

export const addChild = function(el, children){
    if(!isElement(el)) return [];

    oneArrayElements(children).map(child => toHTML(child).map(e => el.appendChild(e)));
    return el;
}

export const insertBefore = (_, el, new_, exist) => {
    if(!isElement(el)) return [];

    exist = typeof exist === 'number' ? _(el).children().get(exist).plain(0) : exist;
    exist = isJQL(exist) ? exist.plain(0) : exist;
    if(!exist) return _(el).addChild(new_);
    oneArrayElements(new_).map(n => {
       return el.insertBefore(isJQL(n) ? n.plain(0) : n, exist)
    });
    return el;
}

export const insertAfter = (_, el, new_, exist) => {
    if(!isElement(el)) return [];

    exist = typeof exist === 'number' ? _(el).child(exist).plain(0) : exist;
    exist = isJQL(exist) ? exist : _(exist);
    if(!exist || exist.isLastChild()) return _(el).addChild(new_);
    
    exist = exist.nextSibling();
    exist = isJQL(exist) ? exist.plain(0) : exist;
    oneArrayElements(new_).map(n => {
        return el.insertBefore(isJQL(n) ? n.plain(0) :  n, exist)
     });
    return el;
}

export const text = (el, value) => {
    if(!isElement(el)) return undefined;
    if (typeof value !== 'string') return el.plain(0).textContent;
    el.plain().map(e => e.appendChild(document.createTextNode(value)));
    return el;
}

export const html = (el, value) => {
    if(!isElement(el)) return undefined;

    if (typeof value !== 'string') return el.plain(0).innerHTML;
    el.addChild(toHTML(value));
    return el;
}

export const appendTo = (el, parent) => {
    if (isJQL(parent))
        parent = parent.plain(0)
    parent.appendChild(el);
    return el;
}

export const prependTo = (_, el, parent) => {
    if (isJQL(parent))
        parent = parent.plain(0)
        insertBefore(_, parent, el, 0);
    return el;
}

export const parent = (el, n = 0) => {
    if(!isElement(el)) return el;
    let p;
    for (let i = 0; i <= n; i++) 
        p = p ? p.parentElement : el.parentElement;
    return p;
}

