var events = require('event');

/**
 * Expose `InlineEdit`.
 */

module.exports = inlineEdit;

function inlineEdit(el, contentType){
  if (el.tagName === 'INPUT'){
    editInput(el);
  } else {
    editElement(el, contentType);
  }
  
  return el;
}

function editInput(el){
  if (el.className.indexOf('inline-edit') === -1){
    el.className += ' inline-edit';
  }
}

function editElement(el, contentType){
  var content;
  
  
  el.setAttribute('contenteditable', true);
  events.bind(el, 'focus', onFocus);
  events.bind(el, 'blur', onBlur);
  
  function onFocus(event){
    content = event.target.innerHTML;
  }
  
  function onBlur(event){
    var newContent = event.target.innerHTML;
    if (content != newContent){      
      triggerChangeEvent(el);
    }
  }
}

function triggerChangeEvent(el){
  var event;
  
  if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    el.dispatchEvent(event);
    
  } else {
    event = document.createEventObject();
    el.fireEvent('onchange', event);
    
  }
}