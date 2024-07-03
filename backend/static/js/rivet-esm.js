/*!
 * rivet-core - @version 2.7.0
 *
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * Element.matches() polyfill
 *****************************************************************************/

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}

/******************************************************************************
 * Element.closest() polyfill
 *
 * @see https://go.iu.edu/4ftm
 *****************************************************************************/

if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector) {
    var el = this;
    var ancestor = this;

    if (!document.documentElement.contains(el)) { return null }

    do {
      if (ancestor.matches(selector)) { return ancestor }

      ancestor = ancestor.parentElement;
    } while (ancestor !== null)

    return null
  };
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * CustomEvent polyfill
 *
 * @see https://go.iu.edu/4ftn
 *****************************************************************************/

(function () {
  if (typeof window.CustomEvent === 'function') { return false }

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };

    var customEvent = document.createEvent('CustomEvent');

    customEvent.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );

    return customEvent
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/******************************************************************************
 * Copyright (C) 2022 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * Array.from() polyfill
 *
 * @see https://go.iu.edu/4ftl
 *****************************************************************************/

if (!Array.from) {
  Array.from = (function () {
    var symbolIterator;

    try {
      symbolIterator = Symbol.iterator
        ? Symbol.iterator
        : 'Symbol(Symbol.iterator)';
    } catch (e) {
      symbolIterator = 'Symbol(Symbol.iterator)';
    }

    var toStr = Object.prototype.toString;

    var isCallable = function (fn) {
      return (
        typeof fn === 'function' ||
              toStr.call(fn) === '[object Function]'
      )
    };

    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) return 0
      if (number === 0 || !isFinite(number)) return number
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number))
    };

    var maxSafeInteger = Math.pow(2, 53) - 1;

    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger)
    };

    var setGetItemHandler = function setGetItemHandler (isIterator, items) {
      var iterator = isIterator && items[symbolIterator]();
      return function getItem (k) {
        return isIterator ? iterator.next() : items[k]
      }
    };

    var getArray = function getArray (
      T,
      A,
      len,
      getItem,
      isIterator,
      mapFn
    ) {
      // 16. Let k be 0.
      var k = 0;

      // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
      while (k < len || isIterator) {
        var item = getItem(k);
        var kValue = isIterator ? item.value : item;

        if (isIterator && item.done) {
          return A
        } else {
          if (mapFn) {
            A[k] =
                          typeof T === 'undefined'
                            ? mapFn(kValue, k)
                            : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
        }
        k += 1;
      }

      if (isIterator) {
        throw new TypeError(
          'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
        )
      } else {
        A.length = len;
      }

      return A
    };

    // The length property of the from method is 1.
    return function from (arrayLikeOrIterator /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLikeOrIterator).
      var items = Object(arrayLikeOrIterator);
      var isIterator = isCallable(items[symbolIterator]);

      // 3. ReturnIfAbrupt(items).
      if (arrayLikeOrIterator == null && !isIterator) {
        throw new TypeError(
          'Array.from requires an array-like object or iterator - not null or undefined'
        )
      }

      // 4. If mapfn is undefined, then var mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError(
            'Array.from: when provided, the second argument must be a function'
          )
        }

        // 5. b. If thisArg was supplied, var T be thisArg; else var T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      return getArray(
        T,
        A,
        len,
        setGetItemHandler(isIterator, items),
        isIterator,
        mapFn
      )
    }
  })();
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * ChildNode.remove() polyfill
 *
 * @see https://go.iu.edu/4fto
 *****************************************************************************/

(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) { return }

    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove () {
        if (this.parentNode === null) { return }

        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

"inert"in HTMLElement.prototype||(Object.defineProperty(HTMLElement.prototype,"inert",{enumerable:!0,get:function(){return this.hasAttribute("inert")},set:function(h){h?this.setAttribute("inert",""):this.removeAttribute("inert");}}),window.addEventListener("load",function(){function h(a){var b=null;try{b=new KeyboardEvent("keydown",{keyCode:9,which:9,key:"Tab",code:"Tab",keyIdentifier:"U+0009",shiftKey:!!a,bubbles:!0});}catch(g){try{b=document.createEvent("KeyboardEvent"),b.initKeyboardEvent("keydown",
!0,!0,window,"Tab",0,a?"Shift":"",!1,"en");}catch(d){}}if(b){try{Object.defineProperty(b,"keyCode",{value:9});}catch(g){}document.dispatchEvent(b);}}function k(a){for(;a&&a!==document.documentElement;){if(a.hasAttribute("inert"))return a;a=a.parentElement;}return null}function e(a){var b=a.path;return b&&b[0]||a.target}function l(a){a.path[a.path.length-1]!==window&&(m(e(a)),a.preventDefault(),a.stopPropagation());}function m(a){var b=k(a);if(b){if(document.hasFocus()&&0!==f){var g=(c||document).activeElement;
h(0>f?!0:!1);if(g!=(c||document).activeElement)return;var d=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT,{acceptNode:function(a){return !a||!a.focus||0>a.tabIndex?NodeFilter.FILTER_SKIP:b.contains(a)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});d.currentNode=b;d=(-1===Math.sign(f)?d.previousNode:d.nextNode).bind(d);for(var e;e=d();)if(e.focus(),(c||document).activeElement!==g)return}a.blur();}}(function(a){var b=document.createElement("style");b.type="text/css";b.styleSheet?
b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a));document.body.appendChild(b);})("/*[inert]*/*[inert]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}");var n=function(a){return null};window.ShadowRoot&&(n=function(a){for(;a&&a!==document.documentElement;){if(a instanceof window.ShadowRoot)return a;a=a.parentNode;}return null});var f=0;document.addEventListener("keydown",function(a){f=9===a.keyCode?a.shiftKey?-1:1:0;});document.addEventListener("mousedown",
function(a){f=0;});var c=null;document.body.addEventListener("focus",function(a){var b=e(a);a=b==a.target?null:n(b);if(a!=c){if(c){if(!(c instanceof window.ShadowRoot))throw Error("not shadow root: "+c);c.removeEventListener("focusin",l,!0);}a&&a.addEventListener("focusin",l,!0);c=a;}m(b);},!0);document.addEventListener("click",function(a){var b=e(a);k(b)&&(a.preventDefault(),a.stopPropagation());},!0);}));

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

const globalSettings = {
  prefix: 'rvt'
};

var Lie = typeof Promise === 'function' ? Promise : function (fn) {
  let queue = [], resolved = 0, value;
  fn($ => {
    value = $;
    resolved = 1;
    queue.splice(0).forEach(then);
  });
  return {then};
  function then(fn) {
    return (resolved ? setTimeout(fn, 0, value) : queue.push(fn)), this;
  }
};

const TRUE = true, FALSE = false;
const QSA$1 = 'querySelectorAll';

function add(node) {
  this.observe(node, {subtree: TRUE, childList: TRUE});
}

/**
 * Start observing a generic document or root element.
 * @param {Function} callback triggered per each dis/connected node
 * @param {Element?} root by default, the global document to observe
 * @param {Function?} MO by default, the global MutationObserver
 * @returns {MutationObserver}
 */
const notify = (callback, root, MO) => {
  const loop = (nodes, added, removed, connected, pass) => {
    for (let i = 0, {length} = nodes; i < length; i++) {
      const node = nodes[i];
      if (pass || (QSA$1 in node)) {
        if (connected) {
          if (!added.has(node)) {
            added.add(node);
            removed.delete(node);
            callback(node, connected);
          }
        }
        else if (!removed.has(node)) {
          removed.add(node);
          added.delete(node);
          callback(node, connected);
        }
        if (!pass)
          loop(node[QSA$1]('*'), added, removed, connected, TRUE);
      }
    }
  };

  const observer = new (MO || MutationObserver)(records => {
    for (let
      added = new Set,
      removed = new Set,
      i = 0, {length} = records;
      i < length; i++
    ) {
      const {addedNodes, removedNodes} = records[i];
      loop(removedNodes, added, removed, FALSE, FALSE);
      loop(addedNodes, added, removed, TRUE, FALSE);
    }
  });

  observer.add = add;
  observer.add(root || document);

  return observer;
};

const QSA = 'querySelectorAll';

const {document: document$1, Element: Element$1, MutationObserver: MutationObserver$1, Set: Set$1, WeakMap: WeakMap$1} = self;

const elements = element => QSA in element;
const {filter} = [];

var QSAO = options => {
  const live = new WeakMap$1;
  const drop = elements => {
    for (let i = 0, {length} = elements; i < length; i++)
      live.delete(elements[i]);
  };
  const flush = () => {
    const records = observer.takeRecords();
    for (let i = 0, {length} = records; i < length; i++) {
      parse(filter.call(records[i].removedNodes, elements), false);
      parse(filter.call(records[i].addedNodes, elements), true);
    }
  };
  const matches = element => (
    element.matches ||
    element.webkitMatchesSelector ||
    element.msMatchesSelector
  );
  const notifier = (element, connected) => {
    let selectors;
    if (connected) {
      for (let q, m = matches(element), i = 0, {length} = query; i < length; i++) {
        if (m.call(element, q = query[i])) {
          if (!live.has(element))
            live.set(element, new Set$1);
          selectors = live.get(element);
          if (!selectors.has(q)) {
            selectors.add(q);
            options.handle(element, connected, q);
          }
        }
      }
    }
    else if (live.has(element)) {
      selectors = live.get(element);
      live.delete(element);
      selectors.forEach(q => {
        options.handle(element, connected, q);
      });
    }
  };
  const parse = (elements, connected = true) => {
    for (let i = 0, {length} = elements; i < length; i++)
      notifier(elements[i], connected);
  };
  const {query} = options;
  const root = options.root || document$1;
  const observer = notify(notifier, root, MutationObserver$1);
  const {attachShadow} = Element$1.prototype;
  if (attachShadow)
    Element$1.prototype.attachShadow = function (init) {
      const shadowRoot = attachShadow.call(this, init);
      observer.add(shadowRoot);
      return shadowRoot;
    };
  if (query.length)
    parse(root[QSA](query));
  return {drop, flush, observer, parse};
};

const {create, keys} = Object;

const attributes = new WeakMap;
const lazy = new Set;

const query = [];
const config = {};
const defined = {};

const attributeChangedCallback = (records, o) => {
  for (let h = attributes.get(o), i = 0, {length} = records; i < length; i++) {
    const {target, attributeName, oldValue} = records[i];
    const newValue = target.getAttribute(attributeName);
    h.attributeChanged(attributeName, oldValue, newValue);
  }
};

const set = (value, m, l, o) => {
  const handler = create(o, {element: {enumerable: true, value}});
  for (let i = 0, {length} = l; i < length; i++)
    value.addEventListener(l[i].t, handler, l[i].o);
  m.set(value, handler);
  if (handler.init)
    handler.init();
  const {observedAttributes} = o;
  if (observedAttributes) {
    const mo = new MutationObserver(attributeChangedCallback);
    mo.observe(value, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes.map(attributeName => {
        if (value.hasAttribute(attributeName))
          handler.attributeChanged(
            attributeName,
            null,
            value.getAttribute(attributeName)
          );
        return attributeName;
      })
    });
    attributes.set(mo, handler);
  }
  return handler;
};

const {drop, flush, parse} = QSAO({
  query,
  handle(element, connected, selector) {
    const {m, l, o} = config[selector];
    const handler = m.get(element) || set(element, m, l, o);
    const method = connected ? 'connected' : 'disconnected';
    if (method in handler)
      handler[method]();
  }
});

const define = (selector, definition) => {
  if (-1 < query.indexOf(selector))
    throw new Error('duplicated: ' + selector);
  flush();
  const listeners = [];
  const retype = create(null);
  for (let k = keys(definition), i = 0, {length} = k; i < length; i++) {
    const key = k[i];
    if (/^on/.test(key) && !/Options$/.test(key)) {
      const options = definition[key + 'Options'] || false;
      const lower = key.toLowerCase();
      let type = lower.slice(2);
      listeners.push({t: type, o: options});
      retype[type] = key;
      if (lower !== key) {
        type = key.slice(2, 3).toLowerCase() + key.slice(3);
        retype[type] = key;
        listeners.push({t: type, o: options});
      }
    }
  }
  if (listeners.length) {
    definition.handleEvent = function (event) {
      this[retype[event.type]](event);
    };
  }
  query.push(selector);
  config[selector] = {m: new WeakMap, l: listeners, o: definition};
  parse(document.querySelectorAll(selector));
  whenDefined(selector);
  if (!lazy.has(selector))
    defined[selector]._();
};

const whenDefined = selector => {
  if (!(selector in defined)) {
    let _, $ = new Lie($ => { _ = $; });
    defined[selector] = {_, $};
  }
  return defined[selector].$;
};

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * Abstract base class from which all Rivet component classes are derived.
 *****************************************************************************/

class Component {

  /****************************************************************************
   * Initializes all current and future instances of the component that are
   * added to the DOM.
   *
   * @static
   ***************************************************************************/

  static initAll () {
    this.init(this.selector);
  }

  /****************************************************************************
   * Initializes a specific component instance with the given selector.
   *
   * @static
   * @param {string} selector - CSS selector of component to initialize
   * @returns {HTMLElement} The initialized component
   ***************************************************************************/

  static init (selector) {
    define(selector, this.methods);

    return document.querySelector(selector)
  }

  /****************************************************************************
   * Gets the component's CSS selector.
   *
   * @abstract
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    /* Virtual, must be implemented by subclass. */
  }

  /****************************************************************************
   * Gets the component's methods.
   *
   * @abstract
   * @static
   * @returns {Object} The component's methods
   ***************************************************************************/

  static get methods () {
    /* Virtual, must be implemented by subclass. */
  }

  /****************************************************************************
   * Binds the given method to the component DOM element.
   *
   * @static
   * @param {Component} self - Component instance
   * @param {string} name - Method name
   * @param {Function} method - Method to bind
   ***************************************************************************/

  static bindMethodToDOMElement (self, name, method) {
    Object.defineProperty(self.element, name, {
      value: method.bind(self),
      writable: false
    });
  }

  /****************************************************************************
   * Dispatches a custom browser event.
   *
   * @static
   * @param {string} eventName - Event name
   * @param {HTMLElement} element - Event target
   * @param {Object?} detail - Optional event details
   * @returns {boolean} Event success or failure
   ***************************************************************************/

  static dispatchCustomEvent (eventName, element, detail = {}) {
    const prefix = globalSettings.prefix;
    const event = new CustomEvent(`${prefix}${eventName}`, {
      bubbles: true,
      cancelable: true,
      detail
    });

    return element.dispatchEvent(event)
  }

  /****************************************************************************
   * Dispatches a "component added" browser event.
   *
   * @static
   * @param {HTMLElement} element - New component DOM element
   * @returns {boolean} Event success or failure
   ***************************************************************************/

  static dispatchComponentAddedEvent (element) {
    return this.dispatchCustomEvent('ComponentAdded', document, {
      component: element
    })
  }

  /****************************************************************************
   * Dispatches a "component removed" browser event.
   *
   * @static
   * @param {HTMLElement} element - Removed component DOM element
   * @returns {boolean} Event success or failure
   ***************************************************************************/

  static dispatchComponentRemovedEvent (element) {
    return this.dispatchCustomEvent('ComponentRemoved', document, {
      component: element
    })
  }

  /****************************************************************************
   * Watches the component's DOM and updates references to child elements
   * if the DOM changes. Accepts an optional callback to perform additional
   * updates to the component on DOM change.
   *
   * @static
   * @param {Object} self - Component instance
   * @param {Function} callback - Optional callback
   ***************************************************************************/

  static watchForDOMChanges (self, callback = null) {
    self.observer = new MutationObserver((mutationList, observer) => {
      self._initElements();

      if (callback) {
        callback();
      }
    });

    self.observer.observe(self.element, { childList: true, subtree: true });
  }

  /****************************************************************************
   * Stop watching the component's DOM for changes.
   *
   * @static
   * @param {Object} self - Component instance
   ***************************************************************************/

  static stopWatchingForDOMChanges (self) {
    self.observer.disconnect();
  }

  /****************************************************************************
   * Generates a random unique ID for a component's data attributes. Rivet
   * components and their child elements are automatically assigned IDs if the
   * developer does not manually specify one in the markup.
   *
   * @static
   * @returns {string} Unique ID
   ***************************************************************************/

  static generateUniqueId () {
    return globalSettings.prefix + '-' + Math.random().toString(20).substr(2, 12)
  }

  /****************************************************************************
   * Sets the given element attribute if no value was already specified in the
   * component's markup.
   *
   * @static
   * @param {HTMLElement} element - Element to set attribute on
   * @param {string} attribute - Attribute name
   * @param {string} value - Attribute value
   ***************************************************************************/

  static setAttributeIfNotSpecified (element, attribute, value) {
    const existingValue = element.getAttribute(attribute);

    if (!existingValue) {
      element.setAttribute(attribute, value);
    }
  }

}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

const keyCodes = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  tab: 9,
  enter: 13,
  escape: 27,
  home: 36,
  end: 35,
  pageUp: 33,
  pageDown: 34
};

/******************************************************************************
 * Copyright (C) 2024 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

const SUPPRESS_EVENT = true;

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The accordion component can be used to group content into sections that can
 * be opened and closed.
 *
 * @see https://rivet.iu.edu/components/accordion/
 *****************************************************************************/

class Accordion extends Component {

  /****************************************************************************
   * Gets the accordion's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-accordion]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the accordion.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initAttributes();
        this._setInitialPanelStates();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },

      /************************************************************************
       * Initializes accordion child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.triggerAttribute = 'data-rvt-accordion-trigger';
        this.panelAttribute = 'data-rvt-accordion-panel';

        this.triggerSelector = `[${this.triggerAttribute}]`;
        this.panelSelector = `[${this.panelAttribute}]`;
      },

      /************************************************************************
       * Initializes accordion child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.triggers = Array.from(
          this.element.querySelectorAll(this.triggerSelector)
        );

        this.panels = Array.from(
          this.element.querySelectorAll(this.panelSelector)
        );
      },

      /************************************************************************
       * Initializes accordion attributes.
       *
       * @private
       ***********************************************************************/

      _initAttributes () {
        this._assignComponentElementIds();
        this._setTriggerButtonTypeAttributes();
      },

      /************************************************************************
       * Assigns random IDs to the accordion component's child elements if
       * IDs were not already specified in the markup.
       *
       * @private
       ***********************************************************************/

      _assignComponentElementIds () {
        this._assignTriggerIds();
        this._assignPanelIds();
      },

      /************************************************************************
       * Assigns a random ID to each trigger.
       *
       * @private
       ***********************************************************************/

      _assignTriggerIds () {
        this.triggers.forEach(trigger => {
          const id = Component.generateUniqueId();

          Component.setAttributeIfNotSpecified(trigger, this.triggerAttribute, id);
          Component.setAttributeIfNotSpecified(trigger, 'id', `${id}-label`);
        });
      },

      /************************************************************************
       * Assigns a random ID to each panel.
       *
       * @private
       ***********************************************************************/

      _assignPanelIds () {
        const numPanels = this.panels.length;

        for (let i = 0; i < numPanels; i++) {
          const trigger = this.triggers[i];
          const panel = this.panels[i];
          const panelId = trigger.getAttribute(this.triggerAttribute);

          Component.setAttributeIfNotSpecified(panel, this.panelAttribute, panelId);
          Component.setAttributeIfNotSpecified(panel, 'id', panelId);
          Component.setAttributeIfNotSpecified(panel, 'aria-labelledby', `${panelId}-label`);
        }
      },

      /************************************************************************
       * Adds `type="button"` to each trigger's button element.
       *
       * @private
       ***********************************************************************/

      _setTriggerButtonTypeAttributes () {
        this.triggers.forEach(trigger => {
          Component.setAttributeIfNotSpecified(trigger, 'type', 'button');
        });
      },

      /************************************************************************
       * Sets the initial state of the accordion's panels.
       *
       * @private
       ***********************************************************************/

      _setInitialPanelStates () {
        this._shouldOpenAllPanels()
          ? this._openAllPanels()
          : this._setPanelDefaultStates();
      },

      /************************************************************************
       * Returns true if all panels should be opened when the component is
       * added to the DOM.
       *
       * @private
       * @returns {boolean} Panels should be opened
       ***********************************************************************/

      _shouldOpenAllPanels () {
        return this.element.hasAttribute('data-rvt-accordion-open-all')
      },

      /************************************************************************
       * Opens all panels.
       *
       * @private
       ***********************************************************************/

      _openAllPanels () {
        this.panels.forEach(panel => {
          this.open(panel.getAttribute(this.panelAttribute), SUPPRESS_EVENT);
        });
      },

      /************************************************************************
       * Sets the default open/closed state for each panel based on the ARIA
       * attributes set by the developer.
       *
       * @private
       ***********************************************************************/

      _setPanelDefaultStates () {
        this.panels.forEach(panel => {
          this._panelShouldBeOpen(panel)
            ? this.open(panel.getAttribute(this.panelAttribute), SUPPRESS_EVENT)
            : this.close(panel.getAttribute(this.panelAttribute), SUPPRESS_EVENT);
        });
      },

      /************************************************************************
       * Returns true if the given panel element should be opened on page load.
       *
       * @private
       * @param {HTMLElement} panel - Panel DOM element
       * @returns {boolean} Panel should be opened
       ***********************************************************************/

      _panelShouldBeOpen (panel) {
        return panel.hasAttribute('data-rvt-accordion-panel-init')
      },

      /************************************************************************
       * Called when the accordion is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);
      },

      /************************************************************************
       * Called when the accordion is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);
      },

      /************************************************************************
       * Handles click events broadcast to the accordion.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (!this._eventOriginatedInsideTrigger(event)) { return }

        this._setTriggerToToggle(event);

        this._triggerToToggleIsOpen()
          ? this.close(this.triggerToToggleId)
          : this.open(this.triggerToToggleId);
      },

      /************************************************************************
       * Returns true if the given event originated inside one of the
       * accordion's panel triggers.
       *
       * @private
       * @param {Event} event - Event
       * @returns {boolean} Event originated inside panel trigger
       ***********************************************************************/

      _eventOriginatedInsideTrigger (event) {
        return event.target.closest(this.triggerSelector)
      },

      /************************************************************************
       * Sets references to the panel trigger to be toggled by the given click
       * event. These references are used by other click handler submethods.
       *
       * @private
       * @param {Event} event - Click event
       ***********************************************************************/

      _setTriggerToToggle (event) {
        this.triggerToToggle = event.target.closest(this.triggerSelector);
        this.triggerToToggleId = this.triggerToToggle.getAttribute(this.triggerAttribute);
      },

      /************************************************************************
       * Returns true if the panel trigger to toggle is already open.
       *
       * @private
       * @returns {boolean} Click originated inside panel trigger
       ***********************************************************************/

      _triggerToToggleIsOpen () {
        return this.triggerToToggle.getAttribute('aria-expanded') === 'true'
      },

      /************************************************************************
       * Handles keydown events broadcast to the accordion.
       *
       * @param {Event} event - Keydown event
       ***********************************************************************/

      onKeydown (event) {
        if (!this._eventOriginatedInsideTrigger(event)) { return }

        this._setNeighboringTriggerIndexes(event);

        switch (event.keyCode) {
          case keyCodes.up:
            event.preventDefault();
            this._focusPreviousTrigger();
            break

          case keyCodes.down:
            event.preventDefault();
            this._focusNextTrigger();
            break

          case keyCodes.home:
            this._focusFirstTrigger();
            break

          case keyCodes.end:
            this._focusLastTrigger();
            break
        }
      },

      /************************************************************************
       * Sets the indexes of the panel trigger before and after the one from
       * which the given keydown event originated. Used to determine which
       * panel trigger should receive focus when the up and down arrow keys
       * are pressed.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _setNeighboringTriggerIndexes (event) {
        const currentTrigger = event.target.closest(this.triggerSelector);

        this.previousTriggerIndex = this.triggers.indexOf(currentTrigger) - 1;
        this.nextTriggerIndex = this.triggers.indexOf(currentTrigger) + 1;
      },

      /************************************************************************
       * Moves focus to the panel trigger before the one that currently has
       * focus. If focus is currently on the first trigger, move focus to the
       * last trigger.
       *
       * @private
       ***********************************************************************/

      _focusPreviousTrigger () {
        this.triggers[this.previousTriggerIndex]
          ? this.triggers[this.previousTriggerIndex].focus()
          : this.triggers[this.triggers.length - 1].focus();
      },

      /************************************************************************
       * Moves focus to the panel trigger after the one that currently has
       * focus. If focus is currently on the last trigger, move focus to the
       * first trigger.
       *
       * @private
       ***********************************************************************/

      _focusNextTrigger () {
        this.triggers[this.nextTriggerIndex]
          ? this.triggers[this.nextTriggerIndex].focus()
          : this.triggers[0].focus();
      },

      /************************************************************************
       * Moves focus to the first panel trigger.
       *
       * @private
       ***********************************************************************/

      _focusFirstTrigger () {
        this.triggers[0].focus();
      },

      /************************************************************************
       * Moves focus to the last panel trigger.
       *
       * @private
       ***********************************************************************/

      _focusLastTrigger () {
        this.triggers[this.triggers.length - 1].focus();
      },

      /************************************************************************
       * Opens the panel with the given data-rvt-accordion-panel ID value.
       *
       * @param {string} childMenuId - Panel ID
       * @param {boolean} suppressEvent - Suppress open event
       ***********************************************************************/

      open (panelId, suppressEvent = false) {
        this._setPanelToOpen(panelId);

        if (!this._panelToOpenExists()) {
          console.warn(`No such accordion panel '${panelId}' in open()`);
          return
        }

        if (!suppressEvent)
          if (!this._eventDispatched('AccordionOpened', this.panelToOpen)) { return }

        this._openPanel();
      },

      /************************************************************************
       * Sets references to the panel to be opened. These references are used
       * by other submethods.
       *
       * @private
       * @param {string} panelId - Panel ID
       ***********************************************************************/

      _setPanelToOpen (panelId) {
        this.triggerToOpen = this.element.querySelector(
          `[${this.triggerAttribute} = "${panelId}"]`
        );

        this.panelToOpen = this.element.querySelector(
          `[${this.panelAttribute} = "${panelId}"]`
        );
      },

      /************************************************************************
       * Returns true if the panel to open actually exists in the DOM.
       *
       * @private
       * @returns {boolean} Panel to open exists
       ***********************************************************************/

      _panelToOpenExists () {
        return this.panelToOpen
      },

      /************************************************************************
       * Expands the accordion panel to be opened.
       *
       * @private
       ***********************************************************************/

      _openPanel () {
        this.triggerToOpen.setAttribute('aria-expanded', 'true');
        this.panelToOpen.removeAttribute('hidden');
      },

      /************************************************************************
       * Closes the panel with the given data-rvt-accordion-panel ID value.
       *
       * @param {string} childMenuId - Panel ID
       * @param {boolean} suppressEvent - Suppress close event
       ***********************************************************************/

      close (panelId, suppressEvent = false) {
        this._setPanelToClose(panelId);

        if (!this._panelToCloseExists()) {
          console.warn(`No such accordion panel '${panelId}' in close()`);
          return
        }
        
        if (!suppressEvent)
          if (!this._eventDispatched('AccordionClosed', this.panelToClose)) { return }

        this._closePanel();
      },

      /************************************************************************
       * Sets references to the panel to be closed. These references are used
       * by other submethods.
       *
       * @private
       * @param {string} panelId - Panel ID
       ***********************************************************************/

      _setPanelToClose (panelId) {
        this.triggerToClose = this.element.querySelector(
          `[${this.triggerAttribute} = "${panelId}"]`
        );

        this.panelToClose = this.element.querySelector(
          `[${this.panelAttribute} = "${panelId}"]`
        );
      },

      /************************************************************************
       * Returns true if the panel to close actually exists in the DOM.
       *
       * @private
       * @returns {boolean} Panel to close exists
       ***********************************************************************/

      _panelToCloseExists () {
        return this.panelToClose
      },

      /************************************************************************
       * Collapses the accordion panel to be closed.
       *
       * @private
       ***********************************************************************/

      _closePanel () {
        this.triggerToClose.setAttribute('aria-expanded', 'false');
        this.panelToClose.setAttribute('hidden', '');
      },

      /************************************************************************
       * Returns true if the custom event with the given name was successfully
       * dispatched.
       *
       * @private
       * @param {string} name - Event name
       * @param {HTMLElement} panel - Panel DOM element toggled by event
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _eventDispatched (name, panel) {
        const dispatched = Component.dispatchCustomEvent(
          name,
          this.element,
          { panel }
        );

        return dispatched
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The alert component displays brief important messages to the user like
 * errors or action confirmations.
 *
 * @see https://rivet.iu.edu/components/alert/
 *****************************************************************************/

class Alert extends Component {

  /****************************************************************************
   * Gets the alert's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-alert]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the alert.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();

        Component.bindMethodToDOMElement(this, 'dismiss', this.dismiss);
      },

      /************************************************************************
       * Initializes alert child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.closeButtonAttribute = 'data-rvt-alert-close';

        this.closeButtonSelector = `[${this.closeButtonAttribute}]`;
      },

      /************************************************************************
       * Initializes alert child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.closeButton = this.element.querySelector(this.closeButtonSelector);
      },

      /************************************************************************
       * Called when the alert is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
      },

      /************************************************************************
       * Called when the alert is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
      },

      /************************************************************************
       * Handles click events broadcast to the alert.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (this._clickOriginatedInsideCloseButton(event)) { this.dismiss(); }
      },

      /************************************************************************
       * Returns true if the given click event originated inside the
       * alert's close button.
       *
       * @private
       * @param {Event} event - Click event
       * @returns {boolean} Click originated inside content area
       ***********************************************************************/

      _clickOriginatedInsideCloseButton (event) {
        return this.closeButton && this.closeButton.contains(event.target)
      },

      /************************************************************************
       * Dismisses the alert.
       ***********************************************************************/

      dismiss () {
        if (!this._dismissEventDispatched()) { return }

        this.element.remove();
      },

      /************************************************************************
       * Returns true if the custom "dismiss" event was successfully
       * dispatched.
       *
       * @private
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _dismissEventDispatched () {
        const dispatched = Component.dispatchCustomEvent(
          'AlertDismissed',
          this.element
        );

        return dispatched
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The dialog component can be used to present content in a smaller window that
 * is displayed on top of the main application or site content.
 *
 * @see https://rivet.iu.edu/components/dialog/
 *****************************************************************************/

class Dialog extends Component {

  /****************************************************************************
   * Gets the dialog's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-dialog]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the dialog.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
        this._initAttributes();
        this._makeDialogFirstElementInBody();
        this._bindExternalEventHandlers();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
        Component.bindMethodToDOMElement(this, 'focusTrigger', this.focusTrigger);
        Component.bindMethodToDOMElement(this, 'focusDialog', this.focusDialog);
      },

      /************************************************************************
       * Initializes dialog child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.dialogAttribute = 'data-rvt-dialog';
        this.mountElementAttribute = 'data-rvt-dialog-mount';
        this.triggerAttribute = 'data-rvt-dialog-trigger';
        this.closeButtonAttribute = 'data-rvt-dialog-close';
        this.modalAttribute = 'data-rvt-dialog-modal';
        this.disablePageInteractionAttribute = 'data-rvt-dialog-disable-page-interaction';

        this.mountElementSelector = `[${this.mountElementAttribute}]`;
        this.triggerSelector = `[${this.triggerAttribute}]`;
        this.closeButtonSelector = `[${this.closeButtonAttribute}]`;
      },

      /************************************************************************
       * Initializes dialog child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        const dialogId = this.element.getAttribute(this.dialogAttribute);
        const mountElement = document.querySelector(this.mountElementSelector);

        this.mountElement = mountElement ?? document.body;

        // Trigger buttons are outside the actual dialog element (this.element)
        // and more than one dialog might be on a page. For this reason, the
        // selector checks that the trigger attribute value matches the dialog's
        // ID to ensure a trigger is associated with this dialog instance.
        // Otherwise, trigger buttons associated with other dialogs would be
        // mistakenly associated with the current dialog instance and included
        // in this.triggerButtons.

        this.triggerButtons = Array.from(
          document.querySelectorAll(`[${this.triggerAttribute} = "${dialogId}"]`)
        );

        this.closeButtons = Array.from(
          this.element.querySelectorAll(this.closeButtonSelector)
        );

        this.lastClickedTriggerButton = null;
      },

      /************************************************************************
       * Initializes dialog state properties.
       *
       * @private
       ***********************************************************************/

      _initProperties () {
        this.id = this.element.getAttribute('id');
        this.isOpen = false;
        this.isModal = this.element.hasAttribute(this.modalAttribute);
      },

      /************************************************************************
       * Initializes dialog attributes.
       *
       * @private
       ***********************************************************************/

      _initAttributes () {
        if (this.isModal) {
          this.element.setAttribute('aria-modal', 'true');
        }
      },

      /************************************************************************
       * Rearranges the DOM so that the dialog becomes the first element in
       * the document body (or app container div in the case of a frontend
       * framework like React). This rearrangement of the DOM is required for
       * accessibility reasons.
       *
       * @private
       ***********************************************************************/

      _makeDialogFirstElementInBody () {
        this.mountElement.insertBefore(
          this.element,
          this.mountElement.firstElementChild
        );
      },

      /************************************************************************
       * Binds the dialog instance to handler methods for relevant events that
       * originate outside the component's root DOM element.
       *
       * @private
       ***********************************************************************/

      _bindExternalEventHandlers () {
        this._onTriggerClick = this._onTriggerClick.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
      },

      /************************************************************************
       * Called when the dialog is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);

        this._addTriggerEventHandlers();
        this._addDocumentEventHandlers();

        if (this._shouldBeOpenByDefault()) { this.open(); }
      },

      /************************************************************************
       * Returns true if the dialog should be open on page load.
       *
       * @private
       * @returns {boolean} Dialog should be open
       ***********************************************************************/

      _shouldBeOpenByDefault () {
        return this.element.hasAttribute('data-rvt-dialog-open-on-init')
      },

      /************************************************************************
       * Adds event handlers for the trigger button. The trigger button event
       * handlers must be set manually rather than using onClick because the
       * trigger button exists outside the dialog component's root DOM element.
       *
       * @private
       ***********************************************************************/

      _addTriggerEventHandlers () {
        if (!this._hasTriggerButton()) { return }

        this.triggerButtons.forEach(button => {
          button.addEventListener('click', this._onTriggerClick, false);
        });
      },

      /************************************************************************
       * Returns true if the dialog has an associated trigger button.
       *
       * @private
       * @returns {boolean} Dialog has trigger button
       ***********************************************************************/

      _hasTriggerButton () {
        return this.triggerButtons.length
      },

      /************************************************************************
       * Adds event handlers to the document that are related to the dialog.
       *
       * @private
       ***********************************************************************/

      _addDocumentEventHandlers () {
        document.addEventListener('click', this._onDocumentClick, false);
      },

      /************************************************************************
       * Called when the dialog is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);

        this._removeTriggerEventHandlers();
        this._removeDocumentEventHandlers();
      },

      /************************************************************************
       * Removes trigger button event handlers.
       *
       * @private
       ***********************************************************************/

      _removeTriggerEventHandlers () {
        if (!this._hasTriggerButton()) { return }

        this.triggerButtons.forEach(button => {
          button.removeEventListener('click', this._onTriggerClick, false);
        });
      },

      /************************************************************************
       * Removes document event handlers related to the dialog.
       *
       * @private
       ***********************************************************************/

      _removeDocumentEventHandlers () {
        document.removeEventListener('click', this._onDocumentClick, false);
      },

      /************************************************************************
       * Handles click events broadcast to the dialog. For click events related
       * to the trigger button and document, see the _onTriggerClick() and
       * _onDocumentClick() methods, respectively.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (!this._isOpen()) { return }

        if (!this._clickOriginatedInCloseButton(event)) { return }

        this.close();
      },

      /************************************************************************
       * Returns true if the dialog is open.
       *
       * @private
       * @returns {boolean} Dialog is open
       ***********************************************************************/

      _isOpen () {
        return this.isOpen
      },

      /************************************************************************
       * Returns true if the given click event originated inside one of the
       * dialog's "close" buttons.
       *
       * @private
       * @param {Event} event - Click event
       * @returns {boolean} Click originated inside close button
       ***********************************************************************/

      _clickOriginatedInCloseButton (event) {
        return event.target.closest(this.closeButtonSelector)
      },

      /************************************************************************
       * Handles click events broadcast to the dialog's trigger button.
       *
       * @private
       * @param {Event} event - Click event
       ***********************************************************************/

      _onTriggerClick (event) {
        this._setLastClickedTriggerButton(event);

        this._isOpen()
          ? this.close()
          : this.open();
      },

      /************************************************************************
       * Saves a reference to the last clicked trigger button.
       *
       * @private
       * @param {Event} event - Trigger button click event
       ***********************************************************************/

      _setLastClickedTriggerButton (event) {
        this.lastClickedTriggerButton = event.target.closest(this.triggerSelector);
      },

      /************************************************************************
       * Handles click events broadcast to the document that are related to
       * the dialog but did not originate inside the dialog itself.
       *
       * @private
       * @param {Event} event - Click event
       ***********************************************************************/

      _onDocumentClick (event) {
        if (this._clickOriginatedInsideDialogOrTrigger(event)) { return }

        if (!this._isOpen()) { return }

        if (this._shouldCloseOnClickOutside()) { return }

        this.close();
      },

      /************************************************************************
       * Returns true if the given click event originated inside the dialog or
       * dialog trigger button.
       *
       * @private
       * @param {Event} event - Click event
       * @returns {boolean} Click originated inside dialog or trigger button
       ***********************************************************************/

      _clickOriginatedInsideDialogOrTrigger (event) {

        // This method uses event.composedPath().some() to walk up the DOM tree
        // to determine if the event target was within the dialog instead of
        // this.element.contains(). It does so to prevent this method from
        // returning a false negative if a click event originating inside
        // the dialog removed its target from the DOM.

        return event.target.closest(this.triggerSelector) ||
               event.composedPath().some(el => el.dataset && 'rvtDialog' in el.dataset)
      },

      /************************************************************************
       * Returns true if the dialog should close if the user clicks outside
       * of the dialog.
       *
       * @private
       * @returns {boolean} Dialog should close on click outside
       ***********************************************************************/

      _shouldCloseOnClickOutside () {
        return !this.isModal
      },

      /************************************************************************
       * Handles keydown events broadcast to the dialog.
       *
       * @param {Event} event - Keydown event
       ***********************************************************************/

      onKeydown (event) {
        switch (event.keyCode) {
          case keyCodes.tab:
            this._setFocusableChildElements();
            this._shiftKeyPressed(event)
              ? this._handleBackwardTab(event)
              : this._handleForwardTab(event);
            break

          case keyCodes.escape:
            if (!this._shouldCloseOnClickOutside()) { this.close(); }
            break
        }
      },

      /************************************************************************
       * Sets the dialog's list of focusable child elements.
       *
       * @private
       ***********************************************************************/

      _setFocusableChildElements () {
        this.focusableChildElements = this.element.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="-1"]'
        );

        this.firstFocusableChildElement = this.focusableChildElements[0];
        this.lastFocusableChildElement = this.focusableChildElements[this.focusableChildElements.length - 1];
      },

      /************************************************************************
       * Returns true if Shift was held during the given keydown event.
       *
       * @private
       * @param {Event} event - Keydown event
       * @returns {boolean} Shift key pressed
       ***********************************************************************/

      _shiftKeyPressed (event) {
        return event.shiftKey
      },

      /************************************************************************
       * Handles the user tabbing backward through the dialog, trapping focus
       * within the dialog if necessary.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _handleBackwardTab (event) {
        if (this._shouldTrapBackwardTabFocus()) {
          event.preventDefault();
          this.lastFocusableChildElement.focus();
        }
      },

      /************************************************************************
       * Returns true if focus should be trapped to prevent the user from
       * tabbing backward out of the dialog.
       *
       * @private
       * @returns {boolean} Should trap backward tab focus
       ***********************************************************************/

      _shouldTrapBackwardTabFocus () {
        return document.activeElement === this.firstFocusableChildElement ||
               document.activeElement === this.element
      },

      /************************************************************************
       * Handles the user tabbing forward through the dialog, trapping focus
       * within the dialog if necessary.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _handleForwardTab (event) {
        if (this._shouldTrapForwardTabFocus()) {
          event.preventDefault();

          this.firstFocusableChildElement.focus();
        }
      },

      /************************************************************************
       * Returns true if focus should be trapped to prevent the user from
       * tabbing forward out of the dialog.
       *
       * @private
       * @returns {boolean} Dialog is dialog
       ***********************************************************************/

      _shouldTrapForwardTabFocus () {
        return document.activeElement === this.lastFocusableChildElement
      },

      /************************************************************************
       * Opens the dialog.
       * 
       * @param {boolean} suppressEvent - Suppress open event
       ***********************************************************************/

      open (suppressEvent = false) {
        if (this._isOpen()) { return }

        if (!suppressEvent)
          if (!this._eventDispatched('DialogOpened')) { return }

        this._setOpenState();
        this.focusDialog();

        if (this._shouldDisablePageInteraction()) {
          this._disablePageInteraction();
        }
      },

      /************************************************************************
       * Sets the dialog's state properties to represent it being open.
       *
       * @private
       ***********************************************************************/

      _setOpenState () {
        this.isOpen = true;
        this.element.removeAttribute('hidden');

        if (this.isModal) {
          document.body.classList.add('rvt-dialog-prevent-scroll');
        }
      },

      /************************************************************************
       * Moves focus to the dialog.
       ***********************************************************************/

      focusDialog () {
        this.element.focus();
      },

      /************************************************************************
       * Returns true if interaction should be disabled for page elements
       * behind the dialog.
       *
       * @private
       * @returns {boolean} Should disable page interaction
       ***********************************************************************/

      _shouldDisablePageInteraction () {
        return this.element.hasAttribute(this.disablePageInteractionAttribute)
      },

      /************************************************************************
       * Disables interaction with page elements behind the dialog.
       *
       * @private
       ***********************************************************************/

      _disablePageInteraction () {
        this._getDirectChildrenOfBodyExceptDialog().forEach(child => {
          child.setAttribute('inert', '');
          child.setAttribute('aria-hidden', 'true');
        });
      },

      /************************************************************************
       * Returns an array of all current direct children of the document body
       * (or app container in the case of a frontend framework like React)
       * except for the dialog itself.
       *
       * @private
       * @returns {HTMLElement[]} Direct children of body
       ***********************************************************************/

      _getDirectChildrenOfBodyExceptDialog () {
        const directChildrenOfBody = Array.from(this.mountElement.children);

        return directChildrenOfBody.filter(el => !el.hasAttribute(this.dialogAttribute))
      },

      /************************************************************************
       * Closes the dialog.
       * 
       * @param {boolean} suppressEvent - Suppress close event
       ***********************************************************************/

      close (suppressEvent = false) {
        if (!this._isOpen()) { return }

        if (!suppressEvent)
          if (!this._eventDispatched('DialogClosed')) { return }

        this._setClosedState();

        if (this._shouldDisablePageInteraction()) {
          this._enablePageInteraction();
        }

        if (this._hasTriggerButton()) {
          this.focusTrigger();
        }
      },

      /************************************************************************
       * Sets the dialog's state properties to represent it being closed.
       *
       * @private
       ***********************************************************************/

      _setClosedState () {
        this.isOpen = false;
        this.element.setAttribute('hidden', '');
        document.body.classList.remove('rvt-dialog-prevent-scroll');
      },

      /************************************************************************
       * Enables interaction with page elements behind the dialog.
       *
       * @private
       ***********************************************************************/

      _enablePageInteraction () {
        this._getDirectChildrenOfBodyExceptDialog().forEach(child => {
          child.removeAttribute('inert');
          child.removeAttribute('aria-hidden');
        });
      },

      /************************************************************************
       * Moves focus to the dialog's trigger button.
       ***********************************************************************/

      focusTrigger () {
        if (!this._hasTriggerButton()) {
          console.warn(`Could not find a trigger button for dialog ID '${this.id}'`);
          return
        }

        this.lastClickedTriggerButton && document.body.contains(this.lastClickedTriggerButton)
          ? this.lastClickedTriggerButton.focus()
          : this.triggerButtons[0].focus();
      },

      /************************************************************************
       * Returns true if the custom event with the given name was successfully
       * dispatched.
       *
       * @private
       * @param {string} name - Event name
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The disclosure component allows the user to show or hide additional content
 * about a topic.
 *
 * @see https://rivet.iu.edu/components/disclosure/
 *****************************************************************************/

class Disclosure extends Component {

  /****************************************************************************
   * Gets the disclosure's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-disclosure]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the disclosure.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
        this._setInitialDisclosureState();
        this._removeIconFromTabOrder();
        this._bindExternalEventHandlers();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },

      /************************************************************************
       * Initializes disclosure child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.toggleAttribute = 'data-rvt-disclosure-toggle';
        this.targetAttribute = 'data-rvt-disclosure-target';

        this.toggleSelector = `[${this.toggleAttribute}]`;
        this.targetSelector = `[${this.targetAttribute}]`;
      },

      /************************************************************************
       * Initializes disclosure child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.toggleElement = this.element.querySelector(this.toggleSelector);
        this.targetElement = this.element.querySelector(this.targetSelector);
      },

      /************************************************************************
       * Initializes disclosure state properties.
       *
       * @private
       ***********************************************************************/

      _initProperties () {
        this.isOpen = false;
      },

      /************************************************************************
       * Sets the initial state of the disclosure.
       *
       * @private
       ***********************************************************************/

      _setInitialDisclosureState () {
        if (this._shouldBeOpenByDefault()) { this.open(SUPPRESS_EVENT); }
      },

      /************************************************************************
       * Returns true if the disclosure should be open by default.
       *
       * @private
       ***********************************************************************/

      _shouldBeOpenByDefault () {
        return this.element.hasAttribute('data-rvt-disclosure-open-on-init')
      },

      /************************************************************************
       * Removes the arrow icon from the tab order.
       *
       * @private
       ***********************************************************************/

      _removeIconFromTabOrder () {
        const icon = this.element.querySelector('svg');

        if (icon) { icon.setAttribute('focusable', 'false'); }
      },

      /************************************************************************
       * Binds the disclosure instance to handler methods for relevant events
       * that originate outside the component's root DOM element.
       *
       * @private
       ***********************************************************************/

      _bindExternalEventHandlers () {
        this._onDocumentClick = this._onDocumentClick.bind(this);
      },

      /************************************************************************
       * Called when the disclosure is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);

        if (this._shouldAddDocumentEventHandlers()) {
          this._addDocumentEventHandlers();
        }
      },

      /************************************************************************
       * Returns true if document event handlers should be added for this
       * disclosure instance.
       *
       * @private
       * @returns {boolean} Should add external event handlers
       ***********************************************************************/

      _shouldAddDocumentEventHandlers () {
        return this.element.hasAttribute('data-rvt-close-click-outside')
      },

      /************************************************************************
       * Adds event handlers to the document that are related to the
       * disclosure.
       *
       * @private
       ***********************************************************************/

      _addDocumentEventHandlers () {
        document.addEventListener('click', this._onDocumentClick, false);
      },

      /************************************************************************
       * Called when the disclosure is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);

        this._removeDocumentEventHandlers();
      },

      /************************************************************************
       * Removes document event handlers related to the disclosure.
       *
       * @private
       ***********************************************************************/

      _removeDocumentEventHandlers () {
        document.removeEventListener('click', this._onDocumentClick, false);
      },

      /************************************************************************
       * Opens the disclosure.
       * 
       * @param {boolean} suppressEvent - Suppress open event
       ***********************************************************************/

      open (suppressEvent = false) {
        if (this._isDisabled()) { return }

        if (!suppressEvent)
          if (!this._eventDispatched('DisclosureOpened')) { return }

        this._setOpenState();
      },

      /************************************************************************
       * Returns true if the disclosure toggle is disabled.
       *
       * @private
       * @returns {boolean} Disabled state
       ***********************************************************************/

      _isDisabled () {
        return this.toggleElement.hasAttribute('disabled')
      },

      /************************************************************************
       * Sets the disclosure's state properties to represent it being open.
       *
       * @private
       ***********************************************************************/

      _setOpenState () {
        this.toggleElement.setAttribute('aria-expanded', 'true');
        this.targetElement.removeAttribute('hidden');

        this.isOpen = true;
      },

      /************************************************************************
       * Closes the disclosure.
       * 
       * @param {boolean} suppressEvent - Suppress open event
       ***********************************************************************/

      close (suppressEvent = false) {
        if (!this._isOpen()) { return }

        if (!suppressEvent)
          if (!this._eventDispatched('DisclosureClosed')) { return }

        this._setClosedState();
      },

      /************************************************************************
       * Returns true if the disclosure is open.
       *
       * @private
       * @returns {boolean} Disclosure open state
       ***********************************************************************/

      _isOpen () {
        return this.isOpen
      },

      /************************************************************************
       * Sets the disclosure's state properties to represent it being closed.
       *
       * @private
       ***********************************************************************/

      _setClosedState () {
        this.toggleElement.setAttribute('aria-expanded', 'false');
        this.targetElement.setAttribute('hidden', '');

        this.isOpen = false;
      },

      /************************************************************************
       * Returns true if the custom event with the given name was successfully
       * dispatched.
       *
       * @private
       * @param {string} name - Event name
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      },

      /************************************************************************
       * Handles click events broadcast to the disclosure.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (!this._clickOriginatedInsideDisclosureToggle(event)) { return }

        this._isOpen()
          ? this.close()
          : this.open();
      },

      /************************************************************************
       * Returns true if the given click event originated inside the
       * disclosure's toggle element.
       *
       * @private
       * @param {Event} event - Click event
       * @returns {boolean} Click originated inside toggle element
       ***********************************************************************/

      _clickOriginatedInsideDisclosureToggle (event) {
        return this.toggleElement.contains(event.target)
      },

      /************************************************************************
       * Handles click events broadcast to the document that are related to
       * the disclosure but did not originate inside the disclosure itself.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      _onDocumentClick (event) {
        if (!this._clickOriginatedOutsideDisclosure(event)) { return }

        if (!this._isOpen()) { return }

        this.close();
      },

      /************************************************************************
       * Returns true if the click event originated inside the disclosure.
       *
       * @param {Event} event - Click event
       * @returns {boolean} Event originated outside disclosure
       ***********************************************************************/

      _clickOriginatedOutsideDisclosure (event) {
        return !this.element.contains(event.target)
      },

      /************************************************************************
       * Handles keydown events broadcast to the disclosure.
       *
       * @param {Event} event - Keydown event
       ***********************************************************************/

      onKeydown (event) {
        if (event.keyCode === keyCodes.escape) {
          this.close();
          this.toggleElement.focus();
        }
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The dropdown component presents the user with a list of options that can be
 * shown or hidden with a button.
 *
 * @see https://rivet.iu.edu/components/dropdown/
 *****************************************************************************/

class Dropdown extends Component {

  /****************************************************************************
   * Gets the dropdown's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-dropdown]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the dropdown.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initAttributes();
        this._initProperties();
        this._initMenuItems();
        this._removeIconFromTabOrder();
        this._bindExternalEventHandlers();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },

      /************************************************************************
       * Initializes dropdown child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.toggleAttribute = 'data-rvt-dropdown-toggle';
        this.menuAttribute = 'data-rvt-dropdown-menu';

        this.toggleSelector = `[${this.toggleAttribute}]`;
        this.menuSelector = `[${this.menuAttribute}]`;
      },

      /************************************************************************
       * Initializes dropdown child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.toggleElement = this.element.querySelector(this.toggleSelector);
        this.menuElement = this.element.querySelector(this.menuSelector);
      },

      /************************************************************************
       * Initializes dropdown attributes.
       *
       * @private
       ***********************************************************************/

      _initAttributes () {
        this._assignComponentElementIds();
        this._setAriaAttributes();
      },

      /************************************************************************
       * Assigns a random ID to the dropdown component if an ID was not
       * already specified in the markup.
       *
       * @private
       ***********************************************************************/

      _assignComponentElementIds () {
        const id = Component.generateUniqueId();

        Component.setAttributeIfNotSpecified(this.toggleElement, this.toggleAttribute, id);
        Component.setAttributeIfNotSpecified(this.menuElement, this.menuAttribute, id);
        Component.setAttributeIfNotSpecified(this.menuElement, 'id', id);
      },

      /************************************************************************
       * Sets the dropdown component's ARIA attributes.
       *
       * @private
       ***********************************************************************/

      _setAriaAttributes () {
        this.toggleElement.setAttribute('aria-haspopup', true);
        this.toggleElement.setAttribute('aria-expanded', false);
      },

      /************************************************************************
       * Initializes dropdown state properties.
       *
       * @private
       ***********************************************************************/

      _initProperties () {
        this.isOpen = false;
      },

      /************************************************************************
       * Initializes a list of menu items in the dropdown.
       *
       * @private
       ***********************************************************************/

      _initMenuItems () {
        const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';

        this.menuItems = Array.from(this.menuElement.querySelectorAll(focusableElements));
        this.firstMenuItem = this.menuItems[0];
        this.lastMenuItem = this.menuItems[this.menuItems.length - 1];
      },

      /************************************************************************
       * Removes the arrow icon from the tab order.
       *
       * @private
       ***********************************************************************/

      _removeIconFromTabOrder () {
        const icon = this.element.querySelector('svg');

        if (icon) { icon.setAttribute('focusable', 'false'); }
      },

      /************************************************************************
       * Binds the dropdown instance to handler methods for relevant events
       * that originate outside the component's root DOM element.
       *
       * @private
       ***********************************************************************/

      _bindExternalEventHandlers () {
        this._onDocumentClick = this._onDocumentClick.bind(this);
      },

      /************************************************************************
       * Called when the dropdown is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this, () => this._initMenuItems());

        this._addDocumentEventHandlers();
      },

      /************************************************************************
       * Adds event handlers to the document that are related to the dropdown.
       *
       * @private
       ***********************************************************************/

      _addDocumentEventHandlers () {
        document.addEventListener('click', this._onDocumentClick, false);
      },

      /************************************************************************
       * Called when the dropdown is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);

        this._removeDocumentEventHandlers();
      },

      /************************************************************************
       * Removes document event handlers related to the dropdown.
       *
       * @private
       ***********************************************************************/

      _removeDocumentEventHandlers () {
        document.removeEventListener('click', this._onDocumentClick, false);
      },

      /************************************************************************
       * Opens the dropdown.
       ***********************************************************************/

      open () {
        if (this._toggleElementIsDisabled()) { return }

        if (!this._eventDispatched('DropdownOpened')) { return }

        this._setOpenState();
      },

      /************************************************************************
       * Returns true if the dropdown is disabled.
       *
       * @private
       * @returns {boolean} Disabled state
       ***********************************************************************/

      _toggleElementIsDisabled () {
        return this.toggleElement.hasAttribute('disabled')
      },

      /************************************************************************
       * Sets the dropdown's state properties to represent it being open.
       *
       * @private
       ***********************************************************************/

      _setOpenState () {
        this.toggleElement.setAttribute('aria-expanded', 'true');
        this.menuElement.removeAttribute('hidden');
        this.firstMenuItem.focus();

        this.isOpen = true;
      },

      /************************************************************************
       * Closes the dropdown.
       ***********************************************************************/

      close () {
        if (!this._isOpen()) { return }

        if (!this._eventDispatched('DropdownClosed')) { return }

        this._setClosedState();
      },

      /************************************************************************
       * Returns true if the dropdown is open.
       *
       * @private
       * @returns {boolean} Dropdown is open
       ***********************************************************************/

      _isOpen () {
        return this.isOpen
      },

      /************************************************************************
       * Sets the dropdown's state properties to represent it being closed.
       *
       * @private
       ***********************************************************************/

      _setClosedState () {
        this.toggleElement.setAttribute('aria-expanded', 'false');
        this.menuElement.setAttribute('hidden', '');

        this.isOpen = false;
      },

      /************************************************************************
       * Returns true if the custom event with the given name was successfully
       * dispatched.
       *
       * @private
       * @param {string} name - Event name
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      },

      /************************************************************************
       * Handles click events broadcast to the disclosure.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (
          this._eventOriginatedInsideMenu(event) ||
          this._eventOriginatedInsideHyperlink(event)
        ) { return }

        this._isOpen()
          ? this.close()
          : this.open();
      },

      /************************************************************************
       * Returns true if the given event originated inside the dropdown's menu.
       *
       * @private
       * @param {Event} event - Event
       * @returns {boolean} Event originated inside menu
       ***********************************************************************/

      _eventOriginatedInsideMenu (event) {
        return this.menuElement.contains(event.target)
      },

      /************************************************************************
       * Returns true if the given event originated inside a hyperlink.
       *
       * @private
       * @param {Event} event - Event
       * @returns {boolean} Event originated inside hyperlink
       ***********************************************************************/

      _eventOriginatedInsideHyperlink (event) {
        return event.target.closest('a')
      },

      /************************************************************************
       * Handles click events broadcast to the document that are related to
       * the dropdown but did not originate inside the dropdown itself.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      _onDocumentClick (event) {
        if (!this._clickOriginatedOutsideDropdown(event)) { return }

        if (!this._isOpen()) { return }

        this.close();
      },

      /************************************************************************
       * Returns true if the click event originated outside the dropdown.
       *
       * @param {Event} event - Click event
       * @returns {boolean} Event originated outside dropdown
       ***********************************************************************/

      _clickOriginatedOutsideDropdown (event) {
        return !this.element.contains(event.target)
      },

      /************************************************************************
       * Handles keydown events broadcast to the dropdown.
       *
       * @param {Event} event - Keydown event
       ***********************************************************************/

      onKeydown (event) {
        switch (event.keyCode) {
          case keyCodes.escape:
            this._handleEscapeKey();
            break

          case keyCodes.up:
            event.preventDefault();
            this._handleUpKey(event);
            break

          case keyCodes.down:
            event.preventDefault();
            this._handleDownKey(event);
            break

          case keyCodes.tab:
            this._handleTabKey(event);
            break
        }
      },

      /************************************************************************
       * Handles the user pressing the Escape key.
       *
       * @private
       ***********************************************************************/

      _handleEscapeKey () {
        this.close();
        this.toggleElement.focus();
      },

      /************************************************************************
       * Handles the user pressing the Up arrow key.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _handleUpKey (event) {
        event.preventDefault();

        if (!this._eventOriginatedInsideMenu(event)) { return }

        this._focusPreviousMenuItem(event);
      },

      /************************************************************************
       * Moves focus to the previous menu item in response to the given
       * keydown event.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _focusPreviousMenuItem (event) {
        const currentMenuItemIndex = this._getCurrentMenuItemIndex(event);
        const previousItem = this.menuItems[currentMenuItemIndex - 1];

        if (!previousItem && this.lastMenuItem !== undefined) {
          return this.lastMenuItem.focus()
        }

        previousItem.focus();
      },

      /************************************************************************
       * Gets the index of a menu item interacted with by the user. Useful
       * when determining which menu items come before and after the item
       * just interacted with.
       *
       * @private
       * @param {Event} event - Keydown event
       * @return {number} index - Index of menu item interacted with
       ***********************************************************************/

      _getCurrentMenuItemIndex (event) {
        for (let i = 0; i < this.menuItems.length; i++) {
          if (event.target == this.menuItems[i]) { return i }
        }
      },

      /************************************************************************
       * Handles the user pressing the Down arrow key.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _handleDownKey (event) {
        event.preventDefault();

        if (!this._isOpen()) { this.open(); }

        this._eventOriginatedInsideMenu(event)
          ? this._focusNextMenuItem(event)
          : this.firstMenuItem.focus();
      },

      /************************************************************************
       * Moves focus to the next menu item in response to the given keydown
       * event.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _focusNextMenuItem (event) {
        const currentMenuItemIndex = this._getCurrentMenuItemIndex(event);
        const nextItem = this.menuItems[currentMenuItemIndex + 1];

        if (!nextItem) { return this.firstMenuItem.focus() }

        nextItem.focus();
      },

      /************************************************************************
       * Handles the user pressing the Down arrow key.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _handleTabKey (event) {
        if (!this._eventOriginatedInsideMenu(event)) { return }

        if (this._userTabbedOutOfLastMenuItem(event)) { this.close(); }
      },

      /************************************************************************
       * Returns true if the user tabbed out of the last item in the dropdown
       * menu with the given keydown event.
       *
       * @private
       * @param {Event} event - Keydown event
       * @returns {boolean} User tabbed out of last menu item
       ***********************************************************************/

      _userTabbedOutOfLastMenuItem (event) {
        return document.activeElement == this.lastMenuItem && !event.shiftKey
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The file input component allows the user to select a file to be uploaded as
 * part of a form submission.
 *
 * @see https://rivet.iu.edu/components/file-input/
 *****************************************************************************/

class FileInput extends Component {

  /****************************************************************************
   * Gets the file input's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-file-input]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the file input.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
      },

      /************************************************************************
       * Initializes file input child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.inputElementAttribute = 'data-rvt-file-input-button';
        this.previewElementAttribute = 'data-rvt-file-input-preview';

        this.inputElementSelector = `[${this.inputElementAttribute}]`;
        this.previewElementSelector = `[${this.previewElementAttribute}]`;
      },

      /************************************************************************
       * Initializes file input child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.inputElement = this.element.querySelector(this.inputElementSelector);
        this.previewElement = this.element.querySelector(this.previewElementSelector);
      },

      /************************************************************************
       * Initializes file input state properties.
       *
       * @private
       ***********************************************************************/

      _initProperties () {
        this.defaultPreviewText = this.previewElement.textContent;
      },

      /************************************************************************
       * Called when the file input is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
      },

      /************************************************************************
       * Called when the file input is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
      },

      /************************************************************************
       * Handles change events broadcast to the file input.
       *
       * @param {Event} event - Change event
       ***********************************************************************/

      onChange (event) {
        if (this._hasAttachedFiles()) {
          if (!this._attachEventDispatched()) { return }

          this._hasMultipleAttachedFiles()
            ? this._showNumberOfAttachedFiles()
            : this._showAttachedFilename();
        } else {
          this._resetPreviewTextToDefault();
        }
      },

      /************************************************************************
       * Returns true if any files are attached to the file input.
       *
       * @private
       * @returns {boolean} Has attached files
       ***********************************************************************/

      _hasAttachedFiles () {
        return this.inputElement.files.length > 0
      },

      /************************************************************************
       * Returns true if the "file attached" custom event was successfully
       * dispatched.
       *
       * @private
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _attachEventDispatched () {
        const files = Array.from(this.inputElement.files).map(f => f.name);
        const dispatched = Component.dispatchCustomEvent(
          'FileAttached',
          this.element,
          { files }
        );

        return dispatched
      },

      /************************************************************************
       * Returns true if more than one file is attached to the file input.
       *
       * @private
       * @returns {boolean} Has multiple attached files
       ***********************************************************************/

      _hasMultipleAttachedFiles () {
        return this.inputElement.files.length > 1
      },

      /************************************************************************
       * Sets the file input preview text to show the number of attached files.
       *
       * @private
       ***********************************************************************/

      _showNumberOfAttachedFiles () {
        this.previewElement.textContent = this.inputElement.files.length + ' files selected';
      },

      /************************************************************************
       * Sets the file input preview text to show the name of the attached
       * file.
       *
       * @private
       ***********************************************************************/

      _showAttachedFilename () {
        this.previewElement.textContent = this._getSanitizedFilename();
      },

      /************************************************************************
       * Sanitizes the name of the attached file for safe output.
       *
       * @private
       * @returns {string} Sanitized filename
       ***********************************************************************/

      _getSanitizedFilename () {
        return this.inputElement.files[0].name.replace(/[^\w\s.-]+/gi, '')
      },

      /************************************************************************
       * Resets the file input preview text to its default value.
       *
       * @private
       ***********************************************************************/

      _resetPreviewTextToDefault () {
        this.previewElement.textContent = this.defaultPreviewText;
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The sidenav component can be used to add a vertical list of navigation
 * links to a sidebar. Sidenavs can contain dropdowns that reveal nested links.
 *
 * @see https://rivet.iu.edu/components/sidenav/
 *****************************************************************************/

class Sidenav extends Component {

  /****************************************************************************
   * Gets the sidenav's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-sidenav]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the sidenav.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initAttributes();
        this._setInitialChildMenuStates();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },

      /************************************************************************
       * Initializes sidenav child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.toggleAttribute = 'data-rvt-sidenav-toggle';
        this.childMenuAttribute = 'data-rvt-sidenav-list';

        this.toggleSelector = `[${this.toggleAttribute}]`;
        this.childMenuSelector = `[${this.childMenuAttribute}]`;
      },

      /************************************************************************
       * Initializes sidenav child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.childMenuToggleButtons = Array.from(
          this.element.querySelectorAll(this.toggleSelector)
        );

        this.childMenus = Array.from(
          this.element.querySelectorAll(this.childMenuSelector)
        );
      },

      /************************************************************************
       * Initializes sidenav attributes.
       *
       * @private
       ***********************************************************************/

      _initAttributes () {
        this._assignComponentElementIds();
      },

      /************************************************************************
       * Assigns random IDs to each toggle button and child menu if one was
       * not already provided in the markup.
       *
       * @private
       ***********************************************************************/

      _assignComponentElementIds () {
        this._assignToggleIds();
        this._assignChildMenuIds();
      },

      /************************************************************************
       * Assigns a random ID to each toggle.
       *
       * @private
       ***********************************************************************/

      _assignToggleIds () {
        this.childMenuToggleButtons.forEach(toggle => {
          Component.setAttributeIfNotSpecified(toggle, this.toggleAttribute, Component.generateUniqueId());
        });
      },

      /************************************************************************
       * Assigns a random ID to each child menu.
       *
       * @private
       ***********************************************************************/

      _assignChildMenuIds () {
        const numMenus = this.childMenus.length;

        for (let i = 0; i < numMenus; i++) {
          const toggle = this.childMenuToggleButtons[i];
          const menu = this.childMenus[i];
          const menuId = toggle.getAttribute(this.toggleAttribute);

          Component.setAttributeIfNotSpecified(menu, this.childMenuAttribute, menuId);
        }
      },

      /************************************************************************
       * Sets the initial state of the sidenav's child menus.
       *
       * @private
       ***********************************************************************/

      _setInitialChildMenuStates () {
        this._setChildMenuDefaultAriaAttributes();
        this._shouldOpenAllChildMenus()
          ? this._openAllChildMenus()
          : this._setChildMenuDefaultStates();
      },

      /************************************************************************
       * Sets the default ARIA attributes for the sidenav's child menus.
       *
       * @private
       ***********************************************************************/

      _setChildMenuDefaultAriaAttributes () {
        this.childMenuToggleButtons.forEach(
          toggleButton => toggleButton.setAttribute('aria-haspopup', 'true')
        );
      },

      /************************************************************************
       * Returns true if all child menus should be opened when the component
       * is added to the DOM.
       *
       * @private
       * @returns {boolean} Child menus should be opened
       ***********************************************************************/

      _shouldOpenAllChildMenus () {
        return this.element.hasAttribute('data-rvt-sidenav-open-all')
      },

      /************************************************************************
       * Opens all child menus.
       *
       * @private
       ***********************************************************************/

      _openAllChildMenus () {
        this.childMenuToggleButtons.forEach((toggleButton, index) => {
          toggleButton.setAttribute('aria-expanded', 'true');
          this.childMenus[index].removeAttribute('hidden');
        });
      },

      /************************************************************************
       * Sets the default open/closed state for each child menu based on
       * the ARIA attributes set by the developer.
       *
       * @private
       ***********************************************************************/

      _setChildMenuDefaultStates () {
        this.childMenuToggleButtons.forEach((element, index) => {
          if (element.getAttribute('aria-expanded') === 'true') {
            this.childMenus[index].removeAttribute('hidden');
          } else {
            element.setAttribute('aria-expanded', 'false');
            this.childMenus[index].setAttribute('hidden', '');
          }
        });
      },

      /************************************************************************
       * Called when the sidenav is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);
      },

      /************************************************************************
       * Called when the sidenav is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);
      },

      /************************************************************************
       * Handles click events broadcast to the sidenav.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (!this._clickOriginatedInChildMenuToggleButton(event)) { return }

        this._setChildMenuToToggle(event);

        if (!this._childMenuToToggleExists()) { return }

        this._childMenuToToggleIsOpen()
          ? this.close(this.childMenuToToggleId)
          : this.open(this.childMenuToToggleId);
      },

      /************************************************************************
       * Returns true if the given click event originated inside one of the
       * sidenav's child menu toggle buttons.
       *
       * @private
       * @param {Event} event - Click event
       * @returns {boolean} Click originated inside child menu toggle button
       ***********************************************************************/

      _clickOriginatedInChildMenuToggleButton (event) {
        return event.target.closest(this.toggleSelector)
      },

      /************************************************************************
       * Sets references to the child menu to be toggled by the given click
       * event. These references are used by other click handler submethods.
       *
       * @private
       * @param {Event} event - Click event
       ***********************************************************************/

      _setChildMenuToToggle (event) {
        this.childMenuToToggleId = event.target
          .closest(this.toggleSelector)
          .dataset.rvtSidenavToggle;

        this.childMenuToToggle = this.element.querySelector(
          `[${this.childMenuAttribute} = "${this.childMenuToToggleId}"]`
        );
      },

      /************************************************************************
       * Returns true if the child menu to be toggled by a click event actually
       * exists in the DOM.
       *
       * @private
       * @returns {boolean} Child menu exists
       ***********************************************************************/

      _childMenuToToggleExists () {
        return this.childMenuToToggle &&
               this.childMenuToToggle.getAttribute(this.childMenuAttribute) !== ''
      },

      /************************************************************************
       * Returns true if the child menu to be toggled by a click event is open.
       *
       * @private
       * @returns {boolean} Child menu is open
       ***********************************************************************/

      _childMenuToToggleIsOpen () {
        return !this.childMenuToToggle.hasAttribute('hidden')
      },

      /************************************************************************
       * Opens the child menu with the given data-rvt-sidenav-list ID value.
       *
       * @param {string} childMenuId - Child menu ID
       ***********************************************************************/

      open (childMenuId) {
        this._setChildMenuToOpen(childMenuId);

        if (!this._childMenuExists(childMenuId)) {
          console.warn(`No such subnav child menu '${childMenuId}' in open()`);
          return
        }

        if (!this._eventDispatched('SidenavListOpened', this.childMenuToOpen)) { return }

        this._openChildMenu();
      },

      /************************************************************************
       * Sets references to the child menu to be opened. These references are
       * used by other submethods.
       *
       * @private
       * @param {string} childMenuId - Child menu ID
       ***********************************************************************/

      _setChildMenuToOpen (childMenuId) {
        this.childMenuToOpenToggleButton = this.element.querySelector(
          `[${this.toggleAttribute} = "${childMenuId}"]`
        );

        this.childMenuToOpen = this.element.querySelector(
          `[${this.childMenuAttribute} = "${childMenuId}"]`
        );
      },

      /************************************************************************
       * Expands the child menu to be opened.
       *
       * @private
       ***********************************************************************/

      _openChildMenu () {
        this.childMenuToOpenToggleButton.setAttribute('aria-expanded', 'true');
        this.childMenuToOpen.removeAttribute('hidden');
      },

      /************************************************************************
       * Closes the child menu with the given data-rvt-sidenav-list ID value.
       *
       * @param {string} childMenuId - Child menu ID
       ***********************************************************************/

      close (childMenuId) {
        this._setChildMenuToClose(childMenuId);

        if (!this._childMenuExists(childMenuId)) {
          console.warn(`No such subnav child menu '${childMenuId}' in close()`);
          return
        }

        if (!this._eventDispatched('SidenavListClosed', this.childMenuToClose)) { return }

        this._closeChildMenu();
      },

      /************************************************************************
       * Sets references to the child menu to be closed. These references are
       * used by other submethods.
       *
       * @private
       * @param {string} childMenuId - Child menu ID
       ***********************************************************************/

      _setChildMenuToClose (childMenuId) {
        this.childMenuToCloseToggleButton = this.element.querySelector(
          `[${this.toggleAttribute} = "${childMenuId}"]`
        );

        this.childMenuToClose = this.element.querySelector(
          `[${this.childMenuAttribute} = "${childMenuId}"]`
        );
      },

      /************************************************************************
       * Collapses the child menu to be closed.
       *
       * @private
       ***********************************************************************/

      _closeChildMenu () {
        this.childMenuToCloseToggleButton.setAttribute('aria-expanded', 'false');
        this.childMenuToClose.setAttribute('hidden', '');
      },

      /************************************************************************
       * Returns true if a child menu with the given ID exists.
       *
       * @private
       * @returns {boolean} Child menu exists
       ***********************************************************************/

      _childMenuExists (childMenuId) {
        const childMenuToggleButton = this.element.querySelector(
          `[${this.toggleAttribute} = "${childMenuId}"]`
        );

        const childMenu = this.element.querySelector(
          `[${this.childMenuAttribute} = "${childMenuId}"]`
        );

        return childMenuToggleButton && childMenu
      },

      /************************************************************************
       * Returns true if the custom event with the given name was successfully
       * dispatched.
       *
       * @private
       * @param {string} name - Event name
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _eventDispatched (name, childMenu) {
        const dispatched = Component.dispatchCustomEvent(
          name,
          this.element,
          { list: childMenu }
        );

        return dispatched
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2023 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The switch component allows the user to toggle between "on" and "off"
 * states.
 *
 * @see https://rivet.iu.edu/components/switch/
 *****************************************************************************/

class Switch extends Component {

  /****************************************************************************
   * Gets the switch's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-switch]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the switch.
       ***********************************************************************/

      init () {
        this._initProperties();
        this._setInitialState();

        Component.bindMethodToDOMElement(this, 'switchOn', this.switchOn);
        Component.bindMethodToDOMElement(this, 'switchOff', this.switchOff);
      },

      /************************************************************************
       * Initializes switch state properties.
       *
       * @private
       ***********************************************************************/

      _initProperties () {
        this.on = false;
      },

      /************************************************************************
       * Sets the initial state of the switch.
       *
       * @private
       ***********************************************************************/

      _setInitialState () {
        this._hideLabelsFromAssistiveTech();
        this._setInitialToggleState();
      },

      /************************************************************************
       * Hides the on/off text labels from assistive technology.
       *
       * @private
       ***********************************************************************/

      _hideLabelsFromAssistiveTech () {
        this.element
            .querySelectorAll('span')
            .forEach(span => span.setAttribute('aria-hidden', true));
      },

      /************************************************************************
       * Sets the switch's initial toggle state.
       *
       * @private
       ***********************************************************************/

      _setInitialToggleState () {
        this.element.setAttribute('aria-checked', 'false');

        if (this._shouldBeOnByDefault()) { this.switchOn(SUPPRESS_EVENT); }
      },

      /************************************************************************
       * Returns true if the switch should be toggled on by default.
       *
       * @private
       ***********************************************************************/

      _shouldBeOnByDefault () {
        return this.element.hasAttribute('data-rvt-switch-on')
      },

      /************************************************************************
       * Called when the switch is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
      },

      /************************************************************************
       * Called when the switch is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
      },

      /************************************************************************
       * Handles click events broadcast to the switch.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        this._isOn()
          ? this.switchOff()
          : this.switchOn();
      },

      /************************************************************************
       * Returns true if the switch is toggled on.
       ***********************************************************************/

      _isOn () {
        return this.on
      },

      /************************************************************************
       * Toggle the switch on.
       * 
       * @param {boolean} suppressEvent - Suppress switch-on event
       ***********************************************************************/

      switchOn (suppressEvent = false) {
        if (this._isOn()) { return }

        if (!suppressEvent)
          if (!this._eventDispatched('SwitchToggledOn')) { return }

        this._setOnState();
      },

      /************************************************************************
       * Sets the switch's state properties to represent it being on.
       *
       * @private
       ***********************************************************************/

      _setOnState () {
        this.on = true;
        this.element.setAttribute('aria-checked', 'true');
      },

      /************************************************************************
       * Toggle the switch off.
       * 
       * @param {boolean} suppressEvent - Suppress switch-off event
       ***********************************************************************/

      switchOff (suppressEvent = false) {
        if (!this._isOn()) { return }

        if (!suppressEvent)
          if (!this._eventDispatched('SwitchToggledOff')) { return }

        this._setOffState();
      },

      /************************************************************************
       * Sets the switch's state properties to represent it being off.
       *
       * @private
       ***********************************************************************/

      _setOffState () {
        this.on = false;
        this.element.setAttribute('aria-checked', 'false');
      },

      /************************************************************************
       * Returns true if the custom event with the given name was successfully
       * dispatched.
       *
       * @private
       * @param {string} name - Event name
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * The tabs component allows the user to switch between related groups of
 * content without having to leave the page.
 *
 * @see https://rivet.iu.edu/components/tabs/
 *****************************************************************************/

class Tabs extends Component {

  /****************************************************************************
   * Gets the tabs component's CSS selector.
   *
   * @static
   * @returns {string} The CSS selector
   ***************************************************************************/

  static get selector () {
    return '[data-rvt-tabs]'
  }

  /****************************************************************************
   * Gets an object containing the methods that should be attached to the
   * component's root DOM element. Used by wicked-elements to initialize a DOM
   * element with Web Component-like behavior.
   *
   * @static
   * @returns {Object} Object with component methods
   ***************************************************************************/

  static get methods () {
    return {

      /************************************************************************
       * Initializes the tabs component.
       ***********************************************************************/

      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
        this._initAttributes();

        Component.bindMethodToDOMElement(this, 'activateTab', this.activateTab);
        Component.bindMethodToDOMElement(this, 'addTab', this.addTab);
        Component.bindMethodToDOMElement(this, 'removeTab', this.removeTab);
      },

      /************************************************************************
       * Initializes tabs component child element selectors.
       *
       * @private
       ***********************************************************************/

      _initSelectors () {
        this.tabAttribute = 'data-rvt-tab';
        this.panelAttribute = 'data-rvt-tab-panel';

        this.tabSelector = `[${this.tabAttribute}]`;
        this.panelSelector = `[${this.panelAttribute}]`;
        this.tablistSelector = '[data-rvt-tablist]';
        this.initialTabSelector = '[data-rvt-tab-init]';
      },

      /************************************************************************
       * Initializes tabs component child elements.
       *
       * @private
       ***********************************************************************/

      _initElements () {
        this.tablist = this.element.querySelector(this.tablistSelector);
        this.tabs = Array.from(this.element.querySelectorAll(this.tabSelector));
        this.panels = Array.from(this.element.querySelectorAll(this.panelSelector));

        // The data-rvt-tablist attribute was added in Rivet 2.4.0. To maintain
        // backward compatibility, the code below infers which element is the
        // tablist if the data-rvt-tablist attribute is not present.

        if (!this.tablist) {
          this.tablist = this.tabs[0].parentElement;
        }
      },

      /************************************************************************
       * Initializes tabs state properties.
       *
       * @private
       ***********************************************************************/

      _initProperties () {
        this.activeTab = null;
      },

      /************************************************************************
       * Initializes tabs attributes.
       *
       * @private
       ***********************************************************************/

      _initAttributes () {
        this._assignComponentElementIds();
        this._setTabButtonAttributes();
        this._setAriaAttributes();
      },

      /************************************************************************
       * Assigns a random ID to the tabs component if an ID was not already
       * specified in the markup.
       *
       * @private
       ***********************************************************************/

      _assignComponentElementIds () {
        this._assignTabIds();
        this._assignPanelIds();
      },

      /************************************************************************
       * Assigns a random ID to each tab.
       *
       * @private
       ***********************************************************************/

      _assignTabIds () {
        this.tabs.forEach(tab => {
          Component.setAttributeIfNotSpecified(tab, this.tabAttribute, Component.generateUniqueId());
          Component.setAttributeIfNotSpecified(tab, 'id', Component.generateUniqueId());
        });
      },

      /************************************************************************
       * Assigns a random ID to each panel.
       *
       * @private
       ***********************************************************************/

      _assignPanelIds () {
        const numPanels = this.panels.length;

        for (let i = 0; i < numPanels; i++) {
          const tab = this.tabs[i];
          const panel = this.panels[i];
          const panelId = tab.getAttribute(this.tabAttribute);

          Component.setAttributeIfNotSpecified(panel, this.panelAttribute, panelId);
          Component.setAttributeIfNotSpecified(panel, 'id', panelId);
        }
      },

      /************************************************************************
       * Adds `type="button"` to each tab's button element.
       *
       * @private
       ***********************************************************************/

      _setTabButtonAttributes () {
        this.tabs.forEach(tab => {
          Component.setAttributeIfNotSpecified(tab, 'type', 'button');
        });
      },

      /************************************************************************
       * Sets the tabs component's ARIA attributes.
       *
       * @private
       ***********************************************************************/

      _setAriaAttributes () {
        this.tablist.setAttribute('role', 'tablist');
        this.tabs.forEach(tab => tab.setAttribute('role', 'tab'));
        this.panels.forEach(panel => {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('tabindex', 0);
        });

        for (let i = 0; i < this.tabs.length; i++) {
          const tab = this.tabs[i];
          const panel = this.panels[i];
          const id = tab.getAttribute('id');

          panel.setAttribute('aria-labelledby', id);
        }
      },

      /************************************************************************
       * Called when the tabs component is added to the DOM.
       ***********************************************************************/

      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);

        this._activateInitialTab();
      },

      /************************************************************************
       * Activates the tabs component's initial tab. Defaults to the first tab
       * in the component unless the data-rvt-tab-init attribute is used.
       *
       * @private
       ***********************************************************************/

      _activateInitialTab () {
        const initialTab = this.element.querySelector(this.initialTabSelector);
        const firstTab = this.panels[0];

        initialTab
          ? this.activateTab(initialTab.getAttribute(this.panelAttribute), SUPPRESS_EVENT)
          : this.activateTab(firstTab.getAttribute(this.panelAttribute), SUPPRESS_EVENT);
      },

      /************************************************************************
       * Called when the tabs component is removed from the DOM.
       ***********************************************************************/

      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);
      },

      /************************************************************************
       * Handles click events broadcast to the tabs component.
       *
       * @param {Event} event - Click event
       ***********************************************************************/

      onClick (event) {
        if (!this._eventOriginatedInsideTab(event)) { return }

        this.activateTab(this._getClickedTabId(event));
      },

      /************************************************************************
       * Returns true if the given event originated inside a tab.
       *
       * @private
       * @param {Event} event - Event
       * @returns {boolean} Event originated inside a tab
       ***********************************************************************/

      _eventOriginatedInsideTab (event) {
        return event.target.closest(this.tabSelector)
      },

      /************************************************************************
       * Returns the ID of the clicked tab.
       *
       * @private
       * @param {Event} event - Click event
       * @returns {string} Clicked tab ID
       ***********************************************************************/

      _getClickedTabId (event) {
        return event.target.closest(this.tabSelector).getAttribute(this.tabAttribute)
      },

      /************************************************************************
       * Handles keydown events broadcast to the tabs component.
       *
       * @param {Event} event - Keydown event
       ***********************************************************************/

      onKeydown (event) {
        if (!this._eventOriginatedInsideTab(event)) { return }

        this._setNeighboringTabIndexes(event);

        switch (event.keyCode) {
          case keyCodes.left:
            event.preventDefault();
            this._focusPreviousTab();
            break

          case keyCodes.right:
            event.preventDefault();
            this._focusNextTab();
            break

          case keyCodes.home:
            event.preventDefault();
            this._focusFirstTab();
            break

          case keyCodes.end:
            event.preventDefault();
            this._focusLastTab();
            break
        }
      },

      /************************************************************************
       * Sets the indexes of the tab before and after the one from which the
       * given keydown event originated. Used to determine which tabs should
       * receive focus when the left and right arrow keys are pressed.
       *
       * @private
       * @param {Event} event - Keydown event
       ***********************************************************************/

      _setNeighboringTabIndexes (event) {
        const currentTab = event.target.closest(this.tabSelector);

        this.previousTabIndex = this.tabs.indexOf(currentTab) - 1;
        this.nextTabIndex = this.tabs.indexOf(currentTab) + 1;
      },

      /************************************************************************
       * Moves focus to the tab before the one that currently has focus. If
       * focus is currently on the first tab, move focus to the last tab.
       *
       * @private
       ***********************************************************************/

      _focusPreviousTab () {
        this.tabs[this.previousTabIndex]
          ? this.tabs[this.previousTabIndex].focus()
          : this.tabs[this.tabs.length - 1].focus();
      },

      /************************************************************************
       * Moves focus to the tab after the one that currently has focus. If
       * focus is currently on the last tab, move focus to the first tab.
       *
       * @private
       ***********************************************************************/

      _focusNextTab () {
        this.tabs[this.nextTabIndex]
          ? this.tabs[this.nextTabIndex].focus()
          : this.tabs[0].focus();
      },

      /************************************************************************
       * Moves focus to the first tab.
       *
       * @private
       ***********************************************************************/

      _focusFirstTab () {
        this.tabs[0].focus();
      },

      /************************************************************************
       * Moves focus to the last tab.
       *
       * @private
       ***********************************************************************/

      _focusLastTab () {
        this.tabs[this.tabs.length - 1].focus();
      },

      /************************************************************************
       * Activates the tab with the given ID or index.
       *
       * @param {string|number} idOrIndex - ID or index of tab to activate
       * @param {boolean} suppressEvent - Suppress tab activated event
       ***********************************************************************/

      activateTab (idOrIndex, suppressEvent = false) {
        const id = this._tabIndexWasPassed(idOrIndex)
          ? this._getTabIdFromIndex(idOrIndex)
          : idOrIndex;

        this._setTabToActivate(id);

        if (!this._tabToActivateExists()) {
          console.warn(`No such tab '${id}' in activateTab()`);
          return
        }

        if (!suppressEvent)
          if (!this._tabActivatedEventDispatched()) { return }

        this._deactivateUnselectedTabs();
        this._activateSelectedTab();
      },

      /************************************************************************
       * Activates the tab with the given ID or index.
       *
       * @param {string|number} idOrIndex - ID or index of tab to activate
       ***********************************************************************/

      _tabIndexWasPassed (idOrIndex) {
        return typeof idOrIndex === 'number'
      },

      /************************************************************************
       * Gets the ID of the tab at the given index.
       *
       * @private
       * @param {number} index - Tab index
       ***********************************************************************/

      _getTabIdFromIndex (index) {
        return this.tabs[index]
          ? this.tabs[index].getAttribute(this.tabAttribute)
          : null
      },

      /************************************************************************
       * Updates the component's state to store references to the tab to
       * activate. Used by tab activation submethods to validate a tab
       * activation request and determine which panels should be shown or
       * hidden.
       *
       * @private
       * @param {string} tabId - ID of tab to activate
       ***********************************************************************/

      _setTabToActivate (tabId) {
        this.tabToActivate = this.element.querySelector(`[${this.tabAttribute} = "${tabId}"]`);
        this.panelToActivate = this.element.querySelector(`[${this.panelAttribute} = "${tabId}"]`);
      },

      /************************************************************************
       * Returns true if the tab to activate actually exists in the DOM.
       *
       * @private
       * @returns {boolean} Tab to activate exists
       ***********************************************************************/

      _tabToActivateExists () {
        return this.tabToActivate && this.panelToActivate
      },

      /************************************************************************
       * Returns true if the custom "tab activated" event was successfully
       * dispatched.
       *
       * @private
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _tabActivatedEventDispatched () {
        const dispatched = Component.dispatchCustomEvent(
          'TabActivated',
          this.element,
          { tab: this.panelToActivate }
        );

        return dispatched
      },

      /************************************************************************
       * Deactivates all tabs that aren't the selected tab to activate.
       *
       * @private
       ***********************************************************************/

      _deactivateUnselectedTabs () {
        this.panels.forEach((panel, index) => {
          if (!this._panelShouldBeActivated(panel)) {
            this._deactivateTab(panel, index);
          }
        });
      },

      /************************************************************************
       * Returns true if the given panel should be activated.
       *
       * @private
       * @param {HTMLElement} panel - Panel element
       * @returns {boolean} Panel should be activated
       ***********************************************************************/

      _panelShouldBeActivated (panel) {
        return panel.getAttribute(this.panelAttribute) === this.panelToActivate.dataset.rvtTabPanel
      },

      /************************************************************************
       * Deactivates the given tab.
       *
       * @private
       * @param {HTMLElement} panel - Panel element to hide
       * @param {string} tabIndex - Index of tab to deactivate
       ***********************************************************************/

      _deactivateTab (panel, tabIndex) {
        panel.setAttribute('hidden', '');
        this.tabs[tabIndex].setAttribute('aria-selected', 'false');
        this.tabs[tabIndex].setAttribute('tabindex', '-1');
      },

      /************************************************************************
       * Activates the currently selected tab.
       *
       * @private
       ***********************************************************************/

      _activateSelectedTab () {
        this.tabToActivate.setAttribute('aria-selected', 'true');
        this.tabToActivate.removeAttribute('tabindex');
        this.panelToActivate.removeAttribute('hidden');

        this.activeTab = this.tabToActivate;
      },

      /************************************************************************
       * Adds a tab with the given label to the component, along with its
       * associated panel. Returns an object with references to both the added
       * tab and panel:
       *
       * `{ tab: HTMLElement, panel: HTMLElement }`
       *
       * @param {string} label - Tab label
       * @param {boolean} suppressEvent - Suppress add tab event
       * @returns {object} Added tab and panel
       ***********************************************************************/

      addTab (label, suppressEvent = false) {
        const tab = this._createNewTabElement(label);
        const panel = this._createNewPanelElement(tab);

        if (!suppressEvent)
          if (!this._tabAddedEventDispatched(tab, panel)) { return }

        this.tablist.appendChild(tab);
        this.element.appendChild(panel);

        return { tab, panel }
      },

      /************************************************************************
       * Creates a new tab element to be added to the component.
       *
       * @private
       * @param {string} label - Tab label
       * @returns {HTMLElement} Tab to add
       ***********************************************************************/

      _createNewTabElement (label) {
        const tab = document.createElement('button');
        tab.textContent = label;
        tab.classList.add('rvt-tabs__tab');
        tab.setAttribute(this.tabAttribute, Component.generateUniqueId());
        tab.setAttribute('id', Component.generateUniqueId());
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', false);
        tab.setAttribute('tabindex', -1);

        return tab
      },

      /************************************************************************
       * Creates a new tab panel element to be added to the component.
       *
       * @private
       * @param {HTMLElement} tab - Tab associated with panel to create
       * @returns {HTMLElement} Panel to add
       ***********************************************************************/

      _createNewPanelElement (tab) {
        const panel = document.createElement('div');
        panel.classList.add('rvt-tabs__panel');
        panel.setAttribute(this.panelAttribute, tab.getAttribute(this.tabAttribute));
        panel.setAttribute('id', tab.getAttribute(this.tabAttribute));
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('tabindex', 0);
        panel.setAttribute('aria-labelledby', tab.getAttribute('id'));
        panel.setAttribute('hidden', true);

        return panel
      },

      /************************************************************************
       * Returns true if the custom "tab added" event was successfully
       * dispatched.
       *
       * @private
       * @param {HTMLElement} tab - Added tab
       * @param {HTMLElement} panel - Panel associated with added tab
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _tabAddedEventDispatched (tab, panel) {
        const dispatched = Component.dispatchCustomEvent(
          'TabAdded',
          this.element,
          { tab, panel }
        );

        return dispatched
      },

      /************************************************************************
       * Removes a tab with the given ID or index value.
       *
       * @param {string|number} idOrIndex - ID or index of tab to remove
       ***********************************************************************/

      removeTab (idOrIndex) {
        const id = this._tabIndexWasPassed(idOrIndex)
          ? this._getTabIdFromIndex(idOrIndex)
          : idOrIndex;

        this._setTabToRemove(id);

        if (!this._tabToRemoveExists()) {
          console.warn(`No such tab '${id}' in removeTab()`);
          return
        }

        if (!this._tabRemovedEventDispatched()) { return }

        if (this._removedTabWasActiveTab()) {
          this._activateTabNearestToRemovedTab();
        }

        this._removeTab();
      },

      /************************************************************************
       * Updates the component's state to store references to the tab to
       * remove. Used by tab removal submethods to validate a tab removal
       * request and determine which panels should be removed from the DOM.
       *
       * @private
       * @param {string} tabId - ID of tab to remove
       ***********************************************************************/

      _setTabToRemove (tabId) {
        this.tabToRemove = this.element.querySelector(`[${this.tabAttribute}="${tabId}"]`);
        this.panelToRemove = this.element.querySelector(`[${this.panelAttribute} = "${tabId}"]`);
      },

      /************************************************************************
       * Returns true if the tab to activate actually exists in the DOM.
       *
       * @private
       * @returns {boolean} Tab to remove exists
       ***********************************************************************/

      _tabToRemoveExists () {
        return this.tabToRemove && this.panelToRemove
      },

      /************************************************************************
       * Returns true if the custom "tab removed" event was successfully
       * dispatched.
       *
       * @private
       * @returns {boolean} Event successfully dispatched
       ***********************************************************************/

      _tabRemovedEventDispatched () {
        const dispatched = Component.dispatchCustomEvent(
          'TabRemoved',
          this.element,
          {
            tab: this.tabToRemove,
            panel: this.panelToRemove
          }
        );

        return dispatched
      },

      /************************************************************************
       * Returns true if the removed tab was the active tab.
       *
       * @private
       * @returns {boolean} Removed tab was active tab
       ***********************************************************************/

      _removedTabWasActiveTab () {
        return this.tabToRemove === this.activeTab
      },

      /************************************************************************
       * Activates the tab nearest to the removed tab.
       *
       * @private
       ***********************************************************************/

      _activateTabNearestToRemovedTab () {
        const previousTab = this.tabToRemove.previousElementSibling;
        const nextTab = this.tabToRemove.nextElementSibling;

        if (previousTab) {
          this.activateTab(previousTab.dataset.rvtTab);
        } else if (nextTab) {
          this.activateTab(nextTab.dataset.rvtTab);
        }
      },

      /************************************************************************
       * Deletes from the DOM the tab and panel marked for removal.
       *
       * @private
       ***********************************************************************/

      _removeTab () {
        this.tabToRemove.remove();
        this.panelToRemove.remove();
      }
    }
  }
}

/******************************************************************************
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 *****************************************************************************/

/******************************************************************************
 * Initializes all Rivet components.
 *****************************************************************************/

function init () {
  Accordion.initAll();
  Alert.initAll();
  Disclosure.initAll();
  Dropdown.initAll();
  FileInput.initAll();
  Dialog.initAll();
  Sidenav.initAll();
  Switch.initAll();
  Tabs.initAll();
}

export { Accordion, Alert, Dialog, Disclosure, Dropdown, FileInput, Sidenav, Switch, Tabs, init };
