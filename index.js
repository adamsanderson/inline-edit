var events = require('event');

/**
 * Expose `inlineEdit`.
 */

module.exports = inlineEdit;

/**
 * Make an element inline editable.  If the element is an input
 * it will just be styled to look like it is inline editable.
 * 
 * If the element is not an input, it will have `contenteditable`
 * enabled, and `change` events will be triggered as if it were a
 * normal input.
 */
function inlineEdit(el){
  if (el.tagName === 'INPUT'){
    editInput(el);
  } else {
    editElement(el);
  }
  
  return el;
}

/** 
 * Decorate an input so it blends into the surrounding content.
 */
function editInput(el){
  if (el.className.indexOf('inline-edit') === -1){
    el.className += ' inline-edit';
  }
}

/** 
 * Make a DOM element behave like a normal input.
 */
function editElement(el){
  el.setAttribute('contenteditable', true);
  el.value = el.innerHTML;
  
  events.bind(el, 'focus', onFocus);
  events.bind(el, 'blur', onBlur);
}

/** 
 * Store the DOM element's content in value so it can be queried.
 */
function onFocus(event){
  var el = event.target;
  
  el.setAttribute('value', el.innerHTML);
}

/**
 * Trigger a change event if the element changed.
 */
function onBlur(event){
  var el = event.target;
  var content = el.innerHTML;
  
  if (content != el.value){
    el.value = content;
    triggerChangeEvent(event.target);
  }
}

function triggerChangeEvent(el){
  var event;
  
  if (document.createEvent) {
    // Cumbersome DOM Level 2 Model
    event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    el.dispatchEvent(event);
    
  } else {
    // IE Event Model
    event = document.createEventObject();
    el.fireEvent('onchange', event);
   
  }
}