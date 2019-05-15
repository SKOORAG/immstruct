/**
* immstruct v2.0.0
* A part of the Omniscient.js project
***************************************/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.immstruct = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
'use strict';
var Structure = _dereq_('./src/structure');

/**
 * Creates a new instance of Immstruct, having it's own list
 * of Structure instances.
 *
 * ### Examples:
 * ```js
 * var ImmstructInstance = require('immstruct').Immstruct;
 * var immstruct = new ImmstructInstance();
 * var structure = immstruct.get({ data: });
 * ```
 *
 * @property {Array.<Structure>} instances Array of `Structure` instances.
 *
 * @class {Immstruct}
 * @constructor
 * @returns {Immstruct}
 * @api public
 */
function Immstruct () {
  if (!(this instanceof Immstruct)) {
    return new Immstruct();
  }

  this._instances = {};
}

/**
 *
 * Gets or creates a new instance of {Structure}. Provide optional
 * key to be able to retrieve it from list of instances. If no key
 * is provided, a random key will be generated.
 *
 * ### Examples:
 * ```js
 * var immstruct = require('immstruct');
 * var structure = immstruct.get('myStruct', { foo: 'Hello' });
 * ```
 * @param {string} [key] - defaults to random string
 * @param {Object|Immutable} [data] - defaults to empty data
 *
 * @returns {Structure}
 * @module immstruct.get
 * @api public
 */
Immstruct.prototype.get = function (key, data) {
  return getInstance(this, {
    key: key,
    data: data
  });
};

/**
 *
 * Get list of all instances created.
 *
 * @param {string} [name] - Name of the instance to get. If undefined get all instances
 *
 * @returns {(Structure|Object.<String, Structure>)}
 * @module immstruct.instance
 * @api public
 */
Immstruct.prototype.instance = function (name) {
  if (name) return this._instances[name];
  return this._instances;
};

/**
 * Clear the entire list of `Structure` instances from the Immstruct
 * instance. You would do this to start from scratch, freeing up memory.
 *
 * ### Examples:
 * ```js
 * var immstruct = require('immstruct');
 * immstruct.clear();
 * ```
 * @module immstruct.clear
 * @api public
 */
Immstruct.prototype.clear = function () {
  this._instances = {};
};

/**
 * Remove one `Structure` instance from the Immstruct instances list.
 * Provided by key
 *
 * ### Examples:
 * ```js
 * var immstruct = require('immstruct');
 * immstruct('myKey', { foo: 'hello' });
 * immstruct.remove('myKey');
 * ```
 * @param {string} key
 *
 * @module immstruct.remove
 * @api public
 * @returns {boolean}
 */
Immstruct.prototype.remove = function (key) {
  return delete this._instances[key];
};


/**
 * Gets or creates a new instance of `Structure` with history (undo/redo)
 * activated per default. Same usage and signature as regular `Immstruct.get`.

 * Provide optional key to be able to retrieve it from list of instances.
 * If no key is provided, a random key will be generated.
 *
 * Provide optional limit to cap the last number of history references
 * that will be kept. Once limit is reached, a new history record
 * shifts off the oldest record. The default if omitted is Infinity.
 * Setting to 0 is the as not having history enabled in the first place.
 *
 * ### Examples:
 * ```js
 * var immstruct = require('immstruct');
 * var structure = immstruct.withHistory('myStruct', 10, { foo: 'Hello' });
 * var structure = immstruct.withHistory(10, { foo: 'Hello' });
 * var structure = immstruct.withHistory('myStruct', { foo: 'Hello' });
 * var structure = immstruct.withHistory({ foo: 'Hello' });
 * ```
 *
 * @param {string} [key] - defaults to random string
 * @param {number} [limit] - defaults to Infinity
 * @param {Object|Immutable} [data] - defaults to empty data
 *
 * @module immstruct.withHistory
 * @api public
 * @returns {Structure}
 */
Immstruct.prototype.withHistory = function (key, limit, data) {
  return getInstance(this, {
    key: key,
    data: data,
    history: true,
    historyLimit: limit
  });
};

var inst = new Immstruct();

/**
 * This is a default instance of `Immstruct` as well as a shortcut for
 * creating `Structure` instances (See `Immstruct.get` and `Immstruct`).
 * This is what is returned from `require('immstruct')`.
 *
 * From `Immstruct.get`:
 * Gets or creates a new instance of {Structure} in the default Immstruct
 * instance. A link to `immstruct.get()`. Provide optional
 * key to be able to retrieve it from list of instances. If no key
 * is provided, a random key will be generated.
 *
 * ### Examples:
 * ```js
 * var immstruct = require('immstruct');
 * var structure = immstruct('myStruct', { foo: 'Hello' });
 * var structure2 = immstruct.withHistory({ bar: 'Bye' });
 * immstruct.remove('myStruct');
 * // ...
 * ```
 *
 * @param {string} [key] - defaults to random string
 * @param {Object|Immutable} [data] - defaults to empty data
 *
 * @api public
 * @see {@link Immstruct}
 * @see {Immstruct.prototype.get}
 * @module immstruct
 * @class {Immstruct}
 * @returns {Structure|Function}
 */
module.exports = function (key, data) {
  return getInstance(inst, {
    key: key,
    data: data
  });
};

module.exports.withHistory = function (key, limit, data) {
  return getInstance(inst, {
    key: key,
    data: data,
    history: true,
    historyLimit: limit
  });
};

module.exports.Structure = Structure;
module.exports.Immstruct = Immstruct;
module.exports.clear     = inst.clear.bind(inst);
module.exports.remove    = inst.remove.bind(inst);
module.exports.get       = inst.get.bind(inst);
module.exports.instance = function (name) {
  if (name) return inst._instances[name];
  return inst._instances;
};

function getInstance (obj, options) {
  if (typeof options.key === 'object') {
    options.data = options.key;
    options.key = void 0;
  } else if (typeof options.key === 'number') {
    options.data = options.historyLimit;
    options.historyLimit = options.key;
    options.key = void 0;
  } else if (typeof options.historyLimit === 'object') {
    options.data = options.historyLimit;
    options.historyLimit = void 0;
  }

  if (options.key && obj._instances[options.key]) {
    return obj._instances[options.key];
  }

  var newInstance = new Structure(options);
  obj._instances[newInstance.key] = newInstance;
  return newInstance;
}

},{"./src/structure":10}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _plugins = _dereq_('./plugins');

exports.default = function (data) {
  var createStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _plugins.inMemory;

  var watchers = [];

  var transition = function transition() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return watchers.forEach(function (watcher) {
      return watcher.apply(undefined, args);
    });
  };

  return _extends({}, createStore(data, transition), {
    watch: function watch(fn) {
      watchers.push(fn);
    }
  });
};
},{"./plugins":3}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var inMemory = exports.inMemory = function inMemory(initial, transition) {
  var rootState = initial;
  var read = function read() {
    return rootState;
  };
  var write = function write(fn) {
    for (var _len = arguments.length, context = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      context[_key - 1] = arguments[_key];
    }

    var oldState = read();
    var newState = fn(oldState);
    transition.apply(undefined, [newState, oldState].concat(_toConsumableArray(context)));
    rootState = newState;
    return read();
  };
  return { read: read, write: write };
};

var webStorage = exports.webStorage = function webStorage(_ref, initial, transition) {
  var type = _ref.type,
      key = _ref.key;

  var store = window[type + "Storage"];
  if (initial !== undefined) {
    store.setItem(key, JSON.stringify(initial));
  }
  var read = function read() {
    return JSON.parse(store.getItem(key));
  };
  var write = function write(fn) {
    for (var _len2 = arguments.length, context = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      context[_key2 - 1] = arguments[_key2];
    }

    var oldState = read();
    var newState = fn(oldState);
    transition.apply(undefined, [newState, oldState].concat(_toConsumableArray(context)));
    store.setItem(key, JSON.stringify(newState));
    return read();
  };
  return { read: read, write: write };
};
},{}],4:[function(_dereq_,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _utils = _dereq_('./utils');

var Iterator = _immutable.Iterable.Iterator;

var NOT_SET = {}; // Sentinel value

function Base(rootData, keyPath, updater, deref, size) {
  this.size = size;
  this._rootData = rootData;
  this._keyPath = keyPath;
  this._updater = updater;
  this._deref = deref;
}

Base.prototype = {
  deref: function deref(notSetValue) {
    return this._rootData.getIn(this._keyPath, notSetValue);
  },


  // Need test of noSetValue
  valueOf: function valueOf(notSetValue) {
    return this.deref.call(this, notSetValue);
  },
  get: function get(key, notSetValue) {
    return this.getIn([key], notSetValue);
  },
  getIn: function getIn(keyPath, notSetValue) {
    var constructKeyPath = (0, _utils.listToKeyPath)(keyPath);
    if (constructKeyPath.length === 0) {
      return this;
    }
    var value = this._rootData.getIn((0, _utils.newKeyPath)(this._keyPath, constructKeyPath), NOT_SET);
    return value === NOT_SET ? notSetValue : (0, _utils.wrappedValue)(this, constructKeyPath, value);
  },
  set: function set(key, value) {
    if (arguments.length === 1) {
      return (0, _utils.updateCursor)(this, function () {
        return key;
      }, []);
    }
    return (0, _utils.updateCursor)(this, function (m) {
      return m.set(key, value);
    }, [key]);
  },


  setIn: _immutable.Map.prototype.setIn,

  // Needs tests
  remove: function remove(key) {
    return (0, _utils.updateCursor)(this, function (m) {
      return m.remove(key);
    }, [key]);
  },


  // Needs tests
  delete: function _delete(key) {
    return this.remove.call(this, key);
  },


  deleteIn: _immutable.Map.prototype.deleteIn,

  removeIn: _immutable.Map.prototype.deleteIn,

  clear: function clear() {
    return (0, _utils.updateCursor)(this, function (m) {
      return m.clear();
    });
  },
  update: function update(keyOrFn, notSetValue, updater) {
    return arguments.length === 1 ? (0, _utils.updateCursor)(this, keyOrFn) : this.updateIn([keyOrFn], notSetValue, updater);
  },
  updateIn: function updateIn(keyPath, notSetValue, updater) {
    return (0, _utils.updateCursor)(this, function (m) {
      return m.updateIn(keyPath, notSetValue, updater);
    }, keyPath);
  },
  merge: function merge() {
    var _arguments = arguments;

    return (0, _utils.updateCursor)(this, function (m) {
      return m.merge.apply(m, _arguments);
    });
  },
  mergeWith: function mergeWith() {
    var _arguments2 = arguments;

    return (0, _utils.updateCursor)(this, function (m) {
      return m.mergeWith.apply(m, _arguments2);
    });
  },


  mergeIn: _immutable.Map.prototype.mergeIn,

  mergeDeep: function mergeDeep() {
    var _arguments3 = arguments;

    return (0, _utils.updateCursor)(this, function (m) {
      return m.mergeDeep.apply(m, _arguments3);
    });
  },
  mergeDeepWith: function mergeDeepWith() {
    var _arguments4 = arguments;

    return (0, _utils.updateCursor)(this, function (m) {
      return m.mergeDeepWith.apply(m, _arguments4);
    });
  },


  mergeDeepIn: _immutable.Map.prototype.mergeDeepIn,

  withMutations: function withMutations(fn) {
    return (0, _utils.updateCursor)(this, function (m) {
      return (m || (0, _immutable.Map)()).withMutations(fn);
    });
  },
  cursor: function cursor(path) {
    var subKeyPath = (0, _utils.valToKeyPath)(path);
    return subKeyPath.length === 0 ? this : (0, _utils.subCursor)(this, subKeyPath);
  },
  __iterate: function __iterate(fn, reverse) {
    var cursor = this;
    var deref = cursor.deref();
    return deref && deref.__iterate ? deref.__iterate(function (v, k) {
      return fn((0, _utils.wrappedValue)(cursor, [k], v), k, cursor);
    }, reverse) : 0;
  },
  __iterator: function __iterator(type, reverse) {
    var deref = this.deref();
    var cursor = this;
    var iterator = deref && deref.__iterator && deref.__iterator(Iterator.ENTRIES, reverse);
    return new Iterator(function () {
      if (!iterator) {
        return { value: undefined, done: true };
      }
      var step = iterator.next();
      if (step.done) {
        return step;
      }
      var entry = step.value;
      var k = entry[0];
      var v = (0, _utils.wrappedValue)(cursor, [k], entry[1]);
      return {
        value: type === Iterator.KEYS ? k : type === Iterator.VALUES ? v : [k, v]
      };
    });
  }
};

exports.default = Base;
},{"./utils":9,"immutable":undefined}],6:[function(_dereq_,module,exports){
'use strict';

var _utils = _dereq_('./utils');

var _atomStore = _dereq_('atom-store');

var _atomStore2 = _interopRequireDefault(_atomStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function cursorFrom(data, keyPath, onChange) {
  var atom = (0, _atomStore2.default)(data);
  if (arguments.length === 1) {
    keyPath = [];
  } else if (typeof keyPath === 'function') {
    onChange = keyPath;
    keyPath = [];
  } else {
    keyPath = (0, _utils.valToKeyPath)(keyPath);
  }

  if (typeof onChange !== 'undefined') {
    atom.watch(onChange);
  }

  return (0, _utils.makeCursor)(data, keyPath, atom.write.bind(atom), atom.read);
}

exports.from = cursorFrom;
},{"./utils":9,"atom-store":2}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _base = _dereq_('./base');

var _base2 = _interopRequireDefault(_base);

var _utils = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Indexed(rootData, keyPath, updater, deref, size) {
  _base2.default.call(this, rootData, keyPath, updater, deref, size);
}

Indexed.prototype = Object.create(_immutable.Seq.Indexed.prototype);
Object.assign(Indexed.prototype, _base2.default.prototype);

Indexed.prototype.push = function () {
  var _arguments = arguments;

  return (0, _utils.updateCursor)(this, function (m) {
    return m.push.apply(m, _arguments);
  });
};

Indexed.prototype.pop = function () {
  return (0, _utils.updateCursor)(this, function (m) {
    return m.pop();
  });
};

Indexed.prototype.unshift = function () {
  var _arguments2 = arguments;

  return (0, _utils.updateCursor)(this, function (m) {
    return m.unshift.apply(m, _arguments2);
  });
};

Indexed.prototype.shift = function () {
  return (0, _utils.updateCursor)(this, function (m) {
    return m.shift();
  });
};

Indexed.prototype.toString = function () {
  return this.__toString('Cursor [', ']');
};

exports.default = Indexed;
},{"./base":5,"./utils":9,"immutable":undefined}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _base = _dereq_('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Keyed(rootData, keyPath, updater, deref, size) {
  _base2.default.call(this, rootData, keyPath, updater, deref, size);
}

Keyed.prototype = Object.create(_immutable.Seq.Keyed.prototype);
Object.assign(Keyed.prototype, _base2.default.prototype);

Keyed.prototype.toString = function () {
  return this.__toString('Cursor {', '}');
};

exports.default = Keyed;
},{"./base":5,"immutable":undefined}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRecordProperties = defineRecordProperties;
exports.makeCursor = makeCursor;
exports.listToKeyPath = listToKeyPath;
exports.newKeyPath = newKeyPath;
exports.valToKeyPath = valToKeyPath;
exports.subCursor = subCursor;
exports.updateCursor = updateCursor;
exports.wrappedValue = wrappedValue;

var _immutable = (typeof window !== "undefined" ? window.Immutable : typeof global !== "undefined" ? global.Immutable : null);

var _keyed = _dereq_('./keyed');

var _keyed2 = _interopRequireDefault(_keyed);

var _indexed = _dereq_('./indexed');

var _indexed2 = _interopRequireDefault(_indexed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setProp(prototype, name) {
  Object.defineProperty(prototype, name, {
    get: function get() {
      return this.get(name);
    },
    set: function set() {
      if (!this.__ownerID) {
        throw new Error('Cannot set on an immutable record.');
      }
    }
  });
}

function defineRecordProperties(cursor, value) {
  try {
    value._keys.forEach(setProp.bind(undefined, cursor));
  } catch (error) {
    // Object.defineProperty failed. Probably IE8.
  }
}

function makeCursor(rootData, keyPath, updater, deref, value) {
  if (arguments.length < 5) {
    value = rootData.getIn(keyPath);
  }
  var size = value && value.size;
  var Cursor = _immutable.Iterable.isIndexed(value) ? _indexed2.default : _keyed2.default;
  var cursor = new Cursor(rootData, keyPath, updater, deref, size);

  if (value instanceof _immutable.Record) {
    defineRecordProperties(cursor, value);
  }

  return cursor;
}

function listToKeyPath(list) {
  return Array.isArray(list) ? list : (0, _immutable.Iterable)(list).toArray();
}

function newKeyPath(head, tail) {
  return head.concat(listToKeyPath(tail));
}

function valToKeyPath(val) {
  return Array.isArray(val) ? val : _immutable.Iterable.isIterable(val) ? val.toArray() : [val];
}

function subCursor(cursor, keyPath, value) {
  if (arguments.length < 3) {
    return makeCursor( // call without value
    cursor._rootData, newKeyPath(cursor._keyPath, keyPath), cursor._updater, cursor._deref);
  }
  return makeCursor(cursor._rootData, newKeyPath(cursor._keyPath, keyPath), cursor._updater, cursor._deref, value);
}

function updateCursor(cursor, changeFn, keyPath) {
  var deepChange = arguments.length > 2;
  var updateFn = function updateFn(oldState) {
    return oldState.updateIn(cursor._keyPath, deepChange ? (0, _immutable.Map)() : undefined, changeFn);
  };
  return makeCursor(cursor._updater(updateFn, newKeyPath(cursor._keyPath, keyPath)), cursor._keyPath, cursor._updater, cursor._deref);
}

function wrappedValue(cursor, keyPath, value) {
  return _immutable.Iterable.isIterable(value) ? subCursor(cursor, keyPath, value) : value;
}
},{"./indexed":7,"./keyed":8,"immutable":undefined}],10:[function(_dereq_,module,exports){
(function (global){
'use strict';

var Immutable = (typeof window !== "undefined" ? window['Immutable'] : typeof global !== "undefined" ? global['Immutable'] : null);
var Cursor = _dereq_('immutable-cursor');
var EventEmitter = _dereq_('eventemitter3');
var utils = _dereq_('./utils');

var LISTENER_SENTINEL = {};

 /**
 * Creates a new `Structure` instance. Also accessible through
 * `Immstruct.Structre`.
 *
 * A structure is also an EventEmitter object, so it has methods as
 * `.on`, `.off`, and all other EventEmitter methods.
 *
 *
 * For the `swap` event, the root structure (see `structure.current`) is passed
 * as arguments, but for type specific events (`add`, `change` and `delete`), the
 * actual changed value is passed.
 *
 * For instance:
 * ```js
 * var structure = new Structure({ 'data': { 'foo': { 'bar': 'hello' } } });
 *
 * structure.on('swap', function (newData, oldData, keyPath) {
 *   keyPath.should.eql(['foo', 'bar']);
 *   newData.toJS().should.eql({ 'foo': { 'bar': 'bye' } });
 *   oldData.toJS().should.eql({ 'foo': { 'bar': 'hello' } });
 * });
 *
 * structure.cursor(['foo', 'bar']).update(function () {
 *  return 'bye';
 * });
 * ```
 *
 * But for `change`
 * ```js
 * var structure = new Structure({ 'data': { 'foo': { 'bar': 'hello' } } });
 *
 * structure.on('change', function (newData, oldData, keyPath) {
 *   keyPath.should.eql(['foo', 'bar']);
 *   newData.should.eql('bye');
 *   oldData.should.eql('hello');
 * });
 *
 * structure.cursor(['foo', 'bar']).update(function () {
 *  return 'bye';
 * });
 * ```
 *
 * **All `keyPath`s passed to listeners are the full path to where the actual
 *  change happened**
 *
 * ### Examples:
 * ```js
 * var Structure = require('immstruct/structure');
 * var s = new Structure({ data: { foo: 'bar' }});
 *
 * // Or:
 * // var Structure = require('immstruct').Structure;
 * ```
 *
 * ### Events
 *
 * * `swap`: Emitted when cursor is updated (new information is set). Is emitted
 *   on all types of changes, additions and deletions. The passed structures are
 *   always the root structure.
 *   One use case for this is to re-render design components. Callback
 *   is passed arguments: `newStructure`, `oldStructure`, `keyPath`.
 * * `next-animation-frame`: Same as `swap`, but only emitted on animation frame.
 *   Could use with many render updates and better performance. Callback is passed
 *   arguments: `newStructure`, `oldStructure`, `keyPath`.
 * * `change`: Emitted when data/value is updated and it existed before. Emits
 *   values: `newValue`, `oldValue` and `path`.
 * * `delete`: Emitted when data/value is removed. Emits value:  `removedValue` and `path`.
 * * `add`: Emitted when new data/value is added. Emits value: `newValue` and `path`.
 * * `any`: With the same semantics as `add`, `change` or `delete`, `any` is triggered for
 *    all types of changes. Differs from swap in the arguments that it is passed.
 *    Is passed `newValue` (or undefined), `oldValue` (or undefined) and full `keyPath`.
 *    New and old value are the changed value, not relative/scoped to the reference path as
 *    with `swap`.
 *
 * ### Options
 *
 * ```json
 * {
 *   key: string, // Defaults to random string
 *   data: Object|Immutable, // defaults to empty Map
 *   history: boolean, // Defaults to false
 *   historyLimit: number, // If history enabled, Defaults to Infinity
 * }
 * ```
 *
 * @property {Immutable.List} history `Immutable.List` with history.
 * @property {Object|Immutable} current Provided data as immutable data
 * @property {string} key Generated or provided key.
 *
 *
 * @param {{ key: string, data: Object, history: boolean }} [options] - defaults
 *  to random key and empty data (immutable structure). No history
 *
 * @constructor
 * @class {Structure}
 * @returns {Structure}
 * @api public
 */
function Structure (options) {
  var self = this;

  options = options || {};
  if (!(this instanceof Structure)) {
    return new Structure(options);
  }

  EventEmitter.call(this, arguments);

  this.key = options.key || utils.generateRandomKey();

  this._queuedChange = false;
  this.current = options.data;
  if (!isImmutableStructure(this.current) || !this.current) {
    this.current = Immutable.fromJS(this.current || {});
  }

  if (!!options.history) {
    this.history = Immutable.List.of(this.current);
    this._currentRevision = 0;
    this._historyLimit = (typeof options.historyLimit === 'number') ?
      options.historyLimit :
      Infinity;
  }

  this._referencelisteners = Immutable.Map();
  this.on('swap', function (newData, oldData, keyPath) {
    keyPath = keyPath || [];
    var args = [newData, oldData, keyPath];
    emit(self._referencelisteners, newData, oldData, keyPath, args);
  });
}
inherits(Structure, EventEmitter);
module.exports = Structure;

function emit(map, newData, oldData, path, args) {
  if (!map || newData === oldData) return void 0;
  map.get(LISTENER_SENTINEL, []).forEach(function (fn) {
    fn.apply(null, args);
  });

  if (path.length > 0) {
    var nextPathRoot = path[0];
    var passedNewData = newData && newData.get ? newData.get(nextPathRoot) : void 0;
    var passedOldData = oldData && oldData.get ? oldData.get(nextPathRoot) : void 0;
    return emit(map.get(nextPathRoot), passedNewData, passedOldData, path.slice(1), args);
  }

  map.forEach(function(value, key) {
    if (key === LISTENER_SENTINEL) return void 0;
    var passedNewData = (newData && newData.get) ? newData.get(key) : void 0;
    var passedOldData = (oldData && oldData.get) ? oldData.get(key) : void 0;
    emit(value, passedNewData, passedOldData, [], args);
  });
}

/**
 * Create a Immutable.js Cursor for a given `path` on the `current` structure (see `Structure.current`).
 * Changes made through created cursor will cause a `swap` event to happen (see `Events`).
 *
 * **This method returns a
 * [Immutable.js Cursor](https://github.com/facebook/immutable-js/blob/master/contrib/cursor/index.d.ts).
 * See the Immutable.js docs for more info on how to use cursors.**
 *
 * ### Examples:
 * ```js
 * var Structure = require('immstruct/structure');
 * var s = new Structure({ data: { foo: 'bar', a: { b: 'foo' } }});
 * s.cursor().set('foo', 'hello');
 * s.cursor('foo').update(function () { return 'Changed'; });
 * s.cursor(['a', 'b']).update(function () { return 'bar'; });
 * ```
 *
 * See more examples in the [tests](https://github.com/omniscientjs/immstruct/blob/master/tests/structure_test.js)
 *
 * @param {string|Array.<string>} [path] - defaults to empty string. Can be array for path. See Immutable.js Cursors
 *
 * @api public
 * @module structure.cursor
 * @returns {Cursor} Gives a Cursor from Immutable.js
 */
Structure.prototype.cursor = function (path) {
  var self = this;
  path = valToKeyPath(path) || [];

  if (!this.current) {
    throw new Error('No structure loaded.');
  }

  var changeListener = function (newRoot, oldRoot, path) {
    if(self.current === oldRoot) {
      self.current = newRoot;
    } else if(!hasIn(newRoot, path)) {
      // Othewise an out-of-sync change occured. We ignore `oldRoot`, and focus on
      // changes at path `path`, and sync this to `self.current`.
      self.current = self.current.removeIn(path);
    } else {
      // Update an existing path or add a new path within the current map.
      self.current = self.current.setIn(path, newRoot.getIn(path));
    }

    return self.current;
  };

  changeListener = handleHistory(this, changeListener);
  changeListener = handleSwap(this, changeListener);
  changeListener = handlePersisting(this, changeListener);
  return Cursor.from(self.current, path, changeListener);
};

/**
 * Creates a reference. A reference can be a pointer to a cursor, allowing
 * you to create cursors for a specific path any time. This is essentially
 * a way to have "always updated cursors" or Reference Cursors. See example
 * for better understanding the concept.
 *
 * References also allow you to listen for changes specific for a path.
 *
 * ### Examples:
 * ```js
 * var structure = immstruct({
 *   someBox: { message: 'Hello World!' }
 * });
 * var ref = structure.reference(['someBox']);
 *
 * var unobserve = ref.observe(function () {
 *   // Called when data the path 'someBox' is changed.
 *   // Also called when the data at ['someBox', 'message'] is changed.
 * });
 *
 * // Update the data using the ref
 * ref.cursor().update(function () { return 'updated'; });
 *
 * // Update the data using the initial structure
 * structure.cursor(['someBox', 'message']).update(function () { return 'updated again'; });
 *
 * // Remove the listener
 * unobserve();
 * ```
 *
 * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
 *
 * @param {string|Array.<string>|Cursor} [path|cursor] - defaults to empty string. Can be
 * array for path or use path of cursor. See Immutable.js Cursors
 *
 * @api public
 * @module structure.reference
 * @returns {Reference}
 * @constructor
 */
Structure.prototype.reference = function reference (path) {
  if (isCursor(path) && path._keyPath) {
    path = path._keyPath;
  }

  path = valToKeyPath(path) || [];

  var self = this,
      cursor = this.cursor(path),
      unobservers = Immutable.Set();

  function cursorRefresher() { cursor = self.cursor(path); }
  function _subscribe (path, fn) {
    self._referencelisteners = subscribe(self._referencelisteners, path, fn);
  }
  function _unsubscribe (path, fn) {
    self._referencelisteners = unsubscribe(self._referencelisteners, path, fn);
  }

  _subscribe(path, cursorRefresher);

  return {
    /**
     * Observe for changes on a reference. On references you can observe for changes,
     * but a reference **is not** an EventEmitter it self.
     *
     * The passed `keyPath` for swap events are relative to the reference, but
     *
     *
     * **Note**: As on `swap` for normal immstruct events, the passed arguments for
     * the event is the root, not guaranteed to be the actual changed value.
     * The structure is how ever scoped to the path passed in to the reference.
     * All values passed to the eventlistener for the swap event are relative
     * to the path used as key path to the reference.
     *
     * For instance:
     *
     * ```js
     * var structure = immstruct({ 'foo': { 'bar': 'hello' } });
     * var ref = structure.reference('foo');
     * ref.observe(function (newData, oldData, keyPath) {
     *   keyPath.should.eql(['bar']);
     *   newData.toJS().should.eql({ 'bar': 'updated' });
     *   oldData.toJS().should.eql({ 'bar': 'hello' });
     * });
     * ref.cursor().update(['bar'], function () { return 'updated'; });
     * ```
     *
     * For type specific events, how ever, the actual changed value is passed,
     * not the root data. In these cases, the full keyPath to the change is passed.
     *
     * For instance:
     *
     * ```js
     * var structure = immstruct({ 'foo': { 'bar': 'hello' } });
     * var ref = structure.reference('foo');
     * ref.observe('change', function (newValue, oldValue, keyPath) {
     *   keyPath.should.eql(['foo', 'bar']);
     *   newData.should.eql('updated');
     *   oldData.should.eql('hello');
     * });
     * ref.cursor().update(['bar'], function () { return 'updated'; });
     * ```
     *
     *
     * ### Examples:
     * ```js
     * var ref = structure.reference(['someBox']);
     *
     * var unobserve = ref.observe('delete', function () {
     *   // Called when data the path 'someBox' is removed from the structure.
     * });
     * ```
     *
     * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
     *
     * ### Events
     * * `swap`: Emitted when any cursor is updated (new information is set).
     *   Triggered in any data swap is made on the structure. One use case for
     *   this is to re-render design components. Data passed as arguments
     *   are scoped/relative to the path passed to the reference, this also goes for keyPath.
     *   Callback is passed arguments: `newStructure`, `oldStructure`, `keyPath`.
     * * `change`: Emitted when data/value is updated and it existed before.
     *   Emits values: `newValue`, `oldValue` and `path`.
     * * `delete`: Emitted when data/value is removed. Emits value:  `removedValue` and `path`.
     * * `add`: Emitted when new data/value is added. Emits value: `newValue` and `path`.
     * * `any`: With the same semantics as `add`, `change` or `delete`, `any` is triggered for
     *    all types of changes. Differs from swap in the arguments that it is passed.
     *    Is passed `newValue` (or undefined), `oldValue` (or undefined) and full `keyPath`.
     *    New and old value are the changed value, not relative/scoped to the reference path as
     *    with `swap`.
     *
     * @param {string} [eventName] - Type of change
     * @param {Function} callback - Callback when referenced data is swapped
     *
     * @api public
     * @module reference.observe
     * @returns {Function} Function for removing observer (unobserve)
     */
    observe: function (eventName, newFn) {
      if (typeof eventName === 'function') {
        newFn = eventName;
        eventName = void 0;
      }
      if (this._dead || typeof newFn !== 'function') return;
      if (eventName && eventName !== 'swap') {
        newFn = onEventNameAndAny(eventName, newFn);
      } else {
        newFn = emitScopedReferencedStructures(path, newFn);
      }

      _subscribe(path, newFn);
      unobservers = unobservers.add(newFn);

      return function unobserve () {
        _unsubscribe(path, newFn);
      };
    },

    /**
     * Create a new, updated, cursor from the base path provded to the
     * reference. This returns a Immutable.js Cursor as the regular
     * cursor method. You can also provide a sub-path to create a reference
     * in a deeper level.
     *
     * ### Examples:
     * ```js
     * var ref = structure.reference(['someBox']);
     * var cursor = ref.cursor('someSubPath');
     * var cursor2 = ref.cursor();
     * ```
     *
     * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
     *
     * @param {string} [subpath] - Subpath to a deeper structure
     *
     * @api public
     * @module reference.cursor
     * @returns {Cursor} Immutable.js cursor
     */
    cursor: function (subPath) {
      if (this._dead) return void 0;
      subPath = valToKeyPath(subPath);
      if (subPath) return cursor.cursor(subPath);
      return cursor;
    },

    /**
     * Creates a reference on a lower level path. See creating normal references.
     *
     * ### Examples:
     * ```js
     * var structure = immstruct({
     *   someBox: { message: 'Hello World!' }
     * });
     * var ref = structure.reference('someBox');
     *
     * var newReference = ref.reference('message');
     * ```
     *
     * See more examples in the [readme](https://github.com/omniscientjs/immstruct)
     *
     * @param {string|Array.<string>} [path] - defaults to empty string. Can be array for path. See Immutable.js Cursors
     *
     * @api public
     * @see structure.reference
     * @module reference.reference
     * @returns {Reference}
     */
    reference: function (subPath) {
      subPath = valToKeyPath(subPath);
      return self.reference((cursor._keyPath || []).concat(subPath));
    },

    /**
     * Remove all observers from reference.
     *
     * @api public
     * @module reference.unobserveAll
     * @returns {Void}
     */
    unobserveAll: function (destroy) {
      if (this._dead) return void 0;
      unobservers.forEach(function(fn) {
        _unsubscribe(path, fn);
      });

      if (destroy) {
        _unsubscribe(path, cursorRefresher);
      }
    },

    /**
     * Destroy reference. Unobserve all observers, set all endpoints of reference to dead.
     * For cleaning up memory.
     *
     * @api public
     * @module reference.destroy
     * @returns {Void}
     */
    destroy: function () {
      cursor = void 0;
      this.unobserveAll(true);

      this._dead = true;
      this.observe = void 0;
      this.unobserveAll = void 0;
      this.cursor = void 0;
      this.destroy = void 0;

      cursorRefresher = void 0;
      _unsubscribe = void 0;
      _subscribe = void 0;
    }
  };
};

/**
 * Force emitting swap event. Pass on new, old and keypath passed to swap.
 * If newData is `null` current will be used.
 *
 * @param {Object} newData - Immutable object for the new data to emit
 * @param {Object} oldData - Immutable object for the old data to emit
 * @param {string} keyPath - Structure path (in tree) to where the changes occured.
 *
 * @api public
 * @module structure.forceHasSwapped
 * @returns {Void}
 */
Structure.prototype.forceHasSwapped = function (newData, oldData, keyPath) {
  this.emit('swap', newData || this.current, oldData, keyPath);
  possiblyEmitAnimationFrameEvent(this, newData || this.current, oldData, keyPath);
};


/**
 * Undo IFF history is activated and there are steps to undo. Returns new current
 * immutable structure.
 *
 * **Will NOT emit swap when redo. You have to do this yourself**.
 *
 * Define number of steps to undo in param.
 *
 * @param {number} steps - Number of steps to undo
 *
 * @api public
 * @module structure.undo
 * @returns {Object} New Immutable structure after undo
 */
Structure.prototype.undo = function(steps) {
  this._currentRevision -= steps || 1;
  if (this._currentRevision < 0) {
    this._currentRevision = 0;
  }

  this.current = this.history.get(this._currentRevision);
  return this.current;
};

/**
 * Redo IFF history is activated and you can redo. Returns new current immutable structure.
 * Define number of steps to redo in param.
 * **Will NOT emit swap when redo. You have to do this yourself**.
 *
 * @param {number} head - Number of steps to head to in redo
 *
 * @api public
 * @module structure.redo
 * @returns {Object} New Immutable structure after redo
 */
Structure.prototype.redo = function(head) {
  this._currentRevision += head || 1;
  if (this._currentRevision > this.history.count() - 1) {
    this._currentRevision = this.history.count() - 1;
  }

  this.current = this.history.get(this._currentRevision);
  return this.current;
};

/**
 * Undo IFF history is activated and passed `structure` exists in history.
 * Returns the same immutable structure as passed as argument.
 *
 * **Will NOT emit swap after undo. You have to do this yourself**.
 *
 * @param {Object} structure - Immutable structure to redo until
 *
 * @api public
 * @module structure.undoUntil
 * @returns {Object} New Immutable structure after undo
 */
Structure.prototype.undoUntil = function(structure) {
  this._currentRevision = this.history.indexOf(structure);
  this.current = structure;

  return structure;
};


function subscribe(listeners, path, fn) {
  return listeners.updateIn(path.concat(LISTENER_SENTINEL), Immutable.OrderedSet(), function(old) {
    return old.add(fn);
  });
}

function unsubscribe(listeners, path, fn) {
  return listeners.updateIn(path.concat(LISTENER_SENTINEL), Immutable.OrderedSet(), function(old) {
    return old.remove(fn);
  });
}

// Private decorators.

// Update history if history is active
function handleHistory (emitter, fn) {
  return function handleHistoryFunction (newData, oldData, path) {
    var newStructure = fn.apply(fn, arguments);
    if (!emitter.history || (newData === oldData)) return newStructure;

    emitter.history = emitter.history
      .take(++emitter._currentRevision)
      .push(emitter.current);

    if (emitter.history.size > emitter._historyLimit) {
      emitter.history = emitter.history.takeLast(emitter._historyLimit);
      emitter._currentRevision -= (emitter.history.size - emitter._historyLimit);
    }

    return newStructure;
  };
}

var _requestAnimationFrame = ((typeof window !== 'undefined' &&
  window.requestAnimationFrame) || utils.raf).bind(window);

// Update history if history is active
function possiblyEmitAnimationFrameEvent (emitter, newStructure, oldData, keyPath) {
  if (emitter._queuedChange) return void 0;
  emitter._queuedChange = true;

  _requestAnimationFrame(function () {
    emitter._queuedChange = false;
    emitter.emit('next-animation-frame', newStructure, oldData, keyPath);
  });
}

// Emit swap event on values are swapped
function handleSwap (emitter, fn) {
  return function handleSwapFunction (newData, oldData, keyPath) {
    var previous = emitter.current;
    var newStructure = fn.apply(fn, arguments);
    if(newData === previous) return newStructure;

    emitter.emit('swap', newStructure, previous, keyPath);
    possiblyEmitAnimationFrameEvent(emitter, newStructure, previous, keyPath);

    return newStructure;
  };
}

// Map changes to update events (delete/change/add).
function handlePersisting (emitter, fn) {
  return function handlePersistingFunction (newData, oldData, path) {
    var previous = emitter.current;
    var newStructure = fn.apply(fn, arguments);
    if(newData === previous) return newStructure;
    var info = analyze(newData, previous, path);

    if (info.eventName) {
      emitter.emit.apply(emitter, [info.eventName].concat(info.args));
      emitter.emit('any', info.newObject, info.oldObject, path);
    }
    return newStructure;
  };
}

// Private helpers.

function analyze (newData, oldData, path) {
  var oldObject = oldData && oldData.getIn(path);
  var newObject = newData && newData.getIn(path);

  var inOld = oldData && hasIn(oldData, path);
  var inNew = newData && hasIn(newData, path);

  var args, eventName;

  if (inOld && !inNew) {
    eventName = 'delete';
    args = [oldObject, path];
  } else if (inOld && inNew) {
    eventName = 'change';
    args = [newObject, oldObject, path];
  } else if (!inOld && inNew) {
    eventName = 'add';
    args = [newObject, path];
  }

  return {
    eventName: eventName,
    args: args,
    newObject: newObject,
    oldObject: oldObject
  };
}

// Check if path exists.
var NOT_SET = {};
function hasIn(cursor, path) {
  if(cursor.hasIn) return cursor.hasIn(path);
  return cursor.getIn(path, NOT_SET) !== NOT_SET;
}

function onEventNameAndAny(eventName, fn) {
  return function (newData, oldData, keyPath) {
    var info = analyze(newData, oldData, keyPath);

    if (info.eventName !== eventName && eventName !== 'any') return void 0;
    if (eventName === 'any') {
      return fn.call(fn, info.newObject, info.oldObject, keyPath);
    }
    return fn.apply(fn, info.args);
  };
}

function emitScopedReferencedStructures(path, fn) {
  return function withReferenceScopedStructures (newStructure, oldStructure, keyPath) {
    return fn.call(this, newStructure.getIn(path), oldStructure.getIn(path), keyPath.slice(path.length));
  };
}

function isCursor (potential) {
  return potential && typeof potential.deref === 'function';
}

// Check if passed structure is existing immutable structure.
// From https://github.com/facebook/immutable-js/wiki/Upgrading-to-Immutable-v3#additional-changes
var immutableCheckers = [
  {name: 'Iterable', method: 'isIterable' },
  {name: 'Seq', method: 'isSeq'},
  {name: 'Map', method: 'isMap'},
  {name: 'OrderedMap', method: 'isOrderedMap'},
  {name: 'List', method: 'isList'},
  {name: 'Stack', method: 'isStack'},
  {name: 'Set', method: 'isSet'}
];
function isImmutableStructure (data) {
  return immutableCheckers.some(function (checkItem) {
    return immutableSafeCheck(checkItem.name, checkItem.method, data);
  });
}

function immutableSafeCheck (ns, method, data) {
  return Immutable[ns] && Immutable[ns][method] && Immutable[ns][method](data);
}

function valToKeyPath(val) {
  if (typeof val === 'undefined') {
    return val;
  }
  return Array.isArray(val) ? val :
    immutableSafeCheck('Iterable', 'isIterable', val) ?
      val.toArray() : [val];
}

function inherits (c, p) {
  var e = {};
  Object.getOwnPropertyNames(c.prototype).forEach(function (k) {
    e[k] = Object.getOwnPropertyDescriptor(c.prototype, k);
  });
  c.prototype = Object.create(p.prototype, e);
  c['super'] = p;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":11,"eventemitter3":4,"immutable-cursor":6}],11:[function(_dereq_,module,exports){
'use strict';

module.exports.generateRandomKey = function (len) {
  len = len || 10;
  return Math.random().toString(36).substring(2).substring(0, len);
};

// Variation shim based on the classic polyfill:
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
module.exports.raf = (function() {
  var glob = (typeof window === 'undefined') ? module : window;
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !glob.requestAnimationFrame; ++x) {
    glob.requestAnimationFrame = glob[vendors[x]+'RequestAnimationFrame'];
  }

  return function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}());

},{}]},{},[1])(1)
});
