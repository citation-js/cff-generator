require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function async(data, options, callback) {
  if (typeof options === 'function' && !callback) {
    callback = options;
    options = undefined;
  }
  const promise = new this().setAsync(data, options);
  if (typeof callback === 'function') {
    promise.then(callback);
    return undefined;
  } else {
    return promise;
  }
}
var _default = exports.default = async;
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.get = get;
exports.getIds = getIds;
var _validate = require("./validate.js");
var _output = require("../plugins/output.js");
var _csl = require("../plugins/input/csl.js");
function getIds() {
  return this.data.map(entry => entry.id);
}
function format(format, ...options) {
  return (0, _output.format)(format, (0, _csl.clean)(this.data), ...options);
}
function get(options = {}) {
  (0, _validate.validateOutputOptions)(options);
  const parsedOptions = Object.assign({}, this.defaultOptions, this._options.output, options);
  const {
    type,
    style
  } = parsedOptions;
  const [styleType, styleFormat] = style.split('-');
  const newStyle = styleType === 'citation' ? 'bibliography' : styleType === 'csl' ? 'data' : styleType;
  const newType = type === 'string' ? 'text' : type === 'json' ? 'object' : type;
  let formatOptions;
  switch (newStyle) {
    case 'bibliography':
      {
        const {
          lang,
          append,
          prepend
        } = parsedOptions;
        formatOptions = {
          template: styleFormat,
          lang,
          format: newType,
          append,
          prepend
        };
        break;
      }
    case 'data':
    case 'bibtex':
    case 'bibtxt':
    case 'ndjson':
    case 'ris':
      formatOptions = {
        type: newType
      };
      break;
    default:
      throw new Error(`Invalid style "${newStyle}"`);
  }
  const result = this.format(newStyle, Object.assign(formatOptions, options._newOptions));
  const {
    format
  } = parsedOptions;
  if (format === 'real' && newType === 'html' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const tmp = document.createElement('div');
    tmp.innerHTML = result;
    return tmp.firstChild;
  } else if (format === 'string' && typeof result === 'object') {
    return JSON.stringify(result);
  } else {
    return result;
  }
}
},{"../plugins/input/csl.js":24,"../plugins/output.js":32,"./validate.js":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var log = _interopRequireWildcard(require("./log.js"));
var options = _interopRequireWildcard(require("./options.js"));
var set = _interopRequireWildcard(require("./set.js"));
var sort = _interopRequireWildcard(require("./sort.js"));
var get = _interopRequireWildcard(require("./get.js"));
var staticMethods = _interopRequireWildcard(require("./static.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function Cite(data, options = {}) {
  if (!(this instanceof Cite)) {
    return new Cite(data, options);
  }
  this._options = options;
  this.log = [];
  this.data = [];
  this.set(data, options);
  this.options(options);
  return this;
}
Object.assign(Cite.prototype, log, options, set, sort, get);
Cite.prototype[Symbol.iterator] = function* () {
  yield* this.data;
};
Object.assign(Cite, staticMethods);
var _default = exports.default = Cite;
},{"./get.js":2,"./log.js":4,"./options.js":5,"./set.js":6,"./sort.js":7,"./static.js":8}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentVersion = currentVersion;
exports.retrieveLastVersion = retrieveLastVersion;
exports.retrieveVersion = retrieveVersion;
exports.save = save;
exports.undo = undo;
function currentVersion() {
  return this.log.length;
}
function retrieveVersion(versnum = 1) {
  if (versnum <= 0 || versnum > this.currentVersion()) {
    return null;
  } else {
    const [data, options] = this.log[versnum - 1];
    const image = new this.constructor(JSON.parse(data), JSON.parse(options));
    image.log = this.log.slice(0, versnum);
    return image;
  }
}
function undo(number = 1) {
  return this.retrieveVersion(this.currentVersion() - number);
}
function retrieveLastVersion() {
  return this.retrieveVersion(this.currentVersion());
}
function save() {
  this.log.push([JSON.stringify(this.data), JSON.stringify(this._options)]);
  return this;
}
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = void 0;
exports.options = options;
var _validate = require("./validate.js");
const defaultOptions = exports.defaultOptions = {
  format: 'real',
  type: 'json',
  style: 'csl',
  lang: 'en-US'
};
function options(options, log) {
  (0, _validate.validateOutputOptions)(options);
  if (log) {
    this.save();
  }
  Object.assign(this._options, options);
  return this;
}
},{"./validate.js":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAsync = addAsync;
exports.reset = reset;
exports.set = set;
exports.setAsync = setAsync;
var _index = require("../plugins/input/index.js");
var _fetchId = _interopRequireDefault(require("../util/fetchId.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function add(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data.push(...(0, _index.chain)(data, options));
  this.data.filter(entry => !Object.prototype.hasOwnProperty.call(entry, 'id')).forEach(entry => {
    entry.id = (0, _fetchId.default)(this.getIds(), 'temp_id_');
  });
  return this;
}
async function addAsync(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data.push(...(await (0, _index.chainAsync)(data, options)));
  this.data.filter(entry => !Object.prototype.hasOwnProperty.call(entry, 'id')).forEach(entry => {
    entry.id = (0, _fetchId.default)(this.getIds(), 'temp_id_');
  });
  return this;
}
function set(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data = [];
  return typeof options !== 'boolean' ? this.add(data, options) : this.add(data);
}
async function setAsync(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data = [];
  return typeof options !== 'boolean' ? this.addAsync(data, options) : this.addAsync(data);
}
function reset(log) {
  if (log) {
    this.save();
  }
  this.data = [];
  this._options = {};
  return this;
}
},{"../plugins/input/index.js":28,"../util/fetchId.js":36}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = sort;
var _label = require("../plugin-common/output/label.js");
var _name = require("@citation-js/name");
function getComparisonValue(obj, prop, label = prop === 'label') {
  let value = label ? (0, _label.getLabel)(obj) : obj[prop];
  switch (prop) {
    case 'author':
    case 'editor':
      return value.map(name => name.literal || name.family || (0, _name.format)(name));
    case 'accessed':
    case 'issued':
      return value['date-parts'][0];
    case 'page':
      return value.split('-').map(num => parseInt(num));
    case 'edition':
    case 'issue':
    case 'volume':
      value = parseInt(value);
      return !isNaN(value) ? value : -Infinity;
    default:
      return value || -Infinity;
  }
}
function compareProp(entryA, entryB, prop, flip = /^!/.test(prop)) {
  prop = prop.replace(/^!/, '');
  const a = getComparisonValue(entryA, prop);
  const b = getComparisonValue(entryB, prop);
  return (flip ? -1 : 1) * (a > b ? 1 : a < b ? -1 : 0);
}
function getSortCallback(...props) {
  return (a, b) => {
    const keys = props.slice();
    let output = 0;
    while (!output && keys.length) {
      output = compareProp(a, b, keys.shift());
    }
    return output;
  };
}
function sort(method = [], log) {
  if (log) {
    this.save();
  }
  this.data.sort(typeof method === 'function' ? method : getSortCallback(...method, 'label'));
  return this;
}
},{"../plugin-common/output/label.js":19,"@citation-js/name":46}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  async: true
};
Object.defineProperty(exports, "async", {
  enumerable: true,
  get: function () {
    return _async.default;
  }
});
var _async = _interopRequireDefault(require("./async.js"));
var _validate = require("./validate.js");
Object.keys(_validate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _validate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validate[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
},{"./async.js":1,"./validate.js":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateOptions = validateOptions;
exports.validateOutputOptions = validateOutputOptions;
const formats = ['real', 'string'];
const types = ['json', 'html', 'string', 'rtf'];
const styles = ['csl', 'bibtex', 'bibtxt', 'citation-*', 'ris', 'ndjson'];
const wrapperTypes = ['string', 'function'];
function validateOutputOptions(options) {
  if (typeof options !== 'object') {
    throw new TypeError('Options not an object!');
  }
  const {
    format,
    type,
    style,
    lang,
    append,
    prepend
  } = options;
  if (format && !formats.includes(format)) {
    throw new TypeError(`Option format ("${format}") should be one of: ${formats}`);
  } else if (type && !types.includes(type)) {
    throw new TypeError(`Option type ("${type}") should be one of: ${types}`);
  } else if (style && !styles.includes(style) && !/^citation/.test(style)) {
    throw new TypeError(`Option style ("${style}") should be one of: ${styles}`);
  } else if (lang && typeof lang !== 'string') {
    throw new TypeError(`Option lang should be a string, but is a ${typeof lang}`);
  } else if (prepend && !wrapperTypes.includes(typeof prepend)) {
    throw new TypeError(`Option prepend should be a string or a function, but is a ${typeof prepend}`);
  } else if (append && !wrapperTypes.includes(typeof append)) {
    throw new TypeError(`Option append should be a string or a function, but is a ${typeof append}`);
  }
  if (/^citation/.test(style) && type === 'json') {
    throw new Error(`Combination type/style of json/citation-* is not valid: ${type}/${style}`);
  }
  return true;
}
function validateOptions(options) {
  if (typeof options !== 'object') {
    throw new TypeError('Options should be an object');
  }
  if (options.output) {
    validateOutputOptions(options.output);
  } else if (options.maxChainLength && typeof options.maxChainLength !== 'number') {
    throw new TypeError('Option maxChainLength should be a number');
  } else if (options.forceType && typeof options.forceType !== 'string') {
    throw new TypeError('Option forceType should be a string');
  } else if (options.generateGraph != null && typeof options.generateGraph !== 'boolean') {
    throw new TypeError('Option generateGraph should be a boolean');
  } else if (options.strict != null && typeof options.strict !== 'boolean') {
    throw new TypeError('Option strict should be a boolean');
  } else if (options.target != null && typeof options.target !== 'string') {
    throw new TypeError('Option target should be a boolean');
  }
  return true;
}
},{}],10:[function(require,module,exports){
(function (process){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const logger = {
  _output(level, scope, msg) {
    this._log.push(scope, msg);
    if (this._levels.indexOf(level) < this._levels.indexOf(this.level)) {
      return;
    }
    this._console.log(scope, ...msg);
  },
  _console: null,
  _log: [],
  _levels: ['http', 'debug', 'unmapped', 'info', 'warn', 'error', 'silent'],
  level: 'silent'
};
for (const level of logger._levels) {
  logger[level] = (scope, ...msg) => logger._output(level, scope, msg);
}
if (typeof console.Console === 'function') {
  logger._console = new console.Console(process.stderr);
} else {
  logger._console = console;
}
var _default = exports.default = logger;
}).call(this)}).call(this,require('_process'))
},{"_process":101}],11:[function(require,module,exports){
"use strict";

var plugins = _interopRequireWildcard(require("../plugins"));
var _input = require("./input/");
var _output = _interopRequireDefault(require("./output/"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
plugins.add(_input.ref, {
  input: _input.formats,
  output: _output.default
});
},{"../plugins":22,"./input/":14,"./output/":17}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
function parse() {
  return [];
}
},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
function parse(input) {
  return input.value || input.textContent;
}
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.parsers = exports.formats = void 0;
var empty = _interopRequireWildcard(require("./empty.js"));
var json = _interopRequireWildcard(require("./json.js"));
var jquery = _interopRequireWildcard(require("./jquery.js"));
var html = _interopRequireWildcard(require("./html.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ref = exports.ref = '@else';
const parsers = exports.parsers = {
  empty,
  json,
  jquery,
  html
};
const formats = exports.formats = {
  '@empty/text': {
    parse: empty.parse,
    parseType: {
      dataType: 'String',
      predicate: input => input === ''
    }
  },
  '@empty/whitespace+text': {
    parse: empty.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s+$/
    }
  },
  '@empty': {
    parse: empty.parse,
    parseType: {
      dataType: 'Primitive',
      predicate: input => input == null
    }
  },
  '@else/json': {
    parse: json.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(\{[\S\s]*\}|\[[\S\s]*\])\s*$/
    }
  },
  '@else/url': {
    parseType: {
      dataType: 'String',
      predicate: /^https?:\/\/(([\w-]+\.)*[\w-]+)(:\d+)?(\/[^?/]*)*(\?[^#]*)?(#.*)?$/i
    }
  },
  '@else/jquery': {
    parse: jquery.parse,
    parseType: {
      dataType: 'ComplexObject',
      predicate(input) {
        return typeof jQuery !== 'undefined' && input instanceof jQuery;
      }
    }
  },
  '@else/html': {
    parse: html.parse,
    parseType: {
      dataType: 'ComplexObject',
      predicate(input) {
        return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
      }
    }
  }
};
},{"./empty.js":12,"./html.js":13,"./jquery.js":15,"./json.js":16}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
function parse(input) {
  return input.val() || input.text() || input.html();
}
},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = parseJSON;
var _logger = _interopRequireDefault(require("../../logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const substituters = [[/((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g, '$1"$2"'], [/((?:(?:"|]|}|\/[gmiuys]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g, '$1"$2$3$4"$5:']];
function parseJSON(str) {
  if (typeof str !== 'string') {
    return JSON.parse(str);
  }
  try {
    return JSON.parse(str);
  } catch (e) {
    _logger.default.debug('[plugin-common]', 'Invalid JSON, switching to experimental parser');
    substituters.forEach(([regex, subst]) => {
      str = str.replace(regex, subst);
    });
    return JSON.parse(str);
  }
}
},{"../../logger.js":10}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _json = _interopRequireDefault(require("./json.js"));
var _label = _interopRequireDefault(require("./label.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = Object.assign({}, _json.default, _label.default);
},{"./json.js":18,"./label.js":19}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var plugins = _interopRequireWildcard(require("../../plugins/index.js"));
var util = _interopRequireWildcard(require("../../util/index.js"));
var _logger = _interopRequireDefault(require("../../logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function appendCommas(string, index, array) {
  return string + (index < array.length - 1 ? ',' : '');
}
function getJsonObject(src, dict) {
  const isArray = Array.isArray(src);
  let entries;
  if (isArray) {
    entries = src.map(entry => getJsonValue(entry, dict));
  } else {
    entries = Object.keys(src).filter(prop => JSON.stringify(src[prop])).map(prop => `"${prop}": ${getJsonValue(src[prop], dict)}`);
  }
  entries = entries.map(appendCommas).map(entry => dict.listItem.join(entry));
  entries = dict.list.join(entries.join(''));
  return isArray ? `[${entries}]` : `{${entries}}`;
}
function getJsonValue(src, dict) {
  if (typeof src === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]';
    } else if (Object.keys(src).length === 0) {
      return '{}';
    } else {
      return getJsonObject(src, dict);
    }
  } else {
    return JSON.stringify(src);
  }
}
function getJson(src, dict) {
  let entries = src.map(entry => getJsonObject(entry, dict));
  entries = entries.map(appendCommas).map(entry => dict.entry.join(entry));
  entries = entries.join('');
  return dict.bibliographyContainer.join(`[${entries}]`);
}
var _default = exports.default = {
  data(data, {
    type,
    format = type || 'text',
    version = '1.0.2'
  } = {}) {
    if (version < '1.0.2') {
      data = util.downgradeCsl(data);
    }
    if (format === 'object') {
      return util.deepCopy(data);
    } else if (format === 'text') {
      return JSON.stringify(data, null, 2);
    } else {
      _logger.default.warn('[core]', 'This feature (JSON output with special formatting) is unstable. See https://github.com/larsgw/citation.js/issues/144');
      return getJson(data, plugins.dict.get(format));
    }
  },
  ndjson(data, {
    version = '1.0.2'
  } = {}) {
    if (version < '1.0.2') {
      data = util.downgradeCsl(data);
    }
    return data.map(entry => JSON.stringify(entry)).join('\n');
  }
};
},{"../../logger.js":10,"../../plugins/index.js":22,"../../util/index.js":38}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getLabel = getLabel;
function getLabel(entry) {
  if ('citation-label' in entry) {
    return entry['citation-label'];
  }
  let res = '';
  if (entry.author) {
    res += entry.author[0].family || entry.author[0].literal;
  }
  if (entry.issued && entry.issued['date-parts'] && entry.issued['date-parts'][0]) {
    res += entry.issued['date-parts'][0][0];
  }
  if (entry['year-suffix']) {
    res += entry['year-suffix'];
  } else if (entry.title) {
    res += entry.title.replace(/<\/?.*?>/g, '').match(/^(?:(?:the|a|an)\s+)?(\S+)/i)[1];
  }
  return res;
}
var _default = exports.default = {
  label(data) {
    return data.reduce((object, entry) => {
      object[entry.id] = getLabel(entry);
      return object;
    }, {});
  }
};
},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.get = get;
exports.has = has;
exports.list = list;
exports.remove = remove;
const configs = {};
function add(ref, config) {
  configs[ref] = config;
}
function get(ref) {
  return configs[ref];
}
function has(ref) {
  return Object.prototype.hasOwnProperty.call(configs, ref);
}
function remove(ref) {
  delete configs[ref];
}
function list() {
  return Object.keys(configs);
}
},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.get = get;
exports.has = has;
exports.list = list;
exports.register = void 0;
exports.remove = remove;
var _register = _interopRequireDefault(require("../util/register.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function validate(name, dict) {
  if (typeof name !== 'string') {
    throw new TypeError(`Invalid dict name, expected string, got ${typeof name}`);
  } else if (typeof dict !== 'object') {
    throw new TypeError(`Invalid dict, expected object, got ${typeof dict}`);
  }
  for (const entryName in dict) {
    const entry = dict[entryName];
    if (!Array.isArray(entry) || entry.some(part => typeof part !== 'string')) {
      throw new TypeError(`Invalid dict entry "${entryName}", expected array of strings`);
    }
  }
}
const register = exports.register = new _register.default({
  html: {
    bibliographyContainer: ['<div class="csl-bib-body">', '</div>'],
    entry: ['<div class="csl-entry">', '</div>'],
    list: ['<ul style="list-style-type:none">', '</ul>'],
    listItem: ['<li>', '</li>']
  },
  text: {
    bibliographyContainer: ['', '\n'],
    entry: ['', '\n'],
    list: ['\n', ''],
    listItem: ['\t', '\n']
  }
});
function add(name, dict) {
  validate(name, dict);
  register.set(name, dict);
}
function remove(name) {
  register.remove(name);
}
function has(name) {
  return register.has(name);
}
function list() {
  return register.list();
}
function get(name) {
  if (!register.has(name)) {
    throw new Error(`Dict "${name}" unavailable`);
  }
  return register.get(name);
}
},{"../util/register.js":39}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.dict = exports.config = void 0;
exports.has = has;
exports.input = void 0;
exports.list = list;
exports.output = void 0;
exports.remove = remove;
var input = _interopRequireWildcard(require("./input/index.js"));
exports.input = input;
var output = _interopRequireWildcard(require("./output.js"));
exports.output = output;
var dict = _interopRequireWildcard(require("./dict.js"));
exports.dict = dict;
var config = _interopRequireWildcard(require("./config.js"));
exports.config = config;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const registers = {
  input,
  output,
  dict,
  config
};
const indices = {};
function add(ref, plugins = {}) {
  const mainIndex = indices[ref] = {};
  for (const type in plugins) {
    if (type === 'config') {
      mainIndex.config = {
        [ref]: plugins.config
      };
      registers.config.add(ref, plugins.config);
      continue;
    }
    const typeIndex = mainIndex[type] = {};
    const typePlugins = plugins[type];
    for (const name in typePlugins) {
      const typePlugin = typePlugins[name];
      typeIndex[name] = true;
      registers[type].add(name, typePlugin);
    }
  }
}
function remove(ref) {
  const mainIndex = indices[ref];
  for (const type in mainIndex) {
    const typeIndex = mainIndex[type];
    for (const name in typeIndex) {
      registers[type].remove(name);
    }
  }
  delete indices[ref];
}
function has(ref) {
  return ref in indices;
}
function list() {
  return Object.keys(indices);
}
},{"./config.js":20,"./dict.js":21,"./input/index.js":28,"./output.js":32}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chainLinkAsync = exports.chainLink = exports.chainAsync = exports.chain = void 0;
var _index = require("../../util/index.js");
var _logger = _interopRequireDefault(require("../../logger.js"));
var _register = require("./register.js");
var _type = require("./type.js");
var _data = require("./data.js");
var _graph = require("./graph.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function prepareParseGraph(graph) {
  return graph.reduce((array, next) => {
    const last = array[array.length - 1];
    if (last && last.type === next.type) {
      last.count = last.count + 1 || 2;
    } else {
      array.push(next);
    }
    return array;
  }, []).map(element => (element.count > 1 ? element.count + 'x ' : '') + element.type).join(' -> ');
}
class ChainParser {
  constructor(input, options = {}) {
    this.options = Object.assign({
      generateGraph: true,
      forceType: (0, _type.type)(input),
      maxChainLength: 10,
      strict: true,
      target: '@csl/list+object'
    }, options);
    this.type = this.options.forceType;
    this.data = typeof input === 'object' ? (0, _index.deepCopy)(input) : input;
    this.graph = [{
      type: this.type,
      data: input
    }];
    this.iteration = 0;
  }
  iterate() {
    if (this.iteration !== 0) {
      const typeInfo = (0, _register.get)(this.type);
      if (typeInfo && typeInfo.outputs) {
        this.type = typeInfo.outputs;
      } else {
        this.type = (0, _type.type)(this.data);
      }
      this.graph.push({
        type: this.type
      });
    }
    if (this.error || this.type === this.options.target) {
      return false;
    } else if (this.iteration >= this.options.maxChainLength) {
      this.error = new RangeError(`Max. number of parsing iterations reached (${prepareParseGraph(this.graph)})`);
      return false;
    } else {
      this.iteration++;
      return true;
    }
  }
  end() {
    if (this.error) {
      _logger.default.error('[core]', this.error.message);
      if (this.options.strict !== false) {
        throw this.error;
      } else {
        return [];
      }
    } else if (this.options.target === '@csl/list+object') {
      return (0, _index.upgradeCsl)(this.data).map(this.options.generateGraph ? entry => (0, _graph.applyGraph)(entry, this.graph) : _graph.removeGraph);
    } else {
      return this.data;
    }
  }
}
const chain = (...args) => {
  const chain = new ChainParser(...args);
  while (chain.iterate()) {
    try {
      chain.data = (0, _data.data)(chain.data, chain.type);
    } catch (e) {
      chain.error = e;
    }
  }
  return chain.end();
};
exports.chain = chain;
const chainLink = input => {
  const type = (0, _type.type)(input);
  const output = type.match(/array|object/) ? (0, _index.deepCopy)(input) : input;
  return (0, _data.data)(output, type);
};
exports.chainLink = chainLink;
const chainAsync = async (...args) => {
  const chain = new ChainParser(...args);
  while (chain.iterate()) {
    chain.data = await (0, _data.dataAsync)(chain.data, chain.type).catch(e => {
      chain.error = e;
    });
  }
  return chain.end();
};
exports.chainAsync = chainAsync;
const chainLinkAsync = async input => {
  const type = (0, _type.type)(input);
  const output = type.match(/array|object/) ? (0, _index.deepCopy)(input) : input;
  return (0, _data.dataAsync)(output, type);
};
exports.chainLinkAsync = chainLinkAsync;
},{"../../logger.js":10,"../../util/index.js":38,"./data.js":25,"./graph.js":27,"./register.js":30,"./type.js":31}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clean = parseCsl;
var _name = require("@citation-js/name");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const NAME = 1;
const NAME_LIST = 2;
const DATE = 3;
const TYPE = 4;
const entryTypes = {
  article: true,
  'article-journal': true,
  'article-magazine': true,
  'article-newspaper': true,
  bill: true,
  book: true,
  broadcast: true,
  chapter: true,
  classic: true,
  collection: true,
  dataset: true,
  document: true,
  entry: true,
  'entry-dictionary': true,
  'entry-encyclopedia': true,
  event: true,
  figure: true,
  graphic: true,
  hearing: true,
  interview: true,
  legal_case: true,
  legislation: true,
  manuscript: true,
  map: true,
  motion_picture: true,
  musical_score: true,
  pamphlet: true,
  'paper-conference': true,
  patent: true,
  performance: true,
  periodical: true,
  personal_communication: true,
  post: true,
  'post-weblog': true,
  regulation: true,
  report: true,
  review: true,
  'review-book': true,
  software: true,
  song: true,
  speech: true,
  standard: true,
  thesis: true,
  treaty: true,
  webpage: true,
  'journal-article': 'article-journal',
  'book-chapter': 'chapter',
  'posted-content': 'manuscript',
  'proceedings-article': 'paper-conference',
  dissertation: 'thesis'
};
const fieldTypes = {
  author: NAME_LIST,
  chair: NAME_LIST,
  'collection-editor': NAME_LIST,
  compiler: NAME_LIST,
  composer: NAME_LIST,
  'container-author': NAME_LIST,
  contributor: NAME_LIST,
  curator: NAME_LIST,
  director: NAME_LIST,
  editor: NAME_LIST,
  'editorial-director': NAME_LIST,
  'executive-producer': NAME_LIST,
  guest: NAME_LIST,
  host: NAME_LIST,
  interviewer: NAME_LIST,
  illustrator: NAME_LIST,
  narrator: NAME_LIST,
  organizer: NAME_LIST,
  'original-author': NAME_LIST,
  performer: NAME_LIST,
  producer: NAME_LIST,
  'reviewed-author': NAME_LIST,
  recipient: NAME_LIST,
  'script-writer': NAME_LIST,
  'series-creator': NAME_LIST,
  translator: NAME_LIST,
  accessed: DATE,
  'available-date': DATE,
  container: DATE,
  'event-date': DATE,
  issued: DATE,
  'original-date': DATE,
  submitted: DATE,
  type: TYPE,
  categories: 'object',
  custom: 'object',
  id: ['string', 'number'],
  language: 'string',
  journalAbbreviation: 'string',
  shortTitle: 'string',
  abstract: 'string',
  annote: 'string',
  archive: 'string',
  archive_collection: 'string',
  archive_location: 'string',
  'archive-place': 'string',
  authority: 'string',
  'call-number': 'string',
  'chapter-number': 'string',
  'citation-number': 'string',
  'citation-key': 'string',
  'citation-label': 'string',
  'collection-number': 'string',
  'collection-title': 'string',
  'container-title': 'string',
  'container-title-short': 'string',
  dimensions: 'string',
  division: 'string',
  DOI: 'string',
  edition: ['string', 'number'],
  event: 'string',
  'event-title': 'string',
  'event-place': 'string',
  'first-reference-note-number': 'string',
  genre: 'string',
  ISBN: 'string',
  ISSN: 'string',
  issue: ['string', 'number'],
  jurisdiction: 'string',
  keyword: 'string',
  locator: 'string',
  medium: 'string',
  note: 'string',
  number: ['string', 'number'],
  'number-of-pages': 'string',
  'number-of-volumes': ['string', 'number'],
  'original-publisher': 'string',
  'original-publisher-place': 'string',
  'original-title': 'string',
  page: 'string',
  'page-first': 'string',
  'part-number': ['string', 'number'],
  'part-title': 'string',
  PMCID: 'string',
  PMID: 'string',
  printing: 'string',
  publisher: 'string',
  'publisher-place': 'string',
  references: 'string',
  'reviewed-title': 'string',
  'reviewed-genre': 'string',
  scale: 'string',
  section: 'string',
  source: 'string',
  status: 'string',
  supplement: ['string', 'number'],
  title: 'string',
  'title-short': 'string',
  URL: 'string',
  version: 'string',
  volume: ['string', 'number'],
  'volume-title': 'string',
  'volume-title-short': 'string',
  'year-suffix': 'string'
};
function correctName(name, bestGuessConversions) {
  if (typeof name === 'object' && name !== null && (name.literal || name.given || name.family)) {
    if (name.ORCID || name.orcid || name._ORCID) {
      name = _objectSpread({
        _orcid: name.ORCID || name.orcid || name._ORCID
      }, name);
      delete name.ORCID;
      delete name.orcid;
      delete name._ORCID;
    }
    return name;
  } else if (!bestGuessConversions) {
    return undefined;
  } else if (typeof name === 'string') {
    return (0, _name.parse)(name);
  }
}
function correctNameList(nameList, bestGuessConversions) {
  if (nameList instanceof Array) {
    const names = nameList.map(name => correctName(name, bestGuessConversions)).filter(Boolean);
    return names.length ? names : undefined;
  }
}
function correctDateParts(dateParts, bestGuessConversions) {
  if (dateParts.every(part => typeof part === 'number')) {
    return dateParts;
  } else if (!bestGuessConversions || dateParts.some(part => isNaN(parseInt(part)))) {
    return undefined;
  } else {
    return dateParts.map(part => parseInt(part));
  }
}
function correctDate(date, bestGuessConversions) {
  const dp = 'date-parts';
  if (typeof date !== 'object' || date === null) {
    return undefined;
  } else if (date[dp] instanceof Array && date[dp].every(part => part instanceof Array)) {
    const range = date[dp].map(dateParts => correctDateParts(dateParts, bestGuessConversions)).filter(Boolean);
    return range.length ? _objectSpread(_objectSpread({}, date), {}, {
      'date-parts': range
    }) : undefined;
  } else if (date instanceof Array && date.every(part => part[dp] instanceof Array)) {
    const range = date.map(dateParts => correctDateParts(dateParts[dp], bestGuessConversions)).filter(Boolean);
    return range.length ? {
      'date-parts': range
    } : undefined;
  } else if (date[dp] instanceof Array) {
    const dateParts = correctDateParts(date[dp], bestGuessConversions);
    return dateParts && {
      'date-parts': [dateParts]
    };
  } else if ('literal' in date || 'raw' in date) {
    return date;
  }
}
function correctType(type, bestGuessConversions) {
  type = correctField('language', type, bestGuessConversions);
  if (entryTypes[type] === true) {
    return type;
  }
  if (bestGuessConversions) {
    if (type in entryTypes) {
      return entryTypes[type];
    } else if (typeof type === 'string' && type.toLowerCase() !== type) {
      return correctType(type.toLowerCase(), bestGuessConversions);
    }
  }
  return undefined;
}
function correctField(fieldName, value, bestGuessConversions) {
  const fieldType = [].concat(fieldTypes[fieldName]);
  switch (fieldTypes[fieldName]) {
    case NAME:
      return correctName(value, bestGuessConversions);
    case NAME_LIST:
      return correctNameList(value, bestGuessConversions);
    case DATE:
      return correctDate(value, bestGuessConversions);
    case TYPE:
      return correctType(value, bestGuessConversions);
  }
  if (bestGuessConversions) {
    if (typeof value === 'string' && fieldType.includes('number') && !fieldType.includes('string') && !isNaN(+value)) {
      return parseFloat(value);
    } else if (typeof value === 'number' && fieldType.includes('string') && !fieldType.includes('number')) {
      return value.toString();
    } else if (Array.isArray(value) && value.length) {
      return correctField(fieldName, value[0], bestGuessConversions);
    }
  }
  if (fieldType.includes(typeof value)) {
    return value;
  }
}
function parseCsl(data, bestGuessConversions = true) {
  return data.map(function (entry) {
    const clean = {};
    for (const field in entry) {
      const correction = correctField(field, entry[field], bestGuessConversions);
      if (correction !== undefined) {
        clean[field] = correction;
      }
    }
    return clean;
  });
}
},{"@citation-js/name":46}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDataParser = addDataParser;
exports.data = data;
exports.dataAsync = dataAsync;
exports.hasDataParser = hasDataParser;
exports.listDataParser = listDataParser;
exports.removeDataParser = removeDataParser;
var _type = require("./type.js");
const parsers = {};
const asyncParsers = {};
const nativeParsers = {
  '@csl/object': input => [input],
  '@csl/list+object': input => input,
  '@else/list+object': input => input.map(item => {
    const type = (0, _type.type)(item);
    return data(item, type);
  }).flat(),
  '@invalid': () => {
    throw new Error('This format is not supported or recognized');
  }
};
const nativeAsyncParsers = {
  '@else/list+object': input => Promise.all(input.map(item => {
    const type = (0, _type.type)(item);
    return dataAsync(item, type);
  })).then(input => input.flat())
};
function data(input, type) {
  if (typeof parsers[type] === 'function') {
    return parsers[type](input);
  } else if (typeof nativeParsers[type] === 'function') {
    return nativeParsers[type](input);
  } else {
    throw new TypeError(`No synchronous parser found for ${type}`);
  }
}
async function dataAsync(input, type) {
  if (typeof asyncParsers[type] === 'function') {
    return asyncParsers[type](input);
  } else if (typeof nativeAsyncParsers[type] === 'function') {
    return nativeAsyncParsers[type](input);
  } else if (hasDataParser(type, false)) {
    return data(input, type);
  } else {
    throw new TypeError(`No parser found for ${type}`);
  }
}
function addDataParser(format, {
  parser,
  async
}) {
  if (async) {
    asyncParsers[format] = parser;
  } else {
    parsers[format] = parser;
  }
}
function hasDataParser(type, async) {
  return async ? asyncParsers[type] || nativeAsyncParsers[type] : parsers[type] || nativeParsers[type];
}
function removeDataParser(type, async) {
  delete (async ? asyncParsers : parsers)[type];
}
function listDataParser(async) {
  return Object.keys(async ? asyncParsers : parsers);
}
},{"./type.js":31}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataTypeOf = dataTypeOf;
exports.typeOf = typeOf;
function typeOf(thing) {
  switch (thing) {
    case undefined:
      return 'Undefined';
    case null:
      return 'Null';
    default:
      return thing.constructor.name;
  }
}
function dataTypeOf(thing) {
  switch (typeof thing) {
    case 'string':
      return 'String';
    case 'object':
      if (Array.isArray(thing)) {
        return 'Array';
      } else if (typeOf(thing) === 'Object') {
        return 'SimpleObject';
      } else if (typeOf(thing) !== 'Null') {
        return 'ComplexObject';
      }
    default:
      return 'Primitive';
  }
}
},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyGraph = applyGraph;
exports.removeGraph = removeGraph;
function applyGraph(entry, graph) {
  if (entry._graph) {
    const index = graph.findIndex(({
      type
    }) => type === '@else/list+object');
    if (index !== -1) {
      graph.splice(index + 1, 0, ...entry._graph.slice(0, -1));
    }
  }
  entry._graph = graph;
  return entry;
}
function removeGraph(entry) {
  delete entry._graph;
  return entry;
}
},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  util: true
};
exports.util = void 0;
var dataType = _interopRequireWildcard(require("./dataType.js"));
var graph = _interopRequireWildcard(require("./graph.js"));
var parser = _interopRequireWildcard(require("./parser.js"));
var csl = _interopRequireWildcard(require("./csl.js"));
var _register = require("./register");
Object.keys(_register).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _register[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _register[key];
    }
  });
});
var _chain = require("./chain");
Object.keys(_chain).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _chain[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chain[key];
    }
  });
});
var _type = require("./type");
Object.keys(_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _type[key];
    }
  });
});
var _data = require("./data");
Object.keys(_data).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _data[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _data[key];
    }
  });
});
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const util = exports.util = Object.assign({}, dataType, graph, parser, csl);
},{"./chain":23,"./csl.js":24,"./data":25,"./dataType.js":26,"./graph.js":27,"./parser.js":29,"./register":30,"./type":31}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeParser = exports.FormatParser = exports.DataParser = void 0;
var _type = require("./type.js");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TypeParser {
  constructor(data) {
    _defineProperty(this, "validDataTypes", ['String', 'Array', 'SimpleObject', 'ComplexObject', 'Primitive']);
    this.data = data;
  }
  validateDataType() {
    const dataType = this.data.dataType;
    if (dataType && !this.validDataTypes.includes(dataType)) {
      throw new RangeError(`dataType was ${dataType}; expected one of ${this.validDataTypes}`);
    }
  }
  validateParseType() {
    const predicate = this.data.predicate;
    if (predicate && !(predicate instanceof RegExp || typeof predicate === 'function')) {
      throw new TypeError(`predicate was ${typeof predicate}; expected RegExp or function`);
    }
  }
  validateTokenList() {
    const tokenList = this.data.tokenList;
    if (tokenList && typeof tokenList !== 'object') {
      throw new TypeError(`tokenList was ${typeof tokenList}; expected object or RegExp`);
    }
  }
  validatePropertyConstraint() {
    const propertyConstraint = this.data.propertyConstraint;
    if (propertyConstraint && typeof propertyConstraint !== 'object') {
      throw new TypeError(`propertyConstraint was ${typeof propertyConstraint}; expected array or object`);
    }
  }
  validateElementConstraint() {
    const elementConstraint = this.data.elementConstraint;
    if (elementConstraint && typeof elementConstraint !== 'string') {
      throw new TypeError(`elementConstraint was ${typeof elementConstraint}; expected string`);
    }
  }
  validateExtends() {
    const extend = this.data.extends;
    if (extend && typeof extend !== 'string') {
      throw new TypeError(`extends was ${typeof extend}; expected string`);
    }
  }
  validate() {
    if (this.data === null || typeof this.data !== 'object') {
      throw new TypeError(`typeParser was ${typeof this.data}; expected object`);
    }
    this.validateDataType();
    this.validateParseType();
    this.validateTokenList();
    this.validatePropertyConstraint();
    this.validateElementConstraint();
    this.validateExtends();
  }
  parseTokenList() {
    let tokenList = this.data.tokenList;
    if (!tokenList) {
      return [];
    } else if (tokenList instanceof RegExp) {
      tokenList = {
        token: tokenList
      };
    }
    const {
      token,
      split = /\s+/,
      trim = true,
      every = true
    } = tokenList;
    const trimInput = input => trim ? input.trim() : input;
    const testTokens = every ? 'every' : 'some';
    const predicate = input => trimInput(input).split(split)[testTokens](part => token.test(part));
    return [predicate];
  }
  parsePropertyConstraint() {
    const constraints = [].concat(this.data.propertyConstraint || []);
    return constraints.map(({
      props,
      match,
      value
    }) => {
      props = [].concat(props);
      switch (match) {
        case 'any':
        case 'some':
          return input => props.some(prop => prop in input && (!value || value(input[prop])));
        case 'none':
          return input => !props.some(prop => prop in input && (!value || value(input[prop])));
        case 'every':
        default:
          return input => props.every(prop => prop in input && (!value || value(input[prop])));
      }
    });
  }
  parseElementConstraint() {
    const constraint = this.data.elementConstraint;
    return !constraint ? [] : [input => input.every(entry => (0, _type.type)(entry) === constraint)];
  }
  parsePredicate() {
    if (this.data.predicate instanceof RegExp) {
      return [this.data.predicate.test.bind(this.data.predicate)];
    } else if (this.data.predicate) {
      return [this.data.predicate];
    } else {
      return [];
    }
  }
  getCombinedPredicate() {
    const predicates = [...this.parsePredicate(), ...this.parseTokenList(), ...this.parsePropertyConstraint(), ...this.parseElementConstraint()];
    if (predicates.length === 0) {
      return () => true;
    } else if (predicates.length === 1) {
      return predicates[0];
    } else {
      return input => predicates.every(predicate => predicate(input));
    }
  }
  getDataType() {
    if (this.data.dataType) {
      return this.data.dataType;
    } else if (this.data.predicate instanceof RegExp) {
      return 'String';
    } else if (this.data.tokenList) {
      return 'String';
    } else if (this.data.elementConstraint) {
      return 'Array';
    } else {
      return 'Primitive';
    }
  }
  get dataType() {
    return this.getDataType();
  }
  get predicate() {
    return this.getCombinedPredicate();
  }
  get extends() {
    return this.data.extends;
  }
}
exports.TypeParser = TypeParser;
class DataParser {
  constructor(parser, {
    async
  } = {}) {
    this.parser = parser;
    this.async = async;
  }
  validate() {
    const parser = this.parser;
    if (typeof parser !== 'function') {
      throw new TypeError(`parser was ${typeof parser}; expected function`);
    }
  }
}
exports.DataParser = DataParser;
class FormatParser {
  constructor(format, parsers = {}) {
    this.format = format;
    if (parsers.parseType) {
      this.typeParser = new TypeParser(parsers.parseType);
    }
    if (parsers.parse) {
      this.dataParser = new DataParser(parsers.parse, {
        async: false
      });
    }
    if (parsers.parseAsync) {
      this.asyncDataParser = new DataParser(parsers.parseAsync, {
        async: true
      });
    }
  }
  validateFormat() {
    const format = this.format;
    if (!_type.typeMatcher.test(format)) {
      throw new TypeError(`format name was "${format}"; didn't match expected pattern`);
    }
  }
  validate() {
    this.validateFormat();
    if (this.typeParser) {
      this.typeParser.validate();
    }
    if (this.dataParser) {
      this.dataParser.validate();
    }
    if (this.asyncDataParser) {
      this.asyncDataParser.validate();
    }
  }
}
exports.FormatParser = FormatParser;
},{"./type.js":31}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.get = get;
exports.has = has;
exports.list = list;
exports.remove = remove;
var _parser = require("./parser.js");
var _type = require("./type.js");
var _data = require("./data.js");
const formats = {};
function add(format, parsers) {
  const formatParser = new _parser.FormatParser(format, parsers);
  formatParser.validate();
  const index = formats[format] || (formats[format] = {});
  if (formatParser.typeParser) {
    (0, _type.addTypeParser)(format, formatParser.typeParser);
    index.type = true;
  }
  if (formatParser.dataParser) {
    (0, _data.addDataParser)(format, formatParser.dataParser);
    index.data = true;
  }
  if (formatParser.asyncDataParser) {
    (0, _data.addDataParser)(format, formatParser.asyncDataParser);
    index.asyncData = true;
  }
  if (parsers.outputs) {
    index.outputs = parsers.outputs;
  }
}
function get(format) {
  return formats[format];
}
function remove(format) {
  const index = formats[format];
  if (!index) {
    return;
  }
  if (index.type) {
    (0, _type.removeTypeParser)(format);
  }
  if (index.data) {
    (0, _data.removeDataParser)(format);
  }
  if (index.asyncData) {
    (0, _data.removeDataParser)(format, true);
  }
  delete formats[format];
}
function has(format) {
  return format in formats;
}
function list() {
  return Object.keys(formats);
}
},{"./data.js":25,"./parser.js":29,"./type.js":31}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTypeParser = addTypeParser;
exports.hasTypeParser = hasTypeParser;
exports.listTypeParser = listTypeParser;
exports.removeTypeParser = removeTypeParser;
exports.treeTypeParser = treeTypeParser;
exports.type = type;
exports.typeMatcher = void 0;
var _logger = _interopRequireDefault(require("../../logger.js"));
var _dataType = require("./dataType.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const types = {};
const dataTypes = {};
const unregExts = {};
function parseNativeTypes(input, dataType) {
  switch (dataType) {
    case 'Array':
      if (input.length === 0 || input.every(entry => type(entry) === '@csl/object')) {
        return '@csl/list+object';
      } else {
        return '@else/list+object';
      }
    case 'SimpleObject':
    case 'ComplexObject':
      return '@csl/object';
    default:
      return '@invalid';
  }
}
function matchType(typeList = [], data) {
  for (const type of typeList) {
    if (types[type].predicate(data)) {
      return matchType(types[type].extensions, data) || type;
    }
  }
}
function type(input) {
  const dataType = (0, _dataType.dataTypeOf)(input);
  if (dataType === 'Array' && input.length === 0) {
    return parseNativeTypes(input, dataType);
  }
  const match = matchType(dataTypes[dataType], input);
  return match || parseNativeTypes(input, dataType);
}
function addTypeParser(format, {
  dataType,
  predicate,
  extends: extend
}) {
  let extensions = [];
  if (format in unregExts) {
    extensions = unregExts[format];
    delete unregExts[format];
    _logger.default.debug('[core]', `Subclasses "${extensions}" finally registered to parent type "${format}"`);
  }
  const object = {
    predicate,
    extensions
  };
  types[format] = object;
  if (extend) {
    const parentTypeParser = types[extend];
    if (parentTypeParser) {
      parentTypeParser.extensions.push(format);
    } else {
      if (!unregExts[extend]) {
        unregExts[extend] = [];
      }
      unregExts[extend].push(format);
      _logger.default.debug('[core]', `Subclass "${format}" is waiting on parent type "${extend}"`);
    }
  } else {
    const typeList = dataTypes[dataType] || (dataTypes[dataType] = []);
    typeList.push(format);
  }
}
function hasTypeParser(type) {
  return Object.prototype.hasOwnProperty.call(types, type);
}
function removeTypeParser(type) {
  delete types[type];
  const typeLists = [...Object.keys(dataTypes).map(key => dataTypes[key]), ...Object.keys(types).map(type => types[type].extensions).filter(list => list.length > 0)];
  typeLists.forEach(typeList => {
    const index = typeList.indexOf(type);
    if (index > -1) {
      typeList.splice(index, 1);
    }
  });
}
function listTypeParser() {
  return Object.keys(types);
}
function treeTypeParser() {
  const attachNode = name => ({
    name,
    children: types[name].extensions.map(attachNode)
  });
  return {
    name: 'Type tree',
    children: Object.keys(dataTypes).map(name => ({
      name,
      children: dataTypes[name].map(attachNode)
    }))
  };
}
const typeMatcher = exports.typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/;
},{"../../logger.js":10,"./dataType.js":26}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.format = format;
exports.has = has;
exports.list = list;
exports.register = void 0;
exports.remove = remove;
var _register = _interopRequireDefault(require("../util/register.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function validate(name, formatter) {
  if (typeof name !== 'string') {
    throw new TypeError(`Invalid output format name, expected string, got ${typeof name}`);
  } else if (typeof formatter !== 'function') {
    throw new TypeError(`Invalid formatter, expected function, got ${typeof formatter}`);
  }
}
const register = exports.register = new _register.default();
function add(name, formatter) {
  validate(name, formatter);
  register.set(name, formatter);
}
function remove(name) {
  register.remove(name);
}
function has(name) {
  return register.has(name);
}
function list() {
  return register.list();
}
function format(name, data, ...options) {
  if (!register.has(name)) {
    throw new Error(`Output format "${name}" unavailable`);
  }
  return register.get(name)(data, ...options);
}
},{"../util/register.js":39}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downgradeCsl = downgradeCsl;
exports.upgradeCsl = upgradeCsl;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function upgradeCsl(item) {
  if (Array.isArray(item)) {
    return item.map(upgradeCsl);
  }
  item = _objectSpread({}, item);
  if ('event' in item) {
    item['event-title'] = item.event;
    delete item.event;
  }
  if (item.type === 'book' && 'version' in item) {
    item.type = 'software';
  }
  return item;
}
function downgradeCsl(item) {
  if (Array.isArray(item)) {
    return item.map(downgradeCsl);
  }
  item = _objectSpread({}, item);
  if ('event-title' in item) {
    item.event = item['event-title'];
    delete item['event-title'];
  }
  if (item.type === 'software') {
    item.type = 'book';
  }
  return item;
}
},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepCopy = deepCopy;
exports.default = void 0;
function deepCopy(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || value.constructor !== Object && value.constructor !== Array) {
    return value;
  }
  if (seen.has(value)) {
    throw new TypeError('Recursively copying circular structure');
  }
  seen.add(value);
  let copy;
  if (value.constructor === Array) {
    copy = value.map(value => deepCopy(value, seen));
  } else {
    const object = {};
    for (const key in value) {
      object[key] = deepCopy(value[key], seen);
    }
    copy = object;
  }
  seen.delete(value);
  return copy;
}
var _default = exports.default = deepCopy;
},{}],35:[function(require,module,exports){
(function (process){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.fetchFile = fetchFile;
exports.fetchFileAsync = fetchFileAsync;
exports.setUserAgent = setUserAgent;
var _syncFetch = _interopRequireDefault(require("sync-fetch"));
var _nodeFetch = _interopRequireWildcard(require("node-fetch"));
var _logger = _interopRequireDefault(require("../logger.js"));
var _package = _interopRequireDefault(require("../../package.json"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const isBrowser = typeof location !== 'undefined' && typeof navigator !== 'undefined';
const asyncFetch = isBrowser ? fetch : _nodeFetch.default;
const asyncHeaders = isBrowser ? Headers : _nodeFetch.Headers;
let userAgent = `Citation.js/${_package.default.version}`;
if (typeof process !== 'undefined' && process && process.release && process.release.name === 'node' && process.version) {
  userAgent += ` Node.js/${process.version}`;
}
function normaliseHeaders(headers) {
  const result = {};
  const entries = headers instanceof asyncHeaders || headers instanceof _syncFetch.default.Headers ? Array.from(headers) : Object.entries(headers);
  for (const [name, header] of entries) {
    result[name.toLowerCase()] = header.toString();
  }
  return result;
}
function parseOpts(opts = {}) {
  const reqOpts = {
    headers: {
      accept: '*/*'
    },
    method: 'GET',
    checkContentType: opts.checkContentType
  };
  if (userAgent && !isBrowser) {
    reqOpts.headers['user-agent'] = userAgent;
  }
  if (opts.body) {
    reqOpts.method = 'POST';
    const isJson = typeof opts.body !== 'string';
    reqOpts.body = isJson ? JSON.stringify(opts.body) : opts.body;
    reqOpts.headers['content-type'] = isJson ? 'application/json' : 'text/plain';
  }
  if (opts.headers) {
    Object.assign(reqOpts.headers, normaliseHeaders(opts.headers));
  }
  return reqOpts;
}
function sameType(request, response) {
  if (!request.accept || request.accept === '*/*' || !response['content-type']) {
    return true;
  }
  const [a, b] = response['content-type'].split(';')[0].trim().split('/');
  return request.accept.split(',').map(type => type.split(';')[0].trim().split('/')).some(([c, d]) => (c === a || c === '*') && (d === b || d === '*'));
}
function checkResponse(response, opts) {
  const {
    status,
    headers
  } = response;
  let error;
  if (status >= 400) {
    error = new Error(`Server responded with status code ${status}`);
  } else if (opts.checkContentType === true && !sameType(opts.headers, normaliseHeaders(headers))) {
    error = new Error(`Server responded with content-type ${headers.get('content-type')}`);
  }
  if (error) {
    error.status = status;
    error.headers = headers;
    error.body = response.body;
    throw error;
  }
  return response;
}
function fetchFile(url, opts) {
  const reqOpts = parseOpts(opts);
  _logger.default.http('[core]', reqOpts.method, url, reqOpts);
  const response = checkResponse((0, _syncFetch.default)(url, reqOpts), reqOpts);
  return response.text();
}
async function fetchFileAsync(url, opts) {
  const reqOpts = parseOpts(opts);
  _logger.default.http('[core]', reqOpts.method, url, reqOpts);
  return asyncFetch(url, reqOpts).then(response => checkResponse(response, reqOpts)).then(response => response.text());
}
function setUserAgent(newUserAgent) {
  userAgent = newUserAgent;
}
var _default = exports.default = fetchFile;
}).call(this)}).call(this,require('_process'))
},{"../../package.json":42,"../logger.js":10,"_process":101,"node-fetch":98,"sync-fetch":102}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function fetchId(list, prefix) {
  let id;
  while (id === undefined || list.includes(id)) {
    id = `${prefix}${Math.random().toString().slice(2)}`;
  }
  return id;
}
var _default = exports.default = fetchId;
},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grammar = void 0;
var _deepCopy = require("./deepCopy.js");
class Grammar {
  constructor(rules, state) {
    this.rules = rules;
    this.defaultState = state;
    this.mainRule = Object.keys(rules)[0];
    this.log = [];
  }
  parse(iterator, mainRule) {
    this.lexer = iterator;
    this.token = this.lexer.next();
    this.state = (0, _deepCopy.deepCopy)(this.defaultState);
    this.log = [];
    return this.consumeRule(mainRule || this.mainRule);
  }
  matchEndOfFile() {
    return !this.token;
  }
  matchToken(type) {
    return this.token && type === this.token.type;
  }
  consumeToken(type, optional) {
    const token = this.token;
    if (!type || token && token.type === type) {
      this.token = this.lexer.next();
      return token;
    } else if (optional) {
      return undefined;
    } else {
      const got = token ? `"${token.type}"` : 'EOF';
      const error = new SyntaxError(this.lexer.formatError(token, `expected "${type}", got ${got}`));
      error.message += ` (${this.log.join('->')})`;
      throw error;
    }
  }
  consumeRule(rule) {
    this.log.push(rule);
    const result = this.rules[rule].call(this);
    this.log.pop();
    return result;
  }
}
exports.Grammar = Grammar;
},{"./deepCopy.js":34}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Grammar", {
  enumerable: true,
  get: function () {
    return _grammar.Grammar;
  }
});
Object.defineProperty(exports, "Register", {
  enumerable: true,
  get: function () {
    return _register.default;
  }
});
Object.defineProperty(exports, "TokenStack", {
  enumerable: true,
  get: function () {
    return _stack.default;
  }
});
Object.defineProperty(exports, "Translator", {
  enumerable: true,
  get: function () {
    return _translator.Translator;
  }
});
Object.defineProperty(exports, "deepCopy", {
  enumerable: true,
  get: function () {
    return _deepCopy.default;
  }
});
Object.defineProperty(exports, "downgradeCsl", {
  enumerable: true,
  get: function () {
    return _csl.downgradeCsl;
  }
});
Object.defineProperty(exports, "fetchFile", {
  enumerable: true,
  get: function () {
    return _fetchFile.fetchFile;
  }
});
Object.defineProperty(exports, "fetchFileAsync", {
  enumerable: true,
  get: function () {
    return _fetchFile.fetchFileAsync;
  }
});
Object.defineProperty(exports, "fetchId", {
  enumerable: true,
  get: function () {
    return _fetchId.default;
  }
});
Object.defineProperty(exports, "setUserAgent", {
  enumerable: true,
  get: function () {
    return _fetchFile.setUserAgent;
  }
});
Object.defineProperty(exports, "upgradeCsl", {
  enumerable: true,
  get: function () {
    return _csl.upgradeCsl;
  }
});
var _csl = require("./csl.js");
var _deepCopy = _interopRequireDefault(require("./deepCopy.js"));
var _fetchFile = require("./fetchFile.js");
var _fetchId = _interopRequireDefault(require("./fetchId.js"));
var _stack = _interopRequireDefault(require("./stack.js"));
var _register = _interopRequireDefault(require("./register.js"));
var _grammar = require("./grammar.js");
var _translator = require("./translator.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
},{"./csl.js":33,"./deepCopy.js":34,"./fetchFile.js":35,"./fetchId.js":36,"./grammar.js":37,"./register.js":39,"./stack.js":40,"./translator.js":41}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Register {
  constructor(data = {}) {
    this.data = data;
  }
  set(key, value) {
    this.data[key] = value;
    return this;
  }
  add(...args) {
    return this.set(...args);
  }
  delete(key) {
    delete this.data[key];
    return this;
  }
  remove(...args) {
    return this.delete(...args);
  }
  get(key) {
    return this.data[key];
  }
  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }
  list() {
    return Object.keys(this.data);
  }
}
var _default = exports.default = Register;
},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class TokenStack {
  constructor(array) {
    this.stack = array;
    this.index = 0;
    this.current = this.stack[this.index];
  }
  static getPatternText(pattern) {
    return `"${pattern instanceof RegExp ? pattern.source : pattern}"`;
  }
  static getMatchCallback(pattern) {
    if (Array.isArray(pattern)) {
      const matches = pattern.map(TokenStack.getMatchCallback);
      return token => matches.some(matchCallback => matchCallback(token));
    } else if (pattern instanceof Function) {
      return pattern;
    } else if (pattern instanceof RegExp) {
      return token => pattern.test(token);
    } else {
      return token => pattern === token;
    }
  }
  tokensLeft() {
    return this.stack.length - this.index;
  }
  matches(pattern) {
    return TokenStack.getMatchCallback(pattern)(this.current, this.index, this.stack);
  }
  matchesSequence(sequence) {
    const part = this.stack.slice(this.index, this.index + sequence.length).join('');
    return typeof sequence === 'string' ? part === sequence : sequence.every((pattern, index) => TokenStack.getMatchCallback(pattern)(part[index]));
  }
  consumeToken(pattern = /^[\s\S]$/, {
    inverse = false,
    spaced = true
  } = {}) {
    if (spaced) {
      this.consumeWhitespace();
    }
    const token = this.current;
    const match = TokenStack.getMatchCallback(pattern)(token, this.index, this.stack);
    if (match) {
      this.current = this.stack[++this.index];
    } else {
      throw new SyntaxError(`Unexpected token at index ${this.index}: Expected ${TokenStack.getPatternText(pattern)}, got "${token}"`);
    }
    if (spaced) {
      this.consumeWhitespace();
    }
    return token;
  }
  consumeWhitespace(pattern = /^\s$/, {
    optional = true
  } = {}) {
    return this.consume(pattern, {
      min: +!optional
    });
  }
  consumeN(length) {
    if (this.tokensLeft() < length) {
      throw new SyntaxError('Not enough tokens left');
    }
    const start = this.index;
    while (length--) {
      this.current = this.stack[++this.index];
    }
    return this.stack.slice(start, this.index).join('');
  }
  consumeSequence(sequence) {
    if (this.matchesSequence(sequence)) {
      return this.consumeN(sequence.length);
    } else {
      throw new SyntaxError(`Expected "${sequence}", got "${this.consumeN(sequence.length)}"`);
    }
  }
  consume(pattern = /^[\s\S]$/, {
    min = 0,
    max = Infinity,
    inverse = false,
    tokenMap,
    tokenFilter
  } = {}) {
    const start = this.index;
    const match = TokenStack.getMatchCallback(pattern);
    while (match(this.current, this.index, this.stack) !== inverse) {
      this.current = this.stack[++this.index];
    }
    let consumed = this.stack.slice(start, this.index);
    if (consumed.length < min) {
      throw new SyntaxError(`Not enough ${TokenStack.getPatternText(pattern)}`);
    } else if (consumed.length > max) {
      throw new SyntaxError(`Too many ${TokenStack.getPatternText(pattern)}`);
    }
    if (tokenMap) {
      consumed = consumed.map(tokenMap);
    }
    if (tokenFilter) {
      consumed = consumed.filter(tokenFilter);
    }
    return consumed.join('');
  }
}
var _default = exports.default = TokenStack;
},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translator = void 0;
function createConditionEval(condition) {
  return function conditionEval(input) {
    if (typeof condition === 'boolean') {
      return condition;
    }
    return Object.keys(condition).every(prop => {
      const value = condition[prop];
      if (value === true) {
        return prop in input;
      } else if (value === false) {
        return !(prop in input);
      } else if (typeof value === 'function') {
        return value(input[prop]);
      } else if (Array.isArray(value)) {
        return value.includes(input[prop]);
      } else {
        return input[prop] === value;
      }
    });
  };
}
function parsePropStatement(prop, toSource) {
  let inputProp;
  let outputProp;
  let convert;
  let condition;
  if (typeof prop === 'string') {
    inputProp = outputProp = prop;
  } else if (prop) {
    inputProp = toSource ? prop.target : prop.source;
    outputProp = toSource ? prop.source : prop.target;
    if (prop.convert) {
      convert = toSource ? prop.convert.toSource : prop.convert.toTarget;
    }
    if (prop.when) {
      condition = toSource ? prop.when.target : prop.when.source;
      if (condition != null) {
        condition = createConditionEval(condition);
      }
    }
  } else {
    return null;
  }
  inputProp = [].concat(inputProp).filter(Boolean);
  outputProp = [].concat(outputProp).filter(Boolean);
  return {
    inputProp,
    outputProp,
    convert,
    condition
  };
}
function createConverter(props, toSource) {
  toSource = toSource === Translator.CONVERT_TO_SOURCE;
  props = props.map(prop => parsePropStatement(prop, toSource)).filter(Boolean);
  return function converter(input) {
    const output = {};
    for (const {
      inputProp,
      outputProp,
      convert,
      condition
    } of props) {
      if (outputProp.length === 0) {
        continue;
      } else if (condition && !condition(input)) {
        continue;
      } else if (inputProp.length !== 0 && inputProp.every(prop => !(prop in input))) {
        continue;
      }
      let outputData = inputProp.map(prop => input[prop]);
      if (convert) {
        try {
          const converted = convert.apply(input, outputData);
          outputData = outputProp.length === 1 ? [converted] : converted;
        } catch (cause) {
          throw new Error(`Failed to convert ${inputProp} to ${outputProp}`, {
            cause
          });
        }
      }
      outputProp.forEach((prop, index) => {
        const value = outputData[index];
        if (value !== undefined) {
          output[prop] = value;
        }
      });
    }
    return output;
  };
}
class Translator {
  constructor(props) {
    this.convertToSource = createConverter(props, Translator.CONVERT_TO_SOURCE);
    this.convertToTarget = createConverter(props, Translator.CONVERT_TO_TARGET);
  }
}
exports.Translator = Translator;
Translator.CONVERT_TO_SOURCE = Symbol('convert to source');
Translator.CONVERT_TO_TARGET = Symbol('convert to target');
},{}],42:[function(require,module,exports){
module.exports={
  "name": "@citation-js/core",
  "version": "0.8.2",
  "description": "Convert different bibliographic metadata sources",
  "keywords": [
    "citation-js",
    "citation",
    "bibliography"
  ],
  "author": "Lars Willighagen <lars.willighagen@gmail.com>",
  "license": "MIT",
  "main": "lib/index.js",
  "module": "lib-mjs/index.js",
  "directories": {
    "lib": "src",
    "test": "__tests__"
  },
  "homepage": "https://citation.js.org/",
  "repository": {
    "type": "git",
    "url": "https://github.com/citation-js/citation-js.git",
    "directory": "packages/core"
  },
  "bugs": {
    "url": "https://github.com/citation-js/citation-js/issues"
  },
  "engines": {
    "node": ">=20.19.0"
  },
  "files": [
    "lib",
    "lib-mjs"
  ],
  "scripts": {
    "test": "mocha -c -R dot -r @babel/register test/*.spec.js",
    "test:live": "TEST_MOCK_HTTP=false npm test",
    "coverage": "NODE_ENV=coverage nyc npm test -- -c && nyc report --reporter=text-lcov > coverage.lcov"
  },
  "dependencies": {
    "@citation-js/date": "^0.5.0",
    "@citation-js/name": "^0.4.2",
    "node-fetch": "^3.3.2",
    "sync-fetch": "^0.6.0"
  },
  "gitHead": "28ce00a6a5dd967baeb7f128f3f6b4a7217e5d46"
}

},{}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function get() {
    return _output.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _input.default;
  }
});

var _input = _interopRequireDefault(require("./input"));

var _output = _interopRequireDefault(require("./output"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./input":44,"./output":45}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const monthMap = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
};
const dateRangeDelimiters = / (?:to|[-/]) | ?(?:--|[–—]) ?/;
const dateRangePattern = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/;

function getMonth(monthName) {
  return monthMap[monthName.toLowerCase().slice(0, 3)];
}

function parseEpoch(date) {
  const epoch = new Date(date);

  if (typeof date === 'number' && !isNaN(epoch.valueOf())) {
    return [epoch.getFullYear(), epoch.getMonth() + 1, epoch.getDate()];
  } else {
    return null;
  }
}

const parseIso8601 = function parseIso8601(date) {
  const pattern = /^(\d{4}|[-+]\d{6,})-(\d{2})(?:-(\d{2}))?/;

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null;
  }

  const _date$match = date.match(pattern),
        _date$match2 = _slicedToArray(_date$match, 4),
        year = _date$match2[1],
        month = _date$match2[2],
        day = _date$match2[3];

  if (!+month) {
    return [year];
  } else if (!+day) {
    return [year, month];
  } else {
    return [year, month, day];
  }
};

const parseRfc2822 = function parseRfc2822(date) {
  const pattern = /^(?:[a-z]{3},\s*)?(\d{1,2}) ([a-z]{3}) (\d{4,})/i;

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null;
  }

  let _date$match3 = date.match(pattern),
      _date$match4 = _slicedToArray(_date$match3, 4),
      day = _date$match4[1],
      month = _date$match4[2],
      year = _date$match4[3];

  month = getMonth(month);

  if (!month) {
    return null;
  }

  return [year, month, day];
};

function parseAmericanDay(date) {
  const pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2}(?:\d{2})?)/;

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null;
  }

  const _date$match5 = date.match(pattern),
        _date$match6 = _slicedToArray(_date$match5, 4),
        month = _date$match6[1],
        day = _date$match6[2],
        year = _date$match6[3];

  const check = new Date(year, month, day);

  if (check.getMonth() === parseInt(month)) {
    return [year, month, day];
  } else {
    return null;
  }
}

function parseDay(date) {
  const pattern = /^(\d{1,2})[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](-?\d+)/i;
  const reversePattern = /^(-?\d+)[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](\d{1,2})/i;
  let year;
  let month;
  let day;

  if (typeof date !== 'string') {
    return null;
  } else if (pattern.test(date)) {
    var _date$match7 = date.match(pattern);

    var _date$match8 = _slicedToArray(_date$match7, 4);

    day = _date$match8[1];
    month = _date$match8[2];
    year = _date$match8[3];
  } else if (reversePattern.test(date)) {
    var _date$match9 = date.match(reversePattern);

    var _date$match10 = _slicedToArray(_date$match9, 4);

    year = _date$match10[1];
    month = _date$match10[2];
    day = _date$match10[3];
  } else {
    return null;
  }

  if (getMonth(month)) {
    month = getMonth(month);
  } else if (isNaN(month)) {
    return null;
  }

  return [year, month, day];
}

function parseMonth(date) {
  const pattern = /^([a-z]{3,10}|-?\d+)[^\w-]+([a-z]{3,10}|-?\d+)$/i;

  if (typeof date === 'string' && pattern.test(date)) {
    const values = date.match(pattern).slice(1, 3);
    let month;

    if (getMonth(values[1])) {
      month = getMonth(values.pop());
    } else if (getMonth(values[0])) {
      month = getMonth(values.shift());
    } else if (values.some(isNaN) || values.every(value => +value < 0)) {
      return null;
    } else if (+values[0] < 0) {
      month = values.pop();
    } else if (+values[0] > +values[1] && +values[1] > 0) {
      month = values.pop();
    } else {
      month = values.shift();
    }

    const year = values.pop();
    return [year, month];
  } else {
    return null;
  }
}

function parseYear(date) {
  if (typeof date !== 'string') {
    return null;
  }

  const adBc = date.match(/^(\d+) ?(a\.?d\.?|b\.?c\.?)$/i);

  if (adBc) {
    const _adBc$slice = adBc.slice(1),
          _adBc$slice2 = _slicedToArray(_adBc$slice, 2),
          date = _adBc$slice2[0],
          suffix = _adBc$slice2[1];

    return [date * (suffix.toLowerCase()[0] === 'a' ? 1 : -1)];
  } else if (/^-?\d+$/.test(date)) {
    return [date];
  } else {
    return null;
  }
}

function parseDateParts(value) {
  const dateParts = parseEpoch(value) || parseIso8601(value) || parseRfc2822(value) || parseAmericanDay(value) || parseDay(value) || parseMonth(value) || parseYear(value);
  return dateParts && dateParts.map(string => parseInt(string));
}

function splitDateRange(range) {
  if (dateRangePattern.test(range)) {
    return range.match(dateRangePattern).slice(1, 3);
  } else {
    return range.split(dateRangeDelimiters);
  }
}

function parseDate(rangeStart, rangeEnd) {
  const range = [];
  const rangeStartAsRange = typeof rangeStart === 'string' && splitDateRange(rangeStart);

  if (rangeEnd) {
    range.push(rangeStart, rangeEnd);
  } else if (rangeStartAsRange && rangeStartAsRange.length === 2) {
    range.push(...rangeStartAsRange);
  } else {
    range.push(rangeStart);
  }

  const dateParts = range.map(parseDateParts);

  if (dateParts.filter(Boolean).length === range.length) {
    return {
      'date-parts': dateParts
    };
  } else {
    return {
      raw: rangeEnd ? range.join('/') : rangeStart
    };
  }
}

var _default = parseDate;
exports.default = _default;
},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function padStart(str, len, chr) {
  if (str.length >= len) {
    return str;
  }

  while (str.length < len) {
    str = chr + str;
  }

  return str.slice(-len);
}

const getDate = function getDate(date, delimiter = '-') {
  if (!date['date-parts']) {
    return date.raw;
  }

  const dateParts = date['date-parts'][0].map(part => part.toString());

  switch (dateParts.length) {
    case 3:
      dateParts[2] = padStart(dateParts[2], 2, '0');

    case 2:
      dateParts[1] = padStart(dateParts[1], 2, '0');

    case 1:
      dateParts[0] = padStart(dateParts[0], 4, '0');
      break;
  }

  return dateParts.join(delimiter);
};

var _default = getDate;
exports.default = _default;
},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _input.default;
  }
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function get() {
    return _output.default;
  }
});

var _input = _interopRequireDefault(require("./input"));

var _output = _interopRequireDefault(require("./output"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./input":47,"./output":48}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const punctutationMatcher = string => string.replace(/$|( )|(?!^)(?=[A-Z])/g, '\\.?$1');

const getListMatcher = list => `(?:${list.join('|')})\\b`;

const getSplittingRegex = (matcher, flags) => new RegExp(`(?:^| )(${matcher}$)`, flags);

const titles = ['mr', 'mrs', 'ms', 'miss', 'dr', 'herr', 'monsieur', 'hr', 'frau', 'a v m', 'admiraal', 'admiral', 'air cdre', 'air commodore', 'air marshal', 'air vice marshal', 'alderman', 'alhaji', 'ambassador', 'baron', 'barones', 'brig', 'brig gen', 'brig general', 'brigadier', 'brigadier general', 'brother', 'canon', 'capt', 'captain', 'cardinal', 'cdr', 'chief', 'cik', 'cmdr', 'coach', 'col', 'col dr', 'colonel', 'commandant', 'commander', 'commissioner', 'commodore', 'comte', 'comtessa', 'congressman', 'conseiller', 'consul', 'conte', 'contessa', 'corporal', 'councillor', 'count', 'countess', 'crown prince', 'crown princess', 'dame', 'datin', 'dato', 'datuk', 'datuk seri', 'deacon', 'deaconess', 'dean', 'dhr', 'dipl ing', 'doctor', 'dott', 'dott sa', 'dr', 'dr ing', 'dra', 'drs', 'embajador', 'embajadora', 'en', 'encik', 'eng', 'eur ing', 'exma sra', 'exmo sr', 'f o', 'father', 'first lieutient', 'first officer', 'flt lieut', 'flying officer', 'fr', 'frau', 'fraulein', 'fru', 'gen', 'generaal', 'general', 'governor', 'graaf', 'gravin', 'group captain', 'grp capt', 'h e dr', 'h h', 'h m', 'h r h', 'hajah', 'haji', 'hajim', 'her highness', 'her majesty', 'herr', 'high chief', 'his highness', 'his holiness', 'his majesty', 'hon', 'hr', 'hra', 'ing', 'ir', 'jonkheer', 'judge', 'justice', 'khun ying', 'kolonel', 'lady', 'lcda', 'lic', 'lieut', 'lieut cdr', 'lieut col', 'lieut gen', 'lord', 'm', 'm l', 'm r', 'madame', 'mademoiselle', 'maj gen', 'major', 'master', 'mevrouw', 'miss', 'mlle', 'mme', 'monsieur', 'monsignor', 'mr', 'mrs', 'ms', 'mstr', 'nti', 'pastor', 'president', 'prince', 'princess', 'princesse', 'prinses', 'prof', 'prof dr', 'prof sir', 'professor', 'puan', 'puan sri', 'rabbi', 'rear admiral', 'rev', 'rev canon', 'rev dr', 'rev mother', 'reverend', 'rva', 'senator', 'sergeant', 'sheikh', 'sheikha', 'sig', 'sig na', 'sig ra', 'sir', 'sister', 'sqn ldr', 'sr', 'sr d', 'sra', 'srta', 'sultan', 'tan sri', 'tan sri dato', 'tengku', 'teuku', 'than puying', 'the hon dr', 'the hon justice', 'the hon miss', 'the hon mr', 'the hon mrs', 'the hon ms', 'the hon sir', 'the very rev', 'toh puan', 'tun', 'vice admiral', 'viscount', 'viscountess', 'wg cdr'];
const suffixes = ['I', 'II', 'III', 'IV', 'V', 'Senior', 'Junior', 'Jr', 'Sr', 'PhD', 'Ph\\.D', 'APR', 'RPh', 'PE', 'MD', 'MA', 'DMD', 'CME', 'BVM', 'CFRE', 'CLU', 'CPA', 'CSC', 'CSJ', 'DC', 'DD', 'DDS', 'DO', 'DVM', 'EdD', 'Esq', 'JD', 'LLD', 'OD', 'OSB', 'PC', 'Ret', 'RGS', 'RN', 'RNC', 'SHCJ', 'SJ', 'SNJM', 'SSMO', 'USA', 'USAF', 'USAFR', 'USAR', 'USCG', 'USMC', 'USMCR', 'USN', 'USNR'];
const particles = ['Vere', 'Von', 'Van', 'De', 'Del', 'Della', 'Di', 'Da', 'Pietro', 'Vanden', 'Du', 'St.', 'St', 'La', 'Lo', 'Ter', 'O', 'O\'', 'Mac', 'Fitz'];
const titleMatcher = getListMatcher(titles.map(punctutationMatcher));
const suffixMatcher = getListMatcher(suffixes.map(punctutationMatcher));
const particleMatcher = getListMatcher(particles);
const titleSplitter = new RegExp(`^((?:${titleMatcher} )*)(.*)$`, 'i');
const suffixSplitter = getSplittingRegex(`(?:${suffixMatcher}, )*(?:${suffixMatcher})`, 'i');
const particleSplitter = getSplittingRegex(`${/(?:[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1C90-\u1CBA\u1CBD-\u1CBF\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2160-\u216F\u2183\u24B6-\u24CF\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uA7B8\uFF21-\uFF3A]|\uD801[\uDC00-\uDC27\uDCB0-\uDCD3]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD81B[\uDE40-\uDE5F]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89])/.source}.*`);
const endSplitter = getSplittingRegex(`(?:${/(?:[a-z\xAA\xB5\xBA\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02B8\u02C0\u02C1\u02E0-\u02E4\u0345\u0371\u0373\u0377\u037A-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1DBF\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u2071\u207F\u2090-\u209C\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2170-\u217F\u2184\u24D0-\u24E9\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7D\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B-\uA69D\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7F8-\uA7FA\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43])/.source}.*|${particleMatcher}.*|\\S*)`);

const parseName = function parseName(name = '') {
  if (typeof name !== 'string') {
    name = name + '';
  }

  let start = '';
  let mid = '';
  let end = '';

  if (/[^.], /.test(name)) {
    const parts = name.split(', ');
    end = parts.shift();
    const suffixMatch = RegExp(suffixMatcher).exec(parts.join(', '));
    start = parts.splice(suffixMatch && suffixMatch.index !== 0 ? 0 : -1, 1)[0];
    mid = parts.join(', ');
  } else {
    const parts = name.split(suffixSplitter, 2);
    const main = parts.shift().split(endSplitter, 2);
    start = main[0];
    end = main[1];
    mid = parts.pop();
  }

  const _start$match = start.match(titleSplitter),
        _start$match2 = _slicedToArray(_start$match, 3),
        droppingParticle = _start$match2[1],
        given = _start$match2[2];

  const suffix = mid;

  const _end$split$reverse = end.split(particleSplitter, 2).reverse(),
        _end$split$reverse2 = _slicedToArray(_end$split$reverse, 2),
        family = _end$split$reverse2[0],
        nonDroppingParticle = _end$split$reverse2[1];

  if (!given && family) {
    return family.includes(' ') ? {
      literal: family
    } : {
      family
    };
  } else if (family) {
    const nameObject = {
      'dropping-particle': droppingParticle,
      given,
      suffix,
      'non-dropping-particle': nonDroppingParticle,
      family
    };
    Object.keys(nameObject).forEach(key => {
      if (!nameObject[key]) {
        delete nameObject[key];
      }
    });
    return nameObject;
  } else {
    return {
      literal: name
    };
  }
};

exports.default = exports.parse = parseName;
const scope = '@name';
exports.scope = scope;
const types = '@name';
exports.types = types;
},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const startParts = ['dropping-particle', 'given'];
const suffixParts = ['suffix'];
const endParts = ['non-dropping-particle', 'family'];

const getName = function getName(name, reversed = false) {
  const get = parts => parts.map(entry => name[entry] || '').filter(Boolean).join(' ');

  if (name.literal) {
    return name.literal;
  } else if (reversed) {
    const suffixPart = get(suffixParts) ? `, ${get(suffixParts)}` : '';
    const startPart = get(startParts) ? `, ${get(startParts)}` : '';
    return get(endParts) + suffixPart + startPart;
  } else {
    return `${get([...startParts, ...suffixParts, ...endParts])}`;
  }
};

var _default = getName;
exports.default = _default;
},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _biblatexTypes = _interopRequireDefault(require("./mapping/biblatexTypes.json"));
var _bibtexTypes = _interopRequireDefault(require("./mapping/bibtexTypes.json"));
var constants = _interopRequireWildcard(require("./input/constants.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = {
  constants,
  types: {
    biblatex: _biblatexTypes.default,
    bibtex: _bibtexTypes.default
  },
  parse: {
    biblatex: true,
    strict: false,
    sentenceCase: 'never'
  },
  format: {
    useIdAsLabel: false,
    checkLabel: true,
    asciiOnly: true
  },
  biber: {
    annotationMarker: '+an',
    namedAnnotationMarker: ':'
  }
};
},{"./input/constants.js":52,"./mapping/biblatexTypes.json":62,"./mapping/bibtexTypes.json":64}],50:[function(require,module,exports){
"use strict";

var _core = require("@citation-js/core");
var _index = require("./input/index.js");
var _config = _interopRequireDefault(require("./config.js"));
var _index2 = _interopRequireDefault(require("./output/index.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_core.plugins.add(_index.ref, {
  input: _index.formats,
  output: _index2.default,
  config: _config.default
});
},{"./config.js":49,"./input/index.js":56,"./output/index.js":71,"@citation-js/core":"citation-js"}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textEntry = exports.text = exports.parse = void 0;
const bibTxtRegex = {
  splitEntries: /\n\s*(?=\[)/g,
  parseEntry: /^\[(.+?)\]\s*(?:\n([\s\S]+))?$/,
  splitPairs: /((?=.)\s)*\n\s*/g,
  splitPair: /:(.*)/
};
const parseBibTxtEntry = entry => {
  const [, label, pairs] = entry.match(bibTxtRegex.parseEntry) || [];
  if (!label || !pairs) {
    return {};
  } else {
    const out = {
      type: 'book',
      label,
      properties: {}
    };
    pairs.trim().split(bibTxtRegex.splitPairs).filter(v => v).forEach(pair => {
      let [key, value] = pair.split(bibTxtRegex.splitPair);
      if (value) {
        key = key.trim();
        value = value.trim();
        if (key === 'type') {
          out.type = value;
        } else {
          out.properties[key] = value;
        }
      }
    });
    return out;
  }
};
exports.textEntry = parseBibTxtEntry;
const parseBibTxt = src => src.trim().split(bibTxtRegex.splitEntries).map(parseBibTxtEntry);
exports.text = exports.parse = parseBibTxt;
},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sentenceCaseLanguages = exports.required = exports.mathScripts = exports.mathScriptFormatting = exports.mathCommands = exports.ligatures = exports.ligaturePattern = exports.formattingEnvs = exports.formattingCommands = exports.formatting = exports.fieldTypes = exports.diacritics = exports.defaultStrings = exports.commands = exports.argumentCommands = void 0;
var _required2 = _interopRequireDefault(require("./required.json"));
var _fieldTypes2 = _interopRequireDefault(require("./fieldTypes.json"));
var _unicode = _interopRequireDefault(require("./unicode.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const required = exports.required = _required2.default;
const fieldTypes = exports.fieldTypes = _fieldTypes2.default;
const diacritics = exports.diacritics = _unicode.default.diacritics;
const commands = exports.commands = _unicode.default.commands;
const mathCommands = exports.mathCommands = _unicode.default.mathCommands;
const defaultStrings = exports.defaultStrings = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
  acmcs: 'ACM Computing Surveys',
  acta: 'Acta Informatica',
  cacm: 'Communications of the ACM',
  ibmjrd: 'IBM Journal of Research and Development',
  ibmsj: 'IBM Systems Journal',
  ieeese: 'IEEE Transactions on Software Engineering',
  ieeetc: 'IEEE Transactions on Computers',
  ieeetcad: 'IEEE Transactions on Computer-Aided Design of Integrated Circuits',
  ipl: 'Information Processing Letters',
  jacm: 'Journal of the ACM',
  jcss: 'Journal of Computer and System Sciences',
  scp: 'Science of Computer Programming',
  sicomp: 'SIAM Journal on Computing',
  tocs: 'ACM Transactions on Computer Systems',
  tods: 'ACM Transactions on Database Systems',
  tog: 'ACM Transactions on Graphics',
  toms: 'ACM Transactions on Mathematical Software',
  toois: 'ACM Transactions on Office Information Systems',
  toplas: 'ACM Transactions on Programming Languages and Systems',
  tcs: 'Theoretical Computer Science'
};
const formattingEnvs = exports.formattingEnvs = {
  it: 'italics',
  itshape: 'italics',
  sl: 'italics',
  slshape: 'italics',
  em: 'italics',
  bf: 'bold',
  bfseries: 'bold',
  sc: 'smallcaps',
  scshape: 'smallcaps',
  rm: undefined,
  sf: undefined,
  tt: undefined
};
const formattingCommands = exports.formattingCommands = {
  textit: 'italics',
  textsl: 'italics',
  emph: 'italics',
  mkbibitalic: 'italics',
  mkbibemph: 'italics',
  textbf: 'bold',
  strong: 'bold',
  mkbibbold: 'bold',
  textsc: 'smallcaps',
  textsuperscript: 'superscript',
  textsubscript: 'subscript',
  enquote: 'quotes',
  mkbibquote: 'quotes',
  textmd: undefined,
  textrm: undefined,
  textsf: undefined,
  texttt: undefined,
  textup: undefined
};
const formatting = exports.formatting = {
  italics: ['<i>', '</i>'],
  bold: ['<b>', '</b>'],
  superscript: ['<sup>', '</sup>'],
  subscript: ['<sub>', '</sub>'],
  smallcaps: ['<span style="font-variant:small-caps;">', '</span>'],
  nocase: ['<span class="nocase">', '</span>'],
  quotes: ['\u201C', '\u201D']
};
const argumentCommands = exports.argumentCommands = {
  ElsevierGlyph(glyph) {
    return String.fromCharCode(parseInt(glyph, 16));
  },
  href(url, text) {
    return url;
  },
  url(url) {
    return url;
  }
};
const ligaturePattern = exports.ligaturePattern = /---?|''|``|~/g;
const ligatures = exports.ligatures = {
  '--': '\u2013',
  '---': '\u2014',
  '``': '\u201C',
  "''": '\u201D',
  '~': '\u00A0'
};
const mathScriptFormatting = exports.mathScriptFormatting = {
  '^': 'superscript',
  sp: 'superscript',
  _: 'subscript',
  sb: 'subscript',
  mathrm: undefined
};
const mathScripts = exports.mathScripts = {
  '^': {
    '0': '\u2070',
    '1': '\u00B9',
    '2': '\u00B2',
    '3': '\u00B3',
    '4': '\u2074',
    '5': '\u2075',
    '6': '\u2076',
    '7': '\u2077',
    '8': '\u2078',
    '9': '\u2079',
    '+': '\u207A',
    '-': '\u207B',
    '=': '\u207C',
    '(': '\u207D',
    ')': '\u207E',
    'i': '\u2071',
    'n': '\u207F'
  },
  '_': {
    '0': '\u2080',
    '1': '\u2081',
    '2': '\u2082',
    '3': '\u2083',
    '4': '\u2084',
    '5': '\u2085',
    '6': '\u2086',
    '7': '\u2087',
    '8': '\u2088',
    '9': '\u2089',
    '+': '\u208A',
    '-': '\u208B',
    '=': '\u208C',
    '(': '\u208D',
    ')': '\u208E',
    'a': '\u2090',
    'e': '\u2091',
    'o': '\u2092',
    'x': '\u2093',
    '\u0259': '\u2094',
    'h': '\u2095',
    'k': '\u2096',
    'l': '\u2097',
    'm': '\u2098',
    'n': '\u2099',
    's': '\u209A',
    'p': '\u209B',
    't': '\u209C'
  }
};
const sentenceCaseLanguages = exports.sentenceCaseLanguages = ['american', 'british', 'canadian', 'english', 'australian', 'newzealand', 'usenglish', 'ukenglish', 'en', 'eng', 'en-au', 'en-bz', 'en-ca', 'en-cb', 'en-gb', 'en-ie', 'en-jm', 'en-nz', 'en-ph', 'en-tt', 'en-us', 'en-za', 'en-zw', 'anglais'];
},{"./fieldTypes.json":54,"./required.json":58,"./unicode.json":59}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.parseBibtex = parseBibtex;
var _config = _interopRequireDefault(require("../config.js"));
var _index = require("../mapping/index.js");
var _value = require("./value.js");
var _constants = require("./constants.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function validate(entries, requirements) {
  const problems = [];
  for (const {
    type,
    label,
    properties
  } of entries) {
    if (type in requirements) {
      const missing = [];
      for (const field of requirements[type]) {
        if (Array.isArray(field) && !field.some(field => field in properties)) {
          missing.push(field.join('/'));
        } else if (typeof field === 'string' && !(field in properties)) {
          missing.push(field);
        }
      }
      if (missing.length) {
        problems.push([label, `missing fields: ${missing.join(', ')}`]);
      }
    } else {
      problems.push([label, `invalid type: "${type}"`]);
    }
  }
  if (problems.length) {
    throw new RangeError(['Invalid entries:'].concat(problems.map(([label, problem]) => `  - ${label} has ${problem}`)).join('\n'));
  }
}
function parseEntryValues(entry) {
  const output = {};
  if ('language' in entry.properties) {
    output.language = (0, _value.parse)(entry.properties.language, 'language');
  }
  for (const property in entry.properties) {
    const value = entry.properties[property];
    if (value === '') {
      continue;
    }
    output[property] = (0, _value.parse)(value + '', property, output.language);
  }
  for (const property in entry.annotations) {
    for (const annotation in entry.annotations[property]) {
      output[property + '+an:' + annotation] = (0, _value.parseAnnotation)(entry.annotations[property][annotation]);
    }
  }
  return _objectSpread(_objectSpread({}, entry), {}, {
    properties: output
  });
}
function parse(entries) {
  if (_config.default.parse.strict) {
    validate(entries, _constants.required.biblatex);
  }
  return (0, _index.parse)(entries.map(parseEntryValues));
}
function parseBibtex(entries) {
  if (_config.default.parse.strict) {
    validate(entries, _constants.required.bibtex);
  }
  return (0, _index.parseBibtex)(entries.map(parseEntryValues));
}
},{"../config.js":49,"../mapping/index.js":66,"./constants.js":52,"./value.js":60}],54:[function(require,module,exports){
module.exports={
  "abstract": ["field", "literal"],
  "addendum": ["field", "literal"],
  "afterword": ["list", "name"],
  "annotation": ["field", "literal"],
  "annotator": ["list", "name"],
  "author": ["list", "name"],
  "authortype": ["field", "key"],
  "bookauthor": ["list", "name"],
  "bookpagination": ["field", "key"],
  "booksubtitle": ["field", "literal"],
  "booktitle": ["field", "title"],
  "booktitleaddon": ["field", "literal"],
  "chapter": ["field", "literal"],
  "commentator": ["list", "name"],
  "date": ["field", "date"],
  "doi": ["field", "verbatim"],
  "edition": ["field", "literal"],
  "editor": ["list", "name"],
  "editora": ["list", "name"],
  "editorb": ["list", "name"],
  "editorc": ["list", "name"],
  "editortype": ["field", "key"],
  "editoratype": ["field", "key"],
  "editorbtype": ["field", "key"],
  "editorctype": ["field", "key"],
  "eid": ["field", "literal"],
  "entrysubtype": ["field", "literal"],
  "eprint": ["field", "verbatim"],
  "eprintclass": ["field", "literal"],
  "eprinttype": ["field", "literal"],
  "eventdate": ["field", "date"],
  "eventtitle": ["field", "title"],
  "eventtitleaddon": ["field", "literal"],
  "file": ["field", "verbatim"],
  "foreword": ["list", "name"],
  "holder": ["list", "name"],
  "howpublished": ["field", "literal"],
  "indextitle": ["field", "literal"],
  "institution": ["list", "literal"],
  "introduction": ["list", "name"],
  "isan": ["field", "literal"],
  "isbn": ["field", "literal"],
  "ismn": ["field", "literal"],
  "isrn": ["field", "literal"],
  "issn": ["field", "literal"],
  "issue": ["field", "literal"],
  "issuesubtitle": ["field", "literal"],
  "issuetitle": ["field", "literal"],
  "iswc": ["field", "literal"],
  "journalsubtitle": ["field", "literal"],
  "journaltitle": ["field", "literal"],
  "label": ["field", "literal"],
  "language": ["list", "key"],
  "library": ["field", "literal"],
  "location": ["list", "literal"],
  "mainsubtitle": ["field", "literal"],
  "maintitle": ["field", "title"],
  "maintitleaddon": ["field", "literal"],
  "month": ["field", "literal"],
  "nameaddon": ["field", "literal"],
  "note": ["field", "literal"],
  "number": ["field", "literal"],
  "organization": ["list", "literal"],
  "origdate": ["field", "date"],
  "origlanguage": ["list", "key"],
  "origlocation": ["list", "literal"],
  "origpublisher": ["list", "literal"],
  "origtitle": ["field", "title"],
  "pages": ["field", "range"],
  "pagetotal": ["field", "literal"],
  "pagination": ["field", "key"],
  "part": ["field", "literal"],
  "publisher": ["list", "literal"],
  "pubstate": ["field", "key"],
  "reprinttitle": ["field", "literal"],
  "series": ["field", "title"],
  "shortauthor": ["list", "name"],
  "shorteditor": ["list", "name"],
  "shorthand": ["field", "literal"],
  "shorthandintro": ["field", "literal"],
  "shortjournal": ["field", "literal"],
  "shortseries": ["field", "literal"],
  "shorttitle": ["field", "title"],
  "subtitle": ["field", "literal"],
  "title": ["field", "title"],
  "titleaddon": ["field", "literal"],
  "translator": ["list", "name"],
  "type": ["field", "title"],
  "url": ["field", "uri"],
  "urldate": ["field", "date"],
  "venue": ["field", "literal"],
  "version": ["field", "literal"],
  "volume": ["field", "integer"],
  "volumes": ["field", "integer"],
  "year": ["field", "literal"],
  "crossref": ["field", "entry key"],
  "entryset": ["separated", "literal"],
  "execute": ["field", "code"],
  "gender": ["field", "gender"],
  "langid": ["field", "identifier"],
  "langidopts": ["field", "literal"],
  "ids": ["separated", "entry key"],
  "indexsorttitle": ["field", "literal"],
  "keywords": ["separated", "literal"],
  "options": ["separated", "options"],
  "presort": ["field", "string"],
  "related": ["separated", "literal"],
  "relatedoptions": ["separated", "literal"],
  "relatedtype": ["field", "identifier"],
  "relatedstring": ["field", "literal"],
  "sortkey": ["field", "literal"],
  "sortname": ["list", "name"],
  "sortshorthand": ["field", "literal"],
  "sorttitle": ["field", "literal"],
  "sortyear": ["field", "integer"],
  "xdata": ["separated", "entry key"],
  "xref": ["field", "entry key"],
  "namea": ["list", "name"],
  "nameb": ["list", "name"],
  "namec": ["list", "name"],
  "nameatype": ["field", "key"],
  "namebtype": ["field", "key"],
  "namectype": ["field", "key"],
  "lista": ["list", "literal"],
  "listb": ["list", "literal"],
  "listc": ["list", "literal"],
  "listd": ["list", "literal"],
  "liste": ["list", "literal"],
  "listf": ["list", "literal"],
  "usera": ["field", "literal"],
  "userb": ["field", "literal"],
  "userc": ["field", "literal"],
  "userd": ["field", "literal"],
  "usere": ["field", "literal"],
  "userf": ["field", "literal"],
  "verba": ["field", "literal"],
  "verbb": ["field", "literal"],
  "verbc": ["field", "literal"],
  "address": ["list", "literal"],
  "annote": ["field", "literal"],
  "archiveprefix": ["field", "literal"],
  "journal": ["field", "literal"],
  "key": ["field", "literal"],
  "pdf": ["field", "verbatim"],
  "primaryclass": ["field", "literal"],
  "school": ["list", "literal"],
  "numpages": ["field", "integer"],
  "pmid": ["field", "literal"],
  "pmcid": ["field", "literal"]
}

},{}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bibtexGrammar = void 0;
exports.parse = parse;
var _core = require("@citation-js/core");
var _moo = _interopRequireDefault(require("moo"));
var _config = _interopRequireDefault(require("../config.js"));
var _constants = require("./constants.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const identifier = /[a-zA-Z_][a-zA-Z0-9_:+-]*/;
const whitespace = {
  comment: /%.*/,
  whitespace: {
    match: /\s+/,
    lineBreaks: true
  }
};
const lexer = _moo.default.states({
  main: {
    junk: {
      match: /@[cC][oO][mM][mM][eE][nN][tT].+|[^@]+/,
      lineBreaks: true
    },
    at: {
      match: '@',
      push: 'entry'
    }
  },
  entry: _objectSpread(_objectSpread({}, whitespace), {}, {
    otherEntryType: {
      match: /[sS][tT][rR][iI][nN][gG]|[pP][rR][eE][aA][mM][bB][lL][eE]/,
      next: 'otherEntryContents'
    },
    dataEntryType: {
      match: identifier,
      next: 'dataEntryContents'
    }
  }),
  otherEntryContents: _objectSpread(_objectSpread({}, whitespace), {}, {
    lbrace: {
      match: /[{(]/,
      next: 'fields'
    }
  }),
  dataEntryContents: _objectSpread(_objectSpread({}, whitespace), {}, {
    lbrace: {
      match: /[{(]/,
      next: 'dataEntryContents'
    },
    label: /[^,\s]+/,
    comma: {
      match: ',',
      next: 'fields'
    }
  }),
  fields: _objectSpread(_objectSpread({}, whitespace), {}, {
    identifier,
    number: /-?\d+/,
    hash: '#',
    equals: '=',
    comma: ',',
    quote: {
      match: '"',
      push: 'quotedLiteral'
    },
    lbrace: {
      match: '{',
      push: 'bracedLiteral'
    },
    rbrace: {
      match: /[})]/,
      pop: true
    }
  }),
  quotedLiteral: {
    lbrace: {
      match: '{',
      push: 'bracedLiteral'
    },
    quote: {
      match: '"',
      pop: true
    },
    text: {
      match: /(?:\\[\\{]|[^{"])+/,
      lineBreaks: true
    }
  },
  bracedLiteral: {
    lbrace: {
      match: '{',
      push: 'bracedLiteral'
    },
    rbrace: {
      match: '}',
      pop: true
    },
    text: {
      match: /(?:\\[\\{}]|[^{}])+/,
      lineBreaks: true
    }
  }
});
const delimiters = {
  '(': ')',
  '{': '}'
};
const bibtexGrammar = exports.bibtexGrammar = new _core.util.Grammar({
  Main() {
    const entries = [];
    while (true) {
      while (this.matchToken('junk')) {
        this.consumeToken('junk');
      }
      if (this.matchEndOfFile()) {
        break;
      }
      entries.push(this.consumeRule('Entry'));
    }
    return entries.filter(Boolean);
  },
  _() {
    let oldToken;
    while (oldToken !== this.token) {
      oldToken = this.token;
      this.consumeToken('whitespace', true);
      this.consumeToken('comment', true);
    }
  },
  Entry() {
    this.consumeToken('at');
    this.consumeRule('_');
    const type = (this.matchToken('otherEntryType') ? this.consumeToken('otherEntryType') : this.consumeToken('dataEntryType')).value.toLowerCase();
    this.consumeRule('_');
    const openBrace = this.consumeToken('lbrace').value;
    this.consumeRule('_');
    let result;
    if (type === 'string') {
      const [key, value] = this.consumeRule('Field');
      this.state.strings[key] = value;
    } else if (type === 'preamble') {
      this.consumeRule('Expression');
    } else {
      const label = this.consumeToken('label').value;
      this.consumeRule('_');
      this.consumeToken('comma');
      this.consumeRule('_');
      const entryBody = this.consumeRule('EntryBody');
      result = _objectSpread({
        type,
        label
      }, entryBody);
    }
    this.consumeRule('_');
    const closeBrace = this.consumeToken('rbrace').value;
    if (closeBrace !== delimiters[openBrace]) {
      _core.logger.warn('[plugin-bibtex]', `entry started with "${openBrace}", but ends with "${closeBrace}"`);
    }
    return result;
  },
  EntryBody() {
    const output = {
      properties: {}
    };
    while (this.matchToken('identifier')) {
      const [field, value] = this.consumeRule('Field');
      let annotationField;
      let annotationName = 'default';
      if (field.endsWith(_config.default.biber.annotationMarker)) {
        annotationField = field.slice(0, -_config.default.biber.annotationMarker.length);
      } else if (field.includes(_config.default.biber.annotationMarker + _config.default.biber.namedAnnotationMarker)) {
        [annotationField, annotationName] = field.split(_config.default.biber.annotationMarker + _config.default.biber.namedAnnotationMarker);
      }
      if (annotationField) {
        if (!output.annotations) {
          output.annotations = {};
        }
        if (!output.annotations[annotationField]) {
          output.annotations[annotationField] = {};
        }
        output.annotations[annotationField][annotationName] = value;
      } else {
        output.properties[field] = value;
      }
      this.consumeRule('_');
      if (this.consumeToken('comma', true)) {
        this.consumeRule('_');
      } else {
        break;
      }
    }
    return output;
  },
  Field() {
    const field = this.consumeToken('identifier').value.toLowerCase();
    this.consumeRule('_');
    this.consumeToken('equals');
    this.consumeRule('_');
    const value = this.consumeRule('Expression');
    return [field, value];
  },
  Expression() {
    let output = this.consumeRule('ExpressionPart');
    this.consumeRule('_');
    while (this.matchToken('hash')) {
      this.consumeToken('hash');
      this.consumeRule('_');
      output += this.consumeRule('ExpressionPart').toString();
      this.consumeRule('_');
    }
    return output;
  },
  ExpressionPart() {
    if (this.matchToken('identifier')) {
      return this.state.strings[this.consumeToken('identifier').value.toLowerCase()] || '';
    } else if (this.matchToken('number')) {
      return parseInt(this.consumeToken('number'));
    } else if (this.matchToken('quote')) {
      return this.consumeRule('QuoteString');
    } else {
      return this.consumeRule('BracketString');
    }
  },
  QuoteString() {
    let output = '';
    this.consumeToken('quote');
    while (!this.matchToken('quote')) {
      output += this.consumeRule('Text');
    }
    this.consumeToken('quote');
    return output;
  },
  BracketString() {
    let output = '';
    this.consumeToken('lbrace');
    while (!this.matchToken('rbrace')) {
      output += this.consumeRule('Text');
    }
    this.consumeToken('rbrace');
    return output;
  },
  Text() {
    if (this.matchToken('lbrace')) {
      return `{${this.consumeRule('BracketString')}}`;
    } else {
      return this.consumeToken('text').value;
    }
  }
}, {
  strings: _constants.defaultStrings
});
function parse(text) {
  return bibtexGrammar.parse(lexer.reset(text));
}
},{"../config.js":49,"./constants.js":52,"@citation-js/core":"citation-js","moo":100}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.formats = void 0;
var _file = require("./file.js");
var _bibtxt = require("./bibtxt.js");
var _entries = require("./entries.js");
const ref = exports.ref = '@bibtex';
const formats = exports.formats = {
  '@biblatex/text': {
    parse: _file.parse,
    parseType: {
      dataType: 'String',
      predicate: /@\s{0,5}[A-Za-z]{1,13}\s{0,5}\{\s{0,5}[^@{}"=,\\\s]{0,100}\s{0,5},[\s\S]*\}/
    }
  },
  '@biblatex/entry+object': {
    parse(input) {
      return (0, _entries.parse)([input]);
    },
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: ['type', 'label', 'properties']
      }
    }
  },
  '@biblatex/entries+list': {
    parse: _entries.parse,
    parseType: {
      elementConstraint: '@biblatex/entry+object'
    }
  },
  '@bibtex/text': {
    parse: _file.parse,
    outputs: '@bibtex/entries+list'
  },
  '@bibtex/entry+object': {
    parse(input) {
      return (0, _entries.parseBibtex)([input]);
    }
  },
  '@bibtex/entries+list': {
    parse: _entries.parseBibtex
  },
  '@bibtxt/text': {
    parse: _bibtxt.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(\[(?!\s*[{[]).*?\]\s*(\n\s*[^[]((?!:)\S)+\s*:\s*.+?\s*)*\s*)+$/
    }
  }
};
},{"./bibtxt.js":51,"./entries.js":53,"./file.js":55}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatNameParts = formatNameParts;
exports.getStringCase = getStringCase;
exports.orderNameParts = orderNameParts;
exports.orderNamePieces = orderNamePieces;
function getStringCase(string) {
  const a = string.toUpperCase();
  const b = string.toLowerCase();
  for (let i = 0; i < string.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] === string[i];
    }
  }
  return null;
}
function formatNameParts(parts) {
  if (parts.length === 0) {
    return undefined;
  }
  let piece = '';
  while (parts.length > 1) {
    const {
      value,
      hyphenated
    } = parts.shift();
    piece += value + (hyphenated ? '-' : ' ');
  }
  const output = piece + parts[0].value;
  return output[0] && output;
}
function orderNameParts(parts, orderGiven = true) {
  const given = [];
  const undecided = [];
  if (orderGiven) {
    while (parts.length > 1 && parts[0].upperCase !== false) {
      given.push(...undecided);
      undecided.length = 0;
      while (parts.length > 1 && parts[0].upperCase !== false && !parts[0].hyphenated) {
        given.push(parts.shift());
      }
      while (parts.length > 0 && parts[0].upperCase !== false && parts[0].hyphenated) {
        undecided.push(parts.shift());
      }
    }
  }
  const prefix = [];
  const family = [];
  while (parts.length > 1) {
    prefix.push(...family);
    family.length = 0;
    while (parts.length > 1 && parts[0].upperCase === false) {
      prefix.push(parts.shift());
    }
    while (parts.length > 0 && parts[0].upperCase !== false) {
      family.push(parts.shift());
    }
  }
  if (undecided.length) {
    family.unshift(...undecided);
  }
  if (parts.length) {
    family.push(parts[0]);
  }
  return [formatNameParts(given), formatNameParts(prefix), formatNameParts(family)];
}
function orderNamePieces(pieces) {
  if (pieces[0][0].label) {
    const name = {};
    for (const [{
      value,
      label
    }] of pieces) {
      name[label] = value;
    }
    return name;
  }
  const name = {};
  const [given, prefix, family] = orderNameParts(pieces[0], pieces.length === 1);
  if (family) {
    name.family = family;
  }
  if (prefix) {
    name.prefix = prefix;
  }
  if (pieces.length === 3) {
    name.given = formatNameParts(pieces[2]);
    name.suffix = formatNameParts(pieces[1]);
  } else if (pieces.length === 2) {
    name.given = formatNameParts(pieces[1]);
  } else if (given) {
    name.given = given;
  }
  return name;
}
},{}],58:[function(require,module,exports){
module.exports={"biblatex":{"article":["author","title","journaltitle",["year","date"]],"book":["author","title",["year","date"]],"mvbook":["author","title",["year","date"]],"inbook":["author","title","booktitle",["year","date"]],"booklet":[["author","editor"],"title",["year","date"]],"collection":["editor","title",["year","date"]],"mvcollection":["editor","title",["year","date"]],"incollection":["author","title","booktitle",["year","date"]],"dataset":[["author","editor"],"title",["year","date"]],"online":[["author","editor"],"title",["year","date"],["doi","eprint","url"]],"patent":["author","title","number",["year","date"]],"periodical":["editor","title",["year","date"]],"proceedings":["title",["year","date"]],"mvproceedings":["title",["year","date"]],"inproceedings":["author","title","booktitle",["year","date"]],"report":["author","title","type","institution",["year","date"]],"thesis":["author","title","type","institution",["year","date"]],"unpublished":["author","title",["year","date"]],"conference":["author","title","booktitle",["year","date"]],"electronic":[["author","editor"],"title",["year","date"],["doi","eprint","url"]],"mastersthesis":["author","title","institution",["year","date"]],"phdthesis":["author","title","institution",["year","date"]],"techreport":["author","title","institution",["year","date"]],"www":[["author","editor"],"title",["year","date"],["doi","eprint","url"]]},"bibtex":{"article":["author","title","journal","year"],"book":[["author","editor"],"title","publisher","year"],"booklet":["title"],"inbook":[["author","editor"],"title",["chapter","pages"],"publisher","year"],"incollection":["author","title","booktitle","publisher","year"],"inproceedings":["author","title","booktitle","year"],"mastersthesis":["author","title","school","year"],"phdthesis":["author","title","school","year"],"proceedings":["title","year"],"techreport":["author","title","institution","year"],"unpublished":["author","title","note"]}}
},{}],59:[function(require,module,exports){
module.exports={"diacritics":{"`":"̀","'":"́","^":"̂","~":"̃","=":"̄","u":"̆",".":"̇","\"":"̈","r":"̊","H":"̋","v":"̌","b":"̲","d":"̣","c":"̧","k":"̨","t":"͡","textcommabelow":"̦"},"commands":{"textquotesingle":"'","textasciigrave":"`","textquotedbl":"\"","textdollar":"$","textless":"<","textgreater":">","textbackslash":"\\","textasciicircum":"^","textunderscore":"_","textbraceleft":"{","textbar":"|","textbraceright":"}","textasciitilde":"~","textexclamdown":"¡","textcent":"¢","textsterling":"£","textcurrency":"¤","textyen":"¥","textbrokenbar":"¦","textsection":"§","textasciidieresis":"¨","textcopyright":"©","textordfeminine":"ª","guillemetleft":"«","guillemotleft":"«","textlnot":"¬","textregistered":"®","textasciimacron":"¯","textdegree":"°","textpm":"±","texttwosuperior":"²","textthreesuperior":"³","textasciiacute":"´","textmu":"µ","textparagraph":"¶","textperiodcentered":"·","textonesuperior":"¹","textordmasculine":"º","guillemetright":"»","guillemotright":"»","textonequarter":"¼","textonehalf":"½","textthreequarters":"¾","textquestiondown":"¿","AE":"Æ","DH":"Ð","texttimes":"×","O":"Ø","TH":"Þ","ss":"ß","ae":"æ","dh":"ð","textdiv":"÷","o":"ø","th":"þ","DJ":"Đ","dj":"đ","i":"ı","IJ":"Ĳ","ij":"ĳ","L":"Ł","l":"ł","NG":"Ŋ","ng":"ŋ","OE":"Œ","oe":"œ","textflorin":"ƒ","j":"ȷ","textasciicaron":"ˇ","textasciibreve":"˘","textacutedbl":"˝","textgravedbl":"˵","texttildelow":"˷","textbaht":"฿","SS":"ẞ","textcompwordmark":"‌","textendash":"–","textemdash":"—","textbardbl":"‖","textquoteleft":"‘","textquoteright":"’","quotesinglbase":"‚","textquotedblleft":"“","textquotedblright":"”","quotedblbase":"„","textdagger":"†","textdaggerdbl":"‡","textbullet":"•","textellipsis":"…","textperthousand":"‰","textpertenthousand":"‱","guilsinglleft":"‹","guilsinglright":"›","textreferencemark":"※","textinterrobang":"‽","textfractionsolidus":"⁄","textlquill":"⁅","textrquill":"⁆","textdiscount":"⁒","textcolonmonetary":"₡","textlira":"₤","textnaira":"₦","textwon":"₩","textdong":"₫","texteuro":"€","textpeso":"₱","textcelsius":"℃","textnumero":"№","textcircledP":"℗","textrecipe":"℞","textservicemark":"℠","texttrademark":"™","textohm":"Ω","textmho":"℧","textestimated":"℮","textleftarrow":"←","textuparrow":"↑","textrightarrow":"→","textdownarrow":"↓","textminus":"−","Hwithstroke":"Ħ","hwithstroke":"ħ","textasteriskcentered":"∗","textsurd":"√","textlangle":"〈","textrangle":"〉","textblank":"␢","textvisiblespace":"␣","textopenbullet":"◦","textbigcircle":"◯","textmusicalnote":"♪","textmarried":"⚭","textdivorced":"⚮","textinterrobangdown":"⸘","textcommabelow":null,"copyright":"©"},"mathCommands":{"Gamma":"Γ","Delta":"Δ","Theta":"Θ","Lambda":"Λ","Xi":"Ξ","Pi":"Π","Sigma":"Σ","Phi":"Φ","Psi":"Ψ","Omega":"Ω","alpha":"α","beta":"β","gamma":"γ","delta":"δ","varepsilon":"ε","zeta":"ζ","eta":"η","theta":"θ","iota":"ι","kappa":"κ","lambda":"λ","mu":"μ","nu":"ν","xi":"ξ","pi":"π","rho":"ρ","varsigma":"ς","sigma":"σ","tau":"τ","upsilon":"υ","varphi":"φ","chi":"χ","psi":"ψ","omega":"ω","vartheta":"ϑ","Upsilon":"ϒ","phi":"ϕ","varpi":"ϖ","varrho":"ϱ","epsilon":"ϵ"}}

},{}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.parseAnnotation = parseAnnotation;
exports.valueGrammar = void 0;
var _core = require("@citation-js/core");
var _moo = _interopRequireDefault(require("moo"));
var _config = _interopRequireDefault(require("../config.js"));
var constants = _interopRequireWildcard(require("./constants.js"));
var _name = require("./name.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const text = {
  commandBegin: {
    match: '\\begin',
    push: 'environment'
  },
  command: {
    match: /\\(?:[a-zA-Z]+|.) */,
    value: s => s.slice(1).trim()
  },
  lbrace: {
    match: '{',
    push: 'bracedLiteral'
  },
  mathShift: {
    match: '$',
    push: 'mathLiteral'
  },
  whitespace: {
    match: /[\s]+|~/,
    lineBreaks: true,
    value(token) {
      return token === '~' ? '\xa0' : ' ';
    }
  }
};
const lexer = _moo.default.states({
  stringLiteral: _objectSpread(_objectSpread({}, text), {}, {
    text: /[^{$}\s~\\]+/
  }),
  namesLiteral: _objectSpread(_objectSpread({
    and: /\s+[aA][nN][dD]\s+/,
    comma: ',',
    hyphen: '-',
    equals: '='
  }, text), {}, {
    text: /[^{$}\s~\\,=-]+/
  }),
  listLiteral: _objectSpread(_objectSpread({
    and: /\s+and\s+/
  }, text), {}, {
    text: /[^{$}\s~\\]+/
  }),
  separatedLiteral: _objectSpread(_objectSpread({
    comma: ','
  }, text), {}, {
    text: /[^{$}\s~\\,]+/
  }),
  annotation: _objectSpread(_objectSpread({}, text), {}, {
    colon: ':',
    equals: '=',
    comma: ',',
    semicolon: ';',
    quote: '"',
    itemCount: /\d+/,
    text: /[^{$}\s~\\":;,=]+/
  }),
  bracedLiteral: _objectSpread(_objectSpread({}, text), {}, {
    rbrace: {
      match: '}',
      pop: true
    },
    text: /[^{$}\s~\\]+/
  }),
  mathLiteral: _objectSpread(_objectSpread({}, text), {}, {
    mathShift: {
      match: '$',
      pop: true
    },
    script: /[\^_]/,
    text: /[^{$}\s~\\^_]+/
  }),
  environment: _objectSpread(_objectSpread({
    commandEnd: {
      match: '\\end',
      pop: true
    }
  }, text), {}, {
    text: /[^{$}\s~\\]+/
  })
});
function flattenConsString(string) {
  string[0];
  return string;
}
function applyFormatting(text, format) {
  if (format in constants.formatting) {
    return text && constants.formatting[format].join(text);
  } else {
    return text;
  }
}
const valueGrammar = exports.valueGrammar = new _core.util.Grammar({
  String() {
    let output = '';
    while (!this.matchEndOfFile()) {
      output += this.consumeRule('Text');
    }
    return flattenConsString(output);
  },
  StringNames() {
    const list = [];
    while (true) {
      this.consumeToken('whitespace', true);
      list.push(this.consumeRule('Name'));
      this.consumeToken('whitespace', true);
      if (this.matchEndOfFile()) {
        return list;
      } else {
        this.consumeToken('and');
      }
    }
  },
  Name() {
    const pieces = [];
    while (true) {
      pieces.push(this.consumeRule('NamePiece'));
      if (this.matchEndOfFile() || this.matchToken('and')) {
        return (0, _name.orderNamePieces)(pieces);
      } else {
        this.consumeToken('comma');
        this.consumeToken('whitespace', true);
      }
    }
  },
  NamePiece() {
    const parts = [];
    while (true) {
      const part = this.consumeRule('NameToken');
      if (part.label) {
        part.label = (0, _name.formatNameParts)([...parts, {
          value: part.label
        }]);
        return [part];
      }
      parts.push(part);
      if (this.matchEndOfFile() || this.matchToken('and') || this.matchToken('comma')) {
        return parts;
      } else {
        while (this.matchToken('hyphen') || this.matchToken('whitespace')) {
          this.consumeToken();
        }
      }
    }
  },
  NameToken() {
    let upperCase = null;
    let value = '';
    while (true) {
      if (upperCase === null && this.matchToken('text')) {
        const text = this.consumeToken().value;
        value += text;
        upperCase = (0, _name.getStringCase)(text);
      } else if (this.matchEndOfFile() || this.matchToken('and') || this.matchToken('comma') || this.matchToken('whitespace')) {
        return {
          value,
          upperCase
        };
      } else if (this.matchToken('hyphen')) {
        return {
          value,
          upperCase,
          hyphenated: true
        };
      } else if (this.matchToken('equals')) {
        this.consumeToken('equals');
        const text = this.consumeRule('NamePiece');
        if (text[0].label) {
          value += '=' + text[0].label;
        }
        return {
          value: (0, _name.formatNameParts)(text),
          label: value
        };
      } else {
        value += this.consumeRule('Text');
      }
    }
  },
  StringList() {
    const list = [];
    while (!this.matchEndOfFile()) {
      let output = '';
      while (!this.matchEndOfFile() && !this.matchToken('and')) {
        output += this.consumeRule('Text');
      }
      list.push(flattenConsString(output));
      this.consumeToken('and', true);
    }
    return list.length === 1 ? list[0] : list;
  },
  StringSeparated() {
    const list = [];
    while (!this.matchEndOfFile()) {
      let output = '';
      while (!this.matchEndOfFile() && !this.matchToken('comma')) {
        output += this.consumeRule('Text');
      }
      list.push(output.trim());
      this.consumeToken('comma', true);
      this.consumeToken('whitespace', true);
    }
    return list;
  },
  StringVerbatim() {
    let output = '';
    while (!this.matchEndOfFile()) {
      output += this.consumeToken().text;
    }
    return flattenConsString(output);
  },
  StringUri() {
    const uri = this.consumeRule('StringVerbatim');
    try {
      if (decodeURI(uri) === uri) {
        return encodeURI(uri);
      } else {
        return uri;
      }
    } catch (e) {
      return encodeURI(uri);
    }
  },
  StringTitleCase() {
    this.state.sentenceCase = true;
    let output = '';
    while (!this.matchEndOfFile()) {
      output += this.consumeRule('Text');
    }
    return flattenConsString(output);
  },
  Annotations() {
    const annotations = {};
    while (true) {
      const {
        scope,
        item,
        part,
        value
      } = this.consumeRule('Annotation');
      if (scope === 'part') {
        if (!annotations.part) {
          annotations.part = [];
        }
        if (!annotations.part[item]) {
          annotations.part[item] = {};
        }
        annotations.part[item][part] = value;
      } else if (scope === 'item') {
        if (!annotations.item) {
          annotations.item = [];
        }
        annotations.item[item] = value;
      } else {
        annotations.field = value;
      }
      if (this.matchEndOfFile()) {
        break;
      } else {
        this.consumeToken('semicolon');
        this.consumeRule('_');
      }
    }
    return annotations;
  },
  Annotation() {
    const annotation = {};
    if (this.matchToken('itemCount')) {
      annotation.item = parseInt(this.consumeToken('itemCount')) - 1;
      if (this.matchToken('colon')) {
        this.consumeToken('colon');
        annotation.part = this.consumeToken('text');
        annotation.scope = 'part';
      } else {
        annotation.scope = 'item';
      }
    } else {
      annotation.scope = 'field';
    }
    this.consumeToken('equals');
    this.consumeRule('_');
    if (this.matchToken('quote')) {
      this.consumeToken('quote');
      let literal = '';
      while (!this.matchToken('quote')) {
        if (this.matchToken('itemCount') || this.matchToken('colon') || this.matchToken('comma') || this.matchToken('semicolon') || this.matchToken('equals')) {
          literal += this.token.value;
          this.token = this.lexer.next();
        } else {
          literal += this.consumeRule('Text');
        }
      }
      this.consumeToken('quote');
      annotation.value = flattenConsString(literal);
      this.consumeRule('_');
    } else {
      annotation.value = [];
      let output = '';
      while (true) {
        output += this.consumeRule('Text');
        if (this.matchToken('comma')) {
          this.consumeToken('comma');
          this.consumeRule('_');
          annotation.value.push(flattenConsString(output));
          output = '';
        } else if (this.matchEndOfFile() || this.matchToken('semicolon')) {
          annotation.value.push(flattenConsString(output));
          break;
        }
      }
    }
    return annotation;
  },
  BracketString() {
    var _this$state;
    let output = '';
    this.consumeToken('lbrace');
    const sentenceCase = this.state.sentenceCase;
    this.state.sentenceCase = sentenceCase && this.matchToken('command');
    (_this$state = this.state).partlyLowercase && (_this$state.partlyLowercase = this.state.sentenceCase);
    while (!this.matchToken('rbrace')) {
      output += this.consumeRule('Text');
    }
    const topLevel = sentenceCase && !this.state.sentenceCase;
    const protectCase = topLevel && this.state.partlyLowercase;
    this.state.sentenceCase = sentenceCase;
    this.consumeToken('rbrace');
    return protectCase ? applyFormatting(output, 'nocase') : output;
  },
  MathString() {
    let output = '';
    this.consumeToken('mathShift');
    while (!this.matchToken('mathShift')) {
      if (this.matchToken('script')) {
        const script = this.consumeToken('script').value;
        const text = this.consumeRule('Text').split('');
        if (text.every(char => char in constants.mathScripts[script])) {
          output += text.map(char => constants.mathScripts[script][char]).join('');
        } else {
          const formatName = constants.mathScriptFormatting[script];
          output += constants.formatting[formatName].join(text.join(''));
        }
        continue;
      }
      if (this.matchToken('command')) {
        const command = this.token.value;
        if (command in constants.mathScriptFormatting) {
          this.consumeToken('command');
          const text = this.consumeRule('BracketString');
          output += applyFormatting(text, constants.mathScriptFormatting[command]);
          continue;
        }
      }
      output += this.consumeRule('Text');
    }
    this.consumeToken('mathShift');
    return output;
  },
  Text() {
    if (this.matchToken('lbrace')) {
      return this.consumeRule('BracketString');
    } else if (this.matchToken('mathShift')) {
      return this.consumeRule('MathString');
    } else if (this.matchToken('whitespace')) {
      return this.consumeToken('whitespace').value;
    } else if (this.matchToken('commandBegin')) {
      return this.consumeRule('EnclosedEnv');
    } else if (this.matchToken('command')) {
      return this.consumeRule('Command');
    }
    const text = this.consumeToken('text').value.replace(constants.ligaturePattern, ligature => constants.ligatures[ligature]);
    const afterPunctuation = this.state.afterPunctuation;
    this.state.afterPunctuation = /[?!.:]$/.test(text);
    if (!this.state.sentenceCase) {
      var _this$state2;
      (_this$state2 = this.state).partlyLowercase || (_this$state2.partlyLowercase = text === text.toLowerCase() && text !== text.toUpperCase());
      return text;
    }
    const [first, ...otherCharacters] = text;
    const rest = otherCharacters.join('');
    const restLowerCase = rest.toLowerCase();
    if (rest !== restLowerCase) {
      return text;
    }
    if (!afterPunctuation) {
      return text.toLowerCase();
    }
    return first + restLowerCase;
  },
  Command() {
    const commandToken = this.consumeToken('command');
    const command = commandToken.value;
    if (command in constants.formattingEnvs) {
      const text = this.consumeRule('Env');
      const format = constants.formattingEnvs[command];
      return applyFormatting(text, format);
    } else if (command in constants.formattingCommands) {
      const text = this.consumeRule('BracketString');
      const format = constants.formattingCommands[command];
      return applyFormatting(text, format);
    } else if (command in constants.commands) {
      return constants.commands[command];
    } else if (command in constants.mathCommands) {
      return constants.mathCommands[command];
    } else if (command in constants.diacritics && !this.matchEndOfFile()) {
      const text = this.consumeRule('Text');
      const diacritic = text[0] + constants.diacritics[command];
      return diacritic.normalize('NFC') + text.slice(1);
    } else if (command in constants.argumentCommands) {
      const func = constants.argumentCommands[command];
      const args = [];
      let arity = func.length;
      while (arity-- > 0) {
        this.consumeToken('whitespace', true);
        args.push(this.consumeRule('BracketString'));
      }
      return func(...args);
    } else if (/^[&%$#_{}]$/.test(command)) {
      return commandToken.text.slice(1);
    } else {
      return commandToken.text;
    }
  },
  Env() {
    let output = '';
    while (!this.matchEndOfFile() && !this.matchToken('rbrace')) {
      output += this.consumeRule('Text');
    }
    return output;
  },
  EnclosedEnv() {
    this.consumeToken('commandBegin');
    const beginEnv = this.consumeRule('BracketString');
    let output = '';
    while (!this.matchToken('commandEnd')) {
      output += this.consumeRule('Text');
    }
    const end = this.consumeToken('commandEnd');
    const endEnv = this.consumeRule('BracketString');
    if (beginEnv !== endEnv) {
      throw new SyntaxError(this.lexer.formatError(end, `environment started with "${beginEnv}", ended with "${endEnv}"`));
    }
    return applyFormatting(output, constants.formattingEnvs[beginEnv]);
  },
  _() {
    while (this.matchToken('whitespace')) {
      this.consumeToken('whitespace');
    }
  }
}, {
  sentenceCase: false,
  partlyLowercase: false,
  afterPunctuation: true
});
function singleLanguageIsEnglish(language) {
  return constants.sentenceCaseLanguages.includes(language.toLowerCase());
}
function isEnglish(languages) {
  if (Array.isArray(languages)) {
    return languages.every(singleLanguageIsEnglish);
  }
  return singleLanguageIsEnglish(languages);
}
function getMainRule(fieldType, languages) {
  if (fieldType[1] === 'name') {
    return fieldType[0] === 'list' ? 'StringNames' : 'Name';
  }
  if (fieldType[1] === 'title') {
    const option = _config.default.parse.sentenceCase;
    if (option === 'always' || option === 'english' && isEnglish(languages)) {
      return 'StringTitleCase';
    } else {
      return 'String';
    }
  }
  switch (fieldType[0] === 'field' ? fieldType[1] : fieldType[0]) {
    case 'list':
      return 'StringList';
    case 'separated':
      return 'StringSeparated';
    case 'verbatim':
      return 'StringVerbatim';
    case 'uri':
      return 'StringUri';
    case 'title':
    case 'literal':
    default:
      return 'String';
  }
}
function getLexerState(fieldType) {
  if (fieldType[1] === 'name') {
    return 'namesLiteral';
  }
  switch (fieldType[0]) {
    case 'list':
      return 'listLiteral';
    case 'separated':
      return 'separatedLiteral';
    case 'field':
    default:
      return 'stringLiteral';
  }
}
function parse(text, field, languages = []) {
  const fieldType = constants.fieldTypes[field] || [];
  return valueGrammar.parse(lexer.reset(text, {
    state: getLexerState(fieldType),
    line: 0,
    col: 0
  }), getMainRule(fieldType, languages));
}
function parseAnnotation(text) {
  return valueGrammar.parse(lexer.reset(text, {
    state: 'annotation',
    line: 0,
    col: 0
  }), 'Annotations');
}
},{"../config.js":49,"./constants.js":52,"./name.js":57,"@citation-js/core":"citation-js","moo":100}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
var _biblatexTypes = _interopRequireDefault(require("./biblatexTypes.json"));
var _shared = require("./shared.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const nonSpec = [{
  source: 'note',
  target: 'accessed',
  when: {
    source: false,
    target: {
      note: false,
      addendum: false
    }
  },
  convert: {
    toSource(accessed) {
      return `[Online; accessed ${(0, _date.format)(accessed)}]`;
    }
  }
}, {
  source: 'numpages',
  target: 'number-of-pages',
  when: {
    source: {
      pagetotal: false
    },
    target: false
  }
}, {
  source: 'pmid',
  target: 'PMID',
  when: {
    source: {
      eprinttype(type) {
        return type !== 'pmid';
      },
      archiveprefix(type) {
        return type !== 'pmid';
      }
    },
    target: false
  }
}, {
  source: 'pmcid',
  target: 'PMCID',
  when: {
    target: false
  }
}, {
  source: 's2id',
  target: 'custom',
  convert: {
    toTarget(S2ID) {
      return {
        S2ID
      };
    },
    toSource({
      S2ID
    }) {
      return S2ID;
    }
  }
}];
const aliases = [{
  source: 'annote',
  target: 'annote',
  when: {
    source: {
      annotation: false
    },
    target: false
  }
}, {
  source: 'address',
  target: 'publisher-place',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      location: false
    },
    target: false
  }
}, {
  source: ['eprint', 'archiveprefix'],
  target: 'PMID',
  convert: _shared.Converters.EPRINT,
  when: {
    source: {
      eprinttype: false
    },
    target: false
  }
}, {
  source: 'journal',
  target: 'container-title',
  when: {
    source: {
      maintitle: false,
      booktitle: false,
      journaltitle: false
    },
    target: false
  }
}, {
  source: 'school',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      institution: false,
      organization: false,
      publisher: false
    },
    target: false
  }
}];
var _default = exports.default = new _core.util.Translator([...aliases, ...nonSpec, {
  source: 'abstract',
  target: 'abstract'
}, {
  source: 'urldate',
  target: 'accessed',
  convert: _shared.Converters.DATE
}, {
  source: 'annotation',
  target: 'annote'
}, {
  source: ['author', 'author+an:orcid'],
  target: 'author',
  convert: _shared.Converters.NAMES_ORCID
}, {
  source: 'library',
  target: 'call-number'
}, {
  source: 'chapter',
  target: 'chapter-number'
}, {
  source: 'bookauthor',
  target: 'container-author',
  convert: _shared.Converters.NAMES
}, {
  source: ['maintitle', 'mainsubtitle', 'maintitleaddon'],
  target: 'container-title',
  when: {
    source: true,
    target: {
      'number-of-volumes': true
    }
  },
  convert: _shared.Converters.TITLE
}, {
  source: ['booktitle', 'booksubtitle', 'booktitleaddon'],
  target: 'container-title',
  when: {
    source: {
      maintitle: false
    },
    target: {
      'number-of-volumes': false,
      type(type) {
        return !type || !type.startsWith('article');
      }
    }
  },
  convert: _shared.Converters.TITLE
}, {
  source: ['journaltitle', 'journalsubtitle', 'journaltitleaddon'],
  target: 'container-title',
  when: {
    source: {
      [_shared.TYPE]: 'article'
    },
    target: {
      type: ['article', 'article-newspaper', 'article-journal', 'article-magazine']
    }
  },
  convert: _shared.Converters.TITLE
}, {
  source: 'shortjournal',
  target: 'container-title-short',
  when: {
    source: {
      [_shared.TYPE]: 'article'
    },
    target: {
      type: ['article', 'article-newspaper', 'article-journal', 'article-magazine']
    }
  }
}, {
  source: 'shortjournal',
  target: 'journalAbbreviation',
  when: {
    source: false,
    target: {
      'container-title-short': false
    }
  }
}, {
  source: 'number',
  target: 'collection-number',
  when: {
    source: {
      [_shared.TYPE]: ['book', 'mvbook', 'inbook', 'bookinbook', 'suppbook', 'collection', 'mvcollection', 'incollection', 'suppcollection', 'manual', 'suppperiodical', 'proceedings', 'mvproceedings', 'refererence']
    },
    target: {
      type: ['bill', 'book', 'broadcast', 'chapter', 'dataset', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'figure', 'graphic', 'interview', 'legislation', 'legal_case', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'post', 'post-weblog', 'personal_communication', 'review', 'review-book', 'song', 'speech', 'thesis', 'treaty', 'webpage']
    }
  }
}, {
  source: 'series',
  target: 'collection-title'
}, {
  source: 'shortseries',
  target: 'collection-title-short'
}, {
  source: 'doi',
  target: 'DOI'
}, {
  source: 'edition',
  target: 'edition'
}, {
  source: 'editor',
  target: 'editor',
  convert: _shared.Converters.NAMES
}, {
  source: [_shared.TYPE, 'entrysubtype', 'type'],
  target: ['type', 'genre'],
  convert: {
    toTarget(type, subtype, typeKey) {
      if (!typeKey) {
        if (type === 'mastersthesis') {
          typeKey = 'mathesis';
        }
        if (type === 'phdthesis') {
          typeKey = 'phdthesis';
        }
        if (type === 'techreport') {
          typeKey = 'techreport';
        }
      }
      return [_biblatexTypes.default.source[type] || 'document', typeKey || subtype];
    },
    toSource(type, genre) {
      const sourceType = _biblatexTypes.default.target[type] || 'misc';
      return genre in _shared.TYPE_KEYS ? [sourceType, undefined, genre] : [sourceType, genre];
    }
  }
}, {
  source: _shared.TYPE,
  when: {
    target: {
      type: false
    }
  },
  convert: {
    toSource() {
      return 'misc';
    }
  }
}, {
  source: 'eventdate',
  target: 'event-date',
  convert: _shared.Converters.DATE
}, {
  source: 'venue',
  target: 'event-place'
}, {
  source: ['eventtitle', 'eventtitleaddon'],
  target: 'event-title',
  convert: _shared.Converters.EVENT_TITLE
}, {
  source: ['eventtitle', 'eventtitleaddon'],
  target: 'event',
  convert: _shared.Converters.EVENT_TITLE,
  when: {
    source: false,
    target: {
      'event-title': false
    }
  }
}, {
  source: _shared.LABEL,
  target: ['id', 'citation-key', 'author', 'issued', 'year-suffix', 'title'],
  convert: _shared.Converters.LABEL
}, {
  source: 'isbn',
  target: 'ISBN'
}, {
  source: 'issn',
  target: 'ISSN'
}, {
  source: 'issue',
  target: 'issue',
  when: {
    source: {
      number: false,
      [_shared.TYPE]: ['article', 'periodical']
    },
    target: {
      issue(issue) {
        return typeof issue === 'string' && !issue.match(/\d+/);
      },
      type: ['article', 'article-journal', 'article-newspaper', 'article-magazine', 'periodical']
    }
  }
}, {
  source: 'number',
  target: 'issue',
  when: {
    source: {
      [_shared.TYPE]: ['article', 'periodical', 'inproceedings']
    },
    target: {
      issue(issue) {
        return issue && (typeof issue === 'number' || issue.match(/\d+/));
      },
      type: ['article', 'article-journal', 'article-newspaper', 'article-magazine', 'paper-conference', 'periodical']
    }
  }
}, {
  source: 'date',
  target: 'issued',
  convert: _shared.Converters.DATE
}, {
  source: ['year', 'month', 'day'],
  target: 'issued',
  convert: _shared.Converters.YEAR_MONTH,
  when: {
    source: {
      date: false
    },
    target: false
  }
}, {
  source: 'location',
  target: 'jurisdiction',
  when: {
    source: {
      type: 'patent'
    },
    target: {
      type: 'patent'
    }
  }
}, {
  source: 'keywords',
  target: 'keyword',
  convert: _shared.Converters.KEYWORDS
}, {
  source: 'language',
  target: 'language',
  convert: _shared.Converters.PICK
}, {
  source: 'langid',
  target: 'language',
  when: {
    source: {
      language: false
    },
    target: false
  }
}, {
  source: 'note',
  target: 'note'
}, {
  source: 'addendum',
  target: 'note',
  when: {
    source: {
      note: false
    },
    target: false
  }
}, {
  source: 'eid',
  target: 'number',
  when: {
    target: {
      type: ['article-journal']
    }
  }
}, {
  source: ['isan', 'ismn', 'isrn', 'iswc'],
  target: 'number',
  convert: _shared.Converters.STANDARD_NUMBERS,
  when: {
    source: {
      [_shared.TYPE](type) {
        return type !== 'patent';
      }
    },
    target: {
      type(type) {
        return type !== 'patent';
      }
    }
  }
}, {
  source: 'number',
  target: 'number',
  when: {
    source: {
      [_shared.TYPE]: ['patent', 'report', 'techreport', 'legislation']
    },
    target: {
      type: ['patent', 'report', 'legislation']
    }
  }
}, {
  source: 'origdate',
  target: 'original-date',
  convert: _shared.Converters.DATE
}, {
  source: 'origlocation',
  target: 'original-publisher-place',
  convert: _shared.Converters.PICK
}, {
  source: 'origpublisher',
  target: 'original-publisher',
  convert: _shared.Converters.PICK
}, {
  source: 'origtitle',
  target: 'original-title'
}, {
  source: 'pages',
  target: 'page',
  when: {
    source: {
      bookpagination: [undefined, 'page']
    }
  },
  convert: _shared.Converters.PAGES
}, {
  source: 'pagetotal',
  target: 'number-of-pages'
}, {
  source: 'part',
  target: 'part-number'
}, {
  source: ['eprint', 'eprinttype'],
  target: 'PMID',
  convert: _shared.Converters.EPRINT
}, {
  source: 'location',
  target: 'publisher-place',
  convert: _shared.Converters.PICK
}, {
  source: 'publisher',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: true,
    target: {
      type: ['article', 'article-journal', 'article-magazine', 'article-newspaper', 'bill', 'book', 'broadcast', 'chapter', 'classic', 'collection', 'dataset', 'document', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'event', 'figure', 'graphic', 'hearing', 'interview', 'legal_case', 'legislation', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'patent', 'performance', 'periodical', 'personal_communication', 'post', 'post-weblog', 'regulation', 'review', 'review-book', 'software', 'song', 'speech', 'standard', 'treaty']
    }
  }
}, {
  source: 'organization',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false
    },
    target: {
      type: ['paper-conference', 'webpage']
    }
  }
}, {
  source: 'institution',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false,
      organization: false
    },
    target: {
      type: ['report', 'thesis']
    }
  }
}, {
  source: 'howpublished',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      howpublished(howPublished) {
        return howPublished && !howPublished.startsWith('http');
      },
      publisher: false,
      organization: false,
      institution: false
    },
    target: {
      type: 'manuscript'
    }
  }
}, {
  source: ['pages', 'bookpagination'],
  target: 'section',
  when: {
    source: {
      bookpagination: 'section'
    },
    target: {
      page: false
    }
  },
  convert: {
    toTarget(section) {
      return section;
    },
    toSource(section) {
      return [section, 'section'];
    }
  }
}, {
  source: 'pubstate',
  target: 'status',
  convert: _shared.Converters.STATUS
}, {
  source: 'shorttitle',
  target: 'title-short'
}, {
  source: 'shorttitle',
  target: 'shortTitle',
  when: {
    source: false,
    target: {
      'title-short': false
    }
  }
}, {
  source: ['title', 'subtitle', 'titleaddon'],
  target: 'title',
  convert: _shared.Converters.TITLE
}, {
  source: 'translator',
  target: 'translator',
  convert: _shared.Converters.NAMES
}, {
  source: 'url',
  target: 'URL'
}, {
  source: 'howpublished',
  target: 'URL',
  convert: _shared.Converters.HOW_PUBLISHED,
  when: {
    source: {
      url: false
    },
    target: false
  }
}, {
  source: 'version',
  target: 'version'
}, {
  source: 'volume',
  target: 'volume'
}, {
  source: 'volumes',
  target: 'number-of-volumes'
}, {
  source: ['issuetitle', 'issuesubtitle', 'issuetitleaddon'],
  target: 'volume-title',
  convert: _shared.Converters.TITLE
}]);
},{"./biblatexTypes.json":62,"./shared.js":67,"@citation-js/core":"citation-js","@citation-js/date":43}],62:[function(require,module,exports){
module.exports={
  "source": {
    "article": "article-journal",
    "book": "book",
    "mvbook": "book",
    "inbook": "chapter",
    "bookinbook": "book",
    "booklet": "book",
    "collection": "book",
    "mvcollection": "book",
    "incollection": "chapter",
    "dataset": "dataset",
    "manual": "report",
    "misc": "document",
    "online": "webpage",
    "patent": "patent",
    "periodical": "periodical",
    "proceedings": "book",
    "mvproceedings": "book",
    "inproceedings": "paper-conference",
    "reference": "book",
    "mvreference": "book",
    "inreference": "entry",
    "report": "report",
    "software": "software",
    "thesis": "thesis",
    "unpublished": "manuscript",
    "artwork": "graphic",
    "audio": "song",
    "image": "figure",
    "jurisdiction": "legal_case",
    "legislation": "legislation",
    "legal": "treaty",
    "letter": "personal_communication",
    "movie": "motion_picture",
    "music": "musical_score",
    "performance": "performance",
    "review": "review",
    "standard": "standard",
    "video": "motion_picture",
    "conference": "paper-conference",
    "electronic": "webpage",
    "mastersthesis": "thesis",
    "phdthesis": "thesis",
    "techreport": "report",
    "www": "webpage"
  },
  "target": {
    "article": "article",
    "article-journal": "article",
    "article-magazine": "article",
    "article-newspaper": "article",
    "bill": "legislation",
    "book": "book",
    "broadcast": "audio",
    "chapter": "inbook",
    "classic": "unpublished",
    "collection": "misc",
    "dataset": "dataset",
    "document": "misc",
    "entry": "inreference",
    "entry-dictionary": "inreference",
    "entry-encyclopedia": "inreference",
    "event": "misc",
    "figure": "artwork",
    "graphic": "artwork",
    "hearing": "legal",
    "interview": "audio",
    "legal_case": "jurisdiction",
    "legislation": "legislation",
    "manuscript": "unpublished",
    "motion_picture": "movie",
    "musical_score": "music",
    "paper-conference": "inproceedings",
    "patent": "patent",
    "performance": "performance",
    "periodical": "periodical",
    "personal_communication": "letter",
    "post": "online",
    "post-weblog": "online",
    "regulation": "legal",
    "report": "report",
    "review": "review",
    "review-book": "review",
    "software": "software",
    "song": "music",
    "speech": "audio",
    "standard": "standard",
    "thesis": "thesis",
    "treaty": "legal",
    "webpage": "online"
  }
}

},{}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
var _bibtexTypes = _interopRequireDefault(require("./bibtexTypes.json"));
var _shared = require("./shared.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = new _core.util.Translator([{
  source: 'note',
  target: 'accessed',
  when: {
    source: false,
    target: {
      note: false
    }
  },
  convert: {
    toSource(accessed) {
      return `[Online; accessed ${(0, _date.format)(accessed)}]`;
    }
  }
}, {
  source: 'annote',
  target: 'annote'
}, {
  source: 'address',
  target: 'publisher-place',
  convert: _shared.Converters.PICK
}, {
  source: 'author',
  target: 'author',
  convert: _shared.Converters.NAMES
}, {
  source: 'chapter',
  target: 'chapter-number'
}, {
  source: 'number',
  target: 'collection-number',
  when: {
    source: {
      [_shared.TYPE]: ['book', 'mvbook', 'inbook', 'collection', 'mvcollection', 'incollection', 'suppcollection', 'manual', 'suppperiodical', 'proceedings', 'mvproceedings', 'refererence']
    },
    target: {
      type: ['bill', 'book', 'broadcast', 'chapter', 'dataset', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'figure', 'graphic', 'interview', 'legislation', 'legal_case', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'post', 'post-weblog', 'personal_communication', 'review', 'review-book', 'song', 'speech', 'thesis', 'treaty', 'webpage']
    }
  }
}, {
  source: 'series',
  target: 'collection-title'
}, {
  source: 'booktitle',
  target: 'container-title',
  when: {
    target: {
      type: ['chapter', 'paper-conference']
    }
  }
}, {
  source: 'journal',
  target: 'container-title',
  when: {
    source: {
      [_shared.TYPE]: 'article'
    },
    target: {
      type: ['article', 'article-newspaper', 'article-journal', 'article-magazine']
    }
  }
}, {
  source: 'doi',
  target: 'DOI'
}, {
  source: 'edition',
  target: 'edition'
}, {
  source: 'editor',
  target: 'editor',
  convert: _shared.Converters.NAMES
}, {
  source: _shared.LABEL,
  target: ['id', 'citation-key', 'author', 'issued', 'year-suffix', 'title'],
  convert: _shared.Converters.LABEL
}, {
  source: 'isbn',
  target: 'ISBN'
}, {
  source: 'issn',
  target: 'ISSN'
}, {
  source: 'number',
  target: 'issue',
  when: {
    source: {
      [_shared.TYPE]: ['article', 'periodical', 'inproceedings']
    },
    target: {
      issue(issue) {
        return typeof issue === 'number' || typeof issue === 'string' && issue.match(/\d+/);
      },
      type: ['article', 'article-journal', 'article-newspaper', 'article-magazine', 'paper-conference', 'periodical']
    }
  }
}, {
  source: ['year', 'month', 'day'],
  target: 'issued',
  convert: _shared.Converters.YEAR_MONTH
}, {
  source: 'note',
  target: 'note'
}, {
  source: 'number',
  target: 'number',
  when: {
    source: {
      [_shared.TYPE]: ['patent', 'report', 'techreport']
    },
    target: {
      type: ['patent', 'report']
    }
  }
}, {
  source: 'eid',
  target: 'number',
  when: {
    source: {
      number: false
    },
    target: {
      type: ['article-journal']
    }
  }
}, {
  source: 'pages',
  target: 'page',
  convert: _shared.Converters.PAGES
}, {
  source: 'publisher',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    target: {
      type: ['article', 'article-journal', 'article-magazine', 'article-newspaper', 'bill', 'book', 'broadcast', 'chapter', 'classic', 'collection', 'dataset', 'document', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'event', 'figure', 'graphic', 'hearing', 'interview', 'legal_case', 'legislation', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'patent', 'performance', 'periodical', 'personal_communication', 'post', 'post-weblog', 'regulation', 'review', 'review-book', 'software', 'song', 'speech', 'standard', 'treaty', 'webpage']
    }
  }
}, {
  source: 'organization',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false
    },
    target: {
      type: 'paper-conference'
    }
  }
}, {
  source: 'institution',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      publisher: false,
      organization: false
    },
    target: {
      type: 'report'
    }
  }
}, {
  source: 'school',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      institution: false,
      organization: false,
      publisher: false
    },
    target: {
      type: 'thesis'
    }
  }
}, {
  source: 'howpublished',
  target: 'publisher',
  convert: _shared.Converters.PICK,
  when: {
    source: {
      howpublished(howPublished) {
        return howPublished && !howPublished.startsWith('http');
      },
      publisher: false,
      organization: false,
      institution: false,
      school: false
    },
    target: {
      type: 'manuscript'
    }
  }
}, {
  source: 'title',
  target: 'title'
}, {
  source: [_shared.TYPE, 'type'],
  target: ['type', 'genre'],
  convert: {
    toTarget(sourceType, subType) {
      const type = _bibtexTypes.default.source[sourceType] || 'document';
      if (subType) {
        return [type, subType];
      } else if (sourceType === 'mastersthesis') {
        return [type, 'Master\'s thesis'];
      } else if (sourceType === 'phdthesis') {
        return [type, 'PhD thesis'];
      } else {
        return [type];
      }
    },
    toSource(targetType, genre) {
      const type = _bibtexTypes.default.target[targetType] || 'misc';
      if (/^(master'?s|diploma) thesis$/i.test(genre)) {
        return ['mastersthesis'];
      } else if (/^(phd|doctoral) thesis$/i.test(genre)) {
        return ['phdthesis'];
      } else {
        return [type, genre];
      }
    }
  }
}, {
  source: _shared.TYPE,
  when: {
    target: {
      type: false
    }
  },
  convert: {
    toSource() {
      return 'misc';
    }
  }
}, {
  source: 'url',
  target: 'URL'
}, {
  source: 'howpublished',
  target: 'URL',
  convert: _shared.Converters.HOW_PUBLISHED,
  when: {
    target: {
      publisher: false
    }
  }
}, {
  source: 'volume',
  target: 'volume'
}]);
},{"./bibtexTypes.json":64,"./shared.js":67,"@citation-js/core":"citation-js","@citation-js/date":43}],64:[function(require,module,exports){
module.exports={
  "source": {
    "article": "article-journal",
    "book": "book",
    "booklet": "book",
    "conference": "paper-conference",
    "inbook": "chapter",
    "incollection": "chapter",
    "inproceedings": "paper-conference",
    "manual": "report",
    "mastersthesis": "thesis",
    "misc": "document",
    "phdthesis": "thesis",
    "proceedings": "book",
    "techreport": "report",
    "unpublished": "manuscript"
  },
  "target": {
    "article": "article",
    "article-journal": "article",
    "article-magazine": "article",
    "article-newspaper": "article",
    "book": "book",
    "chapter": "inbook",
    "manuscript": "unpublished",
    "paper-conference": "inproceedings",
    "report": "techreport",
    "review": "article",
    "review-book": "article"
  }
}

},{}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crossref = crossref;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const BOOK = new Set(['book', 'inbook', 'bookinbook', 'suppbook']);
const BOOK_PART = new Set(['inbook', 'bookinbook', 'suppbook']);
const COLLECTION = new Set(['collection', 'reference', 'incollection', 'inreference', 'suppcollection']);
const COLLECTION_PART = new Set(['incollection', 'inreference', 'suppcollection']);
const PROCEEDINGS = new Set(['proceedings', 'inproceedings']);
const PROCEEDINGS_PART = new Set(['inproceedings']);
const PERIODICAL_PART = new Set(['article', 'suppperiodical']);
const TITLE_MAP = {
  mvbook: ['main', BOOK],
  mvcollection: ['main', COLLECTION],
  mvreference: ['main', COLLECTION],
  mvproceedings: ['main', PROCEEDINGS],
  book: ['book', BOOK_PART],
  collection: ['book', COLLECTION_PART],
  reference: ['book', COLLECTION_PART],
  proceedings: ['book', PROCEEDINGS_PART],
  periodical: ['journal', PERIODICAL_PART]
};
function crossref(target, entry, registry) {
  if (entry.crossref in registry) {
    const parent = registry[entry.crossref];
    if (parent.properties === entry) {
      return entry;
    }
    const data = _objectSpread({}, crossref(parent.type, parent.properties, registry));
    delete data.ids;
    delete data.crossref;
    delete data.xref;
    delete data.entryset;
    delete data.entrysubtype;
    delete data.execute;
    delete data.label;
    delete data.options;
    delete data.presort;
    delete data.related;
    delete data.relatedoptions;
    delete data.relatedstring;
    delete data.relatedtype;
    delete data.shortand;
    delete data.shortandintro;
    delete data.sortkey;
    if ((parent.type === 'mvbook' || parent.type === 'book') && BOOK_PART.has(target)) {
      data.bookauthor = data.author;
    }
    if (parent.type in TITLE_MAP) {
      const [prefix, targets] = TITLE_MAP[parent.type];
      if (targets.has(target)) {
        data[prefix + 'title'] = data.title;
        data[prefix + 'subtitle'] = data.subtitle;
        if (prefix !== 'journal') {
          data[prefix + 'titleaddon'] = data.titleaddon;
        }
        delete data.title;
        delete data.subtitle;
        delete data.titleaddon;
        delete data.shorttitle;
        delete data.sorttitle;
        delete data.indextitle;
        delete data.indexsorttitle;
      }
    }
    return Object.assign(data, entry);
  }
  return entry;
}
},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.formatBibtex = formatBibtex;
exports.parse = parse;
exports.parseBibtex = parseBibtex;
var _shared = require("./shared.js");
var _biblatex = _interopRequireDefault(require("./biblatex.js"));
var _bibtex = _interopRequireDefault(require("./bibtex.js"));
var _crossref = require("./crossref.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _parse(input, spec) {
  const registry = {};
  for (const entry of input) {
    registry[entry.label] = entry;
  }
  return input.map(({
    type,
    label,
    properties
  }) => spec.convertToTarget(_objectSpread({
    [_shared.TYPE]: type,
    [_shared.LABEL]: label
  }, (0, _crossref.crossref)(type, properties, registry))));
}
function _format(input, spec) {
  return input.map(entry => {
    const _spec$convertToSource = spec.convertToSource(entry),
      {
        [_shared.TYPE]: type,
        [_shared.LABEL]: label
      } = _spec$convertToSource,
      properties = _objectWithoutProperties(_spec$convertToSource, [_shared.TYPE, _shared.LABEL].map(_toPropertyKey));
    return {
      type,
      label,
      properties
    };
  });
}
function parseBibtex(input) {
  return _parse(input, _bibtex.default);
}
function formatBibtex(input) {
  return _format(input, _bibtex.default);
}
function parse(input) {
  return _parse(input, _biblatex.default);
}
function format(input) {
  return _format(input, _biblatex.default);
}
},{"./biblatex.js":61,"./bibtex.js":63,"./crossref.js":65,"./shared.js":67}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_KEYS = exports.TYPE = exports.STANDARD_NUMBERS_PATTERN = exports.MONTHS = exports.LABEL = exports.Converters = void 0;
exports.formatLabel = formatLabel;
exports.parseDate = parseDate;
exports.parseMonth = parseMonth;
var _core = require("@citation-js/core");
var _config = _interopRequireDefault(require("../config.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const stopWords = new Set(['the', 'a', 'an']);
const unsafeChars = /(?:<\/?.*?>|[\u0020-\u002F\u003A-\u0040\u005B-\u005E\u0060\u007B-\u007F])+/g;
const unicode = /[^\u0020-\u007F]+/g;
function isLabelSafe(text) {
  return !_config.default.format.checkLabel || !text.match(unsafeChars);
}
function formatLabelFromId(id) {
  if (id === null) {
    return 'null';
  } else if (id === undefined) {
    return 'undefined';
  } else if (_config.default.format.checkLabel) {
    return id.toString().replace(unsafeChars, '');
  } else {
    return id.toString();
  }
}
function firstWord(text) {
  if (!text) {
    return '';
  } else {
    return text.normalize('NFKD').replace(unicode, '').split(unsafeChars).find(word => word.length && !stopWords.has(word.toLowerCase()));
  }
}
const name = new _core.util.Translator([{
  source: 'given',
  target: 'given'
}, {
  source: 'family',
  target: 'family'
}, {
  source: 'suffix',
  target: 'suffix'
}, {
  source: 'prefix',
  target: 'non-dropping-particle'
}, {
  source: 'family',
  target: 'literal',
  when: {
    source: false,
    target: {
      family: false,
      given: false
    }
  }
}]);
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const TYPE = exports.TYPE = 'BibTeX type';
const LABEL = exports.LABEL = 'BibTeX label';
const MONTHS = exports.MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  sept: 9
};
const TYPE_KEYS = exports.TYPE_KEYS = {
  bathesis: 'Bachelor\'s thesis',
  mathesis: 'Master\'s thesis',
  phdthesis: 'PhD thesis',
  candthesis: 'Candidate thesis',
  techreport: 'technical report',
  resreport: 'research report',
  software: 'computer software',
  datacd: 'data cd',
  audiocd: 'audio cd',
  patent: 'patent',
  patentde: 'German patent',
  patenteu: 'European patent',
  patentfr: 'French patent',
  patentuk: 'British patent',
  patentus: 'U.S. patent',
  patreq: 'patent request',
  patreqde: 'German patent request',
  patreqeu: 'European patent request',
  patreqfr: 'French patent request',
  patrequk: 'British patent request',
  patrequs: 'U.S. patent request'
};
const STANDARD_NUMBERS_PATTERN = exports.STANDARD_NUMBERS_PATTERN = /(^(?:ISAN )?(?:[0-9a-f]{4}-){4}[0-9a-z](?:-(?:[0-9a-f]{4}-){2}[0-9a-z])?$)|(^(?:979-?0-?|M-?)(?:\d{9}|(?=[\d-]{11}$)\d+-\d+-\d)$)|(^ISRN .{1,36}$)|(^(?:ISWC )?T-?\d{9}-?\d$)/i;
function parseDate(date) {
  const parts = date.split('T')[0].replace(/[?~%]$/, '').split('-');
  const year = +parts[0].replace(/^Y(?=-?\d{4}\d+)/, '').replace(/X/g, '0');
  const month = +parts[1];
  const day = +parts[2];
  if (!month || month > 20) {
    return [year];
  } else if (!day) {
    return [year, month];
  } else {
    return [year, month, day];
  }
}
function parseMonth(value) {
  if (value == null) {
    return [];
  }
  if (+value) {
    return [parseInt(value, 10)];
  }
  value = value.trim().toLowerCase();
  if (value in MONTHS) {
    return [MONTHS[value]];
  }
  const parts = value.split(/\s+/);
  let month;
  let day;
  if (parts[0] in MONTHS) {
    month = MONTHS[parts[0]];
    day = parseInt(parts[1]);
  } else if (parts[1] in MONTHS) {
    month = MONTHS[parts[1]];
    day = parseInt(parts[0]);
  }
  return day ? [month, day] : month ? [month] : [];
}
function formatLabel(author, issued, suffix, title) {
  let label = '';
  if (author && author[0]) {
    label += firstWord(author[0].family || author[0].literal);
  }
  if (issued && issued['date-parts'] && issued['date-parts'][0]) {
    label += issued['date-parts'][0][0];
  }
  if (suffix) {
    label += suffix;
  } else if (title) {
    label += firstWord(title);
  }
  return label;
}
const Converters = exports.Converters = {
  PICK: {
    toTarget(...args) {
      return args.find(Boolean);
    },
    toSource(value) {
      return [value];
    }
  },
  DATE: {
    toTarget(date) {
      const parts = date.split('/').map(part => part && part !== '..' ? parseDate(part) : undefined);
      return isNaN(parts[0][0]) ? {
        literal: date
      } : {
        'date-parts': parts
      };
    },
    toSource(date) {
      if ('date-parts' in date) {
        return date['date-parts'].map(datePart => datePart.map(datePart => datePart.toString().padStart(2, '0')).join('-')).join('/');
      }
    }
  },
  YEAR_MONTH: {
    toTarget(year, month, day) {
      if (isNaN(+year)) {
        return {
          literal: year
        };
      } else if (!isNaN(+day) && !isNaN(+month)) {
        return {
          'date-parts': [[+year, +month, +day]]
        };
      } else {
        return {
          'date-parts': [[+year, ...parseMonth(month)]]
        };
      }
    },
    toSource(date) {
      if ('date-parts' in date) {
        const [year, month, day] = date['date-parts'][0];
        return [year.toString(), month ? day ? `${months[month - 1]} ${day}` : month : undefined];
      } else {
        return [];
      }
    }
  },
  EPRINT: {
    toTarget(id, type) {
      if (type === 'pubmed') {
        return id;
      }
    },
    toSource(id) {
      return [id, 'pubmed'];
    }
  },
  EVENT_TITLE: {
    toTarget(title, addon) {
      if (addon) {
        title += ' (' + addon + ')';
      }
      return title;
    },
    toSource(title) {
      return title.match(/^(.+)(?: \((.+)\))?$/).slice(1, 3);
    }
  },
  HOW_PUBLISHED: {
    toTarget(howPublished) {
      if (howPublished.startsWith('http')) {
        return howPublished;
      }
    }
  },
  KEYWORDS: {
    toTarget(list) {
      return list.join(',');
    },
    toSource(list) {
      return list.split(',');
    }
  },
  LABEL: {
    toTarget(label) {
      return [label, label];
    },
    toSource(id, label, author, issued, suffix, title) {
      if (label && isLabelSafe(label)) {
        return label;
      } else if (_config.default.format.useIdAsLabel) {
        return formatLabelFromId(id);
      } else {
        return formatLabel(author, issued, suffix, title) || formatLabelFromId(id);
      }
    }
  },
  NAMES: {
    toTarget(list) {
      return list.map(name.convertToTarget);
    },
    toSource(list) {
      return list.map(name.convertToSource);
    }
  },
  NAMES_ORCID: {
    toTarget(list, orcid) {
      return list.map((inputName, i) => {
        var _orcid$item;
        const outputName = name.convertToTarget(inputName);
        if (typeof (orcid === null || orcid === void 0 || (_orcid$item = orcid.item) === null || _orcid$item === void 0 ? void 0 : _orcid$item[i]) === 'string') {
          outputName._orcid = orcid.item[i];
        }
        return outputName;
      });
    },
    toSource(list) {
      const names = [];
      const orcid = [];
      for (let i = 0; i < list.length; i++) {
        names.push(name.convertToSource(list[i]));
        if (list[i]._orcid) {
          orcid[i] = list[i]._orcid;
        }
      }
      return [names, orcid.length ? {
        item: orcid
      } : undefined];
    }
  },
  PAGES: {
    toTarget(pages) {
      return pages.replace(/[–—]/, '-');
    },
    toSource(pages) {
      return pages.replace('-', '--');
    }
  },
  STANDARD_NUMBERS: {
    toTarget(...args) {
      return args.find(Boolean);
    },
    toSource(number) {
      const match = number.toString().match(STANDARD_NUMBERS_PATTERN);
      return match ? match.slice(1, 5) : [];
    }
  },
  STATUS: {
    toSource(state) {
      if (/^(inpreparation|submitted|forthcoming|inpress|prepublished)$/i.test(state)) {
        return state;
      }
    }
  },
  TITLE: {
    toTarget(title, subtitle, addon) {
      if (subtitle) {
        title += ': ' + subtitle;
      }
      return title;
    },
    toSource(title) {
      return [title];
    }
  }
};
},{"../config.js":49,"@citation-js/core":"citation-js"}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
var _config = _interopRequireDefault(require("../config.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function formatField(field, value, dict) {
  return dict.listItem.join(`${field} = {${value}},`);
}
function formatEntry(entry, dict) {
  const fields = [];
  for (const field in entry.properties) {
    fields.push(formatField(field, entry.properties[field], dict));
    if (entry.annotations && entry.annotations[field]) {
      for (const annotation in entry.annotations[field]) {
        let annotationField = field + _config.default.biber.annotationMarker;
        if (annotation !== 'default') {
          annotationField += _config.default.biber.namedAnnotationMarker + annotation;
        }
        fields.push(formatField(annotationField, entry.annotations[field][annotation], dict));
      }
    }
  }
  return dict.entry.join(`@${entry.type}{${entry.label},${dict.list.join(fields.join(''))}}`);
}
function format(src, dict) {
  const entries = src.map(entry => formatEntry(entry, dict)).join('');
  return dict.bibliographyContainer.join(entries);
}
},{"../config.js":49}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
function formatEntry({
  type,
  label,
  properties
}, dict) {
  const fields = Object.entries(properties).concat([['type', type]]).map(([field, value]) => dict.listItem.join(`${field}: ${value}`));
  return dict.entry.join(`[${label}]${dict.list.join(fields.join(''))}`);
}
function format(src, dict) {
  const entries = src.map(entry => formatEntry(entry, dict)).join('\n');
  return dict.bibliographyContainer.join(entries);
}
},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.formatBibtex = formatBibtex;
var _index = require("../mapping/index.js");
var _value = require("./value.js");
function formatEntryValues({
  type,
  label,
  properties
}) {
  const output = {
    type,
    label,
    properties: {}
  };
  for (const property in properties) {
    const value = properties[property];
    const [field, annotation] = property.split('+an:');
    if (annotation) {
      if (!output.annotations) {
        output.annotations = {};
      }
      if (!output.annotations[field]) {
        output.annotations[field] = {};
      }
      output.annotations[field][annotation] = (0, _value.formatAnnotation)(value);
    } else {
      output.properties[property] = (0, _value.format)(property, value);
    }
  }
  return output;
}
function format(entries) {
  return (0, _index.format)(entries).map(formatEntryValues);
}
function formatBibtex(entries) {
  return (0, _index.formatBibtex)(entries).map(formatEntryValues);
}
},{"../mapping/index.js":66,"./value.js":72}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@citation-js/core");
var _entries = require("./entries.js");
var _bibtex = require("./bibtex.js");
var _bibtxt = require("./bibtxt.js");
const factory = function (mapper, formatter) {
  return function (data, opts = {}) {
    const {
      type,
      format = type || 'text'
    } = opts;
    data = mapper(data);
    if (format === 'object') {
      return data;
    } else if (_core.plugins.dict.has(format)) {
      return formatter(data, _core.plugins.dict.get(format), opts);
    } else {
      throw new RangeError(`Output dictionary "${format}" not available`);
    }
  };
};
var _default = exports.default = {
  bibtex: factory(_entries.formatBibtex, _bibtex.format),
  biblatex: factory(_entries.format, _bibtex.format),
  bibtxt: factory(_entries.formatBibtex, _bibtxt.format)
};
},{"./bibtex.js":68,"./bibtxt.js":69,"./entries.js":70,"@citation-js/core":"citation-js"}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.formatAnnotation = formatAnnotation;
var _config = _interopRequireDefault(require("../config.js"));
var _constants = require("../input/constants.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const unicode = {};
for (const command in _constants.commands) {
  unicode[_constants.commands[command]] = command;
}
for (const diacritic in _constants.diacritics) {
  unicode[_constants.diacritics[diacritic]] = diacritic;
}
for (const ligature in _constants.ligatures) {
  unicode[_constants.ligatures[ligature]] = ligature;
}
const mathUnicode = {};
for (const command in _constants.mathCommands) {
  mathUnicode[_constants.mathCommands[command]] = command;
}
const UNSAFE_UNICODE = /[^a-zA-Z0-9\s!"'()*+,\-./:;=?@[\]\u0300-\u0308\u030a-\u030c\u0332\u0323\u0327\u0328\u0361\u0326]/g;
const DIACRITIC_PATTERN = /.[\u0300-\u0308\u030a-\u030c\u0332\u0323\u0327\u0328\u0361\u0326]+/g;
const LONE_DIACRITIC_PATTERN = /[\u0300-\u0308\u030a-\u030c\u0332\u0323\u0327\u0328\u0361\u0326]/g;
const listDelimiters = {
  separated: ',',
  list: ' and '
};
const richTextMappings = {
  i: '\\textit{',
  b: '\\textbf{',
  sc: '\\textsc{',
  sup: '\\textsuperscript{',
  sub: '\\textsubscript{',
  'span style="font-variant:small-caps;"': '\\textsc{',
  'span class="nocase"': '{'
};
function escapeCharacter(char) {
  if (char in unicode) {
    return unicode[char] in _constants.ligatures ? unicode[char] : `\\${unicode[char]}{}`;
  } else if (char in mathUnicode) {
    return `$\\${mathUnicode[char]}$`;
  } else if (/^[&%$#_{}]$/.test(char)) {
    return `\\${char}`;
  } else {
    return '';
  }
}
function escapeValue(value) {
  if (!_config.default.format.asciiOnly) {
    return value;
  }
  return value.normalize('NFKD').replace(UNSAFE_UNICODE, char => escapeCharacter(char)).replace(DIACRITIC_PATTERN, match => Array.from(match).reduce((subject, diacritic) => `{\\${unicode[diacritic]} ${subject}}`)).replace(LONE_DIACRITIC_PATTERN, '');
}
function formatRichText(value) {
  const closingTags = [];
  let tokens = value.split(/<(\/?(?:i|b|sc|sup|sub|span)|span .*?)>/g);
  tokens = tokens.map((token, index) => {
    if (index % 2 === 0) {
      return escapeValue(token);
    } else if (token in richTextMappings) {
      closingTags.push('/' + token.split(' ')[0]);
      return richTextMappings[token];
    } else if (token === closingTags[closingTags.length - 1]) {
      closingTags.pop();
      return '}';
    } else {
      return '';
    }
  });
  return tokens.join('');
}
function formatName(name) {
  if (name.family && !name.prefix && !name.given & !name.suffix) {
    return name.family.includes(listDelimiters.list) ? name.family : `{${name.family}}`;
  }
  const parts = [''];
  if (name.prefix && name.family) {
    parts[0] += name.prefix + ' ';
  }
  if (name.family) {
    parts[0] += name.family;
  }
  if (name.suffix) {
    parts.push(name.suffix);
    parts.push(name.given || '');
  } else {
    parts.push(name.given);
  }
  return escapeValue(parts.join(', ').trim());
}
function formatTitle(title) {
  return formatRichText(title).split(/(:\s*)/).map((part, i) => i % 2 ? part : part.replace(/([^\\])\b([a-z]*[A-Z].*?)\b/g, '$1{$2}')).join('');
}
function formatSingleValue(value, valueType) {
  switch (valueType) {
    case 'title':
      return formatTitle(value);
    case 'literal':
      return formatRichText(value.toString());
    case 'name':
      return formatName(value);
    case 'verbatim':
    case 'uri':
      return value.toString();
    default:
      return escapeValue(value.toString());
  }
}
function formatList(values, valueType, listType) {
  const delimiter = listDelimiters[listType];
  return values.map(value => {
    const formatted = formatSingleValue(value, valueType);
    return formatted.includes(delimiter) ? `{${formatted}}` : formatted;
  }).join(delimiter);
}
function formatAnnotationValue(values) {
  if (Array.isArray(values)) {
    return values.map(value => escapeValue(value).replace(/([;,"])/g, '{$1}')).join(', ');
  } else {
    return '"' + escapeValue(values).replace(/(["])/g, '{$1}') + '"';
  }
}
function format(field, value) {
  if (!(field in _constants.fieldTypes)) {
    return formatSingleValue(value, 'verbatim');
  }
  const [listType, valueType] = _constants.fieldTypes[field];
  if (listType in listDelimiters) {
    return formatList(value, valueType, listType);
  } else {
    return formatSingleValue(value, valueType);
  }
}
function formatAnnotation(value) {
  const annotations = [];
  if (value.field) {
    annotations.push('=' + formatAnnotationValue(value.field));
  }
  if (value.item) {
    for (const [itemCount, itemValue] of Object.entries(value.item)) {
      if (!itemValue) {
        continue;
      }
      const i = parseInt(itemCount) + 1;
      annotations.push(i + '=' + formatAnnotationValue(itemValue));
    }
  }
  if (value.part) {
    for (const [itemCount, itemValue] of Object.entries(value.part)) {
      if (!itemValue) {
        continue;
      }
      const i = parseInt(itemCount) + 1;
      for (const part in itemValue) {
        if (!itemValue[part]) {
          continue;
        }
        annotations.push(i + ':' + part + '=' + formatAnnotationValue(itemValue[part]));
      }
    }
  }
  return annotations.join('; ');
}
},{"../config.js":49,"../input/constants.js":52}],73:[function(require,module,exports){
"use strict";

var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
require("@citation-js/plugin-yaml");
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
const TYPES_TO_TARGET = {
  art: 'graphic',
  article: 'article-journal',
  audiovisual: 'motion_picture',
  bill: 'bill',
  blog: 'post-weblog',
  book: 'book',
  catalogue: 'collection',
  conference: 'event',
  'conference-paper': 'paper-conference',
  data: 'dataset',
  database: 'dataset',
  dictionary: 'entry-dictionary',
  'edited-work': 'document',
  encyclopedia: 'entry-encyclopedia',
  'film-broadcast': 'broadcast',
  generic: 'document',
  'government-document': 'regulation',
  grant: 'document',
  hearing: 'hearing',
  'historical-work': 'classic',
  'legal-case': 'legal_case',
  'legal-rule': 'legislation',
  'magazine-article': 'article-magazine',
  manual: 'report',
  map: 'map',
  multimedia: 'motion_picture',
  music: 'musical_score',
  'newspaper-article': 'article-newspaper',
  pamphlet: 'pamphlet',
  patent: 'patent',
  'personal-communication': 'personal_communication',
  proceedings: 'book',
  report: 'report',
  serial: 'periodical',
  slides: 'speech',
  software: 'software',
  'software-code': 'software',
  'software-container': 'software',
  'software-executable': 'software',
  'software-virtual-machine': 'software',
  'sound-recording': 'song',
  standard: 'standard',
  statute: 'legislation',
  thesis: 'thesis',
  unpublished: 'article',
  video: 'motion_picture',
  website: 'webpage'
};
const TYPES_TO_SOURCE = {
  article: 'article',
  'article-journal': 'article',
  'article-magazine': 'magazine-article',
  'article-newspaper': 'newspaper-article',
  bill: 'bill',
  book: 'book',
  broadcast: 'film-broadcast',
  chapter: 'generic',
  classic: 'historical-work',
  collection: 'catalogue',
  dataset: 'data',
  document: 'generic',
  entry: 'generic',
  'entry-dictionary': 'dictionary',
  'entry-encyclopedia': 'encyclopedia',
  event: 'conference',
  figure: 'generic',
  graphic: 'art',
  hearing: 'hearing',
  interview: 'sound-recording',
  legal_case: 'legal-case',
  legislation: 'statute',
  manuscript: 'historical-work',
  map: 'map',
  motion_picture: 'film-broadcast',
  musical_score: 'music',
  pamphlet: 'pamphlet',
  'paper-conference': 'conference-paper',
  patent: 'patent',
  performance: 'generic',
  periodical: 'serial',
  personal_communication: 'personal-communication',
  post: 'serial',
  'post-weblog': 'blog',
  regulation: 'government-document',
  report: 'report',
  review: 'generic',
  'review-book': 'generic',
  software: 'software',
  song: 'sound-recording',
  speech: 'slides',
  standard: 'standard',
  thesis: 'thesis',
  treaty: 'generic',
  webpage: 'website'
};
const ENTITY_PROPS = [{
  source: 'family-names',
  target: 'family'
}, {
  source: 'given-names',
  target: 'given'
}, {
  source: 'name-particle',
  target: 'non-dropping-particle'
}, {
  source: 'name-suffix',
  target: 'suffix'
}, {
  source: 'name',
  target: 'literal'
}, {
  source: 'orcid',
  target: '_orcid'
}];
const entity = new _core.util.Translator(ENTITY_PROPS);
const PROP_CONVERTERS = {
  names: {
    toTarget(names) {
      return names.map(entity.convertToTarget);
    },
    toSource(names) {
      return names.map(entity.convertToSource);
    }
  },
  publisher: {
    toTarget({
      name,
      city,
      region,
      country
    }) {
      const place = [city, region, country].filter(Boolean).join(', ');
      return [name, place || undefined];
    },
    toSource(name, place) {
      const entity = {
        name
      };
      if (place) {
        const parts = place.split(', ');
        entity.country = parts.pop();
        if (parts.length === 2) {
          entity.region = parts.pop();
        }
        if (parts.length === 1) {
          entity.city = parts.pop();
        }
      }
      return entity;
    }
  },
  date: {
    toTarget(date) {
      if (date instanceof Date) {
        date = date.toISOString();
      }
      return (0, _date.parse)(date);
    },
    toSource(date) {
      if (date.raw) {
        return date.raw;
      }
      const [year, month, day] = date['date-parts'][0];
      if (day) {
        return new Date(Date.UTC(year, month - 1, day));
      } else if (month) {
        return new Date(Date.UTC(year, month - 1));
      } else {
        return new Date(Date.UTC(year));
      }
    }
  }
};
const SHARED_PROPS = ['abstract', {
  source: 'authors',
  target: 'author',
  convert: PROP_CONVERTERS.names
}, {
  source: 'date-released',
  target: 'issued',
  when: {
    target: {
      type: 'software'
    }
  },
  convert: PROP_CONVERTERS.date
}, {
  source: 'doi',
  target: 'DOI'
}, {
  source: 'identifiers',
  target: ['DOI', 'ISBN', 'ISSN', 'PMCID', 'PMID', 'URL'],
  convert: {
    toTarget(identifiers) {
      const newIdentifiers = Array(6).fill(undefined);
      for (const {
        type,
        value
      } of identifiers) {
        if (!this.doi && type === 'doi') {
          newIdentifiers[0] = value;
        }
        if (!this.url && type === 'url') {
          newIdentifiers[5] = value;
        }
        if (type === 'other' && value.startsWith('urn:isbn:')) {
          newIdentifiers[1] = value.slice(9);
        }
        if (type === 'other' && value.startsWith('urn:issn:')) {
          newIdentifiers[2] = value.slice(9);
        }
        if (type === 'other' && value.startsWith('pmcid:')) {
          newIdentifiers[3] = value.slice(6);
        }
        if (type === 'other' && value.startsWith('pmid:')) {
          newIdentifiers[4] = value.slice(5);
        }
      }
      return newIdentifiers;
    },
    toSource(doi, isbn, issn, pmcid, pmid, url) {
      return [doi && {
        type: 'doi',
        value: doi
      }, url && {
        type: 'url',
        value: url
      }, isbn && {
        type: 'other',
        value: `urn:isbn:${isbn}`
      }, issn && {
        type: 'other',
        value: `urn:issn:${issn}`
      }, pmcid && {
        type: 'other',
        value: `pmcid:${pmcid}`
      }, pmid && {
        type: 'other',
        value: `pmid:${pmid}`
      }].filter(Boolean);
    }
  }
}, {
  source: 'keywords',
  target: 'keyword',
  convert: {
    toTarget(keywords) {
      return keywords.join(',');
    },
    toSource(keywords) {
      return keywords.split(/,\s*/g);
    }
  }
}, {
  source: 'title',
  target: 'title',
  when: {
    source: {
      term: false,
      entry: false
    },
    target: {
      type(type) {
        return !['entry', 'entry-dictionary', 'entry-encyclopedia'].includes(type);
      }
    }
  }
}, {
  source: 'title',
  target: 'container-title',
  when: {
    source: {
      entry: true,
      journal: false
    },
    target: {
      type: ['entry']
    }
  }
}, {
  source: 'title',
  target: 'container-title',
  when: {
    source: {
      term: true,
      journal: false
    },
    target: {
      type: ['entry-dictionary', 'entry-encyclopedia']
    }
  }
}, {
  source: 'url',
  target: 'URL'
}, 'version'];
const MAIN_PROPS = [{
  source: 'type',
  target: 'type',
  convert: {
    toSource(type) {
      return type === 'dataset' ? 'dataset' : 'software';
    },
    toTarget(type) {
      return type === 'dataset' ? 'dataset' : 'software';
    }
  }
}, ...SHARED_PROPS];
const REF_PROPS = [...SHARED_PROPS, {
  source: 'abbreviation',
  target: 'title-short'
}, {
  source: 'abbreviation',
  target: 'shortTitle'
}, 'collection-title', {
  source: 'recipients',
  target: 'recipient',
  convert: PROP_CONVERTERS.names
}, {
  source: 'senders',
  target: 'authors',
  convert: PROP_CONVERTERS.names
}, {
  source: 'conference',
  target: ['event-title', 'event-date', 'event-place', 'event'],
  convert: {
    toSource(name, date, place, nameFallback) {
      const entity = {
        name: name || nameFallback
      };
      if (place) {
        entity.location = place;
      }
      if (date) {
        entity['date-start'] = PROP_CONVERTERS.date.toSource(date);
        if (date['date-parts'] && date['date-parts'].length === 2) {
          entity['date-end'] = PROP_CONVERTERS.date.toSource({
            'date-parts': [date['date-parts'][1]]
          });
        }
      }
      return entity;
    },
    toTarget(event) {
      const startDate = event['date-start'] instanceof Date ? event['date-start'].toISOString() : event['date-start'];
      const endDate = event['date-end'] instanceof Date ? event['date-end'].toISOString() : event['date-end'];
      const date = startDate && (0, _date.parse)(startDate, endDate);
      return [event.name, date, event.location];
    }
  }
}, {
  source: 'database',
  target: 'source'
}, {
  source: 'date-accessed',
  target: 'accessed',
  convert: PROP_CONVERTERS.date
}, {
  source: 'date-downloaded',
  target: 'accessed',
  convert: PROP_CONVERTERS.date,
  when: {
    source: {
      'date-accessed': false
    },
    target: false
  }
}, {
  source: 'date-published',
  target: 'issued',
  convert: PROP_CONVERTERS.date,
  when: {
    source: {
      'date-released': false
    },
    target() {
      return this.type !== 'book' || !this.version;
    }
  }
}, {
  source: ['year', 'month'],
  target: 'issued',
  when: {
    source: {
      'date-published': false,
      'date-released': false,
      year: true
    }
  },
  convert: {
    toTarget(year, month) {
      const date = month ? [year, month] : [year];
      return {
        'date-parts': [date]
      };
    },
    toSource(issued) {
      const [year, month] = issued['date-parts'][0];
      return [year, month];
    }
  }
}, {
  source: 'year-original',
  target: 'original-date',
  convert: {
    toTarget(year) {
      return {
        'date-parts': [[year]]
      };
    },
    toSource(date) {
      return date['date-parts'][0][0];
    }
  }
}, 'edition', {
  source: 'editors',
  target: 'editor',
  convert: PROP_CONVERTERS.names
}, {
  source: 'editors-series',
  target: 'collection-editor',
  convert: PROP_CONVERTERS.names
}, {
  source: 'entry',
  target: 'title',
  when: {
    source: {
      term: false
    },
    target: {
      type: 'entry'
    }
  }
}, {
  source: 'term',
  target: 'title',
  when: {
    target: {
      type: ['entry-dictionary', 'entry-encyclopedia']
    }
  }
}, {
  source: 'format',
  target: 'dimensions'
}, 'medium', {
  source: 'data-type',
  target: 'genre',
  when: {
    target: {
      type(type) {
        return type !== 'thesis';
      }
    }
  }
}, {
  source: 'thesis-type',
  target: 'genre',
  when: {
    source: {
      'data-type': false
    },
    target: {
      type: 'thesis'
    }
  }
}, {
  source: 'isbn',
  target: 'ISBN'
}, {
  source: 'issn',
  target: 'ISSN'
}, {
  source: 'pmcid',
  target: 'PMCID'
}, 'issue', {
  source: 'journal',
  target: 'container-title'
}, {
  source: 'volume-title',
  target: 'volume-title'
}, {
  source: 'issue-title',
  target: 'volume-title',
  when: {
    source: {
      'volume-title': false
    },
    target: false
  }
}, {
  source: 'languages',
  target: 'language',
  when: {
    target: true,
    source: {
      language(code) {
        return /[a-z]{2,3}/.test(code);
      }
    }
  },
  convert: {
    toSource(language) {
      return [language];
    },
    toTarget(languages) {
      return languages[0];
    }
  }
}, {
  source: 'location',
  target: ['archive', 'archive-place'],
  convert: PROP_CONVERTERS.publisher
}, {
  source: 'notes',
  target: 'note',
  when: {
    source: {
      scope: false
    }
  }
}, {
  source: 'scope',
  target: 'note',
  when: {
    target: false
  }
}, 'number', {
  source: 'patent-states',
  target: 'jurisdiction',
  when: {
    target: false
  },
  convert: {
    toTarget(states) {
      return states.join(', ');
    }
  }
}, {
  source: ['institution', 'department'],
  target: ['publisher', 'publisher-place'],
  when: {
    source: {
      publisher: false
    },
    target: {
      type: 'thesis'
    }
  },
  convert: {
    toTarget(institution, department) {
      const [name, place] = PROP_CONVERTERS.publisher.toTarget(institution);
      return [department ? `${department}, ${name}` : name, place];
    },
    toSource(name, place) {
      return [PROP_CONVERTERS.publisher.toSource(name, place)];
    }
  }
}, {
  source: 'publisher',
  target: ['publisher', 'publisher-place'],
  when: {
    target: {
      type(type) {
        return type !== 'thesis';
      }
    }
  },
  convert: PROP_CONVERTERS.publisher
}, 'section', {
  source: 'status',
  target: 'status',
  when: {
    source: true,
    target: {
      status: ['in-preparation', 'abstract', 'submitted', 'in-press', 'advance-online', 'preprint']
    }
  }
}, {
  source: 'start',
  target: 'page-first',
  when: {
    target: {
      page: false
    }
  }
}, {
  source: ['start', 'end'],
  target: 'page',
  convert: {
    toTarget(start, end) {
      return end ? `${start}-${end}` : start;
    },
    toSource(page) {
      const [start, end] = page.split('-');
      return end ? [start, end] : [start];
    }
  }
}, {
  source: 'pages',
  target: 'number-of-pages'
}, {
  source: 'translators',
  target: 'translator',
  convert: PROP_CONVERTERS.names
}, {
  source: 'type',
  target: 'type',
  convert: {
    toTarget(type) {
      return TYPES_TO_TARGET[type] || 'document';
    },
    toSource(type) {
      if (type === 'book' && this['event-title']) {
        return 'proceedings';
      }
      return TYPES_TO_SOURCE[type] || 'generic';
    }
  }
}, 'volume', {
  source: 'number-volumes',
  target: 'number-of-volumes'
}];
const mainTranslator = new _core.util.Translator(MAIN_PROPS);
const refTranslator = new _core.util.Translator(REF_PROPS);
const CFF_VERSION = '1.2.0';
function parse(input) {
  const main = mainTranslator.convertToTarget(input);
  if (input['cff-version'] <= '1.1.0') {
    main.type = TYPES_TO_TARGET.software;
  }
  main._cff_mainReference = true;
  const output = [main];
  if (input['preferred-citation']) {
    output.push(refTranslator.convertToTarget(input['preferred-citation']));
  }
  if (Array.isArray(input.references)) {
    output.push(...input.references.map(refTranslator.convertToTarget));
  }
  return output;
}
function format(input, options = {}) {
  input = input.slice();
  const {
    main,
    preferred,
    cffVersion = CFF_VERSION,
    message = 'Please cite the following works when using this software.'
  } = options;
  let preferredCitation;
  const preferredIndex = input.findIndex(entry => preferred && entry.id === preferred);
  if (cffVersion >= '1.2.0' && preferredIndex > -1) {
    preferredCitation = refTranslator.convertToSource(...input.splice(preferredIndex, 1));
  }
  let mainIndex = input.findIndex(entry => main ? entry.id === main : entry._cff_mainReference);
  mainIndex = mainIndex > -1 ? mainIndex : 0;
  const mainRef = input[mainIndex] ? mainTranslator.convertToSource(...input.splice(mainIndex, 1)) : {};
  if (mainRef && cffVersion < '1.2.0') {
    delete mainRef.type;
  }
  const cff = _objectSpread({
    'cff-version': cffVersion,
    message
  }, mainRef);
  if (preferredCitation) {
    cff['preferred-citation'] = preferredCitation;
  }
  if (input.length) {
    cff.references = input.map(refTranslator.convertToSource);
  }
  return cff;
}
_core.plugins.add('@cff', {
  input: {
    '@cff/object': {
      parseType: {
        dataType: 'SimpleObject',
        propertyConstraint: {
          props: 'cff-version'
        }
      },
      parse
    }
  },
  output: {
    cff(data, options = {}) {
      const output = format(data, options);
      if (options.type === 'object') {
        return output;
      } else {
        return _core.plugins.output.format('yaml', output);
      }
    }
  }
});

},{"@citation-js/core":"citation-js","@citation-js/date":43,"@citation-js/plugin-yaml":97}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parseDoiApi;
exports.parseAsync = parseDoiApiAsync;
var _core = require("@citation-js/core");
var _json = _interopRequireDefault(require("./json.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const apiOptions = {
  checkContentType: true,
  headers: {
    Accept: 'application/vnd.citationstyles.csl+json'
  }
};
function processApiResponse(response) {
  if (response === '[]') {
    return {};
  }
  return (0, _json.default)(JSON.parse(response));
}
function parseDoiApiAsync(data) {
  const response = [].concat(data).map(url => _core.util.fetchFileAsync(url, apiOptions).then(processApiResponse));
  return Promise.all(response);
}
function parseDoiApi(data) {
  const response = [].concat(data).map(url => _core.util.fetchFile(url, apiOptions)).map(processApiResponse);
  return response;
}
},{"./json.js":77,"@citation-js/core":"citation-js"}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = parseDoi;
function parseDoi(data) {
  const list = Array.isArray(data) ? data : data.trim().split(/(?:\s+)/g);
  return list.map(doi => `https://doi.org/${doi}`);
}
},{}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.parsers = exports.formats = void 0;
var _core = require("@citation-js/core");
var id = _interopRequireWildcard(require("./id.js"));
var api = _interopRequireWildcard(require("./api.js"));
var json = _interopRequireWildcard(require("./json.js"));
var type = _interopRequireWildcard(require("./type.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ref = exports.ref = '@doi';
const parsers = exports.parsers = {
  id,
  api,
  json,
  type
};
const formats = exports.formats = {
  '@doi/api': {
    parse: api.parse,
    parseAsync: api.parseAsync,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(https?:\/\/(?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9[\]<>]+))\s*$/i,
      extends: '@else/url'
    }
  },
  '@doi/short-url': {
    parse: function (url) {
      return url.replace(/^(\s*)/, '$1https://');
    },
    parseType: {
      dataType: 'String',
      predicate: /^\s*((?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9[\]<>]+))\s*$/i
    }
  },
  '@doi/id': {
    parse: id.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(10.\d{4,9}\/[-._;()/:A-Z0-9[\]<>]+)\s*$/i
    }
  },
  '@doi/list+text': {
    parse: id.parse,
    parseType: {
      dataType: 'String',
      tokenList: /^10.\d{4,9}\/[-._;()/:A-Z0-9[\]<>]+$/i
    }
  },
  '@doi/list+object': {
    parse: id.parse,
    parseType: {
      dataType: 'Array',
      elementConstraint: '@doi/id'
    }
  },
  '@doi/type': {
    parse: type.parse
  }
};
_core.plugins.add(ref, {
  input: formats
});
},{"./api.js":74,"./id.js":75,"./json.js":77,"./type.js":78,"@citation-js/core":"citation-js"}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = parseDoiJson;
var _type = _interopRequireDefault(require("./type.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function parseDoiJson(data) {
  const res = {
    type: (0, _type.default)(data.type, data)
  };
  const dateFields = ['submitted', 'issued', 'event-date', 'original-date', 'container', 'accessed'];
  dateFields.forEach(field => {
    const value = data[field];
    if (value && value['date-parts'] && typeof value['date-parts'][0] === 'number') {
      value['date-parts'] = [value['date-parts']];
    }
  });
  if (data.type === 'dissertation' && !data.genre) {
    res.genre = 'Doctoral dissertation';
  }
  if (data.type === 'posted-content' && (data.subtype === 'preprint' || data.member === '31795')) {
    if (Array.isArray(data.institution) && data.institution[0] && data.institution[0].name) {
      res['container-title'] = data.institution[0].name;
    }
  }
  return Object.assign({}, data, res);
}
},{"./type.js":78}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = fetchDoiType;
const doiTypes = {
  'journal-article': 'article-journal',
  'book-chapter': 'chapter',
  'posted-content': 'manuscript',
  'proceedings-article': 'paper-conference',
  dissertation: 'thesis'
};
function fetchDoiType(value, data) {
  if (value === 'posted-content' && data.subtype === 'preprint') {
    return 'article';
  }
  if (value === 'posted-content' && data.subtype === 'other' && data.member === '31795') {
    return 'post-weblog';
  }
  return doiTypes[value] || value;
}
},{}],79:[function(require,module,exports){
"use strict";

var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
var _name = require("@citation-js/name");
let API_TOKEN = null;
const propMaps = {
  name: 'title-short',
  full_name: 'title',
  description: 'abstract',
  html_url: 'URL',
  pushed_at: 'issued',
  contributors_url: 'author'
};
async function parseValue(prop, value) {
  switch (prop) {
    case 'contributors_url':
      {
        let contributors = await api(value);
        contributors = await Promise.all(contributors.filter(({
          type
        }) => type !== 'Bot').map(({
          url
        }) => api(url)));
        return contributors.map(({
          name,
          login
        }) => name ? (0, _name.parse)(name) : {
          literal: login
        });
      }
    case 'pushed_at':
      return (0, _date.parse)(value);
    default:
      return value;
  }
}
const config = {
  setApiToken(token) {
    API_TOKEN = token;
  }
};
async function json(input) {
  const output = {
    type: 'software'
  };
  const tags = input.tags_url ? await api(input.tags_url) : [];
  for (const prop in propMaps) {
    if (prop in input) {
      output[propMaps[prop]] = await parseValue(prop, input[prop]);
    }
  }
  if (tags) {
    output.version = tags[0].name;
    output.custom = {
      versions: tags.map(tag => ({
        version: tag.name
      }))
    };
  }
  return output;
}
async function api(input) {
  const headers = {
    Accept: 'application/vnd.github.v3+json'
  };
  if (API_TOKEN) {
    headers.Authorization = `token ${API_TOKEN}`;
  }
  const output = await _core.util.fetchFileAsync(input, {
    headers
  });
  return JSON.parse(output);
}
function url(input) {
  const [, user, repo] = input.match(/^https?:\/\/github.com\/([^/]+)\/([^/]+)/);
  return `https://api.github.com/repos/${user}/${repo}`;
}
_core.plugins.add('@github', {
  config,
  input: {
    '@github/url': {
      parseType: {
        dataType: 'String',
        predicate: /^https?:\/\/github\.com\/[^/]+\//,
        extends: '@else/url'
      },
      parse: url
    },
    '@github/api': {
      parseType: {
        dataType: 'String',
        predicate: /^https?:\/\/api\.github\.com\/repos\/[^/]+\//,
        extends: '@else/url'
      },
      parseAsync: api
    },
    '@github/object': {
      parseType: {
        dataType: 'SimpleObject',
        propertyConstraint: {
          props: 'url',
          value(url) {
            return /^https?:\/\/api\.github\.com\/repos\/[^/]+\//.test(url);
          }
        }
      },
      parseAsync: json
    }
  }
});

},{"@citation-js/core":"citation-js","@citation-js/date":43,"@citation-js/name":46}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GOOGLE_BOOKS_API_VERSION = void 0;
exports.format = format;
exports.parse = parse;
var _core = require("@citation-js/core");
var name = _interopRequireWildcard(require("@citation-js/name"));
var date = _interopRequireWildcard(require("@citation-js/date"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GOOGLE_PROPS = [{
  source: 'printType',
  target: 'type',
  convert: {
    toTarget(type) {
      return {
        BOOK: 'book',
        MAGAZINE: 'article-magazine'
      }[type];
    },
    toSource(type) {
      if (type.slice(0, 7) === 'article') {
        return 'MAGAZINE';
      } else {
        return 'BOOK';
      }
    }
  }
}, {
  source: 'authors',
  target: 'author',
  convert: {
    toTarget(authors) {
      return authors.map(name.parse);
    },
    toSource(authors) {
      return authors.map(name.format);
    }
  }
}, {
  source: 'canonicalVolumeLink',
  target: 'URL'
}, {
  source: 'categories',
  target: 'keyword',
  convert: {
    toTarget(array) {
      return array.join(',');
    },
    toSource(list) {
      return list.split(',');
    }
  }
}, {
  source: 'description',
  target: 'abstract'
}, {
  source: 'dimensions',
  target: 'dimensions',
  convert: {
    toTarget({
      height,
      width,
      thickness
    }) {
      return `${height} x ${width} x ${thickness} cm`;
    },
    toSource(list) {}
  }
}, {
  source: 'industryIdentifiers',
  target: ['ISBN', 'ISSN', 'DOI', 'PMID', 'PMCID'],
  convert: {
    toTarget(ids) {
      return ['ISBN_13', 'ISSN'].map(id => (ids.find(({
        type
      }) => type === id) || {}).identifier);
    },
    toSource(isbn, issn, ...other) {
      return [isbn && {
        type: isbn.length === 13 ? 'ISBN_13' : 'ISBN_10',
        identifier: isbn
      }, issn && {
        type: 'ISSN',
        identifier: issn
      }, ...other.map(identifier => ({
        type: 'OTHER',
        identifier
      }))].filter(Boolean);
    }
  }
}, 'language', {
  source: 'pageCount',
  target: 'number-of-pages'
}, 'publisher', 'title', {
  source: 'publishedDate',
  target: 'issued',
  convert: {
    toTarget: date.parse,
    toSource: date.format
  }
}];
const translator = new _core.util.Translator(GOOGLE_PROPS);
function parse(volume) {
  if (volume.volumeInfo.language === 'un') {
    delete volume.volumeInfo.language;
  }
  if (volume.volumeInfo.pageCount === 0) {
    delete volume.volumeInfo.pageCount;
  }
  return translator.convertToTarget(volume.volumeInfo);
}
function format(records) {
  return {
    kind: 'books#volumes',
    totalItems: records.length,
    items: records.map(translator.convertToSource)
  };
}
const GOOGLE_BOOKS_API_VERSION = 'v1';
exports.GOOGLE_BOOKS_API_VERSION = GOOGLE_BOOKS_API_VERSION;
},{"@citation-js/core":"citation-js","@citation-js/date":43,"@citation-js/name":46}],81:[function(require,module,exports){
"use strict";

var _core = require("@citation-js/core");
var _input = require("./input");
_core.plugins.add(_input.ref, {
  input: _input.formats
});
},{"./input":82,"@citation-js/core":"citation-js"}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.formats = void 0;
var _core = require("@citation-js/core");
var google = _interopRequireWildcard(require("./google-books.js"));
var ol = _interopRequireWildcard(require("./open-library.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function getUrls(isbn) {
  isbn = isbn.replace(/-/g, '');
  return [[`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, json => json.totalItems], [`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`, json => Object.keys(json).length]];
}
function getResponse(isbn) {
  var _iterator = _createForOfIteratorHelper(getUrls(isbn)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const _step$value = _slicedToArray(_step.value, 2),
        url = _step$value[0],
        check = _step$value[1];
      const json = JSON.parse(_core.util.fetchFile(url));
      if (check(json)) {
        return json;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  throw new Error(`Cannot find resource for ISBN: ${isbn}`);
}
function getResponseAsync(_x2) {
  return _getResponseAsync.apply(this, arguments);
}
function _getResponseAsync() {
  _getResponseAsync = _asyncToGenerator(function* (isbn) {
    var _iterator2 = _createForOfIteratorHelper(getUrls(isbn)),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        const _step2$value = _slicedToArray(_step2.value, 2),
          url = _step2$value[0],
          check = _step2$value[1];
        const json = JSON.parse(yield _core.util.fetchFileAsync(url));
        if (check(json)) {
          return json;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    throw new Error(`Cannot find resource for ISBN: ${isbn}`);
  });
  return _getResponseAsync.apply(this, arguments);
}
const ref = '@isbn';
exports.ref = ref;
const formats = {
  '@isbn/isbn-10': {
    parse: getResponse,
    parseAsync: getResponseAsync,
    parseType: {
      dataType: 'String',
      predicate(id) {
        return /^\d{10}$/.test(id.replace(/-/g, ''));
      }
    }
  },
  '@isbn/isbn-13': {
    parse: getResponse,
    parseAsync: getResponseAsync,
    parseType: {
      dataType: 'String',
      predicate(id) {
        return /^(978|979)\d{10}$/.test(id.replace(/-/g, ''));
      }
    }
  },
  '@isbn/isbn-a': {
    parse: doi => doi.slice(3).replace(/\D/g, ''),
    parseType: {
      dataType: 'String',
      predicate: /^10\.(978|979)\.\d{2,8}\/\d{2,7}$/
    },
    outputs: '@isbn/isbn-13'
  },
  '@isbn/number': {
    parse: number => number.toString(),
    parseType: {
      dataType: 'Primitive',
      predicate: number => [10, 13].includes(number.toString().length)
    },
    outputs: '@isbn/isbn-13'
  },
  '@isbn/vnd.google.books.volumes+object': {
    parse(record) {
      return record.items;
    },
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: [{
        props: 'kind',
        value: kind => kind === 'books#volumes'
      }, {
        props: ['totalItems', 'items']
      }]
    }
  },
  '@isbn/vnd.google.books.volume+object': {
    parse: google.parse,
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: [{
        props: 'kind',
        value: kind => kind === 'books#volume'
      }, {
        props: ['volumeInfo', 'id']
      }]
    },
    outputs: '@csl/object'
  },
  '@isbn/vnd.archive.openlibrary.books+object': {
    parse: ol.parse,
    parseType: {
      dataType: 'SimpleObject',
      predicate(response) {
        return Object.keys(response).every(key => key.slice(0, 5) === 'ISBN:');
      }
    },
    outputs: '@csl/list+object'
  }
};
exports.formats = formats;
},{"./google-books.js":80,"./open-library.js":83,"@citation-js/core":"citation-js"}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.parse = parse;
var _core = require("@citation-js/core");
var name = _interopRequireWildcard(require("@citation-js/name"));
var date = _interopRequireWildcard(require("@citation-js/date"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
const CONVERT_ARRAY_OF_OBJECTS = {
  toTarget: ([{
    name
  }]) => name,
  toSource: name => [{
    name
  }]
};
const OL_PROPS = [{
  target: 'type',
  convert: {
    toTarget: () => 'book'
  }
}, {
  source: 'authors',
  target: 'author',
  convert: {
    toTarget(authors) {
      return authors.map(({
        name: author,
        url
      }) => {
        author = name.parse(author);
        author._url = url;
        return author;
      });
    },
    toSource: authors => authors.map(author => ({
      name: name.format(author)
    }))
  }
}, {
  source: 'identifiers',
  target: ['ISBN', 'ISSN', 'DOI', 'PMID', 'PMCID'],
  convert: {
    toTarget: identifiers => identifiers.isbn_13 || identifiers.isbn_10,
    toSource(...identifiers) {
      const ids = [identifiers[0] && `isbn_${identifiers[0].length}`, 'issn', 'doi', 'pmid', 'pmcid'];
      return identifiers.reduce((acc, id, i) => {
        if (id) {
          acc[ids[i]] = id;
        }
        return acc;
      }, {});
    }
  }
}, {
  source: 'number_of_pages',
  target: 'number-of-pages'
}, {
  source: 'publishers',
  target: 'publisher',
  convert: CONVERT_ARRAY_OF_OBJECTS
}, {
  source: 'publish_date',
  target: 'issued',
  convert: {
    toTarget: date.parse,
    toSource: date.format
  }
}, {
  source: 'publish_places',
  target: 'publisher-place',
  convert: CONVERT_ARRAY_OF_OBJECTS
}, {
  source: ['subjects', 'subject_places', 'subject_people', 'subject_times'],
  target: 'keyword',
  convert: {
    toTarget: (...subjects) => [].concat(...subjects).filter(Boolean).map(({
      name
    }) => name).join(),
    toSource: keywords => [keywords.split(',').map(name => ({
      name,
      url: 'https://openlibrary.org/subjects/' + name.toLowerCase().replace(/\W+/g, '_')
    }))]
  }
}, 'title', {
  source: 'url',
  target: 'URL'
}];
const translator = new _core.util.Translator(OL_PROPS);
function parse(response) {
  return Object.keys(response).map(id => {
    return translator.convertToTarget(response[id]);
  });
}
function format(records) {
  const output = {};
  var _iterator = _createForOfIteratorHelper(records),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const record = _step.value;
      if (!record.ISBN) {
        output[`ISBN:${record.ISBN}`] = translator.convertToSource(record);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return output;
}
},{"@citation-js/core":"citation-js","@citation-js/date":43,"@citation-js/name":46}],84:[function(require,module,exports){
"use strict";

var _core = require("@citation-js/core");
var _date = require("@citation-js/date");
var _name = require("@citation-js/name");
const propMaps = {
  name: 'title',
  description: 'abstract',
  homepage: 'URL',
  author: 'author'
};
async function parseValue(prop, value) {
  switch (prop) {
    case 'author':
      return [(0, _name.parse)(value.name)];
    default:
      return value;
  }
}
async function json(input) {
  const output = {
    type: 'software',
    custom: {
      versions: []
    }
  };
  for (const prop in propMaps) {
    if (prop in input) {
      output[propMaps[prop]] = await parseValue(prop, input[prop]);
    }
    const {
      latest
    } = input['dist-tags'];
    output.version = latest;
    output.issued = (0, _date.parse)(input.time[latest]);
  }
  for (const version in input.versions) {
    output.custom.versions.push({
      version,
      issued: (0, _date.parse)(input.time[version])
    });
  }
  return output;
}
async function api(input) {
  const output = await _core.util.fetchFileAsync(input);
  return JSON.parse(output);
}
function url(input) {
  const [, pkg] = input.match(/((@[^/]+\/)?[^/]+)$/);
  return `https://registry.npmjs.org/${pkg}`;
}
_core.plugins.add('@npm', {
  input: {
    '@npm/url': {
      parseType: {
        dataType: 'String',
        predicate: /^https?:\/\/(www\.)?(npmjs\.com|npmjs\.org|npm\.im)\/(package)?/,
        extends: '@else/url'
      },
      parse: url
    },
    '@npm/api': {
      parseType: {
        dataType: 'String',
        predicate: /^https?:\/\/registry\.npmjs\.org\//,
        extends: '@else/url'
      },
      parseAsync: api
    },
    '@npm/object': {
      parseType: {
        dataType: 'SimpleObject',
        propertyConstraint: {
          props: 'versions',
          value(versions) {
            for (const version in versions) {
              if ('_npmUser' in versions[version] || '_npmVersion' in versions[version]) {
                return true;
              }
            }
            return false;
          }
        }
      },
      parseAsync: json
    }
  }
});

},{"@citation-js/core":"citation-js","@citation-js/date":43,"@citation-js/name":46}],85:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"./input":86,"@citation-js/core":"citation-js","dup":81}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.formats = void 0;
var _core = require("@citation-js/core");
const ref = '@pubmed';
exports.ref = ref;
const formats = {
  '@pubmed/id': {
    parseAsync(id) {
      id = id.replace('pmid:', '');
      const url = `https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=${id}`;
      const headers = {};
      return _core.util.fetchFileAsync(url, {
        headers
      });
    },
    parseType: {
      dataType: 'String',
      predicate: /^pmid:\d+$/
    }
  },
  '@pubmed/pmcid': {
    parseAsync(id) {
      id = id.replace('PMC', '');
      const url = `https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pmc/?format=csl&id=${id}`;
      const headers = {};
      return _core.util.fetchFileAsync(url, {
        headers
      });
    },
    parseType: {
      dataType: 'String',
      predicate: /^PMC\d+$/
    }
  }
};
exports.formats = formats;
},{"@citation-js/core":"citation-js"}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _date = require("@citation-js/date");
var _types = _interopRequireDefault(require("./spec/types.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ISSN_REGEX = /^\d{4}-\d{3}[0-9Xx]$/;
const DOI_REGEX = /10(?:\.[0-9]{4,})?\/[^\s]*[^\s.,]/;
const CONVERTERS = {
  ANY: {
    toTarget(...values) {
      return values.find(Boolean);
    },
    toSource(value) {
      return [value];
    }
  },
  PAGE: {
    keepAll: true,
    toTarget(start, end) {
      return [start, end].filter(Boolean).join('-');
    },
    toSource(pages) {
      return pages.replace(/[-–—]/g, '-');
    }
  },
  ISBN: {
    toTarget(id) {
      return ISSN_REGEX.test(id) ? [id] : [undefined, id];
    },
    toSource(...ids) {
      return ids.find(Boolean);
    }
  },
  DATE: {
    toTarget(date) {
      return date && (0, _date.parse)(date.split('/').slice(0, 3).filter(Boolean).join('/'));
    },
    toSource(date) {
      if (!date['date-parts'] || !date['date-parts'][0]) {
        return undefined;
      }
      const parts = Array(4).fill('');
      date['date-parts'][0].forEach((part, index) => {
        parts[index] = part;
      });
      if (date.season) {
        parts[3] = date.season;
      }
      return parts.join('/');
    }
  },
  YEAR: {
    toTarget(year) {
      return isNaN(+year) ? {
        raw: year
      } : {
        'date-parts': [[+year]]
      };
    },
    toSource(date) {
      var _date$dateParts;
      return (_date$dateParts = date['date-parts']) === null || _date$dateParts === void 0 || (_date$dateParts = _date$dateParts[0]) === null || _date$dateParts === void 0 || (_date$dateParts = _date$dateParts[0]) === null || _date$dateParts === void 0 ? void 0 : _date$dateParts.toString();
    }
  },
  DATE_YEAR: {
    keepAll: true,
    toTarget(...dates) {
      return CONVERTERS.DATE.toTarget(CONVERTERS.ANY.toTarget(...dates));
    },
    toSource(date) {
      return [CONVERTERS.DATE.toSource(date), CONVERTERS.YEAR.toSource(date)];
    }
  },
  NAME: {
    toTarget(names) {
      return names && [].concat(names).map(name => {
        const parts = name.split(/, ?/);
        const [family, given, suffix] = parts;
        switch (parts.length) {
          case 3:
            return {
              family,
              given,
              suffix
            };
          case 2:
            return {
              family,
              given
            };
          case 1:
            if (family.indexOf(' ') === -1) {
              return {
                family
              };
            }
          default:
            return {
              literal: name
            };
        }
      });
    },
    toSource(names) {
      return names.map(({
        family,
        given,
        suffix,
        literal
      }) => {
        const parts = [family, given, suffix].filter(Boolean);
        return parts.length ? parts.join(', ') : literal;
      });
    }
  },
  KEYWORD: {
    toTarget(words) {
      words = [].concat(words);
      return words.join(',');
    },
    toSource(words) {
      return words.split(',');
    }
  },
  ID: {
    toSource(id) {
      return id.toString().slice(0, 20);
    }
  },
  TYPE: {
    toTarget(type) {
      return _types.default.RIS[type];
    },
    toSource(type) {
      return _types.default.CSL[type];
    }
  },
  DOI: {
    toTarget(doi) {
      const match = doi.match(DOI_REGEX);
      return match ? match[0] : undefined;
    },
    toSource(doi) {
      const match = doi.match(DOI_REGEX);
      return match ? match[0] : undefined;
    }
  }
};
var _default = exports.default = CONVERTERS;
},{"./spec/types.json":96,"@citation-js/date":43}],88:[function(require,module,exports){
module.exports={
  "author": "NAME",
  "chair": "NAME",
  "collection-editor": "NAME",
  "compiler": "NAME",
  "composer": "NAME",
  "container-author": "NAME",
  "contributor": "NAME",
  "curator": "NAME",
  "director": "NAME",
  "editor": "NAME",
  "editorial-director": "NAME",
  "editor-translator": "NAME",
  "executive-producer": "NAME",
  "guest": "NAME",
  "host": "NAME",
  "illustrator": "NAME",
  "interviewer": "NAME",
  "narrator": "NAME",
  "organizer": "NAME",
  "original-author": "NAME",
  "performer": "NAME",
  "producer": "NAME",
  "recipient": "NAME",
  "reviewed-author": "NAME",
  "script-writer": "NAME",
  "series-creator": "NAME",
  "translator": "NAME",

  "accessed": "DATE",
  "available-date": "DATE",
  "event-date": "DATE",
  "issued": "DATE_YEAR",
  "original-date": "DATE",
  "submitted": "DATE",

  "id": "ID",
  "ISSN,ISBN": "ISBN",
  "keyword": "KEYWORD",
  "page": "PAGE",
  "type": "TYPE",
  "DOI": "DOI"
}

},{}],89:[function(require,module,exports){
"use strict";

var _core = require("@citation-js/core");
var _ris = require("./ris.js");
const oldProps = ['A1', 'AV', 'BT', 'CP', 'ED', 'EP', 'ID', 'J1', 'JA', 'JF', 'JO', 'L2', 'L3', 'N2', 'T1', 'U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'Y1'];
const newProps = ['A4', 'AD', 'AN', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'CA', 'CN', 'DA', 'DB', 'DO', 'DP', 'ET', 'LA', 'LB', 'NV', 'OP', 'PY', 'RI', 'RN', 'SE', 'ST', 'SV', 'TA', 'TT'];
_core.plugins.add('@ris', {
  input: {
    '@ris/file': {
      parse: _ris.parse,
      parseType: {
        dataType: 'String',
        predicate: /^TY {2}- /m
      }
    },
    '@ris/record': {
      parse: _ris.parseMixed,
      parseType: {
        dataType: 'SimpleObject',
        propertyConstraint: {
          props: ['TY']
        }
      }
    },
    '@ris/new+record': {
      parse: _ris.parseNew,
      parseType: {
        extends: '@ris/record',
        propertyConstraint: [{
          props: newProps,
          match: 'some'
        }, {
          props: oldProps,
          match: 'none'
        }]
      }
    },
    '@ris/old+record': {
      parse: _ris.parseOld,
      parseType: {
        extends: '@ris/record',
        propertyConstraint: [{
          props: oldProps,
          match: 'some'
        }, {
          props: newProps,
          match: 'none'
        }]
      }
    }
  },
  output: {
    ris: _ris.format
  }
});
},{"./ris.js":90,"@citation-js/core":"citation-js"}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.parse = parse;
exports.parseMixed = parseMixed;
exports.parseNew = parseNew;
exports.parseOld = parseOld;
var _core = require("@citation-js/core");
var _index = require("./spec/index.js");
var _converters = _interopRequireDefault(require("./converters.js"));
var _dataTypes = _interopRequireDefault(require("./dataTypes.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const LINE_MATCH = /^[A-Z][A-Z0-9] {2}-( |$)/;
const LINE_SPLIT = / {2}-(?: |$)/;
const TRANSLATORS = new Map();
function prepareTranslator(spec) {
  if (!TRANSLATORS.has(spec)) {
    for (const mapping of spec) {
      if (mapping.target === 'issued' && !Array.isArray(mapping.source)) {
        mapping.convert = _converters.default.YEAR;
        continue;
      }
      if (mapping.target in _dataTypes.default) {
        mapping.convert = _converters.default[_dataTypes.default[mapping.target]];
      }
      if (mapping.convert && mapping.convert.keepAll === true) {
        continue;
      }
      if (Array.isArray(mapping.source)) {
        if (mapping.convert) {
          const {
            toSource,
            toTarget
          } = mapping.convert;
          mapping.convert = {
            toTarget(...args) {
              return toTarget(_converters.default.ANY.toTarget(...args));
            },
            toSource(...args) {
              return _converters.default.ANY.toSource(toSource(...args));
            }
          };
        } else {
          mapping.convert = _converters.default.ANY;
        }
      }
    }
    TRANSLATORS.set(spec, new _core.util.Translator(spec));
  }
  return TRANSLATORS.get(spec);
}
function parseType(type) {
  type = type.toUpperCase();
  if (type === 'JOURN') {
    return 'JOUR';
  }
  return type;
}
function parse(text) {
  const entries = [];
  let lastEntry;
  let lastTag;
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!LINE_MATCH.test(line)) {
      if (lastEntry && lastTag) {
        lastEntry[lastTag] += ' ' + line;
      }
      continue;
    }
    let [tag, value] = line.split(LINE_SPLIT);
    if (value.trim() === '') {
      lastTag = undefined;
      continue;
    }
    switch (tag) {
      case 'ER':
        lastEntry = undefined;
        lastTag = undefined;
        break;
      case 'TY':
        lastEntry = {};
        entries.push(lastEntry);
        value = parseType(value);
      default:
        if (Array.isArray(lastEntry[tag])) {
          lastEntry[tag].push(value);
        } else {
          lastEntry[tag] = lastEntry[tag] ? [lastEntry[tag], value] : value;
        }
        lastTag = tag;
    }
  }
  return entries;
}
function parseOld(data) {
  return prepareTranslator(_index.SPECS.old).convertToTarget(data);
}
function parseNew(data) {
  return prepareTranslator(_index.SPECS.new).convertToTarget(data);
}
function parseMixed(data) {
  return prepareTranslator(_index.SPECS.mixed).convertToTarget(data);
}
function format(data, {
  type,
  format = type || 'text',
  spec = 'mixed'
} = {}) {
  if (!_index.SPECS[spec]) {
    throw new TypeError(`Invalid RIS specification ("${spec}")`);
  }
  const translate = prepareTranslator(_index.SPECS[spec]).convertToSource;
  const entries = data.map(entry => translate(entry.type ? entry : _objectSpread(_objectSpread({}, entry), {}, {
    type: 'document'
  })));
  if (format === 'object') {
    return entries;
  }
  return entries.map(entry => {
    const tags = [];
    for (const tag in entry) {
      if (tag === 'TY') {
        continue;
      }
      tags.push(...[].concat(entry[tag]).map(value => `${tag}  - ${value.toString().replace(/(.{70})/g, '$1\n')}`));
    }
    tags.unshift(`TY  - ${entry.TY}`);
    tags.push('ER  - ');
    return tags.join('\n');
  }).join('\n');
}
},{"./converters.js":87,"./dataTypes.json":88,"./spec/index.js":92,"@citation-js/core":"citation-js"}],91:[function(require,module,exports){
module.exports=[
  {
    "source": [
      "T1",
      "BT"
    ],
    "target": "title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ],
        "TI": false
      },
      "target": false
    }
  },
  {
    "source": "A1",
    "target": "author",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BLOG",
          "BOOK",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MULTI",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNPB",
          "VIDEO"
        ],
        "AU": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "CONF"
        ],
        "C2": false,
        "DA": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ],
        "C2": false,
        "DA": false,
        "PY": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "EBOOK"
        ],
        "C5": false,
        "PY": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHART",
          "CPAPER",
          "CTLG",
          "DATA",
          "EDBOOK",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MUSIC",
          "PAMP",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ],
        "DA": false,
        "PY": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "STAT"
        ],
        "DA": false,
        "PY": false,
        "Y2": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "AGGR",
          "DBASE"
        ],
        "ET": false,
        "PY": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "CHAP",
          "CLSWK",
          "COMP",
          "DICT",
          "ECHAP",
          "GOVDOC",
          "MULTI",
          "NEWS"
        ],
        "PY": false
      },
      "target": false
    }
  },
  {
    "source": "Y1",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "EJOUR"
        ],
        "PY": false,
        "SE": false
      },
      "target": false
    }
  },
  {
    "source": [
      "JO",
      "JF",
      "J1"
    ],
    "target": "container-title",
    "when": {
      "source": {
        "TY": [
          "CONF"
        ],
        "C3": false
      },
      "target": false
    }
  },
  {
    "source": [
      "JO",
      "JF",
      "J1"
    ],
    "target": "container-title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ANCIENT",
          "BILL",
          "BLOG",
          "CHAP",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ENCYC",
          "GEN",
          "INPR",
          "JFULL",
          "JOUR",
          "MGZN",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "SER",
          "STAT",
          "THES",
          "UNBILL"
        ],
        "T2": false
      },
      "target": false
    }
  },
  {
    "source": "JA",
    "target": "container-title-short",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ANCIENT",
          "BOOK",
          "CHAP",
          "CTLG",
          "DATA",
          "DICT",
          "ENCYC",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MGZN",
          "PAMP",
          "PCOMM",
          "SER",
          "STAND",
          "STAT",
          "UNPB"
        ],
        "J2": false
      },
      "target": false
    }
  },
  {
    "source": "N2",
    "target": "abstract",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ],
        "AB": false
      },
      "target": false
    }
  },
  {
    "source": [
      "SP",
      "EP"
    ],
    "target": "page",
    "when": {
      "source": {
        "TY": [
          "BOOK"
        ],
        "SE": false
      },
      "target": false
    }
  },
  {
    "source": [
      "SP",
      "EP"
    ],
    "target": "page",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "AGGR",
          "ANCIENT",
          "BILL",
          "CHAP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DBASE",
          "DICT",
          "ECHAP",
          "EJOUR",
          "ENCYC",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MGZN",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "STAND",
          "STAT",
          "UNBILL",
          "UNPB"
        ],
        "EP": true
      },
      "target": false
    }
  },
  {
    "source": "AV",
    "target": "archive_location",
    "when": {
      "target": false
    }
  },
  {
    "source": "LK",
    "target": "URL",
    "when": {
      "source": {
        "TY": [
          "HEAR"
        ],
        "L4": false,
        "UR": false
      },
      "target": false
    }
  },
  {
    "source": "LK",
    "target": "URL",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ],
        "UR": false
      },
      "target": false
    }
  },
  {
    "source": "IS",
    "target": "issue",
    "when": {
      "source": {
        "TY": "MGZN",
        "M1": false
      },
      "target": false
    }
  }
]

},{}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPECS = void 0;
Object.defineProperty(exports, "TYPES", {
  enumerable: true,
  get: function () {
    return _types.default;
  }
});
var _types = _interopRequireDefault(require("./types.json"));
var _new = _interopRequireDefault(require("./new.json"));
var _old = _interopRequireDefault(require("./old.js"));
var _mixed = _interopRequireDefault(require("./mixed.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const SPECS = exports.SPECS = {
  new: _new.default,
  old: _old.default,
  mixed: _mixed.default
};
},{"./mixed.js":93,"./new.json":94,"./old.js":95,"./types.json":96}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _new = _interopRequireDefault(require("./new.json"));
var _additions = _interopRequireDefault(require("./additions.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = _new.default.concat(_additions.default);
},{"./additions.json":91,"./new.json":94}],94:[function(require,module,exports){
module.exports=[
  {
    "source": "A2",
    "target": "editor",
    "when": {
      "source": {
        "TY": [
          "ANCIENT",
          "BLOG",
          "CHAP",
          "CONF",
          "CPAPER",
          "DICT",
          "EBOOK",
          "ECHAP",
          "ENCYC",
          "MUSIC",
          "SER"
        ]
      },
      "target": {
        "type": [
          "chapter",
          "entry-dictionary",
          "entry-encyclopedia",
          "musical_score",
          "paper-conference",
          "periodical",
          "post-weblog"
        ]
      }
    }
  },
  {
    "source": "A2",
    "target": "performer",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "SLIDE",
          "SOUND",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "song",
          "speech"
        ]
      }
    }
  },
  {
    "source": "A2",
    "target": "collection-editor",
    "when": {
      "source": {
        "TY": [
          "BOOK",
          "CLSWK",
          "COMP",
          "EDBOOK",
          "ELEC",
          "MAP",
          "MULTI",
          "RPRT",
          "UNPB"
        ]
      },
      "target": {
        "type": [
          "book",
          "classic",
          "map",
          "report",
          "review-book",
          "software",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "A2",
    "target": "reporter",
    "when": {
      "source": {
        "TY": [
          "CASE"
        ]
      },
      "target": {
        "type": [
          "legal_case"
        ]
      }
    }
  },
  {
    "source": "A2",
    "target": "producer",
    "when": {
      "source": {
        "TY": [
          "DATA"
        ]
      },
      "target": {
        "type": [
          "dataset"
        ]
      }
    }
  },
  {
    "source": "A2",
    "target": "recipient",
    "when": {
      "source": {
        "TY": [
          "ICOMM",
          "PCOMM"
        ]
      },
      "target": {
        "type": [
          "personal_communication",
          "post"
        ]
      }
    }
  },
  {
    "source": "A3",
    "target": "collection-editor",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "CHAP",
          "CONF",
          "EBOOK",
          "MUSIC",
          "SER",
          "SLIDE",
          "SOUND",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "chapter",
          "musical_score",
          "paper-conference",
          "periodical",
          "song",
          "speech"
        ]
      }
    }
  },
  {
    "source": "A3",
    "target": "illustrator",
    "when": {
      "source": {
        "TY": [
          "BLOG"
        ]
      },
      "target": {
        "type": [
          "post-weblog"
        ]
      }
    }
  },
  {
    "source": "A3",
    "target": "editor",
    "when": {
      "source": {
        "TY": [
          "BOOK"
        ]
      },
      "target": {
        "type": [
          "book",
          "review-book"
        ]
      }
    }
  },
  {
    "source": "A3",
    "target": "producer",
    "when": {
      "source": {
        "TY": [
          "MPCT"
        ]
      },
      "target": {
        "type": [
          "broadcast",
          "motion_picture"
        ]
      }
    }
  },
  {
    "source": "A4",
    "target": "translator",
    "when": {
      "source": {
        "TY": [
          "ANCIENT",
          "BOOK",
          "CHAP",
          "CLSWK",
          "CTLG",
          "DICT",
          "EDBOOK",
          "ENCYC",
          "GRANT",
          "PAMP"
        ]
      },
      "target": {
        "type": [
          "book",
          "chapter",
          "classic",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "pamphlet",
          "review-book"
        ]
      }
    }
  },
  {
    "source": "A4",
    "target": "performer",
    "when": {
      "source": {
        "TY": [
          "MPCT"
        ]
      },
      "target": {
        "type": [
          "broadcast",
          "motion_picture"
        ]
      }
    }
  },
  {
    "source": "A4",
    "target": "producer",
    "when": {
      "source": {
        "TY": [
          "MUSIC"
        ]
      },
      "target": {
        "type": [
          "musical_score"
        ]
      }
    }
  },
  {
    "source": "AB",
    "target": "abstract",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "AU",
    "target": "author",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BLOG",
          "BOOK",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MULTI",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "book",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "interview",
          "legislation",
          "manuscript",
          "map",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "AU",
    "target": "editor",
    "when": {
      "source": {
        "TY": [
          "EDBOOK"
        ]
      },
      "target": false
    }
  },
  {
    "source": "AU",
    "target": "director",
    "when": {
      "source": {
        "TY": [
          "MPCT"
        ]
      },
      "target": {
        "type": [
          "broadcast",
          "motion_picture"
        ]
      }
    }
  },
  {
    "source": "AU",
    "target": "composer",
    "when": {
      "source": {
        "TY": [
          "MUSIC"
        ]
      },
      "target": {
        "type": [
          "musical_score"
        ]
      }
    }
  },
  {
    "source": "AU",
    "target": "reporter",
    "when": {
      "source": {
        "TY": [
          "NEWS"
        ]
      },
      "target": {
        "type": [
          "article-newspaper"
        ]
      }
    }
  },
  {
    "source": "C1",
    "target": "section",
    "when": {
      "source": {
        "TY": [
          "CHAP",
          "ECHAP",
          "SER"
        ]
      },
      "target": {
        "type": [
          "chapter",
          "periodical"
        ]
      }
    }
  },
  {
    "source": "C1",
    "target": "publisher-place",
    "when": {
      "source": {
        "TY": [
          "CONF",
          "CPAPER"
        ]
      },
      "target": {
        "type": [
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": "C1",
    "target": "scale",
    "when": {
      "source": {
        "TY": [
          "MAP"
        ]
      },
      "target": {
        "type": [
          "map"
        ]
      }
    }
  },
  {
    "source": "C2",
    "target": "PMCID",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "INPR",
          "JFULL",
          "JOUR"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "review"
        ]
      }
    }
  },
  {
    "source": "C2",
    "target": "issue",
    "when": {
      "source": {
        "TY": [
          "NEWS"
        ]
      },
      "target": {
        "type": [
          "article-newspaper"
        ]
      }
    }
  },
  {
    "source": "C2",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "SER"
        ]
      },
      "target": {
        "type": [
          "periodical"
        ]
      }
    }
  },
  {
    "source": "C3",
    "target": "dimensions",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "MAP",
          "SLIDE",
          "SOUND",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "map",
          "song",
          "speech"
        ]
      }
    }
  },
  {
    "source": "C3",
    "target": "container-title",
    "when": {
      "source": {
        "TY": [
          "CONF"
        ]
      },
      "target": {
        "type": [
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": "C3",
    "target": "PMCID",
    "when": {
      "source": {
        "TY": [
          "EJOUR"
        ]
      },
      "target": false
    }
  },
  {
    "source": "C3",
    "target": "jurisdiction",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ]
      },
      "target": {
        "type": [
          "patent"
        ]
      }
    }
  },
  {
    "source": [
      "C3",
      "M1"
    ],
    "target": "dimensions",
    "when": {
      "source": {
        "TY": [
          "ART"
        ]
      },
      "target": {
        "type": [
          "graphic"
        ]
      }
    }
  },
  {
    "source": "C5",
    "target": "volume-title",
    "when": {
      "source": {
        "TY": [
          "EJOUR"
        ]
      },
      "target": false
    }
  },
  {
    "source": "C5",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "GRANT"
        ]
      },
      "target": false
    }
  },
  {
    "source": "C5",
    "target": "dimensions",
    "when": {
      "source": {
        "TY": [
          "MULTI"
        ]
      },
      "target": false
    }
  },
  {
    "source": "C5",
    "target": "references",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ]
      },
      "target": {
        "type": [
          "patent"
        ]
      }
    }
  },
  {
    "source": [
      "C5",
      "PY"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "EBOOK"
        ]
      },
      "target": false
    }
  },
  {
    "source": "C6",
    "target": "status",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ]
      },
      "target": {
        "type": [
          "patent"
        ]
      }
    }
  },
  {
    "source": "C6",
    "target": "issue",
    "when": {
      "source": {
        "TY": [
          "RPRT"
        ]
      },
      "target": {
        "type": [
          "report"
        ]
      }
    }
  },
  {
    "source": "C6",
    "target": "volume",
    "when": {
      "source": {
        "TY": [
          "STAT"
        ]
      },
      "target": false
    }
  },
  {
    "source": "C7",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "INPR",
          "JFULL",
          "JOUR"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "review"
        ]
      }
    }
  },
  {
    "source": "C7",
    "target": "PMCID",
    "when": {
      "source": {
        "TY": [
          "EBOOK",
          "ECHAP"
        ]
      },
      "target": false
    }
  },
  {
    "source": [
      "C7",
      "NV"
    ],
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "EJOUR"
        ]
      },
      "target": false
    }
  },
  {
    "source": "CN",
    "target": "call-number",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CTLG",
          "DATA",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "CY",
    "target": "publisher-place",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BLOG",
          "BOOK",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "HEAR",
          "ICOMM",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article-magazine",
          "article-newspaper",
          "book",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legislation",
          "manuscript",
          "map",
          "musical_score",
          "pamphlet",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "CY",
    "target": "event-place",
    "when": {
      "source": {
        "TY": [
          "CONF",
          "CPAPER"
        ]
      },
      "target": {
        "type": [
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": "DA",
    "target": "accessed",
    "when": {
      "source": {
        "TY": [
          "AGGR",
          "DBASE",
          "EBOOK",
          "EJOUR",
          "MULTI"
        ]
      },
      "target": false
    }
  },
  {
    "source": [
      "DA",
      "C2"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "CONF"
        ]
      },
      "target": {
        "type": [
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": [
      "DA",
      "PY",
      "C2"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ]
      },
      "target": {
        "type": [
          "patent"
        ]
      }
    }
  },
  {
    "source": [
      "DA",
      "PY"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHART",
          "CPAPER",
          "CTLG",
          "DATA",
          "EDBOOK",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MUSIC",
          "PAMP",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "bill",
          "book",
          "broadcast",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": [
      "DA",
      "PY",
      "Y2"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "STAT"
        ]
      },
      "target": false
    }
  },
  {
    "source": [
      "DA",
      "Y2"
    ],
    "target": "accessed",
    "when": {
      "source": {
        "TY": [
          "ECHAP"
        ]
      },
      "target": false
    }
  },
  {
    "source": "DB",
    "target": "source",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "DO",
    "target": "DOI",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "ET",
    "target": "edition",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "ANCIENT",
          "ART",
          "BLOG",
          "BOOK",
          "CHAP",
          "CLSWK",
          "CONF",
          "CTLG",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "GEN",
          "GOVDOC",
          "LEGAL",
          "MAP",
          "MGZN",
          "MPCT",
          "MUSIC",
          "NEWS",
          "PAMP",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article-magazine",
          "article-newspaper",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "graphic",
          "interview",
          "legislation",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "performance",
          "periodical",
          "post-weblog",
          "regulation",
          "report",
          "review-book",
          "song",
          "speech",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "ET",
    "target": "version",
    "when": {
      "source": {
        "TY": [
          "CHART",
          "COMP",
          "DATA",
          "EQUA",
          "FIGURE"
        ]
      },
      "target": {
        "type": [
          "dataset",
          "figure",
          "software"
        ]
      }
    }
  },
  {
    "source": "ET",
    "target": "available-date",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "INPR",
          "JFULL",
          "JOUR"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "review"
        ]
      }
    }
  },
  {
    "source": "ET",
    "target": "medium",
    "when": {
      "source": {
        "TY": [
          "MANSCPT"
        ]
      },
      "target": {
        "type": [
          "manuscript"
        ]
      }
    }
  },
  {
    "source": [
      "ET",
      "PY"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "AGGR",
          "DBASE"
        ]
      },
      "target": false
    }
  },
  {
    "source": "ID",
    "target": "id"
  },
  {
    "source": "IS",
    "target": "number-of-volumes",
    "when": {
      "source": {
        "TY": [
          "CHAP"
        ]
      },
      "target": {
        "type": [
          "chapter"
        ]
      }
    }
  },
  {
    "source": "IS",
    "target": "issue",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "INPR",
          "JFULL",
          "JOUR"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "review"
        ]
      }
    }
  },
  {
    "source": "J2",
    "target": "container-title-short",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ANCIENT",
          "BOOK",
          "CHAP",
          "CTLG",
          "DATA",
          "DICT",
          "ENCYC",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MGZN",
          "PAMP",
          "PCOMM",
          "SER",
          "STAND",
          "STAT",
          "UNPB"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "book",
          "chapter",
          "dataset",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "legislation",
          "manuscript",
          "pamphlet",
          "periodical",
          "personal_communication",
          "post",
          "regulation",
          "review",
          "review-book",
          "standard"
        ]
      }
    }
  },
  {
    "source": "KW",
    "target": "keyword",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "LA",
    "target": "language",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "LB",
    "target": "citation-label",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "M1",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "AGGR",
          "ANCIENT",
          "BILL",
          "CHART",
          "DICT",
          "EQUA",
          "FIGURE",
          "GEN",
          "HEAR",
          "SLIDE",
          "SOUND",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "bill",
          "collection",
          "document",
          "entry-dictionary",
          "event",
          "figure",
          "hearing",
          "interview",
          "performance",
          "song",
          "speech",
          "thesis",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "M1",
    "target": "collection-number",
    "when": {
      "source": {
        "TY": [
          "BOOK",
          "CLSWK",
          "CTLG",
          "EDBOOK",
          "PAMP",
          "SER"
        ]
      },
      "target": {
        "type": [
          "book",
          "classic",
          "entry",
          "pamphlet",
          "periodical",
          "review-book"
        ]
      }
    }
  },
  {
    "source": "M1",
    "target": "issue",
    "when": {
      "source": {
        "TY": [
          "CONF",
          "EJOUR",
          "GOVDOC",
          "MGZN"
        ]
      },
      "target": {
        "type": [
          "article-magazine",
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": "M1",
    "target": "chapter-number",
    "when": {
      "source": {
        "TY": [
          "ECHAP"
        ]
      },
      "target": false
    }
  },
  {
    "source": "M1",
    "target": "status",
    "when": {
      "source": {
        "TY": [
          "GRANT"
        ]
      },
      "target": false
    }
  },
  {
    "source": "M1",
    "target": "page-first",
    "when": {
      "source": {
        "TY": [
          "LEGAL",
          "NEWS",
          "STAND"
        ]
      },
      "target": {
        "type": [
          "article-newspaper",
          "legislation",
          "regulation",
          "standard"
        ]
      }
    }
  },
  {
    "source": [
      "M1",
      "NV"
    ],
    "target": "number",
    "when": {
      "source": {
        "TY": "STAT"
      },
      "target": false
    }
  },
  {
    "source": [
      "NV",
      "M1"
    ],
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "ICOMM",
          "MANSCPT",
          "PCOMM"
        ]
      },
      "target": {
        "type": [
          "manuscript",
          "personal_communication",
          "post"
        ]
      }
    }
  },
  {
    "source": [
      "M1",
      "VL"
    ],
    "target": "accessed",
    "when": {
      "source": {
        "TY": [
          "ELEC"
        ]
      },
      "target": {
        "type": [
          "webpage"
        ]
      }
    }
  },
  {
    "source": "M2",
    "target": "page-first",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "INPR",
          "JFULL",
          "JOUR"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "review"
        ]
      }
    }
  },
  {
    "source": "M2",
    "target": "number-of-pages",
    "when": {
      "source": {
        "TY": [
          "PAMP"
        ]
      },
      "target": {
        "type": [
          "pamphlet"
        ]
      }
    }
  },
  {
    "source": "M3",
    "target": "genre",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BOOK",
          "CHART",
          "CLSWK",
          "COMP",
          "CPAPER",
          "CTLG",
          "DBASE",
          "DICT",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "EQUA",
          "FIGURE",
          "GEN",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MULTI",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "book",
          "classic",
          "collection",
          "document",
          "entry",
          "entry-dictionary",
          "event",
          "figure",
          "graphic",
          "interview",
          "legislation",
          "manuscript",
          "map",
          "pamphlet",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "M3",
    "target": "medium",
    "when": {
      "source": {
        "TY": [
          "BLOG",
          "EBOOK",
          "ELEC",
          "MPCT",
          "MUSIC"
        ]
      },
      "target": {
        "type": [
          "broadcast",
          "motion_picture",
          "musical_score",
          "post-weblog",
          "webpage"
        ]
      }
    }
  },
  {
    "source": [
      "N1",
      "RN"
    ],
    "target": "note",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PCOMM",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": [
      "N1",
      "RN",
      "RP"
    ],
    "target": "note",
    "when": {
      "source": {
        "TY": [
          "PAT",
          "RPRT"
        ]
      },
      "target": {
        "type": [
          "patent",
          "report"
        ]
      }
    }
  },
  {
    "source": "NV",
    "target": "number-of-volumes",
    "when": {
      "source": {
        "TY": [
          "ANCIENT",
          "BOOK",
          "CLSWK",
          "CONF",
          "DICT",
          "ECHAP",
          "EDBOOK",
          "ENCYC",
          "GEN",
          "HEAR",
          "MUSIC",
          "SER"
        ]
      },
      "target": {
        "type": [
          "book",
          "classic",
          "collection",
          "document",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "hearing",
          "interview",
          "musical_score",
          "paper-conference",
          "performance",
          "periodical",
          "review-book",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "NV",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "CTLG",
          "DATA"
        ]
      },
      "target": {
        "type": [
          "dataset",
          "entry"
        ]
      }
    }
  },
  {
    "source": "NV",
    "target": "version",
    "when": {
      "source": {
        "TY": [
          "EBOOK"
        ]
      },
      "target": false
    }
  },
  {
    "source": "NV",
    "target": "dimensions",
    "when": {
      "source": {
        "TY": [
          "GRANT"
        ]
      },
      "target": false
    }
  },
  {
    "source": "NV",
    "target": "collection-number",
    "when": {
      "source": {
        "TY": [
          "RPRT"
        ]
      },
      "target": {
        "type": [
          "report"
        ]
      }
    }
  },
  {
    "source": "OP",
    "target": "original-title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "AGGR",
          "ANCIENT",
          "BOOK",
          "CHAP",
          "CLSWK",
          "CTLG",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "ENCYC",
          "GEN",
          "INPR",
          "JFULL",
          "JOUR",
          "MGZN",
          "MUSIC",
          "PAMP",
          "SER"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "book",
          "chapter",
          "classic",
          "collection",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "interview",
          "musical_score",
          "pamphlet",
          "performance",
          "periodical",
          "review",
          "review-book",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "OP",
    "target": "references",
    "when": {
      "source": {
        "TY": [
          "BILL",
          "CASE",
          "HEAR",
          "LEGAL",
          "STAT",
          "UNBILL"
        ]
      },
      "target": {
        "type": [
          "bill",
          "hearing",
          "legal_case",
          "legislation",
          "regulation"
        ]
      }
    }
  },
  {
    "source": "PB",
    "target": "publisher",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BLOG",
          "BOOK",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "LEGAL",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PCOMM",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article-magazine",
          "article-newspaper",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legislation",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "PB",
    "target": "authority",
    "when": {
      "source": {
        "TY": [
          "CASE"
        ]
      },
      "target": {
        "type": [
          "legal_case"
        ]
      }
    }
  },
  {
    "source": "PB",
    "target": "archive",
    "when": {
      "source": {
        "TY": [
          "MANSCPT"
        ]
      },
      "target": {
        "type": [
          "manuscript"
        ]
      }
    }
  },
  {
    "source": [
      "PB",
      "A3"
    ],
    "target": "publisher",
    "when": {
      "source": {
        "TY": [
          "RPRT"
        ]
      },
      "target": {
        "type": [
          "report"
        ]
      }
    }
  },
  {
    "source": [
      "PB",
      "C5"
    ],
    "target": "publisher",
    "when": {
      "source": {
        "TY": [
          "STAT"
        ]
      },
      "target": false
    }
  },
  {
    "source": "PY",
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "CHAP",
          "CLSWK",
          "COMP",
          "DICT",
          "ECHAP",
          "GOVDOC",
          "MULTI",
          "NEWS"
        ]
      },
      "target": {
        "type": [
          "article-newspaper",
          "chapter",
          "classic",
          "entry-dictionary",
          "software"
        ]
      }
    }
  },
  {
    "source": "PY",
    "target": "event-date",
    "when": {
      "source": {
        "TY": [
          "CONF"
        ]
      },
      "target": {
        "type": [
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": "RI",
    "target": "reviewed-title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ANCIENT",
          "CHAP",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EJOUR",
          "ENCYC",
          "GEN",
          "GRANT",
          "INPR",
          "JFULL",
          "JOUR",
          "MGZN",
          "NEWS",
          "SER"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "chapter",
          "collection",
          "document",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "interview",
          "performance",
          "periodical",
          "review",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "RI",
    "target": "locator",
    "when": {
      "source": {
        "TY": [
          "STAT"
        ]
      },
      "target": false
    }
  },
  {
    "source": "SE",
    "target": "section",
    "when": {
      "source": {
        "TY": [
          "BILL",
          "GEN",
          "GOVDOC",
          "MUSIC",
          "NEWS",
          "STAT",
          "UNBILL"
        ]
      },
      "target": {
        "type": [
          "article-newspaper",
          "bill",
          "collection",
          "document",
          "event",
          "interview",
          "musical_score",
          "performance",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "BLOG"
        ]
      },
      "target": {
        "type": [
          "post-weblog"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "chapter-number",
    "when": {
      "source": {
        "TY": [
          "CHAP",
          "SER"
        ]
      },
      "target": {
        "type": [
          "chapter",
          "periodical"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "page",
    "when": {
      "source": {
        "TY": [
          "BOOK"
        ]
      },
      "target": {
        "type": [
          "book",
          "review-book"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "submitted",
    "when": {
      "source": {
        "TY": [
          "CASE"
        ]
      },
      "target": {
        "type": [
          "legal_case"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "number-of-pages",
    "when": {
      "source": {
        "TY": [
          "CTLG"
        ]
      },
      "target": {
        "type": [
          "entry"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "original-date",
    "when": {
      "source": {
        "TY": [
          "DATA"
        ]
      },
      "target": {
        "type": [
          "dataset"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "version",
    "when": {
      "source": {
        "TY": [
          "DICT"
        ]
      },
      "target": {
        "type": [
          "entry-dictionary"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "locator",
    "when": {
      "source": {
        "TY": [
          "STAND"
        ]
      },
      "target": {
        "type": [
          "standard"
        ]
      }
    }
  },
  {
    "source": "SE",
    "target": "page-first",
    "when": {
      "source": {
        "TY": [
          "MANSCPT",
          "MGZN"
        ]
      },
      "target": {
        "type": [
          "article-magazine",
          "manuscript"
        ]
      }
    }
  },
  {
    "source": [
      "SE",
      "PY"
    ],
    "target": "issued",
    "when": {
      "source": {
        "TY": [
          "EJOUR"
        ]
      },
      "target": false
    }
  },
  {
    "source": [
      "SE",
      "T2"
    ],
    "target": "locator",
    "when": {
      "source": {
        "TY": [
          "LEGAL"
        ]
      },
      "target": {
        "type": [
          "legislation",
          "regulation"
        ]
      }
    }
  },
  {
    "source": "SN",
    "target": [
      "ISSN",
      "ISBN"
    ],
    "when": {
      "source": {
        "TY": [
          "AGGR",
          "CLSWK",
          "GEN"
        ]
      },
      "target": {
        "type": [
          "classic",
          "collection",
          "document",
          "event",
          "interview",
          "performance",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "SN",
    "target": "ISBN",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "ANCIENT",
          "BLOG",
          "BOOK",
          "CHAP",
          "COMP",
          "CONF",
          "CTLG",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "ELEC",
          "ENCYC",
          "HEAR",
          "MAP",
          "PAMP",
          "SER",
          "SLIDE",
          "SOUND",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "book",
          "chapter",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "hearing",
          "map",
          "pamphlet",
          "paper-conference",
          "periodical",
          "post-weblog",
          "review-book",
          "software",
          "song",
          "speech",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "SN",
    "target": "ISSN",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "DATA",
          "EJOUR",
          "INPR",
          "JFULL",
          "JOUR",
          "MGZN",
          "MUSIC",
          "NEWS"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "dataset",
          "musical_score",
          "review"
        ]
      }
    }
  },
  {
    "source": "SN",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "DBASE",
          "GOVDOC"
        ]
      },
      "target": false
    }
  },
  {
    "source": [
      "SN",
      "M1"
    ],
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "RPRT"
        ]
      },
      "target": {
        "type": [
          "report"
        ]
      }
    }
  },
  {
    "source": [
      "SN",
      "SE",
      "M1"
    ],
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ]
      },
      "target": {
        "type": [
          "patent"
        ]
      }
    }
  },
  {
    "source": [
      "SN",
      "T3"
    ],
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "LEGAL",
          "STAND"
        ]
      },
      "target": {
        "type": [
          "legislation",
          "regulation",
          "standard"
        ]
      }
    }
  },
  {
    "source": "SP",
    "target": "page",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "AGGR",
          "ANCIENT",
          "BILL",
          "CHAP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DBASE",
          "DICT",
          "ECHAP",
          "EJOUR",
          "ENCYC",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MGZN",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "STAND",
          "STAT",
          "UNBILL",
          "UNPB"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "chapter",
          "collection",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "hearing",
          "interview",
          "legislation",
          "manuscript",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "regulation",
          "report",
          "review",
          "standard",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "SP",
    "target": "number-of-pages",
    "when": {
      "source": {
        "TY": [
          "BOOK",
          "CLSWK",
          "EBOOK",
          "EDBOOK",
          "THES"
        ]
      },
      "target": {
        "type": [
          "book",
          "classic",
          "review-book",
          "thesis"
        ]
      }
    }
  },
  {
    "source": "SP",
    "target": "page-first",
    "when": {
      "source": {
        "TY": [
          "CASE"
        ]
      },
      "target": {
        "type": [
          "legal_case"
        ]
      }
    }
  },
  {
    "source": "SP",
    "target": "dimensions",
    "when": {
      "source": {
        "TY": [
          "MPCT"
        ]
      },
      "target": {
        "type": [
          "broadcast",
          "motion_picture"
        ]
      }
    }
  },
  {
    "source": "ST",
    "target": "title-short",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CLSWK",
          "COMP",
          "CONF",
          "CTLG",
          "DATA",
          "DICT",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "GEN",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "SV",
    "target": "collection-number",
    "when": {
      "source": {
        "TY": [
          "CHAP"
        ]
      },
      "target": {
        "type": [
          "chapter"
        ]
      }
    }
  },
  {
    "source": "T2",
    "target": "collection-title",
    "when": {
      "source": {
        "TY": [
          "AGGR",
          "BOOK",
          "CLSWK",
          "COMP",
          "CTLG",
          "DBASE",
          "ELEC",
          "MANSCPT",
          "MAP",
          "MPCT",
          "MULTI",
          "RPRT",
          "UNPB"
        ]
      },
      "target": {
        "type": [
          "book",
          "broadcast",
          "classic",
          "entry",
          "manuscript",
          "map",
          "motion_picture",
          "report",
          "review-book",
          "software",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "T2",
    "target": "container-title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ANCIENT",
          "BILL",
          "BLOG",
          "CHAP",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ENCYC",
          "GEN",
          "INPR",
          "JFULL",
          "JOUR",
          "MGZN",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "SER",
          "STAT",
          "THES",
          "UNBILL"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "chapter",
          "collection",
          "document",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "interview",
          "musical_score",
          "pamphlet",
          "patent",
          "performance",
          "periodical",
          "post-weblog",
          "review",
          "thesis",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "T2",
    "target": "event",
    "when": {
      "source": {
        "TY": [
          "CONF",
          "CPAPER"
        ]
      },
      "target": {
        "type": [
          "paper-conference"
        ]
      }
    }
  },
  {
    "source": "T2",
    "target": "committee",
    "when": {
      "source": {
        "TY": [
          "HEAR"
        ]
      },
      "target": {
        "type": [
          "hearing"
        ]
      }
    }
  },
  {
    "source": "T2",
    "target": "section",
    "when": {
      "source": {
        "TY": [
          "STAND"
        ]
      },
      "target": {
        "type": [
          "standard"
        ]
      }
    }
  },
  {
    "source": "T3",
    "target": "collection-title",
    "when": {
      "source": {
        "TY": [
          "ADVS",
          "ANCIENT",
          "CHAP",
          "CONF",
          "DATA",
          "EBOOK",
          "ECHAP",
          "EJOUR",
          "GEN",
          "GOVDOC",
          "MUSIC",
          "SER",
          "SLIDE",
          "SOUND",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "chapter",
          "collection",
          "dataset",
          "document",
          "event",
          "interview",
          "musical_score",
          "paper-conference",
          "performance",
          "periodical",
          "song",
          "speech",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "TI",
    "target": "title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": "TY",
    "target": "type"
  },
  {
    "source": "UR",
    "target": "URL",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "post-weblog",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty",
          "webpage"
        ]
      }
    }
  },
  {
    "source": [
      "UR",
      "L4"
    ],
    "target": "URL",
    "when": {
      "source": {
        "TY": [
          "HEAR"
        ]
      },
      "target": {
        "type": [
          "hearing"
        ]
      }
    }
  },
  {
    "source": "VL",
    "target": "volume",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "BILL",
          "BOOK",
          "CASE",
          "CHAP",
          "CLSWK",
          "CONF",
          "CPAPER",
          "CTLG",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ENCYC",
          "GEN",
          "GOVDOC",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MGZN",
          "MUSIC",
          "NEWS",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "UNBILL",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "chapter",
          "classic",
          "collection",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "musical_score",
          "paper-conference",
          "performance",
          "periodical",
          "regulation",
          "report",
          "review",
          "review-book",
          "song",
          "speech",
          "standard",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "VL",
    "target": "dimensions",
    "when": {
      "source": {
        "TY": [
          "CHART",
          "EQUA",
          "FIGURE"
        ]
      },
      "target": {
        "type": [
          "figure"
        ]
      }
    }
  },
  {
    "source": "VL",
    "target": "edition",
    "when": {
      "source": {
        "TY": [
          "COMP"
        ]
      },
      "target": {
        "type": [
          "software"
        ]
      }
    }
  },
  {
    "source": "VL",
    "target": "number",
    "when": {
      "source": {
        "TY": [
          "PAMP"
        ]
      },
      "target": {
        "type": [
          "pamphlet"
        ]
      }
    }
  },
  {
    "source": "VL",
    "target": "version",
    "when": {
      "source": {
        "TY": [
          "PAT"
        ]
      },
      "target": {
        "type": [
          "patent"
        ]
      }
    }
  },
  {
    "source": [
      "VL",
      "Y2"
    ],
    "target": "accessed",
    "when": {
      "source": {
        "TY": [
          "BLOG"
        ]
      },
      "target": {
        "type": [
          "post-weblog"
        ]
      }
    }
  },
  {
    "source": "Y2",
    "target": "accessed",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "ANCIENT",
          "ART",
          "BILL",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DICT",
          "EDBOOK",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "type": [
          "article",
          "article-journal",
          "article-magazine",
          "article-newspaper",
          "bill",
          "book",
          "broadcast",
          "chapter",
          "classic",
          "collection",
          "dataset",
          "document",
          "entry",
          "entry-dictionary",
          "entry-encyclopedia",
          "event",
          "figure",
          "graphic",
          "hearing",
          "interview",
          "legal_case",
          "legislation",
          "manuscript",
          "map",
          "motion_picture",
          "musical_score",
          "pamphlet",
          "paper-conference",
          "patent",
          "performance",
          "periodical",
          "personal_communication",
          "post",
          "regulation",
          "report",
          "review",
          "review-book",
          "software",
          "song",
          "speech",
          "standard",
          "thesis",
          "treaty"
        ]
      }
    }
  },
  {
    "source": "C4",
    "target": "author",
    "when": {
      "source": {
        "TY": [
          "BOOK",
          "CHAP",
          "EBOOK",
          "ECHAP",
          "EJOUR"
        ]
      },
      "target": {
        "reviewed-author": true,
        "type": [
          "book",
          "chapter",
          "review-book",
          "review"
        ]
      }
    }
  },
  {
    "source": "AU",
    "target": "reviewed-author",
    "when": {
      "source": {
        "C4": true,
        "TY": [
          "BOOK",
          "CHAP",
          "EBOOK",
          "ECHAP",
          "EJOUR"
        ]
      },
      "target": {
        "type": [
          "book",
          "chapter",
          "review-book",
          "review"
        ]
      }
    }
  },
  {
    "source": "TA",
    "target": "author",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "original-author": true,
        "translator": true
      }
    }
  },
  {
    "source": "AU",
    "target": "original-author",
    "when": {
      "source": {
        "TA": true,
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "translator": true
      }
    }
  },
  {
    "source": "TT",
    "target": "title",
    "when": {
      "source": {
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "original-author": true,
        "translator": true
      }
    }
  },
  {
    "source": "TI",
    "target": "original-title",
    "when": {
      "source": {
        "TT": true,
        "TY": [
          "ABST",
          "ADVS",
          "AGGR",
          "ANCIENT",
          "ART",
          "BILL",
          "BLOG",
          "BOOK",
          "CASE",
          "CHAP",
          "CHART",
          "CLSWK",
          "COMP",
          "CONF",
          "CPAPER",
          "CTLG",
          "DATA",
          "DBASE",
          "DICT",
          "EBOOK",
          "ECHAP",
          "EDBOOK",
          "EJOUR",
          "ELEC",
          "ENCYC",
          "EQUA",
          "FIGURE",
          "GEN",
          "GOVDOC",
          "GRANT",
          "HEAR",
          "ICOMM",
          "INPR",
          "JFULL",
          "JOUR",
          "LEGAL",
          "MANSCPT",
          "MAP",
          "MGZN",
          "MPCT",
          "MULTI",
          "MUSIC",
          "NEWS",
          "PAMP",
          "PAT",
          "PCOMM",
          "RPRT",
          "SER",
          "SLIDE",
          "SOUND",
          "STAND",
          "STAT",
          "THES",
          "UNBILL",
          "UNPB",
          "VIDEO"
        ]
      },
      "target": {
        "translator": true
      }
    }
  }
]

},{}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _converters = _interopRequireDefault(require("../converters.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = [{
  source: 'TY',
  target: 'type'
}, {
  source: 'ID',
  target: 'id'
}, {
  source: ['T1', 'TI', 'CT'],
  target: 'title'
}, {
  source: 'BT',
  target: 'title',
  when: {
    source: {
      type: ['BOOK', 'UNPB'],
      T1: false,
      TI: false,
      CT: false
    },
    target: false
  }
}, {
  source: 'T2',
  target: 'container-title',
  when: {
    target: {
      type: ['bill', 'book', 'broadcast', 'chapter', 'dataset', 'entry', 'entry-dictionary', 'entry-encyclopedia', 'figure', 'graphic', 'interview', 'legal_case', 'legislation', 'manuscript', 'map', 'motion_picture', 'musical_score', 'pamphlet', 'paper-conference', 'patent', 'personal_communication', 'post', 'post-weblog', 'report', 'review', 'review-book', 'song', 'speech', 'thesis', 'treaty', 'webpage']
    }
  }
}, {
  source: 'BT',
  target: 'container-title',
  when: {
    source: {
      type: ['ABST', 'ADVS', 'ART', 'BILL', 'CASE', 'CHAP', 'COMP', 'CONF', 'CTLG', 'DATA', 'ELEC', 'GEN', 'HEAR', 'ICOMM', 'INPR', 'JFULL', 'JOUR', 'MAP', 'MGZN', 'MPCT', 'MUSIC', 'NEWS', 'PAMP', 'PAT', 'PCOMM', 'RPRT', 'SER', 'SLIDE', 'SOUND', 'STAT', 'THES', 'UNBILL', 'VIDEO'],
      T2: false
    },
    target: false
  }
}, {
  source: 'T3',
  target: 'collection-title'
}, {
  source: ['A1', 'AU'],
  target: 'author'
}, {
  source: ['A2', 'ED'],
  target: 'editor'
}, {
  source: 'A3',
  target: 'collection-editor'
}, {
  source: ['Y1', 'PY'],
  target: 'issued'
}, {
  source: 'Y2',
  target: 'event-date',
  convert: _converters.default.DATE,
  when: {
    source: {
      type: ['CONF', 'CPAPER']
    },
    target: {
      type: ['paper-conference']
    }
  }
}, {
  source: 'Y2',
  target: 'submitted',
  convert: _converters.default.DATE,
  when: {
    source: {
      type: ['PAT']
    },
    target: {
      type: 'patent'
    }
  }
}, {
  source: ['AB', 'N1'],
  target: 'note'
}, {
  source: 'N2',
  target: 'abstract'
}, {
  source: 'KW',
  target: 'keyword'
}, {
  source: ['JF', 'JO'],
  target: 'container-title',
  convert: _converters.default.ANY,
  when: {
    target: {
      type: ['article', 'article-journal', 'article-magazine', 'article-newspaper']
    }
  }
}, {
  source: ['JA', 'J1', 'J2'],
  target: 'container-title-short'
}, {
  source: 'VL',
  target: 'volume'
}, {
  source: ['IS', 'CP'],
  target: 'issue'
}, {
  source: 'SP',
  target: 'page-first'
}, {
  source: ['SP', 'EP'],
  target: 'page',
  convert: _converters.default.PAGE,
  when: {
    source: {
      SP: true,
      EP: true
    }
  }
}, {
  source: 'CY',
  target: 'publisher-place'
}, {
  source: 'PB',
  target: 'publisher'
}, {
  source: 'SN',
  target: ['ISSN', 'ISBN']
}, {
  source: 'AV',
  target: 'archive_location'
}, {
  source: 'UR',
  target: 'URL'
}];
},{"../converters.js":87}],96:[function(require,module,exports){
module.exports={
  "RIS": {
    "ABST": "article-journal",
    "ADVS": "motion_picture",
    "AGGR": "dataset",
    "ANCIENT": "classic",
    "ART": "graphic",
    "BILL": "bill",
    "BLOG": "post-weblog",
    "BOOK": "book",
    "CASE": "legal_case",
    "CHAP": "chapter",
    "CHART": "figure",
    "CLSWK": "classic",
    "COMP": "software",
    "CONF": "paper-conference",
    "CPAPER": "paper-conference",
    "CTLG": "entry",
    "DATA": "dataset",
    "DBASE": "dataset",
    "DICT": "entry-dictionary",
    "EBOOK": "book",
    "ECHAP": "chapter",
    "EDBOOK": "book",
    "EJOUR": "article-journal",
    "ELEC": "webpage",
    "ENCYC": "entry-encyclopedia",
    "EQUA": "article",
    "FIGURE": "figure",
    "GEN": "document",
    "GOVDOC": "report",
    "GRANT": "article",
    "HEAR": "hearing",
    "ICOMM": "personal_communication",
    "INPR": "article-journal",
    "JFULL": "article-journal",
    "JOUR": "article-journal",
    "LEGAL": "legislation",
    "MANSCPT": "manuscript",
    "MAP": "map",
    "MGZN": "article-magazine",
    "MPCT": "broadcast",
    "MULTI": "motion_picture",
    "MUSIC": "musical_score",
    "NEWS": "article-newspaper",
    "PAMP": "pamphlet",
    "PAT": "patent",
    "PCOMM": "personal_communication",
    "RPRT": "report",
    "SER": "periodical",
    "SLIDE": "motion_picture",
    "SOUND": "motion_picture",
    "STAND": "standard",
    "STAT": "legislation",
    "THES": "thesis",
    "UNBILL": "manuscript",
    "UNPB": "manuscript",
    "VIDEO": "motion_picture",
    "WEB": "webpage"
  },
  "CSL": {
    "article-journal": "JOUR",
    "article-magazine": "MGZN",
    "article-newspaper": "NEWS",
    "article": "JOUR",
    "bill": "BILL",
    "book": "BOOK",
    "broadcast": "MPCT",
    "chapter": "CHAP",
    "classic": "CLSWK",
    "collection": "GEN",
    "dataset": "DATA",
    "document": "GEN",
    "entry": "CTLG",
    "entry-dictionary": "DICT",
    "entry-encyclopedia": "ENCYC",
    "event": "GEN",
    "figure": "FIGURE",
    "graphic": "ART",
    "hearing": "HEAR",
    "interview": "GEN",
    "legal_case": "CASE",
    "legislation": "LEGAL",
    "manuscript": "MANSCPT",
    "map": "MAP",
    "motion_picture": "MPCT",
    "musical_score": "MUSIC",
    "pamphlet": "PAMP",
    "paper-conference": "CONF",
    "patent": "PAT",
    "performance": "GEN",
    "periodical": "SER",
    "personal_communication": "PCOMM",
    "post-weblog": "BLOG",
    "post": "ICOMM",
    "regulation": "LEGAL",
    "report": "RPRT",
    "review-book": "BOOK",
    "review": "JOUR",
    "software": "COMP",
    "song": "SOUND",
    "speech": "SOUND",
    "standard": "STAND",
    "thesis": "THES",
    "treaty": "GEN",
    "webpage": "ELEC"
  }
}

},{}],97:[function(require,module,exports){
"use strict";

var yaml = _interopRequireWildcard(require("js-yaml"));
var _core = require("@citation-js/core");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const timestampTag = 'tag:yaml.org,2002:timestamp';
const timestamp = yaml.DUMP_SCHEMA.tags.find(tag => tag.tagName === timestampTag);
const dateTag = yaml.defineScalarTag(timestampTag, {
  implicit: true,
  resolve: timestamp.resolve,
  identify: timestamp.identify,
  represent(object) {
    return object.toISOString().split('T')[0];
  }
});
const CFF_SCHEMA = yaml.DUMP_SCHEMA.withTags(dateTag);
_core.plugins.add('@else', {
  input: {
    '@else/yaml': {
      parseType: {
        dataType: 'String',
        tokenList: {
          split: /\n(\s{2})*(-\s)?/,
          token: /^[\w-]*: /,
          every: false
        }
      },
      parse(file) {
        return yaml.load(file, {
          json: true
        });
      }
    }
  },
  output: {
    yaml(data) {
      return yaml.dump(data, {
        schema: CFF_SCHEMA
      });
    }
  }
});

},{"@citation-js/core":"citation-js","js-yaml":99}],98:[function(require,module,exports){

},{}],99:[function(require,module,exports){
"use strict";

/*! js-yaml 5.4.1 https://github.com/nodeca/js-yaml @license MIT */
Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
//#region src/tag.ts
/**
* Returned by a scalar resolver when the source does not match its tag.
*
* @category Tags
*/
var NOT_RESOLVED = Symbol("NOT_RESOLVED");
/**
* Create a normalized scalar tag definition.
*
* @category Tags
*/
function defineScalarTag(tagName, options) {
  var _options$implicit, _options$matchByTagPr, _options$implicitFirs, _options$represent, _options$representTag;
  return {
    tagName,
    nodeKind: "scalar",
    implicit: (_options$implicit = options.implicit) !== null && _options$implicit !== void 0 ? _options$implicit : false,
    matchByTagPrefix: (_options$matchByTagPr = options.matchByTagPrefix) !== null && _options$matchByTagPr !== void 0 ? _options$matchByTagPr : false,
    implicitFirstChars: (_options$implicitFirs = options.implicitFirstChars) !== null && _options$implicitFirs !== void 0 ? _options$implicitFirs : null,
    resolve: options.resolve,
    identify: options.identify,
    represent: (_options$represent = options.represent) !== null && _options$represent !== void 0 ? _options$represent : data => String(data),
    representTagName: (_options$representTag = options.representTagName) !== null && _options$representTag !== void 0 ? _options$representTag : () => tagName
  };
}
/**
* Create a normalized sequence tag definition.
*
* @category Tags
*/
function defineSequenceTag(tagName, options) {
  var _options$matchByTagPr2, _options$finalize, _options$represent2, _options$representTag2;
  const carrierIsResult = options.finalize === void 0;
  return {
    tagName,
    nodeKind: "sequence",
    implicit: false,
    matchByTagPrefix: (_options$matchByTagPr2 = options.matchByTagPrefix) !== null && _options$matchByTagPr2 !== void 0 ? _options$matchByTagPr2 : false,
    create: options.create,
    addItem: options.addItem,
    finalize: (_options$finalize = options.finalize) !== null && _options$finalize !== void 0 ? _options$finalize : carrier => carrier,
    carrierIsResult,
    identify: options.identify,
    represent: (_options$represent2 = options.represent) !== null && _options$represent2 !== void 0 ? _options$represent2 : data => data,
    representTagName: (_options$representTag2 = options.representTagName) !== null && _options$representTag2 !== void 0 ? _options$representTag2 : () => tagName
  };
}
/**
* Create a normalized mapping tag definition.
*
* @category Tags
*/
function defineMappingTag(tagName, options) {
  var _options$matchByTagPr3, _options$finalize2, _options$represent3, _options$representTag3;
  const carrierIsResult = options.finalize === void 0;
  return {
    tagName,
    nodeKind: "mapping",
    implicit: false,
    matchByTagPrefix: (_options$matchByTagPr3 = options.matchByTagPrefix) !== null && _options$matchByTagPr3 !== void 0 ? _options$matchByTagPr3 : false,
    create: options.create,
    addPair: options.addPair,
    has: options.has,
    keys: options.keys,
    get: options.get,
    finalize: (_options$finalize2 = options.finalize) !== null && _options$finalize2 !== void 0 ? _options$finalize2 : carrier => carrier,
    carrierIsResult,
    identify: options.identify,
    represent: (_options$represent3 = options.represent) !== null && _options$represent3 !== void 0 ? _options$represent3 : data => data,
    representTagName: (_options$representTag3 = options.representTagName) !== null && _options$representTag3 !== void 0 ? _options$representTag3 : () => tagName
  };
}
//#endregion
//#region src/tag/scalar/str.ts
/** @category Tags */
var strTag = defineScalarTag("tag:yaml.org,2002:str", {
  resolve: source => source,
  identify: data => typeof data === "string"
});
//#endregion
//#region src/tag/scalar/null_core.ts
var NULL_VALUES$1 = ["", "~", "null", "Null", "NULL"];
/** @category Tags */
var nullCoreTag = defineScalarTag("tag:yaml.org,2002:null", {
  implicit: true,
  implicitFirstChars: ["", "~", "n", "N"],
  resolve: source => {
    if (NULL_VALUES$1.indexOf(source) !== -1) return null;
    return NOT_RESOLVED;
  },
  identify: object => object === null,
  represent: () => "null"
});
//#endregion
//#region src/tag/scalar/null_json.ts
/** @category Tags */
var nullJsonTag = defineScalarTag("tag:yaml.org,2002:null", {
  implicit: true,
  implicitFirstChars: ["n"],
  resolve: (source, isExplicit) => {
    if (source === "null" || isExplicit && source === "") return null;
    return NOT_RESOLVED;
  },
  identify: object => object === null,
  represent: () => "null"
});
//#endregion
//#region src/tag/scalar/null_yaml11.ts
var NULL_VALUES = ["", "~", "null", "Null", "NULL"];
/** @category Tags */
var nullYaml11Tag = defineScalarTag("tag:yaml.org,2002:null", {
  implicit: true,
  implicitFirstChars: ["", "~", "n", "N"],
  resolve: source => {
    if (NULL_VALUES.indexOf(source) !== -1) return null;
    return NOT_RESOLVED;
  },
  identify: object => object === null,
  represent: () => "null"
});
//#endregion
//#region src/tag/scalar/bool_core.ts
var TRUE_VALUES$2 = ["true", "True", "TRUE"];
var FALSE_VALUES$2 = ["false", "False", "FALSE"];
/** @category Tags */
var boolCoreTag = defineScalarTag("tag:yaml.org,2002:bool", {
  implicit: true,
  implicitFirstChars: ["t", "T", "f", "F"],
  resolve: source => {
    if (TRUE_VALUES$2.indexOf(source) !== -1) return true;
    if (FALSE_VALUES$2.indexOf(source) !== -1) return false;
    return NOT_RESOLVED;
  },
  identify: object => Object.prototype.toString.call(object) === "[object Boolean]",
  represent: object => object ? "true" : "false"
});
//#endregion
//#region src/tag/scalar/bool_json.ts
var TRUE_VALUES$1 = ["true"];
var FALSE_VALUES$1 = ["false"];
/** @category Tags */
var boolJsonTag = defineScalarTag("tag:yaml.org,2002:bool", {
  implicit: true,
  implicitFirstChars: ["t", "f"],
  resolve: source => {
    if (TRUE_VALUES$1.indexOf(source) !== -1) return true;
    if (FALSE_VALUES$1.indexOf(source) !== -1) return false;
    return NOT_RESOLVED;
  },
  identify: object => Object.prototype.toString.call(object) === "[object Boolean]",
  represent: object => object ? "true" : "false"
});
//#endregion
//#region src/tag/scalar/bool_yaml11.ts
var TRUE_VALUES = ["true", "True", "TRUE", "y", "Y", "yes", "Yes", "YES", "on", "On", "ON"];
var FALSE_VALUES = ["false", "False", "FALSE", "n", "N", "no", "No", "NO", "off", "Off", "OFF"];
/** @category Tags */
var boolYaml11Tag = defineScalarTag("tag:yaml.org,2002:bool", {
  implicit: true,
  implicitFirstChars: ["y", "Y", "n", "N", "t", "T", "f", "F", "o", "O"],
  resolve: source => {
    if (TRUE_VALUES.indexOf(source) !== -1) return true;
    if (FALSE_VALUES.indexOf(source) !== -1) return false;
    return NOT_RESOLVED;
  },
  identify: object => Object.prototype.toString.call(object) === "[object Boolean]",
  represent: object => object ? "true" : "false"
});
//#endregion
//#region src/tag/scalar/int_core.ts
var YAML_INTEGER_IMPLICIT_PATTERN$1 = /* @__PURE__ */new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
var YAML_INTEGER_EXPLICIT_PATTERN$1 = /* @__PURE__ */new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
function parseYamlInteger$2(source) {
  let value = source;
  let sign = 1;
  if (value[0] === "-" || value[0] === "+") {
    if (value[0] === "-") sign = -1;
    value = value.slice(1);
  }
  if (value.startsWith("0b")) return sign * parseInt(value.slice(2), 2);
  if (value.startsWith("0o")) return sign * parseInt(value.slice(2), 8);
  if (value.startsWith("0x")) return sign * parseInt(value.slice(2), 16);
  return sign * parseInt(value, 10);
}
function resolveYamlInteger$2(source, isExplicit) {
  if (isExplicit) {
    if (!YAML_INTEGER_EXPLICIT_PATTERN$1.test(source)) return NOT_RESOLVED;
  } else if (!YAML_INTEGER_IMPLICIT_PATTERN$1.test(source)) return NOT_RESOLVED;
  const result = parseYamlInteger$2(source);
  return Number.isFinite(result) ? result : NOT_RESOLVED;
}
/** @category Tags */
var intCoreTag = defineScalarTag("tag:yaml.org,2002:int", {
  implicit: true,
  implicitFirstChars: ["-", "+", ..."0123456789"],
  resolve: resolveYamlInteger$2,
  identify: object => Number.isInteger(object) && !Object.is(object, -0) && object.toString(10).indexOf("e") < 0,
  represent: object => object.toString(10)
});
//#endregion
//#region src/tag/scalar/int_json.ts
var YAML_INTEGER_IMPLICIT_PATTERN = /* @__PURE__ */new RegExp("^-?(?:0|[1-9][0-9]*)$");
var YAML_INTEGER_EXPLICIT_PATTERN = /* @__PURE__ */new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
function parseYamlInteger$1(source) {
  let value = source;
  let sign = 1;
  if (value[0] === "-" || value[0] === "+") {
    if (value[0] === "-") sign = -1;
    value = value.slice(1);
  }
  if (value.startsWith("0b")) return sign * parseInt(value.slice(2), 2);
  if (value.startsWith("0o")) return sign * parseInt(value.slice(2), 8);
  if (value.startsWith("0x")) return sign * parseInt(value.slice(2), 16);
  return sign * parseInt(value, 10);
}
function resolveYamlInteger$1(source, isExplicit) {
  if (isExplicit) {
    if (!YAML_INTEGER_EXPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
  } else if (!YAML_INTEGER_IMPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
  const result = parseYamlInteger$1(source);
  return Number.isFinite(result) ? result : NOT_RESOLVED;
}
/** @category Tags */
var intJsonTag = defineScalarTag("tag:yaml.org,2002:int", {
  implicit: true,
  implicitFirstChars: ["-", ..."0123456789"],
  resolve: resolveYamlInteger$1,
  identify: object => Number.isInteger(object) && !Object.is(object, -0) && object.toString(10).indexOf("e") < 0,
  represent: object => object.toString(10)
});
//#endregion
//#region src/tag/scalar/int_yaml11.ts
var YAML_INTEGER_PATTERN = /* @__PURE__ */new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");
function parseYamlInteger(source) {
  let value = source.replace(/_/g, "");
  let sign = 1;
  if (value[0] === "-" || value[0] === "+") {
    if (value[0] === "-") sign = -1;
    value = value.slice(1);
  }
  if (value.startsWith("0b")) return sign * parseInt(value.slice(2), 2);
  if (value.startsWith("0x")) return sign * parseInt(value.slice(2), 16);
  if (value.includes(":")) {
    let result = 0;
    for (const part of value.split(":")) result = result * 60 + Number(part);
    return sign * result;
  }
  if (value !== "0" && value[0] === "0") return sign * parseInt(value, 8);
  return sign * parseInt(value, 10);
}
function resolveYamlInteger(source) {
  if (!YAML_INTEGER_PATTERN.test(source)) return NOT_RESOLVED;
  const result = parseYamlInteger(source);
  return Number.isFinite(result) ? result : NOT_RESOLVED;
}
/** @category Tags */
var intYaml11Tag = defineScalarTag("tag:yaml.org,2002:int", {
  implicit: true,
  implicitFirstChars: ["-", "+", ..."0123456789"],
  resolve: resolveYamlInteger,
  identify: object => Number.isInteger(object) && !Object.is(object, -0) && object.toString(10).indexOf("e") < 0,
  represent: object => object.toString(10)
});
//#endregion
//#region src/tag/scalar/float_core.ts
var YAML_FLOAT_PATTERN$1 = /* @__PURE__ */new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
var YAML_FLOAT_SPECIAL_PATTERN$1 = /* @__PURE__ */new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat$2(source) {
  if (!YAML_FLOAT_PATTERN$1.test(source)) return NOT_RESOLVED;
  let value = source.toLowerCase();
  const sign = value[0] === "-" ? -1 : 1;
  if ("+-".includes(value[0])) value = value.slice(1);
  if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  if (value === ".nan") return NaN;
  const result = sign * parseFloat(value);
  if (Number.isFinite(result) || YAML_FLOAT_SPECIAL_PATTERN$1.test(source)) return result;
  return NOT_RESOLVED;
}
function representYamlFloat$2(object) {
  if (isNaN(object)) return ".nan";
  if (object === Number.POSITIVE_INFINITY) return ".inf";
  if (object === Number.NEGATIVE_INFINITY) return "-.inf";
  if (Object.is(object, -0)) return "-0.0";
  const result = object.toString(10);
  return /^[-+]?[0-9]+e/.test(result) ? result.replace("e", ".e") : result;
}
/** @category Tags */
var floatCoreTag = defineScalarTag("tag:yaml.org,2002:float", {
  implicit: true,
  implicitFirstChars: ["-", "+", ".", ..."0123456789"],
  resolve: resolveYamlFloat$2,
  identify: object => typeof object === "number" && (!Number.isInteger(object) || Object.is(object, -0) || object.toString(10).indexOf("e") >= 0),
  represent: representYamlFloat$2
});
//#endregion
//#region src/tag/scalar/float_json.ts
var YAML_FLOAT_IMPLICIT_PATTERN = /* @__PURE__ */new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$");
var YAML_FLOAT_EXPLICIT_PATTERN = /* @__PURE__ */new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat$1(source, isExplicit) {
  if (isExplicit) {
    if (!YAML_FLOAT_EXPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
    let value = source.toLowerCase();
    const sign = value[0] === "-" ? -1 : 1;
    if ("+-".includes(value[0])) value = value.slice(1);
    if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    if (value === ".nan") return NaN;
    const result = sign * parseFloat(value);
    return Number.isFinite(result) ? result : NOT_RESOLVED;
  }
  if (!YAML_FLOAT_IMPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
  const result = Number(source);
  if (Number.isFinite(result)) return result;
  return NOT_RESOLVED;
}
function representYamlFloat$1(object) {
  if (isNaN(object)) return ".nan";
  if (object === Number.POSITIVE_INFINITY) return ".inf";
  if (object === Number.NEGATIVE_INFINITY) return "-.inf";
  if (Object.is(object, -0)) return "-0.0";
  const result = object.toString(10);
  return /^[-+]?[0-9]+e/.test(result) ? result.replace("e", ".e") : result;
}
/** @category Tags */
var floatJsonTag = defineScalarTag("tag:yaml.org,2002:float", {
  implicit: true,
  implicitFirstChars: ["-", ..."0123456789"],
  resolve: resolveYamlFloat$1,
  identify: object => typeof object === "number" && (!Number.isInteger(object) || Object.is(object, -0) || object.toString(10).indexOf("e") >= 0),
  represent: representYamlFloat$1
});
//#endregion
//#region src/tag/scalar/float_yaml11.ts
var YAML_FLOAT_PATTERN = /* @__PURE__ */new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
var YAML_FLOAT_SPECIAL_PATTERN = /* @__PURE__ */new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(source) {
  if (!YAML_FLOAT_PATTERN.test(source)) return NOT_RESOLVED;
  let value = source.toLowerCase().replace(/_/g, "");
  const sign = value[0] === "-" ? -1 : 1;
  if ("+-".includes(value[0])) value = value.slice(1);
  if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  if (value === ".nan") return NaN;
  let result = 0;
  if (value.includes(":")) {
    for (const part of value.split(":")) result = result * 60 + Number(part);
    result *= sign;
  } else result = sign * parseFloat(value);
  if (Number.isFinite(result) || YAML_FLOAT_SPECIAL_PATTERN.test(source)) return result;
  return NOT_RESOLVED;
}
function representYamlFloat(object) {
  if (isNaN(object)) return ".nan";
  if (object === Number.POSITIVE_INFINITY) return ".inf";
  if (object === Number.NEGATIVE_INFINITY) return "-.inf";
  if (Object.is(object, -0)) return "-0.0";
  const result = object.toString(10);
  return /^[-+]?[0-9]+e/.test(result) ? result.replace("e", ".e") : result;
}
/** @category Tags */
var floatYaml11Tag = defineScalarTag("tag:yaml.org,2002:float", {
  implicit: true,
  implicitFirstChars: ["-", "+", ".", ..."0123456789"],
  resolve: resolveYamlFloat,
  identify: object => typeof object === "number" && (!Number.isInteger(object) || Object.is(object, -0) || object.toString(10).indexOf("e") >= 0),
  represent: representYamlFloat
});
//#endregion
//#region src/tag/scalar/merge.ts
/**
* Enables merge keys in {@link CORE_SCHEMA} when added with
* {@link Schema.withTags}.
*
* @category Tags
*/
var mergeTag = defineScalarTag("tag:yaml.org,2002:merge", {
  implicit: true,
  implicitFirstChars: ["<"],
  resolve: (source, isExplicit) => {
    if (source === "<<" || isExplicit && source === "") return "<<";
    return NOT_RESOLVED;
  },
  identify: () => false
});
//#endregion
//#region src/tag/scalar/binary.ts
var BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;
function resolveYamlBinary(source) {
  const input = source.replace(/\s/g, "");
  if (input.length % 4 !== 0 || !BASE64_PATTERN.test(input)) return NOT_RESOLVED;
  const binary = atob(input);
  const result = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) result[index] = binary.charCodeAt(index);
  return result;
}
function representYamlBinary(object) {
  let binary = "";
  for (let index = 0; index < object.length; index++) binary += String.fromCharCode(object[index]);
  return btoa(binary);
}
/**
* The `!!binary` tag, represented as a `Uint8Array`.
*
* @category Tags
*/
var binaryTag = defineScalarTag("tag:yaml.org,2002:binary", {
  resolve: resolveYamlBinary,
  identify: object => Object.prototype.toString.call(object) === "[object Uint8Array]",
  represent: representYamlBinary
});
//#endregion
//#region src/tag/scalar/timestamp.ts
var YAML_DATE_REGEXP = /* @__PURE__ */new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
var YAML_TIMESTAMP_REGEXP = /* @__PURE__ */new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function makeUtcDate(year, month, day, hour = 0, minute = 0, second = 0, fraction = 0) {
  const date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  date.setUTCFullYear(year, month, day);
  return date;
}
function resolveYamlTimestamp(source) {
  let match = YAML_DATE_REGEXP.exec(source);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(source);
  if (match === null) return NOT_RESOLVED;
  const year = +match[1];
  const month = +match[2] - 1;
  const day = +match[3];
  if (!match[4]) {
    const date = makeUtcDate(year, month, day);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return NOT_RESOLVED;
    return date;
  }
  const hour = +match[4];
  const minute = +match[5];
  const second = +match[6];
  let fraction = 0;
  if (hour > 23 || minute > 59 || second > 59) return NOT_RESOLVED;
  if (match[7]) {
    let value = match[7].slice(0, 3);
    while (value.length < 3) value += "0";
    fraction = +value;
  }
  const date = makeUtcDate(year, month, day, hour, minute, second, fraction);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return NOT_RESOLVED;
  if (match[9]) {
    const offsetHour = +match[10];
    const offsetMinute = +(match[11] || 0);
    if (offsetHour > 23 || offsetMinute > 59) return NOT_RESOLVED;
    const offset = (offsetHour * 60 + offsetMinute) * 6e4;
    date.setTime(date.getTime() - (match[9] === "-" ? -offset : offset));
  }
  return date;
}
/**
* The YAML 1.1 `!!timestamp` tag, represented as a JavaScript `Date`.
*
* @category Tags
*/
var timestampTag = defineScalarTag("tag:yaml.org,2002:timestamp", {
  implicit: true,
  implicitFirstChars: [..."0123456789"],
  resolve: resolveYamlTimestamp,
  identify: object => object instanceof Date,
  represent: object => object.toISOString()
});
//#endregion
//#region src/tag/sequence/seq.ts
/** @category Tags */
var seqTag = defineSequenceTag("tag:yaml.org,2002:seq", {
  create: () => [],
  addItem: (container, item) => {
    container.push(item);
  },
  identify: Array.isArray
});
//#endregion
//#region src/common/object.ts
function isPlainObject(data) {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return false;
  const prototype = Object.getPrototypeOf(data);
  return prototype === null || prototype === Object.prototype;
}
function pick(object, keys) {
  const result = {};
  for (const key of keys) if (object[key] !== void 0) result[key] = object[key];
  return result;
}
//#endregion
//#region src/tag/sequence/omap.ts
/**
* Provided only for YAML 1.1 compatibility and supported by the loader only.
* JavaScript has no dedicated class to represent this type, so it cannot be
* identified and dumped.
*
* ```yaml
* !!omap
*   - one: 1
*   - two: 2
* ```
*
* is loaded as
*
* ```javascript
* [
*   { one: 1 },
*   { two: 2 }
* ]
* ```
*
* @category Tags
*/
var omapTag = defineSequenceTag("tag:yaml.org,2002:omap", {
  create: () => ({
    list: [],
    seen: /* @__PURE__ */new Set()
  }),
  addItem: (carrier, item) => {
    let key;
    if (item instanceof Map) {
      if (item.size !== 1) return "cannot resolve an ordered map item";
      key = item.keys().next().value;
    } else if (isPlainObject(item)) {
      const itemKeys = Object.keys(item);
      if (itemKeys.length !== 1) return "cannot resolve an ordered map item";
      key = itemKeys[0];
    } else return "cannot resolve an ordered map item";
    if (carrier.seen.has(key)) return "duplicate key in ordered map";
    carrier.seen.add(key);
    carrier.list.push(item);
    return "";
  },
  finalize: carrier => carrier.list,
  identify: () => false
});
//#endregion
//#region src/tag/sequence/pairs.ts
/**
* Provided only for YAML 1.1 compatibility and supported by the loader only.
* JavaScript has no dedicated class to represent this type, so it cannot be
* identified and dumped.
*
* ```yaml
* !!pairs
*   - one: 1
*   - two: 2
* ```
*
* is loaded as
*
* ```javascript
* [
*   ['one', 1],
*   ['two', 2]
* ]
* ```
*
* @category Tags
*/
var pairsTag = defineSequenceTag("tag:yaml.org,2002:pairs", {
  create: () => [],
  addItem: (container, item) => {
    if (item instanceof Map) {
      if (item.size !== 1) return "cannot resolve a pairs item";
      container.push(item.entries().next().value);
      return "";
    }
    if (Object.prototype.toString.call(item) !== "[object Object]") return "cannot resolve a pairs item";
    const object = item;
    const keys = Object.keys(object);
    if (keys.length !== 1) return "cannot resolve a pairs item";
    container.push([keys[0], object[keys[0]]]);
    return "";
  },
  identify: () => false
});
//#endregion
//#region src/tag/mapping/map.ts
/**
* This is the default mapping implementation. It uses `{}` objects and has only
* partial functionality due to language limitations. This choice was made
* because users expect to get JavaScript objects, and it was left unchanged to
* avoid too many breaking changes in the v5 release.
*
* Side effects:
*
* - `Object.hasOwn()` checks or `for...of` loops are required for safe use (to
*   avoid falling through to prototypes).
* - Only scalar string keys are supported properly.
* - Other scalar keys, such as `null` and numbers, are converted to strings.
*   This is historical behaviour, and it can cause side effects such as
*   problems with `!!merge`.
*
* Note that non-string scalar keys may be deprecated in future versions.
*
* Ideally, use {@link realMapTag} instead.
*
* @category Tags
*/
var mapTag = defineMappingTag("tag:yaml.org,2002:map", {
  create: () => ({}),
  identify: isPlainObject,
  represent: o => {
    const map = /* @__PURE__ */new Map();
    for (const key of Object.keys(o)) map.set(key, o[key]);
    return map;
  },
  addPair: (container, key, value) => {
    if (key !== null && typeof key === "object") return "object-based map does not support complex keys";
    const normalizedKey = String(key);
    if (normalizedKey === "__proto__") Object.defineProperty(container, normalizedKey, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });else container[normalizedKey] = value;
    return "";
  },
  has: (container, key) => {
    if (key !== null && typeof key === "object") return false;
    return Object.prototype.hasOwnProperty.call(container, String(key));
  },
  keys: container => Object.keys(container),
  get: (container, key) => {
    const normalizedKey = String(key);
    if (!Object.prototype.hasOwnProperty.call(container, normalizedKey)) return null;
    return container[normalizedKey];
  }
});
//#endregion
//#region src/tag/mapping/set.ts
/**
* The YAML 1.1 `!!set` tag, represented as a JavaScript `Set`.
*
* @category Tags
*/
var setTag = defineMappingTag("tag:yaml.org,2002:set", {
  create: () => /* @__PURE__ */new Set(),
  identify: data => data instanceof Set,
  represent: data => {
    const map = /* @__PURE__ */new Map();
    for (const key of data) map.set(key, null);
    return map;
  },
  addPair: (container, key, value) => {
    if (value !== null) return "cannot resolve a set item";
    container.add(key);
    return "";
  },
  has: (container, key) => container.has(key),
  keys: container => container.keys(),
  get: () => null
});
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
//#endregion
//#region \0@oxc-project+runtime@0.137.0/helpers/esm/objectSpread2.js
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
//#endregion
//#region src/schema.ts
function createTagDefinitionMap() {
  return {
    scalar: Object.create(null),
    sequence: Object.create(null),
    mapping: Object.create(null)
  };
}
function createTagDefinitionListMap() {
  return {
    scalar: [],
    sequence: [],
    mapping: []
  };
}
function compileTags(tags) {
  const result = [];
  for (const tag of tags) {
    let index = result.length;
    for (let previousIndex = 0; previousIndex < result.length; previousIndex++) {
      const previous = result[previousIndex];
      if (previous.nodeKind === tag.nodeKind && previous.tagName === tag.tagName && previous.matchByTagPrefix === tag.matchByTagPrefix) {
        index = previousIndex;
        break;
      }
    }
    result[index] = tag;
  }
  return result;
}
/**
* Controls tag resolution when loading and type selection when dumping.
*
* @category Schemas
*/
var Schema = class Schema {
  constructor(tags) {
    _defineProperty(this, "tags", void 0);
    _defineProperty(this, /** @internal */
    "implicitScalarTags", void 0);
    _defineProperty(this,
    /**
    * Dispatch implicit scalar resolvers by `source.charAt(0)`. Each bucket holds
    * the resolvers that may match that key, in schema order; a key absent from
    * the map uses
    * {@link Schema.implicitScalarAnyFirstChar}
    * (resolvers that declared no first-char constraint, so they apply to any
    * first character).
    */
    "implicitScalarByFirstChar", void 0);
    _defineProperty(this, "implicitScalarAnyFirstChar", void 0);
    _defineProperty(this,
    /**
    * The default scalar tag (`!!str`), resolved once so the composer's fallback
    * for unresolved plain scalars avoids a keyed lookup per scalar.
    *
    * @internal
    */
    "defaultScalarTag", void 0);
    _defineProperty(this,
    /**
    * The default container tags (`!!seq` / `!!map`), used by the dumper: when a
    * value is identified by its default tag, the tag is implicit and not
    * printed. Undefined if the schema does not define them (then such values
    * can't be dumped).
    *
    * @internal
    */
    "defaultSequenceTag", void 0);
    _defineProperty(this, /** @internal */
    "defaultMappingTag", void 0);
    _defineProperty(this, "exact", void 0);
    _defineProperty(this, "prefix", void 0);
    const compiledTags = compileTags(tags);
    const implicitScalarTags = [];
    const exact = createTagDefinitionMap();
    const prefix = createTagDefinitionListMap();
    for (const tag of compiledTags) {
      if (tag.nodeKind === "scalar" && tag.implicit) {
        if (tag.matchByTagPrefix) throw new Error("Implicit scalar tags cannot match by tag prefix");
        implicitScalarTags.push(tag);
      }
      switch (tag.nodeKind) {
        case "scalar":
          if (tag.matchByTagPrefix) prefix.scalar.push(tag);else exact.scalar[tag.tagName] = tag;
          break;
        case "sequence":
          if (tag.matchByTagPrefix) prefix.sequence.push(tag);else exact.sequence[tag.tagName] = tag;
          break;
        case "mapping":
          if (tag.matchByTagPrefix) prefix.mapping.push(tag);else exact.mapping[tag.tagName] = tag;
          break;
      }
    }
    const implicitScalarAnyFirstChar = implicitScalarTags.filter(tag => tag.implicitFirstChars === null);
    const keys = /* @__PURE__ */new Set();
    for (const tag of implicitScalarTags) if (tag.implicitFirstChars !== null) for (const key of tag.implicitFirstChars) keys.add(key);
    const implicitScalarByFirstChar = /* @__PURE__ */new Map();
    for (const key of keys) implicitScalarByFirstChar.set(key, implicitScalarTags.filter(tag => tag.implicitFirstChars === null || tag.implicitFirstChars.indexOf(key) !== -1));
    const defaultScalarTag = exact.scalar["tag:yaml.org,2002:str"];
    if (!defaultScalarTag) throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");
    this.tags = compiledTags;
    this.implicitScalarTags = implicitScalarTags;
    this.implicitScalarByFirstChar = implicitScalarByFirstChar;
    this.implicitScalarAnyFirstChar = implicitScalarAnyFirstChar;
    this.defaultScalarTag = defaultScalarTag;
    this.defaultSequenceTag = exact.sequence["tag:yaml.org,2002:seq"];
    this.defaultMappingTag = exact.mapping["tag:yaml.org,2002:map"];
    this.exact = exact;
    this.prefix = prefix;
  }
  /** @internal */
  lookupScalarTag(tagName) {
    const exactTag = this.exact.scalar[tagName];
    if (exactTag) return exactTag;
    for (const tag of this.prefix.scalar) if (tagName.startsWith(tag.tagName)) return tag;
  }
  /** @internal */
  lookupSequenceTag(tagName) {
    const exactTag = this.exact.sequence[tagName];
    if (exactTag) return exactTag;
    for (const tag of this.prefix.sequence) if (tagName.startsWith(tag.tagName)) return tag;
  }
  /** @internal */
  lookupMappingTag(tagName) {
    const exactTag = this.exact.mapping[tagName];
    if (exactTag) return exactTag;
    for (const tag of this.prefix.mapping) if (tagName.startsWith(tag.tagName)) return tag;
  }
  /** @internal */
  resolveImplicitScalarTag(source) {
    var _this$implicitScalarB;
    const candidates = (_this$implicitScalarB = this.implicitScalarByFirstChar.get(source.charAt(0))) !== null && _this$implicitScalarB !== void 0 ? _this$implicitScalarB : this.implicitScalarAnyFirstChar;
    for (const tag of candidates) {
      const value = tag.resolve(source, false, tag.tagName);
      if (value !== NOT_RESOLVED) return {
        value,
        tag
      };
    }
    const tag = this.defaultScalarTag;
    return {
      value: tag.resolve(source, false, tag.tagName),
      tag
    };
  }
  /**
  * Creates a new schema with the specified tags added. If a tag already
  * exists, it is replaced by the specified tag.
  *
  * @example
  *
  * ```javascript
  * import { CORE_SCHEMA, mergeTag, realMapTag } from 'js-yaml'
  *
  * const schema = CORE_SCHEMA.withTags(mergeTag, realMapTag)
  * ```
  */
  withTags(...tags) {
    let flatTags = [];
    for (const tag of tags) flatTags = flatTags.concat(tag);
    return new Schema([...this.tags, ...flatTags]);
  }
};
/**
* The YAML 1.2 Failsafe Schema: strings, sequences, and mappings.
*
* @category Schemas
*/
var FAILSAFE_SCHEMA = new Schema([strTag, seqTag, mapTag]);
/**
* The YAML 1.2 JSON Schema. It uses JSON scalar forms while retaining YAML
* collection syntax.
*
* @category Schemas
*/
var JSON_SCHEMA = new Schema([...FAILSAFE_SCHEMA.tags, nullJsonTag, boolJsonTag, intJsonTag, floatJsonTag]);
/**
* The default schema for the loaders. Note, {@link CORE_SCHEMA} comes
* without the `!!merge` tag. You can easily enable it if needed.
*
* @example
* Enable {@link mergeTag}:
*
* ```javascript
* import { load, CORE_SCHEMA, mergeTag } from 'js-yaml'
*
* try {
*   load(data, { schema: CORE_SCHEMA.withTags(mergeTag) })
* } catch (e) {
*   console.error(e)
* }
* ```
*
* @category Schemas
*/
var CORE_SCHEMA = new Schema([...FAILSAFE_SCHEMA.tags, nullCoreTag, boolCoreTag, intCoreTag, floatCoreTag]);
/**
* YAML 1.1-compatible schema.
*
* @category Schemas
*/
var YAML11_SCHEMA = new Schema([...FAILSAFE_SCHEMA.tags, nullYaml11Tag, boolYaml11Tag, intYaml11Tag, floatYaml11Tag, timestampTag, mergeTag, binaryTag, omapTag, pairsTag, setTag]);
/**
* The dumper schema for maximum compatibility. It combines all supported type
* variants from YAML 1.1 and YAML 1.2 so strings matching any of them are
* quoted. This makes the generated YAML more compatible with other parsers.
*
* The schema is based on YAML 1.1, but extends `!!int` and `!!float` to accept
* both YAML 1.1 and Core Schema forms, since Core Schema supports some forms
* that YAML 1.1 does not.
*
* @category Schemas
*/
var DUMP_SCHEMA = YAML11_SCHEMA.withTags(_objectSpread2(_objectSpread2({}, intYaml11Tag), {}, {
  resolve: (source, isExplicit, tagName) => {
    const result = intYaml11Tag.resolve(source, isExplicit, tagName);
    return result === NOT_RESOLVED ? intCoreTag.resolve(source, isExplicit, tagName) : result;
  }
}), _objectSpread2(_objectSpread2({}, floatYaml11Tag), {}, {
  resolve: (source, isExplicit, tagName) => {
    const result = floatYaml11Tag.resolve(source, isExplicit, tagName);
    return result === NOT_RESOLVED ? floatCoreTag.resolve(source, isExplicit, tagName) : result;
  }
}));
//#endregion
//#region src/tag/mapping/real_map.ts
/**
* Recommended when non-string keys are actually needed. It uses native
* JavaScript `Map` objects, so keys keep their constructed types instead of
* being converted to strings.
*
* It is not the default to avoid widespread breaking changes in existing
* projects. `Map` has a different access API and does not pass deep equality
* checks against `{}`-based fixtures. Alongside the other changes in v5,
* making it the default was considered too disruptive.
*
* If these differences are acceptable for your project, we recommend using
* {@link realMapTag} to guarantee the absence of problems and side effects.
*
* @example
* Enable {@link realMapTag}:
*
* ```javascript
* import { load, CORE_SCHEMA, realMapTag } from 'js-yaml'
*
* try {
*   load(data, { schema: CORE_SCHEMA.withTags(realMapTag) })
* } catch (e) {
*   console.error(e)
* }
* ```
*
* @category Tags
*/
var realMapTag = defineMappingTag("tag:yaml.org,2002:map", {
  create: () => /* @__PURE__ */new Map(),
  addPair: (container, key, value) => {
    container.set(key, value);
    return "";
  },
  has: (container, key) => container.has(key),
  keys: container => container.keys(),
  get: (container, key) => container.get(key),
  identify: data => data instanceof Map || isPlainObject(data),
  represent: data => {
    if (data instanceof Map) return data;
    const map = /* @__PURE__ */new Map();
    const obj = data;
    for (const key of Object.keys(obj)) map.set(key, obj[key]);
    return map;
  }
});
//#endregion
//#region src/tag/mapping/legacy_map.ts
function normalizeKey(key) {
  if (Array.isArray(key)) {
    const array = Array.prototype.slice.call(key);
    for (let index = 0; index < array.length; index++) {
      if (Array.isArray(array[index])) return null;
      if (typeof array[index] === "object" && Object.prototype.toString.call(array[index]) === "[object Object]") array[index] = "[object Object]";
    }
    return String(array);
  }
  if (typeof key === "object" && Object.prototype.toString.call(key) === "[object Object]") return "[object Object]";
  return String(key);
}
/**
* This implementation exists solely to reproduce v4 behavior exactly. Its use
* is strongly discouraged. If complex or non-string keys are needed, use
* {@link realMapTag} instead.
*
* @category Tags
*/
var legacyMapTag = defineMappingTag("tag:yaml.org,2002:map", {
  create: () => ({}),
  identify: isPlainObject,
  represent: o => {
    const map = /* @__PURE__ */new Map();
    for (const key of Object.keys(o)) map.set(key, o[key]);
    return map;
  },
  addPair: (container, key, value) => {
    const normalizedKey = normalizeKey(key);
    if (normalizedKey === null) return "nested arrays are not supported inside keys";
    if (normalizedKey === "__proto__") Object.defineProperty(container, normalizedKey, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });else container[normalizedKey] = value;
    return "";
  },
  has: (container, key) => {
    const normalizedKey = normalizeKey(key);
    return normalizedKey !== null && Object.prototype.hasOwnProperty.call(container, normalizedKey);
  },
  keys: container => Object.keys(container),
  get: (container, key) => {
    const normalizedKey = String(key);
    if (!Object.prototype.hasOwnProperty.call(container, normalizedKey)) return null;
    return container[normalizedKey];
  }
});
//#endregion
//#region src/common/snippet.ts
var DEFAULT_SNIPPET_OPTIONS = {
  maxLength: 79,
  indent: 1,
  linesBefore: 3,
  linesAfter: 2
};
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  let head = "";
  let tail = "";
  const maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "→") + tail,
    pos: position - lineStart + head.length
  };
}
function padStart(string, max) {
  return " ".repeat(Math.max(max - string.length, 0)) + string;
}
function makeSnippet(mark, options) {
  if (!mark.buffer) return null;
  const opts = _objectSpread2(_objectSpread2({}, DEFAULT_SNIPPET_OPTIONS), options);
  const re = /\r?\n|\r|\0/g;
  const lineStarts = [0];
  const lineEnds = [];
  let match;
  let foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) foundLineNo = lineStarts.length - 2;
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  let result = "";
  const lineNoLength = Math.min(mark.line + opts.linesAfter, lineEnds.length).toString().length;
  const maxLineLength = opts.maxLength - (opts.indent + lineNoLength + 3);
  for (let i = 1; i <= opts.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    const line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = `${" ".repeat(opts.indent)}${padStart((mark.line - i + 1).toString(), lineNoLength)} | ${line.str}\n${result}`;
  }
  const line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += `${" ".repeat(opts.indent)}${padStart((mark.line + 1).toString(), lineNoLength)} | ${line.str}\n`;
  result += `${"-".repeat(opts.indent + lineNoLength + 3 + line.pos)}^\n`;
  for (let i = 1; i <= opts.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    const line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += `${" ".repeat(opts.indent)}${padStart((mark.line + i + 1).toString(), lineNoLength)} | ${line.str}\n`;
  }
  return result.replace(/\n$/, "");
}
//#endregion
//#region src/common/exception.ts
function formatError(exception, compact) {
  let where = "";
  if (!exception.mark) return exception.reason;
  if (exception.mark.name) where += `in "${exception.mark.name}" `;
  where += `(${exception.mark.line + 1}:${exception.mark.column + 1})`;
  if (!compact && exception.mark.snippet) where += `\n\n${exception.mark.snippet}`;
  return `${exception.reason} ${where}`;
}
/**
* A YAML error. Unlike an ordinary `Error`, it adds a source snippet showing
* the location of the problem to the error message, when available.
*
* @category Main
*/
var YAMLException = class YAMLException extends Error {
  /**
  * Optional `mark` contains source snippet data. Usually, use
  * {@link YAMLException.throwAt} instead of passing it directly.
  */
  constructor(reason, mark) {
    super();
    _defineProperty(this, "reason", void 0);
    _defineProperty(this, "mark", void 0);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
  /**
  * Returns the formatted error, omitting the source snippet in compact mode.
  */
  toString(compact) {
    return `${this.name}: ${formatError(this, compact)}`;
  }
  /**
  * Builds a YAMLException with a source snippet and throws it. `source` is
  * the raw input text; `position` is an offset into it.
  */
  static throwAt(source, position, message, filename = "") {
    let line = 0;
    let lineStart = 0;
    for (let index = 0; index < position; index++) {
      const ch = source.charCodeAt(index);
      if (ch === 10) {
        line++;
        lineStart = index + 1;
      } else if (ch === 13) {
        line++;
        if (source.charCodeAt(index + 1) === 10) index++;
        lineStart = index + 1;
      }
    }
    const mark = {
      name: filename,
      buffer: source,
      position,
      line,
      column: position - lineStart
    };
    mark.snippet = makeSnippet(mark);
    throw new YAMLException(message, mark);
  }
};
//#endregion
//#region src/parser/events.ts
/** @category Events */
var EVENT_ID = {
  DOCUMENT: 1,
  SEQUENCE: 2,
  MAPPING: 3,
  SCALAR: 4,
  ALIAS: 5,
  POP: 6
};
/** @category Nodes */
var SCALAR_STYLE = {
  PLAIN: 1,
  SINGLE_QUOTED: 2,
  DOUBLE_QUOTED: 3,
  LITERAL_BLOCK: 4,
  FOLDED_BLOCK: 5
};
/** @category Nodes */
var COLLECTION_STYLE = {
  BLOCK: 1,
  FLOW: 2
};
/** @category Nodes */
var CHOMPING_MODE = {
  CLIP: 1,
  STRIP: 2,
  KEEP: 3
};
//#endregion
//#region src/parser/parser_scalar.ts
var NO_RANGE$3 = -1;
function simpleEscapeSequence(c) {
  switch (c) {
    case 48:
      return "\0";
    case 97:
      return "\x07";
    case 98:
      return "\b";
    case 116:
      return "	";
    case 9:
      return "	";
    case 110:
      return "\n";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 114:
      return "\r";
    case 101:
      return "\x1B";
    case 32:
      return " ";
    case 34:
      return "\"";
    case 47:
      return "/";
    case 92:
      return "\\";
    case 78:
      return "";
    case 95:
      return "\xA0";
    case 76:
      return "\u2028";
    case 80:
      return "\u2029";
    default:
      return "";
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (let i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function charFromCodepoint(c) {
  if (c <= 65535) return String.fromCharCode(c);
  return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
}
function fromHexCode$1(c) {
  if (c >= 48 && c <= 57) return c - 48;
  return (c | 32) - 97 + 10;
}
function escapedHexLen$1(c) {
  if (c === 120) return 2;
  if (c === 117) return 4;
  return 8;
}
function skipFoldedBreaks(input, position, end) {
  let breaks = 0;
  while (position < end) {
    const ch = input.charCodeAt(position);
    if (ch === 10) {
      breaks++;
      position++;
    } else if (ch === 13) {
      breaks++;
      position++;
      if (input.charCodeAt(position) === 10) position++;
    } else if (ch === 32 || ch === 9) position++;else break;
  }
  return {
    position,
    breaks
  };
}
function foldedBreaks(count) {
  if (count === 1) return " ";
  return "\n".repeat(count - 1);
}
function getPlainValue(input, start, end) {
  let result = "";
  let position = start;
  let captureStart = start;
  let captureEnd = start;
  while (position < end) {
    const ch = input.charCodeAt(position);
    if (ch === 10 || ch === 13) {
      result += input.slice(captureStart, captureEnd);
      const fold = skipFoldedBreaks(input, position, end);
      result += foldedBreaks(fold.breaks);
      position = captureStart = captureEnd = fold.position;
    } else {
      position++;
      if (ch !== 32 && ch !== 9) captureEnd = position;
    }
  }
  return result + input.slice(captureStart, captureEnd);
}
function getSingleQuotedValue(input, start, end) {
  let result = "";
  let position = start;
  let captureStart = start;
  let captureEnd = start;
  while (position < end) {
    const ch = input.charCodeAt(position);
    if (ch === 39) {
      result += input.slice(captureStart, position) + "'";
      position += 2;
      captureStart = captureEnd = position;
    } else if (ch === 10 || ch === 13) {
      result += input.slice(captureStart, captureEnd);
      const fold = skipFoldedBreaks(input, position, end);
      result += foldedBreaks(fold.breaks);
      position = captureStart = captureEnd = fold.position;
    } else {
      position++;
      if (ch !== 32 && ch !== 9) captureEnd = position;
    }
  }
  return result + input.slice(captureStart, end);
}
function getDoubleQuotedValue(input, start, end) {
  let result = "";
  let position = start;
  let captureStart = start;
  let captureEnd = start;
  while (position < end) {
    const ch = input.charCodeAt(position);
    if (ch === 92) {
      result += input.slice(captureStart, position);
      position++;
      const escaped = input.charCodeAt(position);
      if (escaped === 10 || escaped === 13) position = skipFoldedBreaks(input, position, end).position;else if (escaped < 256 && simpleEscapeCheck[escaped]) {
        result += simpleEscapeMap[escaped];
        position++;
      } else {
        let hexLength = escapedHexLen$1(escaped);
        let hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          position++;
          const digit = fromHexCode$1(input.charCodeAt(position));
          hexResult = (hexResult << 4) + digit;
        }
        result += charFromCodepoint(hexResult);
        position++;
      }
      captureStart = captureEnd = position;
    } else if (ch === 10 || ch === 13) {
      result += input.slice(captureStart, captureEnd);
      const fold = skipFoldedBreaks(input, position, end);
      result += foldedBreaks(fold.breaks);
      position = captureStart = captureEnd = fold.position;
    } else {
      position++;
      if (ch !== 32 && ch !== 9) captureEnd = position;
    }
  }
  return result + input.slice(captureStart, end);
}
function getBlockValue(input, start, end, indent, chomping, folded) {
  const textIndent = indent < 0 ? 0 : indent;
  const region = input.slice(start, end).replace(/\r\n?/g, "\n");
  const lines = region === "" ? [] : (region.endsWith("\n") ? region.slice(0, -1) : region).split("\n");
  let result = "";
  let didReadContent = false;
  let emptyLines = 0;
  let atMoreIndented = false;
  for (const line of lines) {
    let column = 0;
    while (column < textIndent && line.charCodeAt(column) === 32) column++;
    if (indent < 0 || column >= line.length) {
      emptyLines++;
      continue;
    }
    const content = line.slice(textIndent);
    const first = content.charCodeAt(0);
    if (folded) {
      if (first === 32 || first === 9) {
        atMoreIndented = true;
        result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        result += "\n".repeat(emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) result += " ";
      } else result += "\n".repeat(emptyLines);
    } else result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
    result += content;
    didReadContent = true;
    emptyLines = 0;
  }
  if (chomping === CHOMPING_MODE.KEEP) result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);else if (chomping !== CHOMPING_MODE.STRIP) {
    if (didReadContent) result += "\n";
  }
  return result;
}
/**
* Decodes the scalar referenced by event offsets in `input`.
*
* @category Events
*/
function getScalarValue(input, scalar) {
  if (scalar.valueStart === NO_RANGE$3) return "";
  const {
    valueStart,
    valueEnd
  } = scalar;
  if (scalar.fast) return input.slice(valueStart, valueEnd);
  switch (scalar.style) {
    case SCALAR_STYLE.SINGLE_QUOTED:
      return getSingleQuotedValue(input, valueStart, valueEnd);
    case SCALAR_STYLE.DOUBLE_QUOTED:
      return getDoubleQuotedValue(input, valueStart, valueEnd);
    case SCALAR_STYLE.LITERAL_BLOCK:
      return getBlockValue(input, valueStart, valueEnd, scalar.indent, scalar.chomping, false);
    case SCALAR_STYLE.FOLDED_BLOCK:
      return getBlockValue(input, valueStart, valueEnd, scalar.indent, scalar.chomping, true);
    default:
      return getPlainValue(input, valueStart, valueEnd);
  }
}
//#endregion
//#region src/common/tagname.ts
var DEFAULT_TAG_HANDLERS = Object.assign(Object.create(null), {
  "!": "!",
  "!!": "tag:yaml.org,2002:"
});
function tagPercentEncode(source) {
  return encodeURI(source).replace(/!/g, "%21");
}
function tagNameFull(rawTag, tagHandlers) {
  var _ref, _tagHandlers$handle;
  if (rawTag.startsWith("!<") && rawTag.endsWith(">")) return decodeURIComponent(rawTag.slice(2, -1));
  const handleEnd = rawTag.indexOf("!", 1);
  const handle = handleEnd === -1 ? "!" : rawTag.slice(0, handleEnd + 1);
  const prefix = (_ref = (_tagHandlers$handle = tagHandlers === null || tagHandlers === void 0 ? void 0 : tagHandlers[handle]) !== null && _tagHandlers$handle !== void 0 ? _tagHandlers$handle : DEFAULT_TAG_HANDLERS[handle]) !== null && _ref !== void 0 ? _ref : handle;
  return decodeURIComponent(prefix) + decodeURIComponent(rawTag.slice(handle.length));
}
function tagNameShort(fullTag) {
  let tag = fullTag;
  if (tag.charCodeAt(0) === 33) {
    tag = tag.slice(1);
    return `!${tagPercentEncode(tag)}`;
  }
  if (tag.slice(0, 18) === "tag:yaml.org,2002:") return `!!${tagPercentEncode(tag.slice(18))}`;
  return `!<${tagPercentEncode(tag)}>`;
}
//#endregion
//#region src/parser/constructor.ts
var NO_RANGE$2 = -1;
var MERGE_TAG_NAME = "tag:yaml.org,2002:merge";
var DEFAULT_CONSTRUCTOR_OPTIONS = {
  filename: "",
  schema: CORE_SCHEMA,
  json: false,
  maxTotalMergeKeys: 1e4,
  maxAliases: -1
};
function eventPosition$1(event) {
  if ("tagStart" in event && event.tagStart !== NO_RANGE$2) return event.tagStart;
  if ("anchorStart" in event && event.anchorStart !== NO_RANGE$2) return event.anchorStart;
  if ("valueStart" in event && event.valueStart !== NO_RANGE$2) return event.valueStart;
  if ("start" in event) return event.start;
  return 0;
}
function throwError$1(state, message) {
  YAMLException.throwAt(state.source, state.position, message, state.filename);
}
function finalizeCollection(state, position, tag, carrier) {
  try {
    return tag.finalize(carrier);
  } catch (error) {
    if (error instanceof YAMLException) throw error;
    YAMLException.throwAt(state.source, position, error instanceof Error ? error.message : String(error), state.filename);
  }
}
function constructScalar(state, event) {
  const source = getScalarValue(state.source, event);
  const rawTag = event.tagStart === NO_RANGE$2 ? "" : state.source.slice(event.tagStart, event.tagEnd);
  const strTag = state.schema.defaultScalarTag;
  if (rawTag !== "") {
    var _state$schema$lookupM;
    if (rawTag === "!") return {
      value: source,
      tag: strTag
    };
    const tagName = tagNameFull(rawTag, state.tagHandlers);
    const scalarTag = state.schema.lookupScalarTag(tagName);
    if (scalarTag) {
      const result = scalarTag.resolve(source, true, tagName);
      if (result === NOT_RESOLVED) throwError$1(state, `cannot resolve a node with !<${tagName}> explicit tag`);
      return {
        value: result,
        tag: scalarTag
      };
    }
    const collectionTagDef = (_state$schema$lookupM = state.schema.lookupMappingTag(tagName)) !== null && _state$schema$lookupM !== void 0 ? _state$schema$lookupM : state.schema.lookupSequenceTag(tagName);
    if (collectionTagDef) {
      if (source !== "") throwError$1(state, `cannot resolve a node with !<${tagName}> explicit tag`);
      const carrier = collectionTagDef.create(tagName);
      return {
        value: collectionTagDef.carrierIsResult ? carrier : finalizeCollection(state, state.position, collectionTagDef, carrier),
        tag: collectionTagDef
      };
    }
    throwError$1(state, `unknown scalar tag !<${tagName}>`);
  }
  if (event.style === SCALAR_STYLE.PLAIN) return state.schema.resolveImplicitScalarTag(source);
  return {
    value: strTag.resolve(source, false, strTag.tagName),
    tag: strTag
  };
}
function collectionTagName(state, event, defaultTagName) {
  const rawTag = event.tagStart === NO_RANGE$2 ? "" : state.source.slice(event.tagStart, event.tagEnd);
  return rawTag === "" || rawTag === "!" ? defaultTagName : tagNameFull(rawTag, state.tagHandlers);
}
function isMappingTag(tag) {
  return tag.nodeKind === "mapping";
}
function chargeMergeWork(state) {
  state.totalMergeKeys++;
  if (state.maxTotalMergeKeys !== -1 && state.totalMergeKeys > state.maxTotalMergeKeys) throwError$1(state, `merge keys exceeded maxTotalMergeKeys (${state.maxTotalMergeKeys})`);
}
function mergeKeys(state, frame, source, sourceTag) {
  chargeMergeWork(state);
  for (const sourceKey of sourceTag.keys(source)) {
    var _frame$overridable;
    chargeMergeWork(state);
    if (frame.tag.has(frame.value, sourceKey)) continue;
    const err = frame.tag.addPair(frame.value, sourceKey, sourceTag.get(source, sourceKey));
    if (err) throwError$1(state, err);
    (_frame$overridable = frame.overridable) !== null && _frame$overridable !== void 0 || (frame.overridable = /* @__PURE__ */new Set());
    frame.overridable.add(sourceKey);
  }
}
function mergeSource(state, frame, source, sourceTag) {
  state.position = frame.keyPosition;
  if (isMappingTag(sourceTag)) mergeKeys(state, frame, source, sourceTag);else if (sourceTag.nodeKind === "sequence" && Array.isArray(source)) {
    if (source.length > 100) throwError$1(state, "abnormal merge sequence size");
    for (const element of source) {
      const elementTag = state.nodeTags.get(element);
      if (!elementTag) throwError$1(state, "cannot merge mappings; the provided source object is unacceptable");
      mergeKeys(state, frame, element, elementTag);
    }
  } else throwError$1(state, "cannot merge mappings; the provided source object is unacceptable");
}
function addMappingValue(state, frame, key, value, tag) {
  var _frame$overridable2, _frame$overridable3;
  state.position = frame.keyPosition;
  if (frame.keyIsMerge) {
    mergeSource(state, frame, value, tag);
    return;
  }
  if (!state.json && frame.tag.has(frame.value, key) && !((_frame$overridable2 = frame.overridable) === null || _frame$overridable2 === void 0 ? void 0 : _frame$overridable2.has(key))) throwError$1(state, "duplicated mapping key");
  const err = frame.tag.addPair(frame.value, key, value);
  if (err) throwError$1(state, err);
  (_frame$overridable3 = frame.overridable) === null || _frame$overridable3 === void 0 || _frame$overridable3.delete(key);
}
function addValue(state, value, tag) {
  const frame = state.frames[state.frames.length - 1];
  if (frame.kind === "document") {
    frame.value = value;
    frame.hasValue = true;
  } else if (frame.kind === "sequence") {
    if (isMappingTag(tag)) state.nodeTags.set(value, tag);
    const err = frame.tag.addItem(frame.value, value, frame.index++);
    if (err) throwError$1(state, err);
  } else if (frame.hasKey) {
    const key = frame.key;
    frame.key = void 0;
    frame.hasKey = false;
    addMappingValue(state, frame, key, value, tag);
  } else {
    frame.key = value;
    frame.keyPosition = state.position;
    frame.hasKey = true;
    frame.keyIsMerge = tag.tagName === MERGE_TAG_NAME;
  }
}
function storeAnchor(state, event, value, tag, isValueFinal) {
  if (event.anchorStart !== NO_RANGE$2) {
    const anchor = {
      value,
      tag,
      isValueFinal
    };
    state.anchors.set(state.source.slice(event.anchorStart, event.anchorEnd), anchor);
    return anchor;
  }
  return null;
}
/**
* Constructs JavaScript documents directly from parser events, without an
* intermediate AST.
*
* @category Events
*/
function constructFromEvents(events, options) {
  const state = _objectSpread2(_objectSpread2(_objectSpread2({}, DEFAULT_CONSTRUCTOR_OPTIONS), options), {}, {
    events,
    documents: [],
    eventIndex: 0,
    position: 0,
    frames: [],
    anchors: /* @__PURE__ */new Map(),
    nodeTags: /* @__PURE__ */new Map(),
    tagHandlers: Object.create(null),
    totalMergeKeys: 0,
    aliasCount: 0
  });
  while (state.eventIndex < state.events.length) {
    const event = state.events[state.eventIndex++];
    state.position = eventPosition$1(event);
    switch (event.type) {
      case EVENT_ID.DOCUMENT:
        state.anchors = /* @__PURE__ */new Map();
        state.nodeTags = /* @__PURE__ */new Map();
        state.aliasCount = 0;
        state.tagHandlers = Object.create(null);
        for (const directive of event.directives) if (directive.kind === "tag") state.tagHandlers[directive.handle] = directive.prefix;
        state.frames.push({
          kind: "document",
          position: state.position,
          value: void 0,
          hasValue: false
        });
        break;
      case EVENT_ID.SCALAR:
        {
          const {
            value,
            tag
          } = constructScalar(state, event);
          storeAnchor(state, event, value, tag, true);
          addValue(state, value, tag);
          break;
        }
      case EVENT_ID.SEQUENCE:
        {
          const tagName = collectionTagName(state, event, "tag:yaml.org,2002:seq");
          const tag = state.schema.lookupSequenceTag(tagName);
          if (!tag) throwError$1(state, `unknown sequence tag !<${tagName}>`);
          const value = tag.create(tagName);
          const anchor = storeAnchor(state, event, value, tag, tag.carrierIsResult);
          state.frames.push({
            kind: "sequence",
            position: state.position,
            value,
            tag,
            anchor,
            index: 0
          });
          break;
        }
      case EVENT_ID.MAPPING:
        {
          const tagName = collectionTagName(state, event, "tag:yaml.org,2002:map");
          const tag = state.schema.lookupMappingTag(tagName);
          if (!tag) throwError$1(state, `unknown mapping tag !<${tagName}>`);
          const value = tag.create(tagName);
          const anchor = storeAnchor(state, event, value, tag, tag.carrierIsResult);
          state.frames.push({
            kind: "mapping",
            position: state.position,
            value,
            tag,
            anchor,
            key: void 0,
            keyPosition: state.position,
            hasKey: false,
            keyIsMerge: false,
            overridable: null
          });
          break;
        }
      case EVENT_ID.ALIAS:
        {
          if (state.maxAliases !== -1 && ++state.aliasCount > state.maxAliases) throwError$1(state, `aliases exceeded maxAliases (${state.maxAliases})`);
          const name = state.source.slice(event.anchorStart, event.anchorEnd);
          const anchor = state.anchors.get(name);
          if (!anchor) throwError$1(state, `unidentified alias "${name}"`);
          if (!anchor.isValueFinal) throwError$1(state, `recursive alias "${name}" is not supported for tag ${anchor.tag.tagName} because it uses finalize()`);
          addValue(state, anchor.value, anchor.tag);
          break;
        }
      case EVENT_ID.POP:
        {
          const frame = state.frames.pop();
          if (frame.kind === "mapping" && frame.hasKey) {
            state.position = frame.keyPosition;
            throwError$1(state, "incomplete mapping pair in event stream");
          }
          if (frame.kind === "document") state.documents.push(frame.value);else {
            const value = frame.tag.carrierIsResult ? frame.value : finalizeCollection(state, frame.position, frame.tag, frame.value);
            if (frame.anchor) {
              frame.anchor.value = value;
              frame.anchor.isValueFinal = true;
            }
            addValue(state, value, frame.tag);
          }
          break;
        }
    }
  }
  return state.documents;
}
//#endregion
//#region src/parser/parser.ts
var NO_RANGE$1 = -1;
var HAS_OWN = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]{}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![0-9A-Za-z-]+!)$/;
var NS_URI_CHAR = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`;
var NS_TAG_CHAR = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;
var PATTERN_TAG_URI = new RegExp(`^(?:${NS_URI_CHAR})*$`);
var PATTERN_TAG_SUFFIX = new RegExp(`^(?:${NS_TAG_CHAR})+$`);
var PATTERN_TAG_PREFIX = new RegExp(`^(?:!(?:${NS_URI_CHAR})*|${NS_TAG_CHAR}(?:${NS_URI_CHAR})*)$`);
var DEFAULT_PARSER_OPTIONS = {
  filename: "",
  maxDepth: 100
};
function addDocumentEvent(state, explicitStart, explicitEnd) {
  state.events.push({
    type: EVENT_ID.DOCUMENT,
    explicitStart,
    explicitEnd,
    directives: state.directives
  });
}
function addSequenceEvent(state, start, anchorStart, anchorEnd, tagStart, tagEnd, style) {
  state.events.push({
    type: EVENT_ID.SEQUENCE,
    start,
    anchorStart,
    anchorEnd,
    tagStart,
    tagEnd,
    style
  });
}
function addMappingEvent(state, start, anchorStart, anchorEnd, tagStart, tagEnd, style) {
  state.events.push({
    type: EVENT_ID.MAPPING,
    start,
    anchorStart,
    anchorEnd,
    tagStart,
    tagEnd,
    style
  });
}
function insertFlowPairMappingEvent(state, snapshot) {
  state.events.splice(snapshot.eventsLength, 0, {
    type: EVENT_ID.MAPPING,
    start: snapshot.position,
    anchorStart: NO_RANGE$1,
    anchorEnd: NO_RANGE$1,
    tagStart: NO_RANGE$1,
    tagEnd: NO_RANGE$1,
    style: COLLECTION_STYLE.FLOW
  });
}
function addScalarEvent(state, valueStart, valueEnd, anchorStart, anchorEnd, tagStart, tagEnd, style, chomping = CHOMPING_MODE.CLIP, indent = -1, fast = false) {
  state.events.push({
    type: EVENT_ID.SCALAR,
    valueStart,
    valueEnd,
    anchorStart,
    anchorEnd,
    tagStart,
    tagEnd,
    style,
    chomping,
    indent,
    fast
  });
}
function addAliasEvent(state, anchorStart, anchorEnd) {
  state.events.push({
    type: EVENT_ID.ALIAS,
    anchorStart,
    anchorEnd
  });
}
function addPopEvent(state) {
  state.events.push({
    type: EVENT_ID.POP
  });
}
function addEmptyScalarEvent(state) {
  addScalarEvent(state, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, SCALAR_STYLE.PLAIN);
}
function emptyProperties() {
  return {
    anchorStart: NO_RANGE$1,
    anchorEnd: NO_RANGE$1,
    tagStart: NO_RANGE$1,
    tagEnd: NO_RANGE$1
  };
}
function snapshotState(state) {
  return {
    position: state.position,
    line: state.line,
    lineStart: state.lineStart,
    lineIndent: state.lineIndent,
    firstTabInLine: state.firstTabInLine,
    eventsLength: state.events.length
  };
}
function restoreState(state, snapshot) {
  state.position = snapshot.position;
  state.line = snapshot.line;
  state.lineStart = snapshot.lineStart;
  state.lineIndent = snapshot.lineIndent;
  state.firstTabInLine = snapshot.firstTabInLine;
  state.events.length = snapshot.eventsLength;
}
function throwError(state, message) {
  YAMLException.throwAt(state.input.slice(0, state.length), state.position, message, state.filename);
}
function isEol(c) {
  return c === 10 || c === 13;
}
function isWhiteSpace(c) {
  return c === 9 || c === 32;
}
function isWsOrEol(c) {
  return isWhiteSpace(c) || isEol(c);
}
function isWsOrEolOrEnd(c) {
  return c === 0 || isWsOrEol(c);
}
function isFlowIndicator(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromDecimalCode(c) {
  return c >= 48 && c <= 57 ? c - 48 : -1;
}
function fromHexCode(c) {
  if (c >= 48 && c <= 57) return c - 48;
  const lc = c | 32;
  if (lc >= 97 && lc <= 102) return lc - 97 + 10;
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) return 2;
  if (c === 117) return 4;
  if (c === 85) return 8;
  return 0;
}
function isSimpleEscape(c) {
  return c === 48 || c === 97 || c === 98 || c === 116 || c === 9 || c === 110 || c === 118 || c === 102 || c === 114 || c === 101 || c === 32 || c === 34 || c === 47 || c === 92 || c === 78 || c === 95 || c === 76 || c === 80;
}
function consumeLineBreak(state) {
  if (state.input.charCodeAt(state.position) === 10) state.position++;else {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) state.position++;
  }
  state.line++;
  state.lineStart = state.position;
  state.lineIndent = 0;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments) {
  let lineBreaks = 0;
  let ch = state.input.charCodeAt(state.position);
  let hasSeparation = state.position === state.lineStart || isWsOrEol(state.input.charCodeAt(state.position - 1));
  while (ch !== 0) {
    while (isWhiteSpace(ch)) {
      hasSeparation = true;
      if (ch === 9 && state.firstTabInLine === -1) state.firstTabInLine = state.position;
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && hasSeparation && ch === 35) do ch = state.input.charCodeAt(++state.position); while (!isEol(ch) && ch !== 0);
    if (!isEol(ch)) break;
    consumeLineBreak(state);
    lineBreaks++;
    hasSeparation = true;
    ch = state.input.charCodeAt(state.position);
    while (ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
  }
  return lineBreaks;
}
function testDocumentSeparator(state, position = state.position) {
  const ch = state.input.charCodeAt(position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(position + 1) && ch === state.input.charCodeAt(position + 2)) {
    const following = state.input.charCodeAt(position + 3);
    return following === 0 || isWsOrEol(following);
  }
  return false;
}
function skipByteOrderMark(state) {
  if (state.position === state.lineStart && state.input.charCodeAt(state.position) === 65279) {
    state.position++;
    state.lineStart = state.position;
  }
}
function testDocumentBoundary(state) {
  if (state.position !== state.lineStart) return false;
  if (testDocumentSeparator(state)) return true;
  if (state.input.charCodeAt(state.position) !== 65279) return false;
  const snapshot = snapshotState(state);
  skipByteOrderMark(state);
  skipSeparationSpace(state, true);
  const ch = state.input.charCodeAt(state.position);
  const result = state.position === state.lineStart && (ch === 37 || ch === 45 && testDocumentSeparator(state));
  restoreState(state, snapshot);
  return result;
}
function skipUntilLineEnd(state) {
  let ch = state.input.charCodeAt(state.position);
  while (ch !== 0 && !isEol(ch)) ch = state.input.charCodeAt(++state.position);
}
function checkPrintable(state, start, end) {
  if (PATTERN_NON_PRINTABLE.test(state.input.slice(start, end))) throwError(state, "the stream contains non-printable characters");
}
function readTagProperty(state, props, inFlow) {
  if (state.input.charCodeAt(state.position) !== 33) return false;
  if (props.tagStart !== NO_RANGE$1) throwError(state, "duplication of a tag property");
  const start = state.position;
  let isVerbatim = false;
  let isNamed = false;
  let tagHandle = "!";
  let ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  }
  let suffixStart = state.position;
  let tagName;
  if (isVerbatim) {
    while (ch !== 0 && ch !== 62) ch = state.input.charCodeAt(++state.position);
    if (ch !== 62) throwError(state, "unexpected end of the stream within a verbatim tag");
    tagName = state.input.slice(suffixStart, state.position);
    state.position++;
  } else {
    while (ch !== 0 && !isWsOrEol(ch) && !(inFlow && isFlowIndicator(ch))) {
      if (ch === 33) if (!isNamed) {
        tagHandle = state.input.slice(suffixStart - 1, state.position + 1);
        if (!PATTERN_TAG_HANDLE.test(tagHandle)) throwError(state, "named tag handle cannot contain such characters");
        isNamed = true;
        suffixStart = state.position + 1;
      } else throwError(state, "tag suffix cannot contain exclamation marks");
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(suffixStart, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) throwError(state, "tag suffix cannot contain flow indicator characters");
  }
  if (tagName && !(isVerbatim ? PATTERN_TAG_URI.test(tagName) : PATTERN_TAG_SUFFIX.test(tagName))) throwError(state, `tag name cannot contain such characters: ${tagName}`);
  if (!isVerbatim && tagHandle !== "!" && tagHandle !== "!!" && !HAS_OWN.call(state.tagHandlers, tagHandle)) throwError(state, `undeclared tag handle "${tagHandle}"`);
  props.tagStart = start;
  props.tagEnd = state.position;
  return true;
}
function readAnchorProperty(state, props) {
  if (state.input.charCodeAt(state.position) !== 38) return false;
  if (props.anchorStart !== NO_RANGE$1) throwError(state, "duplication of an anchor property");
  state.position++;
  const start = state.position;
  while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position)) && !isFlowIndicator(state.input.charCodeAt(state.position))) state.position++;
  if (state.position === start) throwError(state, "name of an anchor node must contain at least one character");
  props.anchorStart = start;
  props.anchorEnd = state.position;
  return true;
}
function readAlias(state, props) {
  if (state.input.charCodeAt(state.position) !== 42) return false;
  if (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1) throwError(state, "alias node should not have any properties");
  state.position++;
  const start = state.position;
  while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position)) && !isFlowIndicator(state.input.charCodeAt(state.position))) state.position++;
  if (state.position === start) throwError(state, "name of an alias node must contain at least one character");
  addAliasEvent(state, start, state.position);
  return true;
}
function readFlowScalarBreak(state, nodeIndent) {
  skipSeparationSpace(state, false);
  if (state.lineIndent < nodeIndent) throwError(state, "deficient indentation");
}
function readSingleQuotedScalar(state, nodeIndent, props) {
  if (state.input.charCodeAt(state.position) !== 39) return false;
  state.position++;
  const start = state.position;
  let simple = true;
  while (state.input.charCodeAt(state.position) !== 0) {
    const ch = state.input.charCodeAt(state.position);
    if (ch === 39) {
      if (state.input.charCodeAt(state.position + 1) === 39) {
        simple = false;
        state.position += 2;
        continue;
      }
      const end = state.position;
      state.position++;
      addScalarEvent(state, start, end, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.SINGLE_QUOTED, CHOMPING_MODE.CLIP, -1, simple);
      return true;
    }
    if (isEol(ch)) {
      simple = false;
      readFlowScalarBreak(state, nodeIndent);
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) throwError(state, "unexpected end of the document within a single quoted scalar");else if (ch !== 9 && ch < 32) throwError(state, "expected valid JSON character");else state.position++;
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent, props) {
  if (state.input.charCodeAt(state.position) !== 34) return false;
  state.position++;
  const start = state.position;
  let simple = true;
  while (state.input.charCodeAt(state.position) !== 0) {
    const ch = state.input.charCodeAt(state.position);
    if (ch === 34) {
      const end = state.position;
      state.position++;
      addScalarEvent(state, start, end, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.DOUBLE_QUOTED, CHOMPING_MODE.CLIP, -1, simple);
      return true;
    }
    if (ch === 92) {
      simple = false;
      const escaped = state.input.charCodeAt(++state.position);
      if (isEol(escaped)) readFlowScalarBreak(state, nodeIndent);else if (isSimpleEscape(escaped)) state.position++;else {
        let hexLength = escapedHexLen(escaped);
        if (hexLength === 0) throwError(state, "unknown escape sequence");
        while (hexLength-- > 0) {
          state.position++;
          if (fromHexCode(state.input.charCodeAt(state.position)) < 0) throwError(state, "expected hexadecimal character");
        }
        state.position++;
      }
    } else if (isEol(ch)) {
      simple = false;
      readFlowScalarBreak(state, nodeIndent);
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) throwError(state, "unexpected end of the document within a double quoted scalar");else if (ch !== 9 && ch < 32) throwError(state, "expected valid JSON character");else state.position++;
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readBlockScalar(state, parentIndent, props) {
  const ch = state.input.charCodeAt(state.position);
  let chomping = CHOMPING_MODE.CLIP;
  let indent = -1;
  let detectedIndent = false;
  if (ch !== 124 && ch !== 62) return false;
  const style = ch === 124 ? SCALAR_STYLE.LITERAL_BLOCK : SCALAR_STYLE.FOLDED_BLOCK;
  state.position++;
  while (state.input.charCodeAt(state.position) !== 0) {
    const current = state.input.charCodeAt(state.position);
    const digit = fromDecimalCode(current);
    if (current === 43 || current === 45) {
      if (chomping !== CHOMPING_MODE.CLIP) throwError(state, "repeat of a chomping mode identifier");
      chomping = current === 43 ? CHOMPING_MODE.KEEP : CHOMPING_MODE.STRIP;
      state.position++;
    } else if (digit >= 0) {
      if (digit === 0) throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      if (detectedIndent) throwError(state, "repeat of an indentation width identifier");
      indent = parentIndent + digit - 1;
      detectedIndent = true;
      state.position++;
    } else break;
  }
  let hadWhitespace = false;
  while (isWhiteSpace(state.input.charCodeAt(state.position))) {
    hadWhitespace = true;
    state.position++;
  }
  if (hadWhitespace && state.input.charCodeAt(state.position) === 35) skipUntilLineEnd(state);
  if (isEol(state.input.charCodeAt(state.position))) consumeLineBreak(state);else if (state.input.charCodeAt(state.position) !== 0) throwError(state, "a line break is expected");
  let contentIndent = detectedIndent ? indent : -1;
  let maxLeadingIndent = 0;
  const valueStart = state.position;
  let valueEnd = state.position;
  while (state.input.charCodeAt(state.position) !== 0) {
    const linePosition = state.position;
    let column = 0;
    while (state.input.charCodeAt(linePosition + column) === 32) column++;
    const first = state.input.charCodeAt(linePosition + column);
    if (first === 0) {
      if (contentIndent >= 0) {
        if (column > contentIndent) valueEnd = linePosition + column;
      } else if (column > 0) valueEnd = linePosition + column;
      break;
    }
    if (testDocumentBoundary(state)) break;
    if (!detectedIndent && contentIndent === -1 && isEol(first)) maxLeadingIndent = Math.max(maxLeadingIndent, column);
    if (!detectedIndent && contentIndent === -1 && !isEol(first)) {
      if (first === 9 && column < parentIndent) {
        state.position = linePosition + column;
        throwError(state, "tab characters must not be used in indentation");
      }
      if (column < maxLeadingIndent) {
        state.position = linePosition + column;
        throwError(state, "bad indentation of a mapping entry");
      }
    }
    if (contentIndent === -1 && first !== 0 && !isEol(first) && column < parentIndent) {
      state.lineIndent = column;
      state.position = linePosition + column;
      break;
    }
    if (!detectedIndent && first !== 0 && !isEol(first) && contentIndent === -1) contentIndent = column;
    const requiredIndent = contentIndent === -1 ? parentIndent + 1 : contentIndent;
    if (first !== 0 && !isEol(first) && column < requiredIndent) {
      state.lineIndent = column;
      state.position = linePosition + column;
      break;
    }
    skipUntilLineEnd(state);
    valueEnd = state.position;
    if (isEol(state.input.charCodeAt(state.position))) {
      consumeLineBreak(state);
      valueEnd = state.position;
    }
  }
  checkPrintable(state, valueStart, valueEnd);
  addScalarEvent(state, valueStart, valueEnd, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, style, chomping, contentIndent);
  return true;
}
function canStartPlainScalar(state, nodeContext) {
  const ch = state.input.charCodeAt(state.position);
  const inFlow = nodeContext === CONTEXT_FLOW_IN;
  if (ch === 0 || isWsOrEol(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96 || inFlow && isFlowIndicator(ch)) return false;
  if (ch === 63 || ch === 45) {
    const following = state.input.charCodeAt(state.position + 1);
    if (isWsOrEolOrEnd(following) || inFlow && isFlowIndicator(following)) return false;
  }
  return true;
}
function readPlainScalar(state, nodeIndent, nodeContext, props) {
  if (!canStartPlainScalar(state, nodeContext)) return false;
  const start = state.position;
  let end = state.position;
  let ch = state.input.charCodeAt(state.position);
  const inFlow = nodeContext === CONTEXT_FLOW_IN;
  let multiline = false;
  while (ch !== 0) {
    if (testDocumentBoundary(state)) break;
    if (ch === 58) {
      const following = state.input.charCodeAt(state.position + 1);
      if (isWsOrEolOrEnd(following) || inFlow && isFlowIndicator(following)) break;
    } else if (ch === 35) {
      if (isWsOrEol(state.input.charCodeAt(state.position - 1))) break;
    } else if (inFlow && isFlowIndicator(ch)) break;else if (isEol(ch)) {
      const savedPosition = state.position;
      const savedLine = state.line;
      const savedLineStart = state.lineStart;
      const savedLineIndent = state.lineIndent;
      skipSeparationSpace(state, false);
      if (state.lineIndent >= nodeIndent) {
        multiline = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      }
      state.position = savedPosition;
      state.line = savedLine;
      state.lineStart = savedLineStart;
      state.lineIndent = savedLineIndent;
      break;
    }
    if (!isWhiteSpace(ch)) end = state.position + 1;
    ch = state.input.charCodeAt(++state.position);
  }
  if (end === start) return false;
  checkPrintable(state, start, end);
  addScalarEvent(state, start, end, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.PLAIN, CHOMPING_MODE.CLIP, -1, !multiline);
  return true;
}
function skipFlowSeparationSpace(state, nodeIndent) {
  const startLine = state.line;
  skipSeparationSpace(state, true);
  if (state.line > startLine && state.lineIndent < nodeIndent || state.firstTabInLine !== -1 && state.lineIndent < nodeIndent) throwError(state, "deficient indentation");
}
function readFlowCollection(state, nodeIndent, props) {
  const ch = state.input.charCodeAt(state.position);
  const isMapping = ch === 123;
  const start = state.position;
  let readNext = true;
  if (ch !== 91 && ch !== 123) return false;
  const terminator = isMapping ? 125 : 93;
  if (isMapping) addMappingEvent(state, start, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.FLOW);else addSequenceEvent(state, start, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.FLOW);
  state.position++;
  while (state.input.charCodeAt(state.position) !== 0) {
    skipFlowSeparationSpace(state, nodeIndent);
    let ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      addPopEvent(state);
      return true;
    } else if (!readNext) throwError(state, "missed comma between flow collection entries");else if (ch === 44) throwError(state, "expected the node content, but found ','");
    let isPair = false;
    let isExplicitPair = false;
    if (ch === 63 && isWsOrEol(state.input.charCodeAt(state.position + 1))) {
      isPair = isExplicitPair = true;
      state.position += 1;
      skipFlowSeparationSpace(state, nodeIndent);
    }
    const entryLine = state.line;
    const entryStart = snapshotState(state);
    const keyWasRead = parseNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    skipFlowSeparationSpace(state, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isMapping || isExplicitPair || state.line === entryLine) && ch === 58) {
      isPair = true;
      state.position++;
      skipFlowSeparationSpace(state, nodeIndent);
      if (!isMapping) {
        insertFlowPairMappingEvent(state, entryStart);
        if (!keyWasRead) addEmptyScalarEvent(state);
      } else if (!keyWasRead) addEmptyScalarEvent(state);
      if (!parseNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true)) addEmptyScalarEvent(state);
      skipFlowSeparationSpace(state, nodeIndent);
      if (!isMapping) addPopEvent(state);
    } else if (isMapping && isPair) {
      if (!keyWasRead) addEmptyScalarEvent(state);
      addEmptyScalarEvent(state);
    } else if (isMapping) addEmptyScalarEvent(state);else if (isPair) {
      insertFlowPairMappingEvent(state, entryStart);
      if (!keyWasRead) addEmptyScalarEvent(state);
      addEmptyScalarEvent(state);
      addPopEvent(state);
    }
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      state.position++;
    } else readNext = false;
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockSequence(state, nodeIndent, props) {
  if (state.firstTabInLine !== -1 || state.input.charCodeAt(state.position) !== 45 || !isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) return false;
  addSequenceEvent(state, state.position, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.BLOCK);
  while (state.input.charCodeAt(state.position) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    const entryLine = state.line;
    state.position++;
    const hadBreak = skipSeparationSpace(state, true) > 0;
    if (state.firstTabInLine !== -1 && state.input.charCodeAt(state.position) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) throwError(state, "bad indentation of a sequence entry");
    if (hadBreak && state.lineIndent <= nodeIndent) addEmptyScalarEvent(state);else parseNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    skipSeparationSpace(state, true);
    if (state.lineIndent < nodeIndent || state.position >= state.length) break;
    if (state.lineIndent > nodeIndent) throwError(state, "bad indentation of a sequence entry");
    if (state.line === entryLine && state.input.charCodeAt(state.position) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) throwError(state, "bad indentation of a sequence entry");
  }
  addPopEvent(state);
  return true;
}
function readBlockMapping(state, nodeIndent, flowIndent, props) {
  let atExplicitKey = false;
  let detected = false;
  let mappingOpened = false;
  let pendingExplicitKey = false;
  if (state.firstTabInLine !== -1) return false;
  let ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    const following = state.input.charCodeAt(state.position + 1);
    const entryLine = state.line;
    if ((ch === 63 || ch === 58) && isWsOrEolOrEnd(following)) {
      if (!mappingOpened) {
        addMappingEvent(state, state.position, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.BLOCK);
        mappingOpened = true;
      }
      if (ch === 63) {
        if (atExplicitKey) addEmptyScalarEvent(state);
        detected = true;
        atExplicitKey = true;
      } else if (atExplicitKey) atExplicitKey = false;else {
        addEmptyScalarEvent(state);
        detected = true;
        atExplicitKey = false;
      }
      state.position += 1;
      pendingExplicitKey = true;
    } else {
      if (atExplicitKey) {
        addEmptyScalarEvent(state);
        atExplicitKey = false;
      }
      const beforeKey = snapshotState(state);
      if (!parseNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) break;
      if (state.line === entryLine) {
        ch = state.input.charCodeAt(state.position);
        while (isWhiteSpace(ch)) ch = state.input.charCodeAt(++state.position);
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!isWsOrEolOrEnd(ch)) throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          if (!mappingOpened) {
            restoreState(state, beforeKey);
            addMappingEvent(state, beforeKey.position, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.BLOCK);
            mappingOpened = true;
            parseNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true);
            ch = state.input.charCodeAt(state.position);
            while (isWhiteSpace(ch)) ch = state.input.charCodeAt(++state.position);
            state.position++;
          }
          detected = true;
          atExplicitKey = false;
          pendingExplicitKey = false;
        } else if (detected) throwError(state, "expected ':' after a mapping key");else {
          if (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1) {
            restoreState(state, beforeKey);
            return false;
          }
          return true;
        }
      } else if (detected) throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");else {
        if (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1) {
          restoreState(state, beforeKey);
          return false;
        }
        return true;
      }
    }
    if (parseNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, pendingExplicitKey)) pendingExplicitKey = false;
    if (!atExplicitKey) {
      if (pendingExplicitKey) {
        addEmptyScalarEvent(state);
        pendingExplicitKey = false;
      }
    }
    skipSeparationSpace(state, true);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === entryLine || state.lineIndent > nodeIndent) && ch !== 0) throwError(state, "bad indentation of a mapping entry");else if (state.lineIndent < nodeIndent) break;
  }
  if (!detected) return false;
  if (atExplicitKey) addEmptyScalarEvent(state);
  if (mappingOpened) addPopEvent(state);
  return true;
}
function parseNode(state, parentIndent, nodeContext, allowToSeek, allowCompact, allowPropertyMapping = true) {
  if (state.depth >= state.maxDepth) throwError(state, `nesting exceeded maxDepth (${state.maxDepth})`);
  state.depth++;
  let indentStatus = 1;
  let atNewLine = false;
  let hasContent = false;
  let propertyStart = null;
  const props = emptyProperties();
  let allowBlockScalars = nodeContext === CONTEXT_BLOCK_OUT || nodeContext === CONTEXT_BLOCK_IN;
  let allowBlockCollections = allowBlockScalars;
  const allowBlockStyles = allowBlockScalars;
  if (allowToSeek && skipSeparationSpace(state, true)) {
    atNewLine = true;
    if (state.lineIndent > parentIndent) indentStatus = 1;else if (state.lineIndent === parentIndent) indentStatus = 0;else indentStatus = -1;
  }
  if (indentStatus === 1) while (true) {
    const ch = state.input.charCodeAt(state.position);
    const propertyState = snapshotState(state);
    if (atNewLine && indentStatus !== 1 && (ch === 33 || ch === 38)) break;
    if (atNewLine && allowBlockStyles && (props.tagStart !== NO_RANGE$1 || props.anchorStart !== NO_RANGE$1) && (ch === 33 || ch === 38)) {
      var _state$events$fallbac;
      const fallbackState = snapshotState(state);
      const flowIndent = parentIndent + 1;
      if (readBlockMapping(state, state.position - state.lineStart, flowIndent, props) && ((_state$events$fallbac = state.events[fallbackState.eventsLength]) === null || _state$events$fallbac === void 0 ? void 0 : _state$events$fallbac.type) === EVENT_ID.MAPPING) {
        state.depth--;
        return true;
      }
      restoreState(state, fallbackState);
    }
    if (atNewLine && (ch === 33 && props.tagStart !== NO_RANGE$1 || ch === 38 && props.anchorStart !== NO_RANGE$1)) break;
    if (!readTagProperty(state, props, nodeContext === CONTEXT_FLOW_IN) && !readAnchorProperty(state, props)) break;
    if (propertyStart === null) propertyStart = propertyState;
    if (skipSeparationSpace(state, true)) {
      atNewLine = true;
      allowBlockCollections = allowBlockStyles;
      if (state.lineIndent > parentIndent) indentStatus = 1;else if (state.lineIndent === parentIndent) indentStatus = 0;else indentStatus = -1;
    } else allowBlockCollections = false;
  }
  if (allowBlockCollections) allowBlockCollections = atNewLine || allowCompact;
  if (indentStatus === 1 || nodeContext === CONTEXT_BLOCK_OUT) {
    const flowIndent = nodeContext === CONTEXT_FLOW_IN || nodeContext === CONTEXT_FLOW_OUT ? parentIndent : parentIndent + 1;
    const blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent, props) || readBlockMapping(state, blockIndent, flowIndent, props)) || readFlowCollection(state, flowIndent, props)) hasContent = true;else {
        const ch = state.input.charCodeAt(state.position);
        if (propertyStart !== null && allowPropertyMapping && allowBlockStyles && !allowBlockCollections && ch !== 124 && ch !== 62) {
          var _state$events$fallbac2;
          const fallbackState = snapshotState(state);
          const propertyIndent = propertyStart.position - propertyStart.lineStart;
          restoreState(state, propertyStart);
          if (readBlockMapping(state, propertyIndent, flowIndent, emptyProperties()) && ((_state$events$fallbac2 = state.events[fallbackState.eventsLength]) === null || _state$events$fallbac2 === void 0 ? void 0 : _state$events$fallbac2.type) === EVENT_ID.MAPPING) hasContent = true;else restoreState(state, fallbackState);
        }
        if (!hasContent && (allowBlockScalars && readBlockScalar(state, flowIndent, props) || readSingleQuotedScalar(state, flowIndent, props) || readDoubleQuotedScalar(state, flowIndent, props) || readAlias(state, props) || readPlainScalar(state, flowIndent, nodeContext, props))) hasContent = true;
      }
    } else if (indentStatus === 0) hasContent = allowBlockCollections && readBlockSequence(state, blockIndent, props);
  }
  allowBlockScalars = allowBlockScalars && !hasContent;
  if (!hasContent && (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1 || allowBlockScalars)) {
    addScalarEvent(state, NO_RANGE$1, NO_RANGE$1, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.PLAIN);
    hasContent = true;
  }
  state.depth--;
  return hasContent || props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1;
}
function readDirective(state) {
  if (state.lineIndent > 0 || state.input.charCodeAt(state.position) !== 37) return false;
  state.position++;
  const nameStart = state.position;
  while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position))) state.position++;
  const name = state.input.slice(nameStart, state.position);
  const args = [];
  if (name.length === 0) throwError(state, "directive name must not be less than one character in length");
  while (state.input.charCodeAt(state.position) !== 0 && !isEol(state.input.charCodeAt(state.position))) {
    while (isWhiteSpace(state.input.charCodeAt(state.position))) state.position++;
    if (state.input.charCodeAt(state.position) === 35 || isEol(state.input.charCodeAt(state.position)) || state.input.charCodeAt(state.position) === 0) break;
    const start = state.position;
    while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position))) state.position++;
    args.push(state.input.slice(start, state.position));
  }
  if (isEol(state.input.charCodeAt(state.position))) consumeLineBreak(state);
  if (name === "YAML") {
    if (state.directives.some(directive => directive.kind === "yaml")) throwError(state, "duplication of %YAML directive");
    if (args.length !== 1) throwError(state, "YAML directive accepts exactly one argument");
    const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) throwError(state, "ill-formed argument of the YAML directive");
    if (parseInt(match[1], 10) !== 1) throwError(state, "unacceptable YAML version of the document");
    state.directives.push({
      kind: "yaml",
      version: args[0]
    });
  } else if (name === "TAG") {
    if (args.length !== 2) throwError(state, "TAG directive accepts exactly two arguments");
    const [handle, prefix] = args;
    if (!PATTERN_TAG_HANDLE.test(handle)) throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    if (HAS_OWN.call(state.tagHandlers, handle)) throwError(state, `there is a previously declared suffix for "${handle}" tag handle`);
    if (!PATTERN_TAG_PREFIX.test(prefix)) throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    state.tagHandlers[handle] = prefix;
    state.directives.push({
      kind: "tag",
      handle,
      prefix
    });
  }
  return true;
}
function readDocument(state) {
  state.directives = [];
  state.tagHandlers = Object.create(null);
  let hasDirectives = false;
  skipSeparationSpace(state, true);
  while (readDirective(state)) {
    hasDirectives = true;
    skipSeparationSpace(state, true);
  }
  let explicitStart = false;
  let explicitEnd = false;
  let allowCompact = true;
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 3))) {
    explicitStart = true;
    const markerLine = state.line;
    state.position += 3;
    skipSeparationSpace(state, true);
    allowCompact = state.line > markerLine;
  } else if (hasDirectives) throwError(state, "directives end mark is expected");
  const documentEventIndex = state.events.length;
  if (!explicitStart && state.position === state.lineStart && state.input.charCodeAt(state.position) === 46 && testDocumentSeparator(state)) {
    state.position += 3;
    skipSeparationSpace(state, true);
    return;
  }
  addDocumentEvent(state, explicitStart, false);
  if (!parseNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, allowCompact, allowCompact)) addEmptyScalarEvent(state);
  skipSeparationSpace(state, true);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    explicitEnd = state.input.charCodeAt(state.position) === 46;
    if (explicitEnd) {
      const markerLine = state.line;
      state.position += 3;
      skipSeparationSpace(state, true);
      if (state.line === markerLine && state.position < state.length) throwError(state, "end of the stream or a document separator is expected");
    }
  }
  const documentEvent = state.events[documentEventIndex];
  if ((documentEvent === null || documentEvent === void 0 ? void 0 : documentEvent.type) === EVENT_ID.DOCUMENT) documentEvent.explicitEnd = explicitEnd;
  addPopEvent(state);
  if (!explicitEnd && state.position < state.length && !testDocumentBoundary(state)) throwError(state, "end of the stream or a document separator is expected");
}
/**
* Parses YAML into a flat event stream referencing source text by offsets.
*
* @category Events
*/
function parseEvents(input, options) {
  const length = input.length;
  const state = _objectSpread2(_objectSpread2(_objectSpread2({}, DEFAULT_PARSER_OPTIONS), options), {}, {
    input: `${input}\0`,
    length,
    position: 0,
    line: 0,
    lineStart: 0,
    lineIndent: 0,
    firstTabInLine: -1,
    depth: 0,
    directives: [],
    tagHandlers: Object.create(null),
    events: []
  });
  const nullpos = input.indexOf("\0");
  if (nullpos !== -1) YAMLException.throwAt(input, nullpos, "null byte is not allowed in input", state.filename);
  while (state.position < state.length) {
    skipByteOrderMark(state);
    skipSeparationSpace(state, true);
    if (state.position >= state.length) break;
    const documentStart = state.position;
    readDocument(state);
    if (state.position === documentStart) /* c8 ignore next */
      throwError(state, "can not read a document");
  }
  return state.events;
}
//#endregion
//#region src/load.ts
var DEFAULT_LOAD_OPTIONS = _objectSpread2(_objectSpread2({}, DEFAULT_PARSER_OPTIONS), DEFAULT_CONSTRUCTOR_OPTIONS);
function loadDocuments(input, options = {}) {
  const opts = _objectSpread2(_objectSpread2({}, DEFAULT_LOAD_OPTIONS), options);
  const source = String(input);
  const PARSER_OPT_KEYS = Object.keys(DEFAULT_PARSER_OPTIONS);
  const CONSTRUCTOR_OPT_KEYS = Object.keys(DEFAULT_CONSTRUCTOR_OPTIONS);
  return constructFromEvents(parseEvents(source, pick(opts, PARSER_OPT_KEYS)), _objectSpread2(_objectSpread2({}, pick(opts, CONSTRUCTOR_OPT_KEYS)), {}, {
    source
  }));
}
function loadAll(input, iteratorOrOptions, options) {
  let iterator = null;
  if (typeof iteratorOrOptions === "function") iterator = iteratorOrOptions;else if (iteratorOrOptions !== null && typeof iteratorOrOptions === "object") options = iteratorOrOptions;
  const documents = loadDocuments(input, options);
  if (iterator === null) return documents;
  for (const document of documents) iterator(document);
}
/**
* Parses `string` as a single YAML document. Throws {@link YAMLException} on
* error. This function does not understand multi-document or empty sources; it
* throws an exception on those.
*
* > [!NOTE]
* > 1. When processing untrusted input, see the
* >    [security considerations](../docs/safety.md).
* > 2. All exceptions MUST be caught, not just {@link YAMLException}.
* > 3. The default {@link CORE_SCHEMA} comes without the `!!merge` tag. You can
* >    easily enable it if needed.
* > 4. The default {@link mapTag} is `{}`-object based, with known limitations
* >    (see description). For full compatibility use {@link realMapTag}
* >    instead (it uses native JS `Map`).
*
* @example
* Enable {@link mergeTag} and {@link realMapTag}:
*
* ```javascript
* import { load, CORE_SCHEMA, mergeTag, realMapTag } from 'js-yaml'
*
* try {
*   load(data, { schema: CORE_SCHEMA.withTags(mergeTag, realMapTag) })
* } catch (e) {
*   console.error(e)
* }
* ```
*
* @category Main
*/
function load(input, options) {
  const documents = loadDocuments(input, options);
  if (documents.length === 0) throw new YAMLException("expected a document, but the input is empty");
  if (documents.length === 1) return documents[0];
  throw new YAMLException("expected a single document in the stream, but found more");
}
//#endregion
//#region src/ast/from_js.ts
var INVALID = Symbol("INVALID");
function buildRepresentTypes(schema) {
  const defaultTags = new Set([schema.defaultScalarTag, schema.defaultSequenceTag, schema.defaultMappingTag].filter(t => t !== void 0));
  const implicitScalars = schema.implicitScalarTags;
  const explicitTags = schema.tags.filter(t => !(t.nodeKind === "scalar" && t.implicit) && !defaultTags.has(t));
  const defaultTagsLast = schema.tags.filter(t => defaultTags.has(t));
  return [...implicitScalars.map(tag => ({
    tag,
    implicitTag: true
  })), ...explicitTags.map(tag => ({
    tag,
    implicitTag: false
  })), ...defaultTagsLast.map(tag => ({
    tag,
    implicitTag: true
  }))];
}
function matchTag(state, object) {
  for (let index = 0, length = state.representTypes.length; index < length; index += 1) {
    const {
      tag,
      implicitTag
    } = state.representTypes[index];
    if (tag.identify(object)) {
      let tagName;
      if (tag.matchByTagPrefix) tagName = tag.representTagName(object);else tagName = tag.tagName;
      return {
        tag,
        tagName,
        implicitTag
      };
    }
  }
  return null;
}
function build(state, object) {
  if (!state.noRefs && object !== null && typeof object === "object") {
    const existing = state.refs.get(object);
    if (existing) {
      if (existing.anchor === void 0) existing.anchor = `ref_${state.refCounter++}`;
      return {
        kind: "alias",
        anchor: existing.anchor
      };
    }
  }
  const matched = matchTag(state, object);
  if (!matched) {
    if (object === void 0) return INVALID;
    if (state.skipInvalid) return INVALID;
    throw new YAMLException(`unacceptable kind of an object to dump ${Object.prototype.toString.call(object)}`);
  }
  const {
    tag,
    tagName,
    implicitTag
  } = matched;
  const nodeTagName = implicitTag ? tagName : tagNameShort(tagName);
  if (tag.nodeKind === "scalar") return {
    kind: "scalar",
    tag: nodeTagName,
    tagged: !implicitTag,
    style: SCALAR_STYLE.PLAIN,
    value: tag.represent(object)
  };
  if (tag.nodeKind === "sequence") {
    const container = tag.represent(object);
    const node = {
      kind: "sequence",
      tag: nodeTagName,
      tagged: !implicitTag,
      style: COLLECTION_STYLE.BLOCK,
      items: []
    };
    if (!state.noRefs) state.refs.set(object, node);
    for (let index = 0, length = container.length; index < length; index += 1) {
      let item = build(state, container[index]);
      if (item === INVALID && container[index] === void 0) item = build(state, null);
      if (item === INVALID) continue;
      node.items.push(item);
    }
    return node;
  }
  const map = tag.represent(object);
  const node = {
    kind: "mapping",
    tag: nodeTagName,
    tagged: !implicitTag,
    style: COLLECTION_STYLE.BLOCK,
    items: []
  };
  if (!state.noRefs) state.refs.set(object, node);
  for (const [objectKey, objectValue] of map) {
    const key = build(state, objectKey);
    if (key === INVALID) continue;
    const value = build(state, objectValue);
    if (value === INVALID) continue;
    node.items.push({
      key,
      value
    });
  }
  return node;
}
/**
* Convert JS object to AST. A JS value is one YAML document. An unrepresentable
* root becomes an empty document, which the presenter renders as an empty
* string.
*
* @category AST
*/
function jsToAst(input, schema, options = {}) {
  var _options$noRefs, _options$skipInvalid;
  const root = build({
    representTypes: buildRepresentTypes(schema),
    noRefs: (_options$noRefs = options.noRefs) !== null && _options$noRefs !== void 0 ? _options$noRefs : false,
    skipInvalid: (_options$skipInvalid = options.skipInvalid) !== null && _options$skipInvalid !== void 0 ? _options$skipInvalid : false,
    refs: /* @__PURE__ */new Map(),
    refCounter: 0
  }, input);
  return [{
    contents: root === INVALID ? null : root,
    directives: []
  }];
}
//#endregion
//#region src/ast/visit.ts
/**
* Return from a visitor to stop the whole traversal.
*
* @category AST
*/
var VISIT_BREAK = Symbol("visit:break");
/**
* Return from a visitor to skip the current node's children.
*
* @category AST
*/
var VISIT_SKIP = Symbol("visit:skip");
function visitNode(node, visitor, ctx) {
  const control = visitor(node, ctx);
  if (control === VISIT_BREAK) return true;
  if (control === VISIT_SKIP) return false;
  const depth = ctx.depth + 1;
  switch (node.kind) {
    case "sequence":
      for (const item of node.items) if (visitNode(item, visitor, {
        depth,
        parent: node,
        isKey: false
      })) return true;
      break;
    case "mapping":
      for (const {
        key,
        value
      } of node.items) {
        if (visitNode(key, visitor, {
          depth,
          parent: node,
          isKey: true
        })) return true;
        if (visitNode(value, visitor, {
          depth,
          parent: node,
          isKey: false
        })) return true;
      }
      break;
  }
  return false;
}
/**
* Walk every node in the documents, calling {@link Visitor} once per
* node (pre-order).
*
* @category AST
*/
function visit(documents, visitor) {
  for (const doc of documents) if (doc.contents && visitNode(doc.contents, visitor, {
    depth: 0,
    parent: null,
    isKey: false
  })) return;
}
//#endregion
//#region src/ast/styler_defaults.ts
function hasBit(mask, bit) {
  return (mask & 1 << bit) !== 0;
}
/**
* Default scalar styling rules in application order.
* See [Scalar styling](../../docs/scalar_styling.md) for usage details.
*
* @category AST
*/
var DEFAULT_SCALAR_STYLE_RULES = {
  applyQuoteFlowKeysOption,
  doubleQuoteForInvisibles,
  doubleQuoteWhitespaceOnly,
  applyForceQuotesOption,
  tryLongOrMultilineAsBlock,
  quoteInvalidPlain,
  fallbackToDoubleQuoted
};
function _preferredQuotedStyle(layout) {
  if (layout.presenterOptions.quoteStyle === "single" && hasBit(layout.allowedStylesMask, SCALAR_STYLE.SINGLE_QUOTED)) return SCALAR_STYLE.SINGLE_QUOTED;
  return SCALAR_STYLE.DOUBLE_QUOTED;
}
function applyQuoteFlowKeysOption(layout) {
  if (!layout.presenterOptions.quoteFlowKeys) return;
  if (!layout.isKey || !layout.flowOnly || layout.style !== SCALAR_STYLE.PLAIN) return;
  layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
}
function doubleQuoteForInvisibles(layout) {
  if (layout.style === SCALAR_STYLE.PLAIN && /[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(layout.node.value)) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
}
function doubleQuoteWhitespaceOnly(layout) {
  if (layout.style === SCALAR_STYLE.PLAIN && /^\s+$/.test(layout.node.value)) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
}
function applyForceQuotesOption(layout) {
  if (!layout.presenterOptions.forceQuotes) return;
  if (layout.isKey || layout.style !== SCALAR_STYLE.PLAIN) return;
  layout.style = layout.node.value.includes("\n") ? SCALAR_STYLE.DOUBLE_QUOTED : _preferredQuotedStyle(layout);
}
function tryLongOrMultilineAsBlock(layout) {
  if (layout.style !== SCALAR_STYLE.PLAIN || layout.isKey) return;
  const value = layout.node.value;
  const multiline = value.indexOf("\n") !== -1;
  if (!hasBit(layout.allowedStylesMask, SCALAR_STYLE.LITERAL_BLOCK)) {
    if (multiline) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
    return;
  }
  const w = layout.presenterOptions.lineWidth;
  if (w === -1) {
    if (multiline) layout.style = SCALAR_STYLE.LITERAL_BLOCK;
    return;
  }
  const availableWidth = Math.max(Math.min(w, 40), w - layout.shiftOfContent);
  let position = 0;
  let shouldFold = false;
  while (position <= value.length) {
    let lineEnd = value.length;
    const nextLineBreak = value.indexOf("\n", position);
    if (nextLineBreak !== -1) lineEnd = nextLineBreak;
    const line = value.slice(position, lineEnd);
    if (line.length > availableWidth && line[0] !== " " && / [^ \t]/.test(line)) shouldFold = true;
    if (nextLineBreak === -1) break;
    position = nextLineBreak + 1;
  }
  if (shouldFold) layout.style = SCALAR_STYLE.FOLDED_BLOCK;else if (multiline) layout.style = SCALAR_STYLE.LITERAL_BLOCK;
}
function quoteInvalidPlain(layout) {
  if (layout.style === SCALAR_STYLE.PLAIN && !hasBit(layout.allowedStylesMask, SCALAR_STYLE.PLAIN)) layout.style = _preferredQuotedStyle(layout);
}
function fallbackToDoubleQuoted(layout) {
  if (!hasBit(layout.allowedStylesMask, layout.style)) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
}
//#endregion
//#region src/ast/scalar_styler.ts
function setBit(mask, bit) {
  return mask | 1 << bit;
}
var SRC_C_PRINTABLE = "[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}]";
var SRC_B_CHAR = "[\\n\\r]";
var SRC_C_BYTE_ORDER_MARK = "\\uFEFF";
var SRC_S_WHITE = "[ \\t]";
var SRC_NB_CHAR = `(?:(?!(?:${SRC_B_CHAR}|${SRC_C_BYTE_ORDER_MARK}))${SRC_C_PRINTABLE})`;
var SRC_NS_CHAR = `(?:(?!${SRC_S_WHITE})${SRC_NB_CHAR})`;
var SRC_NB_JSON = "[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]";
var SRC_C_INDICATOR = "[-?:,\\[\\]{}#&*!|>'\"%@`]";
var SRC_C_FLOW_INDICATOR = "[,\\[\\]{}]";
var SRC_NS_PLAIN_SAFE_FLOW_OUT = SRC_NS_CHAR;
var SRC_NS_PLAIN_SAFE_FLOW_IN = `(?:(?!${SRC_C_FLOW_INDICATOR})${SRC_NS_CHAR})`;
var SRC_NS_PLAIN_FIRST_FLOW_OUT = `(?:(?:(?!${SRC_C_INDICATOR})${SRC_NS_CHAR})|[?:-](?=${SRC_NS_PLAIN_SAFE_FLOW_OUT}))`;
var SRC_NS_PLAIN_FIRST_FLOW_IN = `(?:(?:(?!${SRC_C_INDICATOR})${SRC_NS_CHAR})|[?:-](?=${SRC_NS_PLAIN_SAFE_FLOW_IN}))`;
var SRC_NS_PLAIN_CHAR_FLOW_OUT = `(?:(?:(?![:#])${SRC_NS_PLAIN_SAFE_FLOW_OUT})|:(?=${SRC_NS_PLAIN_SAFE_FLOW_OUT}))#*`;
var SRC_NS_PLAIN_CHAR_FLOW_IN = `(?:(?:(?![:#])${SRC_NS_PLAIN_SAFE_FLOW_IN})|:(?=${SRC_NS_PLAIN_SAFE_FLOW_IN}))#*`;
var SRC_NB_NS_PLAIN_IN_LINE_FLOW_OUT = `(?:${SRC_S_WHITE}*${SRC_NS_PLAIN_CHAR_FLOW_OUT})*`;
var SRC_NB_NS_PLAIN_IN_LINE_FLOW_IN = `(?:${SRC_S_WHITE}*${SRC_NS_PLAIN_CHAR_FLOW_IN})*`;
var SRC_NS_PLAIN_ONE_LINE_FLOW_OUT = `${SRC_NS_PLAIN_FIRST_FLOW_OUT}#*${SRC_NB_NS_PLAIN_IN_LINE_FLOW_OUT}`;
var SRC_NS_PLAIN_ONE_LINE_FLOW_IN = `${SRC_NS_PLAIN_FIRST_FLOW_IN}#*${SRC_NB_NS_PLAIN_IN_LINE_FLOW_IN}`;
var SRC_NS_PLAIN_ONE_LINE_BLOCK_KEY = SRC_NS_PLAIN_ONE_LINE_FLOW_OUT;
var SRC_NS_PLAIN_ONE_LINE_FLOW_KEY = SRC_NS_PLAIN_ONE_LINE_FLOW_IN;
var SRC_S_NS_PLAIN_NEXT_LINE_FLOW_OUT = `\\n+${SRC_NS_PLAIN_CHAR_FLOW_OUT}${SRC_NB_NS_PLAIN_IN_LINE_FLOW_OUT}`;
var SRC_S_NS_PLAIN_NEXT_LINE_FLOW_IN = `\\n+${SRC_NS_PLAIN_CHAR_FLOW_IN}${SRC_NB_NS_PLAIN_IN_LINE_FLOW_IN}`;
var SRC_NS_PLAIN_MULTI_LINE_FLOW_OUT = `${SRC_NS_PLAIN_ONE_LINE_FLOW_OUT}(?:${SRC_S_NS_PLAIN_NEXT_LINE_FLOW_OUT})*`;
var SRC_NS_PLAIN_MULTI_LINE_FLOW_IN = `${SRC_NS_PLAIN_ONE_LINE_FLOW_IN}(?:${SRC_S_NS_PLAIN_NEXT_LINE_FLOW_IN})*`;
var NS_PLAIN_FLOW_OUT = new RegExp(`^(?:${SRC_NS_PLAIN_MULTI_LINE_FLOW_OUT})$`, "u");
var NS_PLAIN_FLOW_IN = new RegExp(`^(?:${SRC_NS_PLAIN_MULTI_LINE_FLOW_IN})$`, "u");
var NS_PLAIN_BLOCK_KEY = new RegExp(`^(?:${SRC_NS_PLAIN_ONE_LINE_BLOCK_KEY})$`, "u");
var NS_PLAIN_FLOW_KEY = new RegExp(`^(?:${SRC_NS_PLAIN_ONE_LINE_FLOW_KEY})$`, "u");
var NB_SINGLE_ONE_LINE = new RegExp(`^(?:${SRC_NB_JSON})*$`, "u");
var NB_SINGLE_MULTI_LINE = new RegExp(`^(?:${SRC_NB_JSON}|\\n)*$`, "u");
var BLOCK_SCALAR_CONTENT = new RegExp(`^(?:${SRC_NB_CHAR}|\\n)*$`, "u");
var C_FORBIDDEN_FIRST_LINE = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/;
var C_FORBIDDEN_CONTENT = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/m;
function canUsePlain(layout) {
  const str = layout.node.value;
  if (str !== "") {
    if (!(layout.isKey ? layout.flowOnly ? NS_PLAIN_FLOW_KEY : NS_PLAIN_BLOCK_KEY : layout.flowOnly ? NS_PLAIN_FLOW_IN : NS_PLAIN_FLOW_OUT).test(str)) return false;
    if (layout.shiftOfFirstLine === 0 && C_FORBIDDEN_FIRST_LINE.test(str)) return false;
    if (layout.shiftOfContent === 0) {
      const firstLineBreak = str.indexOf("\n");
      if (firstLineBreak !== -1) {
        const content = str.slice(firstLineBreak + 1);
        if (C_FORBIDDEN_CONTENT.test(content)) return false;
      }
    }
  }
  const resolvedTag = layout.presenterOptions.schema.resolveImplicitScalarTag(str).tag.tagName;
  if (!layout.node.tagged && resolvedTag !== layout.node.tag) return false;
  if (!layout.node.tagged && str === "=" && resolvedTag === layout.presenterOptions.schema.defaultScalarTag.tagName) return false;
  return true;
}
function canUseSingleQuoted(layout) {
  const str = layout.node.value;
  if (!(layout.isKey ? NB_SINGLE_ONE_LINE : NB_SINGLE_MULTI_LINE).test(str)) return false;
  if (/[ \t]\n|\n[ \t]/.test(str)) return false;
  if (!layout.isKey && layout.shiftOfContent === 0) {
    const firstLineBreak = str.indexOf("\n");
    if (firstLineBreak !== -1 && C_FORBIDDEN_CONTENT.test(str.slice(firstLineBreak + 1))) return false;
  }
  return true;
}
function canUseBlock(layout) {
  if (layout.flowOnly || !BLOCK_SCALAR_CONTENT.test(layout.node.value)) return false;
  const contentIndent = layout.shiftOfContent - layout.shiftOfParent;
  if (contentIndent < 1) return false;
  if (contentIndent > 9 && /^\n* /.test(layout.node.value)) return false;
  if (layout.shiftOfContent === 0 && C_FORBIDDEN_CONTENT.test(layout.node.value)) return false;
  return true;
}
function detectAllowedStyles(layout) {
  let mask = setBit(0, SCALAR_STYLE.DOUBLE_QUOTED);
  if (canUsePlain(layout)) mask = setBit(mask, SCALAR_STYLE.PLAIN);
  if (canUseSingleQuoted(layout)) mask = setBit(mask, SCALAR_STYLE.SINGLE_QUOTED);
  if (canUseBlock(layout)) mask = setBit(setBit(mask, SCALAR_STYLE.LITERAL_BLOCK), SCALAR_STYLE.FOLDED_BLOCK);
  layout.allowedStylesMask = mask;
}
function renderScalar(layout) {
  switch (layout.style) {
    case SCALAR_STYLE.PLAIN:
      return renderPlain(layout);
    case SCALAR_STYLE.SINGLE_QUOTED:
      return renderSingleQuoted(layout);
    case SCALAR_STYLE.LITERAL_BLOCK:
      return renderLiteralBlock(layout);
    case SCALAR_STYLE.FOLDED_BLOCK:
      return renderFoldedBlock(layout);
    case SCALAR_STYLE.DOUBLE_QUOTED:
      return renderDoubleQuoted(layout);
  }
}
function renderPlain(layout) {
  return encodeFlowBreaks(layout.node.value, layout.shiftOfContent);
}
function renderSingleQuoted(layout) {
  return `'${encodeFlowBreaks(layout.node.value, layout.shiftOfContent).replace(/'/g, "''")}'`;
}
function renderLiteralBlock(layout) {
  const value = layout.node.value;
  return "|" + blockHeader(value, layout.shiftOfParent, layout.shiftOfContent) + dropEndingNewline(indentString(value, layout.shiftOfContent));
}
function renderFoldedBlock(layout) {
  const value = layout.node.value;
  const w = layout.presenterOptions.lineWidth;
  let availableWidth = Infinity;
  if (w !== -1) availableWidth = Math.max(Math.min(w, 40), w - layout.shiftOfContent);
  return ">" + blockHeader(value, layout.shiftOfParent, layout.shiftOfContent) + dropEndingNewline(indentString(foldBlockScalar(value, availableWidth), layout.shiftOfContent));
}
function renderDoubleQuoted(layout) {
  return `"${escapeString(layout.node.value)}"`;
}
function encodeFlowBreaks(string, shiftOfContent) {
  let nextLF = string.indexOf("\n");
  if (nextLF === -1) return string;
  const pad = " ".repeat(shiftOfContent);
  let result = string.slice(0, nextLF);
  const lineRe = /(\n+)([^\n]*)/g;
  lineRe.lastIndex = nextLF;
  let match;
  while (match = lineRe.exec(string)) {
    const breaks = match[1].length;
    const line = match[2];
    result += "\n".repeat(breaks + 1) + pad + line;
  }
  return result;
}
function indentString(string, spaces) {
  const indent = " ".repeat(spaces);
  let position = 0;
  let result = "";
  const length = string.length;
  while (position < length) {
    let line;
    const next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += indent;
    result += line;
  }
  return result;
}
function needIndentIndicator(string) {
  return /^\n* /.test(string);
}
function blockHeader(string, shiftOfParent, shiftOfContent) {
  const indentIndicator = needIndentIndicator(string) ? String(shiftOfContent - shiftOfParent) : "";
  const clip = string[string.length - 1] === "\n";
  return `${indentIndicator}${clip && (string[string.length - 2] === "\n" || string === "\n") ? "+" : clip ? "" : "-"}\n`;
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function isMoreIndented(char) {
  return char === " " || char === "	";
}
function foldLine(line, width) {
  if (line === "" || isMoreIndented(line[0])) return line;
  const breakRe = / [^ \t]/g;
  let match;
  let start = 0;
  let end;
  let curr = 0;
  let next = 0;
  let result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += `\n${line.slice(start, end)}`;
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) result += `${line.slice(start, curr)}\n${line.slice(curr + 1)}`;else result += line.slice(start);
  return result.slice(1);
}
function foldBlockScalar(string, width) {
  const lineRe = /(\n+)([^\n]*)/g;
  let nextLF = string.indexOf("\n");
  if (nextLF === -1) nextLF = string.length;
  lineRe.lastIndex = nextLF;
  let result = foldLine(string.slice(0, nextLF), width);
  let prevMoreIndented = string[0] === "\n" || isMoreIndented(string[0]);
  let moreIndented;
  let match;
  while (match = lineRe.exec(string)) {
    const prefix = match[1];
    const line = match[2];
    moreIndented = line !== "" && isMoreIndented(line[0]);
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
var CHARACTERS_TO_ESCAPE = /["\\\x00-\x1F\x7F-\xA0\u2028\u2029\uD800-\uDFFF\uFEFF\uFFFE\uFFFF]/gu;
function escapeCharacter(character) {
  switch (character) {
    case "\0":
      return "\\0";
    case "\x07":
      return "\\a";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\n":
      return "\\n";
    case "\v":
      return "\\v";
    case "\f":
      return "\\f";
    case "\r":
      return "\\r";
    case "\x1B":
      return "\\e";
    case "\"":
      return "\\\"";
    case "\\":
      return "\\\\";
    case "":
      return "\\N";
    case "\xA0":
      return "\\_";
    case "\u2028":
      return "\\L";
    case "\u2029":
      return "\\P";
  }
  const code = character.charCodeAt(0);
  const hex = code.toString(16).toUpperCase();
  if (code <= 255) return `\\x${"0".repeat(2 - hex.length)}${hex}`;
  return `\\u${"0".repeat(4 - hex.length)}${hex}`;
}
function escapeString(string) {
  return string.replace(CHARACTERS_TO_ESCAPE, escapeCharacter);
}
//#endregion
//#region src/ast/presenter.ts
var CHAR_LINE_FEED = 10;
var DEFAULT_PRESENTER_OPTIONS = {
  indent: 2,
  seqNoIndent: false,
  seqInlineFirst: true,
  lineWidth: 80,
  flowBracketPadding: false,
  flowSkipCommaSpace: false,
  flowSkipColonSpace: false,
  quoteFlowKeys: false,
  quoteStyle: "single",
  forceQuotes: false,
  scalarStyleRules: Object.keys(DEFAULT_SCALAR_STYLE_RULES).map(name => Reflect.get(DEFAULT_SCALAR_STYLE_RULES, name)),
  tagBeforeAnchor: false
};
function nodeTagShort(node) {
  return node.tagged ? node.tag : tagNameShort(node.tag);
}
function createPresenterState(options) {
  const opts = _objectSpread2(_objectSpread2({}, DEFAULT_PRESENTER_OPTIONS), options);
  if (opts.flowSkipColonSpace) opts.quoteFlowKeys = true;
  return _objectSpread2(_objectSpread2({}, opts), {}, {
    defaultScalarTagName: opts.schema.defaultScalarTag.tagName,
    openEnded: false
  });
}
function generateNextLine(state, level) {
  return `\n${" ".repeat(state.indent * level)}`;
}
function scalarLayout(state, node, parent, level, isKey, flowOnly) {
  return {
    node,
    parent,
    level,
    isKey,
    flowOnly,
    shiftOfParent: level === 0 ? -1 : state.indent * (level - 1),
    shiftOfContent: state.indent * Math.max(1, level),
    shiftOfFirstLine: level === 0 ? 0 : state.indent * level,
    presenterOptions: state,
    allowedStylesMask: 0,
    style: node.style
  };
}
function writeFlowSequence(state, level, node) {
  let result = "";
  for (let index = 0, length = node.items.length; index < length; index += 1) {
    const item = writeNode(state, level, node.items[index], node, {}).text;
    if (index > 0) result += `,${!state.flowSkipCommaSpace ? " " : ""}`;
    result += item;
  }
  const pad = state.flowBracketPadding && node.items.length > 0 ? " " : "";
  return `[${pad}${result}${pad}]`;
}
function writeBlockSequence(state, level, node, compact) {
  let result = "";
  for (let index = 0, length = node.items.length; index < length; index += 1) {
    const item = writeNode(state, level + 1, node.items[index], node, {
      block: true,
      compact: state.seqInlineFirst,
      isblockseq: true
    }).text;
    if (!compact || result !== "") result += generateNextLine(state, level);
    if (item === "" || CHAR_LINE_FEED === item.charCodeAt(0)) result += "-";else result += "- ";
    result += item;
  }
  return result;
}
function writeFlowMapping(state, level, node) {
  let result = "";
  for (const {
    key,
    value
  } of node.items) {
    let pairBuffer = "";
    if (result !== "") pairBuffer += `,${!state.flowSkipCommaSpace ? " " : ""}`;
    const keyRender = writeNode(state, level, key, node, {
      iskey: true
    });
    const keyText = keyRender.text;
    const valueText = writeNode(state, level, value, node, {}).text;
    const sep = state.flowSkipColonSpace || valueText === "" ? "" : " ";
    const keyIsBareProps = key.kind === "scalar" && keyRender.noBody && (key.tagged || key.anchor !== void 0);
    const keyColonSep = key.kind === "alias" || keyIsBareProps ? " " : "";
    pairBuffer += `${keyText}${keyColonSep}:${sep}${valueText}`;
    result += pairBuffer;
  }
  const pad = state.flowBracketPadding && result !== "" ? " " : "";
  return `{${pad}${result}${pad}}`;
}
function writeBlockMapping(state, level, node, compact) {
  let result = "";
  for (let index = 0, length = node.items.length; index < length; index += 1) {
    let pairBuffer = "";
    if (!compact || result !== "") pairBuffer += generateNextLine(state, level);
    const {
      key,
      value
    } = node.items[index];
    const keyIsBlock = (key.kind === "mapping" || key.kind === "sequence") && key.style === COLLECTION_STYLE.BLOCK && key.items.length !== 0 || key.kind === "scalar" && (key.style === SCALAR_STYLE.LITERAL_BLOCK || key.style === SCALAR_STYLE.FOLDED_BLOCK);
    const keyRender = keyIsBlock ? writeNode(state, level + 1, key, node, {
      block: true,
      compact: true,
      isblockseq: !cannotBeCompact(state, key, level + 1)
    }) : writeNode(state, level + 1, key, node, {
      block: true,
      compact: true,
      iskey: true
    });
    const keyText = keyRender.text;
    const keyHasLineBreak = key.kind === "scalar" && key.value.indexOf("\n") !== -1;
    const keyIsTooLong = keyText.length > 1024 && /^[\s\S]{1025}/u.test(keyText);
    const explicitPair = keyIsBlock || keyHasLineBreak || keyIsTooLong;
    if (explicitPair) if (keyText && CHAR_LINE_FEED === keyText.charCodeAt(0)) pairBuffer += "?";else pairBuffer += "? ";
    pairBuffer += keyText;
    if (explicitPair) pairBuffer += generateNextLine(state, level);
    const valueText = writeNode(state, level + 1, value, node, {
      block: true,
      compact: explicitPair,
      isblockseq: explicitPair && !cannotBeCompact(state, value, level + 1)
    }).text;
    const keyIsBareProps = key.kind === "scalar" && keyRender.noBody && (key.tagged || key.anchor !== void 0);
    const keyColonSep = !explicitPair && (key.kind === "alias" || keyIsBareProps) ? " " : "";
    if (valueText === "" || CHAR_LINE_FEED === valueText.charCodeAt(0)) pairBuffer += `${keyColonSep}:`;else pairBuffer += `${keyColonSep}: `;
    pairBuffer += valueText;
    result += pairBuffer;
  }
  return result;
}
function cannotBeCompact(state, node, level) {
  if (node.kind === "alias") return true;
  return node.tagged || node.anchor !== void 0 || state.indent < 2 && level > 0;
}
function writeNode(state, level, node, parent, ctx) {
  var _ctx$compact;
  if (node.kind === "alias") {
    state.openEnded = false;
    return {
      text: `*${node.anchor}`,
      noBody: false
    };
  }
  const {
    block = false,
    iskey = false,
    isblockseq = false
  } = ctx;
  let compact = (_ctx$compact = ctx.compact) !== null && _ctx$compact !== void 0 ? _ctx$compact : false;
  const hasAnchor = node.anchor !== void 0;
  if (cannotBeCompact(state, node, level)) compact = false;
  let body;
  let shouldPrintTag = node.tagged;
  const useBlockCollection = block && (node.kind === "mapping" || node.kind === "sequence") && node.style === COLLECTION_STYLE.BLOCK && node.items.length !== 0;
  if (node.kind === "mapping") {
    if (useBlockCollection) body = writeBlockMapping(state, level, node, compact);else body = writeFlowMapping(state, level, node);
  } else if (node.kind === "sequence") {
    if (useBlockCollection) {
      if (state.seqNoIndent && !isblockseq && level > 0) body = writeBlockSequence(state, level - 1, node, compact);else body = writeBlockSequence(state, level, node, compact);
    } else body = writeFlowSequence(state, level, node);
  } else {
    const layout = scalarLayout(state, node, parent, level, iskey, !block);
    detectAllowedStyles(layout);
    for (const rule of state.scalarStyleRules) rule(layout);
    body = renderScalar(layout);
    state.openEnded = (layout.style === SCALAR_STYLE.LITERAL_BLOCK || layout.style === SCALAR_STYLE.FOLDED_BLOCK) && (node.value === "\n" || node.value.endsWith("\n\n"));
    shouldPrintTag = node.tagged || body === "" && layout.flowOnly && (parent === null || parent === void 0 ? void 0 : parent.kind) === "sequence" && !hasAnchor || layout.style !== SCALAR_STYLE.PLAIN && node.tag !== state.defaultScalarTagName;
  }
  if ((node.kind === "mapping" || node.kind === "sequence") && !useBlockCollection) state.openEnded = false;
  if (useBlockCollection && compact && level > 0 && state.indent > 2) body = `${" ".repeat(state.indent - 2)}${body}`;
  const noBody = body === "";
  let text = body;
  if (shouldPrintTag || hasAnchor) {
    const props = [];
    const tag = shouldPrintTag ? nodeTagShort(node) : null;
    const anchor = hasAnchor ? `&${node.anchor}` : null;
    if (state.tagBeforeAnchor) {
      if (tag !== null) props.push(tag);
      if (anchor !== null) props.push(anchor);
    } else {
      if (anchor !== null) props.push(anchor);
      if (tag !== null) props.push(tag);
    }
    const sep = body === "" || body.charCodeAt(0) === CHAR_LINE_FEED ? "" : " ";
    text = `${props.join(" ")}${sep}${body}`;
  }
  return {
    text,
    noBody
  };
}
function rootStartsOwnLine(node) {
  return (node.kind === "sequence" || node.kind === "mapping") && node.style === COLLECTION_STYLE.BLOCK && node.items.length !== 0 && !node.tagged && node.anchor === void 0;
}
function writeDocumentDirectives(doc) {
  let result = "";
  for (const directive of doc.directives) {
    if (directive.kind === "yaml") {
      result += `%YAML ${directive.version}\n`;
      continue;
    }
    const {
      handle,
      prefix
    } = directive;
    result += `%TAG ${handle} ${prefix}\n`;
  }
  return result;
}
/**
* Build YAML from AST.
*
* @category AST
*/
function present(documents, options) {
  const state = createPresenterState(options);
  let result = "";
  let previousEnded = false;
  for (let index = 0; index < documents.length; index += 1) {
    const doc = documents[index];
    state.openEnded = false;
    const directives = writeDocumentDirectives(doc);
    const hasDirectives = directives !== "";
    const marker = doc.explicitStart || hasDirectives || index > 0 && !previousEnded;
    result += directives;
    if (doc.contents === null) {
      if (marker) result += "---\n";
    } else if (marker) {
      const body = writeNode(state, 0, doc.contents, null, {
        block: true,
        compact: true
      }).text;
      const sep = body === "" ? "" : hasDirectives || rootStartsOwnLine(doc.contents) ? "\n" : " ";
      result += `---${sep}${body}\n`;
    } else result += writeNode(state, 0, doc.contents, null, {
      block: true,
      compact: true
    }).text + "\n";
    previousEnded = doc.explicitEnd || state.openEnded;
    if (previousEnded) result += "...\n";
  }
  return result;
}
//#endregion
//#region src/dump.ts
var DEFAULT_DUMP_OPTIONS = _objectSpread2(_objectSpread2({}, DEFAULT_PRESENTER_OPTIONS), {}, {
  schema: DUMP_SCHEMA,
  skipInvalid: false,
  noRefs: false,
  flowLevel: -1,
  sortKeys: false,
  transform: () => {}
});
function defaultCompareFn(a, b) {
  const x = String(a);
  const y = String(b);
  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
}
/**
* Serializes JS object as a YAML document. By default it can dump every
* supported YAML type, so it throws an exception if you try to dump regexps or
* functions. However, you can disable exceptions by setting the
* {@link DumpOptions.skipInvalid} option to `true`.
*
* @category Main
*/
function dump(input, options = {}) {
  const opts = _objectSpread2(_objectSpread2({}, DEFAULT_DUMP_OPTIONS), options);
  const documents = jsToAst(input, opts.schema, {
    noRefs: opts.noRefs,
    skipInvalid: opts.skipInvalid
  });
  if (opts.flowLevel >= 0) visit(documents, (node, ctx) => {
    if (ctx.depth < opts.flowLevel) return;
    if (node.kind === "sequence" || node.kind === "mapping") node.style = COLLECTION_STYLE.FLOW;
    return VISIT_SKIP;
  });
  if (opts.sortKeys) {
    const compareFn = opts.sortKeys === true ? defaultCompareFn : opts.sortKeys;
    visit(documents, node => {
      if (node.kind !== "mapping") return;
      node.items.sort((a, b) => compareFn(a.key.kind === "scalar" ? a.key.value : "", b.key.kind === "scalar" ? b.key.value : ""));
    });
  }
  opts.transform(documents);
  return present(documents, _objectSpread2(_objectSpread2({}, pick(opts, Object.keys(DEFAULT_PRESENTER_OPTIONS))), {}, {
    schema: opts.schema
  }));
}
//#endregion
//#region src/ast/from_events.ts
var NO_RANGE = -1;
function eventPosition(event) {
  if ("tagStart" in event && event.tagStart !== NO_RANGE) return event.tagStart;
  if ("anchorStart" in event && event.anchorStart !== NO_RANGE) return event.anchorStart;
  if ("valueStart" in event && event.valueStart !== NO_RANGE) return event.valueStart;
  if ("start" in event) return event.start;
  return 0;
}
function rawTag(state, event) {
  return event.tagStart === NO_RANGE ? "" : state.source.slice(event.tagStart, event.tagEnd);
}
function anchorName(state, event) {
  return event.anchorStart === NO_RANGE ? void 0 : state.source.slice(event.anchorStart, event.anchorEnd);
}
function buildScalar(state, event) {
  const value = getScalarValue(state.source, event);
  const raw = rawTag(state, event);
  let tag;
  let tagged = false;
  if (raw !== "") {
    tagged = true;
    tag = raw;
  } else if (event.style === SCALAR_STYLE.PLAIN) tag = state.schema.resolveImplicitScalarTag(value).tag.tagName;else tag = state.schema.defaultScalarTag.tagName;
  return {
    kind: "scalar",
    tag,
    tagged,
    style: event.style,
    anchor: anchorName(state, event),
    value
  };
}
function buildCollection(state, event, defaultTagName) {
  const raw = rawTag(state, event);
  let tag;
  let tagged = false;
  if (raw === "") tag = defaultTagName;else {
    tag = raw;
    tagged = true;
  }
  return {
    tag,
    tagged,
    style: event.style,
    anchor: anchorName(state, event)
  };
}
function addNode(state, node) {
  const frame = state.frames[state.frames.length - 1];
  if (frame.kind === "document") frame.doc.contents = node;else if (frame.kind === "sequence") frame.node.items.push(node);else if (frame.key) {
    frame.node.items.push({
      key: frame.key,
      value: node
    });
    frame.key = null;
  } else frame.key = node;
}
/**
* Builds an AST from parser events
*
* @category AST
*/
function eventsToAst(events, options) {
  const state = {
    source: options.source,
    schema: options.schema,
    eventIndex: 0,
    position: 0,
    frames: [],
    documents: []
  };
  while (state.eventIndex < events.length) {
    const event = events[state.eventIndex++];
    state.position = eventPosition(event);
    switch (event.type) {
      case EVENT_ID.DOCUMENT:
        {
          const doc = {
            contents: null,
            explicitStart: event.explicitStart,
            explicitEnd: event.explicitEnd,
            directives: event.directives
          };
          state.frames.push({
            kind: "document",
            doc
          });
          break;
        }
      case EVENT_ID.SCALAR:
        addNode(state, buildScalar(state, event));
        break;
      case EVENT_ID.SEQUENCE:
        {
          const {
            tag,
            tagged,
            style,
            anchor
          } = buildCollection(state, event, "tag:yaml.org,2002:seq");
          const node = {
            kind: "sequence",
            tag,
            tagged,
            style,
            anchor,
            items: []
          };
          state.frames.push({
            kind: "sequence",
            node
          });
          break;
        }
      case EVENT_ID.MAPPING:
        {
          const {
            tag,
            tagged,
            style,
            anchor
          } = buildCollection(state, event, "tag:yaml.org,2002:map");
          const node = {
            kind: "mapping",
            tag,
            tagged,
            style,
            anchor,
            items: []
          };
          state.frames.push({
            kind: "mapping",
            node,
            key: null
          });
          break;
        }
      case EVENT_ID.ALIAS:
        addNode(state, {
          kind: "alias",
          anchor: state.source.slice(event.anchorStart, event.anchorEnd)
        });
        break;
      case EVENT_ID.POP:
        {
          const frame = state.frames.pop();
          if (frame.kind === "mapping" && frame.key) throw new Error("incomplete mapping pair in event stream");
          if (frame.kind === "document") state.documents.push(frame.doc);else addNode(state, frame.node);
          break;
        }
    }
  }
  return state.documents;
}
//#endregion
//#region src/index.ts
/** @deprecated Use `EVENT_ID.DOCUMENT` instead. @internal */
var EVENT_DOCUMENT = EVENT_ID.DOCUMENT;
/** @deprecated Use `EVENT_ID.SEQUENCE` instead. @internal */
var EVENT_SEQUENCE = EVENT_ID.SEQUENCE;
/** @deprecated Use `EVENT_ID.MAPPING` instead. @internal */
var EVENT_MAPPING = EVENT_ID.MAPPING;
/** @deprecated Use `EVENT_ID.SCALAR` instead. @internal */
var EVENT_SCALAR = EVENT_ID.SCALAR;
/** @deprecated Use `EVENT_ID.ALIAS` instead. @internal */
var EVENT_ALIAS = EVENT_ID.ALIAS;
/** @deprecated Use `EVENT_ID.POP` instead. @internal */
var EVENT_POP = EVENT_ID.POP;
/** @deprecated Use `SCALAR_STYLE.PLAIN` instead. @internal */
var SCALAR_STYLE_PLAIN = SCALAR_STYLE.PLAIN;
/** @deprecated Use `SCALAR_STYLE.SINGLE_QUOTED` instead. @internal */
var SCALAR_STYLE_SINGLE_QUOTED = SCALAR_STYLE.SINGLE_QUOTED;
/** @deprecated Use `SCALAR_STYLE.DOUBLE_QUOTED` instead. @internal */
var SCALAR_STYLE_DOUBLE_QUOTED = SCALAR_STYLE.DOUBLE_QUOTED;
/** @deprecated Use `SCALAR_STYLE.LITERAL_BLOCK` instead. @internal */
var SCALAR_STYLE_LITERAL_BLOCK = SCALAR_STYLE.LITERAL_BLOCK;
/** @deprecated Use `SCALAR_STYLE.FOLDED_BLOCK` instead. @internal */
var SCALAR_STYLE_FOLDED_BLOCK = SCALAR_STYLE.FOLDED_BLOCK;
/** @deprecated Use `COLLECTION_STYLE.BLOCK` instead. @internal */
var COLLECTION_STYLE_BLOCK = COLLECTION_STYLE.BLOCK;
/** @deprecated Use `COLLECTION_STYLE.FLOW` instead. @internal */
var COLLECTION_STYLE_FLOW = COLLECTION_STYLE.FLOW;
/** @deprecated Use `CHOMPING_MODE.CLIP` instead. @internal */
var CHOMPING_CLIP = CHOMPING_MODE.CLIP;
/** @deprecated Use `CHOMPING_MODE.STRIP` instead. @internal */
var CHOMPING_STRIP = CHOMPING_MODE.STRIP;
/** @deprecated Use `CHOMPING_MODE.KEEP` instead. @internal */
var CHOMPING_KEEP = CHOMPING_MODE.KEEP;
//#endregion
exports.CHOMPING_CLIP = CHOMPING_CLIP;
exports.CHOMPING_KEEP = CHOMPING_KEEP;
exports.CHOMPING_MODE = CHOMPING_MODE;
exports.CHOMPING_STRIP = CHOMPING_STRIP;
exports.COLLECTION_STYLE = COLLECTION_STYLE;
exports.COLLECTION_STYLE_BLOCK = COLLECTION_STYLE_BLOCK;
exports.COLLECTION_STYLE_FLOW = COLLECTION_STYLE_FLOW;
exports.CORE_SCHEMA = CORE_SCHEMA;
exports.DEFAULT_SCALAR_STYLE_RULES = DEFAULT_SCALAR_STYLE_RULES;
exports.DUMP_SCHEMA = DUMP_SCHEMA;
exports.EVENT_ALIAS = EVENT_ALIAS;
exports.EVENT_DOCUMENT = EVENT_DOCUMENT;
exports.EVENT_ID = EVENT_ID;
exports.EVENT_MAPPING = EVENT_MAPPING;
exports.EVENT_POP = EVENT_POP;
exports.EVENT_SCALAR = EVENT_SCALAR;
exports.EVENT_SEQUENCE = EVENT_SEQUENCE;
exports.FAILSAFE_SCHEMA = FAILSAFE_SCHEMA;
exports.JSON_SCHEMA = JSON_SCHEMA;
exports.NOT_RESOLVED = NOT_RESOLVED;
exports.SCALAR_STYLE = SCALAR_STYLE;
exports.SCALAR_STYLE_DOUBLE_QUOTED = SCALAR_STYLE_DOUBLE_QUOTED;
exports.SCALAR_STYLE_FOLDED_BLOCK = SCALAR_STYLE_FOLDED_BLOCK;
exports.SCALAR_STYLE_LITERAL_BLOCK = SCALAR_STYLE_LITERAL_BLOCK;
exports.SCALAR_STYLE_PLAIN = SCALAR_STYLE_PLAIN;
exports.SCALAR_STYLE_SINGLE_QUOTED = SCALAR_STYLE_SINGLE_QUOTED;
exports.Schema = Schema;
exports.VISIT_BREAK = VISIT_BREAK;
exports.VISIT_SKIP = VISIT_SKIP;
exports.YAML11_SCHEMA = YAML11_SCHEMA;
exports.YAMLException = YAMLException;
exports.binaryTag = binaryTag;
exports.boolCoreTag = boolCoreTag;
exports.boolJsonTag = boolJsonTag;
exports.boolYaml11Tag = boolYaml11Tag;
exports.constructFromEvents = constructFromEvents;
exports.defineMappingTag = defineMappingTag;
exports.defineScalarTag = defineScalarTag;
exports.defineSequenceTag = defineSequenceTag;
exports.dump = dump;
exports.eventsToAst = eventsToAst;
exports.floatCoreTag = floatCoreTag;
exports.floatJsonTag = floatJsonTag;
exports.floatYaml11Tag = floatYaml11Tag;
exports.getScalarValue = getScalarValue;
exports.intCoreTag = intCoreTag;
exports.intJsonTag = intJsonTag;
exports.intYaml11Tag = intYaml11Tag;
exports.jsToAst = jsToAst;
exports.legacyMapTag = legacyMapTag;
exports.load = load;
exports.loadAll = loadAll;
exports.mapTag = mapTag;
exports.mergeTag = mergeTag;
exports.nullCoreTag = nullCoreTag;
exports.nullJsonTag = nullJsonTag;
exports.nullYaml11Tag = nullYaml11Tag;
exports.omapTag = omapTag;
exports.pairsTag = pairsTag;
exports.parseEvents = parseEvents;
exports.present = present;
exports.realMapTag = realMapTag;
exports.seqTag = seqTag;
exports.setTag = setTag;
exports.strTag = strTag;
exports.timestampTag = timestampTag;
exports.visit = visit;

},{}],100:[function(require,module,exports){
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory) /* global define */
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.moo = factory()
  }
}(this, function() {
  'use strict';

  var hasOwnProperty = Object.prototype.hasOwnProperty
  var toString = Object.prototype.toString
  var hasSticky = typeof new RegExp().sticky === 'boolean'

  /***************************************************************************/

  function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
  function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

  function reEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, function(x) {
      if (x === '-') return '\\x2d'
      return '\\' + x
    })
  }
  function reGroups(s) {
    var re = new RegExp('|' + s)
    return re.exec('').length - 1
  }
  function reCapture(s) {
    return '(' + s + ')'
  }
  function reUnion(regexps) {
    if (!regexps.length) return '(?!)'
    var source =  regexps.map(function(s) {
      return "(?:" + s + ")"
    }).join('|')
    return "(?:" + source + ")"
  }

  function regexpOrLiteral(obj) {
    if (typeof obj === 'string') {
      return '(?:' + reEscape(obj) + ')'

    } else if (isRegExp(obj)) {
      // TODO: consider /u support
      if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
      if (obj.global) throw new Error('RegExp /g flag is implied')
      if (obj.sticky) throw new Error('RegExp /y flag is implied')
      if (obj.multiline) throw new Error('RegExp /m flag is implied')
      return obj.source

    } else {
      throw new Error('Not a pattern: ' + obj)
    }
  }

  function pad(s, length) {
    if (s.length > length) {
      return s
    }
    return Array(length - s.length + 1).join(" ") + s
  }

  function lastNLines(string, numLines) {
    var position = string.length
    var lineBreaks = 0;
    while (true) {
      var idx = string.lastIndexOf("\n", position - 1)
      if (idx === -1) {
        break;
      } else {
        lineBreaks++
      }
      position = idx
      if (lineBreaks === numLines) {
        break;
      }
      if (position === 0) {
        break;
      }
    }
    var startPosition = 
      lineBreaks < numLines ?
      0 : 
      position + 1
    return string.substring(startPosition).split("\n")
  }

  function objectToRules(object) {
    var keys = Object.getOwnPropertyNames(object)
    var result = []
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var thing = object[key]
      var rules = [].concat(thing)
      if (key === 'include') {
        for (var j = 0; j < rules.length; j++) {
          result.push({include: rules[j]})
        }
        continue
      }
      var match = []
      rules.forEach(function(rule) {
        if (isObject(rule)) {
          if (match.length) result.push(ruleOptions(key, match))
          result.push(ruleOptions(key, rule))
          match = []
        } else {
          match.push(rule)
        }
      })
      if (match.length) result.push(ruleOptions(key, match))
    }
    return result
  }

  function arrayToRules(array) {
    var result = []
    for (var i = 0; i < array.length; i++) {
      var obj = array[i]
      if (obj.include) {
        var include = [].concat(obj.include)
        for (var j = 0; j < include.length; j++) {
          result.push({include: include[j]})
        }
        continue
      }
      if (!obj.type) {
        throw new Error('Rule has no type: ' + JSON.stringify(obj))
      }
      result.push(ruleOptions(obj.type, obj))
    }
    return result
  }

  function ruleOptions(type, obj) {
    if (!isObject(obj)) {
      obj = { match: obj }
    }
    if (obj.include) {
      throw new Error('Matching rules cannot also include states')
    }

    // nb. error and fallback imply lineBreaks
    var options = {
      defaultType: type,
      lineBreaks: !!obj.error || !!obj.fallback,
      pop: false,
      next: null,
      push: null,
      error: false,
      fallback: false,
      value: null,
      type: null,
      shouldThrow: false,
    }

    // Avoid Object.assign(), so we support IE9+
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        options[key] = obj[key]
      }
    }

    // type transform cannot be a string
    if (typeof options.type === 'string' && type !== options.type) {
      throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
    }

    // convert to array
    var match = options.match
    options.match = Array.isArray(match) ? match : match ? [match] : []
    options.match.sort(function(a, b) {
      return isRegExp(a) && isRegExp(b) ? 0
           : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
    })
    return options
  }

  function toRules(spec) {
    return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
  }

  var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true})
  function compileRules(rules, hasStates) {
    var errorRule = null
    var fast = Object.create(null)
    var fastAllowed = true
    var unicodeFlag = null
    var groups = []
    var parts = []

    // If there is a fallback rule, then disable fast matching
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].fallback) {
        fastAllowed = false
      }
    }

    for (var i = 0; i < rules.length; i++) {
      var options = rules[i]

      if (options.include) {
        // all valid inclusions are removed by states() preprocessor
        throw new Error('Inheritance is not allowed in stateless lexers')
      }

      if (options.error || options.fallback) {
        // errorRule can only be set once
        if (errorRule) {
          if (!options.fallback === !errorRule.fallback) {
            throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
          } else {
            throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
          }
        }
        errorRule = options
      }

      var match = options.match.slice()
      if (fastAllowed) {
        while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
          var word = match.shift()
          fast[word.charCodeAt(0)] = options
        }
      }

      // Warn about inappropriate state-switching options
      if (options.pop || options.push || options.next) {
        if (!hasStates) {
          throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
        }
        if (options.fallback) {
          throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
        }
      }

      // Only rules with a .match are included in the RegExp
      if (match.length === 0) {
        continue
      }
      fastAllowed = false

      groups.push(options)

      // Check unicode flag is used everywhere or nowhere
      for (var j = 0; j < match.length; j++) {
        var obj = match[j]
        if (!isRegExp(obj)) {
          continue
        }

        if (unicodeFlag === null) {
          unicodeFlag = obj.unicode
        } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
          throw new Error('If one rule is /u then all must be')
        }
      }

      // convert to RegExp
      var pat = reUnion(match.map(regexpOrLiteral))

      // validate
      var regexp = new RegExp(pat)
      if (regexp.test("")) {
        throw new Error("RegExp matches empty string: " + regexp)
      }
      var groupCount = reGroups(pat)
      if (groupCount > 0) {
        throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
      }

      // try and detect rules matching newlines
      if (!options.lineBreaks && regexp.test('\n')) {
        throw new Error('Rule should declare lineBreaks: ' + regexp)
      }

      // store regex
      parts.push(reCapture(pat))
    }


    // If there's no fallback rule, use the sticky flag so we only look for
    // matches at the current index.
    //
    // If we don't support the sticky flag, then fake it using an irrefutable
    // match (i.e. an empty pattern).
    var fallbackRule = errorRule && errorRule.fallback
    var flags = hasSticky && !fallbackRule ? 'ym' : 'gm'
    var suffix = hasSticky || fallbackRule ? '' : '|'

    if (unicodeFlag === true) flags += "u"
    var combined = new RegExp(reUnion(parts) + suffix, flags)
    return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
  }

  function compile(rules) {
    var result = compileRules(toRules(rules))
    return new Lexer({start: result}, 'start')
  }

  function checkStateGroup(g, name, map) {
    var state = g && (g.push || g.next)
    if (state && !map[state]) {
      throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
    }
    if (g && g.pop && +g.pop !== 1) {
      throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
    }
  }
  function compileStates(states, start) {
    var all = states.$all ? toRules(states.$all) : []
    delete states.$all

    var keys = Object.getOwnPropertyNames(states)
    if (!start) start = keys[0]

    var ruleMap = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      ruleMap[key] = toRules(states[key]).concat(all)
    }
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var rules = ruleMap[key]
      var included = Object.create(null)
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j]
        if (!rule.include) continue
        var splice = [j, 1]
        if (rule.include !== key && !included[rule.include]) {
          included[rule.include] = true
          var newRules = ruleMap[rule.include]
          if (!newRules) {
            throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
          }
          for (var k = 0; k < newRules.length; k++) {
            var newRule = newRules[k]
            if (rules.indexOf(newRule) !== -1) continue
            splice.push(newRule)
          }
        }
        rules.splice.apply(rules, splice)
        j--
      }
    }

    var map = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      map[key] = compileRules(ruleMap[key], true)
    }

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i]
      var state = map[name]
      var groups = state.groups
      for (var j = 0; j < groups.length; j++) {
        checkStateGroup(groups[j], name, map)
      }
      var fastKeys = Object.getOwnPropertyNames(state.fast)
      for (var j = 0; j < fastKeys.length; j++) {
        checkStateGroup(state.fast[fastKeys[j]], name, map)
      }
    }

    return new Lexer(map, start)
  }

  function keywordTransform(map) {

    // Use a JavaScript Map to map keywords to their corresponding token type
    // unless Map is unsupported, then fall back to using an Object:
    var isMap = typeof Map !== 'undefined'
    var reverseMap = isMap ? new Map : Object.create(null)

    var types = Object.getOwnPropertyNames(map)
    for (var i = 0; i < types.length; i++) {
      var tokenType = types[i]
      var item = map[tokenType]
      var keywordList = Array.isArray(item) ? item : [item]
      keywordList.forEach(function(keyword) {
        if (typeof keyword !== 'string') {
          throw new Error("keyword must be string (in keyword '" + tokenType + "')")
        }
        if (isMap) {
          reverseMap.set(keyword, tokenType)
        } else {
          reverseMap[keyword] = tokenType
        }
      })
    }
    return function(k) {
      return isMap ? reverseMap.get(k) : reverseMap[k]
    }
  }

  /***************************************************************************/

  var Lexer = function(states, state) {
    this.startState = state
    this.states = states
    this.buffer = ''
    this.stack = []
    this.reset()
  }

  Lexer.prototype.reset = function(data, info) {
    this.buffer = data || ''
    this.index = 0
    this.line = info ? info.line : 1
    this.col = info ? info.col : 1
    this.queuedToken = info ? info.queuedToken : null
    this.queuedText = info ? info.queuedText: "";
    this.queuedThrow = info ? info.queuedThrow : null
    this.setState(info ? info.state : this.startState)
    this.stack = info && info.stack ? info.stack.slice() : []
    return this
  }

  Lexer.prototype.save = function() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
      stack: this.stack.slice(),
      queuedToken: this.queuedToken,
      queuedText: this.queuedText,
      queuedThrow: this.queuedThrow,
    }
  }

  Lexer.prototype.setState = function(state) {
    if (!state || this.state === state) return
    this.state = state
    var info = this.states[state]
    this.groups = info.groups
    this.error = info.error
    this.re = info.regexp
    this.fast = info.fast
  }

  Lexer.prototype.popState = function() {
    this.setState(this.stack.pop())
  }

  Lexer.prototype.pushState = function(state) {
    this.stack.push(this.state)
    this.setState(state)
  }

  var eat = hasSticky ? function(re, buffer) { // assume re is /y
    return re.exec(buffer)
  } : function(re, buffer) { // assume re is /g
    var match = re.exec(buffer)
    // will always match, since we used the |(?:) trick
    if (match[0].length === 0) {
      return null
    }
    return match
  }

  Lexer.prototype._getGroup = function(match) {
    var groupCount = this.groups.length
    for (var i = 0; i < groupCount; i++) {
      if (match[i + 1] !== undefined) {
        return this.groups[i]
      }
    }
    throw new Error('Cannot find token type for matched text')
  }

  function tokenToString() {
    return this.value
  }

  Lexer.prototype.next = function() {
    var index = this.index

    // If a fallback token matched, we don't need to re-run the RegExp
    if (this.queuedGroup) {
      var token = this._token(this.queuedGroup, this.queuedText, index)
      this.queuedGroup = null
      this.queuedText = ""
      return token
    }

    var buffer = this.buffer
    if (index === buffer.length) {
      return // EOF
    }

    // Fast matching for single characters
    var group = this.fast[buffer.charCodeAt(index)]
    if (group) {
      return this._token(group, buffer.charAt(index), index)
    }

    // Execute RegExp
    var re = this.re
    re.lastIndex = index
    var match = eat(re, buffer)

    // Error tokens match the remaining buffer
    var error = this.error
    if (match == null) {
      return this._token(error, buffer.slice(index, buffer.length), index)
    }

    var group = this._getGroup(match)
    var text = match[0]

    if (error.fallback && match.index !== index) {
      this.queuedGroup = group
      this.queuedText = text

      // Fallback tokens contain the unmatched portion of the buffer
      return this._token(error, buffer.slice(index, match.index), index)
    }

    return this._token(group, text, index)
  }

  Lexer.prototype._token = function(group, text, offset) {
    // count line breaks
    var lineBreaks = 0
    if (group.lineBreaks) {
      var matchNL = /\n/g
      var nl = 1
      if (text === '\n') {
        lineBreaks = 1
      } else {
        while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex }
      }
    }

    var token = {
      type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
      value: typeof group.value === 'function' ? group.value(text) : text,
      text: text,
      toString: tokenToString,
      offset: offset,
      lineBreaks: lineBreaks,
      line: this.line,
      col: this.col,
    }
    // nb. adding more props to token object will make V8 sad!

    var size = text.length
    this.index += size
    this.line += lineBreaks
    if (lineBreaks !== 0) {
      this.col = size - nl + 1
    } else {
      this.col += size
    }

    // throw, if no rule with {error: true}
    if (group.shouldThrow) {
      var err = new Error(this.formatError(token, "invalid syntax"))
      throw err;
    }

    if (group.pop) this.popState()
    else if (group.push) this.pushState(group.push)
    else if (group.next) this.setState(group.next)

    return token
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    var LexerIterator = function(lexer) {
      this.lexer = lexer
    }

    LexerIterator.prototype.next = function() {
      var token = this.lexer.next()
      return {value: token, done: !token}
    }

    LexerIterator.prototype[Symbol.iterator] = function() {
      return this
    }

    Lexer.prototype[Symbol.iterator] = function() {
      return new LexerIterator(this)
    }
  }

  Lexer.prototype.formatError = function(token, message) {
    if (token == null) {
      // An undefined token indicates EOF
      var text = this.buffer.slice(this.index)
      var token = {
        text: text,
        offset: this.index,
        lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
        line: this.line,
        col: this.col,
      }
    }
    
    var numLinesAround = 2
    var firstDisplayedLine = Math.max(token.line - numLinesAround, 1)
    var lastDisplayedLine = token.line + numLinesAround
    var lastLineDigits = String(lastDisplayedLine).length
    var displayedLines = lastNLines(
        this.buffer, 
        (this.line - token.line) + numLinesAround + 1
      )
      .slice(0, 5)
    var errorLines = []
    errorLines.push(message + " at line " + token.line + " col " + token.col + ":")
    errorLines.push("")
    for (var i = 0; i < displayedLines.length; i++) {
      var line = displayedLines[i]
      var lineNo = firstDisplayedLine + i
      errorLines.push(pad(String(lineNo), lastLineDigits) + "  " + line);
      if (lineNo === token.line) {
        errorLines.push(pad("", lastLineDigits + token.col + 1) + "^")
      }
    }
    return errorLines.join("\n")
  }

  Lexer.prototype.clone = function() {
    return new Lexer(this.states, this.state)
  }

  Lexer.prototype.has = function(tokenType) {
    return true
  }


  return {
    compile: compile,
    states: compileStates,
    error: Object.freeze({error: true}),
    fallback: Object.freeze({fallback: true}),
    keywords: keywordTransform,
  }

}));

},{}],101:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],102:[function(require,module,exports){
/* eslint-env browser */

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function syncFetch (...args) {
  const request = new syncFetch.Request(...args)

  const xhr = new XMLHttpRequest()
  xhr.withCredentials = request.credentials === 'include'
  xhr.timeout = request[INTERNALS].timeout

  // Request
  xhr.open(request.method, request.url, false)

  let useBinaryEncoding = false
  try {
    // Only allowed in Worker scope, not available in older browsers
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType#Synchronous_XHR_restrictions
    xhr.responseType = 'arraybuffer'
  } catch (e) {
    // Not in Worker scope; instead, attempt this alternative method
    // https://web.archive.org/web/20071103070418/http://mgran.blogspot.com/2006/08/downloading-binary-streams-with.html
    xhr.overrideMimeType('text/plain; charset=x-user-defined')
    useBinaryEncoding = true
  }

  for (const header of request.headers) {
    xhr.setRequestHeader(...header)
  }

  xhr.send(request[INTERNALS].body || null)

  // Response
  let headers = xhr.getAllResponseHeaders()
  headers = headers && headers.split('\r\n').filter(Boolean).map(header => header.split(': ', 2))

  let body = xhr.response
  if (useBinaryEncoding) {
    const buffer = new Uint8Array(body.length)
    for (let i = 0; i < body.length; i++) {
      buffer[i] = body.charCodeAt(i) & 0xff
    }
    body = buffer
  }

  const response = new syncFetch.Response(body, {
    headers,
    status: xhr.status,
    statusText: xhr.statusText
  })

  response[INTERNALS].url = xhr.responseURL
  response[INTERNALS].redirected = xhr.responseURL !== request.url

  return response
}

const INTERNALS = Symbol('SyncFetch Internals')
const REQ_UNSUPPORTED = ['mode', 'cache', 'redirect', 'referrer', 'integrity']
const HTTP_STATUS = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  426: 'Upgrade Required',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported'
}

class SyncRequest {
  constructor (resource, init = {}) {
    for (const option of REQ_UNSUPPORTED) {
      if (option in init) {
        throw new TypeError(`option ${option} not supported`)
      }
    }

    if (init.credentials === 'same-origin') {
      throw new TypeError('option credentials with value \'same-origin\' not supported')
    }

    this[INTERNALS] = {
      method: init.method || 'GET',
      headers: new syncFetch.Headers(init.headers),
      body: parseBody(init.body),
      credentials: init.credentials || 'omit',

      // Non-spec
      timeout: init.timeout || 0
    }

    if (typeof resource === 'string') {
      this[INTERNALS].url = resource
    } else if (resource instanceof SyncRequest) {
      this[INTERNALS].url = resource.url
      if (!init.method) {
        this[INTERNALS].method = resource.method
      }
      if (!init.headers) {
        this[INTERNALS].headers = resource.headers
      }
      if (!init.body) {
        this[INTERNALS].body = resource[INTERNALS].body
      }
      if (!init.credentials) {
        this[INTERNALS].credentials = resource.credentials
      }
    } else {
      throw new TypeError('Request input should be a URL string or a Request object')
    }
  }

  get cache () {
    return 'default'
  }

  get credentials () {
    return this[INTERNALS].credentials
  }

  get destination () {
    return ''
  }

  get headers () {
    return this[INTERNALS].headers
  }

  get integrity () {
    return ''
  }

  get method () {
    return this[INTERNALS].method
  }

  get mode () {
    return 'cors'
  }

  get priority () {
    return 'auto'
  }

  get redirect () {
    return 'follow'
  }

  get referrer () {
    return 'about:client'
  }

  get referrerPolicy () {
    return ''
  }

  get url () {
    return this[INTERNALS].url
  }

  clone () {
    checkBody(this)
    return new SyncRequest(this.url, this[INTERNALS])
  }
}

class SyncResponse {
  constructor (body, init = {}) {
    this[INTERNALS] = {
      body: parseBody(body),
      bodyUsed: false,

      headers: new syncFetch.Headers(init.headers),
      status: init.status,
      statusText: init.statusText
    }
  }

  get headers () {
    return this[INTERNALS].headers
  }

  get ok () {
    const status = this[INTERNALS].status
    return status >= 200 && status < 300
  }

  get redirected () {
    return this[INTERNALS].redirected
  }

  get status () {
    return this[INTERNALS].status
  }

  get statusText () {
    return this[INTERNALS].statusText
  }

  get url () {
    return this[INTERNALS].url
  }

  clone () {
    return this.redirect(this[INTERNALS].url, this[INTERNALS].status)
  }

  redirect (url, status) {
    checkBody(this)

    const response = new SyncResponse(this[INTERNALS].body, {
      headers: this[INTERNALS].headers,
      status: status || this[INTERNALS].status,
      statusText: HTTP_STATUS[status] || this[INTERNALS].statusText
    })

    response[INTERNALS].url = url || this[INTERNALS].url
    response[INTERNALS].redirected = this[INTERNALS].redirected

    return response
  }
}

class Body {
  constructor (body) {
    this[INTERNALS] = {
      body: parseBody(body),
      bodyUsed: false
    }
  }

  get bodyUsed () {
    return this[INTERNALS].bodyUsed
  }

  static mixin (prototype) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
      if (name === 'constructor') { continue }
      const desc = Object.getOwnPropertyDescriptor(Body.prototype, name)
      Object.defineProperty(prototype, name, { ...desc, enumerable: true })
    }
  }

  arrayBuffer () {
    const buffer = consumeBody(this)
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  }

  blob () {
    const type = this.headers && this.headers.get('content-type')
    return new Blob([consumeBody(this)], type && { type })
  }

  text () {
    return textDecoder.decode(consumeBody(this))
  }

  json () {
    try {
      return JSON.parse(this.text())
    } catch (err) {
      throw new TypeError(`invalid json response body at ${this.url} reason: ${err.message}`, 'invalid-json')
    }
  }
}

function checkBody (body) {
  if (body.bodyUsed) {
    throw new TypeError(`body used already for: ${body.url}`)
  }
}

function consumeBody (body) {
  checkBody(body)
  body[INTERNALS].bodyUsed = true
  return body[INTERNALS].body || new Uint8Array()
}

function parseBody (body) {
  if (typeof body === 'string') {
    return textEncoder.encode(body)
  } else if (body) {
    return body
  } else {
    return null
  }
}

Body.mixin(SyncRequest.prototype)
Body.mixin(SyncResponse.prototype)

class Headers {
  constructor (headers) {
    if (headers instanceof syncFetch.Headers) {
      this[INTERNALS] = { ...headers[INTERNALS] }
    } else {
      this[INTERNALS] = {}

      if (Array.isArray(headers)) {
        for (const [name, value] of headers) {
          this.append(name, value)
        }
      } else if (typeof headers === 'object') {
        for (const name in headers) {
          this.set(name, headers[name])
        }
      }
    }
  }

  // modification
  append (name, value) {
    name = name.toLowerCase()
    if (!this[INTERNALS][name]) {
      this[INTERNALS][name] = []
    }
    this[INTERNALS][name].push(value)
  }

  delete (name) {
    delete this[INTERNALS][name.toLowerCase()]
  }

  set (name, value) {
    this[INTERNALS][name.toLowerCase()] = [value]
  }

  // access
  entries () {
    const pairs = []
    for (const name in this[INTERNALS]) {
      for (const value of this[INTERNALS][name]) {
        pairs.push([name, value])
      }
    }
    return pairs
  }

  get (name) {
    name = name.toLowerCase()
    return name in this[INTERNALS] ? this[INTERNALS][name].join(', ') : null
  }

  keys () {
    return Object.keys(this[INTERNALS])
  }

  has (name) {
    return name.toLowerCase() in this[INTERNALS]
  }

  values () {
    const values = []
    for (const name in this[INTERNALS]) {
      for (const value of this[INTERNALS][name]) {
        values.push(value)
      }
    }
    return values
  }

  * [Symbol.iterator] () {
    for (const name in this[INTERNALS]) {
      for (const value of this[INTERNALS][name]) {
        yield [name, value]
      }
    }
  }
}

syncFetch.Headers = Headers
syncFetch.Request = SyncRequest
syncFetch.Response = SyncResponse
module.exports = syncFetch

},{}],"citation-js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Cite", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "logger", {
  enumerable: true,
  get: function () {
    return _logger.default;
  }
});
exports.version = exports.util = exports.plugins = void 0;
var _index = _interopRequireDefault(require("./Cite/index.js"));
var plugins = _interopRequireWildcard(require("./plugins/index.js"));
exports.plugins = plugins;
var util = _interopRequireWildcard(require("./util/index.js"));
exports.util = util;
var _logger = _interopRequireDefault(require("./logger.js"));
var _package = _interopRequireDefault(require("../package.json"));
require("./plugin-common/index.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const version = exports.version = _package.default.version;
},{"../package.json":42,"./Cite/index.js":3,"./logger.js":10,"./plugin-common/index.js":11,"./plugins/index.js":22,"./util/index.js":38}]},{},[50,73,76,79,81,84,85,89]);
