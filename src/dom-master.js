
import { 
    create_el, 
    _object as _obj, 
    _boolean, 
    _primitive, 
    isDocOrWin, 
    docEl, 
    docWinProp, 
    _array, 
    _string, 
    isElement, 
    toElement, 
    oneArrayElements } from './utils.js';
import { addClass, className, hasClass, removeClass } from './workers/classes.js';
import { addChild, appendTo, prependTo, html, insertAfter, insertBefore, parent, text } from './workers/nodes.js';
import { on, _on } from './workers/events.js';
import { attr, removeAttribute, style, hasAttribute } from './workers/attributes.js';

/**
 * ----------------------------------------------------------------
 * DOM Master v1.0.0
 * ----------------------------------------------------------------
 * Write Less, do more!!!
 * @param {String | Element | Window | Document}  Element_or_selector_or_Tag_or_Window_or_Document 1) The tag for the new element you
 * you want to create in the form '&lt;tagName /&gt;'. You can add attributes same way as in HTML but must be a string entirely 
 * like '&lt;tagName style="background:red;color:pink" id="idname" /&gt;'.
 * 2) Elements created or picked from the DOM using JavaScript.
 * 3) The window or document object for just a few methods
 * @see https://www.247-dev.com/projects/dom-master/doc#howtouse
 */

const domMaster = (Element_or_selector_or_Tag_or_Window_or_Document) => {
    let el = Element_or_selector_or_Tag_or_Window_or_Document;
    el = create_el(Element_or_selector_or_Tag_or_Window_or_Document);
    let allEl = oneArrayElements(el);


    const queryMethods = (collection, siblingsFor, onlyElements) =>{
        collection = [].slice.call(collection);
        let target = collection.length > 0 ? (siblingsFor ? [siblingsFor.parentElement] : collection[0].parentElement) : allEl[0];

        return {
        /**
         * Returns the results of a query. But also a particular result by index n. If you are accessing get
         * from siblings, that is el.siblings().get(n), n will be considered as sibling. -n for siblings behind
         * while +n for siblings infront.
         * @param {Number} n target result index
         * @see https://www.247-dev.com/projects/dom-master/doc/get
         */  
            get(n) {
                let result;
                if(siblingsFor && typeof n === 'number'){
                    let thisIndex = collection.indexOf(siblingsFor);
                    let sum = thisIndex + n;
                    if (n === -1)
                        result = domMaster(siblingsFor).previousSibling(onlyElements);
                    if (n === 1)
                        result = domMaster(siblingsFor).nextSibling(onlyElements);
                    if (sum >= 0 && sum < collection.length)
                        result = collection[sum];
                }else
                   result =  typeof n === 'number' ? collection[n] : collection
                return domMaster(result)
            },

            /**
             * Filters the collection of element. Accepts a function, string and number, please 
             * the link attached
             * @param {Function | Number | String} selector What to exclude
             * @see https://www.247-dev.com/projects/dom-master/doc/exclude
             */

            except(selector){
              let forChecking = [];
              let checked = [];
              selector = _array(selector, [selector]);
    
              selector.map(ex => {
                  if(_string(ex) && !checked.includes(ex))
                     forChecking = [...forChecking, ...domMaster(target).query(ex).get().plain()];
                  else if(isElement(ex))
                     forChecking = [...forChecking, ex];
                  checked.push(ex);
              });
    
              forChecking = forChecking.map(fc => toElement(fc)[0]);
              let excludedIndexes = selector.filter(xc => typeof xc === 'number');
              let resultSoFar = collection.filter((c, index) => !excludedIndexes.includes(index));

              resultSoFar = resultSoFar.filter(c => !forChecking.includes(c));
              let callbacks = selector.filter(ex => typeof ex === 'function');

              if(callbacks.length > 0)
                  resultSoFar = resultSoFar.filter(rsf => !callbacks.every(cb => cb(domMaster(rsf))))
                
              return queryMethods(resultSoFar, siblingsFor, onlyElements);
            }
        }
    }

    const externalMethods = ((extensions)=> {
        const _extensions = {};
        for(let extention in extensions ){
            const method = extensions[extention];
            if(typeof method === 'function')
                _extensions[extention] = method.bind(allEl)
        }
        return _extensions;
    })(domMaster.extends);


    return {
        ...externalMethods,

        /**
         * Adds class(es) to element
         * @param {String | String[]} className className or array of classNames to be added. Can also be a string of 
         * whitespace separated classNames
         * @see https://www.247-dev.com/projects/dom-master/doc#addclass
         */

        addClass(className){
            return domMaster(allEl.map(e => addClass(e, className)));
        },

        /**
         * Adds a class if absent or removes it if present
         * @param {String} className
         * @see https://www.247-dev.com/projects/dom-master/doc#toggleclass
         */

        toggleClass(className){
            allEl.map(el => el.classList.toggle(className));
            return domMaster(allEl);
        },

        /**
         * Removes class(es) from an element
         * @param {String} className className or array of classNames to be added. Can also be a string of 
         * whitespace separated classNames
         * @see https://www.247-dev.com/projects/dom-master/doc#removeclass
         */

        removeClass(className){
            
            return domMaster(allEl.map(el => removeClass(el, className)));
        },

        /**
         * Returns classname if value is not provided else overrides the existing class with value
         * @param {String | void} value 
         * @see https://www.247-dev.com/projects/dom-master/doc#classname
         */

        className(value){
            return className(allEl[0], value);
        },

        /**
         * Returns true if the className(s) are all present in the element else false
         *  @param {String | String[]} className className or array of classNames to be added. Can also be a string of 
         * whitespace separated classNames
         * @see https://www.247-dev.com/projects/dom-master/doc#hasclass
         */

        hasClass(className){
            return hasClass(allEl[0], className);
        },

        /**
         * Tells if the node is the first childNode or firstElementChild depending on the value for onlyElement
         * @param {Boolean} onlyElement By default, onlyElement is true, which would use Elements only. Else would use all Nodes
         * @see https://www.247-dev.com/projects/dom-master/doc#isfirstchild
         */

        isFirstChild(onlyElement = true){
            return allEl[0].parentElement[onlyElement ? 'firstElementChild' : 'firstChild'] == allEl[0];
        },

        /**
         * Tells if the node is the last childNode or lastElementChild depending on the value for onlyElement
         * @param {Boolean} onlyElement By default, onlyElement is true, which would use Elements only. Else would use all Nodes
         * @see https://www.247-dev.com/projects/dom-master/doc#islastchild
         */

        isLastChild(onlyElement = true){
            return allEl[0].parentElement[onlyElement ? 'lastElementChild' : 'lastChild'] == allEl[0];
        },

        /**
         * Returns the index of the first element in the store
         * @see https://www.247-dev.com/projects/dom-master/doc#index
         */

        index(){
            return isElement(allEl[0]) ? domMaster(allEl[0]).siblings().get().plain().indexOf(allEl[0]) : null;
        },

        /**
         * Returns true if all elements in the store exists in the DOM else false
         * @see https://www.247-dev.com/projects/dom-master/doc#exists
         */

        exist(){
          return (allEl.length > 0 & allEl.every(el => el && [].slice.call(domMaster(el).getStyle()).length > 0)) ? true: false;
        },

        /**
         * Returns the first childNode or firstElementChild depending on the value for onlyElement
         * @param {Boolean} onlyElement By default, onlyElement is true, which would use Elements only. Else would use all Nodes
         * @see https://www.247-dev.com/projects/dom-master/doc#firstchild
         */

        firstChild(onlyElement = true){
            return domMaster(onlyElement ? allEl[0].firstElementChild : allEl[0].firstChild);
        },

        /**
         * Returns the last childNode or lastElementChild depending on the value for onlyElement
         * @param {Boolean} onlyElement By default, onlyElement is true, which would use Elements only. Else would use all Nodes
         * @see https://www.247-dev.com/projects/dom-master/doc#lastchild
         */

        lastChild(onlyElement = true){
            return domMaster(onlyElement ? allEl[0].lastElementChild : allEl[0].lastChild)
        },

        /**
         * Returns the next adjecent childNode or Element depending on the value for onlyElement
         * @param {Boolean} onlyElement By default, onlyElement is true, which would use Elements only. Else would use all Nodes
         * @see https://www.247-dev.com/projects/dom-master/doc#nextsibling
         */

        nextSibling(onlyElement = true){
            return domMaster(onlyElement ? allEl[0].nextElementSibling : allEl[0].nextSibling);
        },

        /**
         * Returns the previous adjecent childNode or Element depending on the value for onlyElement
         * @param {Boolean} onlyElement By default, onlyElement is true, which would use Elements only. Else would use all Nodes
         * @see https://www.247-dev.com/projects/dom-master/doc#previoussibling
         */

        previousSibling(onlyElement = true){
            return domMaster(onlyElement ? allEl[0].previousElementSibling : allEl[0].previousSibling)
        },

        /**
         * Returns the id of the Element if id parament is void else would override the existing id with the id supplied
         * @param {Sring | void} id 
         * @see https://www.247-dev.com/projects/dom-master/doc#id
         */

        id(id){
            if(typeof id === 'string' && id)
               return domMaster(allEl[0]).attr({ id });
            return allEl[0].id;
        },

        /**
         * For appending new Nodes
         * @param {*} content Pass a single child content 
         * or an array of child contents
         * @see https://www.247-dev.com/projects/dom-master/doc#addchild
         */

        addChild(content){
           return domMaster(addChild(domMaster, allEl[0], content));
        },

        /**
         * Addes a new content before an existing child element in the DOM
         * @param {*]} newContent Pass a single child content 
         * or an array of child contents
         * @param {Element} existing A child element already existing in the DOM before which the new content 
         * should be added.
         * @see https://www.247-dev.com/projects/dom-master/doc#insertbefore
         */

        insertBefore(newContent, existing) {
           return domMaster(insertBefore(domMaster, allEl[0], newContent, existing));
        },

        /**
         * Addes a new content after an existing child element in the DOM
         * @param {*} newContent Pass a single child content 
         * or an array of child contents
         * @param {Element} existing A child element already existing in the DOM after which the new content 
         * should be added.
         * @see https://www.247-dev.com/projects/dom-master/doc#insertafter
         */

        insertAfter(newContent, existing){
           return domMaster(insertAfter(domMaster, allEl[0], newContent, existing));
        },

        /**
         * If a string is provided, assumes it's attribute name and returns the value. Else if a valid object 
         * is provided, new attibutes are creted from it and the elemnt returned as JQL
         * @param {String | {}} keyValuePairs 
         * @see https://www.247-dev.com/projects/dom-master/doc#attr
         */

        attr(keyValuePairs){
            let att = allEl.map(el => attr(el, keyValuePairs));
            return att.every(at => _obj(at, null)) ? domMaster(att) : att[0];
        },

        /**
         * Removes attributes from an element
          @param {String | String[]} attrName attribute or array of attributes to be removed. Can also be a string of 
         * whitespace separated attributes
         */

        removeAttribute(attrName){
            return domMaster(allEl.map(el => removeAttribute(el, attrName)));
        },
        
        /**
         * Returns true if attibutes are all present in an element else false.
          @param {String | String[]} attrName attribute or array of attributes to be checked. Can also be a string of 
         * whitespace separated attributes
         */

        hasAttribute(attrName){
            return hasAttribute(allEl[0], attrName)
        },

        /**
         Adds or replace element styles
         * @param {String | {}} keyValuePairs If string is provided, would override the existing style with the provided one which should be in css format.
         * Else if valid object is provided, new styles are going to be added to the element from the object.
         */

        style(keyValuePairs){
            return domMaster(allEl.map(el => style(el, keyValuePairs)))
        },

        /**
         * Remove an element from the DOM
         */

        drop(){
            return allEl.map(el => el.remove());
        },
        
        /**
         * Remove all childNodes of an element from the DOM
         */

        truncate(){
            allEl.map(el => el.innerHTML = null);
            return domMaster(allEl);
        },

        /**
         * Truncates and element and add new contents
         * @param {*} newContent Pass a single child content 
         * or an array of new contents
         */

        refill(newContent){
            return domMaster(allEl).truncate().addChild(newContent)
        },

        /**
         * Disables or enables an element depending on parameter
         * @param {Boolean} disable if true, will disable the element. Else, will enable it. Value is true by default
         */

        disable(disable){
            allEl.map(el => el.disabled = _boolean(disable));
            return domMaster(allEl);
        },

        /**
         * Clones an element
         * @param {Boolean} deep if true, will clone the element including it's childNodes else will clone only the 
         * element. true by default.
         */

        clone(deep){
            return domMaster(allEl.map(el => el.cloneNode(_boolean(deep))))
        },

        /**
         * Will click or listen for click event depending on the parameter
         * @param {Function | void} fn if function is set, an eventListener will be added with the function as callback 
         * else a click will be performed on the element.
         * @returns 
         */

        click(fn){
            allEl.map(el => typeof fn === 'function' ? domMaster(el).on('click', fn) : el.click())
            return domMaster(allEl);
        },

        /**
         * Usefull for form element only, to clear all fields.
         */

        reset(){
            allEl.map(el => el.reset());
            return domMaster(el);
        },

        /**
         * ----------------------------------------------------
         * Add EventListerner
         * ----------------------------------------------------
         * @param {String} event
         * @param {Function} callback
         * @param {Boolean | {}} useCapture
         * @see https://www.247-dev.com/projects/dom-master/doc#on
         */

        on(event, callback, useCapture){
            return domMaster(allEl.map(el => on(domMaster, el, event, callback, useCapture)));
        },

        /**
         * ----------------------------------------------------
         * Remove EventListerner
         * ----------------------------------------------------
         * @param {String} event
         * @param {Function} callback
         * @param {Boolean | {}} useCapture
         * @see https://www.247-dev.com/projects/dom-master/doc#_on
         */

        _on(event, callback, useCapture){
            return domMaster(allEl.map(el => _on(domMaster, el, event, callback, useCapture)));
        },

        /**
         * ----------------------------------------------------------------
         * Sets or returns the innerHTML of an element, this will not override the existing one. If you want 
         * to override, the call truncate first el.truncate().html(new)
         * ----------------------------------------------------------------
         * @param {*} value Supply this value to set innerHTML
         * @see https://www.247-dev.com/projects/dom-master/doc/html
         */

        html(value){
            return html(domMaster(allEl[0]), value);
        },

        /**
         * ----------------------------------------------------------------
         * Sets or returns the innerText of an element, this will not override the existing one. If you want 
         * to override, the call truncate first el.truncate().text(new)
         * ----------------------------------------------------------------
         * @param {*} value Supply this value to set innerText
         * @see https://www.247-dev.com/projects/dom-master/doc/text
         */

        text(value){
            return text(domMaster(allEl), value);
        },

        /**
         * ----------------------------------------------------------------
         * Hides or shows an element depending on the parameter
         * ----------------------------------------------------------------
         * @param {Boolean} bool if false, will show the element else will hide it. true by default
         * @see https://www.247-dev.com/projects/dom-master/doc/hide
         */

        hide(bool){
            allEl.map(el => el.hidden = _boolean(bool));
            return domMaster(allEl);
        },

        /**
         * ----------------------------------------------------------------
         * Makes an input required or not. Can also return whether it is required 
         * or not depending on parameter
         * ----------------------------------------------------------------
         * @param {Boolean} value if true, will make it required. true by default
         * @see https://www.247-dev.com/projects/dom-master/doc/required
         */

        required(value){
            if(typeof value === 'boolean'){
                allEl.map(el => el.required = value);
                return domMaster(allEl);
             }
             return allEl[0].required;
        },

        /**
         * ----------------------------------------------------------------
         * Marks a select option selected or not. Can also Return whether it is selected
         * or not depending on parameter
         * ----------------------------------------------------------------
         * @param {Boolean} value if true, will maark it selected. false by default
         * @see https://www.247-dev.com/projects/dom-master/doc/selected
         */

        selected(value){
            if(typeof value === 'boolean'){
                allEl[0].selected = value;
                return domMaster(allEl);
             }
             return allEl[0].selected;
        },

        /**
         * ----------------------------------------------------------------
         * Selects all the texts in a textarea or an input element that 
         * contains texts
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/select
         */

        select(){
            allEl[0].select();
            return domMaster(allEl);
        },

        /**
         * ----------------------------------------------------------------
         * focuses an element, best for inputs and textareas
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/focus
         */

        focus(){
            allEl[0].focus();
            return domMaster(allEl);
        },

        /**
         * ----------------------------------------------------------------
         * Blurs or unfocus an element
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/blur
         */

        blur(){
            allEl.map(el => el.blur());
            return domMaster(allEl)
        },

        /**
         * ----------------------------------------------------------------
         * Checks a checkbox element or not. Can also Return whether it is 
         * checked or not depending on parameter
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/checked
         */

        checked(value){
           if(typeof value === 'boolean'){
              allEl[0].checked = true;
              return domMaster(allEl);
           }
           return allEl[0].checked;
        },

        /**
         * ----------------------------------------------------------------
         * Returns all slected files from an input element with type 'file'.
         * Returns the files in array.
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/files
         */

        files(){
            if(domMaster(allEl).attr('type') !== 'file') return null;
            return [].slice.call(allEl[0].files) 
        },

        /**
         * ----------------------------------------------------------------
         * Submits a form
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/submit
         */

        submit(){
            return allEl.map(el => el.submit());
        },

        /**
         * ----------------------------------------------------------------
         * Plays a media element
         * ----------------------------------------------------------------
         * @returns {Promise}
         * @see https://www.247-dev.com/projects/dom-master/doc/play
         */

        play(){
            return Promise.all(allEl.map(el => el.play()));
        },

        /**
         * ----------------------------------------------------------------
         * Pauses a media element
         * ----------------------------------------------------------------
         * @see https://www.247-dev.com/projects/dom-master/doc/pause
         */

        pause(){
            allEl.map(el => el.pause())
            return domMaster(allEl);

        },

        /**
         * ----------------------------------------------------------------
         * Adds the current element to the end of another
         * ----------------------------------------------------------------
         * @param {Element} parent The receiving parent
         * @see https://www.247-dev.com/projects/dom-master/doc/appendto
         */

        appendTo(parent){
            return domMaster(allEl.map(el => appendTo(el, parent)));
        },

        /**
         * ----------------------------------------------------------------
         * Adds the current element to the beginning of another
         * ----------------------------------------------------------------
         * @param {Element} parent The receiving parent
         * @see https://www.247-dev.com/projects/dom-master/doc/prependto
         */
        
        prependTo(parent){
            return domMaster(allEl.reverse().map(el => prependTo(domMaster, el, parent)));
        },

        /**
         * ----------------------------------------------------------------
         * Sets or return the value of a form element
         * ----------------------------------------------------------------
         * @param {*} v The new value if set
         * @see https://www.247-dev.com/projects/dom-master/doc/value
         */

        value(v){
            if (_primitive(v, null)) {
                allEl.map(el => {
                    el.value = v;
                });
                return domMaster(allEl);
            } else
                return allEl[0].value;
        },

        /**
         * ----------------------------------------------------------------
         * Gets all the Siblings of the element
         * ----------------------------------------------------------------
         * @param {Boolean} onlyElements If set to true, will get only Elements else 
         * will get every Sibling including texts, comments etc.
         * @see https://www.247-dev.com/projects/dom-master/doc/siblings
         */


        siblings(onlyElements = true){
            let parent = allEl[0].parentElement;
            return queryMethods(onlyElements ? parent.children : parent.childNodes, allEl[0], onlyElements)
        },

        /**
         * ----------------------------------------------------------------
         * Will return the parent Element nth times behind
         * ----------------------------------------------------------------
         * @param {Number} n which parent above the tree should be targeted? 0 = parentElement,
         * 1 = parentElement.parentElement, 2 = parentElement.parentElement.parentElement. etc
         * @see https://www.247-dev.com/projects/dom-master/doc/parent
         */

        parent(n){
            return domMaster(parent(allEl[0], n));
        },

        /**
         * ----------------------------------------------------------------
         * Returns the style object or property value of the element
         * ----------------------------------------------------------------
         * @param {String} prop This would be the property name. If set, will return its value else, 
         * will return the entire style object.
         * @see https://www.247-dev.com/projects/dom-master/doc/getstyle
         */

        getStyle(prop){
            let style = getComputedStyle(allEl[0]);
            if(!prop) return style;
            return style.getPropertyValue(prop);
        },

        /**
         * ----------------------------------------------------------------
         * Gets all the childNodes of the element
         * ----------------------------------------------------------------
         * @param {Boolean} onlyElements If set to true, will get only Elements else 
         * will get every childNode including texts, comments etc.
         * @see https://www.247-dev.com/projects/dom-master/doc/children
         */

        children(onlyElements = true){
            return queryMethods(onlyElements ? allEl[0].children : allEl[0].childNodes, null, onlyElements)

        },

        /**
         * ----------------------------------------------------------------
         * Returns a particular childNode by its index
         * ----------------------------------------------------------------
         * @param {Number} index index of the node
         * @param {Boolean} onlyElements If set to true, will verify only amongs Elements else 
         * will check every childNode including texts, comments etc.
         * @see https://www.247-dev.com/projects/dom-master/doc/child
         */

        child (index = 0, onlyElement = true){
            return domMaster(allEl[0]).children(onlyElement).get(index);
        },

        /**
         * ----------------------------------------------------------------
         * Returns true if the element is visible within the viewport else false
         * ----------------------------------------------------------------
         * @param {Number} offsetX Optional x value to ignore during calculation.
         * @param {Number} offsetY Optional y value to ignore during calculation.
         * @see https://www.247-dev.com/projects/dom-master/doc/isvisible
         */

        isVisible(offsetX = 0, offsetY = 0){
            let bc = allEl[0].getBoundingClientRect();
            return (bc.bottom > 0 && bc.top < (innerHeight + offsetY)) && (bc.right > 0 && bc.left < (innerWidth + offsetX));
        },

        /**
         * ----------------------------------------------------------------
         * Gets all the decendants of the element that meet a particular criteria
         * ----------------------------------------------------------------
         * @param {String} selector should be querySelectorAll argument
         * @see https://www.247-dev.com/projects/dom-master/doc/query
         */

        query(selector){
            return queryMethods([].slice.call(allEl[0].querySelectorAll(selector)));
        },

        /**
         * ----------------------------------------------------------------
         * Gets the first decendants of the element that meet a particular criteria
         * ----------------------------------------------------------------
         * @param {String} selector should be querySelector argument
         * @see https://www.247-dev.com/projects/dom-master/doc/find
         */

        find(selector) {
            return domMaster(allEl[0].querySelector(selector));
        },

        /**
         * Returns the exact height in pixels of the element including scrollbar height;
         */

        height(){
           if(isDocOrWin(allEl[0])) return innerHeight;
              return allEl[0].getBoundingClientRect().height;
        },

        /**
         * Returns the exact width in pixels of the element including scrollbar width;
         */
        
        width(){
            if(isDocOrWin(allEl[0])) return innerWidth;
              return allEl[0].getBoundingClientRect().width
        },
        offsetHeight(){
            return docWinProp(allEl[0], 'offsetHeight');
        },
        offsetWidth(){
            return docWinProp(allEl[0], 'offsetWidth');
        },
        offsetTop(){
            return docWinProp(allEl[0], 'offsetTop');
        },
        offsetLeft(){
            return docWinProp(allEl[0], 'offsetLeft');
        },
        clientHeight(){
            return docWinProp(allEl[0], 'clientHeight');
        },
        clientWidth(){
            return docWinProp(allEl[0], 'clientWidth');
        },
        scrollHeight() {
            return docWinProp(allEl[0], 'scrollHeight');
        },
        scrollWidth(){
            return docWinProp(allEl[0], 'scrollWidth');
        },
        scrollLeft(){
            return docWinProp(allEl[0], 'scrollLeft');
        },
        scrollTop(){
            return docWinProp(allEl[0], 'scrollTop');
        },
        scrollIntoView(...args){
            return  isDocOrWin(allEl[0]) ? docEl(allEl[0]).scrollIntoView(...args) : allEl[0].scrollIntoView(...args);
        },
        scrollTo(...args){
           return  isDocOrWin(allEl[0]) ? window.scrollTo(...args) : allEl[0].scrollTo(...args);
        },
        scrollY(){
            return allEl[0].scrollY;
        },
        scrollX() {
            return allEl[0].scrollX;
        },
        tagName(){
            return allEl[0].tagName
        },
        getBoundingClientRect(...args){
            return isDocOrWin(allEl[0]) ? docEl(allEl[0]).getBoundingClientRect(...args) : allEl[0].getBoundingClientRect(...args);
        },
    
        /**
         * Return the plain HTMLElement(s) in an array because we may be 
         * dealing with more than one element at once
         * @param {Number} n the position of the element you want to retrieve as HTMLElement. It is adviced 
         * to call plain without any parameter and then use array methods to handle it.
         * @returns {[HTMLElement]}
         */

        plain(n){
            return typeof n === 'number' ? allEl[n] : allEl;
        },

        /**
         * Filters the collection of element. Accepts a function, string and number, please 
         * the link attached
         * @param {Function | String | Number} selector What to exclude
         * @see https://www.247-dev.com/projects/dom-master/doc/exclude
         */

        except(selector){
            return queryMethods(allEl).except(selector);
        },

        /**
         * Because you may be handling more than an element at once, use this method to handle a
         * a particular one by index
         * the link attached
         * @param {Number} n The index of the element to work with, if not provided, the entire elements 
         * are returned untouched
         * @see https://www.247-dev.com/projects/dom-master/doc/get
         */  

        get(n){
            return domMaster(typeof n === 'number' ? allEl[n] : allEl);
        },

        /**
         * runs a function for each of the elements you are working with. Use it as Array.forEach
         * @param {Function} fn callback
         */

        forEach(fn){
            allEl.forEach((el, index, array) => fn(domMaster(el), index, array.map(domMaster)))
            return domMaster(allEl);
        }
    }
}

domMaster.extends = {};

export default domMaster;

