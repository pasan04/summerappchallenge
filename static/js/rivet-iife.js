/*!
 * rivet-core - @version 2.7.0
 *
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Rivet = function (exports) {
  'use strict';
  /******************************************************************************
   * Copyright (C) 2018 The Trustees of Indiana University
   * SPDX-License-Identifier: BSD-3-Clause
   *****************************************************************************/

  /******************************************************************************
   * Element.matches() polyfill
   *****************************************************************************/

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
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

      if (!document.documentElement.contains(el)) {
        return null;
      }

      do {
        if (ancestor.matches(selector)) {
          return ancestor;
        }

        ancestor = ancestor.parentElement;
      } while (ancestor !== null);

      return null;
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
    if (typeof window.CustomEvent === 'function') {
      return false;
    }

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return customEvent;
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
    Array.from = function () {
      var symbolIterator;

      try {
        symbolIterator = Symbol.iterator ? Symbol.iterator : 'Symbol(Symbol.iterator)';
      } catch (e) {
        symbolIterator = 'Symbol(Symbol.iterator)';
      }

      var toStr = Object.prototype.toString;

      var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };

      var toInteger = function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) return 0;
        if (number === 0 || !isFinite(number)) return number;
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };

      var maxSafeInteger = Math.pow(2, 53) - 1;

      var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      var setGetItemHandler = function setGetItemHandler(isIterator, items) {
        var iterator = isIterator && items[symbolIterator]();
        return function getItem(k) {
          return isIterator ? iterator.next() : items[k];
        };
      };

      var getArray = function getArray(T, A, len, getItem, isIterator, mapFn) {
        // 16. Let k be 0.
        var k = 0; // 17. Repeat, while k < len… or while iterator is done (also steps a - h)

        while (k < len || isIterator) {
          var item = getItem(k);
          var kValue = isIterator ? item.value : item;

          if (isIterator && item.done) {
            return A;
          } else {
            if (mapFn) {
              A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
          }

          k += 1;
        }

        if (isIterator) {
          throw new TypeError('Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1');
        } else {
          A.length = len;
        }

        return A;
      }; // The length property of the from method is 1.


      return function from(arrayLikeOrIterator
      /*, mapFn, thisArg */
      ) {
        // 1. Let C be the this value.
        var C = this; // 2. Let items be ToObject(arrayLikeOrIterator).

        var items = Object(arrayLikeOrIterator);
        var isIterator = isCallable(items[symbolIterator]); // 3. ReturnIfAbrupt(items).

        if (arrayLikeOrIterator == null && !isIterator) {
          throw new TypeError('Array.from requires an array-like object or iterator - not null or undefined');
        } // 4. If mapfn is undefined, then var mapping be false.


        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;

        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          } // 5. b. If thisArg was supplied, var T be thisArg; else var T be undefined.


          if (arguments.length > 2) {
            T = arguments[2];
          }
        } // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).


        var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).

        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        return getArray(T, A, len, setGetItemHandler(isIterator, items), isIterator, mapFn);
      };
    }();
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
      if (item.hasOwnProperty('remove')) {
        return;
      }

      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode === null) {
            return;
          }

          this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  "inert" in HTMLElement.prototype || (Object.defineProperty(HTMLElement.prototype, "inert", {
    enumerable: !0,
    get: function get() {
      return this.hasAttribute("inert");
    },
    set: function set(h) {
      h ? this.setAttribute("inert", "") : this.removeAttribute("inert");
    }
  }), window.addEventListener("load", function () {
    function h(a) {
      var b = null;

      try {
        b = new KeyboardEvent("keydown", {
          keyCode: 9,
          which: 9,
          key: "Tab",
          code: "Tab",
          keyIdentifier: "U+0009",
          shiftKey: !!a,
          bubbles: !0
        });
      } catch (g) {
        try {
          b = document.createEvent("KeyboardEvent"), b.initKeyboardEvent("keydown", !0, !0, window, "Tab", 0, a ? "Shift" : "", !1, "en");
        } catch (d) {}
      }

      if (b) {
        try {
          Object.defineProperty(b, "keyCode", {
            value: 9
          });
        } catch (g) {}

        document.dispatchEvent(b);
      }
    }

    function k(a) {
      for (; a && a !== document.documentElement;) {
        if (a.hasAttribute("inert")) return a;
        a = a.parentElement;
      }

      return null;
    }

    function e(a) {
      var b = a.path;
      return b && b[0] || a.target;
    }

    function l(a) {
      a.path[a.path.length - 1] !== window && (m(e(a)), a.preventDefault(), a.stopPropagation());
    }

    function m(a) {
      var b = k(a);

      if (b) {
        if (document.hasFocus() && 0 !== f) {
          var g = (c || document).activeElement;
          h(0 > f ? !0 : !1);
          if (g != (c || document).activeElement) return;
          var d = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function acceptNode(a) {
              return !a || !a.focus || 0 > a.tabIndex ? NodeFilter.FILTER_SKIP : b.contains(a) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          });
          d.currentNode = b;
          d = (-1 === Math.sign(f) ? d.previousNode : d.nextNode).bind(d);

          for (var e; e = d();) {
            if (e.focus(), (c || document).activeElement !== g) return;
          }
        }

        a.blur();
      }
    }

    (function (a) {
      var b = document.createElement("style");
      b.type = "text/css";
      b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(document.createTextNode(a));
      document.body.appendChild(b);
    })("/*[inert]*/*[inert]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}");

    var n = function n(a) {
      return null;
    };

    window.ShadowRoot && (n = function n(a) {
      for (; a && a !== document.documentElement;) {
        if (a instanceof window.ShadowRoot) return a;
        a = a.parentNode;
      }

      return null;
    });
    var f = 0;
    document.addEventListener("keydown", function (a) {
      f = 9 === a.keyCode ? a.shiftKey ? -1 : 1 : 0;
    });
    document.addEventListener("mousedown", function (a) {
      f = 0;
    });
    var c = null;
    document.body.addEventListener("focus", function (a) {
      var b = e(a);
      a = b == a.target ? null : n(b);

      if (a != c) {
        if (c) {
          if (!(c instanceof window.ShadowRoot)) throw Error("not shadow root: " + c);
          c.removeEventListener("focusin", l, !0);
        }

        a && a.addEventListener("focusin", l, !0);
        c = a;
      }

      m(b);
    }, !0);
    document.addEventListener("click", function (a) {
      var b = e(a);
      k(b) && (a.preventDefault(), a.stopPropagation());
    }, !0);
  }));
  /******************************************************************************
   * Copyright (C) 2018 The Trustees of Indiana University
   * SPDX-License-Identifier: BSD-3-Clause
   *****************************************************************************/

  var globalSettings = {
    prefix: 'rvt'
  };
  var Lie = typeof Promise === 'function' ? Promise : function (fn) {
    var queue = [],
        resolved = 0,
        value;
    fn(function ($) {
      value = $;
      resolved = 1;
      queue.splice(0).forEach(then);
    });
    return {
      then: then
    };

    function then(fn) {
      return resolved ? setTimeout(fn, 0, value) : queue.push(fn), this;
    }
  };
  var TRUE = true,
      FALSE = false;
  var QSA$1 = 'querySelectorAll';

  function add(node) {
    this.observe(node, {
      subtree: TRUE,
      childList: TRUE
    });
  }
  /**
   * Start observing a generic document or root element.
   * @param {Function} callback triggered per each dis/connected node
   * @param {Element?} root by default, the global document to observe
   * @param {Function?} MO by default, the global MutationObserver
   * @returns {MutationObserver}
   */


  var notify = function notify(callback, root, MO) {
    var loop = function loop(nodes, added, removed, connected, pass) {
      for (var i = 0, length = nodes.length; i < length; i++) {
        var node = nodes[i];

        if (pass || QSA$1 in node) {
          if (connected) {
            if (!added.has(node)) {
              added.add(node);
              removed["delete"](node);
              callback(node, connected);
            }
          } else if (!removed.has(node)) {
            removed.add(node);
            added["delete"](node);
            callback(node, connected);
          }

          if (!pass) loop(node[QSA$1]('*'), added, removed, connected, TRUE);
        }
      }
    };

    var observer = new (MO || MutationObserver)(function (records) {
      for (var added = new Set(), removed = new Set(), i = 0, length = records.length; i < length; i++) {
        var _records$i = records[i],
            addedNodes = _records$i.addedNodes,
            removedNodes = _records$i.removedNodes;
        loop(removedNodes, added, removed, FALSE, FALSE);
        loop(addedNodes, added, removed, TRUE, FALSE);
      }
    });
    observer.add = add;
    observer.add(root || document);
    return observer;
  };

  var QSA = 'querySelectorAll';
  var _self = self,
      document$1 = _self.document,
      Element$1 = _self.Element,
      MutationObserver$1 = _self.MutationObserver,
      Set$1 = _self.Set,
      WeakMap$1 = _self.WeakMap;

  var elements = function elements(element) {
    return QSA in element;
  };

  var filter = [].filter;

  var QSAO = function QSAO(options) {
    var live = new WeakMap$1();

    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) {
        live["delete"](elements[i]);
      }
    };

    var flush = function flush() {
      var records = observer.takeRecords();

      for (var i = 0, length = records.length; i < length; i++) {
        parse(filter.call(records[i].removedNodes, elements), false);
        parse(filter.call(records[i].addedNodes, elements), true);
      }
    };

    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };

    var notifier = function notifier(element, connected) {
      var selectors;

      if (connected) {
        for (var q, m = matches(element), i = 0, length = query.length; i < length; i++) {
          if (m.call(element, q = query[i])) {
            if (!live.has(element)) live.set(element, new Set$1());
            selectors = live.get(element);

            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function (q) {
          options.handle(element, connected, q);
        });
      }
    };

    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      for (var i = 0, length = elements.length; i < length; i++) {
        notifier(elements[i], connected);
      }
    };

    var query = options.query;
    var root = options.root || document$1;
    var observer = notify(notifier, root, MutationObserver$1);
    var attachShadow = Element$1.prototype.attachShadow;
    if (attachShadow) Element$1.prototype.attachShadow = function (init) {
      var shadowRoot = attachShadow.call(this, init);
      observer.add(shadowRoot);
      return shadowRoot;
    };
    if (query.length) parse(root[QSA](query));
    return {
      drop: drop,
      flush: flush,
      observer: observer,
      parse: parse
    };
  };

  var create = Object.create,
      keys = Object.keys;
  var attributes = new WeakMap();
  var lazy = new Set();
  var query = [];
  var config = {};
  var defined = {};

  var attributeChangedCallback = function attributeChangedCallback(records, o) {
    for (var h = attributes.get(o), i = 0, length = records.length; i < length; i++) {
      var _records$i2 = records[i],
          target = _records$i2.target,
          attributeName = _records$i2.attributeName,
          oldValue = _records$i2.oldValue;
      var newValue = target.getAttribute(attributeName);
      h.attributeChanged(attributeName, oldValue, newValue);
    }
  };

  var set = function set(value, m, l, o) {
    var handler = create(o, {
      element: {
        enumerable: true,
        value: value
      }
    });

    for (var i = 0, length = l.length; i < length; i++) {
      value.addEventListener(l[i].t, handler, l[i].o);
    }

    m.set(value, handler);
    if (handler.init) handler.init();
    var observedAttributes = o.observedAttributes;

    if (observedAttributes) {
      var mo = new MutationObserver(attributeChangedCallback);
      mo.observe(value, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes.map(function (attributeName) {
          if (value.hasAttribute(attributeName)) handler.attributeChanged(attributeName, null, value.getAttribute(attributeName));
          return attributeName;
        })
      });
      attributes.set(mo, handler);
    }

    return handler;
  };

  var _QSAO = QSAO({
    query: query,
    handle: function handle(element, connected, selector) {
      var _config$selector = config[selector],
          m = _config$selector.m,
          l = _config$selector.l,
          o = _config$selector.o;
      var handler = m.get(element) || set(element, m, l, o);
      var method = connected ? 'connected' : 'disconnected';
      if (method in handler) handler[method]();
    }
  }),
      drop = _QSAO.drop,
      flush = _QSAO.flush,
      parse = _QSAO.parse;

  var define = function define(selector, definition) {
    if (-1 < query.indexOf(selector)) throw new Error('duplicated: ' + selector);
    flush();
    var listeners = [];
    var retype = create(null);

    for (var k = keys(definition), i = 0, length = k.length; i < length; i++) {
      var key = k[i];

      if (/^on/.test(key) && !/Options$/.test(key)) {
        var options = definition[key + 'Options'] || false;
        var lower = key.toLowerCase();
        var type = lower.slice(2);
        listeners.push({
          t: type,
          o: options
        });
        retype[type] = key;

        if (lower !== key) {
          type = key.slice(2, 3).toLowerCase() + key.slice(3);
          retype[type] = key;
          listeners.push({
            t: type,
            o: options
          });
        }
      }
    }

    if (listeners.length) {
      definition.handleEvent = function (event) {
        this[retype[event.type]](event);
      };
    }

    query.push(selector);
    config[selector] = {
      m: new WeakMap(),
      l: listeners,
      o: definition
    };
    parse(document.querySelectorAll(selector));
    whenDefined(selector);
    if (!lazy.has(selector)) defined[selector]._();
  };

  var whenDefined = function whenDefined(selector) {
    if (!(selector in defined)) {
      var _,
          $ = new Lie(function ($) {
        _ = $;
      });

      defined[selector] = {
        _: _,
        $: $
      };
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


  var Component = /*#__PURE__*/function () {
    function Component() {
      _classCallCheck(this, Component);
    }

    _createClass(Component, null, [{
      key: "initAll",
      value:
      /****************************************************************************
       * Initializes all current and future instances of the component that are
       * added to the DOM.
       *
       * @static
       ***************************************************************************/
      function initAll() {
        this.init(this.selector);
      }
      /****************************************************************************
       * Initializes a specific component instance with the given selector.
       *
       * @static
       * @param {string} selector - CSS selector of component to initialize
       * @returns {HTMLElement} The initialized component
       ***************************************************************************/

    }, {
      key: "init",
      value: function init(selector) {
        define(selector, this.methods);
        return document.querySelector(selector);
      }
      /****************************************************************************
       * Gets the component's CSS selector.
       *
       * @abstract
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/

    }, {
      key: "selector",
      get: function get() {
        /* Virtual, must be implemented by subclass. */
      }
      /****************************************************************************
       * Gets the component's methods.
       *
       * @abstract
       * @static
       * @returns {Object} The component's methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
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

    }, {
      key: "bindMethodToDOMElement",
      value: function bindMethodToDOMElement(self, name, method) {
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

    }, {
      key: "dispatchCustomEvent",
      value: function dispatchCustomEvent(eventName, element) {
        var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var prefix = globalSettings.prefix;
        var event = new CustomEvent("".concat(prefix).concat(eventName), {
          bubbles: true,
          cancelable: true,
          detail: detail
        });
        return element.dispatchEvent(event);
      }
      /****************************************************************************
       * Dispatches a "component added" browser event.
       *
       * @static
       * @param {HTMLElement} element - New component DOM element
       * @returns {boolean} Event success or failure
       ***************************************************************************/

    }, {
      key: "dispatchComponentAddedEvent",
      value: function dispatchComponentAddedEvent(element) {
        return this.dispatchCustomEvent('ComponentAdded', document, {
          component: element
        });
      }
      /****************************************************************************
       * Dispatches a "component removed" browser event.
       *
       * @static
       * @param {HTMLElement} element - Removed component DOM element
       * @returns {boolean} Event success or failure
       ***************************************************************************/

    }, {
      key: "dispatchComponentRemovedEvent",
      value: function dispatchComponentRemovedEvent(element) {
        return this.dispatchCustomEvent('ComponentRemoved', document, {
          component: element
        });
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

    }, {
      key: "watchForDOMChanges",
      value: function watchForDOMChanges(self) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        self.observer = new MutationObserver(function (mutationList, observer) {
          self._initElements();

          if (callback) {
            callback();
          }
        });
        self.observer.observe(self.element, {
          childList: true,
          subtree: true
        });
      }
      /****************************************************************************
       * Stop watching the component's DOM for changes.
       *
       * @static
       * @param {Object} self - Component instance
       ***************************************************************************/

    }, {
      key: "stopWatchingForDOMChanges",
      value: function stopWatchingForDOMChanges(self) {
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

    }, {
      key: "generateUniqueId",
      value: function generateUniqueId() {
        return globalSettings.prefix + '-' + Math.random().toString(20).substr(2, 12);
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

    }, {
      key: "setAttributeIfNotSpecified",
      value: function setAttributeIfNotSpecified(element, attribute, value) {
        var existingValue = element.getAttribute(attribute);

        if (!existingValue) {
          element.setAttribute(attribute, value);
        }
      }
    }]);

    return Component;
  }();
  /******************************************************************************
   * Copyright (C) 2018 The Trustees of Indiana University
   * SPDX-License-Identifier: BSD-3-Clause
   *****************************************************************************/


  var keyCodes = {
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

  var SUPPRESS_EVENT = true;
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

  var Accordion = /*#__PURE__*/function (_Component) {
    _inherits(Accordion, _Component);

    var _super = _createSuper(Accordion);

    function Accordion() {
      _classCallCheck(this, Accordion);

      return _super.apply(this, arguments);
    }

    _createClass(Accordion, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the accordion's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-accordion]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the accordion.
           ***********************************************************************/
          init: function init() {
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
          _initSelectors: function _initSelectors() {
            this.triggerAttribute = 'data-rvt-accordion-trigger';
            this.panelAttribute = 'data-rvt-accordion-panel';
            this.triggerSelector = "[".concat(this.triggerAttribute, "]");
            this.panelSelector = "[".concat(this.panelAttribute, "]");
          },

          /************************************************************************
           * Initializes accordion child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.triggers = Array.from(this.element.querySelectorAll(this.triggerSelector));
            this.panels = Array.from(this.element.querySelectorAll(this.panelSelector));
          },

          /************************************************************************
           * Initializes accordion attributes.
           *
           * @private
           ***********************************************************************/
          _initAttributes: function _initAttributes() {
            this._assignComponentElementIds();

            this._setTriggerButtonTypeAttributes();
          },

          /************************************************************************
           * Assigns random IDs to the accordion component's child elements if
           * IDs were not already specified in the markup.
           *
           * @private
           ***********************************************************************/
          _assignComponentElementIds: function _assignComponentElementIds() {
            this._assignTriggerIds();

            this._assignPanelIds();
          },

          /************************************************************************
           * Assigns a random ID to each trigger.
           *
           * @private
           ***********************************************************************/
          _assignTriggerIds: function _assignTriggerIds() {
            var _this = this;

            this.triggers.forEach(function (trigger) {
              var id = Component.generateUniqueId();
              Component.setAttributeIfNotSpecified(trigger, _this.triggerAttribute, id);
              Component.setAttributeIfNotSpecified(trigger, 'id', "".concat(id, "-label"));
            });
          },

          /************************************************************************
           * Assigns a random ID to each panel.
           *
           * @private
           ***********************************************************************/
          _assignPanelIds: function _assignPanelIds() {
            var numPanels = this.panels.length;

            for (var i = 0; i < numPanels; i++) {
              var trigger = this.triggers[i];
              var panel = this.panels[i];
              var panelId = trigger.getAttribute(this.triggerAttribute);
              Component.setAttributeIfNotSpecified(panel, this.panelAttribute, panelId);
              Component.setAttributeIfNotSpecified(panel, 'id', panelId);
              Component.setAttributeIfNotSpecified(panel, 'aria-labelledby', "".concat(panelId, "-label"));
            }
          },

          /************************************************************************
           * Adds `type="button"` to each trigger's button element.
           *
           * @private
           ***********************************************************************/
          _setTriggerButtonTypeAttributes: function _setTriggerButtonTypeAttributes() {
            this.triggers.forEach(function (trigger) {
              Component.setAttributeIfNotSpecified(trigger, 'type', 'button');
            });
          },

          /************************************************************************
           * Sets the initial state of the accordion's panels.
           *
           * @private
           ***********************************************************************/
          _setInitialPanelStates: function _setInitialPanelStates() {
            this._shouldOpenAllPanels() ? this._openAllPanels() : this._setPanelDefaultStates();
          },

          /************************************************************************
           * Returns true if all panels should be opened when the component is
           * added to the DOM.
           *
           * @private
           * @returns {boolean} Panels should be opened
           ***********************************************************************/
          _shouldOpenAllPanels: function _shouldOpenAllPanels() {
            return this.element.hasAttribute('data-rvt-accordion-open-all');
          },

          /************************************************************************
           * Opens all panels.
           *
           * @private
           ***********************************************************************/
          _openAllPanels: function _openAllPanels() {
            var _this2 = this;

            this.panels.forEach(function (panel) {
              _this2.open(panel.getAttribute(_this2.panelAttribute), SUPPRESS_EVENT);
            });
          },

          /************************************************************************
           * Sets the default open/closed state for each panel based on the ARIA
           * attributes set by the developer.
           *
           * @private
           ***********************************************************************/
          _setPanelDefaultStates: function _setPanelDefaultStates() {
            var _this3 = this;

            this.panels.forEach(function (panel) {
              _this3._panelShouldBeOpen(panel) ? _this3.open(panel.getAttribute(_this3.panelAttribute), SUPPRESS_EVENT) : _this3.close(panel.getAttribute(_this3.panelAttribute), SUPPRESS_EVENT);
            });
          },

          /************************************************************************
           * Returns true if the given panel element should be opened on page load.
           *
           * @private
           * @param {HTMLElement} panel - Panel DOM element
           * @returns {boolean} Panel should be opened
           ***********************************************************************/
          _panelShouldBeOpen: function _panelShouldBeOpen(panel) {
            return panel.hasAttribute('data-rvt-accordion-panel-init');
          },

          /************************************************************************
           * Called when the accordion is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);
          },

          /************************************************************************
           * Called when the accordion is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);
          },

          /************************************************************************
           * Handles click events broadcast to the accordion.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (!this._eventOriginatedInsideTrigger(event)) {
              return;
            }

            this._setTriggerToToggle(event);

            this._triggerToToggleIsOpen() ? this.close(this.triggerToToggleId) : this.open(this.triggerToToggleId);
          },

          /************************************************************************
           * Returns true if the given event originated inside one of the
           * accordion's panel triggers.
           *
           * @private
           * @param {Event} event - Event
           * @returns {boolean} Event originated inside panel trigger
           ***********************************************************************/
          _eventOriginatedInsideTrigger: function _eventOriginatedInsideTrigger(event) {
            return event.target.closest(this.triggerSelector);
          },

          /************************************************************************
           * Sets references to the panel trigger to be toggled by the given click
           * event. These references are used by other click handler submethods.
           *
           * @private
           * @param {Event} event - Click event
           ***********************************************************************/
          _setTriggerToToggle: function _setTriggerToToggle(event) {
            this.triggerToToggle = event.target.closest(this.triggerSelector);
            this.triggerToToggleId = this.triggerToToggle.getAttribute(this.triggerAttribute);
          },

          /************************************************************************
           * Returns true if the panel trigger to toggle is already open.
           *
           * @private
           * @returns {boolean} Click originated inside panel trigger
           ***********************************************************************/
          _triggerToToggleIsOpen: function _triggerToToggleIsOpen() {
            return this.triggerToToggle.getAttribute('aria-expanded') === 'true';
          },

          /************************************************************************
           * Handles keydown events broadcast to the accordion.
           *
           * @param {Event} event - Keydown event
           ***********************************************************************/
          onKeydown: function onKeydown(event) {
            if (!this._eventOriginatedInsideTrigger(event)) {
              return;
            }

            this._setNeighboringTriggerIndexes(event);

            switch (event.keyCode) {
              case keyCodes.up:
                event.preventDefault();

                this._focusPreviousTrigger();

                break;

              case keyCodes.down:
                event.preventDefault();

                this._focusNextTrigger();

                break;

              case keyCodes.home:
                this._focusFirstTrigger();

                break;

              case keyCodes.end:
                this._focusLastTrigger();

                break;
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
          _setNeighboringTriggerIndexes: function _setNeighboringTriggerIndexes(event) {
            var currentTrigger = event.target.closest(this.triggerSelector);
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
          _focusPreviousTrigger: function _focusPreviousTrigger() {
            this.triggers[this.previousTriggerIndex] ? this.triggers[this.previousTriggerIndex].focus() : this.triggers[this.triggers.length - 1].focus();
          },

          /************************************************************************
           * Moves focus to the panel trigger after the one that currently has
           * focus. If focus is currently on the last trigger, move focus to the
           * first trigger.
           *
           * @private
           ***********************************************************************/
          _focusNextTrigger: function _focusNextTrigger() {
            this.triggers[this.nextTriggerIndex] ? this.triggers[this.nextTriggerIndex].focus() : this.triggers[0].focus();
          },

          /************************************************************************
           * Moves focus to the first panel trigger.
           *
           * @private
           ***********************************************************************/
          _focusFirstTrigger: function _focusFirstTrigger() {
            this.triggers[0].focus();
          },

          /************************************************************************
           * Moves focus to the last panel trigger.
           *
           * @private
           ***********************************************************************/
          _focusLastTrigger: function _focusLastTrigger() {
            this.triggers[this.triggers.length - 1].focus();
          },

          /************************************************************************
           * Opens the panel with the given data-rvt-accordion-panel ID value.
           *
           * @param {string} childMenuId - Panel ID
           * @param {boolean} suppressEvent - Suppress open event
           ***********************************************************************/
          open: function open(panelId) {
            var suppressEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this._setPanelToOpen(panelId);

            if (!this._panelToOpenExists()) {
              console.warn("No such accordion panel '".concat(panelId, "' in open()"));
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('AccordionOpened', this.panelToOpen)) {
              return;
            }

            this._openPanel();
          },

          /************************************************************************
           * Sets references to the panel to be opened. These references are used
           * by other submethods.
           *
           * @private
           * @param {string} panelId - Panel ID
           ***********************************************************************/
          _setPanelToOpen: function _setPanelToOpen(panelId) {
            this.triggerToOpen = this.element.querySelector("[".concat(this.triggerAttribute, " = \"").concat(panelId, "\"]"));
            this.panelToOpen = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(panelId, "\"]"));
          },

          /************************************************************************
           * Returns true if the panel to open actually exists in the DOM.
           *
           * @private
           * @returns {boolean} Panel to open exists
           ***********************************************************************/
          _panelToOpenExists: function _panelToOpenExists() {
            return this.panelToOpen;
          },

          /************************************************************************
           * Expands the accordion panel to be opened.
           *
           * @private
           ***********************************************************************/
          _openPanel: function _openPanel() {
            this.triggerToOpen.setAttribute('aria-expanded', 'true');
            this.panelToOpen.removeAttribute('hidden');
          },

          /************************************************************************
           * Closes the panel with the given data-rvt-accordion-panel ID value.
           *
           * @param {string} childMenuId - Panel ID
           * @param {boolean} suppressEvent - Suppress close event
           ***********************************************************************/
          close: function close(panelId) {
            var suppressEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this._setPanelToClose(panelId);

            if (!this._panelToCloseExists()) {
              console.warn("No such accordion panel '".concat(panelId, "' in close()"));
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('AccordionClosed', this.panelToClose)) {
              return;
            }

            this._closePanel();
          },

          /************************************************************************
           * Sets references to the panel to be closed. These references are used
           * by other submethods.
           *
           * @private
           * @param {string} panelId - Panel ID
           ***********************************************************************/
          _setPanelToClose: function _setPanelToClose(panelId) {
            this.triggerToClose = this.element.querySelector("[".concat(this.triggerAttribute, " = \"").concat(panelId, "\"]"));
            this.panelToClose = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(panelId, "\"]"));
          },

          /************************************************************************
           * Returns true if the panel to close actually exists in the DOM.
           *
           * @private
           * @returns {boolean} Panel to close exists
           ***********************************************************************/
          _panelToCloseExists: function _panelToCloseExists() {
            return this.panelToClose;
          },

          /************************************************************************
           * Collapses the accordion panel to be closed.
           *
           * @private
           ***********************************************************************/
          _closePanel: function _closePanel() {
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
          _eventDispatched: function _eventDispatched(name, panel) {
            var dispatched = Component.dispatchCustomEvent(name, this.element, {
              panel: panel
            });
            return dispatched;
          }
        };
      }
    }]);

    return Accordion;
  }(Component);
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


  var Alert = /*#__PURE__*/function (_Component2) {
    _inherits(Alert, _Component2);

    var _super2 = _createSuper(Alert);

    function Alert() {
      _classCallCheck(this, Alert);

      return _super2.apply(this, arguments);
    }

    _createClass(Alert, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the alert's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-alert]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the alert.
           ***********************************************************************/
          init: function init() {
            this._initSelectors();

            this._initElements();

            Component.bindMethodToDOMElement(this, 'dismiss', this.dismiss);
          },

          /************************************************************************
           * Initializes alert child element selectors.
           *
           * @private
           ***********************************************************************/
          _initSelectors: function _initSelectors() {
            this.closeButtonAttribute = 'data-rvt-alert-close';
            this.closeButtonSelector = "[".concat(this.closeButtonAttribute, "]");
          },

          /************************************************************************
           * Initializes alert child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.closeButton = this.element.querySelector(this.closeButtonSelector);
          },

          /************************************************************************
           * Called when the alert is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
          },

          /************************************************************************
           * Called when the alert is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
          },

          /************************************************************************
           * Handles click events broadcast to the alert.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (this._clickOriginatedInsideCloseButton(event)) {
              this.dismiss();
            }
          },

          /************************************************************************
           * Returns true if the given click event originated inside the
           * alert's close button.
           *
           * @private
           * @param {Event} event - Click event
           * @returns {boolean} Click originated inside content area
           ***********************************************************************/
          _clickOriginatedInsideCloseButton: function _clickOriginatedInsideCloseButton(event) {
            return this.closeButton && this.closeButton.contains(event.target);
          },

          /************************************************************************
           * Dismisses the alert.
           ***********************************************************************/
          dismiss: function dismiss() {
            if (!this._dismissEventDispatched()) {
              return;
            }

            this.element.remove();
          },

          /************************************************************************
           * Returns true if the custom "dismiss" event was successfully
           * dispatched.
           *
           * @private
           * @returns {boolean} Event successfully dispatched
           ***********************************************************************/
          _dismissEventDispatched: function _dismissEventDispatched() {
            var dispatched = Component.dispatchCustomEvent('AlertDismissed', this.element);
            return dispatched;
          }
        };
      }
    }]);

    return Alert;
  }(Component);
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


  var Dialog = /*#__PURE__*/function (_Component3) {
    _inherits(Dialog, _Component3);

    var _super3 = _createSuper(Dialog);

    function Dialog() {
      _classCallCheck(this, Dialog);

      return _super3.apply(this, arguments);
    }

    _createClass(Dialog, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the dialog's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-dialog]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the dialog.
           ***********************************************************************/
          init: function init() {
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
          _initSelectors: function _initSelectors() {
            this.dialogAttribute = 'data-rvt-dialog';
            this.mountElementAttribute = 'data-rvt-dialog-mount';
            this.triggerAttribute = 'data-rvt-dialog-trigger';
            this.closeButtonAttribute = 'data-rvt-dialog-close';
            this.modalAttribute = 'data-rvt-dialog-modal';
            this.disablePageInteractionAttribute = 'data-rvt-dialog-disable-page-interaction';
            this.mountElementSelector = "[".concat(this.mountElementAttribute, "]");
            this.triggerSelector = "[".concat(this.triggerAttribute, "]");
            this.closeButtonSelector = "[".concat(this.closeButtonAttribute, "]");
          },

          /************************************************************************
           * Initializes dialog child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            var dialogId = this.element.getAttribute(this.dialogAttribute);
            var mountElement = document.querySelector(this.mountElementSelector);
            this.mountElement = mountElement !== null && mountElement !== void 0 ? mountElement : document.body; // Trigger buttons are outside the actual dialog element (this.element)
            // and more than one dialog might be on a page. For this reason, the
            // selector checks that the trigger attribute value matches the dialog's
            // ID to ensure a trigger is associated with this dialog instance.
            // Otherwise, trigger buttons associated with other dialogs would be
            // mistakenly associated with the current dialog instance and included
            // in this.triggerButtons.

            this.triggerButtons = Array.from(document.querySelectorAll("[".concat(this.triggerAttribute, " = \"").concat(dialogId, "\"]")));
            this.closeButtons = Array.from(this.element.querySelectorAll(this.closeButtonSelector));
            this.lastClickedTriggerButton = null;
          },

          /************************************************************************
           * Initializes dialog state properties.
           *
           * @private
           ***********************************************************************/
          _initProperties: function _initProperties() {
            this.id = this.element.getAttribute('id');
            this.isOpen = false;
            this.isModal = this.element.hasAttribute(this.modalAttribute);
          },

          /************************************************************************
           * Initializes dialog attributes.
           *
           * @private
           ***********************************************************************/
          _initAttributes: function _initAttributes() {
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
          _makeDialogFirstElementInBody: function _makeDialogFirstElementInBody() {
            this.mountElement.insertBefore(this.element, this.mountElement.firstElementChild);
          },

          /************************************************************************
           * Binds the dialog instance to handler methods for relevant events that
           * originate outside the component's root DOM element.
           *
           * @private
           ***********************************************************************/
          _bindExternalEventHandlers: function _bindExternalEventHandlers() {
            this._onTriggerClick = this._onTriggerClick.bind(this);
            this._onDocumentClick = this._onDocumentClick.bind(this);
          },

          /************************************************************************
           * Called when the dialog is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);

            this._addTriggerEventHandlers();

            this._addDocumentEventHandlers();

            if (this._shouldBeOpenByDefault()) {
              this.open();
            }
          },

          /************************************************************************
           * Returns true if the dialog should be open on page load.
           *
           * @private
           * @returns {boolean} Dialog should be open
           ***********************************************************************/
          _shouldBeOpenByDefault: function _shouldBeOpenByDefault() {
            return this.element.hasAttribute('data-rvt-dialog-open-on-init');
          },

          /************************************************************************
           * Adds event handlers for the trigger button. The trigger button event
           * handlers must be set manually rather than using onClick because the
           * trigger button exists outside the dialog component's root DOM element.
           *
           * @private
           ***********************************************************************/
          _addTriggerEventHandlers: function _addTriggerEventHandlers() {
            var _this4 = this;

            if (!this._hasTriggerButton()) {
              return;
            }

            this.triggerButtons.forEach(function (button) {
              button.addEventListener('click', _this4._onTriggerClick, false);
            });
          },

          /************************************************************************
           * Returns true if the dialog has an associated trigger button.
           *
           * @private
           * @returns {boolean} Dialog has trigger button
           ***********************************************************************/
          _hasTriggerButton: function _hasTriggerButton() {
            return this.triggerButtons.length;
          },

          /************************************************************************
           * Adds event handlers to the document that are related to the dialog.
           *
           * @private
           ***********************************************************************/
          _addDocumentEventHandlers: function _addDocumentEventHandlers() {
            document.addEventListener('click', this._onDocumentClick, false);
          },

          /************************************************************************
           * Called when the dialog is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
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
          _removeTriggerEventHandlers: function _removeTriggerEventHandlers() {
            var _this5 = this;

            if (!this._hasTriggerButton()) {
              return;
            }

            this.triggerButtons.forEach(function (button) {
              button.removeEventListener('click', _this5._onTriggerClick, false);
            });
          },

          /************************************************************************
           * Removes document event handlers related to the dialog.
           *
           * @private
           ***********************************************************************/
          _removeDocumentEventHandlers: function _removeDocumentEventHandlers() {
            document.removeEventListener('click', this._onDocumentClick, false);
          },

          /************************************************************************
           * Handles click events broadcast to the dialog. For click events related
           * to the trigger button and document, see the _onTriggerClick() and
           * _onDocumentClick() methods, respectively.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (!this._isOpen()) {
              return;
            }

            if (!this._clickOriginatedInCloseButton(event)) {
              return;
            }

            this.close();
          },

          /************************************************************************
           * Returns true if the dialog is open.
           *
           * @private
           * @returns {boolean} Dialog is open
           ***********************************************************************/
          _isOpen: function _isOpen() {
            return this.isOpen;
          },

          /************************************************************************
           * Returns true if the given click event originated inside one of the
           * dialog's "close" buttons.
           *
           * @private
           * @param {Event} event - Click event
           * @returns {boolean} Click originated inside close button
           ***********************************************************************/
          _clickOriginatedInCloseButton: function _clickOriginatedInCloseButton(event) {
            return event.target.closest(this.closeButtonSelector);
          },

          /************************************************************************
           * Handles click events broadcast to the dialog's trigger button.
           *
           * @private
           * @param {Event} event - Click event
           ***********************************************************************/
          _onTriggerClick: function _onTriggerClick(event) {
            this._setLastClickedTriggerButton(event);

            this._isOpen() ? this.close() : this.open();
          },

          /************************************************************************
           * Saves a reference to the last clicked trigger button.
           *
           * @private
           * @param {Event} event - Trigger button click event
           ***********************************************************************/
          _setLastClickedTriggerButton: function _setLastClickedTriggerButton(event) {
            this.lastClickedTriggerButton = event.target.closest(this.triggerSelector);
          },

          /************************************************************************
           * Handles click events broadcast to the document that are related to
           * the dialog but did not originate inside the dialog itself.
           *
           * @private
           * @param {Event} event - Click event
           ***********************************************************************/
          _onDocumentClick: function _onDocumentClick(event) {
            if (this._clickOriginatedInsideDialogOrTrigger(event)) {
              return;
            }

            if (!this._isOpen()) {
              return;
            }

            if (this._shouldCloseOnClickOutside()) {
              return;
            }

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
          _clickOriginatedInsideDialogOrTrigger: function _clickOriginatedInsideDialogOrTrigger(event) {
            // This method uses event.composedPath().some() to walk up the DOM tree
            // to determine if the event target was within the dialog instead of
            // this.element.contains(). It does so to prevent this method from
            // returning a false negative if a click event originating inside
            // the dialog removed its target from the DOM.
            return event.target.closest(this.triggerSelector) || event.composedPath().some(function (el) {
              return el.dataset && 'rvtDialog' in el.dataset;
            });
          },

          /************************************************************************
           * Returns true if the dialog should close if the user clicks outside
           * of the dialog.
           *
           * @private
           * @returns {boolean} Dialog should close on click outside
           ***********************************************************************/
          _shouldCloseOnClickOutside: function _shouldCloseOnClickOutside() {
            return !this.isModal;
          },

          /************************************************************************
           * Handles keydown events broadcast to the dialog.
           *
           * @param {Event} event - Keydown event
           ***********************************************************************/
          onKeydown: function onKeydown(event) {
            switch (event.keyCode) {
              case keyCodes.tab:
                this._setFocusableChildElements();

                this._shiftKeyPressed(event) ? this._handleBackwardTab(event) : this._handleForwardTab(event);
                break;

              case keyCodes.escape:
                if (!this._shouldCloseOnClickOutside()) {
                  this.close();
                }

                break;
            }
          },

          /************************************************************************
           * Sets the dialog's list of focusable child elements.
           *
           * @private
           ***********************************************************************/
          _setFocusableChildElements: function _setFocusableChildElements() {
            this.focusableChildElements = this.element.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="-1"]');
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
          _shiftKeyPressed: function _shiftKeyPressed(event) {
            return event.shiftKey;
          },

          /************************************************************************
           * Handles the user tabbing backward through the dialog, trapping focus
           * within the dialog if necessary.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _handleBackwardTab: function _handleBackwardTab(event) {
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
          _shouldTrapBackwardTabFocus: function _shouldTrapBackwardTabFocus() {
            return document.activeElement === this.firstFocusableChildElement || document.activeElement === this.element;
          },

          /************************************************************************
           * Handles the user tabbing forward through the dialog, trapping focus
           * within the dialog if necessary.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _handleForwardTab: function _handleForwardTab(event) {
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
          _shouldTrapForwardTabFocus: function _shouldTrapForwardTabFocus() {
            return document.activeElement === this.lastFocusableChildElement;
          },

          /************************************************************************
           * Opens the dialog.
           * 
           * @param {boolean} suppressEvent - Suppress open event
           ***********************************************************************/
          open: function open() {
            var suppressEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this._isOpen()) {
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('DialogOpened')) {
              return;
            }

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
          _setOpenState: function _setOpenState() {
            this.isOpen = true;
            this.element.removeAttribute('hidden');

            if (this.isModal) {
              document.body.classList.add('rvt-dialog-prevent-scroll');
            }
          },

          /************************************************************************
           * Moves focus to the dialog.
           ***********************************************************************/
          focusDialog: function focusDialog() {
            this.element.focus();
          },

          /************************************************************************
           * Returns true if interaction should be disabled for page elements
           * behind the dialog.
           *
           * @private
           * @returns {boolean} Should disable page interaction
           ***********************************************************************/
          _shouldDisablePageInteraction: function _shouldDisablePageInteraction() {
            return this.element.hasAttribute(this.disablePageInteractionAttribute);
          },

          /************************************************************************
           * Disables interaction with page elements behind the dialog.
           *
           * @private
           ***********************************************************************/
          _disablePageInteraction: function _disablePageInteraction() {
            this._getDirectChildrenOfBodyExceptDialog().forEach(function (child) {
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
          _getDirectChildrenOfBodyExceptDialog: function _getDirectChildrenOfBodyExceptDialog() {
            var _this6 = this;

            var directChildrenOfBody = Array.from(this.mountElement.children);
            return directChildrenOfBody.filter(function (el) {
              return !el.hasAttribute(_this6.dialogAttribute);
            });
          },

          /************************************************************************
           * Closes the dialog.
           * 
           * @param {boolean} suppressEvent - Suppress close event
           ***********************************************************************/
          close: function close() {
            var suppressEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this._isOpen()) {
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('DialogClosed')) {
              return;
            }

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
          _setClosedState: function _setClosedState() {
            this.isOpen = false;
            this.element.setAttribute('hidden', '');
            document.body.classList.remove('rvt-dialog-prevent-scroll');
          },

          /************************************************************************
           * Enables interaction with page elements behind the dialog.
           *
           * @private
           ***********************************************************************/
          _enablePageInteraction: function _enablePageInteraction() {
            this._getDirectChildrenOfBodyExceptDialog().forEach(function (child) {
              child.removeAttribute('inert');
              child.removeAttribute('aria-hidden');
            });
          },

          /************************************************************************
           * Moves focus to the dialog's trigger button.
           ***********************************************************************/
          focusTrigger: function focusTrigger() {
            if (!this._hasTriggerButton()) {
              console.warn("Could not find a trigger button for dialog ID '".concat(this.id, "'"));
              return;
            }

            this.lastClickedTriggerButton && document.body.contains(this.lastClickedTriggerButton) ? this.lastClickedTriggerButton.focus() : this.triggerButtons[0].focus();
          },

          /************************************************************************
           * Returns true if the custom event with the given name was successfully
           * dispatched.
           *
           * @private
           * @param {string} name - Event name
           * @returns {boolean} Event successfully dispatched
           ***********************************************************************/
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          }
        };
      }
    }]);

    return Dialog;
  }(Component);
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


  var Disclosure = /*#__PURE__*/function (_Component4) {
    _inherits(Disclosure, _Component4);

    var _super4 = _createSuper(Disclosure);

    function Disclosure() {
      _classCallCheck(this, Disclosure);

      return _super4.apply(this, arguments);
    }

    _createClass(Disclosure, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the disclosure's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-disclosure]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the disclosure.
           ***********************************************************************/
          init: function init() {
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
          _initSelectors: function _initSelectors() {
            this.toggleAttribute = 'data-rvt-disclosure-toggle';
            this.targetAttribute = 'data-rvt-disclosure-target';
            this.toggleSelector = "[".concat(this.toggleAttribute, "]");
            this.targetSelector = "[".concat(this.targetAttribute, "]");
          },

          /************************************************************************
           * Initializes disclosure child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.toggleElement = this.element.querySelector(this.toggleSelector);
            this.targetElement = this.element.querySelector(this.targetSelector);
          },

          /************************************************************************
           * Initializes disclosure state properties.
           *
           * @private
           ***********************************************************************/
          _initProperties: function _initProperties() {
            this.isOpen = false;
          },

          /************************************************************************
           * Sets the initial state of the disclosure.
           *
           * @private
           ***********************************************************************/
          _setInitialDisclosureState: function _setInitialDisclosureState() {
            if (this._shouldBeOpenByDefault()) {
              this.open(SUPPRESS_EVENT);
            }
          },

          /************************************************************************
           * Returns true if the disclosure should be open by default.
           *
           * @private
           ***********************************************************************/
          _shouldBeOpenByDefault: function _shouldBeOpenByDefault() {
            return this.element.hasAttribute('data-rvt-disclosure-open-on-init');
          },

          /************************************************************************
           * Removes the arrow icon from the tab order.
           *
           * @private
           ***********************************************************************/
          _removeIconFromTabOrder: function _removeIconFromTabOrder() {
            var icon = this.element.querySelector('svg');

            if (icon) {
              icon.setAttribute('focusable', 'false');
            }
          },

          /************************************************************************
           * Binds the disclosure instance to handler methods for relevant events
           * that originate outside the component's root DOM element.
           *
           * @private
           ***********************************************************************/
          _bindExternalEventHandlers: function _bindExternalEventHandlers() {
            this._onDocumentClick = this._onDocumentClick.bind(this);
          },

          /************************************************************************
           * Called when the disclosure is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
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
          _shouldAddDocumentEventHandlers: function _shouldAddDocumentEventHandlers() {
            return this.element.hasAttribute('data-rvt-close-click-outside');
          },

          /************************************************************************
           * Adds event handlers to the document that are related to the
           * disclosure.
           *
           * @private
           ***********************************************************************/
          _addDocumentEventHandlers: function _addDocumentEventHandlers() {
            document.addEventListener('click', this._onDocumentClick, false);
          },

          /************************************************************************
           * Called when the disclosure is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);

            this._removeDocumentEventHandlers();
          },

          /************************************************************************
           * Removes document event handlers related to the disclosure.
           *
           * @private
           ***********************************************************************/
          _removeDocumentEventHandlers: function _removeDocumentEventHandlers() {
            document.removeEventListener('click', this._onDocumentClick, false);
          },

          /************************************************************************
           * Opens the disclosure.
           * 
           * @param {boolean} suppressEvent - Suppress open event
           ***********************************************************************/
          open: function open() {
            var suppressEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this._isDisabled()) {
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('DisclosureOpened')) {
              return;
            }

            this._setOpenState();
          },

          /************************************************************************
           * Returns true if the disclosure toggle is disabled.
           *
           * @private
           * @returns {boolean} Disabled state
           ***********************************************************************/
          _isDisabled: function _isDisabled() {
            return this.toggleElement.hasAttribute('disabled');
          },

          /************************************************************************
           * Sets the disclosure's state properties to represent it being open.
           *
           * @private
           ***********************************************************************/
          _setOpenState: function _setOpenState() {
            this.toggleElement.setAttribute('aria-expanded', 'true');
            this.targetElement.removeAttribute('hidden');
            this.isOpen = true;
          },

          /************************************************************************
           * Closes the disclosure.
           * 
           * @param {boolean} suppressEvent - Suppress open event
           ***********************************************************************/
          close: function close() {
            var suppressEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this._isOpen()) {
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('DisclosureClosed')) {
              return;
            }

            this._setClosedState();
          },

          /************************************************************************
           * Returns true if the disclosure is open.
           *
           * @private
           * @returns {boolean} Disclosure open state
           ***********************************************************************/
          _isOpen: function _isOpen() {
            return this.isOpen;
          },

          /************************************************************************
           * Sets the disclosure's state properties to represent it being closed.
           *
           * @private
           ***********************************************************************/
          _setClosedState: function _setClosedState() {
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
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          },

          /************************************************************************
           * Handles click events broadcast to the disclosure.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (!this._clickOriginatedInsideDisclosureToggle(event)) {
              return;
            }

            this._isOpen() ? this.close() : this.open();
          },

          /************************************************************************
           * Returns true if the given click event originated inside the
           * disclosure's toggle element.
           *
           * @private
           * @param {Event} event - Click event
           * @returns {boolean} Click originated inside toggle element
           ***********************************************************************/
          _clickOriginatedInsideDisclosureToggle: function _clickOriginatedInsideDisclosureToggle(event) {
            return this.toggleElement.contains(event.target);
          },

          /************************************************************************
           * Handles click events broadcast to the document that are related to
           * the disclosure but did not originate inside the disclosure itself.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          _onDocumentClick: function _onDocumentClick(event) {
            if (!this._clickOriginatedOutsideDisclosure(event)) {
              return;
            }

            if (!this._isOpen()) {
              return;
            }

            this.close();
          },

          /************************************************************************
           * Returns true if the click event originated inside the disclosure.
           *
           * @param {Event} event - Click event
           * @returns {boolean} Event originated outside disclosure
           ***********************************************************************/
          _clickOriginatedOutsideDisclosure: function _clickOriginatedOutsideDisclosure(event) {
            return !this.element.contains(event.target);
          },

          /************************************************************************
           * Handles keydown events broadcast to the disclosure.
           *
           * @param {Event} event - Keydown event
           ***********************************************************************/
          onKeydown: function onKeydown(event) {
            if (event.keyCode === keyCodes.escape) {
              this.close();
              this.toggleElement.focus();
            }
          }
        };
      }
    }]);

    return Disclosure;
  }(Component);
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


  var Dropdown = /*#__PURE__*/function (_Component5) {
    _inherits(Dropdown, _Component5);

    var _super5 = _createSuper(Dropdown);

    function Dropdown() {
      _classCallCheck(this, Dropdown);

      return _super5.apply(this, arguments);
    }

    _createClass(Dropdown, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the dropdown's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-dropdown]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the dropdown.
           ***********************************************************************/
          init: function init() {
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
          _initSelectors: function _initSelectors() {
            this.toggleAttribute = 'data-rvt-dropdown-toggle';
            this.menuAttribute = 'data-rvt-dropdown-menu';
            this.toggleSelector = "[".concat(this.toggleAttribute, "]");
            this.menuSelector = "[".concat(this.menuAttribute, "]");
          },

          /************************************************************************
           * Initializes dropdown child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.toggleElement = this.element.querySelector(this.toggleSelector);
            this.menuElement = this.element.querySelector(this.menuSelector);
          },

          /************************************************************************
           * Initializes dropdown attributes.
           *
           * @private
           ***********************************************************************/
          _initAttributes: function _initAttributes() {
            this._assignComponentElementIds();

            this._setAriaAttributes();
          },

          /************************************************************************
           * Assigns a random ID to the dropdown component if an ID was not
           * already specified in the markup.
           *
           * @private
           ***********************************************************************/
          _assignComponentElementIds: function _assignComponentElementIds() {
            var id = Component.generateUniqueId();
            Component.setAttributeIfNotSpecified(this.toggleElement, this.toggleAttribute, id);
            Component.setAttributeIfNotSpecified(this.menuElement, this.menuAttribute, id);
            Component.setAttributeIfNotSpecified(this.menuElement, 'id', id);
          },

          /************************************************************************
           * Sets the dropdown component's ARIA attributes.
           *
           * @private
           ***********************************************************************/
          _setAriaAttributes: function _setAriaAttributes() {
            this.toggleElement.setAttribute('aria-haspopup', true);
            this.toggleElement.setAttribute('aria-expanded', false);
          },

          /************************************************************************
           * Initializes dropdown state properties.
           *
           * @private
           ***********************************************************************/
          _initProperties: function _initProperties() {
            this.isOpen = false;
          },

          /************************************************************************
           * Initializes a list of menu items in the dropdown.
           *
           * @private
           ***********************************************************************/
          _initMenuItems: function _initMenuItems() {
            var focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
            this.menuItems = Array.from(this.menuElement.querySelectorAll(focusableElements));
            this.firstMenuItem = this.menuItems[0];
            this.lastMenuItem = this.menuItems[this.menuItems.length - 1];
          },

          /************************************************************************
           * Removes the arrow icon from the tab order.
           *
           * @private
           ***********************************************************************/
          _removeIconFromTabOrder: function _removeIconFromTabOrder() {
            var icon = this.element.querySelector('svg');

            if (icon) {
              icon.setAttribute('focusable', 'false');
            }
          },

          /************************************************************************
           * Binds the dropdown instance to handler methods for relevant events
           * that originate outside the component's root DOM element.
           *
           * @private
           ***********************************************************************/
          _bindExternalEventHandlers: function _bindExternalEventHandlers() {
            this._onDocumentClick = this._onDocumentClick.bind(this);
          },

          /************************************************************************
           * Called when the dropdown is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            var _this7 = this;

            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this, function () {
              return _this7._initMenuItems();
            });

            this._addDocumentEventHandlers();
          },

          /************************************************************************
           * Adds event handlers to the document that are related to the dropdown.
           *
           * @private
           ***********************************************************************/
          _addDocumentEventHandlers: function _addDocumentEventHandlers() {
            document.addEventListener('click', this._onDocumentClick, false);
          },

          /************************************************************************
           * Called when the dropdown is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);

            this._removeDocumentEventHandlers();
          },

          /************************************************************************
           * Removes document event handlers related to the dropdown.
           *
           * @private
           ***********************************************************************/
          _removeDocumentEventHandlers: function _removeDocumentEventHandlers() {
            document.removeEventListener('click', this._onDocumentClick, false);
          },

          /************************************************************************
           * Opens the dropdown.
           ***********************************************************************/
          open: function open() {
            if (this._toggleElementIsDisabled()) {
              return;
            }

            if (!this._eventDispatched('DropdownOpened')) {
              return;
            }

            this._setOpenState();
          },

          /************************************************************************
           * Returns true if the dropdown is disabled.
           *
           * @private
           * @returns {boolean} Disabled state
           ***********************************************************************/
          _toggleElementIsDisabled: function _toggleElementIsDisabled() {
            return this.toggleElement.hasAttribute('disabled');
          },

          /************************************************************************
           * Sets the dropdown's state properties to represent it being open.
           *
           * @private
           ***********************************************************************/
          _setOpenState: function _setOpenState() {
            this.toggleElement.setAttribute('aria-expanded', 'true');
            this.menuElement.removeAttribute('hidden');
            this.firstMenuItem.focus();
            this.isOpen = true;
          },

          /************************************************************************
           * Closes the dropdown.
           ***********************************************************************/
          close: function close() {
            if (!this._isOpen()) {
              return;
            }

            if (!this._eventDispatched('DropdownClosed')) {
              return;
            }

            this._setClosedState();
          },

          /************************************************************************
           * Returns true if the dropdown is open.
           *
           * @private
           * @returns {boolean} Dropdown is open
           ***********************************************************************/
          _isOpen: function _isOpen() {
            return this.isOpen;
          },

          /************************************************************************
           * Sets the dropdown's state properties to represent it being closed.
           *
           * @private
           ***********************************************************************/
          _setClosedState: function _setClosedState() {
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
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          },

          /************************************************************************
           * Handles click events broadcast to the disclosure.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (this._eventOriginatedInsideMenu(event) || this._eventOriginatedInsideHyperlink(event)) {
              return;
            }

            this._isOpen() ? this.close() : this.open();
          },

          /************************************************************************
           * Returns true if the given event originated inside the dropdown's menu.
           *
           * @private
           * @param {Event} event - Event
           * @returns {boolean} Event originated inside menu
           ***********************************************************************/
          _eventOriginatedInsideMenu: function _eventOriginatedInsideMenu(event) {
            return this.menuElement.contains(event.target);
          },

          /************************************************************************
           * Returns true if the given event originated inside a hyperlink.
           *
           * @private
           * @param {Event} event - Event
           * @returns {boolean} Event originated inside hyperlink
           ***********************************************************************/
          _eventOriginatedInsideHyperlink: function _eventOriginatedInsideHyperlink(event) {
            return event.target.closest('a');
          },

          /************************************************************************
           * Handles click events broadcast to the document that are related to
           * the dropdown but did not originate inside the dropdown itself.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          _onDocumentClick: function _onDocumentClick(event) {
            if (!this._clickOriginatedOutsideDropdown(event)) {
              return;
            }

            if (!this._isOpen()) {
              return;
            }

            this.close();
          },

          /************************************************************************
           * Returns true if the click event originated outside the dropdown.
           *
           * @param {Event} event - Click event
           * @returns {boolean} Event originated outside dropdown
           ***********************************************************************/
          _clickOriginatedOutsideDropdown: function _clickOriginatedOutsideDropdown(event) {
            return !this.element.contains(event.target);
          },

          /************************************************************************
           * Handles keydown events broadcast to the dropdown.
           *
           * @param {Event} event - Keydown event
           ***********************************************************************/
          onKeydown: function onKeydown(event) {
            switch (event.keyCode) {
              case keyCodes.escape:
                this._handleEscapeKey();

                break;

              case keyCodes.up:
                event.preventDefault();

                this._handleUpKey(event);

                break;

              case keyCodes.down:
                event.preventDefault();

                this._handleDownKey(event);

                break;

              case keyCodes.tab:
                this._handleTabKey(event);

                break;
            }
          },

          /************************************************************************
           * Handles the user pressing the Escape key.
           *
           * @private
           ***********************************************************************/
          _handleEscapeKey: function _handleEscapeKey() {
            this.close();
            this.toggleElement.focus();
          },

          /************************************************************************
           * Handles the user pressing the Up arrow key.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _handleUpKey: function _handleUpKey(event) {
            event.preventDefault();

            if (!this._eventOriginatedInsideMenu(event)) {
              return;
            }

            this._focusPreviousMenuItem(event);
          },

          /************************************************************************
           * Moves focus to the previous menu item in response to the given
           * keydown event.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _focusPreviousMenuItem: function _focusPreviousMenuItem(event) {
            var currentMenuItemIndex = this._getCurrentMenuItemIndex(event);

            var previousItem = this.menuItems[currentMenuItemIndex - 1];

            if (!previousItem && this.lastMenuItem !== undefined) {
              return this.lastMenuItem.focus();
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
          _getCurrentMenuItemIndex: function _getCurrentMenuItemIndex(event) {
            for (var i = 0; i < this.menuItems.length; i++) {
              if (event.target == this.menuItems[i]) {
                return i;
              }
            }
          },

          /************************************************************************
           * Handles the user pressing the Down arrow key.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _handleDownKey: function _handleDownKey(event) {
            event.preventDefault();

            if (!this._isOpen()) {
              this.open();
            }

            this._eventOriginatedInsideMenu(event) ? this._focusNextMenuItem(event) : this.firstMenuItem.focus();
          },

          /************************************************************************
           * Moves focus to the next menu item in response to the given keydown
           * event.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _focusNextMenuItem: function _focusNextMenuItem(event) {
            var currentMenuItemIndex = this._getCurrentMenuItemIndex(event);

            var nextItem = this.menuItems[currentMenuItemIndex + 1];

            if (!nextItem) {
              return this.firstMenuItem.focus();
            }

            nextItem.focus();
          },

          /************************************************************************
           * Handles the user pressing the Down arrow key.
           *
           * @private
           * @param {Event} event - Keydown event
           ***********************************************************************/
          _handleTabKey: function _handleTabKey(event) {
            if (!this._eventOriginatedInsideMenu(event)) {
              return;
            }

            if (this._userTabbedOutOfLastMenuItem(event)) {
              this.close();
            }
          },

          /************************************************************************
           * Returns true if the user tabbed out of the last item in the dropdown
           * menu with the given keydown event.
           *
           * @private
           * @param {Event} event - Keydown event
           * @returns {boolean} User tabbed out of last menu item
           ***********************************************************************/
          _userTabbedOutOfLastMenuItem: function _userTabbedOutOfLastMenuItem(event) {
            return document.activeElement == this.lastMenuItem && !event.shiftKey;
          }
        };
      }
    }]);

    return Dropdown;
  }(Component);
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


  var FileInput = /*#__PURE__*/function (_Component6) {
    _inherits(FileInput, _Component6);

    var _super6 = _createSuper(FileInput);

    function FileInput() {
      _classCallCheck(this, FileInput);

      return _super6.apply(this, arguments);
    }

    _createClass(FileInput, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the file input's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-file-input]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the file input.
           ***********************************************************************/
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._initProperties();
          },

          /************************************************************************
           * Initializes file input child element selectors.
           *
           * @private
           ***********************************************************************/
          _initSelectors: function _initSelectors() {
            this.inputElementAttribute = 'data-rvt-file-input-button';
            this.previewElementAttribute = 'data-rvt-file-input-preview';
            this.inputElementSelector = "[".concat(this.inputElementAttribute, "]");
            this.previewElementSelector = "[".concat(this.previewElementAttribute, "]");
          },

          /************************************************************************
           * Initializes file input child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.inputElement = this.element.querySelector(this.inputElementSelector);
            this.previewElement = this.element.querySelector(this.previewElementSelector);
          },

          /************************************************************************
           * Initializes file input state properties.
           *
           * @private
           ***********************************************************************/
          _initProperties: function _initProperties() {
            this.defaultPreviewText = this.previewElement.textContent;
          },

          /************************************************************************
           * Called when the file input is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
          },

          /************************************************************************
           * Called when the file input is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
          },

          /************************************************************************
           * Handles change events broadcast to the file input.
           *
           * @param {Event} event - Change event
           ***********************************************************************/
          onChange: function onChange(event) {
            if (this._hasAttachedFiles()) {
              if (!this._attachEventDispatched()) {
                return;
              }

              this._hasMultipleAttachedFiles() ? this._showNumberOfAttachedFiles() : this._showAttachedFilename();
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
          _hasAttachedFiles: function _hasAttachedFiles() {
            return this.inputElement.files.length > 0;
          },

          /************************************************************************
           * Returns true if the "file attached" custom event was successfully
           * dispatched.
           *
           * @private
           * @returns {boolean} Event successfully dispatched
           ***********************************************************************/
          _attachEventDispatched: function _attachEventDispatched() {
            var files = Array.from(this.inputElement.files).map(function (f) {
              return f.name;
            });
            var dispatched = Component.dispatchCustomEvent('FileAttached', this.element, {
              files: files
            });
            return dispatched;
          },

          /************************************************************************
           * Returns true if more than one file is attached to the file input.
           *
           * @private
           * @returns {boolean} Has multiple attached files
           ***********************************************************************/
          _hasMultipleAttachedFiles: function _hasMultipleAttachedFiles() {
            return this.inputElement.files.length > 1;
          },

          /************************************************************************
           * Sets the file input preview text to show the number of attached files.
           *
           * @private
           ***********************************************************************/
          _showNumberOfAttachedFiles: function _showNumberOfAttachedFiles() {
            this.previewElement.textContent = this.inputElement.files.length + ' files selected';
          },

          /************************************************************************
           * Sets the file input preview text to show the name of the attached
           * file.
           *
           * @private
           ***********************************************************************/
          _showAttachedFilename: function _showAttachedFilename() {
            this.previewElement.textContent = this._getSanitizedFilename();
          },

          /************************************************************************
           * Sanitizes the name of the attached file for safe output.
           *
           * @private
           * @returns {string} Sanitized filename
           ***********************************************************************/
          _getSanitizedFilename: function _getSanitizedFilename() {
            return this.inputElement.files[0].name.replace(/[^\w\s.-]+/gi, '');
          },

          /************************************************************************
           * Resets the file input preview text to its default value.
           *
           * @private
           ***********************************************************************/
          _resetPreviewTextToDefault: function _resetPreviewTextToDefault() {
            this.previewElement.textContent = this.defaultPreviewText;
          }
        };
      }
    }]);

    return FileInput;
  }(Component);
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


  var Sidenav = /*#__PURE__*/function (_Component7) {
    _inherits(Sidenav, _Component7);

    var _super7 = _createSuper(Sidenav);

    function Sidenav() {
      _classCallCheck(this, Sidenav);

      return _super7.apply(this, arguments);
    }

    _createClass(Sidenav, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the sidenav's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-sidenav]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the sidenav.
           ***********************************************************************/
          init: function init() {
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
          _initSelectors: function _initSelectors() {
            this.toggleAttribute = 'data-rvt-sidenav-toggle';
            this.childMenuAttribute = 'data-rvt-sidenav-list';
            this.toggleSelector = "[".concat(this.toggleAttribute, "]");
            this.childMenuSelector = "[".concat(this.childMenuAttribute, "]");
          },

          /************************************************************************
           * Initializes sidenav child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.childMenuToggleButtons = Array.from(this.element.querySelectorAll(this.toggleSelector));
            this.childMenus = Array.from(this.element.querySelectorAll(this.childMenuSelector));
          },

          /************************************************************************
           * Initializes sidenav attributes.
           *
           * @private
           ***********************************************************************/
          _initAttributes: function _initAttributes() {
            this._assignComponentElementIds();
          },

          /************************************************************************
           * Assigns random IDs to each toggle button and child menu if one was
           * not already provided in the markup.
           *
           * @private
           ***********************************************************************/
          _assignComponentElementIds: function _assignComponentElementIds() {
            this._assignToggleIds();

            this._assignChildMenuIds();
          },

          /************************************************************************
           * Assigns a random ID to each toggle.
           *
           * @private
           ***********************************************************************/
          _assignToggleIds: function _assignToggleIds() {
            var _this8 = this;

            this.childMenuToggleButtons.forEach(function (toggle) {
              Component.setAttributeIfNotSpecified(toggle, _this8.toggleAttribute, Component.generateUniqueId());
            });
          },

          /************************************************************************
           * Assigns a random ID to each child menu.
           *
           * @private
           ***********************************************************************/
          _assignChildMenuIds: function _assignChildMenuIds() {
            var numMenus = this.childMenus.length;

            for (var i = 0; i < numMenus; i++) {
              var toggle = this.childMenuToggleButtons[i];
              var menu = this.childMenus[i];
              var menuId = toggle.getAttribute(this.toggleAttribute);
              Component.setAttributeIfNotSpecified(menu, this.childMenuAttribute, menuId);
            }
          },

          /************************************************************************
           * Sets the initial state of the sidenav's child menus.
           *
           * @private
           ***********************************************************************/
          _setInitialChildMenuStates: function _setInitialChildMenuStates() {
            this._setChildMenuDefaultAriaAttributes();

            this._shouldOpenAllChildMenus() ? this._openAllChildMenus() : this._setChildMenuDefaultStates();
          },

          /************************************************************************
           * Sets the default ARIA attributes for the sidenav's child menus.
           *
           * @private
           ***********************************************************************/
          _setChildMenuDefaultAriaAttributes: function _setChildMenuDefaultAriaAttributes() {
            this.childMenuToggleButtons.forEach(function (toggleButton) {
              return toggleButton.setAttribute('aria-haspopup', 'true');
            });
          },

          /************************************************************************
           * Returns true if all child menus should be opened when the component
           * is added to the DOM.
           *
           * @private
           * @returns {boolean} Child menus should be opened
           ***********************************************************************/
          _shouldOpenAllChildMenus: function _shouldOpenAllChildMenus() {
            return this.element.hasAttribute('data-rvt-sidenav-open-all');
          },

          /************************************************************************
           * Opens all child menus.
           *
           * @private
           ***********************************************************************/
          _openAllChildMenus: function _openAllChildMenus() {
            var _this9 = this;

            this.childMenuToggleButtons.forEach(function (toggleButton, index) {
              toggleButton.setAttribute('aria-expanded', 'true');

              _this9.childMenus[index].removeAttribute('hidden');
            });
          },

          /************************************************************************
           * Sets the default open/closed state for each child menu based on
           * the ARIA attributes set by the developer.
           *
           * @private
           ***********************************************************************/
          _setChildMenuDefaultStates: function _setChildMenuDefaultStates() {
            var _this10 = this;

            this.childMenuToggleButtons.forEach(function (element, index) {
              if (element.getAttribute('aria-expanded') === 'true') {
                _this10.childMenus[index].removeAttribute('hidden');
              } else {
                element.setAttribute('aria-expanded', 'false');

                _this10.childMenus[index].setAttribute('hidden', '');
              }
            });
          },

          /************************************************************************
           * Called when the sidenav is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);
          },

          /************************************************************************
           * Called when the sidenav is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);
          },

          /************************************************************************
           * Handles click events broadcast to the sidenav.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (!this._clickOriginatedInChildMenuToggleButton(event)) {
              return;
            }

            this._setChildMenuToToggle(event);

            if (!this._childMenuToToggleExists()) {
              return;
            }

            this._childMenuToToggleIsOpen() ? this.close(this.childMenuToToggleId) : this.open(this.childMenuToToggleId);
          },

          /************************************************************************
           * Returns true if the given click event originated inside one of the
           * sidenav's child menu toggle buttons.
           *
           * @private
           * @param {Event} event - Click event
           * @returns {boolean} Click originated inside child menu toggle button
           ***********************************************************************/
          _clickOriginatedInChildMenuToggleButton: function _clickOriginatedInChildMenuToggleButton(event) {
            return event.target.closest(this.toggleSelector);
          },

          /************************************************************************
           * Sets references to the child menu to be toggled by the given click
           * event. These references are used by other click handler submethods.
           *
           * @private
           * @param {Event} event - Click event
           ***********************************************************************/
          _setChildMenuToToggle: function _setChildMenuToToggle(event) {
            this.childMenuToToggleId = event.target.closest(this.toggleSelector).dataset.rvtSidenavToggle;
            this.childMenuToToggle = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(this.childMenuToToggleId, "\"]"));
          },

          /************************************************************************
           * Returns true if the child menu to be toggled by a click event actually
           * exists in the DOM.
           *
           * @private
           * @returns {boolean} Child menu exists
           ***********************************************************************/
          _childMenuToToggleExists: function _childMenuToToggleExists() {
            return this.childMenuToToggle && this.childMenuToToggle.getAttribute(this.childMenuAttribute) !== '';
          },

          /************************************************************************
           * Returns true if the child menu to be toggled by a click event is open.
           *
           * @private
           * @returns {boolean} Child menu is open
           ***********************************************************************/
          _childMenuToToggleIsOpen: function _childMenuToToggleIsOpen() {
            return !this.childMenuToToggle.hasAttribute('hidden');
          },

          /************************************************************************
           * Opens the child menu with the given data-rvt-sidenav-list ID value.
           *
           * @param {string} childMenuId - Child menu ID
           ***********************************************************************/
          open: function open(childMenuId) {
            this._setChildMenuToOpen(childMenuId);

            if (!this._childMenuExists(childMenuId)) {
              console.warn("No such subnav child menu '".concat(childMenuId, "' in open()"));
              return;
            }

            if (!this._eventDispatched('SidenavListOpened', this.childMenuToOpen)) {
              return;
            }

            this._openChildMenu();
          },

          /************************************************************************
           * Sets references to the child menu to be opened. These references are
           * used by other submethods.
           *
           * @private
           * @param {string} childMenuId - Child menu ID
           ***********************************************************************/
          _setChildMenuToOpen: function _setChildMenuToOpen(childMenuId) {
            this.childMenuToOpenToggleButton = this.element.querySelector("[".concat(this.toggleAttribute, " = \"").concat(childMenuId, "\"]"));
            this.childMenuToOpen = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(childMenuId, "\"]"));
          },

          /************************************************************************
           * Expands the child menu to be opened.
           *
           * @private
           ***********************************************************************/
          _openChildMenu: function _openChildMenu() {
            this.childMenuToOpenToggleButton.setAttribute('aria-expanded', 'true');
            this.childMenuToOpen.removeAttribute('hidden');
          },

          /************************************************************************
           * Closes the child menu with the given data-rvt-sidenav-list ID value.
           *
           * @param {string} childMenuId - Child menu ID
           ***********************************************************************/
          close: function close(childMenuId) {
            this._setChildMenuToClose(childMenuId);

            if (!this._childMenuExists(childMenuId)) {
              console.warn("No such subnav child menu '".concat(childMenuId, "' in close()"));
              return;
            }

            if (!this._eventDispatched('SidenavListClosed', this.childMenuToClose)) {
              return;
            }

            this._closeChildMenu();
          },

          /************************************************************************
           * Sets references to the child menu to be closed. These references are
           * used by other submethods.
           *
           * @private
           * @param {string} childMenuId - Child menu ID
           ***********************************************************************/
          _setChildMenuToClose: function _setChildMenuToClose(childMenuId) {
            this.childMenuToCloseToggleButton = this.element.querySelector("[".concat(this.toggleAttribute, " = \"").concat(childMenuId, "\"]"));
            this.childMenuToClose = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(childMenuId, "\"]"));
          },

          /************************************************************************
           * Collapses the child menu to be closed.
           *
           * @private
           ***********************************************************************/
          _closeChildMenu: function _closeChildMenu() {
            this.childMenuToCloseToggleButton.setAttribute('aria-expanded', 'false');
            this.childMenuToClose.setAttribute('hidden', '');
          },

          /************************************************************************
           * Returns true if a child menu with the given ID exists.
           *
           * @private
           * @returns {boolean} Child menu exists
           ***********************************************************************/
          _childMenuExists: function _childMenuExists(childMenuId) {
            var childMenuToggleButton = this.element.querySelector("[".concat(this.toggleAttribute, " = \"").concat(childMenuId, "\"]"));
            var childMenu = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(childMenuId, "\"]"));
            return childMenuToggleButton && childMenu;
          },

          /************************************************************************
           * Returns true if the custom event with the given name was successfully
           * dispatched.
           *
           * @private
           * @param {string} name - Event name
           * @returns {boolean} Event successfully dispatched
           ***********************************************************************/
          _eventDispatched: function _eventDispatched(name, childMenu) {
            var dispatched = Component.dispatchCustomEvent(name, this.element, {
              list: childMenu
            });
            return dispatched;
          }
        };
      }
    }]);

    return Sidenav;
  }(Component);
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


  var Switch = /*#__PURE__*/function (_Component8) {
    _inherits(Switch, _Component8);

    var _super8 = _createSuper(Switch);

    function Switch() {
      _classCallCheck(this, Switch);

      return _super8.apply(this, arguments);
    }

    _createClass(Switch, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the switch's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-switch]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the switch.
           ***********************************************************************/
          init: function init() {
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
          _initProperties: function _initProperties() {
            this.on = false;
          },

          /************************************************************************
           * Sets the initial state of the switch.
           *
           * @private
           ***********************************************************************/
          _setInitialState: function _setInitialState() {
            this._hideLabelsFromAssistiveTech();

            this._setInitialToggleState();
          },

          /************************************************************************
           * Hides the on/off text labels from assistive technology.
           *
           * @private
           ***********************************************************************/
          _hideLabelsFromAssistiveTech: function _hideLabelsFromAssistiveTech() {
            this.element.querySelectorAll('span').forEach(function (span) {
              return span.setAttribute('aria-hidden', true);
            });
          },

          /************************************************************************
           * Sets the switch's initial toggle state.
           *
           * @private
           ***********************************************************************/
          _setInitialToggleState: function _setInitialToggleState() {
            this.element.setAttribute('aria-checked', 'false');

            if (this._shouldBeOnByDefault()) {
              this.switchOn(SUPPRESS_EVENT);
            }
          },

          /************************************************************************
           * Returns true if the switch should be toggled on by default.
           *
           * @private
           ***********************************************************************/
          _shouldBeOnByDefault: function _shouldBeOnByDefault() {
            return this.element.hasAttribute('data-rvt-switch-on');
          },

          /************************************************************************
           * Called when the switch is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
          },

          /************************************************************************
           * Called when the switch is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
          },

          /************************************************************************
           * Handles click events broadcast to the switch.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            this._isOn() ? this.switchOff() : this.switchOn();
          },

          /************************************************************************
           * Returns true if the switch is toggled on.
           ***********************************************************************/
          _isOn: function _isOn() {
            return this.on;
          },

          /************************************************************************
           * Toggle the switch on.
           * 
           * @param {boolean} suppressEvent - Suppress switch-on event
           ***********************************************************************/
          switchOn: function switchOn() {
            var suppressEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this._isOn()) {
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('SwitchToggledOn')) {
              return;
            }

            this._setOnState();
          },

          /************************************************************************
           * Sets the switch's state properties to represent it being on.
           *
           * @private
           ***********************************************************************/
          _setOnState: function _setOnState() {
            this.on = true;
            this.element.setAttribute('aria-checked', 'true');
          },

          /************************************************************************
           * Toggle the switch off.
           * 
           * @param {boolean} suppressEvent - Suppress switch-off event
           ***********************************************************************/
          switchOff: function switchOff() {
            var suppressEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this._isOn()) {
              return;
            }

            if (!suppressEvent) if (!this._eventDispatched('SwitchToggledOff')) {
              return;
            }

            this._setOffState();
          },

          /************************************************************************
           * Sets the switch's state properties to represent it being off.
           *
           * @private
           ***********************************************************************/
          _setOffState: function _setOffState() {
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
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          }
        };
      }
    }]);

    return Switch;
  }(Component);
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


  var Tabs = /*#__PURE__*/function (_Component9) {
    _inherits(Tabs, _Component9);

    var _super9 = _createSuper(Tabs);

    function Tabs() {
      _classCallCheck(this, Tabs);

      return _super9.apply(this, arguments);
    }

    _createClass(Tabs, null, [{
      key: "selector",
      get:
      /****************************************************************************
       * Gets the tabs component's CSS selector.
       *
       * @static
       * @returns {string} The CSS selector
       ***************************************************************************/
      function get() {
        return '[data-rvt-tabs]';
      }
      /****************************************************************************
       * Gets an object containing the methods that should be attached to the
       * component's root DOM element. Used by wicked-elements to initialize a DOM
       * element with Web Component-like behavior.
       *
       * @static
       * @returns {Object} Object with component methods
       ***************************************************************************/

    }, {
      key: "methods",
      get: function get() {
        return {
          /************************************************************************
           * Initializes the tabs component.
           ***********************************************************************/
          init: function init() {
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
          _initSelectors: function _initSelectors() {
            this.tabAttribute = 'data-rvt-tab';
            this.panelAttribute = 'data-rvt-tab-panel';
            this.tabSelector = "[".concat(this.tabAttribute, "]");
            this.panelSelector = "[".concat(this.panelAttribute, "]");
            this.tablistSelector = '[data-rvt-tablist]';
            this.initialTabSelector = '[data-rvt-tab-init]';
          },

          /************************************************************************
           * Initializes tabs component child elements.
           *
           * @private
           ***********************************************************************/
          _initElements: function _initElements() {
            this.tablist = this.element.querySelector(this.tablistSelector);
            this.tabs = Array.from(this.element.querySelectorAll(this.tabSelector));
            this.panels = Array.from(this.element.querySelectorAll(this.panelSelector)); // The data-rvt-tablist attribute was added in Rivet 2.4.0. To maintain
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
          _initProperties: function _initProperties() {
            this.activeTab = null;
          },

          /************************************************************************
           * Initializes tabs attributes.
           *
           * @private
           ***********************************************************************/
          _initAttributes: function _initAttributes() {
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
          _assignComponentElementIds: function _assignComponentElementIds() {
            this._assignTabIds();

            this._assignPanelIds();
          },

          /************************************************************************
           * Assigns a random ID to each tab.
           *
           * @private
           ***********************************************************************/
          _assignTabIds: function _assignTabIds() {
            var _this11 = this;

            this.tabs.forEach(function (tab) {
              Component.setAttributeIfNotSpecified(tab, _this11.tabAttribute, Component.generateUniqueId());
              Component.setAttributeIfNotSpecified(tab, 'id', Component.generateUniqueId());
            });
          },

          /************************************************************************
           * Assigns a random ID to each panel.
           *
           * @private
           ***********************************************************************/
          _assignPanelIds: function _assignPanelIds() {
            var numPanels = this.panels.length;

            for (var i = 0; i < numPanels; i++) {
              var tab = this.tabs[i];
              var panel = this.panels[i];
              var panelId = tab.getAttribute(this.tabAttribute);
              Component.setAttributeIfNotSpecified(panel, this.panelAttribute, panelId);
              Component.setAttributeIfNotSpecified(panel, 'id', panelId);
            }
          },

          /************************************************************************
           * Adds `type="button"` to each tab's button element.
           *
           * @private
           ***********************************************************************/
          _setTabButtonAttributes: function _setTabButtonAttributes() {
            this.tabs.forEach(function (tab) {
              Component.setAttributeIfNotSpecified(tab, 'type', 'button');
            });
          },

          /************************************************************************
           * Sets the tabs component's ARIA attributes.
           *
           * @private
           ***********************************************************************/
          _setAriaAttributes: function _setAriaAttributes() {
            this.tablist.setAttribute('role', 'tablist');
            this.tabs.forEach(function (tab) {
              return tab.setAttribute('role', 'tab');
            });
            this.panels.forEach(function (panel) {
              panel.setAttribute('role', 'tabpanel');
              panel.setAttribute('tabindex', 0);
            });

            for (var i = 0; i < this.tabs.length; i++) {
              var tab = this.tabs[i];
              var panel = this.panels[i];
              var id = tab.getAttribute('id');
              panel.setAttribute('aria-labelledby', id);
            }
          },

          /************************************************************************
           * Called when the tabs component is added to the DOM.
           ***********************************************************************/
          connected: function connected() {
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
          _activateInitialTab: function _activateInitialTab() {
            var initialTab = this.element.querySelector(this.initialTabSelector);
            var firstTab = this.panels[0];
            initialTab ? this.activateTab(initialTab.getAttribute(this.panelAttribute), SUPPRESS_EVENT) : this.activateTab(firstTab.getAttribute(this.panelAttribute), SUPPRESS_EVENT);
          },

          /************************************************************************
           * Called when the tabs component is removed from the DOM.
           ***********************************************************************/
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);
          },

          /************************************************************************
           * Handles click events broadcast to the tabs component.
           *
           * @param {Event} event - Click event
           ***********************************************************************/
          onClick: function onClick(event) {
            if (!this._eventOriginatedInsideTab(event)) {
              return;
            }

            this.activateTab(this._getClickedTabId(event));
          },

          /************************************************************************
           * Returns true if the given event originated inside a tab.
           *
           * @private
           * @param {Event} event - Event
           * @returns {boolean} Event originated inside a tab
           ***********************************************************************/
          _eventOriginatedInsideTab: function _eventOriginatedInsideTab(event) {
            return event.target.closest(this.tabSelector);
          },

          /************************************************************************
           * Returns the ID of the clicked tab.
           *
           * @private
           * @param {Event} event - Click event
           * @returns {string} Clicked tab ID
           ***********************************************************************/
          _getClickedTabId: function _getClickedTabId(event) {
            return event.target.closest(this.tabSelector).getAttribute(this.tabAttribute);
          },

          /************************************************************************
           * Handles keydown events broadcast to the tabs component.
           *
           * @param {Event} event - Keydown event
           ***********************************************************************/
          onKeydown: function onKeydown(event) {
            if (!this._eventOriginatedInsideTab(event)) {
              return;
            }

            this._setNeighboringTabIndexes(event);

            switch (event.keyCode) {
              case keyCodes.left:
                event.preventDefault();

                this._focusPreviousTab();

                break;

              case keyCodes.right:
                event.preventDefault();

                this._focusNextTab();

                break;

              case keyCodes.home:
                event.preventDefault();

                this._focusFirstTab();

                break;

              case keyCodes.end:
                event.preventDefault();

                this._focusLastTab();

                break;
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
          _setNeighboringTabIndexes: function _setNeighboringTabIndexes(event) {
            var currentTab = event.target.closest(this.tabSelector);
            this.previousTabIndex = this.tabs.indexOf(currentTab) - 1;
            this.nextTabIndex = this.tabs.indexOf(currentTab) + 1;
          },

          /************************************************************************
           * Moves focus to the tab before the one that currently has focus. If
           * focus is currently on the first tab, move focus to the last tab.
           *
           * @private
           ***********************************************************************/
          _focusPreviousTab: function _focusPreviousTab() {
            this.tabs[this.previousTabIndex] ? this.tabs[this.previousTabIndex].focus() : this.tabs[this.tabs.length - 1].focus();
          },

          /************************************************************************
           * Moves focus to the tab after the one that currently has focus. If
           * focus is currently on the last tab, move focus to the first tab.
           *
           * @private
           ***********************************************************************/
          _focusNextTab: function _focusNextTab() {
            this.tabs[this.nextTabIndex] ? this.tabs[this.nextTabIndex].focus() : this.tabs[0].focus();
          },

          /************************************************************************
           * Moves focus to the first tab.
           *
           * @private
           ***********************************************************************/
          _focusFirstTab: function _focusFirstTab() {
            this.tabs[0].focus();
          },

          /************************************************************************
           * Moves focus to the last tab.
           *
           * @private
           ***********************************************************************/
          _focusLastTab: function _focusLastTab() {
            this.tabs[this.tabs.length - 1].focus();
          },

          /************************************************************************
           * Activates the tab with the given ID or index.
           *
           * @param {string|number} idOrIndex - ID or index of tab to activate
           * @param {boolean} suppressEvent - Suppress tab activated event
           ***********************************************************************/
          activateTab: function activateTab(idOrIndex) {
            var suppressEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var id = this._tabIndexWasPassed(idOrIndex) ? this._getTabIdFromIndex(idOrIndex) : idOrIndex;

            this._setTabToActivate(id);

            if (!this._tabToActivateExists()) {
              console.warn("No such tab '".concat(id, "' in activateTab()"));
              return;
            }

            if (!suppressEvent) if (!this._tabActivatedEventDispatched()) {
              return;
            }

            this._deactivateUnselectedTabs();

            this._activateSelectedTab();
          },

          /************************************************************************
           * Activates the tab with the given ID or index.
           *
           * @param {string|number} idOrIndex - ID or index of tab to activate
           ***********************************************************************/
          _tabIndexWasPassed: function _tabIndexWasPassed(idOrIndex) {
            return typeof idOrIndex === 'number';
          },

          /************************************************************************
           * Gets the ID of the tab at the given index.
           *
           * @private
           * @param {number} index - Tab index
           ***********************************************************************/
          _getTabIdFromIndex: function _getTabIdFromIndex(index) {
            return this.tabs[index] ? this.tabs[index].getAttribute(this.tabAttribute) : null;
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
          _setTabToActivate: function _setTabToActivate(tabId) {
            this.tabToActivate = this.element.querySelector("[".concat(this.tabAttribute, " = \"").concat(tabId, "\"]"));
            this.panelToActivate = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(tabId, "\"]"));
          },

          /************************************************************************
           * Returns true if the tab to activate actually exists in the DOM.
           *
           * @private
           * @returns {boolean} Tab to activate exists
           ***********************************************************************/
          _tabToActivateExists: function _tabToActivateExists() {
            return this.tabToActivate && this.panelToActivate;
          },

          /************************************************************************
           * Returns true if the custom "tab activated" event was successfully
           * dispatched.
           *
           * @private
           * @returns {boolean} Event successfully dispatched
           ***********************************************************************/
          _tabActivatedEventDispatched: function _tabActivatedEventDispatched() {
            var dispatched = Component.dispatchCustomEvent('TabActivated', this.element, {
              tab: this.panelToActivate
            });
            return dispatched;
          },

          /************************************************************************
           * Deactivates all tabs that aren't the selected tab to activate.
           *
           * @private
           ***********************************************************************/
          _deactivateUnselectedTabs: function _deactivateUnselectedTabs() {
            var _this12 = this;

            this.panels.forEach(function (panel, index) {
              if (!_this12._panelShouldBeActivated(panel)) {
                _this12._deactivateTab(panel, index);
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
          _panelShouldBeActivated: function _panelShouldBeActivated(panel) {
            return panel.getAttribute(this.panelAttribute) === this.panelToActivate.dataset.rvtTabPanel;
          },

          /************************************************************************
           * Deactivates the given tab.
           *
           * @private
           * @param {HTMLElement} panel - Panel element to hide
           * @param {string} tabIndex - Index of tab to deactivate
           ***********************************************************************/
          _deactivateTab: function _deactivateTab(panel, tabIndex) {
            panel.setAttribute('hidden', '');
            this.tabs[tabIndex].setAttribute('aria-selected', 'false');
            this.tabs[tabIndex].setAttribute('tabindex', '-1');
          },

          /************************************************************************
           * Activates the currently selected tab.
           *
           * @private
           ***********************************************************************/
          _activateSelectedTab: function _activateSelectedTab() {
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
          addTab: function addTab(label) {
            var suppressEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var tab = this._createNewTabElement(label);

            var panel = this._createNewPanelElement(tab);

            if (!suppressEvent) if (!this._tabAddedEventDispatched(tab, panel)) {
              return;
            }
            this.tablist.appendChild(tab);
            this.element.appendChild(panel);
            return {
              tab: tab,
              panel: panel
            };
          },

          /************************************************************************
           * Creates a new tab element to be added to the component.
           *
           * @private
           * @param {string} label - Tab label
           * @returns {HTMLElement} Tab to add
           ***********************************************************************/
          _createNewTabElement: function _createNewTabElement(label) {
            var tab = document.createElement('button');
            tab.textContent = label;
            tab.classList.add('rvt-tabs__tab');
            tab.setAttribute(this.tabAttribute, Component.generateUniqueId());
            tab.setAttribute('id', Component.generateUniqueId());
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', false);
            tab.setAttribute('tabindex', -1);
            return tab;
          },

          /************************************************************************
           * Creates a new tab panel element to be added to the component.
           *
           * @private
           * @param {HTMLElement} tab - Tab associated with panel to create
           * @returns {HTMLElement} Panel to add
           ***********************************************************************/
          _createNewPanelElement: function _createNewPanelElement(tab) {
            var panel = document.createElement('div');
            panel.classList.add('rvt-tabs__panel');
            panel.setAttribute(this.panelAttribute, tab.getAttribute(this.tabAttribute));
            panel.setAttribute('id', tab.getAttribute(this.tabAttribute));
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', 0);
            panel.setAttribute('aria-labelledby', tab.getAttribute('id'));
            panel.setAttribute('hidden', true);
            return panel;
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
          _tabAddedEventDispatched: function _tabAddedEventDispatched(tab, panel) {
            var dispatched = Component.dispatchCustomEvent('TabAdded', this.element, {
              tab: tab,
              panel: panel
            });
            return dispatched;
          },

          /************************************************************************
           * Removes a tab with the given ID or index value.
           *
           * @param {string|number} idOrIndex - ID or index of tab to remove
           ***********************************************************************/
          removeTab: function removeTab(idOrIndex) {
            var id = this._tabIndexWasPassed(idOrIndex) ? this._getTabIdFromIndex(idOrIndex) : idOrIndex;

            this._setTabToRemove(id);

            if (!this._tabToRemoveExists()) {
              console.warn("No such tab '".concat(id, "' in removeTab()"));
              return;
            }

            if (!this._tabRemovedEventDispatched()) {
              return;
            }

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
          _setTabToRemove: function _setTabToRemove(tabId) {
            this.tabToRemove = this.element.querySelector("[".concat(this.tabAttribute, "=\"").concat(tabId, "\"]"));
            this.panelToRemove = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(tabId, "\"]"));
          },

          /************************************************************************
           * Returns true if the tab to activate actually exists in the DOM.
           *
           * @private
           * @returns {boolean} Tab to remove exists
           ***********************************************************************/
          _tabToRemoveExists: function _tabToRemoveExists() {
            return this.tabToRemove && this.panelToRemove;
          },

          /************************************************************************
           * Returns true if the custom "tab removed" event was successfully
           * dispatched.
           *
           * @private
           * @returns {boolean} Event successfully dispatched
           ***********************************************************************/
          _tabRemovedEventDispatched: function _tabRemovedEventDispatched() {
            var dispatched = Component.dispatchCustomEvent('TabRemoved', this.element, {
              tab: this.tabToRemove,
              panel: this.panelToRemove
            });
            return dispatched;
          },

          /************************************************************************
           * Returns true if the removed tab was the active tab.
           *
           * @private
           * @returns {boolean} Removed tab was active tab
           ***********************************************************************/
          _removedTabWasActiveTab: function _removedTabWasActiveTab() {
            return this.tabToRemove === this.activeTab;
          },

          /************************************************************************
           * Activates the tab nearest to the removed tab.
           *
           * @private
           ***********************************************************************/
          _activateTabNearestToRemovedTab: function _activateTabNearestToRemovedTab() {
            var previousTab = this.tabToRemove.previousElementSibling;
            var nextTab = this.tabToRemove.nextElementSibling;

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
          _removeTab: function _removeTab() {
            this.tabToRemove.remove();
            this.panelToRemove.remove();
          }
        };
      }
    }]);

    return Tabs;
  }(Component);
  /******************************************************************************
   * Copyright (C) 2018 The Trustees of Indiana University
   * SPDX-License-Identifier: BSD-3-Clause
   *****************************************************************************/

  /******************************************************************************
   * Initializes all Rivet components.
   *****************************************************************************/


  function init() {
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

  exports.Accordion = Accordion;
  exports.Alert = Alert;
  exports.Dialog = Dialog;
  exports.Disclosure = Disclosure;
  exports.Dropdown = Dropdown;
  exports.FileInput = FileInput;
  exports.Sidenav = Sidenav;
  exports.Switch = Switch;
  exports.Tabs = Tabs;
  exports.init = init;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
}({});
