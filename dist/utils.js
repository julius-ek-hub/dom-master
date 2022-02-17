
export const _boolean = (val, default_ = true) => typeof val === 'boolean' ? val : default_;
export const _number = (val, default_ = 0) => typeof val === 'number' ? val : default_;
export const _object = (val, default_ = {}) => val && typeof val === 'object' ? val : default_;
export const _array = (val, default_ = []) => Array.isArray(val) ? val : default_;
export const _string = (val, default_ = '') => typeof val === 'string' ? val : default_;
export const _primitive = (val, default_ = '') => ['string', 'boolean', 'number'].includes(typeof val) ? val : default_;
export const str_to_array_of_words = (str) => {
    str = _array(str, [str]);
    let result = [];
    str.forEach(st => String(st).split(' ').filter(e => e).forEach(st_ => result.push(st_)));
    return result;
};
export const oneArrayElements = contents => {
   contents = _array(contents, [contents]);
   let result = [];
   let detectArray = arr => {
       arr.map(a => {
           a =  isJQL(a) ? a.plain(): a;
           if(Array.isArray(a))
              detectArray(a)
           else
              result.push(a);
       })
   }
   detectArray(contents);
   return result.filter(r => r);
}
export const isElement = el => {
    el = isJQL(el) ? el.plain() : [el];
    return  el.length > 0 && el.every(e =>  e instanceof Element);
}

export const toElement = el => isJQL(el) ? el.plain() : [el];
export const docEl = el => el.documentElement || el.document.documentElement;
export const isDocument = el => {
    el = isJQL(el) ? el.plain() : el;
    return el instanceof Document;
}
export const isWin = el => {
    el = isJQL(el) ? el.plain(0) : el;
    return el === window;
}

export const isDocOrWin = el => {
    el = isJQL(el) ? el.plain(0) : el;
    return el instanceof Document || el === window;
}
export const docWinProp = (el, prop) => isDocOrWin(el) ? docEl(el)[prop] : el[prop];
export const isNode = el => {
    el = isJQL(el) ? el.plain() : [el];
    return el.length > 0 && el.every(e => e instanceof Element || el instanceof Text);
}


export const create_el = (tag) => {
    if(_array(tag, null))
    return tag.map(t => create_el(t));

    if(typeof tag !== 'string' || typeof document === 'undefined') return tag;
    tag = tag.trim();

    let element = null;

    if(tag.startsWith('<') && tag.endsWith('>')){

        if(tag.match(/>|</g).length === 2 && tag.length === 3)
            tag = '<div/>';
        else
            tag = tag.replaceAll(/<>/g, '<div temporal-element-jql-injected>').replaceAll(/<\/>/g, '</div>').replaceAll(/<\s/g, '<div ')
        element = toHTML(tag);
    } else{
        if(tag.match(/>|</)) 
            throw new Error('Invalid argument for domMaster please read documentation - https:www.247-dev.com/projects/dom-master/how-to-use');
        else 
            element = [].slice.call(document.querySelectorAll(tag));
    }

    return element;
}

export const cord = e => {
    let _e = { x: 0, y: 0 };
    if (['touchstart', 'touchmove', 'touchend'].includes(e.type)) {
        let __e = e.changedTouches[0];
        _e.x = __e.clientX;
        _e.y = __e.clientY;
    } else {
        _e.x = e.x;
        _e.y = e.y;
    }
    return _e;
}

 export const isJQL = el => {
    return el && typeof el === 'object' && el.hasOwnProperty && 
           el.hasOwnProperty('plain') && typeof el.plain === 'function' && _array(el.plain(), null) &&
           el.plain().every(e => isNode(e));
}

export const toHTML = str => isNode(str) ? [str] : [].slice.call(new DOMParser().parseFromString(str, 'text/html').body.childNodes);
