/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(mod.exports, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || null;
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  // foo
  if ('.' != path[0]) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    var alias = require.aliases[path + '/index.js'];
    if (alias) path = alias;
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path[0]) {
      var segs = parent.split('/');
      var i = segs.lastIndexOf('deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("component-event/index.js", function(module, exports, require){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
};
});
require.register("inline-edit/index.js", function(module, exports, require){
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
});
require.alias("component-event/index.js", "inline-edit/deps/event/index.js");
