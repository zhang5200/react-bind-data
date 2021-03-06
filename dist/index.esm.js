import React__default, { useContext, useRef, useEffect, useCallback, useState, forwardRef, memo, Component, PureComponent } from 'react';
import _ from 'lodash';
import { unstable_batchedUpdates } from 'react-dom';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _extends.apply(this, arguments);
}

module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _extends = unwrapExports(_extends_1);

var DEFAULT_CONFIG = {
  // minimum relative difference between two compared values,
  // used by all comparison functions
  epsilon: 1e-12,
  // type of default matrix output. Choose 'matrix' (default) or 'array'
  matrix: 'Matrix',
  // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
  number: 'number',
  // number of significant digits in BigNumbers
  precision: 64,
  // predictable output type of functions. When true, output type depends only
  // on the input types. When false (default), output type can vary depending
  // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
  // predictable is false, and returns `NaN` when true.
  predictable: false,
  // random seed for seeded pseudo random number generation
  // null = randomly seed
  randomSeed: null
};

// type checks for all known types
//
// note that:
//
// - check by duck-typing on a property like `isUnit`, instead of checking instanceof.
//   instanceof cannot be used because that would not allow to pass data from
//   one instance of math.js to another since each has it's own instance of Unit.
// - check the `isUnit` property via the constructor, so there will be no
//   matches for "fake" instances like plain objects with a property `isUnit`.
//   That is important for security reasons.
// - It must not be possible to override the type checks used internally,
//   for security reasons, so these functions are not exposed in the expression
//   parser.
function isNumber(x) {
  return typeof x === 'number';
}
function isBigNumber(x) {
  if (!x || typeof x !== 'object' || typeof x.constructor !== 'function') {
    return false;
  }

  if (x.isBigNumber === true && typeof x.constructor.prototype === 'object' && x.constructor.prototype.isBigNumber === true) {
    return true;
  }

  if (typeof x.constructor.isDecimal === 'function' && x.constructor.isDecimal(x) === true) {
    return true;
  }

  return false;
}
function isComplex(x) {
  return x && typeof x === 'object' && Object.getPrototypeOf(x).isComplex === true || false;
}
function isFraction(x) {
  return x && typeof x === 'object' && Object.getPrototypeOf(x).isFraction === true || false;
}
function isUnit(x) {
  return x && x.constructor.prototype.isUnit === true || false;
}
function isString(x) {
  return typeof x === 'string';
}
var isArray = Array.isArray;
function isMatrix(x) {
  return x && x.constructor.prototype.isMatrix === true || false;
}
/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */

function isCollection(x) {
  return Array.isArray(x) || isMatrix(x);
}
function isDenseMatrix(x) {
  return x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isSparseMatrix(x) {
  return x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isRange(x) {
  return x && x.constructor.prototype.isRange === true || false;
}
function isIndex(x) {
  return x && x.constructor.prototype.isIndex === true || false;
}
function isBoolean(x) {
  return typeof x === 'boolean';
}
function isResultSet(x) {
  return x && x.constructor.prototype.isResultSet === true || false;
}
function isHelp(x) {
  return x && x.constructor.prototype.isHelp === true || false;
}
function isFunction(x) {
  return typeof x === 'function';
}
function isDate(x) {
  return x instanceof Date;
}
function isRegExp(x) {
  return x instanceof RegExp;
}
function isObject(x) {
  return !!(x && typeof x === 'object' && x.constructor === Object && !isComplex(x) && !isFraction(x));
}
function isNull(x) {
  return x === null;
}
function isUndefined(x) {
  return x === undefined;
}
function isAccessorNode(x) {
  return x && x.isAccessorNode === true && x.constructor.prototype.isNode === true || false;
}
function isArrayNode(x) {
  return x && x.isArrayNode === true && x.constructor.prototype.isNode === true || false;
}
function isAssignmentNode(x) {
  return x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isBlockNode(x) {
  return x && x.isBlockNode === true && x.constructor.prototype.isNode === true || false;
}
function isConditionalNode(x) {
  return x && x.isConditionalNode === true && x.constructor.prototype.isNode === true || false;
}
function isConstantNode(x) {
  return x && x.isConstantNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionAssignmentNode(x) {
  return x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionNode(x) {
  return x && x.isFunctionNode === true && x.constructor.prototype.isNode === true || false;
}
function isIndexNode(x) {
  return x && x.isIndexNode === true && x.constructor.prototype.isNode === true || false;
}
function isNode(x) {
  return x && x.isNode === true && x.constructor.prototype.isNode === true || false;
}
function isObjectNode(x) {
  return x && x.isObjectNode === true && x.constructor.prototype.isNode === true || false;
}
function isOperatorNode(x) {
  return x && x.isOperatorNode === true && x.constructor.prototype.isNode === true || false;
}
function isParenthesisNode(x) {
  return x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true || false;
}
function isRangeNode(x) {
  return x && x.isRangeNode === true && x.constructor.prototype.isNode === true || false;
}
function isSymbolNode(x) {
  return x && x.isSymbolNode === true && x.constructor.prototype.isNode === true || false;
}
function isChain(x) {
  return x && x.constructor.prototype.isChain === true || false;
}
function typeOf(x) {
  var t = typeof x;

  if (t === 'object') {
    // JavaScript types
    if (x === null) return 'null';
    if (Array.isArray(x)) return 'Array';
    if (x instanceof Date) return 'Date';
    if (x instanceof RegExp) return 'RegExp'; // math.js types

    if (isBigNumber(x)) return 'BigNumber';
    if (isComplex(x)) return 'Complex';
    if (isFraction(x)) return 'Fraction';
    if (isMatrix(x)) return 'Matrix';
    if (isUnit(x)) return 'Unit';
    if (isIndex(x)) return 'Index';
    if (isRange(x)) return 'Range';
    if (isResultSet(x)) return 'ResultSet';
    if (isNode(x)) return x.type;
    if (isChain(x)) return 'Chain';
    if (isHelp(x)) return 'Help';
    return 'Object';
  }

  if (t === 'function') return 'Function';
  return t; // can be 'string', 'number', 'boolean', ...
}

/**
 * Clone an object
 *
 *     clone(x)
 *
 * Can clone any primitive type, array, and object.
 * If x has a function clone, this function will be invoked to clone the object.
 *
 * @param {*} x
 * @return {*} clone
 */

function clone(x) {
  var type = typeof x; // immutable primitive types

  if (type === 'number' || type === 'string' || type === 'boolean' || x === null || x === undefined) {
    return x;
  } // use clone function of the object when available


  if (typeof x.clone === 'function') {
    return x.clone();
  } // array


  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Date) return new Date(x.valueOf());
  if (isBigNumber(x)) return x; // bignumbers are immutable

  if (x instanceof RegExp) throw new TypeError('Cannot clone ' + x); // TODO: clone a RegExp
  // object

  return mapObject(x, clone);
}
/**
 * Apply map to all properties of an object
 * @param {Object} object
 * @param {function} callback
 * @return {Object} Returns a copy of the object with mapped properties
 */

function mapObject(object, callback) {
  var clone = {};

  for (var key in object) {
    if (hasOwnProperty(object, key)) {
      clone[key] = callback(object[key]);
    }
  }

  return clone;
}
/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */

function extend(a, b) {
  for (var prop in b) {
    if (hasOwnProperty(b, prop)) {
      a[prop] = b[prop];
    }
  }

  return a;
}
/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * Compares values and functions strictly (ie. 2 is not the same as '2').
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */

function deepStrictEqual(a, b) {
  var prop, i, len;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!deepStrictEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  } else if (typeof a === 'function') {
    return a === b;
  } else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      // noinspection JSUnfilteredForInLoop
      if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
        return false;
      }
    }

    for (prop in b) {
      // noinspection JSUnfilteredForInLoop
      if (!(prop in a)) {
        return false;
      }
    }

    return true;
  } else {
    return a === b;
  }
}
/**
 * A safe hasOwnProperty
 * @param {Object} object
 * @param {string} property
 */

function hasOwnProperty(object, property) {
  return object && Object.hasOwnProperty.call(object, property);
}
/**
 * Shallow version of pick, creating an object composed of the picked object properties
 * but not for nested properties
 * @param {Object} object
 * @param {string[]} properties
 * @return {Object}
 */

function pickShallow(object, properties) {
  var copy = {};

  for (var i = 0; i < properties.length; i++) {
    var key = properties[i];
    var value = object[key];

    if (value !== undefined) {
      copy[key] = value;
    }
  }

  return copy;
}

var MATRIX_OPTIONS = ['Matrix', 'Array']; // valid values for option matrix

var NUMBER_OPTIONS = ['number', 'BigNumber', 'Fraction']; // valid values for option number

var config = /* #__PURE__ */function config(options) {
  if (options) {
    throw new Error('The global config is readonly. \n' + 'Please create a mathjs instance if you want to change the default configuration. \n' + 'Example:\n' + '\n' + '  import { create, all } from \'mathjs\';\n' + '  const mathjs = create(all);\n' + '  mathjs.config({ number: \'BigNumber\' });\n');
  }

  return Object.freeze(DEFAULT_CONFIG);
};

_extends(config, DEFAULT_CONFIG, {
  MATRIX_OPTIONS,
  NUMBER_OPTIONS
});

var typedFunction = createCommonjsModule(function (module, exports) {

(function (root, factory) {
  {
    // OldNode. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like OldNode.
    module.exports = factory();
  }
})(commonjsGlobal, function () {
  function ok() {
    return true;
  }

  function notOk() {
    return false;
  }

  function undef() {
    return undefined;
  }
  /**
   * @typedef {{
   *   params: Param[],
   *   fn: function
   * }} Signature
   *
   * @typedef {{
   *   types: Type[],
   *   restParam: boolean
   * }} Param
   *
   * @typedef {{
   *   name: string,
   *   typeIndex: number,
   *   test: function,
   *   conversion?: ConversionDef,
   *   conversionIndex: number,
   * }} Type
   *
   * @typedef {{
   *   from: string,
   *   to: string,
   *   convert: function (*) : *
   * }} ConversionDef
   *
   * @typedef {{
   *   name: string,
   *   test: function(*) : boolean
   * }} TypeDef
   */
  // create a new instance of typed-function


  function create() {
    // data type tests
    var _types = [{
      name: 'number',
      test: function (x) {
        return typeof x === 'number';
      }
    }, {
      name: 'string',
      test: function (x) {
        return typeof x === 'string';
      }
    }, {
      name: 'boolean',
      test: function (x) {
        return typeof x === 'boolean';
      }
    }, {
      name: 'Function',
      test: function (x) {
        return typeof x === 'function';
      }
    }, {
      name: 'Array',
      test: Array.isArray
    }, {
      name: 'Date',
      test: function (x) {
        return x instanceof Date;
      }
    }, {
      name: 'RegExp',
      test: function (x) {
        return x instanceof RegExp;
      }
    }, {
      name: 'Object',
      test: function (x) {
        return typeof x === 'object' && x !== null && x.constructor === Object;
      }
    }, {
      name: 'null',
      test: function (x) {
        return x === null;
      }
    }, {
      name: 'undefined',
      test: function (x) {
        return x === undefined;
      }
    }];
    var anyType = {
      name: 'any',
      test: ok
    }; // types which need to be ignored

    var _ignore = []; // type conversions

    var _conversions = []; // This is a temporary object, will be replaced with a typed function at the end

    var typed = {
      types: _types,
      conversions: _conversions,
      ignore: _ignore
    };
    /**
     * Find the test function for a type
     * @param {String} typeName
     * @return {TypeDef} Returns the type definition when found,
     *                    Throws a TypeError otherwise
     */

    function findTypeByName(typeName) {
      var entry = findInArray(typed.types, function (entry) {
        return entry.name === typeName;
      });

      if (entry) {
        return entry;
      }

      if (typeName === 'any') {
        // special baked-in case 'any'
        return anyType;
      }

      var hint = findInArray(typed.types, function (entry) {
        return entry.name.toLowerCase() === typeName.toLowerCase();
      });
      throw new TypeError('Unknown type "' + typeName + '"' + (hint ? '. Did you mean "' + hint.name + '"?' : ''));
    }
    /**
     * Find the index of a type definition. Handles special case 'any'
     * @param {TypeDef} type
     * @return {number}
     */


    function findTypeIndex(type) {
      if (type === anyType) {
        return 999;
      }

      return typed.types.indexOf(type);
    }
    /**
     * Find a type that matches a value.
     * @param {*} value
     * @return {string} Returns the name of the first type for which
     *                  the type test matches the value.
     */


    function findTypeName(value) {
      var entry = findInArray(typed.types, function (entry) {
        return entry.test(value);
      });

      if (entry) {
        return entry.name;
      }

      throw new TypeError('Value has unknown type. Value: ' + value);
    }
    /**
     * Find a specific signature from a (composed) typed function, for example:
     *
     *   typed.find(fn, ['number', 'string'])
     *   typed.find(fn, 'number, string')
     *
     * Function find only only works for exact matches.
     *
     * @param {Function} fn                   A typed-function
     * @param {string | string[]} signature   Signature to be found, can be
     *                                        an array or a comma separated string.
     * @return {Function}                     Returns the matching signature, or
     *                                        throws an error when no signature
     *                                        is found.
     */


    function find(fn, signature) {
      if (!fn.signatures) {
        throw new TypeError('Function is no typed-function');
      } // normalize input


      var arr;

      if (typeof signature === 'string') {
        arr = signature.split(',');

        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].trim();
        }
      } else if (Array.isArray(signature)) {
        arr = signature;
      } else {
        throw new TypeError('String array or a comma separated string expected');
      }

      var str = arr.join(','); // find an exact match

      var match = fn.signatures[str];

      if (match) {
        return match;
      } // TODO: extend find to match non-exact signatures


      throw new TypeError('Signature not found (signature: ' + (fn.name || 'unnamed') + '(' + arr.join(', ') + '))');
    }
    /**
     * Convert a given value to another data type.
     * @param {*} value
     * @param {string} type
     */


    function convert(value, type) {
      var from = findTypeName(value); // check conversion is needed

      if (type === from) {
        return value;
      }

      for (var i = 0; i < typed.conversions.length; i++) {
        var conversion = typed.conversions[i];

        if (conversion.from === from && conversion.to === type) {
          return conversion.convert(value);
        }
      }

      throw new Error('Cannot convert from ' + from + ' to ' + type);
    }
    /**
     * Stringify parameters in a normalized way
     * @param {Param[]} params
     * @return {string}
     */


    function stringifyParams(params) {
      return params.map(function (param) {
        var typeNames = param.types.map(getTypeName);
        return (param.restParam ? '...' : '') + typeNames.join('|');
      }).join(',');
    }
    /**
     * Parse a parameter, like "...number | boolean"
     * @param {string} param
     * @param {ConversionDef[]} conversions
     * @return {Param} param
     */


    function parseParam(param, conversions) {
      var restParam = param.indexOf('...') === 0;
      var types = !restParam ? param : param.length > 3 ? param.slice(3) : 'any';
      var typeNames = types.split('|').map(trim).filter(notEmpty).filter(notIgnore);
      var matchingConversions = filterConversions(conversions, typeNames);
      var exactTypes = typeNames.map(function (typeName) {
        var type = findTypeByName(typeName);
        return {
          name: typeName,
          typeIndex: findTypeIndex(type),
          test: type.test,
          conversion: null,
          conversionIndex: -1
        };
      });
      var convertibleTypes = matchingConversions.map(function (conversion) {
        var type = findTypeByName(conversion.from);
        return {
          name: conversion.from,
          typeIndex: findTypeIndex(type),
          test: type.test,
          conversion: conversion,
          conversionIndex: conversions.indexOf(conversion)
        };
      });
      return {
        types: exactTypes.concat(convertibleTypes),
        restParam: restParam
      };
    }
    /**
     * Parse a signature with comma separated parameters,
     * like "number | boolean, ...string"
     * @param {string} signature
     * @param {function} fn
     * @param {ConversionDef[]} conversions
     * @return {Signature | null} signature
     */


    function parseSignature(signature, fn, conversions) {
      var params = [];

      if (signature.trim() !== '') {
        params = signature.split(',').map(trim).map(function (param, index, array) {
          var parsedParam = parseParam(param, conversions);

          if (parsedParam.restParam && index !== array.length - 1) {
            throw new SyntaxError('Unexpected rest parameter "' + param + '": ' + 'only allowed for the last parameter');
          }

          return parsedParam;
        });
      }

      if (params.some(isInvalidParam)) {
        // invalid signature: at least one parameter has no types
        // (they may have been filtered)
        return null;
      }

      return {
        params: params,
        fn: fn
      };
    }
    /**
     * Test whether a set of params contains a restParam
     * @param {Param[]} params
     * @return {boolean} Returns true when the last parameter is a restParam
     */


    function hasRestParam(params) {
      var param = last(params);
      return param ? param.restParam : false;
    }
    /**
     * Test whether a parameter contains conversions
     * @param {Param} param
     * @return {boolean} Returns true when at least one of the parameters
     *                   contains a conversion.
     */


    function hasConversions(param) {
      return param.types.some(function (type) {
        return type.conversion != null;
      });
    }
    /**
     * Create a type test for a single parameter, which can have one or multiple
     * types.
     * @param {Param} param
     * @return {function(x: *) : boolean} Returns a test function
     */


    function compileTest(param) {
      if (!param || param.types.length === 0) {
        // nothing to do
        return ok;
      } else if (param.types.length === 1) {
        return findTypeByName(param.types[0].name).test;
      } else if (param.types.length === 2) {
        var test0 = findTypeByName(param.types[0].name).test;
        var test1 = findTypeByName(param.types[1].name).test;
        return function or(x) {
          return test0(x) || test1(x);
        };
      } else {
        // param.types.length > 2
        var tests = param.types.map(function (type) {
          return findTypeByName(type.name).test;
        });
        return function or(x) {
          for (var i = 0; i < tests.length; i++) {
            if (tests[i](x)) {
              return true;
            }
          }

          return false;
        };
      }
    }
    /**
     * Create a test for all parameters of a signature
     * @param {Param[]} params
     * @return {function(args: Array<*>) : boolean}
     */


    function compileTests(params) {
      var tests, test0, test1;

      if (hasRestParam(params)) {
        // variable arguments like '...number'
        tests = initial(params).map(compileTest);
        var varIndex = tests.length;
        var lastTest = compileTest(last(params));

        var testRestParam = function (args) {
          for (var i = varIndex; i < args.length; i++) {
            if (!lastTest(args[i])) {
              return false;
            }
          }

          return true;
        };

        return function testArgs(args) {
          for (var i = 0; i < tests.length; i++) {
            if (!tests[i](args[i])) {
              return false;
            }
          }

          return testRestParam(args) && args.length >= varIndex + 1;
        };
      } else {
        // no variable arguments
        if (params.length === 0) {
          return function testArgs(args) {
            return args.length === 0;
          };
        } else if (params.length === 1) {
          test0 = compileTest(params[0]);
          return function testArgs(args) {
            return test0(args[0]) && args.length === 1;
          };
        } else if (params.length === 2) {
          test0 = compileTest(params[0]);
          test1 = compileTest(params[1]);
          return function testArgs(args) {
            return test0(args[0]) && test1(args[1]) && args.length === 2;
          };
        } else {
          // arguments.length > 2
          tests = params.map(compileTest);
          return function testArgs(args) {
            for (var i = 0; i < tests.length; i++) {
              if (!tests[i](args[i])) {
                return false;
              }
            }

            return args.length === tests.length;
          };
        }
      }
    }
    /**
     * Find the parameter at a specific index of a signature.
     * Handles rest parameters.
     * @param {Signature} signature
     * @param {number} index
     * @return {Param | null} Returns the matching parameter when found,
     *                        null otherwise.
     */


    function getParamAtIndex(signature, index) {
      return index < signature.params.length ? signature.params[index] : hasRestParam(signature.params) ? last(signature.params) : null;
    }
    /**
     * Get all type names of a parameter
     * @param {Signature} signature
     * @param {number} index
     * @param {boolean} excludeConversions
     * @return {string[]} Returns an array with type names
     */


    function getExpectedTypeNames(signature, index, excludeConversions) {
      var param = getParamAtIndex(signature, index);
      var types = param ? excludeConversions ? param.types.filter(isExactType) : param.types : [];
      return types.map(getTypeName);
    }
    /**
     * Returns the name of a type
     * @param {Type} type
     * @return {string} Returns the type name
     */


    function getTypeName(type) {
      return type.name;
    }
    /**
     * Test whether a type is an exact type or conversion
     * @param {Type} type
     * @return {boolean} Returns true when
     */


    function isExactType(type) {
      return type.conversion === null || type.conversion === undefined;
    }
    /**
     * Helper function for creating error messages: create an array with
     * all available types on a specific argument index.
     * @param {Signature[]} signatures
     * @param {number} index
     * @return {string[]} Returns an array with available types
     */


    function mergeExpectedParams(signatures, index) {
      var typeNames = uniq(flatMap(signatures, function (signature) {
        return getExpectedTypeNames(signature, index, false);
      }));
      return typeNames.indexOf('any') !== -1 ? ['any'] : typeNames;
    }
    /**
     * Create
     * @param {string} name             The name of the function
     * @param {array.<*>} args          The actual arguments passed to the function
     * @param {Signature[]} signatures  A list with available signatures
     * @return {TypeError} Returns a type error with additional data
     *                     attached to it in the property `data`
     */


    function createError(name, args, signatures) {
      var err, expected;

      var _name = name || 'unnamed'; // test for wrong type at some index


      var matchingSignatures = signatures;
      var index;

      for (index = 0; index < args.length; index++) {
        var nextMatchingDefs = matchingSignatures.filter(function (signature) {
          var test = compileTest(getParamAtIndex(signature, index));
          return (index < signature.params.length || hasRestParam(signature.params)) && test(args[index]);
        });

        if (nextMatchingDefs.length === 0) {
          // no matching signatures anymore, throw error "wrong type"
          expected = mergeExpectedParams(matchingSignatures, index);

          if (expected.length > 0) {
            var actualType = findTypeName(args[index]);
            err = new TypeError('Unexpected type of argument in function ' + _name + ' (expected: ' + expected.join(' or ') + ', actual: ' + actualType + ', index: ' + index + ')');
            err.data = {
              category: 'wrongType',
              fn: _name,
              index: index,
              actual: actualType,
              expected: expected
            };
            return err;
          }
        } else {
          matchingSignatures = nextMatchingDefs;
        }
      } // test for too few arguments


      var lengths = matchingSignatures.map(function (signature) {
        return hasRestParam(signature.params) ? Infinity : signature.params.length;
      });

      if (args.length < Math.min.apply(null, lengths)) {
        expected = mergeExpectedParams(matchingSignatures, index);
        err = new TypeError('Too few arguments in function ' + _name + ' (expected: ' + expected.join(' or ') + ', index: ' + args.length + ')');
        err.data = {
          category: 'tooFewArgs',
          fn: _name,
          index: args.length,
          expected: expected
        };
        return err;
      } // test for too many arguments


      var maxLength = Math.max.apply(null, lengths);

      if (args.length > maxLength) {
        err = new TypeError('Too many arguments in function ' + _name + ' (expected: ' + maxLength + ', actual: ' + args.length + ')');
        err.data = {
          category: 'tooManyArgs',
          fn: _name,
          index: args.length,
          expectedLength: maxLength
        };
        return err;
      }

      err = new TypeError('Arguments of type "' + args.join(', ') + '" do not match any of the defined signatures of function ' + _name + '.');
      err.data = {
        category: 'mismatch',
        actual: args.map(findTypeName)
      };
      return err;
    }
    /**
     * Find the lowest index of all exact types of a parameter (no conversions)
     * @param {Param} param
     * @return {number} Returns the index of the lowest type in typed.types
     */


    function getLowestTypeIndex(param) {
      var min = 999;

      for (var i = 0; i < param.types.length; i++) {
        if (isExactType(param.types[i])) {
          min = Math.min(min, param.types[i].typeIndex);
        }
      }

      return min;
    }
    /**
     * Find the lowest index of the conversion of all types of the parameter
     * having a conversion
     * @param {Param} param
     * @return {number} Returns the lowest index of the conversions of this type
     */


    function getLowestConversionIndex(param) {
      var min = 999;

      for (var i = 0; i < param.types.length; i++) {
        if (!isExactType(param.types[i])) {
          min = Math.min(min, param.types[i].conversionIndex);
        }
      }

      return min;
    }
    /**
     * Compare two params
     * @param {Param} param1
     * @param {Param} param2
     * @return {number} returns a negative number when param1 must get a lower
     *                  index than param2, a positive number when the opposite,
     *                  or zero when both are equal
     */


    function compareParams(param1, param2) {
      var c; // compare having a rest parameter or not

      c = param1.restParam - param2.restParam;

      if (c !== 0) {
        return c;
      } // compare having conversions or not


      c = hasConversions(param1) - hasConversions(param2);

      if (c !== 0) {
        return c;
      } // compare the index of the types


      c = getLowestTypeIndex(param1) - getLowestTypeIndex(param2);

      if (c !== 0) {
        return c;
      } // compare the index of any conversion


      return getLowestConversionIndex(param1) - getLowestConversionIndex(param2);
    }
    /**
     * Compare two signatures
     * @param {Signature} signature1
     * @param {Signature} signature2
     * @return {number} returns a negative number when param1 must get a lower
     *                  index than param2, a positive number when the opposite,
     *                  or zero when both are equal
     */


    function compareSignatures(signature1, signature2) {
      var len = Math.min(signature1.params.length, signature2.params.length);
      var i;
      var c; // compare whether the params have conversions at all or not

      c = signature1.params.some(hasConversions) - signature2.params.some(hasConversions);

      if (c !== 0) {
        return c;
      } // next compare whether the params have conversions one by one


      for (i = 0; i < len; i++) {
        c = hasConversions(signature1.params[i]) - hasConversions(signature2.params[i]);

        if (c !== 0) {
          return c;
        }
      } // compare the types of the params one by one


      for (i = 0; i < len; i++) {
        c = compareParams(signature1.params[i], signature2.params[i]);

        if (c !== 0) {
          return c;
        }
      } // compare the number of params


      return signature1.params.length - signature2.params.length;
    }
    /**
     * Get params containing all types that can be converted to the defined types.
     *
     * @param {ConversionDef[]} conversions
     * @param {string[]} typeNames
     * @return {ConversionDef[]} Returns the conversions that are available
     *                        for every type (if any)
     */


    function filterConversions(conversions, typeNames) {
      var matches = {};
      conversions.forEach(function (conversion) {
        if (typeNames.indexOf(conversion.from) === -1 && typeNames.indexOf(conversion.to) !== -1 && !matches[conversion.from]) {
          matches[conversion.from] = conversion;
        }
      });
      return Object.keys(matches).map(function (from) {
        return matches[from];
      });
    }
    /**
     * Preprocess arguments before calling the original function:
     * - if needed convert the parameters
     * - in case of rest parameters, move the rest parameters into an Array
     * @param {Param[]} params
     * @param {function} fn
     * @return {function} Returns a wrapped function
     */


    function compileArgsPreprocessing(params, fn) {
      var fnConvert = fn; // TODO: can we make this wrapper function smarter/simpler?

      if (params.some(hasConversions)) {
        var restParam = hasRestParam(params);
        var compiledConversions = params.map(compileArgConversion);

        fnConvert = function convertArgs() {
          var args = [];
          var last = restParam ? arguments.length - 1 : arguments.length;

          for (var i = 0; i < last; i++) {
            args[i] = compiledConversions[i](arguments[i]);
          }

          if (restParam) {
            args[last] = arguments[last].map(compiledConversions[last]);
          }

          return fn.apply(this, args);
        };
      }

      var fnPreprocess = fnConvert;

      if (hasRestParam(params)) {
        var offset = params.length - 1;

        fnPreprocess = function preprocessRestParams() {
          return fnConvert.apply(this, slice(arguments, 0, offset).concat([slice(arguments, offset)]));
        };
      }

      return fnPreprocess;
    }
    /**
     * Compile conversion for a parameter to the right type
     * @param {Param} param
     * @return {function} Returns the wrapped function that will convert arguments
     *
     */


    function compileArgConversion(param) {
      var test0, test1, conversion0, conversion1;
      var tests = [];
      var conversions = [];
      param.types.forEach(function (type) {
        if (type.conversion) {
          tests.push(findTypeByName(type.conversion.from).test);
          conversions.push(type.conversion.convert);
        }
      }); // create optimized conversion functions depending on the number of conversions

      switch (conversions.length) {
        case 0:
          return function convertArg(arg) {
            return arg;
          };

        case 1:
          test0 = tests[0];
          conversion0 = conversions[0];
          return function convertArg(arg) {
            if (test0(arg)) {
              return conversion0(arg);
            }

            return arg;
          };

        case 2:
          test0 = tests[0];
          test1 = tests[1];
          conversion0 = conversions[0];
          conversion1 = conversions[1];
          return function convertArg(arg) {
            if (test0(arg)) {
              return conversion0(arg);
            }

            if (test1(arg)) {
              return conversion1(arg);
            }

            return arg;
          };

        default:
          return function convertArg(arg) {
            for (var i = 0; i < conversions.length; i++) {
              if (tests[i](arg)) {
                return conversions[i](arg);
              }
            }

            return arg;
          };
      }
    }
    /**
     * Convert an array with signatures into a map with signatures,
     * where signatures with union types are split into separate signatures
     *
     * Throws an error when there are conflicting types
     *
     * @param {Signature[]} signatures
     * @return {Object.<string, function>}  Returns a map with signatures
     *                                      as key and the original function
     *                                      of this signature as value.
     */


    function createSignaturesMap(signatures) {
      var signaturesMap = {};
      signatures.forEach(function (signature) {
        if (!signature.params.some(hasConversions)) {
          splitParams(signature.params, true).forEach(function (params) {
            signaturesMap[stringifyParams(params)] = signature.fn;
          });
        }
      });
      return signaturesMap;
    }
    /**
     * Split params with union types in to separate params.
     *
     * For example:
     *
     *     splitParams([['Array', 'Object'], ['string', 'RegExp'])
     *     // returns:
     *     // [
     *     //   ['Array', 'string'],
     *     //   ['Array', 'RegExp'],
     *     //   ['Object', 'string'],
     *     //   ['Object', 'RegExp']
     *     // ]
     *
     * @param {Param[]} params
     * @param {boolean} ignoreConversionTypes
     * @return {Param[]}
     */


    function splitParams(params, ignoreConversionTypes) {
      function _splitParams(params, index, types) {
        if (index < params.length) {
          var param = params[index];
          var filteredTypes = ignoreConversionTypes ? param.types.filter(isExactType) : param.types;
          var typeGroups;

          if (param.restParam) {
            // split the types of a rest parameter in two:
            // one with only exact types, and one with exact types and conversions
            var exactTypes = filteredTypes.filter(isExactType);
            typeGroups = exactTypes.length < filteredTypes.length ? [exactTypes, filteredTypes] : [filteredTypes];
          } else {
            // split all the types of a regular parameter into one type per group
            typeGroups = filteredTypes.map(function (type) {
              return [type];
            });
          } // recurse over the groups with types


          return flatMap(typeGroups, function (typeGroup) {
            return _splitParams(params, index + 1, types.concat([typeGroup]));
          });
        } else {
          // we've reached the end of the parameters. Now build a new Param
          var splittedParams = types.map(function (type, typeIndex) {
            return {
              types: type,
              restParam: typeIndex === params.length - 1 && hasRestParam(params)
            };
          });
          return [splittedParams];
        }
      }

      return _splitParams(params, 0, []);
    }
    /**
     * Test whether two signatures have a conflicting signature
     * @param {Signature} signature1
     * @param {Signature} signature2
     * @return {boolean} Returns true when the signatures conflict, false otherwise.
     */


    function hasConflictingParams(signature1, signature2) {
      var ii = Math.max(signature1.params.length, signature2.params.length);

      for (var i = 0; i < ii; i++) {
        var typesNames1 = getExpectedTypeNames(signature1, i, true);
        var typesNames2 = getExpectedTypeNames(signature2, i, true);

        if (!hasOverlap(typesNames1, typesNames2)) {
          return false;
        }
      }

      var len1 = signature1.params.length;
      var len2 = signature2.params.length;
      var restParam1 = hasRestParam(signature1.params);
      var restParam2 = hasRestParam(signature2.params);
      return restParam1 ? restParam2 ? len1 === len2 : len2 >= len1 : restParam2 ? len1 >= len2 : len1 === len2;
    }
    /**
     * Create a typed function
     * @param {String} name               The name for the typed function
     * @param {Object.<string, function>} signaturesMap
     *                                    An object with one or
     *                                    multiple signatures as key, and the
     *                                    function corresponding to the
     *                                    signature as value.
     * @return {function}  Returns the created typed function.
     */


    function createTypedFunction(name, signaturesMap) {
      if (Object.keys(signaturesMap).length === 0) {
        throw new SyntaxError('No signatures provided');
      } // parse the signatures, and check for conflicts


      var parsedSignatures = [];
      Object.keys(signaturesMap).map(function (signature) {
        return parseSignature(signature, signaturesMap[signature], typed.conversions);
      }).filter(notNull).forEach(function (parsedSignature) {
        // check whether this parameter conflicts with already parsed signatures
        var conflictingSignature = findInArray(parsedSignatures, function (s) {
          return hasConflictingParams(s, parsedSignature);
        });

        if (conflictingSignature) {
          throw new TypeError('Conflicting signatures "' + stringifyParams(conflictingSignature.params) + '" and "' + stringifyParams(parsedSignature.params) + '".');
        }

        parsedSignatures.push(parsedSignature);
      }); // split and filter the types of the signatures, and then order them

      var signatures = flatMap(parsedSignatures, function (parsedSignature) {
        var params = parsedSignature ? splitParams(parsedSignature.params, false) : [];
        return params.map(function (params) {
          return {
            params: params,
            fn: parsedSignature.fn
          };
        });
      }).filter(notNull);
      signatures.sort(compareSignatures); // we create a highly optimized checks for the first couple of signatures with max 2 arguments

      var ok0 = signatures[0] && signatures[0].params.length <= 2 && !hasRestParam(signatures[0].params);
      var ok1 = signatures[1] && signatures[1].params.length <= 2 && !hasRestParam(signatures[1].params);
      var ok2 = signatures[2] && signatures[2].params.length <= 2 && !hasRestParam(signatures[2].params);
      var ok3 = signatures[3] && signatures[3].params.length <= 2 && !hasRestParam(signatures[3].params);
      var ok4 = signatures[4] && signatures[4].params.length <= 2 && !hasRestParam(signatures[4].params);
      var ok5 = signatures[5] && signatures[5].params.length <= 2 && !hasRestParam(signatures[5].params);
      var allOk = ok0 && ok1 && ok2 && ok3 && ok4 && ok5; // compile the tests

      var tests = signatures.map(function (signature) {
        return compileTests(signature.params);
      });
      var test00 = ok0 ? compileTest(signatures[0].params[0]) : notOk;
      var test10 = ok1 ? compileTest(signatures[1].params[0]) : notOk;
      var test20 = ok2 ? compileTest(signatures[2].params[0]) : notOk;
      var test30 = ok3 ? compileTest(signatures[3].params[0]) : notOk;
      var test40 = ok4 ? compileTest(signatures[4].params[0]) : notOk;
      var test50 = ok5 ? compileTest(signatures[5].params[0]) : notOk;
      var test01 = ok0 ? compileTest(signatures[0].params[1]) : notOk;
      var test11 = ok1 ? compileTest(signatures[1].params[1]) : notOk;
      var test21 = ok2 ? compileTest(signatures[2].params[1]) : notOk;
      var test31 = ok3 ? compileTest(signatures[3].params[1]) : notOk;
      var test41 = ok4 ? compileTest(signatures[4].params[1]) : notOk;
      var test51 = ok5 ? compileTest(signatures[5].params[1]) : notOk; // compile the functions

      var fns = signatures.map(function (signature) {
        return compileArgsPreprocessing(signature.params, signature.fn);
      });
      var fn0 = ok0 ? fns[0] : undef;
      var fn1 = ok1 ? fns[1] : undef;
      var fn2 = ok2 ? fns[2] : undef;
      var fn3 = ok3 ? fns[3] : undef;
      var fn4 = ok4 ? fns[4] : undef;
      var fn5 = ok5 ? fns[5] : undef;
      var len0 = ok0 ? signatures[0].params.length : -1;
      var len1 = ok1 ? signatures[1].params.length : -1;
      var len2 = ok2 ? signatures[2].params.length : -1;
      var len3 = ok3 ? signatures[3].params.length : -1;
      var len4 = ok4 ? signatures[4].params.length : -1;
      var len5 = ok5 ? signatures[5].params.length : -1; // simple and generic, but also slow

      var iStart = allOk ? 6 : 0;
      var iEnd = signatures.length;

      var generic = function generic() {

        for (var i = iStart; i < iEnd; i++) {
          if (tests[i](arguments)) {
            return fns[i].apply(this, arguments);
          }
        }

        return typed.onMismatch(name, arguments, signatures);
      }; // create the typed function
      // fast, specialized version. Falls back to the slower, generic one if needed


      var fn = function fn(arg0, arg1) {

        if (arguments.length === len0 && test00(arg0) && test01(arg1)) {
          return fn0.apply(fn, arguments);
        }

        if (arguments.length === len1 && test10(arg0) && test11(arg1)) {
          return fn1.apply(fn, arguments);
        }

        if (arguments.length === len2 && test20(arg0) && test21(arg1)) {
          return fn2.apply(fn, arguments);
        }

        if (arguments.length === len3 && test30(arg0) && test31(arg1)) {
          return fn3.apply(fn, arguments);
        }

        if (arguments.length === len4 && test40(arg0) && test41(arg1)) {
          return fn4.apply(fn, arguments);
        }

        if (arguments.length === len5 && test50(arg0) && test51(arg1)) {
          return fn5.apply(fn, arguments);
        }

        return generic.apply(fn, arguments);
      }; // attach name the typed function


      try {
        Object.defineProperty(fn, 'name', {
          value: name
        });
      } catch (err) {// old browsers do not support Object.defineProperty and some don't support setting the name property
        // the function name is not essential for the functioning, it's mostly useful for debugging,
        // so it's fine to have unnamed functions.
      } // attach signatures to the function


      fn.signatures = createSignaturesMap(signatures);
      return fn;
    }
    /**
     * Action to take on mismatch
     * @param {string} name      Name of function that was attempted to be called
     * @param {Array} args       Actual arguments to the call
     * @param {Array} signatures Known signatures of the named typed-function
     */


    function _onMismatch(name, args, signatures) {
      throw createError(name, args, signatures);
    }
    /**
     * Test whether a type should be NOT be ignored
     * @param {string} typeName
     * @return {boolean}
     */


    function notIgnore(typeName) {
      return typed.ignore.indexOf(typeName) === -1;
    }
    /**
     * trim a string
     * @param {string} str
     * @return {string}
     */


    function trim(str) {
      return str.trim();
    }
    /**
     * Test whether a string is not empty
     * @param {string} str
     * @return {boolean}
     */


    function notEmpty(str) {
      return !!str;
    }
    /**
     * test whether a value is not strict equal to null
     * @param {*} value
     * @return {boolean}
     */


    function notNull(value) {
      return value !== null;
    }
    /**
     * Test whether a parameter has no types defined
     * @param {Param} param
     * @return {boolean}
     */


    function isInvalidParam(param) {
      return param.types.length === 0;
    }
    /**
     * Return all but the last items of an array
     * @param {Array} arr
     * @return {Array}
     */


    function initial(arr) {
      return arr.slice(0, arr.length - 1);
    }
    /**
     * return the last item of an array
     * @param {Array} arr
     * @return {*}
     */


    function last(arr) {
      return arr[arr.length - 1];
    }
    /**
     * Slice an array or function Arguments
     * @param {Array | Arguments | IArguments} arr
     * @param {number} start
     * @param {number} [end]
     * @return {Array}
     */


    function slice(arr, start, end) {
      return Array.prototype.slice.call(arr, start, end);
    }
    /**
     * Test whether an array contains some item
     * @param {Array} array
     * @param {*} item
     * @return {boolean} Returns true if array contains item, false if not.
     */


    function contains(array, item) {
      return array.indexOf(item) !== -1;
    }
    /**
     * Test whether two arrays have overlapping items
     * @param {Array} array1
     * @param {Array} array2
     * @return {boolean} Returns true when at least one item exists in both arrays
     */


    function hasOverlap(array1, array2) {
      for (var i = 0; i < array1.length; i++) {
        if (contains(array2, array1[i])) {
          return true;
        }
      }

      return false;
    }
    /**
     * Return the first item from an array for which test(arr[i]) returns true
     * @param {Array} arr
     * @param {function} test
     * @return {* | undefined} Returns the first matching item
     *                         or undefined when there is no match
     */


    function findInArray(arr, test) {
      for (var i = 0; i < arr.length; i++) {
        if (test(arr[i])) {
          return arr[i];
        }
      }

      return undefined;
    }
    /**
     * Filter unique items of an array with strings
     * @param {string[]} arr
     * @return {string[]}
     */


    function uniq(arr) {
      var entries = {};

      for (var i = 0; i < arr.length; i++) {
        entries[arr[i]] = true;
      }

      return Object.keys(entries);
    }
    /**
     * Flat map the result invoking a callback for every item in an array.
     * https://gist.github.com/samgiles/762ee337dff48623e729
     * @param {Array} arr
     * @param {function} callback
     * @return {Array}
     */


    function flatMap(arr, callback) {
      return Array.prototype.concat.apply([], arr.map(callback));
    }
    /**
     * Retrieve the function name from a set of typed functions,
     * and check whether the name of all functions match (if given)
     * @param {function[]} fns
     */


    function getName(fns) {
      var name = '';

      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i]; // check whether the names are the same when defined

        if ((typeof fn.signatures === 'object' || typeof fn.signature === 'string') && fn.name !== '') {
          if (name === '') {
            name = fn.name;
          } else if (name !== fn.name) {
            var err = new Error('Function names do not match (expected: ' + name + ', actual: ' + fn.name + ')');
            err.data = {
              actual: fn.name,
              expected: name
            };
            throw err;
          }
        }
      }

      return name;
    } // extract and merge all signatures of a list with typed functions


    function extractSignatures(fns) {
      var err;
      var signaturesMap = {};

      function validateUnique(_signature, _fn) {
        if (signaturesMap.hasOwnProperty(_signature) && _fn !== signaturesMap[_signature]) {
          err = new Error('Signature "' + _signature + '" is defined twice');
          err.data = {
            signature: _signature
          };
          throw err; // else: both signatures point to the same function, that's fine
        }
      }

      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i]; // test whether this is a typed-function

        if (typeof fn.signatures === 'object') {
          // merge the signatures
          for (var signature in fn.signatures) {
            if (fn.signatures.hasOwnProperty(signature)) {
              validateUnique(signature, fn.signatures[signature]);
              signaturesMap[signature] = fn.signatures[signature];
            }
          }
        } else if (typeof fn.signature === 'string') {
          validateUnique(fn.signature, fn);
          signaturesMap[fn.signature] = fn;
        } else {
          err = new TypeError('Function is no typed-function (index: ' + i + ')');
          err.data = {
            index: i
          };
          throw err;
        }
      }

      return signaturesMap;
    }

    typed = createTypedFunction('typed', {
      'string, Object': createTypedFunction,
      'Object': function (signaturesMap) {
        // find existing name
        var fns = [];

        for (var signature in signaturesMap) {
          if (signaturesMap.hasOwnProperty(signature)) {
            fns.push(signaturesMap[signature]);
          }
        }

        var name = getName(fns);
        return createTypedFunction(name, signaturesMap);
      },
      '...Function': function (fns) {
        return createTypedFunction(getName(fns), extractSignatures(fns));
      },
      'string, ...Function': function (name, fns) {
        return createTypedFunction(name, extractSignatures(fns));
      }
    });
    typed.create = create;
    typed.types = _types;
    typed.conversions = _conversions;
    typed.ignore = _ignore;
    typed.onMismatch = _onMismatch;
    typed.throwMismatchError = _onMismatch;
    typed.createError = createError;
    typed.convert = convert;
    typed.find = find;
    /**
     * add a type
     * @param {{name: string, test: function}} type
     * @param {boolean} [beforeObjectTest=true]
     *                          If true, the new test will be inserted before
     *                          the test with name 'Object' (if any), since
     *                          tests for Object match Array and classes too.
     */

    typed.addType = function (type, beforeObjectTest) {
      if (!type || typeof type.name !== 'string' || typeof type.test !== 'function') {
        throw new TypeError('Object with properties {name: string, test: function} expected');
      }

      if (beforeObjectTest !== false) {
        for (var i = 0; i < typed.types.length; i++) {
          if (typed.types[i].name === 'Object') {
            typed.types.splice(i, 0, type);
            return;
          }
        }
      }

      typed.types.push(type);
    }; // add a conversion


    typed.addConversion = function (conversion) {
      if (!conversion || typeof conversion.from !== 'string' || typeof conversion.to !== 'string' || typeof conversion.convert !== 'function') {
        throw new TypeError('Object with properties {from: string, to: string, convert: function} expected');
      }

      typed.conversions.push(conversion);
    };

    return typed;
  }

  return create();
});
});

/**
 * @typedef {{sign: '+' | '-' | '', coefficients: number[], exponent: number}} SplitValue
 */

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */

function isInteger(value) {
  if (typeof value === 'boolean') {
    return true;
  }

  return isFinite(value) ? value === Math.round(value) : false;
}
/**
 * Formats a number in a given base
 * @param {number} n
 * @param {number} base
 * @param {number} size
 * @returns {string}
 */

function formatNumberToBase(n, base, size) {
  var prefixes = {
    2: '0b',
    8: '0o',
    16: '0x'
  };
  var prefix = prefixes[base];
  var suffix = '';

  if (size) {
    if (size < 1) {
      throw new Error('size must be in greater than 0');
    }

    if (!isInteger(size)) {
      throw new Error('size must be an integer');
    }

    if (n > 2 ** (size - 1) - 1 || n < -(2 ** (size - 1))) {
      throw new Error("Value must be in range [-2^".concat(size - 1, ", 2^").concat(size - 1, "-1]"));
    }

    if (!isInteger(n)) {
      throw new Error('Value must be an integer');
    }

    if (n < 0) {
      n = n + 2 ** size;
    }

    suffix = "i".concat(size);
  }

  var sign = '';

  if (n < 0) {
    n = -n;
    sign = '-';
  }

  return "".concat(sign).concat(prefix).concat(n.toString(base)).concat(suffix);
}
/**
 * Convert a number to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'engineering'    Always use engineering notation.
 *                                          For example '123.4e+0' and '14.0e+6'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lowerExp` and `upperExp` bounds, and
 *                                          uses exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                         'bin', 'oct, or
 *                         'hex'            Format the number using binary, octal,
 *                                          or hexadecimal notation.
 *                                          For example '0b1101' and '0x10fe'.
 *                     {number} wordSize    The word size in bits to use for formatting
 *                                          in binary, octal, or hexadecimal notation.
 *                                          To be used only with 'bin', 'oct', or 'hex'
 *                                          values for 'notation' option. When this option
 *                                          is defined the value is formatted as a signed
 *                                          twos complement integer of the given word size
 *                                          and the size suffix is appended to the output.
 *                                          For example
 *                                          format(-1, {notation: 'hex', wordSize: 8}) === '0xffi8'.
 *                                          Default value is undefined.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential',
 *                                          'engineering', and 'auto',
 *                                          `precision` defines the total
 *                                          number of significant digits returned.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point.
 *                                          `precision` is undefined by default,
 *                                          not rounding any digits.
 *                     {number} lowerExp    Exponent determining the lower boundary
 *                                          for formatting a value with an exponent
 *                                          when `notation='auto`.
 *                                          Default value is `-3`.
 *                     {number} upperExp    Exponent determining the upper boundary
 *                                          for formatting a value with an exponent
 *                                          when `notation='auto`.
 *                                          Default value is `5`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4)                                        // '6.4'
 *    format(1240000)                                    // '1.24e6'
 *    format(1/3)                                        // '0.3333333333333333'
 *    format(1/3, 3)                                     // '0.333'
 *    format(21385, 2)                                   // '21000'
 *    format(12.071, {notation: 'fixed'})                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2})  // '2.30'
 *    format(52.8,   {notation: 'exponential'})          // '5.28e+1'
 *    format(12345678, {notation: 'engineering'})        // '12.345678e+6'
 *
 * @param {number} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */


function format(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  } // handle special cases


  if (value === Infinity) {
    return 'Infinity';
  } else if (value === -Infinity) {
    return '-Infinity';
  } else if (isNaN(value)) {
    return 'NaN';
  } // default values for options


  var notation = 'auto';
  var precision;
  var wordSize;

  if (options) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    } // determine precision from options


    if (isNumber(options)) {
      precision = options;
    } else if (isNumber(options.precision)) {
      precision = options.precision;
    }

    if (options.wordSize) {
      wordSize = options.wordSize;

      if (typeof wordSize !== 'number') {
        throw new Error('Option "wordSize" must be a number');
      }
    }
  } // handle the various notations


  switch (notation) {
    case 'fixed':
      return toFixed(value, precision);

    case 'exponential':
      return toExponential(value, precision);

    case 'engineering':
      return toEngineering(value, precision);

    case 'bin':
      return formatNumberToBase(value, 2, wordSize);

    case 'oct':
      return formatNumberToBase(value, 8, wordSize);

    case 'hex':
      return formatNumberToBase(value, 16, wordSize);

    case 'auto':
      // remove trailing zeros after the decimal point
      return toPrecision(value, precision, options && options).replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return digits !== '.' ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' + 'Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
  }
}
/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */

function splitNumber(value) {
  // parse the input value
  var match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);

  if (!match) {
    throw new SyntaxError('Invalid number ' + value);
  }

  var sign = match[1];
  var digits = match[2];
  var exponent = parseFloat(match[4] || '0');
  var dot = digits.indexOf('.');
  exponent += dot !== -1 ? dot - 1 : digits.length - 1;
  var coefficients = digits.replace('.', '') // remove the dot (must be removed before removing leading zeros)
  .replace(/^0*/, function (zeros) {
    // remove leading zeros, add their count to the exponent
    exponent -= zeros.length;
    return '';
  }).replace(/0*$/, '') // remove trailing zeros
  .split('').map(function (d) {
    return parseInt(d);
  });

  if (coefficients.length === 0) {
    coefficients.push(0);
    exponent++;
  }

  return {
    sign,
    coefficients,
    exponent
  };
}
/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]        Optional number of significant figures to return.
 */

function toEngineering(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  var split = splitNumber(value);
  var rounded = roundDigits(split, precision);
  var e = rounded.exponent;
  var c = rounded.coefficients; // find nearest lower multiple of 3 for exponent

  var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;

  if (isNumber(precision)) {
    // add zeroes to give correct sig figs
    while (precision > c.length || e - newExp + 1 > c.length) {
      c.push(0);
    }
  } else {
    // concatenate coefficients with necessary zeros
    // add zeros if necessary (for example: 1e+8 -> 100e+6)
    var missingZeros = Math.abs(e - newExp) - (c.length - 1);

    for (var i = 0; i < missingZeros; i++) {
      c.push(0);
    }
  } // find difference in exponents


  var expDiff = Math.abs(e - newExp);
  var decimalIdx = 1; // push decimal index over by expDiff times

  while (expDiff > 0) {
    decimalIdx++;
    expDiff--;
  } // if all coefficient values are zero after the decimal point and precision is unset, don't add a decimal value.
  // otherwise concat with the rest of the coefficients


  var decimals = c.slice(decimalIdx).join('');
  var decimalVal = isNumber(precision) && decimals.length || decimals.match(/[1-9]/) ? '.' + decimals : '';
  var str = c.slice(0, decimalIdx).join('') + decimalVal + 'e' + (e >= 0 ? '+' : '') + newExp.toString();
  return rounded.sign + str;
}
/**
 * Format a number with fixed notation.
 * @param {number | string} value
 * @param {number} [precision=undefined]  Optional number of decimals after the
 *                                        decimal point. null by default.
 */

function toFixed(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  var splitValue = splitNumber(value);
  var rounded = typeof precision === 'number' ? roundDigits(splitValue, splitValue.exponent + 1 + precision) : splitValue;
  var c = rounded.coefficients;
  var p = rounded.exponent + 1; // exponent may have changed
  // append zeros if needed

  var pp = p + (precision || 0);

  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  } // prepend zeros if needed


  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  } // insert a dot if needed


  if (p < c.length) {
    c.splice(p, 0, p === 0 ? '0.' : '.');
  }

  return rounded.sign + c.join('');
}
/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */

function toExponential(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  } // round if needed, else create a clone


  var split = splitNumber(value);
  var rounded = precision ? roundDigits(split, precision) : split;
  var c = rounded.coefficients;
  var e = rounded.exponent; // append zeros if needed

  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  } // format as `C.CCCe+EEE` or `C.CCCe-EEE`


  var first = c.shift();
  return rounded.sign + first + (c.length > 0 ? '.' + c.join('') : '') + 'e' + (e >= 0 ? '+' : '') + e;
}
/**
 * Format a number with a certain precision
 * @param {number | string} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lowerExp: number | undefined, upperExp: number | undefined}} [options]
 *                                       By default:
 *                                         lowerExp = -3 (incl)
 *                                         upper = +5 (excl)
 * @return {string}
 */

function toPrecision(value, precision, options) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  } // determine lower and upper bound for exponential notation.


  var lowerExp = options && options.lowerExp !== undefined ? options.lowerExp : -3;
  var upperExp = options && options.upperExp !== undefined ? options.upperExp : 5;
  var split = splitNumber(value);
  var rounded = precision ? roundDigits(split, precision) : split;

  if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
    // exponential notation
    return toExponential(value, precision);
  } else {
    var c = rounded.coefficients;
    var e = rounded.exponent; // append trailing zeros

    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    } // append trailing zeros
    // TODO: simplify the next statement


    c = c.concat(zeros(e - c.length + 1 + (c.length < precision ? precision - c.length : 0))); // prepend zeros

    c = zeros(-e).concat(c);
    var dot = e > 0 ? e : 0;

    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.');
    }

    return rounded.sign + c.join('');
  }
}
/**
 * Round the number of digits of a number *
 * @param {SplitValue} split       A value split with .splitNumber(value)
 * @param {number} precision  A positive integer
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 *              with rounded digits
 */

function roundDigits(split, precision) {
  // create a clone
  var rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  };
  var c = rounded.coefficients; // prepend zeros if needed

  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }

  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);

    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;

      while (c[i] === 10) {
        c.pop();

        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }

        i--;
        c[i]++;
      }
    }
  }

  return rounded;
}
/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */

function zeros(length) {
  var arr = [];

  for (var i = 0; i < length; i++) {
    arr.push(0);
  }

  return arr;
}
/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */


function digits(value) {
  return value.toExponential().replace(/e.*$/, '') // remove exponential notation
  .replace(/^0\.?0*|\./, '') // remove decimal point and leading zeros
  .length;
}
/**
 * Minimum number added to one that makes the result different than one
 */

var DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;
/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
*/

function nearlyEqual(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon === null || epsilon === undefined) {
    return x === y;
  }

  if (x === y) {
    return true;
  } // NaN


  if (isNaN(x) || isNaN(y)) {
    return false;
  } // at this point x and y should be finite


  if (isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x - y);

    if (diff < DBL_EPSILON) {
      return true;
    } else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
    }
  } // Infinite and Number or negative Infinite and positive Infinite cases


  return false;
}

/**
 * Formats a BigNumber in a given base
 * @param {BigNumber} n
 * @param {number} base
 * @param {number} size
 * @returns {string}
 */

function formatBigNumberToBase(n, base, size) {
  var BigNumberCtor = n.constructor;
  var big2 = new BigNumberCtor(2);
  var suffix = '';

  if (size) {
    if (size < 1) {
      throw new Error('size must be in greater than 0');
    }

    if (!isInteger(size)) {
      throw new Error('size must be an integer');
    }

    if (n.greaterThan(big2.pow(size - 1).sub(1)) || n.lessThan(big2.pow(size - 1).mul(-1))) {
      throw new Error("Value must be in range [-2^".concat(size - 1, ", 2^").concat(size - 1, "-1]"));
    }

    if (!n.isInteger()) {
      throw new Error('Value must be an integer');
    }

    if (n.lessThan(0)) {
      n = n.add(big2.pow(size));
    }

    suffix = "i".concat(size);
  }

  switch (base) {
    case 2:
      return "".concat(n.toBinary()).concat(suffix);

    case 8:
      return "".concat(n.toOctal()).concat(suffix);

    case 16:
      return "".concat(n.toHexadecimal()).concat(suffix);

    default:
      throw new Error("Base ".concat(base, " not supported "));
  }
}
/**
 * Convert a BigNumber to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                         'bin', 'oct, or
 *                         'hex'            Format the number using binary, octal,
 *                                          or hexadecimal notation.
 *                                          For example '0b1101' and '0x10fe'.
 *                     {number} wordSize    The word size in bits to use for formatting
 *                                          in binary, octal, or hexadecimal notation.
 *                                          To be used only with 'bin', 'oct', or 'hex'
 *                                          values for 'notation' option. When this option
 *                                          is defined the value is formatted as a signed
 *                                          twos complement integer of the given word size
 *                                          and the size suffix is appended to the output.
 *                                          For example
 *                                          format(-1, {notation: 'hex', wordSize: 8}) === '0xffi8'.
 *                                          Default value is undefined.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential',
 *                                          'engineering', and 'auto',
 *                                          `precision` defines the total
 *                                          number of significant digits returned.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point.
 *                                          `precision` is undefined by default.
 *                     {number} lowerExp    Exponent determining the lower boundary
 *                                          for formatting a value with an exponent
 *                                          when `notation='auto`.
 *                                          Default value is `-3`.
 *                     {number} upperExp    Exponent determining the upper boundary
 *                                          for formatting a value with an exponent
 *                                          when `notation='auto`.
 *                                          Default value is `5`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4)                                        // '6.4'
 *    format(1240000)                                    // '1.24e6'
 *    format(1/3)                                        // '0.3333333333333333'
 *    format(1/3, 3)                                     // '0.333'
 *    format(21385, 2)                                   // '21000'
 *    format(12e8, {notation: 'fixed'})                  // returns '1200000000'
 *    format(2.3,    {notation: 'fixed', precision: 4})  // returns '2.3000'
 *    format(52.8,   {notation: 'exponential'})          // returns '5.28e+1'
 *    format(12400,  {notation: 'engineering'})          // returns '12.400e+3'
 *
 * @param {BigNumber} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */


function format$1(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  } // handle special cases


  if (!value.isFinite()) {
    return value.isNaN() ? 'NaN' : value.gt(0) ? 'Infinity' : '-Infinity';
  } // default values for options


  var notation = 'auto';
  var precision;
  var wordSize;

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    } // determine precision from options


    if (typeof options === 'number') {
      precision = options;
    } else if (options.precision) {
      precision = options.precision;
    }

    if (options.wordSize) {
      wordSize = options.wordSize;

      if (typeof wordSize !== 'number') {
        throw new Error('Option "wordSize" must be a number');
      }
    }
  } // handle the various notations


  switch (notation) {
    case 'fixed':
      return toFixed$1(value, precision);

    case 'exponential':
      return toExponential$1(value, precision);

    case 'engineering':
      return toEngineering$1(value, precision);

    case 'bin':
      return formatBigNumberToBase(value, 2, wordSize);

    case 'oct':
      return formatBigNumberToBase(value, 8, wordSize);

    case 'hex':
      return formatBigNumberToBase(value, 16, wordSize);

    case 'auto':
      {
        // determine lower and upper bound for exponential notation.
        // TODO: implement support for upper and lower to be BigNumbers themselves
        var lowerExp = options && options.lowerExp !== undefined ? options.lowerExp : -3;
        var upperExp = options && options.upperExp !== undefined ? options.upperExp : 5; // handle special case zero

        if (value.isZero()) return '0'; // determine whether or not to output exponential notation

        var str;
        var rounded = value.toSignificantDigits(precision);
        var exp = rounded.e;

        if (exp >= lowerExp && exp < upperExp) {
          // normal number notation
          str = rounded.toFixed();
        } else {
          // exponential notation
          str = toExponential$1(value, precision);
        } // remove trailing zeros after the decimal point


        return str.replace(/((\.\d*?)(0+))($|e)/, function () {
          var digits = arguments[2];
          var e = arguments[4];
          return digits !== '.' ? digits + e : e;
        });
      }

    default:
      throw new Error('Unknown notation "' + notation + '". ' + 'Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
  }
}
/**
 * Format a BigNumber in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {BigNumber | string} value
 * @param {number} [precision]        Optional number of significant figures to return.
 */

function toEngineering$1(value, precision) {
  // find nearest lower multiple of 3 for exponent
  var e = value.e;
  var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3; // find difference in exponents, and calculate the value without exponent

  var valueWithoutExp = value.mul(Math.pow(10, -newExp));
  var valueStr = valueWithoutExp.toPrecision(precision);

  if (valueStr.indexOf('e') !== -1) {
    valueStr = valueWithoutExp.toString();
  }

  return valueStr + 'e' + (e >= 0 ? '+' : '') + newExp.toString();
}
/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {BigNumber} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */

function toExponential$1(value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1); // Note the offset of one
  } else {
    return value.toExponential();
  }
}
/**
 * Format a number with fixed notation.
 * @param {BigNumber} value
 * @param {number} [precision=undefined] Optional number of decimals after the
 *                                       decimal point. Undefined by default.
 */

function toFixed$1(value, precision) {
  return value.toFixed(precision);
}

/**
 * Format a value of any type into a string.
 *
 * Usage:
 *     math.format(value)
 *     math.format(value, precision)
 *     math.format(value, options)
 *
 * When value is a function:
 *
 * - When the function has a property `syntax`, it returns this
 *   syntax description.
 * - In other cases, a string `'function'` is returned.
 *
 * When `value` is an Object:
 *
 * - When the object contains a property `format` being a function, this
 *   function is invoked as `value.format(options)` and the result is returned.
 * - When the object has its own `toString` method, this method is invoked
 *   and the result is returned.
 * - In other cases the function will loop over all object properties and
 *   return JSON object notation like '{"a": 2, "b": 3}'.
 *
 * Example usage:
 *     math.format(2/7)                // '0.2857142857142857'
 *     math.format(math.pi, 3)         // '3.14'
 *     math.format(new Complex(2, 3))  // '2 + 3i'
 *     math.format('hello')            // '"hello"'
 *
 * @param {*} value             Value to be stringified
 * @param {Object | number | Function} [options]
 *     Formatting options. See src/utils/number.js:format for a
 *     description of the available options controlling number output.
 *     This generic "format" also supports the option property `truncate: NN`
 *     giving the maximum number NN of characters to return (if there would
 *     have been more, they are deleted and replaced by an ellipsis).
 * @return {string} str
 */

function format$2(value, options) {
  var result = _format(value, options);

  if (options && typeof options === 'object' && 'truncate' in options && result.length > options.truncate) {
    return result.substring(0, options.truncate - 3) + '...';
  }

  return result;
}

function _format(value, options) {
  if (typeof value === 'number') {
    return format(value, options);
  }

  if (isBigNumber(value)) {
    return format$1(value, options);
  } // note: we use unsafe duck-typing here to check for Fractions, this is
  // ok here since we're only invoking toString or concatenating its values


  if (looksLikeFraction(value)) {
    if (!options || options.fraction !== 'decimal') {
      // output as ratio, like '1/3'
      return value.s * value.n + '/' + value.d;
    } else {
      // output as decimal, like '0.(3)'
      return value.toString();
    }
  }

  if (Array.isArray(value)) {
    return formatArray(value, options);
  }

  if (isString(value)) {
    return '"' + value + '"';
  }

  if (typeof value === 'function') {
    return value.syntax ? String(value.syntax) : 'function';
  }

  if (value && typeof value === 'object') {
    if (typeof value.format === 'function') {
      return value.format(options);
    } else if (value && value.toString(options) !== {}.toString()) {
      // this object has a non-native toString method, use that one
      return value.toString(options);
    } else {
      var entries = Object.keys(value).map(key => {
        return '"' + key + '": ' + format$2(value[key], options);
      });
      return '{' + entries.join(', ') + '}';
    }
  }

  return String(value);
}
/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {string} str
 */

function formatArray(array, options) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;

    for (var i = 0; i < len; i++) {
      if (i !== 0) {
        str += ', ';
      }

      str += formatArray(array[i], options);
    }

    str += ']';
    return str;
  } else {
    return format$2(array, options);
  }
}
/**
 * Check whether a value looks like a Fraction (unsafe duck-type check)
 * @param {*} value
 * @return {boolean}
 */


function looksLikeFraction(value) {
  return value && typeof value === 'object' && typeof value.s === 'number' && typeof value.n === 'number' && typeof value.d === 'number' || false;
}

/**
 * Create a range error with the message:
 *     'Dimension mismatch (<actual size> != <expected size>)'
 * @param {number | number[]} actual        The actual size
 * @param {number | number[]} expected      The expected size
 * @param {string} [relation='!=']          Optional relation between actual
 *                                          and expected size: '!=', '<', etc.
 * @extends RangeError
 */
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.actual = actual;
  this.expected = expected;
  this.relation = relation;
  this.message = 'Dimension mismatch (' + (Array.isArray(actual) ? '[' + actual.join(', ') + ']' : actual) + ' ' + (this.relation || '!=') + ' ' + (Array.isArray(expected) ? '[' + expected.join(', ') + ']' : expected) + ')';
  this.stack = new Error().stack;
}
DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = 'DimensionError';
DimensionError.prototype.isDimensionError = true;

/**
 * Create a range error with the message:
 *     'Index out of range (index < min)'
 *     'Index out of range (index < max)'
 *
 * @param {number} index     The actual index
 * @param {number} [min=0]   Minimum index (included)
 * @param {number} [max]     Maximum index (excluded)
 * @extends RangeError
 */
function IndexError(index, min, max) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.index = index;

  if (arguments.length < 3) {
    this.min = 0;
    this.max = min;
  } else {
    this.min = min;
    this.max = max;
  }

  if (this.min !== undefined && this.index < this.min) {
    this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
  } else if (this.max !== undefined && this.index >= this.max) {
    this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
  } else {
    this.message = 'Index out of range (' + this.index + ')';
  }

  this.stack = new Error().stack;
}
IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = 'IndexError';
IndexError.prototype.isIndexError = true;

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x
 * @Return {Number[]} size
 */

function arraySize(x) {
  var s = [];

  while (Array.isArray(x)) {
    s.push(x.length);
    x = x[0];
  }

  return s;
}
/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim   Current dimension
 * @throws DimensionError
 * @private
 */

function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len !== size[dim]) {
    throw new DimensionError(len, size[dim]);
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;

    for (i = 0; i < len; i++) {
      var child = array[i];

      if (!Array.isArray(child)) {
        throw new DimensionError(size.length - 1, size.length, '<');
      }

      _validate(array[i], size, dimNext);
    }
  } else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size.length + 1, size.length, '>');
      }
    }
  }
}
/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */


function validate(array, size) {
  var isScalar = size.length === 0;

  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  } else {
    // array
    _validate(array, size, 0);
  }
}
/**
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */

function validateIndex(index, length) {
  if (!isNumber(index) || !isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }

  if (index < 0 || typeof length === 'number' && index >= length) {
    throw new IndexError(index, length);
  }
}
/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array} array         Array to be resized
 * @param {Array.<number>} size Array with the size of each dimension
 * @param {*} [defaultValue=0]  Value to be filled in in new entries,
 *                              zero by default. Specify for example `null`,
 *                              to clearly see entries that are not explicitly
 *                              set.
 * @return {Array} array         The resized array
 */

function resize(array, size, defaultValue) {
  // TODO: add support for scalars, having size=[] ?
  // check the type of the arguments
  if (!Array.isArray(array) || !Array.isArray(size)) {
    throw new TypeError('Array expected');
  }

  if (size.length === 0) {
    throw new Error('Resizing to scalar is not supported');
  } // check whether size contains positive integers


  size.forEach(function (value) {
    if (!isNumber(value) || !isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' + '(size: ' + format$2(size) + ')');
    }
  }); // recursively resize the array

  var _defaultValue = defaultValue !== undefined ? defaultValue : 0;

  _resize(array, size, 0, _defaultValue);

  return array;
}
/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {number[]} size       Array with the size of each dimension
 * @param {number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default.
 * @private
 */

function _resize(array, size, dim, defaultValue) {
  var i;
  var elem;
  var oldLen = array.length;
  var newLen = size[dim];
  var minLen = Math.min(oldLen, newLen); // apply new length

  array.length = newLen;

  if (dim < size.length - 1) {
    // non-last dimension
    var dimNext = dim + 1; // resize existing child arrays

    for (i = 0; i < minLen; i++) {
      // resize child array
      elem = array[i];

      if (!Array.isArray(elem)) {
        elem = [elem]; // add a dimension

        array[i] = elem;
      }

      _resize(elem, size, dimNext, defaultValue);
    } // create new child arrays


    for (i = minLen; i < newLen; i++) {
      // get child array
      elem = [];
      array[i] = elem; // resize new child array

      _resize(elem, size, dimNext, defaultValue);
    }
  } else {
    // last dimension
    // remove dimensions of existing values
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0];
      }
    } // fill new elements with the default value


    for (i = minLen; i < newLen; i++) {
      array[i] = defaultValue;
    }
  }
}
/**
 * Re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */


function reshape(array, sizes) {
  var flatArray = flatten(array);
  var currentLength = flatArray.length;

  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError('Array expected');
  }

  if (sizes.length === 0) {
    throw new DimensionError(0, currentLength, '!=');
  }

  sizes = processSizesWildcard(sizes, currentLength);
  var newLength = product(sizes);

  if (currentLength !== newLength) {
    throw new DimensionError(newLength, currentLength, '!=');
  }

  try {
    return _reshape(flatArray, sizes);
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(newLength, currentLength, '!=');
    }

    throw e;
  }
}
/**
 * Replaces the wildcard -1 in the sizes array.
 * @param {Array.<number>} sizes  List of sizes for each dimension. At most on wildcard.
 * @param {number} currentLength  Number of elements in the array.
 * @throws {Error}                If more than one wildcard or unable to replace it.
 * @returns {Array.<number>}      The sizes array with wildcard replaced.
 */

function processSizesWildcard(sizes, currentLength) {
  var newLength = product(sizes);
  var processedSizes = sizes.slice();
  var WILDCARD = -1;
  var wildCardIndex = sizes.indexOf(WILDCARD);
  var isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0;

  if (isMoreThanOneWildcard) {
    throw new Error('More than one wildcard in sizes');
  }

  var hasWildcard = wildCardIndex >= 0;
  var canReplaceWildcard = currentLength % newLength === 0;

  if (hasWildcard) {
    if (canReplaceWildcard) {
      processedSizes[wildCardIndex] = -currentLength / newLength;
    } else {
      throw new Error('Could not replace wildcard, since ' + currentLength + ' is no multiple of ' + -newLength);
    }
  }

  return processedSizes;
}
/**
 * Computes the product of all array elements.
 * @param {Array<number>} array Array of factors
 * @returns {number}            Product of all elements
 */

function product(array) {
  return array.reduce((prev, curr) => prev * curr, 1);
}
/**
 * Iteratively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 */


function _reshape(array, sizes) {
  // testing if there are enough elements for the requested shape
  var tmpArray = array;
  var tmpArray2; // for each dimensions starting by the last one and ignoring the first one

  for (var sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
    var size = sizes[sizeIndex];
    tmpArray2 = []; // aggregate the elements of the current tmpArray in elements of the requested size

    var length = tmpArray.length / size;

    for (var i = 0; i < length; i++) {
      tmpArray2.push(tmpArray.slice(i * size, (i + 1) * size));
    } // set it as the new tmpArray for the next loop turn or for return


    tmpArray = tmpArray2;
  }

  return tmpArray;
}
/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 *
 * Paramter `size` will be mutated to match the new, unqueezed matrix size.
 *
 * @param {Array} array
 * @param {number} dims       Desired number of dimensions of the array
 * @param {number} [outer]    Number of outer dimensions to be added
 * @param {Array} [size] Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */


function unsqueeze(array, dims, outer, size) {
  var s = size || arraySize(array); // unsqueeze outer dimensions

  if (outer) {
    for (var i = 0; i < outer; i++) {
      array = [array];
      s.unshift(1);
    }
  } // unsqueeze inner dimensions


  array = _unsqueeze(array, dims, 0);

  while (s.length < dims) {
    s.push(1);
  }

  return array;
}
/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */

function _unsqueeze(array, dims, dim) {
  var i, ii;

  if (Array.isArray(array)) {
    var next = dim + 1;

    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next);
    }
  } else {
    for (var d = dim; d < dims; d++) {
      array = [array];
    }
  }

  return array;
}
/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @return {Array}        The flattened array (1 dimensional)
 */


function flatten(array) {
  if (!Array.isArray(array)) {
    // if not an array, return as is
    return array;
  }

  var flat = [];
  array.forEach(function callback(value) {
    if (Array.isArray(value)) {
      value.forEach(callback); // traverse through sub-arrays recursively
    } else {
      flat.push(value);
    }
  });
  return flat;
}
/**
 * Check the datatype of a given object
 * This is a low level implementation that should only be used by
 * parent Matrix classes such as SparseMatrix or DenseMatrix
 * This method does not validate Array Matrix shape
 * @param {Array} array
 * @param {function} typeOf   Callback function to use to determine the type of a value
 * @return {string}
 */

function getArrayDataType(array, typeOf) {
  var type; // to hold type info

  var length = 0; // to hold length value to ensure it has consistent sizes

  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    var isArray = Array.isArray(item); // Saving the target matrix row size

    if (i === 0 && isArray) {
      length = item.length;
    } // If the current item is an array but the length does not equal the targetVectorSize


    if (isArray && item.length !== length) {
      return undefined;
    }

    var itemType = isArray ? getArrayDataType(item, typeOf) // recurse into a nested array
    : typeOf(item);

    if (type === undefined) {
      type = itemType; // first item
    } else if (type !== itemType) {
      return 'mixed';
    }
  }

  return type;
}

/**
 * Create a factory function, which can be used to inject dependencies.
 *
 * The created functions are memoized, a consecutive call of the factory
 * with the exact same inputs will return the same function instance.
 * The memoized cache is exposed on `factory.cache` and can be cleared
 * if needed.
 *
 * Example:
 *
 *     const name = 'log'
 *     const dependencies = ['config', 'typed', 'divideScalar', 'Complex']
 *
 *     export const createLog = factory(name, dependencies, ({ typed, config, divideScalar, Complex }) => {
 *       // ... create the function log here and return it
 *     }
 *
 * @param {string} name           Name of the function to be created
 * @param {string[]} dependencies The names of all required dependencies
 * @param {function} create       Callback function called with an object with all dependencies
 * @param {Object} [meta]         Optional object with meta information that will be attached
 *                                to the created factory function as property `meta`.
 * @returns {function}
 */

function factory(name, dependencies, create, meta) {
  function assertAndCreate(scope) {
    // we only pass the requested dependencies to the factory function
    // to prevent functions to rely on dependencies that are not explicitly
    // requested.
    var deps = pickShallow(scope, dependencies.map(stripOptionalNotation));
    assertDependencies(name, dependencies, scope);
    return create(deps);
  }

  assertAndCreate.isFactory = true;
  assertAndCreate.fn = name;
  assertAndCreate.dependencies = dependencies.slice().sort();

  if (meta) {
    assertAndCreate.meta = meta;
  }

  return assertAndCreate;
}
/**
 * Assert that all dependencies of a list with dependencies are available in the provided scope.
 *
 * Will throw an exception when there are dependencies missing.
 *
 * @param {string} name   Name for the function to be created. Used to generate a useful error message
 * @param {string[]} dependencies
 * @param {Object} scope
 */

function assertDependencies(name, dependencies, scope) {
  var allDefined = dependencies.filter(dependency => !isOptionalDependency(dependency)) // filter optionals
  .every(dependency => scope[dependency] !== undefined);

  if (!allDefined) {
    var missingDependencies = dependencies.filter(dependency => scope[dependency] === undefined); // TODO: create a custom error class for this, a MathjsError or something like that

    throw new Error("Cannot create function \"".concat(name, "\", ") + "some dependencies are missing: ".concat(missingDependencies.map(d => "\"".concat(d, "\"")).join(', '), "."));
  }
}
function isOptionalDependency(dependency) {
  return dependency && dependency[0] === '?';
}
function stripOptionalNotation(dependency) {
  return dependency && dependency[0] === '?' ? dependency.slice(1) : dependency;
}

/**
 * Get a property of a plain object
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */

function getSafeProperty(object, prop) {
  // only allow getting safe properties of a plain object
  if (isPlainObject(object) && isSafeProperty(object, prop)) {
    return object[prop];
  }

  if (typeof object[prop] === 'function' && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }

  throw new Error('No access to property "' + prop + '"');
}
/**
 * Set a property on a plain object.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */
// TODO: merge this function into access.js?


function setSafeProperty(object, prop, value) {
  // only allow setting safe properties of a plain object
  if (isPlainObject(object) && isSafeProperty(object, prop)) {
    object[prop] = value;
    return value;
  }

  throw new Error('No access to property "' + prop + '"');
}

function hasSafeProperty(object, prop) {
  return prop in object;
}
/**
 * Test whether a property is safe to use for an object.
 * For example .toString and .constructor are not safe
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */


function isSafeProperty(object, prop) {
  if (!object || typeof object !== 'object') {
    return false;
  } // SAFE: whitelisted
  // e.g length


  if (hasOwnProperty(safeNativeProperties, prop)) {
    return true;
  } // UNSAFE: inherited from Object prototype
  // e.g constructor


  if (prop in Object.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Object.prototype is a root object
    return false;
  } // UNSAFE: inherited from Function prototype
  // e.g call, apply


  if (prop in Function.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Function.prototype is a root object
    return false;
  }

  return true;
}
/**
 * Check whether a method is safe.
 * Throws an error when that's not the case (for example for `constructor`).
 * @param {Object} object
 * @param {string} method
 * @return {boolean} Returns true when safe, false otherwise
 */


function isSafeMethod(object, method) {
  if (object === null || object === undefined || typeof object[method] !== 'function') {
    return false;
  } // UNSAFE: ghosted
  // e.g overridden toString
  // Note that IE10 doesn't support __proto__ and we can't do this check there.


  if (hasOwnProperty(object, method) && Object.getPrototypeOf && method in Object.getPrototypeOf(object)) {
    return false;
  } // SAFE: whitelisted
  // e.g toString


  if (hasOwnProperty(safeNativeMethods, method)) {
    return true;
  } // UNSAFE: inherited from Object prototype
  // e.g constructor


  if (method in Object.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Object.prototype is a root object
    return false;
  } // UNSAFE: inherited from Function prototype
  // e.g call, apply


  if (method in Function.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Function.prototype is a root object
    return false;
  }

  return true;
}

function isPlainObject(object) {
  return typeof object === 'object' && object && object.constructor === Object;
}

var safeNativeProperties = {
  length: true,
  name: true
};
var safeNativeMethods = {
  toString: true,
  valueOf: true,
  toLocaleString: true
};

/**
 * A map facade on a bare object.
 *
 * The small number of methods needed to implement a scope,
 * forwarding on to the SafeProperty functions. Over time, the codebase
 * will stop using this method, as all objects will be Maps, rather than
 * more security prone objects.
 */

class ObjectWrappingMap {
  constructor(object) {
    this.wrappedObject = object;
  }

  keys() {
    return Object.keys(this.wrappedObject);
  }

  get(key) {
    return getSafeProperty(this.wrappedObject, key);
  }

  set(key, value) {
    setSafeProperty(this.wrappedObject, key, value);
    return this;
  }

  has(key) {
    return hasSafeProperty(this.wrappedObject, key);
  }

}
/**
 * Returns `true` if the passed object appears to be a Map (i.e. duck typing).
 *
 * Methods looked for are `get`, `set`, `keys` and `has`.
 *
 * @param {Map | object} object
 * @returns
 */

function isMap(object) {
  // We can use the fast instanceof, or a slower duck typing check.
  // The duck typing method needs to cover enough methods to not be confused with DenseMatrix.
  if (!object) {
    return false;
  }

  return object instanceof Map || object instanceof ObjectWrappingMap || typeof object.set === 'function' && typeof object.get === 'function' && typeof object.keys === 'function' && typeof object.has === 'function';
}

/**
 * Create a typed-function which checks the types of the arguments and
 * can match them against multiple provided signatures. The typed-function
 * automatically converts inputs in order to find a matching signature.
 * Typed functions throw informative errors in case of wrong input arguments.
 *
 * See the library [typed-function](https://github.com/josdejong/typed-function)
 * for detailed documentation.
 *
 * Syntax:
 *
 *     math.typed(name, signatures) : function
 *     math.typed(signatures) : function
 *
 * Examples:
 *
 *     // create a typed function with multiple types per argument (type union)
 *     const fn2 = typed({
 *       'number | boolean': function (b) {
 *         return 'b is a number or boolean'
 *       },
 *       'string, number | boolean': function (a, b) {
 *         return 'a is a string, b is a number or boolean'
 *       }
 *     })
 *
 *     // create a typed function with an any type argument
 *     const log = typed({
 *       'string, any': function (event, data) {
 *         console.log('event: ' + event + ', data: ' + JSON.stringify(data))
 *       }
 *     })
 *
 * @param {string} [name]                          Optional name for the typed-function
 * @param {Object<string, function>} signatures   Object with one or multiple function signatures
 * @returns {function} The created typed-function.
 */

var _createTyped2 = function _createTyped() {
  // initially, return the original instance of typed-function
  // consecutively, return a new instance from typed.create.
  _createTyped2 = typedFunction.create;
  return typedFunction;
};

var dependencies = ['?BigNumber', '?Complex', '?DenseMatrix', '?Fraction'];
/**
 * Factory function for creating a new typed instance
 * @param {Object} dependencies   Object with data types like Complex and BigNumber
 * @returns {Function}
 */

var createTyped = /* #__PURE__ */factory('typed', dependencies, function createTyped(_ref) {
  var {
    BigNumber,
    Complex,
    DenseMatrix,
    Fraction
  } = _ref; // TODO: typed-function must be able to silently ignore signatures with unknown data types
  // get a new instance of typed-function

  var typed = _createTyped2(); // define all types. The order of the types determines in which order function
  // arguments are type-checked (so for performance it's important to put the
  // most used types first).


  typed.types = [{
    name: 'number',
    test: isNumber
  }, {
    name: 'Complex',
    test: isComplex
  }, {
    name: 'BigNumber',
    test: isBigNumber
  }, {
    name: 'Fraction',
    test: isFraction
  }, {
    name: 'Unit',
    test: isUnit
  }, {
    name: 'string',
    test: isString
  }, {
    name: 'Chain',
    test: isChain
  }, {
    name: 'Array',
    test: isArray
  }, {
    name: 'Matrix',
    test: isMatrix
  }, {
    name: 'DenseMatrix',
    test: isDenseMatrix
  }, {
    name: 'SparseMatrix',
    test: isSparseMatrix
  }, {
    name: 'Range',
    test: isRange
  }, {
    name: 'Index',
    test: isIndex
  }, {
    name: 'boolean',
    test: isBoolean
  }, {
    name: 'ResultSet',
    test: isResultSet
  }, {
    name: 'Help',
    test: isHelp
  }, {
    name: 'function',
    test: isFunction
  }, {
    name: 'Date',
    test: isDate
  }, {
    name: 'RegExp',
    test: isRegExp
  }, {
    name: 'null',
    test: isNull
  }, {
    name: 'undefined',
    test: isUndefined
  }, {
    name: 'AccessorNode',
    test: isAccessorNode
  }, {
    name: 'ArrayNode',
    test: isArrayNode
  }, {
    name: 'AssignmentNode',
    test: isAssignmentNode
  }, {
    name: 'BlockNode',
    test: isBlockNode
  }, {
    name: 'ConditionalNode',
    test: isConditionalNode
  }, {
    name: 'ConstantNode',
    test: isConstantNode
  }, {
    name: 'FunctionNode',
    test: isFunctionNode
  }, {
    name: 'FunctionAssignmentNode',
    test: isFunctionAssignmentNode
  }, {
    name: 'IndexNode',
    test: isIndexNode
  }, {
    name: 'Node',
    test: isNode
  }, {
    name: 'ObjectNode',
    test: isObjectNode
  }, {
    name: 'OperatorNode',
    test: isOperatorNode
  }, {
    name: 'ParenthesisNode',
    test: isParenthesisNode
  }, {
    name: 'RangeNode',
    test: isRangeNode
  }, {
    name: 'SymbolNode',
    test: isSymbolNode
  }, {
    name: 'Map',
    test: isMap
  }, {
    name: 'Object',
    test: isObject
  } // order 'Object' last, it matches on other classes too
  ];
  typed.conversions = [{
    from: 'number',
    to: 'BigNumber',
    convert: function convert(x) {
      if (!BigNumber) {
        throwNoBignumber(x);
      } // note: conversion from number to BigNumber can fail if x has >15 digits


      if (digits(x) > 15) {
        throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
      }

      return new BigNumber(x);
    }
  }, {
    from: 'number',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      return new Complex(x, 0);
    }
  }, {
    from: 'number',
    to: 'string',
    convert: function convert(x) {
      return x + '';
    }
  }, {
    from: 'BigNumber',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      return new Complex(x.toNumber(), 0);
    }
  }, {
    from: 'Fraction',
    to: 'BigNumber',
    convert: function convert(x) {
      throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' + 'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.');
    }
  }, {
    from: 'Fraction',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      return new Complex(x.valueOf(), 0);
    }
  }, {
    from: 'number',
    to: 'Fraction',
    convert: function convert(x) {
      if (!Fraction) {
        throwNoFraction(x);
      }

      var f = new Fraction(x);

      if (f.valueOf() !== x) {
        throw new TypeError('Cannot implicitly convert a number to a Fraction when there will be a loss of precision ' + '(value: ' + x + '). ' + 'Use function fraction(x) to convert to Fraction.');
      }

      return f;
    }
  }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf()
    //  }
    // }, {
    from: 'string',
    to: 'number',
    convert: function convert(x) {
      var n = Number(x);

      if (isNaN(n)) {
        throw new Error('Cannot convert "' + x + '" to a number');
      }

      return n;
    }
  }, {
    from: 'string',
    to: 'BigNumber',
    convert: function convert(x) {
      if (!BigNumber) {
        throwNoBignumber(x);
      }

      try {
        return new BigNumber(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to BigNumber');
      }
    }
  }, {
    from: 'string',
    to: 'Fraction',
    convert: function convert(x) {
      if (!Fraction) {
        throwNoFraction(x);
      }

      try {
        return new Fraction(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to Fraction');
      }
    }
  }, {
    from: 'string',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      try {
        return new Complex(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to Complex');
      }
    }
  }, {
    from: 'boolean',
    to: 'number',
    convert: function convert(x) {
      return +x;
    }
  }, {
    from: 'boolean',
    to: 'BigNumber',
    convert: function convert(x) {
      if (!BigNumber) {
        throwNoBignumber(x);
      }

      return new BigNumber(+x);
    }
  }, {
    from: 'boolean',
    to: 'Fraction',
    convert: function convert(x) {
      if (!Fraction) {
        throwNoFraction(x);
      }

      return new Fraction(+x);
    }
  }, {
    from: 'boolean',
    to: 'string',
    convert: function convert(x) {
      return String(x);
    }
  }, {
    from: 'Array',
    to: 'Matrix',
    convert: function convert(array) {
      if (!DenseMatrix) {
        throwNoMatrix();
      }

      return new DenseMatrix(array);
    }
  }, {
    from: 'Matrix',
    to: 'Array',
    convert: function convert(matrix) {
      return matrix.valueOf();
    }
  }];
  return typed;
});

function throwNoBignumber(x) {
  throw new Error("Cannot convert value ".concat(x, " into a BigNumber: no class 'BigNumber' provided"));
}

function throwNoComplex(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Complex number: no class 'Complex' provided"));
}

function throwNoMatrix() {
  throw new Error('Cannot convert array into a Matrix: no class \'DenseMatrix\' provided');
}

function throwNoFraction(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Fraction, no class 'Fraction' provided."));
}

/*
 *  decimal.js v10.3.1
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2021 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
// -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //
// The maximum exponent magnitude.
// The limit on the value of `toExpNeg`, `toExpPos`, `minE` and `maxE`.
var EXP_LIMIT = 9e15,
    // 0 to 9e15
// The limit on the value of `precision`, and on the value of the first argument to
// `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
MAX_DIGITS = 1e9,
    // 0 to 1e9
// Base conversion alphabet.
NUMERALS = '0123456789abcdef',
    // The natural logarithm of 10 (1025 digits).
LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',
    // Pi (1025 digits).
PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',
    // The initial configuration properties of the Decimal constructor.
DEFAULTS = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed at run-time using the `Decimal.config` method.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used when rounding to `precision`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The modulo mode used when calculating the modulus: a mod n.
  // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
  // The remainder (r) is calculated as: r = a - n * q.
  //
  // UP         0 The remainder is positive if the dividend is negative, else is negative.
  // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
  // FLOOR      3 The remainder has the same sign as the divisor (Python %).
  // HALF_EVEN  6 The IEEE 754 remainder function.
  // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
  //
  // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
  // division (9) are commonly used for the modulus operation. The other rounding modes can also
  // be used, but they may not give useful results.
  modulo: 1,
  // 0 to 9
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -EXP_LIMIT
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to EXP_LIMIT
  // The minimum exponent value, beneath which underflow to zero occurs.
  // JavaScript numbers: -324  (5e-324)
  minE: -EXP_LIMIT,
  // -1 to -EXP_LIMIT
  // The maximum exponent value, above which overflow to Infinity occurs.
  // JavaScript numbers: 308  (1.7976931348623157e+308)
  maxE: EXP_LIMIT,
  // 1 to EXP_LIMIT
  // Whether to use cryptographically-secure random number generation, if available.
  crypto: false // true/false

},
    // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //
inexact,
    quadrant,
    external = true,
    decimalError = '[DecimalError] ',
    invalidArgument = decimalError + 'Invalid argument: ',
    precisionLimitExceeded = decimalError + 'Precision limit exceeded',
    cryptoUnavailable = decimalError + 'crypto unavailable',
    tag = '[object Decimal]',
    mathfloor = Math.floor,
    mathpow = Math.pow,
    isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
    isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
    isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
    isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
    BASE = 1e7,
    LOG_BASE = 7,
    MAX_SAFE_INTEGER = 9007199254740991,
    LN10_PRECISION = LN10.length - 1,
    PI_PRECISION = PI.length - 1,
    // Decimal.prototype object
P = {
  toStringTag: tag
}; // Decimal prototype methods

/*
 *  absoluteValue             abs
 *  ceil
 *  clampedTo                 clamp
 *  comparedTo                cmp
 *  cosine                    cos
 *  cubeRoot                  cbrt
 *  decimalPlaces             dp
 *  dividedBy                 div
 *  dividedToIntegerBy        divToInt
 *  equals                    eq
 *  floor
 *  greaterThan               gt
 *  greaterThanOrEqualTo      gte
 *  hyperbolicCosine          cosh
 *  hyperbolicSine            sinh
 *  hyperbolicTangent         tanh
 *  inverseCosine             acos
 *  inverseHyperbolicCosine   acosh
 *  inverseHyperbolicSine     asinh
 *  inverseHyperbolicTangent  atanh
 *  inverseSine               asin
 *  inverseTangent            atan
 *  isFinite
 *  isInteger                 isInt
 *  isNaN
 *  isNegative                isNeg
 *  isPositive                isPos
 *  isZero
 *  lessThan                  lt
 *  lessThanOrEqualTo         lte
 *  logarithm                 log
 *  [maximum]                 [max]
 *  [minimum]                 [min]
 *  minus                     sub
 *  modulo                    mod
 *  naturalExponential        exp
 *  naturalLogarithm          ln
 *  negated                   neg
 *  plus                      add
 *  precision                 sd
 *  round
 *  sine                      sin
 *  squareRoot                sqrt
 *  tangent                   tan
 *  times                     mul
 *  toBinary
 *  toDecimalPlaces           toDP
 *  toExponential
 *  toFixed
 *  toFraction
 *  toHexadecimal             toHex
 *  toNearest
 *  toNumber
 *  toOctal
 *  toPower                   pow
 *  toPrecision
 *  toSignificantDigits       toSD
 *  toString
 *  truncated                 trunc
 *  valueOf                   toJSON
 */

/*
 * Return a new Decimal whose value is the absolute value of this Decimal.
 *
 */

P.absoluteValue = P.abs = function () {
  var x = new this.constructor(this);
  if (x.s < 0) x.s = 1;
  return finalise(x);
};
/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
 * direction of positive Infinity.
 *
 */


P.ceil = function () {
  return finalise(new this.constructor(this), this.e + 1, 2);
};
/*
 * Return a new Decimal whose value is the value of this Decimal clamped to the range
 * delineated by `min` and `max`.
 *
 * min {number|string|Decimal}
 * max {number|string|Decimal}
 *
 */


P.clampedTo = P.clamp = function (min, max) {
  var k,
      x = this,
      Ctor = x.constructor;
  min = new Ctor(min);
  max = new Ctor(max);
  if (!min.s || !max.s) return new Ctor(NaN);
  if (min.gt(max)) throw Error(invalidArgument + max);
  k = x.cmp(min);
  return k < 0 ? min : x.cmp(max) > 0 ? max : new Ctor(x);
};
/*
 * Return
 *   1    if the value of this Decimal is greater than the value of `y`,
 *  -1    if the value of this Decimal is less than the value of `y`,
 *   0    if they have the same value,
 *   NaN  if the value of either Decimal is NaN.
 *
 */


P.comparedTo = P.cmp = function (y) {
  var i,
      j,
      xdL,
      ydL,
      x = this,
      xd = x.d,
      yd = (y = new x.constructor(y)).d,
      xs = x.s,
      ys = y.s; // Either NaN or ??Infinity?

  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  } // Either zero?


  if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0; // Signs differ?

  if (xs !== ys) return xs; // Compare exponents.

  if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
  xdL = xd.length;
  ydL = yd.length; // Compare digit by digit.

  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  } // Compare lengths.


  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
/*
 * Return a new Decimal whose value is the cosine of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * cos(0)         = 1
 * cos(-0)        = 1
 * cos(Infinity)  = NaN
 * cos(-Infinity) = NaN
 * cos(NaN)       = NaN
 *
 */


P.cosine = P.cos = function () {
  var pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (!x.d) return new Ctor(NaN); // cos(0) = cos(-0) = 1

  if (!x.d[0]) return new Ctor(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
/*
 *
 * Return a new Decimal whose value is the cube root of the value of this Decimal, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 *  cbrt(0)  =  0
 *  cbrt(-0) = -0
 *  cbrt(1)  =  1
 *  cbrt(-1) = -1
 *  cbrt(N)  =  N
 *  cbrt(-I) = -I
 *  cbrt(I)  =  I
 *
 * Math.cbrt(x) = (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))
 *
 */


P.cubeRoot = P.cbrt = function () {
  var e,
      m,
      n,
      r,
      rep,
      s,
      sd,
      t,
      t3,
      t3plusx,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  external = false; // Initial estimate.

  s = x.s * mathpow(x.s * x, 1 / 3); // Math.cbrt underflow/overflow?
  // Pass x to Math.pow as integer, then adjust the exponent of the result.

  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e; // Adjust n exponent so it is a multiple of 3 away from x exponent.

    if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? '0' : '00';
    s = mathpow(n, 1 / 3); // Rarely, e may be one less than the result exponent value.

    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));

    if (s == 1 / 0) {
      n = '5e' + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf('e') + 1) + e;
    }

    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }

  sd = (e = Ctor.precision) + 3; // Halley's method.
  // TODO? Compare Newton's method.

  for (;;) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1); // TODO? Replace with for-loop and checkRoundingDigits.

    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1); // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or 4999
      // , i.e. approaching a rounding boundary, continue the iteration.

      if (n == '9999' || !rep && n == '4999') {
        // On the first iteration only, check to see if rounding up gives the exact result as the
        // nines may infinitely repeat.
        if (!rep) {
          finalise(t, e + 1, 0);

          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }

        sd += 4;
        rep = 1;
      } else {
        // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
        // If not, then there are further digits and m will be truthy.
        if (!+n || !+n.slice(1) && n.charAt(0) == '5') {
          // Truncate to the first rounding digit.
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }

        break;
      }
    }
  }

  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
/*
 * Return the number of decimal places of the value of this Decimal.
 *
 */


P.decimalPlaces = P.dp = function () {
  var w,
      d = this.d,
      n = NaN;

  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE; // Subtract the number of trailing zeros of the last word.

    w = d[w];
    if (w) for (; w % 10 == 0; w /= 10) n--;
    if (n < 0) n = 0;
  }

  return n;
};
/*
 *  n / 0 = I
 *  n / N = N
 *  n / I = 0
 *  0 / n = 0
 *  0 / 0 = N
 *  0 / N = N
 *  0 / I = 0
 *  N / n = N
 *  N / 0 = N
 *  N / N = N
 *  N / I = N
 *  I / n = I
 *  I / 0 = I
 *  I / N = N
 *  I / I = N
 *
 * Return a new Decimal whose value is the value of this Decimal divided by `y`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 */


P.dividedBy = P.div = function (y) {
  return divide(this, new this.constructor(y));
};
/*
 * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
 * by the value of `y`, rounded to `precision` significant digits using rounding mode `rounding`.
 *
 */


P.dividedToIntegerBy = P.divToInt = function (y) {
  var x = this,
      Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
/*
 * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
 *
 */


P.equals = P.eq = function (y) {
  return this.cmp(y) === 0;
};
/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
 * direction of negative Infinity.
 *
 */


P.floor = function () {
  return finalise(new this.constructor(this), this.e + 1, 3);
};
/*
 * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
 * false.
 *
 */


P.greaterThan = P.gt = function (y) {
  return this.cmp(y) > 0;
};
/*
 * Return true if the value of this Decimal is greater than or equal to the value of `y`,
 * otherwise return false.
 *
 */


P.greaterThanOrEqualTo = P.gte = function (y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};
/*
 * Return a new Decimal whose value is the hyperbolic cosine of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [1, Infinity]
 *
 * cosh(x) = 1 + x^2/2! + x^4/4! + x^6/6! + ...
 *
 * cosh(0)         = 1
 * cosh(-0)        = 1
 * cosh(Infinity)  = Infinity
 * cosh(-Infinity) = Infinity
 * cosh(NaN)       = NaN
 *
 *  x        time taken (ms)   result
 * 1000      9                 9.8503555700852349694e+433
 * 10000     25                4.4034091128314607936e+4342
 * 100000    171               1.4033316802130615897e+43429
 * 1000000   3817              1.5166076984010437725e+434294
 * 10000000  abandoned after 2 minute wait
 *
 * TODO? Compare performance of cosh(x) = 0.5 * (exp(x) + exp(-x))
 *
 */


P.hyperbolicCosine = P.cosh = function () {
  var k,
      n,
      pr,
      rm,
      len,
      x = this,
      Ctor = x.constructor,
      one = new Ctor(1);
  if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero()) return one;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length; // Argument reduction: cos(4x) = 1 - 8cos^2(x) + 8cos^4(x) + 1
  // i.e. cos(x) = 1 - cos^2(x/4)(8 - 8cos^2(x/4))
  // Estimate the optimum number of times to use the argument reduction.
  // TODO? Estimation reused from cosine() and may not be optimal here.

  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = '2.3283064365386962890625e-10';
  }

  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true); // Reverse argument reduction

  var cosh2_x,
      i = k,
      d8 = new Ctor(8);

  for (; i--;) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }

  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
/*
 * Return a new Decimal whose value is the hyperbolic sine of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * sinh(x) = x + x^3/3! + x^5/5! + x^7/7! + ...
 *
 * sinh(0)         = 0
 * sinh(-0)        = -0
 * sinh(Infinity)  = Infinity
 * sinh(-Infinity) = -Infinity
 * sinh(NaN)       = NaN
 *
 * x        time taken (ms)
 * 10       2 ms
 * 100      5 ms
 * 1000     14 ms
 * 10000    82 ms
 * 100000   886 ms            1.4033316802130615897e+43429
 * 200000   2613 ms
 * 300000   5407 ms
 * 400000   8824 ms
 * 500000   13026 ms          8.7080643612718084129e+217146
 * 1000000  48543 ms
 *
 * TODO? Compare performance of sinh(x) = 0.5 * (exp(x) - exp(-x))
 *
 */


P.hyperbolicSine = P.sinh = function () {
  var k,
      pr,
      rm,
      len,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;

  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {
    // Alternative argument reduction: sinh(3x) = sinh(x)(3 + 4sinh^2(x))
    // i.e. sinh(x) = sinh(x/3)(3 + 4sinh^2(x/3))
    // 3 multiplications and 1 addition
    // Argument reduction: sinh(5x) = sinh(x)(5 + sinh^2(x)(20 + 16sinh^2(x)))
    // i.e. sinh(x) = sinh(x/5)(5 + sinh^2(x/5)(20 + 16sinh^2(x/5)))
    // 4 multiplications and 2 additions
    // Estimate the optimum number of times to use the argument reduction.
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true); // Reverse argument reduction

    var sinh2_x,
        d5 = new Ctor(5),
        d16 = new Ctor(16),
        d20 = new Ctor(20);

    for (; k--;) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }

  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(x, pr, rm, true);
};
/*
 * Return a new Decimal whose value is the hyperbolic tangent of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * tanh(x) = sinh(x) / cosh(x)
 *
 * tanh(0)         = 0
 * tanh(-0)        = -0
 * tanh(Infinity)  = 1
 * tanh(-Infinity) = -1
 * tanh(NaN)       = NaN
 *
 */


P.hyperbolicTangent = P.tanh = function () {
  var pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(x.s);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;
  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
/*
 * Return a new Decimal whose value is the arccosine (inverse cosine) in radians of the value of
 * this Decimal.
 *
 * Domain: [-1, 1]
 * Range: [0, pi]
 *
 * acos(x) = pi/2 - asin(x)
 *
 * acos(0)       = pi/2
 * acos(-0)      = pi/2
 * acos(1)       = 0
 * acos(-1)      = pi
 * acos(1/2)     = pi/3
 * acos(-1/2)    = 2*pi/3
 * acos(|x| > 1) = NaN
 * acos(NaN)     = NaN
 *
 */


P.inverseCosine = P.acos = function () {
  var halfPi,
      x = this,
      Ctor = x.constructor,
      k = x.abs().cmp(1),
      pr = Ctor.precision,
      rm = Ctor.rounding;

  if (k !== -1) {
    return k === 0 // |x| is 1
    ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) // |x| > 1 or x is NaN
    : new Ctor(NaN);
  }

  if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5); // TODO? Special case acos(0.5) = pi/3 and acos(-0.5) = 2*pi/3

  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.asin();
  halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return halfPi.minus(x);
};
/*
 * Return a new Decimal whose value is the inverse of the hyperbolic cosine in radians of the
 * value of this Decimal.
 *
 * Domain: [1, Infinity]
 * Range: [0, Infinity]
 *
 * acosh(x) = ln(x + sqrt(x^2 - 1))
 *
 * acosh(x < 1)     = NaN
 * acosh(NaN)       = NaN
 * acosh(Infinity)  = Infinity
 * acosh(-Infinity) = NaN
 * acosh(0)         = NaN
 * acosh(-0)        = NaN
 * acosh(1)         = 0
 * acosh(-1)        = NaN
 *
 */


P.inverseHyperbolicCosine = P.acosh = function () {
  var pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).minus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
/*
 * Return a new Decimal whose value is the inverse of the hyperbolic sine in radians of the value
 * of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * asinh(x) = ln(x + sqrt(x^2 + 1))
 *
 * asinh(NaN)       = NaN
 * asinh(Infinity)  = Infinity
 * asinh(-Infinity) = -Infinity
 * asinh(0)         = 0
 * asinh(-0)        = -0
 *
 */


P.inverseHyperbolicSine = P.asinh = function () {
  var pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).plus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
/*
 * Return a new Decimal whose value is the inverse of the hyperbolic tangent in radians of the
 * value of this Decimal.
 *
 * Domain: [-1, 1]
 * Range: [-Infinity, Infinity]
 *
 * atanh(x) = 0.5 * ln((1 + x) / (1 - x))
 *
 * atanh(|x| > 1)   = NaN
 * atanh(NaN)       = NaN
 * atanh(Infinity)  = NaN
 * atanh(-Infinity) = NaN
 * atanh(0)         = 0
 * atanh(-0)        = -0
 * atanh(1)         = Infinity
 * atanh(-1)        = -Infinity
 *
 */


P.inverseHyperbolicTangent = P.atanh = function () {
  var pr,
      rm,
      wpr,
      xsd,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();
  if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
  Ctor.precision = wpr = xsd - x.e;
  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
  Ctor.precision = pr + 4;
  Ctor.rounding = 1;
  x = x.ln();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(0.5);
};
/*
 * Return a new Decimal whose value is the arcsine (inverse sine) in radians of the value of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi/2, pi/2]
 *
 * asin(x) = 2*atan(x/(1 + sqrt(1 - x^2)))
 *
 * asin(0)       = 0
 * asin(-0)      = -0
 * asin(1/2)     = pi/6
 * asin(-1/2)    = -pi/6
 * asin(1)       = pi/2
 * asin(-1)      = -pi/2
 * asin(|x| > 1) = NaN
 * asin(NaN)     = NaN
 *
 * TODO? Compare performance of Taylor series.
 *
 */


P.inverseSine = P.asin = function () {
  var halfPi,
      k,
      pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (x.isZero()) return new Ctor(x);
  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;

  if (k !== -1) {
    // |x| is 1
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    } // |x| > 1 or x is NaN


    return new Ctor(NaN);
  } // TODO? Special case asin(1/2) = pi/6 and asin(-1/2) = -pi/6


  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
/*
 * Return a new Decimal whose value is the arctangent (inverse tangent) in radians of the value
 * of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi/2, pi/2]
 *
 * atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
 *
 * atan(0)         = 0
 * atan(-0)        = -0
 * atan(1)         = pi/4
 * atan(-1)        = -pi/4
 * atan(Infinity)  = pi/2
 * atan(-Infinity) = -pi/2
 * atan(NaN)       = NaN
 *
 */


P.inverseTangent = P.atan = function () {
  var i,
      j,
      k,
      n,
      px,
      t,
      r,
      wpr,
      x2,
      x = this,
      Ctor = x.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding;

  if (!x.isFinite()) {
    if (!x.s) return new Ctor(NaN);

    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }

  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1; // TODO? if (x >= 1 && pr <= PI_PRECISION) atan(x) = halfPi * x.s - atan(1 / x);
  // Argument reduction
  // Ensure |x| < 0.42
  // atan(x) = 2 * atan(x / (1 + sqrt(1 + x^2)))

  k = Math.min(28, wpr / LOG_BASE + 2 | 0);

  for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));

  external = false;
  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px = x; // atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...

  for (; i !== -1;) {
    px = px.times(x2);
    t = r.minus(px.div(n += 2));
    px = px.times(x2);
    r = t.plus(px.div(n += 2));
    if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
  }

  if (k) r = r.times(2 << k - 1);
  external = true;
  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};
/*
 * Return true if the value of this Decimal is a finite number, otherwise return false.
 *
 */


P.isFinite = function () {
  return !!this.d;
};
/*
 * Return true if the value of this Decimal is an integer, otherwise return false.
 *
 */


P.isInteger = P.isInt = function () {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
/*
 * Return true if the value of this Decimal is NaN, otherwise return false.
 *
 */


P.isNaN = function () {
  return !this.s;
};
/*
 * Return true if the value of this Decimal is negative, otherwise return false.
 *
 */


P.isNegative = P.isNeg = function () {
  return this.s < 0;
};
/*
 * Return true if the value of this Decimal is positive, otherwise return false.
 *
 */


P.isPositive = P.isPos = function () {
  return this.s > 0;
};
/*
 * Return true if the value of this Decimal is 0 or -0, otherwise return false.
 *
 */


P.isZero = function () {
  return !!this.d && this.d[0] === 0;
};
/*
 * Return true if the value of this Decimal is less than `y`, otherwise return false.
 *
 */


P.lessThan = P.lt = function (y) {
  return this.cmp(y) < 0;
};
/*
 * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
 *
 */


P.lessThanOrEqualTo = P.lte = function (y) {
  return this.cmp(y) < 1;
};
/*
 * Return the logarithm of the value of this Decimal to the specified base, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * If no base is specified, return log[10](arg).
 *
 * log[base](arg) = ln(arg) / ln(base)
 *
 * The result will always be correctly rounded if the base of the log is 10, and 'almost always'
 * otherwise:
 *
 * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
 * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
 * between the result and the correctly rounded result will be one ulp (unit in the last place).
 *
 * log[-b](a)       = NaN
 * log[0](a)        = NaN
 * log[1](a)        = NaN
 * log[NaN](a)      = NaN
 * log[Infinity](a) = NaN
 * log[b](0)        = -Infinity
 * log[b](-0)       = -Infinity
 * log[b](-a)       = NaN
 * log[b](1)        = 0
 * log[b](Infinity) = Infinity
 * log[b](NaN)      = NaN
 *
 * [base] {number|string|Decimal} The base of the logarithm.
 *
 */


P.logarithm = P.log = function (base) {
  var isBase10,
      d,
      denominator,
      k,
      inf,
      num,
      sd,
      r,
      arg = this,
      Ctor = arg.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding,
      guard = 5; // Default base is 10.

  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d; // Return NaN if base is negative, or non-finite, or is 0 or 1.

    if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
    isBase10 = base.eq(10);
  }

  d = arg.d; // Is arg negative, non-finite, 0 or 1?

  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  } // The result will have a non-terminating decimal expansion if base is 10 and arg is not an
  // integer power of 10.


  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0;) k /= 10;

      inf = k !== 1;
    }
  }

  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd); // The result will have 5 rounding digits.

  r = divide(num, denominator, sd, 1); // If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
  // calculate 10 further digits.
  //
  // If the result is known to have an infinite decimal expansion, repeat this until it is clear
  // that the result is above or below the boundary. Otherwise, if after calculating the 10
  // further digits, the last 14 are nines, round up and assume the result is exact.
  // Also assume the result is exact if the last 14 are zero.
  //
  // Example of a result that will be incorrectly rounded:
  // log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
  // The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7, but it
  // will be given as 2.6 as there are 15 zeros immediately after the requested decimal place, so
  // the exact result would be assumed to be 2.6, which rounded using ROUND_CEIL to 1 decimal
  // place is still 2.6.

  if (checkRoundingDigits(r.d, k = pr, rm)) {
    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);

      if (!inf) {
        // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }

        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }

  external = true;
  return finalise(r, pr, rm);
};
/*
 * Return a new Decimal whose value is the maximum of the arguments and the value of this Decimal.
 *
 * arguments {number|string|Decimal}
 *
P.max = function () {
  Array.prototype.push.call(arguments, this);
  return maxOrMin(this.constructor, arguments, 'lt');
};
 */

/*
 * Return a new Decimal whose value is the minimum of the arguments and the value of this Decimal.
 *
 * arguments {number|string|Decimal}
 *
P.min = function () {
  Array.prototype.push.call(arguments, this);
  return maxOrMin(this.constructor, arguments, 'gt');
};
 */

/*
 *  n - 0 = n
 *  n - N = N
 *  n - I = -I
 *  0 - n = -n
 *  0 - 0 = 0
 *  0 - N = N
 *  0 - I = -I
 *  N - n = N
 *  N - 0 = N
 *  N - N = N
 *  N - I = N
 *  I - n = I
 *  I - 0 = I
 *  I - N = N
 *  I - I = N
 *
 * Return a new Decimal whose value is the value of this Decimal minus `y`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */


P.minus = P.sub = function (y) {
  var d,
      e,
      i,
      j,
      k,
      len,
      pr,
      rm,
      xd,
      xe,
      xLTy,
      yd,
      x = this,
      Ctor = x.constructor;
  y = new Ctor(y); // If either is not finite...

  if (!x.d || !y.d) {
    // Return NaN if either is NaN.
    if (!x.s || !y.s) y = new Ctor(NaN); // Return y negated if x is finite and y is ??Infinity.
    else if (x.d) y.s = -y.s; // Return x if y is finite and x is ??Infinity.
    // Return x if both are ??Infinity with different signs.
    // Return NaN if both are ??Infinity with the same sign.
    else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
    return y;
  } // If signs differ...


  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }

  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding; // If either is zero...

  if (!xd[0] || !yd[0]) {
    // Return y negated if x is zero and y is non-zero.
    if (yd[0]) y.s = -y.s; // Return x if y is zero and x is non-zero.
    else if (xd[0]) y = new Ctor(x); // Return zero if both are zero.
    // From IEEE 754 (2008) 6.3: 0 - 0 = -0 - -0 = -0 when rounding to -Infinity.
    else return new Ctor(rm === 3 ? -0 : 0);
    return external ? finalise(y, pr, rm) : y;
  } // x and y are finite, non-zero numbers with the same sign.
  // Calculate base 1e7 exponents.


  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);
  xd = xd.slice();
  k = xe - e; // If base 1e7 exponents differ...

  if (k) {
    xLTy = k < 0;

    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    } // Numbers with massively different exponents would result in a very high number of
    // zeros needing to be prepended, but this can be avoided while still ensuring correct
    // rounding by limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.


    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

    if (k > i) {
      k = i;
      d.length = 1;
    } // Prepend zeros to equalise exponents.


    d.reverse();

    for (i = k; i--;) d.push(0);

    d.reverse(); // Base 1e7 exponents equal.
  } else {
    // Check digits to determine which is the bigger number.
    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy) len = i;

    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }

    k = 0;
  }

  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }

  len = xd.length; // Append zeros to `xd` if shorter.
  // Don't add zeros to `yd` if shorter as subtraction only needs to start at `yd` length.

  for (i = yd.length - len; i > 0; --i) xd[len++] = 0; // Subtract yd from xd.


  for (i = yd.length; i > k;) {
    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;

      --xd[j];
      xd[i] += BASE;
    }

    xd[i] -= yd[i];
  } // Remove trailing zeros.


  for (; xd[--len] === 0;) xd.pop(); // Remove leading zeros and adjust exponent accordingly.


  for (; xd[0] === 0; xd.shift()) --e; // Zero?


  if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
/*
 *   n % 0 =  N
 *   n % N =  N
 *   n % I =  n
 *   0 % n =  0
 *  -0 % n = -0
 *   0 % 0 =  N
 *   0 % N =  N
 *   0 % I =  0
 *   N % n =  N
 *   N % 0 =  N
 *   N % N =  N
 *   N % I =  N
 *   I % n =  N
 *   I % 0 =  N
 *   I % N =  N
 *   I % I =  N
 *
 * Return a new Decimal whose value is the value of this Decimal modulo `y`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * The result depends on the modulo mode.
 *
 */


P.modulo = P.mod = function (y) {
  var q,
      x = this,
      Ctor = x.constructor;
  y = new Ctor(y); // Return NaN if x is ??Infinity or NaN, or y is NaN or ??0.

  if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN); // Return x if y is ??Infinity or x is ??0.

  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  } // Prevent rounding of intermediate calculations.


  external = false;

  if (Ctor.modulo == 9) {
    // Euclidian division: q = sign(y) * floor(x / abs(y))
    // result = x - q * y    where  0 <= result < abs(y)
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }

  q = q.times(y);
  external = true;
  return x.minus(q);
};
/*
 * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
 * i.e. the base e raised to the power the value of this Decimal, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */


P.naturalExponential = P.exp = function () {
  return naturalExponential(this);
};
/*
 * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
 * rounded to `precision` significant digits using rounding mode `rounding`.
 *
 */


P.naturalLogarithm = P.ln = function () {
  return naturalLogarithm(this);
};
/*
 * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
 * -1.
 *
 */


P.negated = P.neg = function () {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};
/*
 *  n + 0 = n
 *  n + N = N
 *  n + I = I
 *  0 + n = n
 *  0 + 0 = 0
 *  0 + N = N
 *  0 + I = I
 *  N + n = N
 *  N + 0 = N
 *  N + N = N
 *  N + I = N
 *  I + n = I
 *  I + 0 = I
 *  I + N = N
 *  I + I = I
 *
 * Return a new Decimal whose value is the value of this Decimal plus `y`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */


P.plus = P.add = function (y) {
  var carry,
      d,
      e,
      i,
      k,
      len,
      pr,
      rm,
      xd,
      yd,
      x = this,
      Ctor = x.constructor;
  y = new Ctor(y); // If either is not finite...

  if (!x.d || !y.d) {
    // Return NaN if either is NaN.
    if (!x.s || !y.s) y = new Ctor(NaN); // Return x if y is finite and x is ??Infinity.
    // Return x if both are ??Infinity with the same sign.
    // Return NaN if both are ??Infinity with different signs.
    // Return y if x is finite and y is ??Infinity.
    else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
    return y;
  } // If signs differ...


  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }

  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding; // If either is zero...

  if (!xd[0] || !yd[0]) {
    // Return x if y is zero.
    // Return y if y is non-zero.
    if (!yd[0]) y = new Ctor(x);
    return external ? finalise(y, pr, rm) : y;
  } // x and y are finite, non-zero numbers with the same sign.
  // Calculate base 1e7 exponents.


  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);
  xd = xd.slice();
  i = k - e; // If base 1e7 exponents differ...

  if (i) {
    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    } // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.


    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;

    if (i > len) {
      i = len;
      d.length = 1;
    } // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.


    d.reverse();

    for (; i--;) d.push(0);

    d.reverse();
  }

  len = xd.length;
  i = yd.length; // If yd is longer than xd, swap xd and yd so xd points to the longer array.

  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  } // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.


  for (carry = 0; i;) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }

  if (carry) {
    xd.unshift(carry);
    ++e;
  } // Remove trailing zeros.
  // No need to check for zero, as +x + +y != 0 && -x + -y != 0


  for (len = xd.length; xd[--len] == 0;) xd.pop();

  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
/*
 * Return the number of significant digits of the value of this Decimal.
 *
 * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
 *
 */


P.precision = P.sd = function (z) {
  var k,
      x = this;
  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k) k = x.e + 1;
  } else {
    k = NaN;
  }

  return k;
};
/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
 * rounding mode `rounding`.
 *
 */


P.round = function () {
  var x = this,
      Ctor = x.constructor;
  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
/*
 * Return a new Decimal whose value is the sine of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * sin(x) = x - x^3/3! + x^5/5! - ...
 *
 * sin(0)         = 0
 * sin(-0)        = -0
 * sin(Infinity)  = NaN
 * sin(-Infinity) = NaN
 * sin(NaN)       = NaN
 *
 */


P.sine = P.sin = function () {
  var pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = sine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
/*
 * Return a new Decimal whose value is the square root of this Decimal, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 *  sqrt(-n) =  N
 *  sqrt(N)  =  N
 *  sqrt(-I) =  N
 *  sqrt(I)  =  I
 *  sqrt(0)  =  0
 *  sqrt(-0) = -0
 *
 */


P.squareRoot = P.sqrt = function () {
  var m,
      n,
      sd,
      r,
      rep,
      t,
      x = this,
      d = x.d,
      e = x.e,
      s = x.s,
      Ctor = x.constructor; // Negative/NaN/Infinity/zero?

  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }

  external = false; // Initial estimate.

  s = Math.sqrt(+x); // Math.sqrt underflow/overflow?
  // Pass x to Math.sqrt as integer, then adjust the exponent of the result.

  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);
    if ((n.length + e) % 2 == 0) n += '0';
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

    if (s == 1 / 0) {
      n = '5e' + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf('e') + 1) + e;
    }

    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }

  sd = (e = Ctor.precision) + 3; // Newton-Raphson iteration.

  for (;;) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5); // TODO? Replace with for-loop and checkRoundingDigits.

    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1); // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
      // 4999, i.e. approaching a rounding boundary, continue the iteration.

      if (n == '9999' || !rep && n == '4999') {
        // On the first iteration only, check to see if rounding up gives the exact result as the
        // nines may infinitely repeat.
        if (!rep) {
          finalise(t, e + 1, 0);

          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }

        sd += 4;
        rep = 1;
      } else {
        // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
        // If not, then there are further digits and m will be truthy.
        if (!+n || !+n.slice(1) && n.charAt(0) == '5') {
          // Truncate to the first rounding digit.
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }

        break;
      }
    }
  }

  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
/*
 * Return a new Decimal whose value is the tangent of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * tan(0)         = 0
 * tan(-0)        = -0
 * tan(Infinity)  = NaN
 * tan(-Infinity) = NaN
 * tan(NaN)       = NaN
 *
 */


P.tangent = P.tan = function () {
  var pr,
      rm,
      x = this,
      Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;
  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
/*
 *  n * 0 = 0
 *  n * N = N
 *  n * I = I
 *  0 * n = 0
 *  0 * 0 = 0
 *  0 * N = N
 *  0 * I = N
 *  N * n = N
 *  N * 0 = N
 *  N * N = N
 *  N * I = N
 *  I * n = I
 *  I * 0 = N
 *  I * N = N
 *  I * I = I
 *
 * Return a new Decimal whose value is this Decimal times `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 */


P.times = P.mul = function (y) {
  var carry,
      e,
      i,
      k,
      r,
      rL,
      t,
      xdL,
      ydL,
      x = this,
      Ctor = x.constructor,
      xd = x.d,
      yd = (y = new Ctor(y)).d;
  y.s *= x.s; // If either is NaN, ??Infinity or ??0...

  if (!xd || !xd[0] || !yd || !yd[0]) {
    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd // Return NaN if either is NaN.
    // Return NaN if x is ??0 and y is ??Infinity, or y is ??0 and x is ??Infinity.
    ? NaN // Return ??Infinity if either is ??Infinity.
    // Return ??0 if either is ??0.
    : !xd || !yd ? y.s / 0 : y.s * 0);
  }

  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length; // Ensure xd points to the longer array.

  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  } // Initialise the result array with zeros.


  r = [];
  rL = xdL + ydL;

  for (i = rL; i--;) r.push(0); // Multiply!


  for (i = ydL; --i >= 0;) {
    carry = 0;

    for (k = xdL + i; k > i;) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }

    r[k] = (r[k] + carry) % BASE | 0;
  } // Remove trailing zeros.


  for (; !r[--rL];) r.pop();

  if (carry) ++e;else r.shift();
  y.d = r;
  y.e = getBase10Exponent(r, e);
  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
/*
 * Return a string representing the value of this Decimal in base 2, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */


P.toBinary = function (sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};
/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
 * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
 *
 * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */


P.toDecimalPlaces = P.toDP = function (dp, rm) {
  var x = this,
      Ctor = x.constructor;
  x = new Ctor(x);
  if (dp === void 0) return x;
  checkInt32(dp, 0, MAX_DIGITS);
  if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
  return finalise(x, dp + x.e + 1, rm);
};
/*
 * Return a string representing the value of this Decimal in exponential notation rounded to
 * `dp` fixed decimal places using rounding mode `rounding`.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */


P.toExponential = function (dp, rm) {
  var str,
      x = this,
      Ctor = x.constructor;

  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};
/*
 * Return a string representing the value of this Decimal in normal (fixed-point) notation to
 * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
 * omitted.
 *
 * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 * (-0).toFixed(3) is '0.000'.
 * (-0.5).toFixed(0) is '-0'.
 *
 */


P.toFixed = function (dp, rm) {
  var str,
      y,
      x = this,
      Ctor = x.constructor;

  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  } // To determine whether to add the minus sign look at the value before it was rounded,
  // i.e. look at `x` rather than `y`.


  return x.isNeg() && !x.isZero() ? '-' + str : str;
};
/*
 * Return an array representing the value of this Decimal as a simple fraction with an integer
 * numerator and an integer denominator.
 *
 * The denominator will be a positive non-zero value less than or equal to the specified maximum
 * denominator. If a maximum denominator is not specified, the denominator will be the lowest
 * value necessary to represent the number exactly.
 *
 * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
 *
 */


P.toFraction = function (maxD) {
  var d,
      d0,
      d1,
      d2,
      e,
      k,
      n,
      n0,
      n1,
      pr,
      q,
      r,
      x = this,
      xd = x.d,
      Ctor = x.constructor;
  if (!xd) return new Ctor(x);
  n1 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);
  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);

  if (maxD == null) {
    // d is 10**e, the minimum max-denominator needed.
    maxD = e > 0 ? d : n1;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
    maxD = n.gt(d) ? e > 0 ? d : n1 : n;
  }

  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;

  for (;;) {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1) break;
    d0 = d1;
    d1 = d2;
    d2 = n1;
    n1 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }

  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n1));
  d0 = d0.plus(d2.times(d1));
  n0.s = n1.s = x.s; // Determine which fraction is closer to x, n0/d0 or n1/d1?

  r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
  Ctor.precision = pr;
  external = true;
  return r;
};
/*
 * Return a string representing the value of this Decimal in base 16, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */


P.toHexadecimal = P.toHex = function (sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};
/*
 * Returns a new Decimal whose value is the nearest multiple of `y` in the direction of rounding
 * mode `rm`, or `Decimal.rounding` if `rm` is omitted, to the value of this Decimal.
 *
 * The return value will always have the same sign as this Decimal, unless either this Decimal
 * or `y` is NaN, in which case the return value will be also be NaN.
 *
 * The return value is not affected by the value of `precision`.
 *
 * y {number|string|Decimal} The magnitude to round to a multiple of.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * 'toNearest() rounding mode not an integer: {rm}'
 * 'toNearest() rounding mode out of range: {rm}'
 *
 */


P.toNearest = function (y, rm) {
  var x = this,
      Ctor = x.constructor;
  x = new Ctor(x);

  if (y == null) {
    // If x is not finite, return x.
    if (!x.d) return x;
    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);

    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    } // If x is not finite, return x if y is not NaN, else NaN.


    if (!x.d) return y.s ? x : y; // If y is not finite, return Infinity with the sign of x if y is Infinity, else NaN.

    if (!y.d) {
      if (y.s) y.s = x.s;
      return y;
    }
  } // If y is not zero, calculate the nearest multiple of y to x.


  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x); // If y is zero, return zero with the sign of x.
  } else {
    y.s = x.s;
    x = y;
  }

  return x;
};
/*
 * Return the value of this Decimal converted to a number primitive.
 * Zero keeps its sign.
 *
 */


P.toNumber = function () {
  return +this;
};
/*
 * Return a string representing the value of this Decimal in base 8, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */


P.toOctal = function (sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};
/*
 * Return a new Decimal whose value is the value of this Decimal raised to the power `y`, rounded
 * to `precision` significant digits using rounding mode `rounding`.
 *
 * ECMAScript compliant.
 *
 *   pow(x, NaN)                           = NaN
 *   pow(x, ??0)                            = 1

 *   pow(NaN, non-zero)                    = NaN
 *   pow(abs(x) > 1, +Infinity)            = +Infinity
 *   pow(abs(x) > 1, -Infinity)            = +0
 *   pow(abs(x) == 1, ??Infinity)           = NaN
 *   pow(abs(x) < 1, +Infinity)            = +0
 *   pow(abs(x) < 1, -Infinity)            = +Infinity
 *   pow(+Infinity, y > 0)                 = +Infinity
 *   pow(+Infinity, y < 0)                 = +0
 *   pow(-Infinity, odd integer > 0)       = -Infinity
 *   pow(-Infinity, even integer > 0)      = +Infinity
 *   pow(-Infinity, odd integer < 0)       = -0
 *   pow(-Infinity, even integer < 0)      = +0
 *   pow(+0, y > 0)                        = +0
 *   pow(+0, y < 0)                        = +Infinity
 *   pow(-0, odd integer > 0)              = -0
 *   pow(-0, even integer > 0)             = +0
 *   pow(-0, odd integer < 0)              = -Infinity
 *   pow(-0, even integer < 0)             = +Infinity
 *   pow(finite x < 0, finite non-integer) = NaN
 *
 * For non-integer or very large exponents pow(x, y) is calculated using
 *
 *   x^y = exp(y*ln(x))
 *
 * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
 * probability of an incorrectly rounded result
 * P([49]9{14} | [50]0{14}) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
 * i.e. 1 in 250,000,000,000,000
 *
 * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
 *
 * y {number|string|Decimal} The power to which to raise this Decimal.
 *
 */


P.toPower = P.pow = function (y) {
  var e,
      k,
      pr,
      r,
      rm,
      s,
      x = this,
      Ctor = x.constructor,
      yn = +(y = new Ctor(y)); // Either ??Infinity, NaN or ??0?

  if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
  x = new Ctor(x);
  if (x.eq(1)) return x;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (y.eq(1)) return finalise(x, pr, rm); // y exponent

  e = mathfloor(y.e / LOG_BASE); // If y is a small integer use the 'exponentiation by squaring' algorithm.

  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }

  s = x.s; // if x is negative

  if (s < 0) {
    // if y is not an integer
    if (e < y.d.length - 1) return new Ctor(NaN); // Result is positive if x is negative and the last digit of integer y is even.

    if ((y.d[e] & 1) == 0) s = 1; // if x.eq(-1)

    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  } // Estimate result exponent.
  // x^y = 10^e,  where e = y * log10(x)
  // log10(x) = log10(x_significand) + x_exponent
  // log10(x_significand) = ln(x_significand) / ln(10)


  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log('0.' + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + '').e; // Exponent estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e: -1.
  // Overflow/underflow?

  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
  external = false;
  Ctor.rounding = x.s = 1; // Estimate the extra guard digits needed to ensure five correct rounding digits from
  // naturalLogarithm(x). Example of failure without these extra digits (precision: 10):
  // new Decimal(2.32456).pow('2087987436534566.46411')
  // should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815

  k = Math.min(12, (e + '').length); // r = x^y = exp(y*ln(x))

  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr); // r may be Infinity, e.g. (0.9999999999999999).pow(-1e+40)

  if (r.d) {
    // Truncate to the required precision plus five rounding digits.
    r = finalise(r, pr + 5, 1); // If the rounding digits are [49]9999 or [50]0000 increase the precision by 10 and recalculate
    // the result.

    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10; // Truncate to the increased precision plus five rounding digits.

      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1); // Check for 14 nines from the 2nd rounding digit (the first rounding digit may be 4 or 9).

      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }

  r.s = s;
  external = true;
  Ctor.rounding = rm;
  return finalise(r, pr, rm);
};
/*
 * Return a string representing the value of this Decimal rounded to `sd` significant digits
 * using rounding mode `rounding`.
 *
 * Return exponential notation if `sd` is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */


P.toPrecision = function (sd, rm) {
  var str,
      x = this,
      Ctor = x.constructor;

  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};
/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
 * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
 * omitted.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * 'toSD() digits out of range: {sd}'
 * 'toSD() digits not an integer: {sd}'
 * 'toSD() rounding mode not an integer: {rm}'
 * 'toSD() rounding mode out of range: {rm}'
 *
 */


P.toSignificantDigits = P.toSD = function (sd, rm) {
  var x = this,
      Ctor = x.constructor;

  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
  }

  return finalise(new Ctor(x), sd, rm);
};
/*
 * Return a string representing the value of this Decimal.
 *
 * Return exponential notation if this Decimal has a positive exponent equal to or greater than
 * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
 *
 */


P.toString = function () {
  var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() && !x.isZero() ? '-' + str : str;
};
/*
 * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
 *
 */


P.truncated = P.trunc = function () {
  return finalise(new this.constructor(this), this.e + 1, 1);
};
/*
 * Return a string representing the value of this Decimal.
 * Unlike `toString`, negative zero will include the minus sign.
 *
 */


P.valueOf = P.toJSON = function () {
  var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() ? '-' + str : str;
}; // Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.

/*
 *  digitsToString           P.cubeRoot, P.logarithm, P.squareRoot, P.toFraction, P.toPower,
 *                           finiteToString, naturalExponential, naturalLogarithm
 *  checkInt32               P.toDecimalPlaces, P.toExponential, P.toFixed, P.toNearest,
 *                           P.toPrecision, P.toSignificantDigits, toStringBinary, random
 *  checkRoundingDigits      P.logarithm, P.toPower, naturalExponential, naturalLogarithm
 *  convertBase              toStringBinary, parseOther
 *  cos                      P.cos
 *  divide                   P.atanh, P.cubeRoot, P.dividedBy, P.dividedToIntegerBy,
 *                           P.logarithm, P.modulo, P.squareRoot, P.tan, P.tanh, P.toFraction,
 *                           P.toNearest, toStringBinary, naturalExponential, naturalLogarithm,
 *                           taylorSeries, atan2, parseOther
 *  finalise                 P.absoluteValue, P.atan, P.atanh, P.ceil, P.cos, P.cosh,
 *                           P.cubeRoot, P.dividedToIntegerBy, P.floor, P.logarithm, P.minus,
 *                           P.modulo, P.negated, P.plus, P.round, P.sin, P.sinh, P.squareRoot,
 *                           P.tan, P.times, P.toDecimalPlaces, P.toExponential, P.toFixed,
 *                           P.toNearest, P.toPower, P.toPrecision, P.toSignificantDigits,
 *                           P.truncated, divide, getLn10, getPi, naturalExponential,
 *                           naturalLogarithm, ceil, floor, round, trunc
 *  finiteToString           P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf,
 *                           toStringBinary
 *  getBase10Exponent        P.minus, P.plus, P.times, parseOther
 *  getLn10                  P.logarithm, naturalLogarithm
 *  getPi                    P.acos, P.asin, P.atan, toLessThanHalfPi, atan2
 *  getPrecision             P.precision, P.toFraction
 *  getZeroString            digitsToString, finiteToString
 *  intPow                   P.toPower, parseOther
 *  isOdd                    toLessThanHalfPi
 *  maxOrMin                 max, min
 *  naturalExponential       P.naturalExponential, P.toPower
 *  naturalLogarithm         P.acosh, P.asinh, P.atanh, P.logarithm, P.naturalLogarithm,
 *                           P.toPower, naturalExponential
 *  nonFiniteToString        finiteToString, toStringBinary
 *  parseDecimal             Decimal
 *  parseOther               Decimal
 *  sin                      P.sin
 *  taylorSeries             P.cosh, P.sinh, cos, sin
 *  toLessThanHalfPi         P.cos, P.sin
 *  toStringBinary           P.toBinary, P.toHexadecimal, P.toOctal
 *  truncate                 intPow
 *
 *  Throws:                  P.logarithm, P.precision, P.toFraction, checkInt32, getLn10, getPi,
 *                           naturalLogarithm, config, parseOther, random, Decimal
 */


function digitsToString(d) {
  var i,
      k,
      ws,
      indexOfLastWord = d.length - 1,
      str = '',
      w = d[0];

  if (indexOfLastWord > 0) {
    str += w;

    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
      str += ws;
    }

    w = d[i];
    ws = w + '';
    k = LOG_BASE - ws.length;
    if (k) str += getZeroString(k);
  } else if (w === 0) {
    return '0';
  } // Remove trailing zeros of last w.


  for (; w % 10 === 0;) w /= 10;

  return str + w;
}

function checkInt32(i, min, max) {
  if (i !== ~~i || i < min || i > max) {
    throw Error(invalidArgument + i);
  }
}
/*
 * Check 5 rounding digits if `repeating` is null, 4 otherwise.
 * `repeating == null` if caller is `log` or `pow`,
 * `repeating != null` if caller is `naturalLogarithm` or `naturalExponential`.
 */


function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd; // Get the length of the first word of the array d.

  for (k = d[0]; k >= 10; k /= 10) --i; // Is the rounding digit in the first word of d?


  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  } // i is the index (0 - 6) of the rounding digit.
  // E.g. if within the word 3487563 the first rounding digit is 5,
  // then i = 4, k = 1000, rd = 3487563 % 1000 = 563


  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;

  if (repeating == null) {
    if (i < 3) {
      if (i == 0) rd = rd / 100 | 0;else if (i == 1) rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0) rd = rd / 1000 | 0;else if (i == 1) rd = rd / 100 | 0;else if (i == 2) rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1000 | 0) == mathpow(10, i - 3) - 1;
    }
  }

  return r;
} // Convert string of `baseIn` to an array of numbers of `baseOut`.
// Eg. convertBase('255', 10, 16) returns [15, 15].
// Eg. convertBase('ff', 16, 10) returns [2, 5, 5].


function convertBase(str, baseIn, baseOut) {
  var j,
      arr = [0],
      arrL,
      i = 0,
      strL = str.length;

  for (; i < strL;) {
    for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;

    arr[0] += NUMERALS.indexOf(str.charAt(i++));

    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0) arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }

  return arr.reverse();
}
/*
 * cos(x) = 1 - x^2/2! + x^4/4! - ...
 * |x| < pi/2
 *
 */


function cosine(Ctor, x) {
  var k, len, y;
  if (x.isZero()) return x; // Argument reduction: cos(4x) = 8*(cos^4(x) - cos^2(x)) + 1
  // i.e. cos(x) = 8*(cos^4(x/4) - cos^2(x/4)) + 1
  // Estimate the optimum number of times to use the argument reduction.

  len = x.d.length;

  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = '2.3283064365386962890625e-10';
  }

  Ctor.precision += k;
  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1)); // Reverse argument reduction

  for (var i = k; i--;) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }

  Ctor.precision -= k;
  return x;
}
/*
 * Perform division in the specified base.
 */


var divide = function () {
  // Assumes non-zero x and k, and hence non-zero result.
  function multiplyInteger(x, k, base) {
    var temp,
        carry = 0,
        i = x.length;

    for (x = x.slice(); i--;) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }

    if (carry) x.unshift(carry);
    return x;
  }

  function compare(a, b, aL, bL) {
    var i, r;

    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }

    return r;
  }

  function subtract(a, b, aL, base) {
    var i = 0; // Subtract b from a.

    for (; aL--;) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    } // Remove leading zeros.


    for (; !a[0] && a.length > 1;) a.shift();
  }

  return function (x, y, pr, rm, dp, base) {
    var cmp,
        e,
        i,
        k,
        logBase,
        more,
        prod,
        prodL,
        q,
        qd,
        rem,
        remL,
        rem0,
        sd,
        t,
        xi,
        xL,
        yd0,
        yL,
        yz,
        Ctor = x.constructor,
        sign = x.s == y.s ? 1 : -1,
        xd = x.d,
        yd = y.d; // Either NaN, Infinity or 0?

    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor( // Return NaN if either NaN, or both Infinity or 0.
      !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : // Return ??0 if x is 0 or y is ??Infinity, or return ??Infinity as y is 0.
      xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
    }

    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }

    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign);
    qd = q.d = []; // Result exponent may be one less than e.
    // The digit array of a Decimal from toStringBinary may have trailing zeros.

    for (i = 0; yd[i] == (xd[i] || 0); i++);

    if (yd[i] > (xd[i] || 0)) e--;

    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }

    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {
      // Convert precision in number of base 10 digits to base 1e7 digits.
      sd = sd / logBase + 2 | 0;
      i = 0; // divisor < 1e7

      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++; // k is the carry.

        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }

        more = k || i < xL; // divisor >= 1e7
      } else {
        // Normalise xd and yd so highest order digit of yd is >= base/2
        k = base / (yd[0] + 1) | 0;

        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }

        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length; // Add zeros to make remainder as long as divisor.

        for (; remL < yL;) rem[remL++] = 0;

        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];
        if (yd[1] >= base / 2) ++yd0;

        do {
          k = 0; // Compare divisor and remainder.

          cmp = compare(yd, rem, yL, remL); // If divisor < remainder.

          if (cmp < 0) {
            // Calculate trial digit, k.
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0); // k will be how many times the divisor goes into the current remainder.

            k = rem0 / yd0 | 0; //  Algorithm:
            //  1. product = divisor * trial digit (k)
            //  2. if product > remainder: product -= divisor, k--
            //  3. remainder -= product
            //  4. if product was < remainder at 2:
            //    5. compare new remainder and divisor
            //    6. If remainder > divisor: remainder -= divisor, k++

            if (k > 1) {
              if (k >= base) k = base - 1; // product = divisor * trial digit.

              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length; // Compare product and remainder.

              cmp = compare(prod, rem, prodL, remL); // product > remainder.

              if (cmp == 1) {
                k--; // Subtract divisor from product.

                subtract(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {
              // cmp is -1.
              // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
              // to avoid it. If k is 1 there is a need to compare yd and rem again below.
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }

            prodL = prod.length;
            if (prodL < remL) prod.unshift(0); // Subtract product from remainder.

            subtract(rem, prod, remL, base); // If product was < previous remainder.

            if (cmp == -1) {
              remL = rem.length; // Compare divisor and new remainder.

              cmp = compare(yd, rem, yL, remL); // If divisor < new remainder, subtract divisor from remainder.

              if (cmp < 1) {
                k++; // Subtract divisor from remainder.

                subtract(rem, yL < remL ? yz : yd, remL, base);
              }
            }

            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          } // if cmp === 1, k will be 0
          // Add the next digit, k, to the result array.


          qd[i++] = k; // Update the remainder.

          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);

        more = rem[0] !== void 0;
      } // Leading zero?


      if (!qd[0]) qd.shift();
    } // logBase is 1 when divide is being used for base conversion.


    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {
      // To calculate q.e, first get the number of digits of qd[0].
      for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;

      q.e = i + e * logBase - 1;
      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }

    return q;
  };
}();
/*
 * Round `x` to `sd` significant digits using rounding mode `rm`.
 * Check for over/under-flow.
 */


function finalise(x, sd, rm, isTruncated) {
  var digits,
      i,
      j,
      k,
      rd,
      roundUp,
      w,
      xd,
      xdi,
      Ctor = x.constructor; // Don't round if sd is null or undefined.

  out: if (sd != null) {
    xd = x.d; // Infinity/NaN.

    if (!xd) return x; // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
    // w: the word of xd containing rd, a base 1e7 number.
    // xdi: the index of w within xd.
    // digits: the number of digits of w.
    // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
    // they had leading zeros)
    // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).
    // Get the length of the first word of the digits array xd.

    for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;

    i = sd - digits; // Is the rounding digit in the first word of xd?

    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0]; // Get the rounding digit at index j of w.

      rd = w / mathpow(10, digits - j - 1) % 10 | 0;
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;

      if (xdi >= k) {
        if (isTruncated) {
          // Needed by `naturalExponential`, `naturalLogarithm` and `squareRoot`.
          for (; k++ <= xdi;) xd.push(0);

          w = rd = 0;
          digits = 1;
          i %= LOG_BASE;
          j = i - LOG_BASE + 1;
        } else {
          break out;
        }
      } else {
        w = k = xd[xdi]; // Get the number of digits of w.

        for (digits = 1; k >= 10; k /= 10) digits++; // Get the index of rd within w.


        i %= LOG_BASE; // Get the index of rd within w, adjusted for leading zeros.
        // The number of leading zeros of w is given by LOG_BASE - digits.

        j = i - LOG_BASE + digits; // Get the rounding digit at index j of w.

        rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
      }
    } // Are there any non-zero digits after the rounding digit?


    isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1)); // The expression `w % mathpow(10, digits - j - 1)` returns all the digits of w to the right
    // of the digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression
    // will give 714.

    roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
    (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));

    if (sd < 1 || !xd[0]) {
      xd.length = 0;

      if (roundUp) {
        // Convert sd to decimal places.
        sd -= x.e + 1; // 1, 0.1, 0.01, 0.001, 0.0001 etc.

        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = -sd || 0;
      } else {
        // Zero.
        xd[0] = x.e = 0;
      }

      return x;
    } // Remove excess digits.


    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i); // E.g. 56700 becomes 56000 if 7 is the rounding digit.
      // j > 0 means i > number of leading zeros of w.

      xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
    }

    if (roundUp) {
      for (;;) {
        // Is the digit to be rounded up in the first word of xd?
        if (xdi == 0) {
          // i will be the length of xd[0] before k is added.
          for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;

          j = xd[0] += k;

          for (k = 1; j >= 10; j /= 10) k++; // if i != k the length has increased.


          if (i != k) {
            x.e++;
            if (xd[0] == BASE) xd[0] = 1;
          }

          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    } // Remove trailing zeros.


    for (i = xd.length; xd[--i] === 0;) xd.pop();
  }

  if (external) {
    // Overflow?
    if (x.e > Ctor.maxE) {
      // Infinity.
      x.d = null;
      x.e = NaN; // Underflow?
    } else if (x.e < Ctor.minE) {
      // Zero.
      x.e = 0;
      x.d = [0]; // Ctor.underflow = true;
    } // else Ctor.underflow = false;

  }

  return x;
}

function finiteToString(x, isExp, sd) {
  if (!x.isFinite()) return nonFiniteToString(x);
  var k,
      e = x.e,
      str = digitsToString(x.d),
      len = str.length;

  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + '.' + str.slice(1);
    }

    str = str + (x.e < 0 ? 'e' : 'e+') + x.e;
  } else if (e < 0) {
    str = '0.' + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0) str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
  } else {
    if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);

    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len) str += '.';
      str += getZeroString(k);
    }
  }

  return str;
} // Calculate the base 10 exponent from the base 1e7 exponent.


function getBase10Exponent(digits, e) {
  var w = digits[0]; // Add the number of digits of the first word of the digits array.

  for (e *= LOG_BASE; w >= 10; w /= 10) e++;

  return e;
}

function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {
    // Reset global state in case the exception is caught.
    external = true;
    if (pr) Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }

  return finalise(new Ctor(LN10), sd, 1, true);
}

function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}

function getPrecision(digits) {
  var w = digits.length - 1,
      len = w * LOG_BASE + 1;
  w = digits[w]; // If non-zero...

  if (w) {
    // Subtract the number of trailing zeros of the last word.
    for (; w % 10 == 0; w /= 10) len--; // Add the number of digits of the first word.


    for (w = digits[0]; w >= 10; w /= 10) len++;
  }

  return len;
}

function getZeroString(k) {
  var zs = '';

  for (; k--;) zs += '0';

  return zs;
}
/*
 * Return a new Decimal whose value is the value of Decimal `x` to the power `n`, where `n` is an
 * integer of type number.
 *
 * Implements 'exponentiation by squaring'. Called by `pow` and `parseOther`.
 *
 */


function intPow(Ctor, x, n, pr) {
  var isTruncated,
      r = new Ctor(1),
      // Max n of 9007199254740991 takes 53 loop iterations.
  // Maximum digits array length; leaves [28, 34] guard digits.
  k = Math.ceil(pr / LOG_BASE + 4);
  external = false;

  for (;;) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k)) isTruncated = true;
    }

    n = mathfloor(n / 2);

    if (n === 0) {
      // To ensure correct rounding when r.d is truncated, increment the last word if it is zero.
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0) ++r.d[n];
      break;
    }

    x = x.times(x);
    truncate(x.d, k);
  }

  external = true;
  return r;
}

function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}
/*
 * Handle `max` and `min`. `ltgt` is 'lt' or 'gt'.
 */


function maxOrMin(Ctor, args, ltgt) {
  var y,
      x = new Ctor(args[0]),
      i = 0;

  for (; ++i < args.length;) {
    y = new Ctor(args[i]);

    if (!y.s) {
      x = y;
      break;
    } else if (x[ltgt](y)) {
      x = y;
    }
  }

  return x;
}
/*
 * Return a new Decimal whose value is the natural exponential of `x` rounded to `sd` significant
 * digits.
 *
 * Taylor/Maclaurin series.
 *
 * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
 *
 * Argument reduction:
 *   Repeat x = x / 32, k += 5, until |x| < 0.1
 *   exp(x) = exp(x / 2^k)^(2^k)
 *
 * Previously, the argument was initially reduced by
 * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
 * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
 * found to be slower than just dividing repeatedly by 32 as above.
 *
 * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
 * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
 * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
 *
 *  exp(Infinity)  = Infinity
 *  exp(-Infinity) = 0
 *  exp(NaN)       = NaN
 *  exp(??0)        = 1
 *
 *  exp(x) is non-terminating for any finite, non-zero x.
 *
 *  The result will always be correctly rounded.
 *
 */


function naturalExponential(x, sd) {
  var denominator,
      guard,
      j,
      pow,
      sum,
      t,
      wpr,
      rep = 0,
      i = 0,
      k = 0,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision; // 0/NaN/Infinity?

  if (!x.d || !x.d[0] || x.e > 17) {
    return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }

  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }

  t = new Ctor(0.03125); // while abs(x) >= 0.1

  while (x.e > -2) {
    // x = x / 2^5
    x = x.times(t);
    k += 5;
  } // Use 2 * log10(2^k) + 5 (empirically derived) to estimate the increase in precision
  // necessary to ensure the first 4 rounding digits are correct.


  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow = sum = new Ctor(1);
  Ctor.precision = wpr;

  for (;;) {
    pow = finalise(pow.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum.plus(divide(pow, denominator, wpr, 1));

    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      j = k;

      while (j--) sum = finalise(sum.times(sum), wpr, 1); // Check to see if the first 4 rounding digits are [49]999.
      // If so, repeat the summation with a higher precision, otherwise
      // e.g. with precision: 18, rounding: 1
      // exp(18.404272462595034083567793919843761) = 98372560.1229999999 (should be 98372560.123)
      // `wpr - guard` is the index of first rounding digit.


      if (sd == null) {
        if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }

    sum = t;
  }
}
/*
 * Return a new Decimal whose value is the natural logarithm of `x` rounded to `sd` significant
 * digits.
 *
 *  ln(-n)        = NaN
 *  ln(0)         = -Infinity
 *  ln(-0)        = -Infinity
 *  ln(1)         = 0
 *  ln(Infinity)  = Infinity
 *  ln(-Infinity) = NaN
 *  ln(NaN)       = NaN
 *
 *  ln(n) (n != 1) is non-terminating.
 *
 */


function naturalLogarithm(y, sd) {
  var c,
      c0,
      denominator,
      e,
      numerator,
      rep,
      sum,
      t,
      wpr,
      x1,
      x2,
      n = 1,
      guard = 10,
      x = y,
      xd = x.d,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision; // Is x negative or Infinity, NaN, 0 or 1?

  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }

  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }

  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);

  if (Math.abs(e = x.e) < 1.5e15) {
    // Argument reduction.
    // The series converges faster the closer the argument is to 1, so using
    // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
    // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
    // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
    // later be divided by this number, then separate out the power of 10 using
    // ln(a*10^b) = ln(a) + b*ln(10).
    // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
    //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
    // max n is 6 (gives 0.7 - 1.3)
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }

    e = x.e;

    if (c0 > 1) {
      x = new Ctor('0.' + c);
      e++;
    } else {
      x = new Ctor(c0 + '.' + c.slice(1));
    }
  } else {
    // The argument reduction method above may result in overflow if the argument y is a massive
    // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
    // function using ln(x*10^e) = ln(x) + e*ln(10).
    t = getLn10(Ctor, wpr + 2, pr).times(e + '');
    x = naturalLogarithm(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;
    return sd == null ? finalise(x, pr, rm, external = true) : x;
  } // x1 is x reduced to a value near 1.


  x1 = x; // Taylor series.
  // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
  // where x = (y - 1)/(y + 1)    (|x| < 1)

  sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;

  for (;;) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));

    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      sum = sum.times(2); // Reverse the argument reduction. Check that e is not 0 because, besides preventing an
      // unnecessary calculation, -0 + 0 = +0 and to ensure correct rounding -0 needs to stay -0.

      if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
      sum = divide(sum, new Ctor(n), wpr, 1); // Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
      // been repeated previously) and the first 4 rounding digits 9999?
      // If so, restart the summation with a higher precision, otherwise
      // e.g. with precision: 12, rounding: 1
      // ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.
      // `wpr - guard` is the index of first rounding digit.

      if (sd == null) {
        if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }

    sum = t;
    denominator += 2;
  }
} // ??Infinity, NaN.


function nonFiniteToString(x) {
  // Unsigned.
  return String(x.s * x.s / 0);
}
/*
 * Parse the value of a new Decimal `x` from string `str`.
 */


function parseDecimal(x, str) {
  var e, i, len; // Decimal point?

  if ((e = str.indexOf('.')) > -1) str = str.replace('.', ''); // Exponential form?

  if ((i = str.search(/e/i)) > 0) {
    // Determine exponent.
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {
    // Integer.
    e = str.length;
  } // Determine leading zeros.


  for (i = 0; str.charCodeAt(i) === 48; i++); // Determine trailing zeros.


  for (len = str.length; str.charCodeAt(len - 1) === 48; --len);

  str = str.slice(i, len);

  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = []; // Transform base
    // e is the base 10 exponent.
    // i is where to slice str to get the first word of the digits array.

    i = (e + 1) % LOG_BASE;
    if (e < 0) i += LOG_BASE;

    if (i < len) {
      if (i) x.d.push(+str.slice(0, i));

      for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));

      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }

    for (; i--;) str += '0';

    x.d.push(+str);

    if (external) {
      // Overflow?
      if (x.e > x.constructor.maxE) {
        // Infinity.
        x.d = null;
        x.e = NaN; // Underflow?
      } else if (x.e < x.constructor.minE) {
        // Zero.
        x.e = 0;
        x.d = [0]; // x.constructor.underflow = true;
      } // else x.constructor.underflow = false;

    }
  } else {
    // Zero.
    x.e = 0;
    x.d = [0];
  }

  return x;
}
/*
 * Parse the value of a new Decimal `x` from a string `str`, which is not a decimal value.
 */


function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;

  if (str.indexOf('_') > -1) {
    str = str.replace(/(\d)_(?=\d)/g, '$1');
    if (isDecimal.test(str)) return parseDecimal(x, str);
  } else if (str === 'Infinity' || str === 'NaN') {
    if (!+str) x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }

  if (isHex.test(str)) {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str)) {
    base = 2;
  } else if (isOctal.test(str)) {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  } // Is there a binary exponent part?


  i = str.search(/p/i);

  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  } // Convert `str` as an integer then divide the result by `base` raised to a power such that the
  // fraction part will be restored.


  i = str.indexOf('.');
  isFloat = i >= 0;
  Ctor = x.constructor;

  if (isFloat) {
    str = str.replace('.', '');
    len = str.length;
    i = len - i; // log[10](16) = 1.2041... , log[10](88) = 1.9444....

    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }

  xd = convertBase(str, base, BASE);
  xe = xd.length - 1; // Remove trailing zeros.

  for (i = xe; xd[i] === 0; --i) xd.pop();

  if (i < 0) return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false; // At what precision to perform the division to ensure exact conversion?
  // maxDecimalIntegerPartDigitCount = ceil(log[10](b) * otherBaseIntegerPartDigitCount)
  // log[10](2) = 0.30103, log[10](8) = 0.90309, log[10](16) = 1.20412
  // E.g. ceil(1.2 * 3) = 4, so up to 4 decimal digits are needed to represent 3 hex int digits.
  // maxDecimalFractionPartDigitCount = {Hex:4|Oct:3|Bin:1} * otherBaseFractionPartDigitCount
  // Therefore using 4 * the number of digits of str will always be enough.

  if (isFloat) x = divide(x, divisor, len * 4); // Multiply by the binary exponent part if present.

  if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;
  return x;
}
/*
 * sin(x) = x - x^3/3! + x^5/5! - ...
 * |x| < pi/2
 *
 */


function sine(Ctor, x) {
  var k,
      len = x.d.length;

  if (len < 3) {
    return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
  } // Argument reduction: sin(5x) = 16*sin^5(x) - 20*sin^3(x) + 5*sin(x)
  // i.e. sin(x) = 16*sin^5(x/5) - 20*sin^3(x/5) + 5*sin(x/5)
  // and  sin(x) = sin(x/5)(5 + sin^2(x/5)(16sin^2(x/5) - 20))
  // Estimate the optimum number of times to use the argument reduction.


  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;
  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x); // Reverse argument reduction

  var sin2_x,
      d5 = new Ctor(5),
      d16 = new Ctor(16),
      d20 = new Ctor(20);

  for (; k--;) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }

  return x;
} // Calculate Taylor series for `cos`, `cosh`, `sin` and `sinh`.


function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j,
      t,
      u,
      x2,
      pr = Ctor.precision,
      k = Math.ceil(pr / LOG_BASE);
  external = false;
  x2 = x.times(x);
  u = new Ctor(y);

  for (;;) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);

    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--;);

      if (j == -1) break;
    }

    j = u;
    u = y;
    y = t;
    t = j;
  }

  external = true;
  t.d.length = k + 1;
  return t;
} // Exponent e must be positive and non-zero.


function tinyPow(b, e) {
  var n = b;

  while (--e) n *= b;

  return n;
} // Return the absolute value of `x` reduced to less than or equal to half pi.


function toLessThanHalfPi(Ctor, x) {
  var t,
      isNeg = x.s < 0,
      pi = getPi(Ctor, Ctor.precision, 1),
      halfPi = pi.times(0.5);
  x = x.abs();

  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }

  t = x.divToInt(pi);

  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi)); // 0 <= x < pi

    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
      return x;
    }

    quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
  }

  return x.minus(pi).abs();
}
/*
 * Return the value of Decimal `x` as a string in base `baseOut`.
 *
 * If the optional `sd` argument is present include a binary exponent suffix.
 */


function toStringBinary(x, baseOut, sd, rm) {
  var base,
      e,
      i,
      k,
      len,
      roundUp,
      str,
      xd,
      y,
      Ctor = x.constructor,
      isExp = sd !== void 0;

  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }

  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf('.'); // Use exponential notation according to `toExpPos` and `toExpNeg`? No, but if required:
    // maxBinaryExponent = floor((decimalExponent + 1) * log[2](10))
    // minBinaryExponent = floor(decimalExponent * log[2](10))
    // log[2](10) = 3.321928094887362347870319429489390175864

    if (isExp) {
      base = 2;

      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    } // Convert the number as an integer then divide the result by its base raised to a power such
    // that the fraction part will be restored.
    // Non-integer.


    if (i >= 0) {
      str = str.replace('.', '');
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }

    xd = convertBase(str, 10, base);
    e = len = xd.length; // Remove trailing zeros.

    for (; xd[--len] == 0;) xd.pop();

    if (!xd[0]) {
      str = isExp ? '0p+0' : '0';
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      } // The rounding digit, i.e. the digit after the digit that may be rounded up.


      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;
      roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
      xd.length = sd;

      if (roundUp) {
        // Rounding up may mean the previous digit has to be rounded up and so on.
        for (; ++xd[--sd] > base - 1;) {
          xd[sd] = 0;

          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      } // Determine trailing zeros.


      for (len = xd.length; !xd[len - 1]; --len); // E.g. [4, 11, 15] becomes 4bf.


      for (i = 0, str = ''; i < len; i++) str += NUMERALS.charAt(xd[i]); // Add binary exponent suffix?


      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;

            for (--len; len % i; len++) str += '0';

            xd = convertBase(str, base, baseOut);

            for (len = xd.length; !xd[len - 1]; --len); // xd[0] will always be be 1


            for (i = 1, str = '1.'; i < len; i++) str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + '.' + str.slice(1);
          }
        }

        str = str + (e < 0 ? 'p' : 'p+') + e;
      } else if (e < 0) {
        for (; ++e;) str = '0' + str;

        str = '0.' + str;
      } else {
        if (++e > len) for (e -= len; e--;) str += '0';else if (e < len) str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    str = (baseOut == 16 ? '0x' : baseOut == 2 ? '0b' : baseOut == 8 ? '0o' : '') + str;
  }

  return x.s < 0 ? '-' + str : str;
} // Does not strip trailing zeros.


function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
} // Decimal methods

/*
 *  abs
 *  acos
 *  acosh
 *  add
 *  asin
 *  asinh
 *  atan
 *  atanh
 *  atan2
 *  cbrt
 *  ceil
 *  clamp
 *  clone
 *  config
 *  cos
 *  cosh
 *  div
 *  exp
 *  floor
 *  hypot
 *  ln
 *  log
 *  log2
 *  log10
 *  max
 *  min
 *  mod
 *  mul
 *  pow
 *  random
 *  round
 *  set
 *  sign
 *  sin
 *  sinh
 *  sqrt
 *  sub
 *  sum
 *  tan
 *  tanh
 *  trunc
 */

/*
 * Return a new Decimal whose value is the absolute value of `x`.
 *
 * x {number|string|Decimal}
 *
 */


function abs(x) {
  return new this(x).abs();
}
/*
 * Return a new Decimal whose value is the arccosine in radians of `x`.
 *
 * x {number|string|Decimal}
 *
 */


function acos(x) {
  return new this(x).acos();
}
/*
 * Return a new Decimal whose value is the inverse of the hyperbolic cosine of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function acosh(x) {
  return new this(x).acosh();
}
/*
 * Return a new Decimal whose value is the sum of `x` and `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */


function add(x, y) {
  return new this(x).plus(y);
}
/*
 * Return a new Decimal whose value is the arcsine in radians of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function asin(x) {
  return new this(x).asin();
}
/*
 * Return a new Decimal whose value is the inverse of the hyperbolic sine of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function asinh(x) {
  return new this(x).asinh();
}
/*
 * Return a new Decimal whose value is the arctangent in radians of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function atan(x) {
  return new this(x).atan();
}
/*
 * Return a new Decimal whose value is the inverse of the hyperbolic tangent of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function atanh(x) {
  return new this(x).atanh();
}
/*
 * Return a new Decimal whose value is the arctangent in radians of `y/x` in the range -pi to pi
 * (inclusive), rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi, pi]
 *
 * y {number|string|Decimal} The y-coordinate.
 * x {number|string|Decimal} The x-coordinate.
 *
 * atan2(??0, -0)               = ??pi
 * atan2(??0, +0)               = ??0
 * atan2(??0, -x)               = ??pi for x > 0
 * atan2(??0, x)                = ??0 for x > 0
 * atan2(-y, ??0)               = -pi/2 for y > 0
 * atan2(y, ??0)                = pi/2 for y > 0
 * atan2(??y, -Infinity)        = ??pi for finite y > 0
 * atan2(??y, +Infinity)        = ??0 for finite y > 0
 * atan2(??Infinity, x)         = ??pi/2 for finite x
 * atan2(??Infinity, -Infinity) = ??3*pi/4
 * atan2(??Infinity, +Infinity) = ??pi/4
 * atan2(NaN, x) = NaN
 * atan2(y, NaN) = NaN
 *
 */


function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r,
      pr = this.precision,
      rm = this.rounding,
      wpr = pr + 4; // Either NaN

  if (!y.s || !x.s) {
    r = new this(NaN); // Both ??Infinity
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s; // x is ??Infinity or y is ??0
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s; // y is ??Infinity or x is ??0
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s; // Both non-zero and finite
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }

  return r;
}
/*
 * Return a new Decimal whose value is the cube root of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function cbrt(x) {
  return new this(x).cbrt();
}
/*
 * Return a new Decimal whose value is `x` rounded to an integer using `ROUND_CEIL`.
 *
 * x {number|string|Decimal}
 *
 */


function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}
/*
 * Return a new Decimal whose value is `x` clamped to the range delineated by `min` and `max`.
 *
 * x {number|string|Decimal}
 * min {number|string|Decimal}
 * max {number|string|Decimal}
 *
 */


function clamp(x, min, max) {
  return new this(x).clamp(min, max);
}
/*
 * Configure global settings for a Decimal constructor.
 *
 * `obj` is an object with one or more of the following properties,
 *
 *   precision  {number}
 *   rounding   {number}
 *   toExpNeg   {number}
 *   toExpPos   {number}
 *   maxE       {number}
 *   minE       {number}
 *   modulo     {number}
 *   crypto     {boolean|number}
 *   defaults   {true}
 *
 * E.g. Decimal.config({ precision: 20, rounding: 4 })
 *
 */


function config$1(obj) {
  if (!obj || typeof obj !== 'object') throw Error(decimalError + 'Object expected');
  var i,
      p,
      v,
      useDefaults = obj.defaults === true,
      ps = ['precision', 1, MAX_DIGITS, 'rounding', 0, 8, 'toExpNeg', -EXP_LIMIT, 0, 'toExpPos', 0, EXP_LIMIT, 'maxE', 0, EXP_LIMIT, 'minE', -EXP_LIMIT, 0, 'modulo', 0, 9];

  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];

    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;else throw Error(invalidArgument + p + ': ' + v);
    }
  }

  if (p = 'crypto', useDefaults) this[p] = DEFAULTS[p];

  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != 'undefined' && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ': ' + v);
    }
  }

  return this;
}
/*
 * Return a new Decimal whose value is the cosine of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function cos(x) {
  return new this(x).cos();
}
/*
 * Return a new Decimal whose value is the hyperbolic cosine of `x`, rounded to precision
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function cosh(x) {
  return new this(x).cosh();
}
/*
 * Create and return a Decimal constructor with the same configuration properties as this Decimal
 * constructor.
 *
 */


function clone$1(obj) {
  var i, p, ps;
  /*
   * The Decimal constructor and exported function.
   * Return a new Decimal instance.
   *
   * v {number|string|Decimal} A numeric value.
   *
   */

  function Decimal(v) {
    var e,
        i,
        t,
        x = this; // Decimal called without new.

    if (!(x instanceof Decimal)) return new Decimal(v); // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
    // which points to Object.

    x.constructor = Decimal; // Duplicate.

    if (isDecimalInstance(v)) {
      x.s = v.s;

      if (external) {
        if (!v.d || v.e > Decimal.maxE) {
          // Infinity.
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal.minE) {
          // Zero.
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }

      return;
    }

    t = typeof v;

    if (t === 'number') {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }

      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      } // Fast path for small integers.


      if (v === ~~v && v < 1e7) {
        for (e = 0, i = v; i >= 10; i /= 10) e++;

        if (external) {
          if (e > Decimal.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }

        return; // Infinity, NaN.
      } else if (v * 0 !== 0) {
        if (!v) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }

      return parseDecimal(x, v.toString());
    } else if (t !== 'string') {
      throw Error(invalidArgument + v);
    } // Minus sign?


    if ((i = v.charCodeAt(0)) === 45) {
      v = v.slice(1);
      x.s = -1;
    } else {
      // Plus sign?
      if (i === 43) v = v.slice(1);
      x.s = 1;
    }

    return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
  }

  Decimal.prototype = P;
  Decimal.ROUND_UP = 0;
  Decimal.ROUND_DOWN = 1;
  Decimal.ROUND_CEIL = 2;
  Decimal.ROUND_FLOOR = 3;
  Decimal.ROUND_HALF_UP = 4;
  Decimal.ROUND_HALF_DOWN = 5;
  Decimal.ROUND_HALF_EVEN = 6;
  Decimal.ROUND_HALF_CEIL = 7;
  Decimal.ROUND_HALF_FLOOR = 8;
  Decimal.EUCLID = 9;
  Decimal.config = Decimal.set = config$1;
  Decimal.clone = clone$1;
  Decimal.isDecimal = isDecimalInstance;
  Decimal.abs = abs;
  Decimal.acos = acos;
  Decimal.acosh = acosh; // ES6

  Decimal.add = add;
  Decimal.asin = asin;
  Decimal.asinh = asinh; // ES6

  Decimal.atan = atan;
  Decimal.atanh = atanh; // ES6

  Decimal.atan2 = atan2;
  Decimal.cbrt = cbrt; // ES6

  Decimal.ceil = ceil;
  Decimal.clamp = clamp;
  Decimal.cos = cos;
  Decimal.cosh = cosh; // ES6

  Decimal.div = div;
  Decimal.exp = exp;
  Decimal.floor = floor;
  Decimal.hypot = hypot; // ES6

  Decimal.ln = ln;
  Decimal.log = log;
  Decimal.log10 = log10; // ES6

  Decimal.log2 = log2; // ES6

  Decimal.max = max;
  Decimal.min = min;
  Decimal.mod = mod;
  Decimal.mul = mul;
  Decimal.pow = pow;
  Decimal.random = random;
  Decimal.round = round;
  Decimal.sign = sign; // ES6

  Decimal.sin = sin;
  Decimal.sinh = sinh; // ES6

  Decimal.sqrt = sqrt;
  Decimal.sub = sub;
  Decimal.sum = sum;
  Decimal.tan = tan;
  Decimal.tanh = tanh; // ES6

  Decimal.trunc = trunc; // ES6

  if (obj === void 0) obj = {};

  if (obj) {
    if (obj.defaults !== true) {
      ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'];

      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
  }

  Decimal.config(obj);
  return Decimal;
}
/*
 * Return a new Decimal whose value is `x` divided by `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */


function div(x, y) {
  return new this(x).div(y);
}
/*
 * Return a new Decimal whose value is the natural exponential of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} The power to which to raise the base of the natural log.
 *
 */


function exp(x) {
  return new this(x).exp();
}
/*
 * Return a new Decimal whose value is `x` round to an integer using `ROUND_FLOOR`.
 *
 * x {number|string|Decimal}
 *
 */


function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}
/*
 * Return a new Decimal whose value is the square root of the sum of the squares of the arguments,
 * rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * hypot(a, b, ...) = sqrt(a^2 + b^2 + ...)
 *
 * arguments {number|string|Decimal}
 *
 */


function hypot() {
  var i,
      n,
      t = new this(0);
  external = false;

  for (i = 0; i < arguments.length;) {
    n = new this(arguments[i++]);

    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }

      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }

  external = true;
  return t.sqrt();
}
/*
 * Return true if object is a Decimal instance (where Decimal is any Decimal constructor),
 * otherwise return false.
 *
 */


function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}
/*
 * Return a new Decimal whose value is the natural logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function ln(x) {
  return new this(x).ln();
}
/*
 * Return a new Decimal whose value is the log of `x` to the base `y`, or to base 10 if no base
 * is specified, rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * log[y](x)
 *
 * x {number|string|Decimal} The argument of the logarithm.
 * y {number|string|Decimal} The base of the logarithm.
 *
 */


function log(x, y) {
  return new this(x).log(y);
}
/*
 * Return a new Decimal whose value is the base 2 logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function log2(x) {
  return new this(x).log(2);
}
/*
 * Return a new Decimal whose value is the base 10 logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function log10(x) {
  return new this(x).log(10);
}
/*
 * Return a new Decimal whose value is the maximum of the arguments.
 *
 * arguments {number|string|Decimal}
 *
 */


function max() {
  return maxOrMin(this, arguments, 'lt');
}
/*
 * Return a new Decimal whose value is the minimum of the arguments.
 *
 * arguments {number|string|Decimal}
 *
 */


function min() {
  return maxOrMin(this, arguments, 'gt');
}
/*
 * Return a new Decimal whose value is `x` modulo `y`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */


function mod(x, y) {
  return new this(x).mod(y);
}
/*
 * Return a new Decimal whose value is `x` multiplied by `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */


function mul(x, y) {
  return new this(x).mul(y);
}
/*
 * Return a new Decimal whose value is `x` raised to the power `y`, rounded to precision
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} The base.
 * y {number|string|Decimal} The exponent.
 *
 */


function pow(x, y) {
  return new this(x).pow(y);
}
/*
 * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and with
 * `sd`, or `Decimal.precision` if `sd` is omitted, significant digits (or less if trailing zeros
 * are produced).
 *
 * [sd] {number} Significant digits. Integer, 0 to MAX_DIGITS inclusive.
 *
 */


function random(sd) {
  var d,
      e,
      k,
      n,
      i = 0,
      r = new this(1),
      rd = [];
  if (sd === void 0) sd = this.precision;else checkInt32(sd, 1, MAX_DIGITS);
  k = Math.ceil(sd / LOG_BASE);

  if (!this.crypto) {
    for (; i < k;) rd[i++] = Math.random() * 1e7 | 0; // Browsers supporting crypto.getRandomValues.

  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));

    for (; i < k;) {
      n = d[i]; // 0 <= n < 4294967296
      // Probability n >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).

      if (n >= 4.29e9) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {
        // 0 <= n <= 4289999999
        // 0 <= (n % 1e7) <= 9999999
        rd[i++] = n % 1e7;
      }
    } // Node.js supporting crypto.randomBytes.

  } else if (crypto.randomBytes) {
    // buffer
    d = crypto.randomBytes(k *= 4);

    for (; i < k;) {
      // 0 <= n < 2147483648
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 0x7f) << 24); // Probability n >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).

      if (n >= 2.14e9) {
        crypto.randomBytes(4).copy(d, i);
      } else {
        // 0 <= n <= 2139999999
        // 0 <= (n % 1e7) <= 9999999
        rd.push(n % 1e7);
        i += 4;
      }
    }

    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }

  k = rd[--i];
  sd %= LOG_BASE; // Convert trailing digits to zeros according to sd.

  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  } // Remove trailing words which are zero.


  for (; rd[i] === 0; i--) rd.pop(); // Zero?


  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1; // Remove leading words which are zero and adjust exponent accordingly.

    for (; rd[0] === 0; e -= LOG_BASE) rd.shift(); // Count the digits of the first word of rd to determine leading zeros.


    for (k = 1, n = rd[0]; n >= 10; n /= 10) k++; // Adjust the exponent for leading zeros of the first word of rd.


    if (k < LOG_BASE) e -= LOG_BASE - k;
  }

  r.e = e;
  r.d = rd;
  return r;
}
/*
 * Return a new Decimal whose value is `x` rounded to an integer using rounding mode `rounding`.
 *
 * To emulate `Math.round`, set rounding to 7 (ROUND_HALF_CEIL).
 *
 * x {number|string|Decimal}
 *
 */


function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}
/*
 * Return
 *   1    if x > 0,
 *  -1    if x < 0,
 *   0    if x is 0,
 *  -0    if x is -0,
 *   NaN  otherwise
 *
 * x {number|string|Decimal}
 *
 */


function sign(x) {
  x = new this(x);
  return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
/*
 * Return a new Decimal whose value is the sine of `x`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function sin(x) {
  return new this(x).sin();
}
/*
 * Return a new Decimal whose value is the hyperbolic sine of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function sinh(x) {
  return new this(x).sinh();
}
/*
 * Return a new Decimal whose value is the square root of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */


function sqrt(x) {
  return new this(x).sqrt();
}
/*
 * Return a new Decimal whose value is `x` minus `y`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */


function sub(x, y) {
  return new this(x).sub(y);
}
/*
 * Return a new Decimal whose value is the sum of the arguments, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * Only the result is rounded, not the intermediate calculations.
 *
 * arguments {number|string|Decimal}
 *
 */


function sum() {
  var i = 0,
      args = arguments,
      x = new this(args[i]);
  external = false;

  for (; x.s && ++i < args.length;) x = x.plus(args[i]);

  external = true;
  return finalise(x, this.precision, this.rounding);
}
/*
 * Return a new Decimal whose value is the tangent of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function tan(x) {
  return new this(x).tan();
}
/*
 * Return a new Decimal whose value is the hyperbolic tangent of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */


function tanh(x) {
  return new this(x).tanh();
}
/*
 * Return a new Decimal whose value is `x` truncated to an integer.
 *
 * x {number|string|Decimal}
 *
 */


function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}

P[Symbol.for('nodejs.util.inspect.custom')] = P.toString;
P[Symbol.toStringTag] = 'Decimal'; // Create and configure initial Decimal constructor.

var Decimal = P.constructor = clone$1(DEFAULTS); // Create the internal constants from their string values.

LN10 = new Decimal(LN10);
PI = new Decimal(PI);

var name = 'BigNumber';
var dependencies$1 = ['?on', 'config'];
var createBigNumberClass = /* #__PURE__ */factory(name, dependencies$1, _ref => {
  var {
    on,
    config
  } = _ref;
  var BigNumber = Decimal.clone({
    precision: config.precision,
    modulo: Decimal.EUCLID
  });
  BigNumber.prototype = Object.create(BigNumber.prototype);
  /**
   * Attach type information
   */

  BigNumber.prototype.type = 'BigNumber';
  BigNumber.prototype.isBigNumber = true;
  /**
   * Get a JSON representation of a BigNumber containing
   * type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "BigNumber", "value": "0.2"}`
   */

  BigNumber.prototype.toJSON = function () {
    return {
      mathjs: 'BigNumber',
      value: this.toString()
    };
  };
  /**
   * Instantiate a BigNumber from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "BigNumber", "value": "0.2"}`
   * @return {BigNumber}
   */


  BigNumber.fromJSON = function (json) {
    return new BigNumber(json.value);
  };

  if (on) {
    // listen for changed in the configuration, automatically apply changed precision
    on('config', function (curr, prev) {
      if (curr.precision !== prev.precision) {
        BigNumber.config({
          precision: curr.precision
        });
      }
    });
  }

  return BigNumber;
}, {
  isClass: true
});

var complex = createCommonjsModule(function (module, exports) {
/**
 * @license Complex.js v2.1.1 12/05/2020
 *
 * Copyright (c) 2020, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 *
 * This class allows the manipulation of complex numbers.
 * You can pass a complex number in different formats. Either as object, double, string or two integer parameters.
 *
 * Object form
 * { re: <real>, im: <imaginary> }
 * { arg: <angle>, abs: <radius> }
 * { phi: <angle>, r: <radius> }
 *
 * Array / Vector form
 * [ real, imaginary ]
 *
 * Double form
 * 99.3 - Single double value
 *
 * String form
 * '23.1337' - Simple real number
 * '15+3i' - a simple complex number
 * '3-i' - a simple complex number
 *
 * Example:
 *
 * var c = new Complex('99.3+8i');
 * c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
 *
 */
(function (root) {

  var cosh = Math.cosh || function (x) {
    return Math.abs(x) < 1e-9 ? 1 - x : (Math.exp(x) + Math.exp(-x)) * 0.5;
  };

  var sinh = Math.sinh || function (x) {
    return Math.abs(x) < 1e-9 ? x : (Math.exp(x) - Math.exp(-x)) * 0.5;
  };
  /**
   * Calculates cos(x) - 1 using Taylor series if x is small (-???? ??? x ??? ????).
   *
   * @param {number} x
   * @returns {number} cos(x) - 1
   */


  var cosm1 = function (x) {
    var b = Math.PI / 4;

    if (-b > x || x > b) {
      return Math.cos(x) - 1.0;
    }
    /* Calculate horner form of polynomial of taylor series in Q
    var fac = 1, alt = 1, pol = {};
    for (var i = 0; i <= 16; i++) {
      fac*= i || 1;
      if (i % 2 == 0) {
        pol[i] = new Fraction(1, alt * fac);
        alt = -alt;
      }
    }
    console.log(new Polynomial(pol).toHorner()); // (((((((1/20922789888000x^2-1/87178291200)x^2+1/479001600)x^2-1/3628800)x^2+1/40320)x^2-1/720)x^2+1/24)x^2-1/2)x^2+1
    */


    var xx = x * x;
    return xx * (xx * (xx * (xx * (xx * (xx * (xx * (xx / 20922789888000 - 1 / 87178291200) + 1 / 479001600) - 1 / 3628800) + 1 / 40320) - 1 / 720) + 1 / 24) - 1 / 2);
  };

  var hypot = function (x, y) {
    var a = Math.abs(x);
    var b = Math.abs(y);

    if (a < 3000 && b < 3000) {
      return Math.sqrt(a * a + b * b);
    }

    if (a < b) {
      a = b;
      b = x / y;
    } else {
      b = y / x;
    }

    return a * Math.sqrt(1 + b * b);
  };

  var parser_exit = function () {
    throw SyntaxError('Invalid Param');
  };
  /**
   * Calculates log(sqrt(a^2+b^2)) in a way to avoid overflows
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */


  function logHypot(a, b) {
    var _a = Math.abs(a);

    var _b = Math.abs(b);

    if (a === 0) {
      return Math.log(_b);
    }

    if (b === 0) {
      return Math.log(_a);
    }

    if (_a < 3000 && _b < 3000) {
      return Math.log(a * a + b * b) * 0.5;
    }
    /* I got 4 ideas to compute this property without overflow:
     *
     * Testing 1000000 times with random samples for a,b ??? [1, 1000000000] against a big decimal library to get an error estimate
     *
     * 1. Only eliminate the square root: (OVERALL ERROR: 3.9122483030951116e-11)
      Math.log(a * a + b * b) / 2
      *
     *
     * 2. Try to use the non-overflowing pythagoras: (OVERALL ERROR: 8.889760039210159e-10)
      var fn = function(a, b) {
     a = Math.abs(a);
     b = Math.abs(b);
     var t = Math.min(a, b);
     a = Math.max(a, b);
     t = t / a;
      return Math.log(a) + Math.log(1 + t * t) / 2;
     };
      * 3. Abuse the identity cos(atan(y/x) = x / sqrt(x^2+y^2): (OVERALL ERROR: 3.4780178737037204e-10)
      Math.log(a / Math.cos(Math.atan2(b, a)))
      * 4. Use 3. and apply log rules: (OVERALL ERROR: 1.2014087502620896e-9)
      Math.log(a) - Math.log(Math.cos(Math.atan2(b, a)))
      */


    a = a / 2;
    b = b / 2;
    return 0.5 * Math.log(a * a + b * b) + Math.LN2;
  }

  var parse = function (a, b) {
    var z = {
      're': 0,
      'im': 0
    };

    if (a === undefined || a === null) {
      z['re'] = z['im'] = 0;
    } else if (b !== undefined) {
      z['re'] = a;
      z['im'] = b;
    } else switch (typeof a) {
      case 'object':
        if ('im' in a && 're' in a) {
          z['re'] = a['re'];
          z['im'] = a['im'];
        } else if ('abs' in a && 'arg' in a) {
          if (!Number.isFinite(a['abs']) && Number.isFinite(a['arg'])) {
            return Complex['INFINITY'];
          }

          z['re'] = a['abs'] * Math.cos(a['arg']);
          z['im'] = a['abs'] * Math.sin(a['arg']);
        } else if ('r' in a && 'phi' in a) {
          if (!Number.isFinite(a['r']) && Number.isFinite(a['phi'])) {
            return Complex['INFINITY'];
          }

          z['re'] = a['r'] * Math.cos(a['phi']);
          z['im'] = a['r'] * Math.sin(a['phi']);
        } else if (a.length === 2) {
          // Quick array check
          z['re'] = a[0];
          z['im'] = a[1];
        } else {
          parser_exit();
        }

        break;

      case 'string':
        z['im'] =
        /* void */
        z['re'] = 0;
        var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
        var plus = 1;
        var minus = 0;

        if (tokens === null) {
          parser_exit();
        }

        for (var i = 0; i < tokens.length; i++) {
          var c = tokens[i];

          if (c === ' ' || c === '\t' || c === '\n') ; else if (c === '+') {
            plus++;
          } else if (c === '-') {
            minus++;
          } else if (c === 'i' || c === 'I') {
            if (plus + minus === 0) {
              parser_exit();
            }

            if (tokens[i + 1] !== ' ' && !isNaN(tokens[i + 1])) {
              z['im'] += parseFloat((minus % 2 ? '-' : '') + tokens[i + 1]);
              i++;
            } else {
              z['im'] += parseFloat((minus % 2 ? '-' : '') + '1');
            }

            plus = minus = 0;
          } else {
            if (plus + minus === 0 || isNaN(c)) {
              parser_exit();
            }

            if (tokens[i + 1] === 'i' || tokens[i + 1] === 'I') {
              z['im'] += parseFloat((minus % 2 ? '-' : '') + c);
              i++;
            } else {
              z['re'] += parseFloat((minus % 2 ? '-' : '') + c);
            }

            plus = minus = 0;
          }
        } // Still something on the stack


        if (plus + minus > 0) {
          parser_exit();
        }

        break;

      case 'number':
        z['im'] = 0;
        z['re'] = a;
        break;

      default:
        parser_exit();
    }

    return z;
  };
  /**
   * @constructor
   * @returns {Complex}
   */


  function Complex(a, b) {
    if (!(this instanceof Complex)) {
      return new Complex(a, b);
    }

    var z = parse(a, b);
    this['re'] = z['re'];
    this['im'] = z['im'];
  }

  Complex.prototype = {
    're': 0,
    'im': 0,

    /**
     * Calculates the sign of a complex number, which is a normalized complex
     *
     * @returns {Complex}
     */
    'sign': function () {
      var abs = this['abs']();
      return new Complex(this['re'] / abs, this['im'] / abs);
    },

    /**
     * Adds two complex numbers
     *
     * @returns {Complex}
     */
    'add': function (a, b) {
      var z = new Complex(a, b); // Infinity + Infinity = NaN

      if (this['isInfinite']() && z['isInfinite']()) {
        return Complex['NAN'];
      } // Infinity + z = Infinity { where z != Infinity }


      if (this['isInfinite']() || z['isInfinite']()) {
        return Complex['INFINITY'];
      }

      return new Complex(this['re'] + z['re'], this['im'] + z['im']);
    },

    /**
     * Subtracts two complex numbers
     *
     * @returns {Complex}
     */
    'sub': function (a, b) {
      var z = new Complex(a, b); // Infinity - Infinity = NaN

      if (this['isInfinite']() && z['isInfinite']()) {
        return Complex['NAN'];
      } // Infinity - z = Infinity { where z != Infinity }


      if (this['isInfinite']() || z['isInfinite']()) {
        return Complex['INFINITY'];
      }

      return new Complex(this['re'] - z['re'], this['im'] - z['im']);
    },

    /**
     * Multiplies two complex numbers
     *
     * @returns {Complex}
     */
    'mul': function (a, b) {
      var z = new Complex(a, b); // Infinity * 0 = NaN

      if (this['isInfinite']() && z['isZero']() || this['isZero']() && z['isInfinite']()) {
        return Complex['NAN'];
      } // Infinity * z = Infinity { where z != 0 }


      if (this['isInfinite']() || z['isInfinite']()) {
        return Complex['INFINITY'];
      } // Short circuit for real values


      if (z['im'] === 0 && this['im'] === 0) {
        return new Complex(this['re'] * z['re'], 0);
      }

      return new Complex(this['re'] * z['re'] - this['im'] * z['im'], this['re'] * z['im'] + this['im'] * z['re']);
    },

    /**
     * Divides two complex numbers
     *
     * @returns {Complex}
     */
    'div': function (a, b) {
      var z = new Complex(a, b); // 0 / 0 = NaN and Infinity / Infinity = NaN

      if (this['isZero']() && z['isZero']() || this['isInfinite']() && z['isInfinite']()) {
        return Complex['NAN'];
      } // Infinity / 0 = Infinity


      if (this['isInfinite']() || z['isZero']()) {
        return Complex['INFINITY'];
      } // 0 / Infinity = 0


      if (this['isZero']() || z['isInfinite']()) {
        return Complex['ZERO'];
      }

      a = this['re'];
      b = this['im'];
      var c = z['re'];
      var d = z['im'];
      var t, x;

      if (0 === d) {
        // Divisor is real
        return new Complex(a / c, b / c);
      }

      if (Math.abs(c) < Math.abs(d)) {
        x = c / d;
        t = c * x + d;
        return new Complex((a * x + b) / t, (b * x - a) / t);
      } else {
        x = d / c;
        t = d * x + c;
        return new Complex((a + b * x) / t, (b - a * x) / t);
      }
    },

    /**
     * Calculate the power of two complex numbers
     *
     * @returns {Complex}
     */
    'pow': function (a, b) {
      var z = new Complex(a, b);
      a = this['re'];
      b = this['im'];

      if (z['isZero']()) {
        return Complex['ONE'];
      } // If the exponent is real


      if (z['im'] === 0) {
        if (b === 0 && a > 0) {
          return new Complex(Math.pow(a, z['re']), 0);
        } else if (a === 0) {
          // If base is fully imaginary
          switch ((z['re'] % 4 + 4) % 4) {
            case 0:
              return new Complex(Math.pow(b, z['re']), 0);

            case 1:
              return new Complex(0, Math.pow(b, z['re']));

            case 2:
              return new Complex(-Math.pow(b, z['re']), 0);

            case 3:
              return new Complex(0, -Math.pow(b, z['re']));
          }
        }
      }
      /* I couldn't find a good formula, so here is a derivation and optimization
       *
       * z_1^z_2 = (a + bi)^(c + di)
       *         = exp((c + di) * log(a + bi)
       *         = pow(a^2 + b^2, (c + di) / 2) * exp(i(c + di)atan2(b, a))
       * =>...
       * Re = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * cos(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
       * Im = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * sin(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
       *
       * =>...
       * Re = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * cos(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
       * Im = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * sin(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
       *
       * =>
       * Re = exp(c * logsq2 - d * arg(z_1)) * cos(d * logsq2 + c * arg(z_1))
       * Im = exp(c * logsq2 - d * arg(z_1)) * sin(d * logsq2 + c * arg(z_1))
       *
       */


      if (a === 0 && b === 0 && z['re'] > 0 && z['im'] >= 0) {
        return Complex['ZERO'];
      }

      var arg = Math.atan2(b, a);
      var loh = logHypot(a, b);
      a = Math.exp(z['re'] * loh - z['im'] * arg);
      b = z['im'] * loh + z['re'] * arg;
      return new Complex(a * Math.cos(b), a * Math.sin(b));
    },

    /**
     * Calculate the complex square root
     *
     * @returns {Complex}
     */
    'sqrt': function () {
      var a = this['re'];
      var b = this['im'];
      var r = this['abs']();
      var re, im;

      if (a >= 0) {
        if (b === 0) {
          return new Complex(Math.sqrt(a), 0);
        }

        re = 0.5 * Math.sqrt(2.0 * (r + a));
      } else {
        re = Math.abs(b) / Math.sqrt(2 * (r - a));
      }

      if (a <= 0) {
        im = 0.5 * Math.sqrt(2.0 * (r - a));
      } else {
        im = Math.abs(b) / Math.sqrt(2 * (r + a));
      }

      return new Complex(re, b < 0 ? -im : im);
    },

    /**
     * Calculate the complex exponent
     *
     * @returns {Complex}
     */
    'exp': function () {
      var tmp = Math.exp(this['re']);

      if (this['im'] === 0) ;

      return new Complex(tmp * Math.cos(this['im']), tmp * Math.sin(this['im']));
    },

    /**
     * Calculate the complex exponent and subtracts one.
     *
     * This may be more accurate than `Complex(x).exp().sub(1)` if
     * `x` is small.
     *
     * @returns {Complex}
     */
    'expm1': function () {
      /**
       * exp(a + i*b) - 1
       = exp(a) * (cos(b) + j*sin(b)) - 1
       = expm1(a)*cos(b) + cosm1(b) + j*exp(a)*sin(b)
       */
      var a = this['re'];
      var b = this['im'];
      return new Complex(Math.expm1(a) * Math.cos(b) + cosm1(b), Math.exp(a) * Math.sin(b));
    },

    /**
     * Calculate the natural log
     *
     * @returns {Complex}
     */
    'log': function () {
      var a = this['re'];
      var b = this['im'];

      return new Complex(logHypot(a, b), Math.atan2(b, a));
    },

    /**
     * Calculate the magnitude of the complex number
     *
     * @returns {number}
     */
    'abs': function () {
      return hypot(this['re'], this['im']);
    },

    /**
     * Calculate the angle of the complex number
     *
     * @returns {number}
     */
    'arg': function () {
      return Math.atan2(this['im'], this['re']);
    },

    /**
     * Calculate the sine of the complex number
     *
     * @returns {Complex}
     */
    'sin': function () {
      // sin(z) = ( e^iz - e^-iz ) / 2i 
      //        = sin(a)cosh(b) + i cos(a)sinh(b)
      var a = this['re'];
      var b = this['im'];
      return new Complex(Math.sin(a) * cosh(b), Math.cos(a) * sinh(b));
    },

    /**
     * Calculate the cosine
     *
     * @returns {Complex}
     */
    'cos': function () {
      // cos(z) = ( e^iz + e^-iz ) / 2 
      //        = cos(a)cosh(b) - i sin(a)sinh(b)
      var a = this['re'];
      var b = this['im'];
      return new Complex(Math.cos(a) * cosh(b), -Math.sin(a) * sinh(b));
    },

    /**
     * Calculate the tangent
     *
     * @returns {Complex}
     */
    'tan': function () {
      // tan(z) = sin(z) / cos(z) 
      //        = ( e^iz - e^-iz ) / ( i( e^iz + e^-iz ) )
      //        = ( e^2iz - 1 ) / i( e^2iz + 1 )
      //        = ( sin(2a) + i sinh(2b) ) / ( cos(2a) + cosh(2b) )
      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = Math.cos(a) + cosh(b);
      return new Complex(Math.sin(a) / d, sinh(b) / d);
    },

    /**
     * Calculate the cotangent
     *
     * @returns {Complex}
     */
    'cot': function () {
      // cot(c) = i(e^(ci) + e^(-ci)) / (e^(ci) - e^(-ci))
      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = Math.cos(a) - cosh(b);
      return new Complex(-Math.sin(a) / d, sinh(b) / d);
    },

    /**
     * Calculate the secant
     *
     * @returns {Complex}
     */
    'sec': function () {
      // sec(c) = 2 / (e^(ci) + e^(-ci))
      var a = this['re'];
      var b = this['im'];
      var d = 0.5 * cosh(2 * b) + 0.5 * Math.cos(2 * a);
      return new Complex(Math.cos(a) * cosh(b) / d, Math.sin(a) * sinh(b) / d);
    },

    /**
     * Calculate the cosecans
     *
     * @returns {Complex}
     */
    'csc': function () {
      // csc(c) = 2i / (e^(ci) - e^(-ci))
      var a = this['re'];
      var b = this['im'];
      var d = 0.5 * cosh(2 * b) - 0.5 * Math.cos(2 * a);
      return new Complex(Math.sin(a) * cosh(b) / d, -Math.cos(a) * sinh(b) / d);
    },

    /**
     * Calculate the complex arcus sinus
     *
     * @returns {Complex}
     */
    'asin': function () {
      // asin(c) = -i * log(ci + sqrt(1 - c^2))
      var a = this['re'];
      var b = this['im'];
      var t1 = new Complex(b * b - a * a + 1, -2 * a * b)['sqrt']();
      var t2 = new Complex(t1['re'] - b, t1['im'] + a)['log']();
      return new Complex(t2['im'], -t2['re']);
    },

    /**
     * Calculate the complex arcus cosinus
     *
     * @returns {Complex}
     */
    'acos': function () {
      // acos(c) = i * log(c - i * sqrt(1 - c^2))
      var a = this['re'];
      var b = this['im'];
      var t1 = new Complex(b * b - a * a + 1, -2 * a * b)['sqrt']();
      var t2 = new Complex(t1['re'] - b, t1['im'] + a)['log']();
      return new Complex(Math.PI / 2 - t2['im'], t2['re']);
    },

    /**
     * Calculate the complex arcus tangent
     *
     * @returns {Complex}
     */
    'atan': function () {
      // atan(c) = i / 2 log((i + x) / (i - x))
      var a = this['re'];
      var b = this['im'];

      if (a === 0) {
        if (b === 1) {
          return new Complex(0, Infinity);
        }

        if (b === -1) {
          return new Complex(0, -Infinity);
        }
      }

      var d = a * a + (1.0 - b) * (1.0 - b);
      var t1 = new Complex((1 - b * b - a * a) / d, -2 * a / d).log();
      return new Complex(-0.5 * t1['im'], 0.5 * t1['re']);
    },

    /**
     * Calculate the complex arcus cotangent
     *
     * @returns {Complex}
     */
    'acot': function () {
      // acot(c) = i / 2 log((c - i) / (c + i))
      var a = this['re'];
      var b = this['im'];

      if (b === 0) {
        return new Complex(Math.atan2(1, a), 0);
      }

      var d = a * a + b * b;
      return d !== 0 ? new Complex(a / d, -b / d).atan() : new Complex(a !== 0 ? a / 0 : 0, b !== 0 ? -b / 0 : 0).atan();
    },

    /**
     * Calculate the complex arcus secant
     *
     * @returns {Complex}
     */
    'asec': function () {
      // asec(c) = -i * log(1 / c + sqrt(1 - i / c^2))
      var a = this['re'];
      var b = this['im'];

      if (a === 0 && b === 0) {
        return new Complex(0, Infinity);
      }

      var d = a * a + b * b;
      return d !== 0 ? new Complex(a / d, -b / d).acos() : new Complex(a !== 0 ? a / 0 : 0, b !== 0 ? -b / 0 : 0).acos();
    },

    /**
     * Calculate the complex arcus cosecans
     *
     * @returns {Complex}
     */
    'acsc': function () {
      // acsc(c) = -i * log(i / c + sqrt(1 - 1 / c^2))
      var a = this['re'];
      var b = this['im'];

      if (a === 0 && b === 0) {
        return new Complex(Math.PI / 2, Infinity);
      }

      var d = a * a + b * b;
      return d !== 0 ? new Complex(a / d, -b / d).asin() : new Complex(a !== 0 ? a / 0 : 0, b !== 0 ? -b / 0 : 0).asin();
    },

    /**
     * Calculate the complex sinh
     *
     * @returns {Complex}
     */
    'sinh': function () {
      // sinh(c) = (e^c - e^-c) / 2
      var a = this['re'];
      var b = this['im'];
      return new Complex(sinh(a) * Math.cos(b), cosh(a) * Math.sin(b));
    },

    /**
     * Calculate the complex cosh
     *
     * @returns {Complex}
     */
    'cosh': function () {
      // cosh(c) = (e^c + e^-c) / 2
      var a = this['re'];
      var b = this['im'];
      return new Complex(cosh(a) * Math.cos(b), sinh(a) * Math.sin(b));
    },

    /**
     * Calculate the complex tanh
     *
     * @returns {Complex}
     */
    'tanh': function () {
      // tanh(c) = (e^c - e^-c) / (e^c + e^-c)
      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = cosh(a) + Math.cos(b);
      return new Complex(sinh(a) / d, Math.sin(b) / d);
    },

    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    'coth': function () {
      // coth(c) = (e^c + e^-c) / (e^c - e^-c)
      var a = 2 * this['re'];
      var b = 2 * this['im'];
      var d = cosh(a) - Math.cos(b);
      return new Complex(sinh(a) / d, -Math.sin(b) / d);
    },

    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    'csch': function () {
      // csch(c) = 2 / (e^c - e^-c)
      var a = this['re'];
      var b = this['im'];
      var d = Math.cos(2 * b) - cosh(2 * a);
      return new Complex(-2 * sinh(a) * Math.cos(b) / d, 2 * cosh(a) * Math.sin(b) / d);
    },

    /**
     * Calculate the complex sech
     *
     * @returns {Complex}
     */
    'sech': function () {
      // sech(c) = 2 / (e^c + e^-c)
      var a = this['re'];
      var b = this['im'];
      var d = Math.cos(2 * b) + cosh(2 * a);
      return new Complex(2 * cosh(a) * Math.cos(b) / d, -2 * sinh(a) * Math.sin(b) / d);
    },

    /**
     * Calculate the complex asinh
     *
     * @returns {Complex}
     */
    'asinh': function () {
      // asinh(c) = log(c + sqrt(c^2 + 1))
      var tmp = this['im'];
      this['im'] = -this['re'];
      this['re'] = tmp;
      var res = this['asin']();
      this['re'] = -this['im'];
      this['im'] = tmp;
      tmp = res['re'];
      res['re'] = -res['im'];
      res['im'] = tmp;
      return res;
    },

    /**
     * Calculate the complex acosh
     *
     * @returns {Complex}
     */
    'acosh': function () {
      // acosh(c) = log(c + sqrt(c^2 - 1))
      var res = this['acos']();

      if (res['im'] <= 0) {
        var tmp = res['re'];
        res['re'] = -res['im'];
        res['im'] = tmp;
      } else {
        var tmp = res['im'];
        res['im'] = -res['re'];
        res['re'] = tmp;
      }

      return res;
    },

    /**
     * Calculate the complex atanh
     *
     * @returns {Complex}
     */
    'atanh': function () {
      // atanh(c) = log((1+c) / (1-c)) / 2
      var a = this['re'];
      var b = this['im'];
      var noIM = a > 1 && b === 0;
      var oneMinus = 1 - a;
      var onePlus = 1 + a;
      var d = oneMinus * oneMinus + b * b;
      var x = d !== 0 ? new Complex((onePlus * oneMinus - b * b) / d, (b * oneMinus + onePlus * b) / d) : new Complex(a !== -1 ? a / 0 : 0, b !== 0 ? b / 0 : 0);
      var temp = x['re'];
      x['re'] = logHypot(x['re'], x['im']) / 2;
      x['im'] = Math.atan2(x['im'], temp) / 2;

      if (noIM) {
        x['im'] = -x['im'];
      }

      return x;
    },

    /**
     * Calculate the complex acoth
     *
     * @returns {Complex}
     */
    'acoth': function () {
      // acoth(c) = log((c+1) / (c-1)) / 2
      var a = this['re'];
      var b = this['im'];

      if (a === 0 && b === 0) {
        return new Complex(0, Math.PI / 2);
      }

      var d = a * a + b * b;
      return d !== 0 ? new Complex(a / d, -b / d).atanh() : new Complex(a !== 0 ? a / 0 : 0, b !== 0 ? -b / 0 : 0).atanh();
    },

    /**
     * Calculate the complex acsch
     *
     * @returns {Complex}
     */
    'acsch': function () {
      // acsch(c) = log((1+sqrt(1+c^2))/c)
      var a = this['re'];
      var b = this['im'];

      if (b === 0) {
        return new Complex(a !== 0 ? Math.log(a + Math.sqrt(a * a + 1)) : Infinity, 0);
      }

      var d = a * a + b * b;
      return d !== 0 ? new Complex(a / d, -b / d).asinh() : new Complex(a !== 0 ? a / 0 : 0, b !== 0 ? -b / 0 : 0).asinh();
    },

    /**
     * Calculate the complex asech
     *
     * @returns {Complex}
     */
    'asech': function () {
      // asech(c) = log((1+sqrt(1-c^2))/c)
      var a = this['re'];
      var b = this['im'];

      if (this['isZero']()) {
        return Complex['INFINITY'];
      }

      var d = a * a + b * b;
      return d !== 0 ? new Complex(a / d, -b / d).acosh() : new Complex(a !== 0 ? a / 0 : 0, b !== 0 ? -b / 0 : 0).acosh();
    },

    /**
     * Calculate the complex inverse 1/z
     *
     * @returns {Complex}
     */
    'inverse': function () {
      // 1 / 0 = Infinity and 1 / Infinity = 0
      if (this['isZero']()) {
        return Complex['INFINITY'];
      }

      if (this['isInfinite']()) {
        return Complex['ZERO'];
      }

      var a = this['re'];
      var b = this['im'];
      var d = a * a + b * b;
      return new Complex(a / d, -b / d);
    },

    /**
     * Returns the complex conjugate
     *
     * @returns {Complex}
     */
    'conjugate': function () {
      return new Complex(this['re'], -this['im']);
    },

    /**
     * Gets the negated complex number
     *
     * @returns {Complex}
     */
    'neg': function () {
      return new Complex(-this['re'], -this['im']);
    },

    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    'ceil': function (places) {
      places = Math.pow(10, places || 0);
      return new Complex(Math.ceil(this['re'] * places) / places, Math.ceil(this['im'] * places) / places);
    },

    /**
     * Floors the actual complex number
     *
     * @returns {Complex}
     */
    'floor': function (places) {
      places = Math.pow(10, places || 0);
      return new Complex(Math.floor(this['re'] * places) / places, Math.floor(this['im'] * places) / places);
    },

    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    'round': function (places) {
      places = Math.pow(10, places || 0);
      return new Complex(Math.round(this['re'] * places) / places, Math.round(this['im'] * places) / places);
    },

    /**
     * Compares two complex numbers
     *
     * **Note:** new Complex(Infinity).equals(Infinity) === false
     *
     * @returns {boolean}
     */
    'equals': function (a, b) {
      var z = new Complex(a, b);
      return Math.abs(z['re'] - this['re']) <= Complex['EPSILON'] && Math.abs(z['im'] - this['im']) <= Complex['EPSILON'];
    },

    /**
     * Clones the actual object
     *
     * @returns {Complex}
     */
    'clone': function () {
      return new Complex(this['re'], this['im']);
    },

    /**
     * Gets a string of the actual complex number
     *
     * @returns {string}
     */
    'toString': function () {
      var a = this['re'];
      var b = this['im'];
      var ret = "";

      if (this['isNaN']()) {
        return 'NaN';
      }

      if (this['isInfinite']()) {
        return 'Infinity';
      }

      if (Math.abs(a) < Complex['EPSILON']) {
        a = 0;
      }

      if (Math.abs(b) < Complex['EPSILON']) {
        b = 0;
      } // If is real number


      if (b === 0) {
        return ret + a;
      }

      if (a !== 0) {
        ret += a;
        ret += " ";

        if (b < 0) {
          b = -b;
          ret += "-";
        } else {
          ret += "+";
        }

        ret += " ";
      } else if (b < 0) {
        b = -b;
        ret += "-";
      }

      if (1 !== b) {
        // b is the absolute imaginary part
        ret += b;
      }

      return ret + "i";
    },

    /**
     * Returns the actual number as a vector
     *
     * @returns {Array}
     */
    'toVector': function () {
      return [this['re'], this['im']];
    },

    /**
     * Returns the actual real value of the current object
     *
     * @returns {number|null}
     */
    'valueOf': function () {
      if (this['im'] === 0) {
        return this['re'];
      }

      return null;
    },

    /**
     * Determines whether a complex number is not on the Riemann sphere.
     *
     * @returns {boolean}
     */
    'isNaN': function () {
      return isNaN(this['re']) || isNaN(this['im']);
    },

    /**
     * Determines whether or not a complex number is at the zero pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    'isZero': function () {
      return this['im'] === 0 && this['re'] === 0;
    },

    /**
     * Determines whether a complex number is not at the infinity pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    'isFinite': function () {
      return isFinite(this['re']) && isFinite(this['im']);
    },

    /**
     * Determines whether or not a complex number is at the infinity pole of the
     * Riemann sphere.
     *
     * @returns {boolean}
     */
    'isInfinite': function () {
      return !(this['isNaN']() || this['isFinite']());
    }
  };
  Complex['ZERO'] = new Complex(0, 0);
  Complex['ONE'] = new Complex(1, 0);
  Complex['I'] = new Complex(0, 1);
  Complex['PI'] = new Complex(Math.PI, 0);
  Complex['E'] = new Complex(Math.E, 0);
  Complex['INFINITY'] = new Complex(Infinity, Infinity);
  Complex['NAN'] = new Complex(NaN, NaN);
  Complex['EPSILON'] = 1e-15;

  {
    Object.defineProperty(Complex, "__esModule", {
      'value': true
    });
    Complex['default'] = Complex;
    Complex['Complex'] = Complex;
    module['exports'] = Complex;
  }
})();
});

var Complex = unwrapExports(complex);

var name$1 = 'Complex';
var dependencies$2 = [];
var createComplexClass = /* #__PURE__ */factory(name$1, dependencies$2, () => {
  /**
   * Attach type information
   */
  Complex.prototype.type = 'Complex';
  Complex.prototype.isComplex = true;
  /**
   * Get a JSON representation of the complex number
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Complex", "re": 2, "im": 3}`
   */

  Complex.prototype.toJSON = function () {
    return {
      mathjs: 'Complex',
      re: this.re,
      im: this.im
    };
  };
  /*
   * Return the value of the complex number in polar notation
   * The angle phi will be set in the interval of [-pi, pi].
   * @return {{r: number, phi: number}} Returns and object with properties r and phi.
   */


  Complex.prototype.toPolar = function () {
    return {
      r: this.abs(),
      phi: this.arg()
    };
  };
  /**
   * Get a string representation of the complex number,
   * with optional formatting options.
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @return {string} str
   */


  Complex.prototype.format = function (options) {
    var str = '';
    var im = this.im;
    var re = this.re;
    var strRe = format(this.re, options);
    var strIm = format(this.im, options); // round either re or im when smaller than the configured precision

    var precision = isNumber(options) ? options : options ? options.precision : null;

    if (precision !== null) {
      var epsilon = Math.pow(10, -precision);

      if (Math.abs(re / im) < epsilon) {
        re = 0;
      }

      if (Math.abs(im / re) < epsilon) {
        im = 0;
      }
    }

    if (im === 0) {
      // real value
      str = strRe;
    } else if (re === 0) {
      // purely complex value
      if (im === 1) {
        str = 'i';
      } else if (im === -1) {
        str = '-i';
      } else {
        str = strIm + 'i';
      }
    } else {
      // complex value
      if (im < 0) {
        if (im === -1) {
          str = strRe + ' - i';
        } else {
          str = strRe + ' - ' + strIm.substring(1) + 'i';
        }
      } else {
        if (im === 1) {
          str = strRe + ' + i';
        } else {
          str = strRe + ' + ' + strIm + 'i';
        }
      }
    }

    return str;
  };
  /**
   * Create a complex number from polar coordinates
   *
   * Usage:
   *
   *     Complex.fromPolar(r: number, phi: number) : Complex
   *     Complex.fromPolar({r: number, phi: number}) : Complex
   *
   * @param {*} args...
   * @return {Complex}
   */


  Complex.fromPolar = function (args) {
    switch (arguments.length) {
      case 1:
        {
          var arg = arguments[0];

          if (typeof arg === 'object') {
            return Complex(arg);
          } else {
            throw new TypeError('Input has to be an object with r and phi keys.');
          }
        }

      case 2:
        {
          var r = arguments[0];
          var phi = arguments[1];

          if (isNumber(r)) {
            if (isUnit(phi) && phi.hasBase('ANGLE')) {
              // convert unit to a number in radians
              phi = phi.toNumber('rad');
            }

            if (isNumber(phi)) {
              return new Complex({
                r,
                phi
              });
            }

            throw new TypeError('Phi is not a number nor an angle unit.');
          } else {
            throw new TypeError('Radius r is not a number.');
          }
        }

      default:
        throw new SyntaxError('Wrong number of arguments in function fromPolar');
    }
  };

  Complex.prototype.valueOf = Complex.prototype.toString;
  /**
   * Create a Complex number from a JSON object
   * @param {Object} json  A JSON Object structured as
   *                       {"mathjs": "Complex", "re": 2, "im": 3}
   *                       All properties are optional, default values
   *                       for `re` and `im` are 0.
   * @return {Complex} Returns a new Complex number
   */

  Complex.fromJSON = function (json) {
    return new Complex(json);
  };
  /**
   * Compare two complex numbers, `a` and `b`:
   *
   * - Returns 1 when the real part of `a` is larger than the real part of `b`
   * - Returns -1 when the real part of `a` is smaller than the real part of `b`
   * - Returns 1 when the real parts are equal
   *   and the imaginary part of `a` is larger than the imaginary part of `b`
   * - Returns -1 when the real parts are equal
   *   and the imaginary part of `a` is smaller than the imaginary part of `b`
   * - Returns 0 when both real and imaginary parts are equal.
   *
   * @params {Complex} a
   * @params {Complex} b
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */


  Complex.compare = function (a, b) {
    if (a.re > b.re) {
      return 1;
    }

    if (a.re < b.re) {
      return -1;
    }

    if (a.im > b.im) {
      return 1;
    }

    if (a.im < b.im) {
      return -1;
    }

    return 0;
  };

  return Complex;
}, {
  isClass: true
});

var fraction = createCommonjsModule(function (module, exports) {
/**
 * @license Fraction.js v4.2.0 05/03/2022
 * https://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2021, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 *
 * This class offers the possibility to calculate fractions.
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
 *
 * Array/Object form
 * [ 0 => <nominator>, 1 => <denominator> ]
 * [ n => <nominator>, d => <denominator> ]
 *
 * Integer form
 * - Single integer value
 *
 * Double form
 * - Single double value
 *
 * String form
 * 123.456 - a simple double
 * 123/456 - a string fraction
 * 123.'456' - a double with repeating decimal places
 * 123.(456) - synonym
 * 123.45'6' - a double with repeating last place
 * 123.45(6) - synonym
 *
 * Example:
 *
 * var f = new Fraction("9.4'31'");
 * f.mul([-4, 3]).div(4.9);
 *
 */
(function (root) {
  // Example: 1/7 = 0.(142857) has 6 repeating decimal places.
  // If MAX_CYCLE_LEN gets reduced, long cycles will not be detected and toString() only gets the first 10 digits

  var MAX_CYCLE_LEN = 2000; // Parsed data to avoid calling "new" all the time

  var P = {
    "s": 1,
    "n": 0,
    "d": 1
  };

  function assign(n, s) {
    if (isNaN(n = parseInt(n, 10))) {
      throw Fraction['InvalidParameter'];
    }

    return n * s;
  } // Creates a new Fraction internally without the need of the bulky constructor


  function newFraction(n, d) {
    if (d === 0) {
      throw Fraction['DivisionByZero'];
    }

    var f = Object.create(Fraction.prototype);
    f["s"] = n < 0 ? -1 : 1;
    n = n < 0 ? -n : n;
    var a = gcd(n, d);
    f["n"] = n / a;
    f["d"] = d / a;
    return f;
  }

  function factorize(num) {
    var factors = {};
    var n = num;
    var i = 2;
    var s = 4;

    while (s <= n) {
      while (n % i === 0) {
        n /= i;
        factors[i] = (factors[i] || 0) + 1;
      }

      s += 1 + 2 * i++;
    }

    if (n !== num) {
      if (n > 1) factors[n] = (factors[n] || 0) + 1;
    } else {
      factors[num] = (factors[num] || 0) + 1;
    }

    return factors;
  }

  var parse = function (p1, p2) {
    var n = 0,
        d = 1,
        s = 1;
    var v = 0,
        w = 0,
        x = 0,
        y = 1,
        z = 1;
    var A = 0,
        B = 1;
    var C = 1,
        D = 1;
    var N = 10000000;
    var M;

    if (p1 === undefined || p1 === null) ; else if (p2 !== undefined) {
      n = p1;
      d = p2;
      s = n * d;

      if (n % 1 !== 0 || d % 1 !== 0) {
        throw Fraction['NonIntegerParameter'];
      }
    } else switch (typeof p1) {
      case "object":
        {
          if ("d" in p1 && "n" in p1) {
            n = p1["n"];
            d = p1["d"];
            if ("s" in p1) n *= p1["s"];
          } else if (0 in p1) {
            n = p1[0];
            if (1 in p1) d = p1[1];
          } else {
            throw Fraction['InvalidParameter'];
          }

          s = n * d;
          break;
        }

      case "number":
        {
          if (p1 < 0) {
            s = p1;
            p1 = -p1;
          }

          if (p1 % 1 === 0) {
            n = p1;
          } else if (p1 > 0) {
            // check for != 0, scale would become NaN (log(0)), which converges really slow
            if (p1 >= 1) {
              z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
              p1 /= z;
            } // Using Farey Sequences
            // http://www.johndcook.com/blog/2010/10/20/best-rational-approximation/


            while (B <= N && D <= N) {
              M = (A + C) / (B + D);

              if (p1 === M) {
                if (B + D <= N) {
                  n = A + C;
                  d = B + D;
                } else if (D > B) {
                  n = C;
                  d = D;
                } else {
                  n = A;
                  d = B;
                }

                break;
              } else {
                if (p1 > M) {
                  A += C;
                  B += D;
                } else {
                  C += A;
                  D += B;
                }

                if (B > N) {
                  n = C;
                  d = D;
                } else {
                  n = A;
                  d = B;
                }
              }
            }

            n *= z;
          } else if (isNaN(p1) || isNaN(p2)) {
            d = n = NaN;
          }

          break;
        }

      case "string":
        {
          B = p1.match(/\d+|./g);
          if (B === null) throw Fraction['InvalidParameter'];

          if (B[A] === '-') {
            // Check for minus sign at the beginning
            s = -1;
            A++;
          } else if (B[A] === '+') {
            // Check for plus sign at the beginning
            A++;
          }

          if (B.length === A + 1) {
            // Check if it's just a simple number "1234"
            w = assign(B[A++], s);
          } else if (B[A + 1] === '.' || B[A] === '.') {
            // Check if it's a decimal number
            if (B[A] !== '.') {
              // Handle 0.5 and .5
              v = assign(B[A++], s);
            }

            A++; // Check for decimal places

            if (A + 1 === B.length || B[A + 1] === '(' && B[A + 3] === ')' || B[A + 1] === "'" && B[A + 3] === "'") {
              w = assign(B[A], s);
              y = Math.pow(10, B[A].length);
              A++;
            } // Check for repeating places


            if (B[A] === '(' && B[A + 2] === ')' || B[A] === "'" && B[A + 2] === "'") {
              x = assign(B[A + 1], s);
              z = Math.pow(10, B[A + 1].length) - 1;
              A += 3;
            }
          } else if (B[A + 1] === '/' || B[A + 1] === ':') {
            // Check for a simple fraction "123/456" or "123:456"
            w = assign(B[A], s);
            y = assign(B[A + 2], 1);
            A += 3;
          } else if (B[A + 3] === '/' && B[A + 1] === ' ') {
            // Check for a complex fraction "123 1/2"
            v = assign(B[A], s);
            w = assign(B[A + 2], s);
            y = assign(B[A + 4], 1);
            A += 5;
          }

          if (B.length <= A) {
            // Check for more tokens on the stack
            d = y * z;
            s =
            /* void */
            n = x + d * v + z * w;
            break;
          }
          /* Fall through on error */

        }

      default:
        throw Fraction['InvalidParameter'];
    }

    if (d === 0) {
      throw Fraction['DivisionByZero'];
    }

    P["s"] = s < 0 ? -1 : 1;
    P["n"] = Math.abs(n);
    P["d"] = Math.abs(d);
  };

  function modpow(b, e, m) {
    var r = 1;

    for (; e > 0; b = b * b % m, e >>= 1) {
      if (e & 1) {
        r = r * b % m;
      }
    }

    return r;
  }

  function cycleLen(n, d) {
    for (; d % 2 === 0; d /= 2) {}

    for (; d % 5 === 0; d /= 5) {}

    if (d === 1) // Catch non-cyclic numbers
      return 0; // If we would like to compute really large numbers quicker, we could make use of Fermat's little theorem:
    // 10^(d-1) % d == 1
    // However, we don't need such large numbers and MAX_CYCLE_LEN should be the capstone,
    // as we want to translate the numbers to strings.

    var rem = 10 % d;
    var t = 1;

    for (; rem !== 1; t++) {
      rem = rem * 10 % d;
      if (t > MAX_CYCLE_LEN) return 0; // Returning 0 here means that we don't print it as a cyclic number. It's likely that the answer is `d-1`
    }

    return t;
  }

  function cycleStart(n, d, len) {
    var rem1 = 1;
    var rem2 = modpow(10, len, d);

    for (var t = 0; t < 300; t++) {
      // s < ~log10(Number.MAX_VALUE)
      // Solve 10^s == 10^(s+t) (mod d)
      if (rem1 === rem2) return t;
      rem1 = rem1 * 10 % d;
      rem2 = rem2 * 10 % d;
    }

    return 0;
  }

  function gcd(a, b) {
    if (!a) return b;
    if (!b) return a;

    while (1) {
      a %= b;
      if (!a) return b;
      b %= a;
      if (!b) return a;
    }
  }
  /**
   * Module constructor
   *
   * @constructor
   * @param {number|Fraction=} a
   * @param {number=} b
   */

  function Fraction(a, b) {
    parse(a, b);

    if (this instanceof Fraction) {
      a = gcd(P["d"], P["n"]); // Abuse variable a

      this["s"] = P["s"];
      this["n"] = P["n"] / a;
      this["d"] = P["d"] / a;
    } else {
      return newFraction(P['s'] * P['n'], P['d']);
    }
  }

  Fraction['DivisionByZero'] = new Error("Division by Zero");
  Fraction['InvalidParameter'] = new Error("Invalid argument");
  Fraction['NonIntegerParameter'] = new Error("Parameters must be integer");
  Fraction.prototype = {
    "s": 1,
    "n": 0,
    "d": 1,

    /**
     * Calculates the absolute value
     *
     * Ex: new Fraction(-4).abs() => 4
     **/
    "abs": function () {
      return newFraction(this["n"], this["d"]);
    },

    /**
     * Inverts the sign of the current fraction
     *
     * Ex: new Fraction(-4).neg() => 4
     **/
    "neg": function () {
      return newFraction(-this["s"] * this["n"], this["d"]);
    },

    /**
     * Adds two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
     **/
    "add": function (a, b) {
      parse(a, b);
      return newFraction(this["s"] * this["n"] * P["d"] + P["s"] * this["d"] * P["n"], this["d"] * P["d"]);
    },

    /**
     * Subtracts two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
     **/
    "sub": function (a, b) {
      parse(a, b);
      return newFraction(this["s"] * this["n"] * P["d"] - P["s"] * this["d"] * P["n"], this["d"] * P["d"]);
    },

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    "mul": function (a, b) {
      parse(a, b);
      return newFraction(this["s"] * P["s"] * this["n"] * P["n"], this["d"] * P["d"]);
    },

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").inverse().div(3)
     **/
    "div": function (a, b) {
      parse(a, b);
      return newFraction(this["s"] * P["s"] * this["n"] * P["d"], this["d"] * P["n"]);
    },

    /**
     * Clones the actual object
     *
     * Ex: new Fraction("-17.(345)").clone()
     **/
    "clone": function () {
      return newFraction(this['s'] * this['n'], this['d']);
    },

    /**
     * Calculates the modulo of two rational numbers - a more precise fmod
     *
     * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
     **/
    "mod": function (a, b) {
      if (isNaN(this['n']) || isNaN(this['d'])) {
        return new Fraction(NaN);
      }

      if (a === undefined) {
        return newFraction(this["s"] * this["n"] % this["d"], 1);
      }

      parse(a, b);

      if (0 === P["n"] && 0 === this["d"]) {
        throw Fraction['DivisionByZero'];
      }
      /*
       * First silly attempt, kinda slow
       *
       return that["sub"]({
       "n": num["n"] * Math.floor((this.n / this.d) / (num.n / num.d)),
       "d": num["d"],
       "s": this["s"]
       });*/

      /*
       * New attempt: a1 / b1 = a2 / b2 * q + r
       * => b2 * a1 = a2 * b1 * q + b1 * b2 * r
       * => (b2 * a1 % a2 * b1) / (b1 * b2)
       */


      return newFraction(this["s"] * (P["d"] * this["n"]) % (P["n"] * this["d"]), P["d"] * this["d"]);
    },

    /**
     * Calculates the fractional gcd of two rational numbers
     *
     * Ex: new Fraction(5,8).gcd(3,7) => 1/56
     */
    "gcd": function (a, b) {
      parse(a, b); // gcd(a / b, c / d) = gcd(a, c) / lcm(b, d)

      return newFraction(gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]), P["d"] * this["d"]);
    },

    /**
     * Calculates the fractional lcm of two rational numbers
     *
     * Ex: new Fraction(5,8).lcm(3,7) => 15
     */
    "lcm": function (a, b) {
      parse(a, b); // lcm(a / b, c / d) = lcm(a, c) / gcd(b, d)

      if (P["n"] === 0 && this["n"] === 0) {
        return newFraction(0, 1);
      }

      return newFraction(P["n"] * this["n"], gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]));
    },

    /**
     * Calculates the ceil of a rational number
     *
     * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
     **/
    "ceil": function (places) {
      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }

      return newFraction(Math.ceil(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Calculates the floor of a rational number
     *
     * Ex: new Fraction('4.(3)').floor() => (4 / 1)
     **/
    "floor": function (places) {
      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }

      return newFraction(Math.floor(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Rounds a rational numbers
     *
     * Ex: new Fraction('4.(3)').round() => (4 / 1)
     **/
    "round": function (places) {
      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }

      return newFraction(Math.round(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Gets the inverse of the fraction, means numerator and denominator are exchanged
     *
     * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
     **/
    "inverse": function () {
      return newFraction(this["s"] * this["d"], this["n"]);
    },

    /**
     * Calculates the fraction to some rational exponent, if possible
     *
     * Ex: new Fraction(-1,2).pow(-3) => -8
     */
    "pow": function (a, b) {
      parse(a, b); // Trivial case when exp is an integer

      if (P['d'] === 1) {
        if (P['s'] < 0) {
          return newFraction(Math.pow(this['s'] * this["d"], P['n']), Math.pow(this["n"], P['n']));
        } else {
          return newFraction(Math.pow(this['s'] * this["n"], P['n']), Math.pow(this["d"], P['n']));
        }
      } // Negative roots become complex
      //     (-a/b)^(c/d) = x
      // <=> (-1)^(c/d) * (a/b)^(c/d) = x
      // <=> (cos(pi) + i*sin(pi))^(c/d) * (a/b)^(c/d) = x         # rotate 1 by 180??
      // <=> (cos(c*pi/d) + i*sin(c*pi/d)) * (a/b)^(c/d) = x       # DeMoivre's formula in Q ( https://proofwiki.org/wiki/De_Moivre%27s_Formula/Rational_Index )
      // From which follows that only for c=0 the root is non-complex. c/d is a reduced fraction, so that sin(c/dpi)=0 occurs for d=1, which is handled by our trivial case.


      if (this['s'] < 0) return null; // Now prime factor n and d

      var N = factorize(this['n']);
      var D = factorize(this['d']); // Exponentiate and take root for n and d individually

      var n = 1;
      var d = 1;

      for (var k in N) {
        if (k === '1') continue;

        if (k === '0') {
          n = 0;
          break;
        }

        N[k] *= P['n'];

        if (N[k] % P['d'] === 0) {
          N[k] /= P['d'];
        } else return null;

        n *= Math.pow(k, N[k]);
      }

      for (var k in D) {
        if (k === '1') continue;
        D[k] *= P['n'];

        if (D[k] % P['d'] === 0) {
          D[k] /= P['d'];
        } else return null;

        d *= Math.pow(k, D[k]);
      }

      if (P['s'] < 0) {
        return newFraction(d, n);
      }

      return newFraction(n, d);
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "equals": function (a, b) {
      parse(a, b);
      return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"]; // Same as compare() === 0
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "compare": function (a, b) {
      parse(a, b);
      var t = this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"];
      return (0 < t) - (t < 0);
    },
    "simplify": function (eps) {
      if (isNaN(this['n']) || isNaN(this['d'])) {
        return this;
      }

      eps = eps || 0.001;
      var thisABS = this['abs']();
      var cont = thisABS['toContinued']();

      for (var i = 1; i < cont.length; i++) {
        var s = newFraction(cont[i - 1], 1);

        for (var k = i - 2; k >= 0; k--) {
          s = s['inverse']()['add'](cont[k]);
        }

        if (s['sub'](thisABS)['abs']().valueOf() < eps) {
          return s['mul'](this['s']);
        }
      }

      return this;
    },

    /**
     * Check if two rational numbers are divisible
     *
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    "divisible": function (a, b) {
      parse(a, b);
      return !(!(P["n"] * this["d"]) || this["n"] * P["d"] % (P["n"] * this["d"]));
    },

    /**
     * Returns a decimal representation of the fraction
     *
     * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
     **/
    'valueOf': function () {
      return this["s"] * this["n"] / this["d"];
    },

    /**
     * Returns a string-fraction representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction(true) => "4 1/3"
     **/
    'toFraction': function (excludeWhole) {
      var whole,
          str = "";
      var n = this["n"];
      var d = this["d"];

      if (this["s"] < 0) {
        str += '-';
      }

      if (d === 1) {
        str += n;
      } else {
        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str += whole;
          str += " ";
          n %= d;
        }

        str += n;
        str += '/';
        str += d;
      }

      return str;
    },

    /**
     * Returns a latex representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
     **/
    'toLatex': function (excludeWhole) {
      var whole,
          str = "";
      var n = this["n"];
      var d = this["d"];

      if (this["s"] < 0) {
        str += '-';
      }

      if (d === 1) {
        str += n;
      } else {
        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str += whole;
          n %= d;
        }

        str += "\\frac{";
        str += n;
        str += '}{';
        str += d;
        str += '}';
      }

      return str;
    },

    /**
     * Returns an array of continued fraction elements
     *
     * Ex: new Fraction("7/8").toContinued() => [0,1,7]
     */
    'toContinued': function () {
      var t;
      var a = this['n'];
      var b = this['d'];
      var res = [];

      if (isNaN(a) || isNaN(b)) {
        return res;
      }

      do {
        res.push(Math.floor(a / b));
        t = a % b;
        a = b;
        b = t;
      } while (a !== 1);

      return res;
    },

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    'toString': function (dec) {
      var N = this["n"];
      var D = this["d"];

      if (isNaN(N) || isNaN(D)) {
        return "NaN";
      }

      dec = dec || 15; // 15 = decimal places when no repetation

      var cycLen = cycleLen(N, D); // Cycle length

      var cycOff = cycleStart(N, D, cycLen); // Cycle start

      var str = this['s'] < 0 ? "-" : "";
      str += N / D | 0;
      N %= D;
      N *= 10;
      if (N) str += ".";

      if (cycLen) {
        for (var i = cycOff; i--;) {
          str += N / D | 0;
          N %= D;
          N *= 10;
        }

        str += "(";

        for (var i = cycLen; i--;) {
          str += N / D | 0;
          N %= D;
          N *= 10;
        }

        str += ")";
      } else {
        for (var i = dec; N && i--;) {
          str += N / D | 0;
          N %= D;
          N *= 10;
        }
      }

      return str;
    }
  };

  {
    Object.defineProperty(Fraction, "__esModule", {
      'value': true
    });
    Fraction['default'] = Fraction;
    Fraction['Fraction'] = Fraction;
    module['exports'] = Fraction;
  }
})();
});

var Fraction = unwrapExports(fraction);

var name$2 = 'Fraction';
var dependencies$3 = [];
var createFractionClass = /* #__PURE__ */factory(name$2, dependencies$3, () => {
  /**
   * Attach type information
   */
  Fraction.prototype.type = 'Fraction';
  Fraction.prototype.isFraction = true;
  /**
   * Get a JSON representation of a Fraction containing type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Fraction", "n": 3, "d": 8}`
   */

  Fraction.prototype.toJSON = function () {
    return {
      mathjs: 'Fraction',
      n: this.s * this.n,
      d: this.d
    };
  };
  /**
   * Instantiate a Fraction from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "Fraction", "n": 3, "d": 8}`
   * @return {BigNumber}
   */


  Fraction.fromJSON = function (json) {
    return new Fraction(json);
  };

  return Fraction;
}, {
  isClass: true
});

var name$3 = 'Matrix';
var dependencies$4 = [];
var createMatrixClass = /* #__PURE__ */factory(name$3, dependencies$4, () => {
  /**
   * @constructor Matrix
   *
   * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
   * array. A matrix can be constructed as:
   *
   *     let matrix = math.matrix(data)
   *
   * Matrix contains the functions to resize, get and set values, get the size,
   * clone the matrix and to convert the matrix to a vector, array, or scalar.
   * Furthermore, one can iterate over the matrix using map and forEach.
   * The internal Array of the Matrix can be accessed using the function valueOf.
   *
   * Example usage:
   *
   *     let matrix = math.matrix([[1, 2], [3, 4]])
   *     matix.size()              // [2, 2]
   *     matrix.resize([3, 2], 5)
   *     matrix.valueOf()          // [[1, 2], [3, 4], [5, 5]]
   *     matrix.subset([1,2])       // 3 (indexes are zero-based)
   *
   */
  function Matrix() {
    if (!(this instanceof Matrix)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
  }
  /**
   * Attach type information
   */


  Matrix.prototype.type = 'Matrix';
  Matrix.prototype.isMatrix = true;
  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     const format = matrix.storage()   // retrieve storage format
   *
   * @return {string}           The storage format.
   */

  Matrix.prototype.storage = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke storage on a Matrix interface');
  };
  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     const format = matrix.datatype()    // retrieve matrix datatype
   *
   * @return {string}           The datatype.
   */


  Matrix.prototype.datatype = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke datatype on a Matrix interface');
  };
  /**
   * Create a new Matrix With the type of the current matrix instance
   * @param {Array | Object} data
   * @param {string} [datatype]
   */


  Matrix.prototype.create = function (data, datatype) {
    throw new Error('Cannot invoke create on a Matrix interface');
  };
  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     const subset = matrix.subset(index)               // retrieve subset
   *     const value = matrix.subset(index, replacement)   // replace subset
   *
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */


  Matrix.prototype.subset = function (index, replacement, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke subset on a Matrix interface');
  };
  /**
   * Get a single element from the matrix.
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */


  Matrix.prototype.get = function (index) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke get on a Matrix interface');
  };
  /**
   * Replace a single element in the matrix.
   * @param {number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {Matrix} self
   */


  Matrix.prototype.set = function (index, value, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke set on a Matrix interface');
  };
  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @param {number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */


  Matrix.prototype.resize = function (size, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke resize on a Matrix interface');
  };
  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */


  Matrix.prototype.reshape = function (size, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke reshape on a Matrix interface');
  };
  /**
   * Create a clone of the matrix
   * @return {Matrix} clone
   */


  Matrix.prototype.clone = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke clone on a Matrix interface');
  };
  /**
   * Retrieve the size of the matrix.
   * @returns {number[]} size
   */


  Matrix.prototype.size = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke size on a Matrix interface');
  };
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {Matrix} matrix
   */


  Matrix.prototype.map = function (callback, skipZeros) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke map on a Matrix interface');
  };
  /**
   * Execute a callback function on each entry of the matrix.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */


  Matrix.prototype.forEach = function (callback) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke forEach on a Matrix interface');
  };
  /**
   * Iterate over the matrix elements
   * @return {Iterable<{ value, index: number[] }>}
   */


  Matrix.prototype[Symbol.iterator] = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot iterate a Matrix interface');
  };
  /**
   * Create an Array with a copy of the data of the Matrix
   * @returns {Array} array
   */


  Matrix.prototype.toArray = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke toArray on a Matrix interface');
  };
  /**
   * Get the primitive value of the Matrix: a multidimensional array
   * @returns {Array} array
   */


  Matrix.prototype.valueOf = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke valueOf on a Matrix interface');
  };
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */


  Matrix.prototype.format = function (options) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke format on a Matrix interface');
  };
  /**
   * Get a string representation of the matrix
   * @returns {string} str
   */


  Matrix.prototype.toString = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke toString on a Matrix interface');
  };

  return Matrix;
}, {
  isClass: true
});

var name$4 = 'DenseMatrix';
var dependencies$5 = ['Matrix'];
var createDenseMatrixClass = /* #__PURE__ */factory(name$4, dependencies$5, _ref => {
  var {
    Matrix
  } = _ref;
  /**
   * Dense Matrix implementation. A regular, dense matrix, supporting multi-dimensional matrices. This is the default matrix type.
   * @class DenseMatrix
   * @enum {{ value, index: number[] }}
   */

  function DenseMatrix(data, datatype) {
    if (!(this instanceof DenseMatrix)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (datatype && !isString(datatype)) {
      throw new Error('Invalid datatype: ' + datatype);
    }

    if (isMatrix(data)) {
      // check data is a DenseMatrix
      if (data.type === 'DenseMatrix') {
        // clone data & size
        this._data = clone(data._data);
        this._size = clone(data._size);
        this._datatype = datatype || data._datatype;
      } else {
        // build data from existing matrix
        this._data = data.toArray();
        this._size = data.size();
        this._datatype = datatype || data._datatype;
      }
    } else if (data && isArray(data.data) && isArray(data.size)) {
      // initialize fields from JSON representation
      this._data = data.data;
      this._size = data.size; // verify the dimensions of the array

      validate(this._data, this._size);
      this._datatype = datatype || data.datatype;
    } else if (isArray(data)) {
      // replace nested Matrices with Arrays
      this._data = preprocess(data); // get the dimensions of the array

      this._size = arraySize(this._data); // verify the dimensions of the array, TODO: compute size while processing array

      validate(this._data, this._size); // data type unknown

      this._datatype = datatype;
    } else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + typeOf(data) + ')');
    } else {
      // nothing provided
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
    }
  }

  DenseMatrix.prototype = new Matrix();
  /**
   * Create a new DenseMatrix
   */

  DenseMatrix.prototype.createDenseMatrix = function (data, datatype) {
    return new DenseMatrix(data, datatype);
  };
  /**
   * Attach type information
   */


  DenseMatrix.prototype.type = 'DenseMatrix';
  DenseMatrix.prototype.isDenseMatrix = true;
  /**
   * Get the matrix type
   *
   * Usage:
   *    const matrixType = matrix.getDataType()  // retrieves the matrix type
   *
   * @memberOf DenseMatrix
   * @return {string}   type information; if multiple types are found from the Matrix, it will return "mixed"
   */

  DenseMatrix.prototype.getDataType = function () {
    return getArrayDataType(this._data, typeOf);
  };
  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     const format = matrix.storage()  // retrieve storage format
   *
   * @memberof DenseMatrix
   * @return {string}           The storage format.
   */


  DenseMatrix.prototype.storage = function () {
    return 'dense';
  };
  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     const format = matrix.datatype()   // retrieve matrix datatype
   *
   * @memberof DenseMatrix
   * @return {string}           The datatype.
   */


  DenseMatrix.prototype.datatype = function () {
    return this._datatype;
  };
  /**
   * Create a new DenseMatrix
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {string} [datatype]
   */


  DenseMatrix.prototype.create = function (data, datatype) {
    return new DenseMatrix(data, datatype);
  };
  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     const subset = matrix.subset(index)               // retrieve subset
   *     const value = matrix.subset(index, replacement)   // replace subset
   *
   * @memberof DenseMatrix
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */


  DenseMatrix.prototype.subset = function (index, replacement, defaultValue) {
    switch (arguments.length) {
      case 1:
        return _get(this, index);
      // intentional fall through

      case 2:
      case 3:
        return _set(this, index, replacement, defaultValue);

      default:
        throw new SyntaxError('Wrong number of arguments');
    }
  };
  /**
   * Get a single element from the matrix.
   * @memberof DenseMatrix
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */


  DenseMatrix.prototype.get = function (index) {
    if (!isArray(index)) {
      throw new TypeError('Array expected');
    }

    if (index.length !== this._size.length) {
      throw new DimensionError(index.length, this._size.length);
    } // check index


    for (var x = 0; x < index.length; x++) {
      validateIndex(index[x], this._size[x]);
    }

    var data = this._data;

    for (var i = 0, ii = index.length; i < ii; i++) {
      var indexI = index[i];
      validateIndex(indexI, data.length);
      data = data[indexI];
    }

    return data;
  };
  /**
   * Replace a single element in the matrix.
   * @memberof DenseMatrix
   * @param {number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {DenseMatrix} self
   */


  DenseMatrix.prototype.set = function (index, value, defaultValue) {
    if (!isArray(index)) {
      throw new TypeError('Array expected');
    }

    if (index.length < this._size.length) {
      throw new DimensionError(index.length, this._size.length, '<');
    }

    var i, ii, indexI; // enlarge matrix when needed

    var size = index.map(function (i) {
      return i + 1;
    });

    _fit(this, size, defaultValue); // traverse over the dimensions


    var data = this._data;

    for (i = 0, ii = index.length - 1; i < ii; i++) {
      indexI = index[i];
      validateIndex(indexI, data.length);
      data = data[indexI];
    } // set new value


    indexI = index[index.length - 1];
    validateIndex(indexI, data.length);
    data[indexI] = value;
    return this;
  };
  /**
   * Get a submatrix of this matrix
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix
   * @param {Index} index   Zero-based index
   * @private
   */


  function _get(matrix, index) {
    if (!isIndex(index)) {
      throw new TypeError('Invalid index');
    }

    var isScalar = index.isScalar();

    if (isScalar) {
      // return a scalar
      return matrix.get(index.min());
    } else {
      // validate dimensions
      var size = index.size();

      if (size.length !== matrix._size.length) {
        throw new DimensionError(size.length, matrix._size.length);
      } // validate if any of the ranges in the index is out of range


      var min = index.min();
      var max = index.max();

      for (var i = 0, ii = matrix._size.length; i < ii; i++) {
        validateIndex(min[i], matrix._size[i]);
        validateIndex(max[i], matrix._size[i]);
      } // retrieve submatrix
      // TODO: more efficient when creating an empty matrix and setting _data and _size manually


      return new DenseMatrix(_getSubmatrix(matrix._data, index, size.length, 0), matrix._datatype);
    }
  }
  /**
   * Recursively get a submatrix of a multi dimensional matrix.
   * Index is not checked for correct number or length of dimensions.
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {Index} index
   * @param {number} dims   Total number of dimensions
   * @param {number} dim    Current dimension
   * @return {Array} submatrix
   * @private
   */


  function _getSubmatrix(data, index, dims, dim) {
    var last = dim === dims - 1;
    var range = index.dimension(dim);

    if (last) {
      return range.map(function (i) {
        validateIndex(i, data.length);
        return data[i];
      }).valueOf();
    } else {
      return range.map(function (i) {
        validateIndex(i, data.length);
        var child = data[i];
        return _getSubmatrix(child, index, dims, dim + 1);
      }).valueOf();
    }
  }
  /**
   * Replace a submatrix in this matrix
   * Indexes are zero-based.
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix
   * @param {Index} index
   * @param {DenseMatrix | Array | *} submatrix
   * @param {*} defaultValue          Default value, filled in on new entries when
   *                                  the matrix is resized.
   * @return {DenseMatrix} matrix
   * @private
   */


  function _set(matrix, index, submatrix, defaultValue) {
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index');
    } // get index size and check whether the index contains a single value


    var iSize = index.size();
    var isScalar = index.isScalar(); // calculate the size of the submatrix, and convert it into an Array if needed

    var sSize;

    if (isMatrix(submatrix)) {
      sSize = submatrix.size();
      submatrix = submatrix.valueOf();
    } else {
      sSize = arraySize(submatrix);
    }

    if (isScalar) {
      // set a scalar
      // check whether submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected');
      }

      matrix.set(index.min(), submatrix, defaultValue);
    } else {
      // set a submatrix
      // validate dimensions
      if (iSize.length < matrix._size.length) {
        throw new DimensionError(iSize.length, matrix._size.length, '<');
      }

      if (sSize.length < iSize.length) {
        // calculate number of missing outer dimensions
        var i = 0;
        var outer = 0;

        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }

        while (iSize[i] === 1) {
          outer++;
          i++;
        } // unsqueeze both outer and inner dimensions


        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
      } // check whether the size of the submatrix matches the index size


      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, '>');
      } // enlarge matrix when needed


      var size = index.max().map(function (i) {
        return i + 1;
      });

      _fit(matrix, size, defaultValue); // insert the sub matrix


      var dims = iSize.length;
      var dim = 0;

      _setSubmatrix(matrix._data, index, submatrix, dims, dim);
    }

    return matrix;
  }
  /**
   * Replace a submatrix of a multi dimensional matrix.
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {Index} index
   * @param {Array} submatrix
   * @param {number} dims   Total number of dimensions
   * @param {number} dim
   * @private
   */


  function _setSubmatrix(data, index, submatrix, dims, dim) {
    var last = dim === dims - 1;
    var range = index.dimension(dim);

    if (last) {
      range.forEach(function (dataIndex, subIndex) {
        validateIndex(dataIndex);
        data[dataIndex] = submatrix[subIndex[0]];
      });
    } else {
      range.forEach(function (dataIndex, subIndex) {
        validateIndex(dataIndex);

        _setSubmatrix(data[dataIndex], index, submatrix[subIndex[0]], dims, dim + 1);
      });
    }
  }
  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @memberof DenseMatrix
   * @param {number[] || Matrix} size The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */


  DenseMatrix.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isCollection(size)) {
      throw new TypeError('Array or Matrix expected');
    } // SparseMatrix input is always 2d, flatten this into 1d if it's indeed a vector


    var sizeArray = size.valueOf().map(value => {
      return Array.isArray(value) && value.length === 1 ? value[0] : value;
    }); // matrix to resize

    var m = copy ? this.clone() : this; // resize matrix

    return _resize(m, sizeArray, defaultValue);
  };

  function _resize(matrix, size, defaultValue) {
    // check size
    if (size.length === 0) {
      // first value in matrix
      var v = matrix._data; // go deep

      while (isArray(v)) {
        v = v[0];
      }

      return v;
    } // resize matrix


    matrix._size = size.slice(0); // copy the array

    matrix._data = resize(matrix._data, matrix._size, defaultValue); // return matrix

    return matrix;
  }
  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * NOTE: This might be better suited to copy by default, instead of modifying
   *       in place. For now, it operates in place to remain consistent with
   *       resize().
   *
   * @memberof DenseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */


  DenseMatrix.prototype.reshape = function (size, copy) {
    var m = copy ? this.clone() : this;
    m._data = reshape(m._data, size);

    var currentLength = m._size.reduce((length, size) => length * size);

    m._size = processSizesWildcard(size, currentLength);
    return m;
  };
  /**
   * Enlarge the matrix when it is smaller than given size.
   * If the matrix is larger or equal sized, nothing is done.
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix           The matrix to be resized
   * @param {number[]} size
   * @param {*} defaultValue          Default value, filled in on new entries.
   * @private
   */


  function _fit(matrix, size, defaultValue) {
    var // copy the array
    newSize = matrix._size.slice(0);

    var changed = false; // add dimensions when needed

    while (newSize.length < size.length) {
      newSize.push(0);
      changed = true;
    } // enlarge size when needed


    for (var i = 0, ii = size.length; i < ii; i++) {
      if (size[i] > newSize[i]) {
        newSize[i] = size[i];
        changed = true;
      }
    }

    if (changed) {
      // resize only when size is changed
      _resize(matrix, newSize, defaultValue);
    }
  }
  /**
   * Create a clone of the matrix
   * @memberof DenseMatrix
   * @return {DenseMatrix} clone
   */


  DenseMatrix.prototype.clone = function () {
    var m = new DenseMatrix({
      data: clone(this._data),
      size: clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  /**
   * Retrieve the size of the matrix.
   * @memberof DenseMatrix
   * @returns {number[]} size
   */


  DenseMatrix.prototype.size = function () {
    return this._size.slice(0); // return a clone of _size
  };
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @memberof DenseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   *
   * @return {DenseMatrix} matrix
   */


  DenseMatrix.prototype.map = function (callback) {
    // matrix instance
    var me = this;

    var recurse = function recurse(value, index) {
      if (isArray(value)) {
        return value.map(function (child, i) {
          return recurse(child, index.concat(i));
        });
      } else {
        return callback(value, index, me);
      }
    }; // determine the new datatype when the original matrix has datatype defined
    // TODO: should be done in matrix constructor instead


    var data = recurse(this._data, []);
    var datatype = this._datatype !== undefined ? getArrayDataType(data, typeOf) : undefined;
    return new DenseMatrix(data, datatype);
  };
  /**
   * Execute a callback function on each entry of the matrix.
   * @memberof DenseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */


  DenseMatrix.prototype.forEach = function (callback) {
    // matrix instance
    var me = this;

    var recurse = function recurse(value, index) {
      if (isArray(value)) {
        value.forEach(function (child, i) {
          recurse(child, index.concat(i));
        });
      } else {
        callback(value, index, me);
      }
    };

    recurse(this._data, []);
  };
  /**
   * Iterate over the matrix elements
   * @return {Iterable<{ value, index: number[] }>}
   */


  DenseMatrix.prototype[Symbol.iterator] = function* () {
    var recurse = function* recurse(value, index) {
      if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          yield* recurse(value[i], index.concat(i));
        }
      } else {
        yield {
          value,
          index
        };
      }
    };

    yield* recurse(this._data, []);
  };
  /**
   * Returns an array containing the rows of a 2D matrix
   * @returns {Array<Matrix>}
   */


  DenseMatrix.prototype.rows = function () {
    var result = [];
    var s = this.size();

    if (s.length !== 2) {
      throw new TypeError('Rows can only be returned for a 2D matrix.');
    }

    var data = this._data;

    for (var row of data) {
      result.push(new DenseMatrix([row], this._datatype));
    }

    return result;
  };
  /**
   * Returns an array containing the columns of a 2D matrix
   * @returns {Array<Matrix>}
   */


  DenseMatrix.prototype.columns = function () {
    var _this = this;

    var result = [];
    var s = this.size();

    if (s.length !== 2) {
      throw new TypeError('Rows can only be returned for a 2D matrix.');
    }

    var data = this._data;

    var _loop = function _loop(i) {
      var col = data.map(row => [row[i]]);
      result.push(new DenseMatrix(col, _this._datatype));
    };

    for (var i = 0; i < s[1]; i++) {
      _loop(i);
    }

    return result;
  };
  /**
   * Create an Array with a copy of the data of the DenseMatrix
   * @memberof DenseMatrix
   * @returns {Array} array
   */


  DenseMatrix.prototype.toArray = function () {
    return clone(this._data);
  };
  /**
   * Get the primitive value of the DenseMatrix: a multidimensional array
   * @memberof DenseMatrix
   * @returns {Array} array
   */


  DenseMatrix.prototype.valueOf = function () {
    return this._data;
  };
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @memberof DenseMatrix
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */


  DenseMatrix.prototype.format = function (options) {
    return format$2(this._data, options);
  };
  /**
   * Get a string representation of the matrix
   * @memberof DenseMatrix
   * @returns {string} str
   */


  DenseMatrix.prototype.toString = function () {
    return format$2(this._data);
  };
  /**
   * Get a JSON representation of the matrix
   * @memberof DenseMatrix
   * @returns {Object}
   */


  DenseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'DenseMatrix',
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };
  /**
   * Get the kth Matrix diagonal.
   *
   * @memberof DenseMatrix
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Matrix}                     The matrix with the diagonal values.
   */


  DenseMatrix.prototype.diagonal = function (k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (isBigNumber(k)) {
        k = k.toNumber();
      } // is must be an integer


      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number');
      }
    } else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0; // rows & columns

    var rows = this._size[0];
    var columns = this._size[1]; // number diagonal values

    var n = Math.min(rows - kSub, columns - kSuper); // x is a matrix get diagonal from matrix

    var data = []; // loop rows

    for (var i = 0; i < n; i++) {
      data[i] = this._data[i + kSub][i + kSuper];
    } // create DenseMatrix


    return new DenseMatrix({
      data,
      size: [n],
      datatype: this._datatype
    });
  };
  /**
   * Create a diagonal matrix.
   *
   * @memberof DenseMatrix
   * @param {Array} size                     The matrix size.
   * @param {number | Matrix | Array } value The values for the diagonal.
   * @param {number | BigNumber} [k=0]       The kth diagonal where the vector will be filled in.
   * @param {number} [defaultValue]          The default value for non-diagonal
   * @param {string} [datatype]              The datatype for the diagonal
   *
   * @returns {DenseMatrix}
   */


  DenseMatrix.diagonal = function (size, value, k, defaultValue) {
    if (!isArray(size)) {
      throw new TypeError('Array expected, size parameter');
    }

    if (size.length !== 2) {
      throw new Error('Only two dimensions matrix are supported');
    } // map size & validate


    size = size.map(function (s) {
      // check it is a big number
      if (isBigNumber(s)) {
        // convert it
        s = s.toNumber();
      } // validate arguments


      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error('Size values must be positive integers');
      }

      return s;
    }); // validate k if any

    if (k) {
      // convert BigNumber to a number
      if (isBigNumber(k)) {
        k = k.toNumber();
      } // is must be an integer


      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number');
      }
    } else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0; // rows and columns

    var rows = size[0];
    var columns = size[1]; // number of non-zero items

    var n = Math.min(rows - kSub, columns - kSuper); // value extraction function

    var _value; // check value


    if (isArray(value)) {
      // validate array
      if (value.length !== n) {
        // number of values in array must be n
        throw new Error('Invalid value array length');
      } // define function


      _value = function _value(i) {
        // return value @ i
        return value[i];
      };
    } else if (isMatrix(value)) {
      // matrix size
      var ms = value.size(); // validate matrix

      if (ms.length !== 1 || ms[0] !== n) {
        // number of values in array must be n
        throw new Error('Invalid matrix length');
      } // define function


      _value = function _value(i) {
        // return value @ i
        return value.get([i]);
      };
    } else {
      // define function
      _value = function _value() {
        // return value
        return value;
      };
    } // discover default value if needed


    if (!defaultValue) {
      // check first value in array
      defaultValue = isBigNumber(_value(0)) ? _value(0).mul(0) // trick to create a BigNumber with value zero
      : 0;
    } // empty array


    var data = []; // check we need to resize array

    if (size.length > 0) {
      // resize array
      data = resize(data, size, defaultValue); // fill diagonal

      for (var d = 0; d < n; d++) {
        data[d + kSub][d + kSuper] = _value(d);
      }
    } // create DenseMatrix


    return new DenseMatrix({
      data,
      size: [rows, columns]
    });
  };
  /**
   * Generate a matrix from a JSON object
   * @memberof DenseMatrix
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "DenseMatrix", data: [], size: []}`,
   *                       where mathjs is optional
   * @returns {DenseMatrix}
   */


  DenseMatrix.fromJSON = function (json) {
    return new DenseMatrix(json);
  };
  /**
   * Swap rows i and j in Matrix.
   *
   * @memberof DenseMatrix
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */


  DenseMatrix.prototype.swapRows = function (i, j) {
    // check index
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error('Row index must be positive integers');
    } // check dimensions


    if (this._size.length !== 2) {
      throw new Error('Only two dimensional matrix is supported');
    } // validate index


    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]); // swap rows

    DenseMatrix._swapRows(i, j, this._data); // return current instance


    return this;
  };
  /**
   * Swap rows i and j in Dense Matrix data structure.
   *
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   * @param {Array} data     Matrix data
   */


  DenseMatrix._swapRows = function (i, j, data) {
    // swap values i <-> j
    var vi = data[i];
    data[i] = data[j];
    data[j] = vi;
  };
  /**
   * Preprocess data, which can be an Array or DenseMatrix with nested Arrays and
   * Matrices. Replaces all nested Matrices with Arrays
   * @memberof DenseMatrix
   * @param {Array} data
   * @return {Array} data
   */


  function preprocess(data) {
    for (var i = 0, ii = data.length; i < ii; i++) {
      var elem = data[i];

      if (isArray(elem)) {
        data[i] = preprocess(elem);
      } else if (elem && elem.isMatrix === true) {
        data[i] = preprocess(elem.valueOf());
      }
    }

    return data;
  }

  return DenseMatrix;
}, {
  isClass: true
});

/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {Function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
 *
 * @return {Array | Matrix} res
 */

function deepMap(array, callback, skipZeros) {
  if (array && typeof array.map === 'function') {
    // TODO: replace array.map with a for loop to improve performance
    return array.map(function (x) {
      return deepMap(x, callback);
    });
  } else {
    return callback(array);
  }
}

var n1 = 'number';
var n2 = 'number, number';
function absNumber(a) {
  return Math.abs(a);
}
absNumber.signature = n1;
function addNumber(a, b) {
  return a + b;
}
addNumber.signature = n2;
function multiplyNumber(a, b) {
  return a * b;
}
multiplyNumber.signature = n2;
function unaryMinusNumber(x) {
  return -x;
}
unaryMinusNumber.signature = n1;

var n1$1 = 'number';
function isZeroNumber(x) {
  return x === 0;
}
isZeroNumber.signature = n1$1;

var name$5 = 'isZero';
var dependencies$6 = ['typed'];
var createIsZero = /* #__PURE__ */factory(name$5, dependencies$6, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Test whether a value is zero.
   * The function can check for zero for types `number`, `BigNumber`, `Fraction`,
   * `Complex`, and `Unit`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isZero(x)
   *
   * Examples:
   *
   *    math.isZero(0)                     // returns true
   *    math.isZero(2)                     // returns false
   *    math.isZero(0.5)                   // returns false
   *    math.isZero(math.bignumber(0))     // returns true
   *    math.isZero(math.fraction(0))      // returns true
   *    math.isZero(math.fraction(1,3))    // returns false
   *    math.isZero(math.complex('2 - 4i') // returns false
   *    math.isZero(math.complex('0i')     // returns true
   *    math.isZero('0')                   // returns true
   *    math.isZero('2')                   // returns false
   *    math.isZero([2, 0, -3]')           // returns [false, true, false]
   *
   * See also:
   *
   *    isNumeric, isPositive, isNegative, isInteger
   *
   * @param {number | BigNumber | Complex | Fraction | Unit | Array | Matrix} x       Value to be tested
   * @return {boolean}  Returns true when `x` is zero.
   *                    Throws an error in case of an unknown data type.
   */

  return typed(name$5, {
    number: isZeroNumber,
    BigNumber: function BigNumber(x) {
      return x.isZero();
    },
    Complex: function Complex(x) {
      return x.re === 0 && x.im === 0;
    },
    Fraction: function Fraction(x) {
      return x.d === 1 && x.n === 0;
    },
    Unit: function Unit(x) {
      return this(x.value);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});

/**
 * Compares two BigNumbers.
 * @param {BigNumber} x       First value to compare
 * @param {BigNumber} y       Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */
function nearlyEqual$1(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon === null || epsilon === undefined) {
    return x.eq(y);
  } // use "==" operator, handles infinities


  if (x.eq(y)) {
    return true;
  } // NaN


  if (x.isNaN() || y.isNaN()) {
    return false;
  } // at this point x and y should be finite


  if (x.isFinite() && y.isFinite()) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = x.minus(y).abs();

    if (diff.isZero()) {
      return true;
    } else {
      // use relative error
      var max = x.constructor.max(x.abs(), y.abs());
      return diff.lte(max.times(epsilon));
    }
  } // Infinite and Number or negative Infinite and positive Infinite cases


  return false;
}

/**
 * Test whether two complex values are equal provided a given epsilon.
 * Does not use or change the global Complex.EPSILON setting
 * @param {Complex} x
 * @param {Complex} y
 * @param {number} epsilon
 * @returns {boolean}
 */

function complexEquals(x, y, epsilon) {
  return nearlyEqual(x.re, y.re, epsilon) && nearlyEqual(x.im, y.im, epsilon);
}

var name$6 = 'equalScalar';
var dependencies$7 = ['typed', 'config'];
var createEqualScalar = /* #__PURE__ */factory(name$6, dependencies$7, _ref => {
  var {
    typed,
    config
  } = _ref;
  /**
   * Test whether two scalar values are nearly equal.
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */

  return typed(name$6, {
    'boolean, boolean': function booleanBoolean(x, y) {
      return x === y;
    },
    'number, number': function numberNumber(x, y) {
      return nearlyEqual(x, y, config.epsilon);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.eq(y) || nearlyEqual$1(x, y, config.epsilon);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.equals(y);
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      return complexEquals(x, y, config.epsilon);
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }

      return this(x.value, y.value);
    }
  });
});
var createEqualScalarNumber = factory(name$6, ['typed', 'config'], _ref2 => {
  var {
    typed,
    config
  } = _ref2;
  return typed(name$6, {
    'number, number': function numberNumber(x, y) {
      return nearlyEqual(x, y, config.epsilon);
    }
  });
});

var name$7 = 'SparseMatrix';
var dependencies$8 = ['typed', 'equalScalar', 'Matrix'];
var createSparseMatrixClass = /* #__PURE__ */factory(name$7, dependencies$8, _ref => {
  var {
    typed,
    equalScalar,
    Matrix
  } = _ref;
  /**
   * Sparse Matrix implementation. This type implements
   * a [Compressed Column Storage](https://en.wikipedia.org/wiki/Sparse_matrix#Compressed_sparse_column_(CSC_or_CCS))
   * format for two-dimensional sparse matrices.
   * @class SparseMatrix
   */

  function SparseMatrix(data, datatype) {
    if (!(this instanceof SparseMatrix)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (datatype && !isString(datatype)) {
      throw new Error('Invalid datatype: ' + datatype);
    }

    if (isMatrix(data)) {
      // create from matrix
      _createFromMatrix(this, data, datatype);
    } else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
      // initialize fields
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
      this._datatype = datatype || data.datatype;
    } else if (isArray(data)) {
      // create from array
      _createFromArray(this, data, datatype);
    } else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + typeOf(data) + ')');
    } else {
      // nothing provided
      this._values = [];
      this._index = [];
      this._ptr = [0];
      this._size = [0, 0];
      this._datatype = datatype;
    }
  }

  function _createFromMatrix(matrix, source, datatype) {
    // check matrix type
    if (source.type === 'SparseMatrix') {
      // clone arrays
      matrix._values = source._values ? clone(source._values) : undefined;
      matrix._index = clone(source._index);
      matrix._ptr = clone(source._ptr);
      matrix._size = clone(source._size);
      matrix._datatype = datatype || source._datatype;
    } else {
      // build from matrix data
      _createFromArray(matrix, source.valueOf(), datatype || source._datatype);
    }
  }

  function _createFromArray(matrix, data, datatype) {
    // initialize fields
    matrix._values = [];
    matrix._index = [];
    matrix._ptr = [];
    matrix._datatype = datatype; // discover rows & columns, do not use math.size() to avoid looping array twice

    var rows = data.length;
    var columns = 0; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0;

    if (isString(datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar; // convert 0 to the same datatype

      zero = typed.convert(0, datatype);
    } // check we have rows (empty array)


    if (rows > 0) {
      // column index
      var j = 0;

      do {
        // store pointer to values index
        matrix._ptr.push(matrix._index.length); // loop rows


        for (var i = 0; i < rows; i++) {
          // current row
          var row = data[i]; // check row is an array

          if (isArray(row)) {
            // update columns if needed (only on first column)
            if (j === 0 && columns < row.length) {
              columns = row.length;
            } // check row has column


            if (j < row.length) {
              // value
              var v = row[j]; // check value != 0

              if (!eq(v, zero)) {
                // store value
                matrix._values.push(v); // index


                matrix._index.push(i);
              }
            }
          } else {
            // update columns if needed (only on first column)
            if (j === 0 && columns < 1) {
              columns = 1;
            } // check value != 0 (row is a scalar)


            if (!eq(row, zero)) {
              // store value
              matrix._values.push(row); // index


              matrix._index.push(i);
            }
          }
        } // increment index


        j++;
      } while (j < columns);
    } // store number of values in ptr


    matrix._ptr.push(matrix._index.length); // size


    matrix._size = [rows, columns];
  }

  SparseMatrix.prototype = new Matrix();
  /**
   * Create a new SparseMatrix
   */

  SparseMatrix.prototype.createSparseMatrix = function (data, datatype) {
    return new SparseMatrix(data, datatype);
  };
  /**
   * Attach type information
   */


  SparseMatrix.prototype.type = 'SparseMatrix';
  SparseMatrix.prototype.isSparseMatrix = true;
  /**
   * Get the matrix type
   *
   * Usage:
   *    const matrixType = matrix.getDataType()  // retrieves the matrix type
   *
   * @memberOf SparseMatrix
   * @return {string}   type information; if multiple types are found from the Matrix, it will return "mixed"
   */

  SparseMatrix.prototype.getDataType = function () {
    return getArrayDataType(this._values, typeOf);
  };
  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     const format = matrix.storage()   // retrieve storage format
   *
   * @memberof SparseMatrix
   * @return {string}           The storage format.
   */


  SparseMatrix.prototype.storage = function () {
    return 'sparse';
  };
  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     const format = matrix.datatype()    // retrieve matrix datatype
   *
   * @memberof SparseMatrix
   * @return {string}           The datatype.
   */


  SparseMatrix.prototype.datatype = function () {
    return this._datatype;
  };
  /**
   * Create a new SparseMatrix
   * @memberof SparseMatrix
   * @param {Array} data
   * @param {string} [datatype]
   */


  SparseMatrix.prototype.create = function (data, datatype) {
    return new SparseMatrix(data, datatype);
  };
  /**
   * Get the matrix density.
   *
   * Usage:
   *     const density = matrix.density()                   // retrieve matrix density
   *
   * @memberof SparseMatrix
   * @return {number}           The matrix density.
   */


  SparseMatrix.prototype.density = function () {
    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1]; // calculate density

    return rows !== 0 && columns !== 0 ? this._index.length / (rows * columns) : 0;
  };
  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     const subset = matrix.subset(index)               // retrieve subset
   *     const value = matrix.subset(index, replacement)   // replace subset
   *
   * @memberof SparseMatrix
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */


  SparseMatrix.prototype.subset = function (index, replacement, defaultValue) {
    // check it is a pattern matrix
    if (!this._values) {
      throw new Error('Cannot invoke subset on a Pattern only matrix');
    } // check arguments


    switch (arguments.length) {
      case 1:
        return _getsubset(this, index);
      // intentional fall through

      case 2:
      case 3:
        return _setsubset(this, index, replacement, defaultValue);

      default:
        throw new SyntaxError('Wrong number of arguments');
    }
  };

  function _getsubset(matrix, idx) {
    // check idx
    if (!isIndex(idx)) {
      throw new TypeError('Invalid index');
    }

    var isScalar = idx.isScalar();

    if (isScalar) {
      // return a scalar
      return matrix.get(idx.min());
    } // validate dimensions


    var size = idx.size();

    if (size.length !== matrix._size.length) {
      throw new DimensionError(size.length, matrix._size.length);
    } // vars


    var i, ii, k, kk; // validate if any of the ranges in the index is out of range

    var min = idx.min();
    var max = idx.max();

    for (i = 0, ii = matrix._size.length; i < ii; i++) {
      validateIndex(min[i], matrix._size[i]);
      validateIndex(max[i], matrix._size[i]);
    } // matrix arrays


    var mvalues = matrix._values;
    var mindex = matrix._index;
    var mptr = matrix._ptr; // rows & columns dimensions for result matrix

    var rows = idx.dimension(0);
    var columns = idx.dimension(1); // workspace & permutation vector

    var w = [];
    var pv = []; // loop rows in resulting matrix

    rows.forEach(function (i, r) {
      // update permutation vector
      pv[i] = r[0]; // mark i in workspace

      w[i] = true;
    }); // result matrix arrays

    var values = mvalues ? [] : undefined;
    var index = [];
    var ptr = []; // loop columns in result matrix

    columns.forEach(function (j) {
      // update ptr
      ptr.push(index.length); // loop values in column j

      for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
        // row
        i = mindex[k]; // check row is in result matrix

        if (w[i] === true) {
          // push index
          index.push(pv[i]); // check we need to process values

          if (values) {
            values.push(mvalues[k]);
          }
        }
      }
    }); // update ptr

    ptr.push(index.length); // return matrix

    return new SparseMatrix({
      values,
      index,
      ptr,
      size,
      datatype: matrix._datatype
    });
  }

  function _setsubset(matrix, index, submatrix, defaultValue) {
    // check index
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index');
    } // get index size and check whether the index contains a single value


    var iSize = index.size();
    var isScalar = index.isScalar(); // calculate the size of the submatrix, and convert it into an Array if needed

    var sSize;

    if (isMatrix(submatrix)) {
      // submatrix size
      sSize = submatrix.size(); // use array representation

      submatrix = submatrix.toArray();
    } else {
      // get submatrix size (array, scalar)
      sSize = arraySize(submatrix);
    } // check index is a scalar


    if (isScalar) {
      // verify submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected');
      } // set value


      matrix.set(index.min(), submatrix, defaultValue);
    } else {
      // validate dimensions, index size must be one or two dimensions
      if (iSize.length !== 1 && iSize.length !== 2) {
        throw new DimensionError(iSize.length, matrix._size.length, '<');
      } // check submatrix and index have the same dimensions


      if (sSize.length < iSize.length) {
        // calculate number of missing outer dimensions
        var i = 0;
        var outer = 0;

        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }

        while (iSize[i] === 1) {
          outer++;
          i++;
        } // unsqueeze both outer and inner dimensions


        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
      } // check whether the size of the submatrix matches the index size


      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, '>');
      } // insert the sub matrix


      if (iSize.length === 1) {
        // if the replacement index only has 1 dimension, go trough each one and set its value
        var range = index.dimension(0);
        range.forEach(function (dataIndex, subIndex) {
          validateIndex(dataIndex);
          matrix.set([dataIndex, 0], submatrix[subIndex[0]], defaultValue);
        });
      } else {
        // if the replacement index has 2 dimensions, go through each one and set the value in the correct index
        var firstDimensionRange = index.dimension(0);
        var secondDimensionRange = index.dimension(1);
        firstDimensionRange.forEach(function (firstDataIndex, firstSubIndex) {
          validateIndex(firstDataIndex);
          secondDimensionRange.forEach(function (secondDataIndex, secondSubIndex) {
            validateIndex(secondDataIndex);
            matrix.set([firstDataIndex, secondDataIndex], submatrix[firstSubIndex[0]][secondSubIndex[0]], defaultValue);
          });
        });
      }
    }

    return matrix;
  }
  /**
   * Get a single element from the matrix.
   * @memberof SparseMatrix
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */


  SparseMatrix.prototype.get = function (index) {
    if (!isArray(index)) {
      throw new TypeError('Array expected');
    }

    if (index.length !== this._size.length) {
      throw new DimensionError(index.length, this._size.length);
    } // check it is a pattern matrix


    if (!this._values) {
      throw new Error('Cannot invoke get on a Pattern only matrix');
    } // row and column


    var i = index[0];
    var j = index[1]; // check i, j are valid

    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[1]); // find value index

    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index); // check k is prior to next column k and it is in the correct row


    if (k < this._ptr[j + 1] && this._index[k] === i) {
      return this._values[k];
    }

    return 0;
  };
  /**
   * Replace a single element in the matrix.
   * @memberof SparseMatrix
   * @param {number[]} index   Zero-based index
   * @param {*} v
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be set to zero.
   * @return {SparseMatrix} self
   */


  SparseMatrix.prototype.set = function (index, v, defaultValue) {
    if (!isArray(index)) {
      throw new TypeError('Array expected');
    }

    if (index.length !== this._size.length) {
      throw new DimensionError(index.length, this._size.length);
    } // check it is a pattern matrix


    if (!this._values) {
      throw new Error('Cannot invoke set on a Pattern only matrix');
    } // row and column


    var i = index[0];
    var j = index[1]; // rows & columns

    var rows = this._size[0];
    var columns = this._size[1]; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0;

    if (isString(this._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [this._datatype, this._datatype]) || equalScalar; // convert 0 to the same datatype

      zero = typed.convert(0, this._datatype);
    } // check we need to resize matrix


    if (i > rows - 1 || j > columns - 1) {
      // resize matrix
      _resize(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue); // update rows & columns


      rows = this._size[0];
      columns = this._size[1];
    } // check i, j are valid


    validateIndex(i, rows);
    validateIndex(j, columns); // find value index

    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index); // check k is prior to next column k and it is in the correct row


    if (k < this._ptr[j + 1] && this._index[k] === i) {
      // check value != 0
      if (!eq(v, zero)) {
        // update value
        this._values[k] = v;
      } else {
        // remove value from matrix
        _remove(k, j, this._values, this._index, this._ptr);
      }
    } else {
      // insert value @ (i, j)
      _insert(k, i, j, v, this._values, this._index, this._ptr);
    }

    return this;
  };

  function _getValueIndex(i, top, bottom, index) {
    // check row is on the bottom side
    if (bottom - top === 0) {
      return bottom;
    } // loop rows [top, bottom[


    for (var r = top; r < bottom; r++) {
      // check we found value index
      if (index[r] === i) {
        return r;
      }
    } // we did not find row


    return top;
  }

  function _remove(k, j, values, index, ptr) {
    // remove value @ k
    values.splice(k, 1);
    index.splice(k, 1); // update pointers

    for (var x = j + 1; x < ptr.length; x++) {
      ptr[x]--;
    }
  }

  function _insert(k, i, j, v, values, index, ptr) {
    // insert value
    values.splice(k, 0, v); // update row for k

    index.splice(k, 0, i); // update column pointers

    for (var x = j + 1; x < ptr.length; x++) {
      ptr[x]++;
    }
  }
  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @memberof SparseMatrix
   * @param {number[] | Matrix} size  The new size the matrix should have.
   *                                  Since sparse matrices are always two-dimensional,
   *                                  size must be two numbers in either an array or a matrix
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */


  SparseMatrix.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isCollection(size)) {
      throw new TypeError('Array or Matrix expected');
    } // SparseMatrix input is always 2d, flatten this into 1d if it's indeed a vector


    var sizeArray = size.valueOf().map(value => {
      return Array.isArray(value) && value.length === 1 ? value[0] : value;
    });

    if (sizeArray.length !== 2) {
      throw new Error('Only two dimensions matrix are supported');
    } // check sizes


    sizeArray.forEach(function (value) {
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new TypeError('Invalid size, must contain positive integers ' + '(size: ' + format$2(sizeArray) + ')');
      }
    }); // matrix to resize

    var m = copy ? this.clone() : this; // resize matrix

    return _resize(m, sizeArray[0], sizeArray[1], defaultValue);
  };

  function _resize(matrix, rows, columns, defaultValue) {
    // value to insert at the time of growing matrix
    var value = defaultValue || 0; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0;

    if (isString(matrix._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar; // convert 0 to the same datatype

      zero = typed.convert(0, matrix._datatype); // convert value to the same datatype

      value = typed.convert(value, matrix._datatype);
    } // should we insert the value?


    var ins = !eq(value, zero); // old columns and rows

    var r = matrix._size[0];
    var c = matrix._size[1];
    var i, j, k; // check we need to increase columns

    if (columns > c) {
      // loop new columns
      for (j = c; j < columns; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._values.length; // check we need to insert matrix._values

        if (ins) {
          // loop rows
          for (i = 0; i < r; i++) {
            // add new matrix._values
            matrix._values.push(value); // update matrix._index


            matrix._index.push(i);
          }
        }
      } // store number of matrix._values in matrix._ptr


      matrix._ptr[columns] = matrix._values.length;
    } else if (columns < c) {
      // truncate matrix._ptr
      matrix._ptr.splice(columns + 1, c - columns); // truncate matrix._values and matrix._index


      matrix._values.splice(matrix._ptr[columns], matrix._values.length);

      matrix._index.splice(matrix._ptr[columns], matrix._index.length);
    } // update columns


    c = columns; // check we need to increase rows

    if (rows > r) {
      // check we have to insert values
      if (ins) {
        // inserts
        var n = 0; // loop columns

        for (j = 0; j < c; j++) {
          // update matrix._ptr for current column
          matrix._ptr[j] = matrix._ptr[j] + n; // where to insert matrix._values

          k = matrix._ptr[j + 1] + n; // pointer

          var p = 0; // loop new rows, initialize pointer

          for (i = r; i < rows; i++, p++) {
            // add value
            matrix._values.splice(k + p, 0, value); // update matrix._index


            matrix._index.splice(k + p, 0, i); // increment inserts


            n++;
          }
        } // store number of matrix._values in matrix._ptr


        matrix._ptr[c] = matrix._values.length;
      }
    } else if (rows < r) {
      // deletes
      var d = 0; // loop columns

      for (j = 0; j < c; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._ptr[j] - d; // where matrix._values start for next column

        var k0 = matrix._ptr[j];
        var k1 = matrix._ptr[j + 1] - d; // loop matrix._index

        for (k = k0; k < k1; k++) {
          // row
          i = matrix._index[k]; // check we need to delete value and matrix._index

          if (i > rows - 1) {
            // remove value
            matrix._values.splice(k, 1); // remove item from matrix._index


            matrix._index.splice(k, 1); // increase deletes


            d++;
          }
        }
      } // update matrix._ptr for current column


      matrix._ptr[j] = matrix._values.length;
    } // update matrix._size


    matrix._size[0] = rows;
    matrix._size[1] = columns; // return matrix

    return matrix;
  }
  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * NOTE: This might be better suited to copy by default, instead of modifying
   *       in place. For now, it operates in place to remain consistent with
   *       resize().
   *
   * @memberof SparseMatrix
   * @param {number[]} sizes          The new size the matrix should have.
   *                                  Since sparse matrices are always two-dimensional,
   *                                  size must be two numbers in either an array or a matrix
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */


  SparseMatrix.prototype.reshape = function (sizes, copy) {
    // validate arguments
    if (!isArray(sizes)) {
      throw new TypeError('Array expected');
    }

    if (sizes.length !== 2) {
      throw new Error('Sparse matrices can only be reshaped in two dimensions');
    } // check sizes


    sizes.forEach(function (value) {
      if (!isNumber(value) || !isInteger(value) || value <= -2 || value === 0) {
        throw new TypeError('Invalid size, must contain positive integers or -1 ' + '(size: ' + format$2(sizes) + ')');
      }
    });
    var currentLength = this._size[0] * this._size[1];
    sizes = processSizesWildcard(sizes, currentLength);
    var newLength = sizes[0] * sizes[1]; // m * n must not change

    if (currentLength !== newLength) {
      throw new Error('Reshaping sparse matrix will result in the wrong number of elements');
    } // matrix to reshape


    var m = copy ? this.clone() : this; // return unchanged if the same shape

    if (this._size[0] === sizes[0] && this._size[1] === sizes[1]) {
      return m;
    } // Convert to COO format (generate a column index)


    var colIndex = [];

    for (var i = 0; i < m._ptr.length; i++) {
      for (var j = 0; j < m._ptr[i + 1] - m._ptr[i]; j++) {
        colIndex.push(i);
      }
    } // Clone the values array


    var values = m._values.slice(); // Clone the row index array


    var rowIndex = m._index.slice(); // Transform the (row, column) indices


    for (var _i = 0; _i < m._index.length; _i++) {
      var r1 = rowIndex[_i];
      var c1 = colIndex[_i];
      var flat = r1 * m._size[1] + c1;
      colIndex[_i] = flat % sizes[1];
      rowIndex[_i] = Math.floor(flat / sizes[1]);
    } // Now reshaping is supposed to preserve the row-major order, BUT these sparse matrices are stored
    // in column-major order, so we have to reorder the value array now. One option is to use a multisort,
    // sorting several arrays based on some other array.
    // OR, we could easily just:
    // 1. Remove all values from the matrix


    m._values.length = 0;
    m._index.length = 0;
    m._ptr.length = sizes[1] + 1;
    m._size = sizes.slice();

    for (var _i2 = 0; _i2 < m._ptr.length; _i2++) {
      m._ptr[_i2] = 0;
    } // 2. Re-insert all elements in the proper order (simplified code from SparseMatrix.prototype.set)
    // This step is probably the most time-consuming


    for (var h = 0; h < values.length; h++) {
      var _i3 = rowIndex[h];
      var _j = colIndex[h];
      var v = values[h];

      var k = _getValueIndex(_i3, m._ptr[_j], m._ptr[_j + 1], m._index);

      _insert(k, _i3, _j, v, m._values, m._index, m._ptr);
    } // The value indices are inserted out of order, but apparently that's... still OK?


    return m;
  };
  /**
   * Create a clone of the matrix
   * @memberof SparseMatrix
   * @return {SparseMatrix} clone
   */


  SparseMatrix.prototype.clone = function () {
    var m = new SparseMatrix({
      values: this._values ? clone(this._values) : undefined,
      index: clone(this._index),
      ptr: clone(this._ptr),
      size: clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  /**
   * Retrieve the size of the matrix.
   * @memberof SparseMatrix
   * @returns {number[]} size
   */


  SparseMatrix.prototype.size = function () {
    return this._size.slice(0); // copy the Array
  };
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @memberof SparseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {SparseMatrix} matrix
   */


  SparseMatrix.prototype.map = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values) {
      throw new Error('Cannot invoke map on a Pattern only matrix');
    } // matrix instance


    var me = this; // rows and columns

    var rows = this._size[0];
    var columns = this._size[1]; // invoke callback

    var invoke = function invoke(v, i, j) {
      // invoke callback
      return callback(v, [i, j], me);
    }; // invoke _map


    return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
  };
  /**
   * Create a new matrix with the results of the callback function executed on the interval
   * [minRow..maxRow, minColumn..maxColumn].
   */


  function _map(matrix, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
    // result arrays
    var values = [];
    var index = [];
    var ptr = []; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0;

    if (isString(matrix._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar; // convert 0 to the same datatype

      zero = typed.convert(0, matrix._datatype);
    } // invoke callback


    var invoke = function invoke(v, x, y) {
      // invoke callback
      v = callback(v, x, y); // check value != 0

      if (!eq(v, zero)) {
        // store value
        values.push(v); // index

        index.push(x);
      }
    }; // loop columns


    for (var j = minColumn; j <= maxColumn; j++) {
      // store pointer to values index
      ptr.push(values.length); // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]

      var k0 = matrix._ptr[j];
      var k1 = matrix._ptr[j + 1];

      if (skipZeros) {
        // loop k within [k0, k1[
        for (var k = k0; k < k1; k++) {
          // row index
          var i = matrix._index[k]; // check i is in range

          if (i >= minRow && i <= maxRow) {
            // value @ k
            invoke(matrix._values[k], i - minRow, j - minColumn);
          }
        }
      } else {
        // create a cache holding all defined values
        var _values = {};

        for (var _k = k0; _k < k1; _k++) {
          var _i4 = matrix._index[_k];
          _values[_i4] = matrix._values[_k];
        } // loop over all rows (indexes can be unordered so we can't use that),
        // and either read the value or zero


        for (var _i5 = minRow; _i5 <= maxRow; _i5++) {
          var value = _i5 in _values ? _values[_i5] : 0;
          invoke(value, _i5 - minRow, j - minColumn);
        }
      }
    } // store number of values in ptr


    ptr.push(values.length); // return sparse matrix

    return new SparseMatrix({
      values,
      index,
      ptr,
      size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
    });
  }
  /**
   * Execute a callback function on each entry of the matrix.
   * @memberof SparseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *                              If false, the indices are guaranteed to be in order,
   *                              if true, the indices can be unordered.
   */


  SparseMatrix.prototype.forEach = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values) {
      throw new Error('Cannot invoke forEach on a Pattern only matrix');
    } // matrix instance


    var me = this; // rows and columns

    var rows = this._size[0];
    var columns = this._size[1]; // loop columns

    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];

      if (skipZeros) {
        // loop k within [k0, k1[
        for (var k = k0; k < k1; k++) {
          // row index
          var i = this._index[k]; // value @ k

          callback(this._values[k], [i, j], me);
        }
      } else {
        // create a cache holding all defined values
        var values = {};

        for (var _k2 = k0; _k2 < k1; _k2++) {
          var _i6 = this._index[_k2];
          values[_i6] = this._values[_k2];
        } // loop over all rows (indexes can be unordered so we can't use that),
        // and either read the value or zero


        for (var _i7 = 0; _i7 < rows; _i7++) {
          var value = _i7 in values ? values[_i7] : 0;
          callback(value, [_i7, j], me);
        }
      }
    }
  };
  /**
   * Iterate over the matrix elements, skipping zeros
   * @return {Iterable<{ value, index: number[] }>}
   */


  SparseMatrix.prototype[Symbol.iterator] = function* () {
    if (!this._values) {
      throw new Error('Cannot iterate a Pattern only matrix');
    }

    var columns = this._size[1];

    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];

      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k];
        yield {
          value: this._values[k],
          index: [i, j]
        };
      }
    }
  };
  /**
   * Create an Array with a copy of the data of the SparseMatrix
   * @memberof SparseMatrix
   * @returns {Array} array
   */


  SparseMatrix.prototype.toArray = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, true);
  };
  /**
   * Get the primitive value of the SparseMatrix: a two dimensions array
   * @memberof SparseMatrix
   * @returns {Array} array
   */


  SparseMatrix.prototype.valueOf = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, false);
  };

  function _toArray(values, index, ptr, size, copy) {
    // rows and columns
    var rows = size[0];
    var columns = size[1]; // result

    var a = []; // vars

    var i, j; // initialize array

    for (i = 0; i < rows; i++) {
      a[i] = [];

      for (j = 0; j < columns; j++) {
        a[i][j] = 0;
      }
    } // loop columns


    for (j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = ptr[j];
      var k1 = ptr[j + 1]; // loop k within [k0, k1[

      for (var k = k0; k < k1; k++) {
        // row index
        i = index[k]; // set value (use one for pattern matrix)

        a[i][j] = values ? copy ? clone(values[k]) : values[k] : 1;
      }
    }

    return a;
  }
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @memberof SparseMatrix
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */


  SparseMatrix.prototype.format = function (options) {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1]; // density

    var density = this.density(); // rows & columns

    var str = 'Sparse Matrix [' + format$2(rows, options) + ' x ' + format$2(columns, options) + '] density: ' + format$2(density, options) + '\n'; // loop columns

    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1]; // loop k within [k0, k1[

      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k]; // append value

        str += '\n    (' + format$2(i, options) + ', ' + format$2(j, options) + ') ==> ' + (this._values ? format$2(this._values[k], options) : 'X');
      }
    }

    return str;
  };
  /**
   * Get a string representation of the matrix
   * @memberof SparseMatrix
   * @returns {string} str
   */


  SparseMatrix.prototype.toString = function () {
    return format$2(this.toArray());
  };
  /**
   * Get a JSON representation of the matrix
   * @memberof SparseMatrix
   * @returns {Object}
   */


  SparseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'SparseMatrix',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size,
      datatype: this._datatype
    };
  };
  /**
   * Get the kth Matrix diagonal.
   *
   * @memberof SparseMatrix
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Matrix}                     The matrix vector with the diagonal values.
   */


  SparseMatrix.prototype.diagonal = function (k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (isBigNumber(k)) {
        k = k.toNumber();
      } // is must be an integer


      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number');
      }
    } else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0; // rows & columns

    var rows = this._size[0];
    var columns = this._size[1]; // number diagonal values

    var n = Math.min(rows - kSub, columns - kSuper); // diagonal arrays

    var values = [];
    var index = [];
    var ptr = []; // initial ptr value

    ptr[0] = 0; // loop columns

    for (var j = kSuper; j < columns && values.length < n; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1]; // loop x within [k0, k1[

      for (var x = k0; x < k1; x++) {
        // row index
        var i = this._index[x]; // check row

        if (i === j - kSuper + kSub) {
          // value on this column
          values.push(this._values[x]); // store row

          index[values.length - 1] = i - kSub; // exit loop

          break;
        }
      }
    } // close ptr


    ptr.push(values.length); // return matrix

    return new SparseMatrix({
      values,
      index,
      ptr,
      size: [n, 1]
    });
  };
  /**
   * Generate a matrix from a JSON object
   * @memberof SparseMatrix
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "SparseMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
   *                       where mathjs is optional
   * @returns {SparseMatrix}
   */


  SparseMatrix.fromJSON = function (json) {
    return new SparseMatrix(json);
  };
  /**
   * Create a diagonal matrix.
   *
   * @memberof SparseMatrix
   * @param {Array} size                       The matrix size.
   * @param {number | Array | Matrix } value   The values for the diagonal.
   * @param {number | BigNumber} [k=0]         The kth diagonal where the vector will be filled in.
   * @param {number} [defaultValue]            The default value for non-diagonal
   * @param {string} [datatype]                The Matrix datatype, values must be of this datatype.
   *
   * @returns {SparseMatrix}
   */


  SparseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
    if (!isArray(size)) {
      throw new TypeError('Array expected, size parameter');
    }

    if (size.length !== 2) {
      throw new Error('Only two dimensions matrix are supported');
    } // map size & validate


    size = size.map(function (s) {
      // check it is a big number
      if (isBigNumber(s)) {
        // convert it
        s = s.toNumber();
      } // validate arguments


      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error('Size values must be positive integers');
      }

      return s;
    }); // validate k if any

    if (k) {
      // convert BigNumber to a number
      if (isBigNumber(k)) {
        k = k.toNumber();
      } // is must be an integer


      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number');
      }
    } else {
      // default value
      k = 0;
    } // equal signature to use


    var eq = equalScalar; // zero value

    var zero = 0;

    if (isString(datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar; // convert 0 to the same datatype

      zero = typed.convert(0, datatype);
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0; // rows and columns

    var rows = size[0];
    var columns = size[1]; // number of non-zero items

    var n = Math.min(rows - kSub, columns - kSuper); // value extraction function

    var _value; // check value


    if (isArray(value)) {
      // validate array
      if (value.length !== n) {
        // number of values in array must be n
        throw new Error('Invalid value array length');
      } // define function


      _value = function _value(i) {
        // return value @ i
        return value[i];
      };
    } else if (isMatrix(value)) {
      // matrix size
      var ms = value.size(); // validate matrix

      if (ms.length !== 1 || ms[0] !== n) {
        // number of values in array must be n
        throw new Error('Invalid matrix length');
      } // define function


      _value = function _value(i) {
        // return value @ i
        return value.get([i]);
      };
    } else {
      // define function
      _value = function _value() {
        // return value
        return value;
      };
    } // create arrays


    var values = [];
    var index = [];
    var ptr = []; // loop items

    for (var j = 0; j < columns; j++) {
      // number of rows with value
      ptr.push(values.length); // diagonal index

      var i = j - kSuper; // check we need to set diagonal value

      if (i >= 0 && i < n) {
        // get value @ i
        var v = _value(i); // check for zero


        if (!eq(v, zero)) {
          // column
          index.push(i + kSub); // add value

          values.push(v);
        }
      }
    } // last value should be number of values


    ptr.push(values.length); // create SparseMatrix

    return new SparseMatrix({
      values,
      index,
      ptr,
      size: [rows, columns]
    });
  };
  /**
   * Swap rows i and j in Matrix.
   *
   * @memberof SparseMatrix
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */


  SparseMatrix.prototype.swapRows = function (i, j) {
    // check index
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error('Row index must be positive integers');
    } // check dimensions


    if (this._size.length !== 2) {
      throw new Error('Only two dimensional matrix is supported');
    } // validate index


    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]); // swap rows

    SparseMatrix._swapRows(i, j, this._size[1], this._values, this._index, this._ptr); // return current instance


    return this;
  };
  /**
   * Loop rows with data in column j.
   *
   * @param {number} j            Column
   * @param {Array} values        Matrix values
   * @param {Array} index         Matrix row indeces
   * @param {Array} ptr           Matrix column pointers
   * @param {Function} callback   Callback function invoked for every row in column j
   */


  SparseMatrix._forEachRow = function (j, values, index, ptr, callback) {
    // indeces for column j
    var k0 = ptr[j];
    var k1 = ptr[j + 1]; // loop

    for (var k = k0; k < k1; k++) {
      // invoke callback
      callback(index[k], values[k]);
    }
  };
  /**
   * Swap rows x and y in Sparse Matrix data structures.
   *
   * @param {number} x         Matrix row index 1
   * @param {number} y         Matrix row index 2
   * @param {number} columns   Number of columns in matrix
   * @param {Array} values     Matrix values
   * @param {Array} index      Matrix row indeces
   * @param {Array} ptr        Matrix column pointers
   */


  SparseMatrix._swapRows = function (x, y, columns, values, index, ptr) {
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = ptr[j];
      var k1 = ptr[j + 1]; // find value index @ x

      var kx = _getValueIndex(x, k0, k1, index); // find value index @ x


      var ky = _getValueIndex(y, k0, k1, index); // check both rows exist in matrix


      if (kx < k1 && ky < k1 && index[kx] === x && index[ky] === y) {
        // swap values (check for pattern matrix)
        if (values) {
          var v = values[kx];
          values[kx] = values[ky];
          values[ky] = v;
        } // next column


        continue;
      } // check x row exist & no y row


      if (kx < k1 && index[kx] === x && (ky >= k1 || index[ky] !== y)) {
        // value @ x (check for pattern matrix)
        var vx = values ? values[kx] : undefined; // insert value @ y

        index.splice(ky, 0, y);

        if (values) {
          values.splice(ky, 0, vx);
        } // remove value @ x (adjust array index if needed)


        index.splice(ky <= kx ? kx + 1 : kx, 1);

        if (values) {
          values.splice(ky <= kx ? kx + 1 : kx, 1);
        } // next column


        continue;
      } // check y row exist & no x row


      if (ky < k1 && index[ky] === y && (kx >= k1 || index[kx] !== x)) {
        // value @ y (check for pattern matrix)
        var vy = values ? values[ky] : undefined; // insert value @ x

        index.splice(kx, 0, x);

        if (values) {
          values.splice(kx, 0, vy);
        } // remove value @ y (adjust array index if needed)


        index.splice(kx <= ky ? ky + 1 : ky, 1);

        if (values) {
          values.splice(kx <= ky ? ky + 1 : ky, 1);
        }
      }
    }
  };

  return SparseMatrix;
}, {
  isClass: true
});

var name$8 = 'number';
var dependencies$9 = ['typed'];
/**
 * Separates the radix, integer part, and fractional part of a non decimal number string
 * @param {string} input string to parse
 * @returns {object} the parts of the string or null if not a valid input
 */

function getNonDecimalNumberParts(input) {
  var nonDecimalWithRadixMatch = input.match(/(0[box])([0-9a-fA-F]*)\.([0-9a-fA-F]*)/);

  if (nonDecimalWithRadixMatch) {
    var radix = {
      '0b': 2,
      '0o': 8,
      '0x': 16
    }[nonDecimalWithRadixMatch[1]];
    var integerPart = nonDecimalWithRadixMatch[2];
    var fractionalPart = nonDecimalWithRadixMatch[3];
    return {
      input,
      radix,
      integerPart,
      fractionalPart
    };
  } else {
    return null;
  }
}
/**
 * Makes a number from a radix, and integer part, and a fractional part
 * @param {parts} [x] parts of the number string (from getNonDecimalNumberParts)
 * @returns {number} the number
 */


function makeNumberFromNonDecimalParts(parts) {
  var n = parseInt(parts.integerPart, parts.radix);
  var f = 0;

  for (var i = 0; i < parts.fractionalPart.length; i++) {
    var digitValue = parseInt(parts.fractionalPart[i], parts.radix);
    f += digitValue / Math.pow(parts.radix, i + 1);
  }

  var result = n + f;

  if (isNaN(result)) {
    throw new SyntaxError('String "' + parts.input + '" is no valid number');
  }

  return result;
}

var createNumber = /* #__PURE__ */factory(name$8, dependencies$9, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   *
   * Syntax:
   *
   *    math.number(value)
   *    math.number(unit, valuelessUnit)
   *
   * Examples:
   *
   *    math.number(2)                         // returns number 2
   *    math.number('7.2')                     // returns number 7.2
   *    math.number(true)                      // returns number 1
   *    math.number([true, false, true, true]) // returns [1, 0, 1, 1]
   *    math.number(math.unit('52cm'), 'm')    // returns 0.52
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, string, unit
   *
   * @param {string | number | BigNumber | Fraction | boolean | Array | Matrix | Unit | null} [value]  Value to be converted
   * @param {Unit | string} [valuelessUnit] A valueless unit, used to convert a unit to a number
   * @return {number | Array | Matrix} The created number
   */

  var number = typed('number', {
    '': function _() {
      return 0;
    },
    number: function number(x) {
      return x;
    },
    string: function string(x) {
      if (x === 'NaN') return NaN;
      var nonDecimalNumberParts = getNonDecimalNumberParts(x);

      if (nonDecimalNumberParts) {
        return makeNumberFromNonDecimalParts(nonDecimalNumberParts);
      }

      var size = 0;
      var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);

      if (wordSizeSuffixMatch) {
        // x includes a size suffix like 0xffffi32, so we extract
        // the suffix and remove it from x
        size = Number(wordSizeSuffixMatch[2]);
        x = wordSizeSuffixMatch[1];
      }

      var num = Number(x);

      if (isNaN(num)) {
        throw new SyntaxError('String "' + x + '" is no valid number');
      }

      if (wordSizeSuffixMatch) {
        // x is a signed bin, oct, or hex literal
        // num is the value of string x if x is interpreted as unsigned
        if (num > 2 ** size - 1) {
          // literal is too large for size suffix
          throw new SyntaxError("String \"".concat(x, "\" is out of range"));
        } // check if the bit at index size - 1 is set and if so do the twos complement


        if (num >= 2 ** (size - 1)) {
          num = num - 2 ** size;
        }
      }

      return num;
    },
    BigNumber: function BigNumber(x) {
      return x.toNumber();
    },
    Fraction: function Fraction(x) {
      return x.valueOf();
    },
    Unit: function Unit(x) {
      throw new Error('Second argument with valueless unit expected');
    },
    null: function _null(x) {
      return 0;
    },
    'Unit, string | Unit': function UnitStringUnit(unit, valuelessUnit) {
      return unit.toNumber(valuelessUnit);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  }); // reviver function to parse a JSON object like:
  //
  //     {"mathjs":"number","value":"2.3"}
  //
  // into a number 2.3

  number.fromJSON = function (json) {
    return parseFloat(json.value);
  };

  return number;
});

var name$9 = 'bignumber';
var dependencies$a = ['typed', 'BigNumber'];
var createBignumber = /* #__PURE__ */factory(name$9, dependencies$a, _ref => {
  var {
    typed,
    BigNumber
  } = _ref;
  /**
   * Create a BigNumber, which can store numbers with arbitrary precision.
   * When a matrix is provided, all elements will be converted to BigNumber.
   *
   * Syntax:
   *
   *    math.bignumber(x)
   *
   * Examples:
   *
   *    0.1 + 0.2                                  // returns number 0.30000000000000004
   *    math.bignumber(0.1) + math.bignumber(0.2)  // returns BigNumber 0.3
   *
   *
   *    7.2e500                                    // returns number Infinity
   *    math.bignumber('7.2e500')                  // returns BigNumber 7.2e500
   *
   * See also:
   *
   *    boolean, complex, index, matrix, string, unit
   *
   * @param {number | string | Fraction | BigNumber | Array | Matrix | boolean | null} [value]  Value for the big number,
   *                                                    0 by default.
   * @returns {BigNumber} The created bignumber
   */

  return typed('bignumber', {
    '': function _() {
      return new BigNumber(0);
    },
    number: function number(x) {
      // convert to string to prevent errors in case of >15 digits
      return new BigNumber(x + '');
    },
    string: function string(x) {
      var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);

      if (wordSizeSuffixMatch) {
        // x has a word size suffix
        var size = wordSizeSuffixMatch[2];
        var n = BigNumber(wordSizeSuffixMatch[1]);
        var twoPowSize = new BigNumber(2).pow(Number(size));

        if (n.gt(twoPowSize.sub(1))) {
          throw new SyntaxError("String \"".concat(x, "\" is out of range"));
        }

        var twoPowSizeSubOne = new BigNumber(2).pow(Number(size) - 1);

        if (n.gte(twoPowSizeSubOne)) {
          return n.sub(twoPowSize);
        } else {
          return n;
        }
      }

      return new BigNumber(x);
    },
    BigNumber: function BigNumber(x) {
      // we assume a BigNumber is immutable
      return x;
    },
    Fraction: function Fraction(x) {
      return new BigNumber(x.n).div(x.d).times(x.s);
    },
    null: function _null(x) {
      return new BigNumber(0);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});

var name$a = 'fraction';
var dependencies$b = ['typed', 'Fraction'];
var createFraction = /* #__PURE__ */factory(name$a, dependencies$b, _ref => {
  var {
    typed,
    Fraction
  } = _ref;
  /**
   * Create a fraction or convert a value to a fraction.
   *
   * With one numeric argument, produces the closest rational approximation to the
   * input.
   * With two arguments, the first is the numerator and the second is the denominator,
   * and creates the corresponding fraction. Both numerator and denominator must be
   * integers.
   * With one object argument, looks for the integer numerator as the value of property
   * 'n' and the integer denominator as the value of property 'd'.
   * With a matrix argument, creates a matrix of the same shape with entries
   * converted into fractions.
   *
   * Syntax:
   *     math.fraction(value)
   *     math.fraction(numerator, denominator)
   *     math.fraction({n: numerator, d: denominator})
   *     math.fraction(matrix: Array | Matrix)
   *
   * Examples:
   *
   *     math.fraction(6.283)             // returns Fraction 6283/1000
   *     math.fraction(1, 3)              // returns Fraction 1/3
   *     math.fraction('2/3')             // returns Fraction 2/3
   *     math.fraction({n: 2, d: 3})      // returns Fraction 2/3
   *     math.fraction([0.2, 0.25, 1.25]) // returns Array [1/5, 1/4, 5/4]
   *     math.fraction(4, 5.1)            // throws Error: Parameters must be integer
   *
   * See also:
   *
   *    bignumber, number, string, unit
   *
   * @param {number | string | Fraction | BigNumber | Array | Matrix} [args]
   *            Arguments specifying the value, or numerator and denominator of
   *            the fraction
   * @return {Fraction | Array | Matrix} Returns a fraction
   */

  return typed('fraction', {
    number: function number(x) {
      if (!isFinite(x) || isNaN(x)) {
        throw new Error(x + ' cannot be represented as a fraction');
      }

      return new Fraction(x);
    },
    string: function string(x) {
      return new Fraction(x);
    },
    'number, number': function numberNumber(numerator, denominator) {
      return new Fraction(numerator, denominator);
    },
    null: function _null(x) {
      return new Fraction(0);
    },
    BigNumber: function BigNumber(x) {
      return new Fraction(x.toString());
    },
    Fraction: function Fraction(x) {
      return x; // fractions are immutable
    },
    Object: function Object(x) {
      return new Fraction(x);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});

var name$b = 'matrix';
var dependencies$c = ['typed', 'Matrix', 'DenseMatrix', 'SparseMatrix'];
var createMatrix = /* #__PURE__ */factory(name$b, dependencies$c, _ref => {
  var {
    typed,
    Matrix,
    DenseMatrix,
    SparseMatrix
  } = _ref;
  /**
   * Create a Matrix. The function creates a new `math.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   * Supported storage formats are 'dense' and 'sparse'.
   *
   * Syntax:
   *
   *    math.matrix()                         // creates an empty matrix using default storage format (dense).
   *    math.matrix(data)                     // creates a matrix with initial data using default storage format (dense).
   *    math.matrix('dense')                  // creates an empty matrix using the given storage format.
   *    math.matrix(data, 'dense')            // creates a matrix with initial data using the given storage format.
   *    math.matrix(data, 'sparse')           // creates a sparse matrix with initial data.
   *    math.matrix(data, 'sparse', 'number') // creates a sparse matrix with initial data, number data type.
   *
   * Examples:
   *
   *    let m = math.matrix([[1, 2], [3, 4]])
   *    m.size()                        // Array [2, 2]
   *    m.resize([3, 2], 5)
   *    m.valueOf()                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, sparse
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format, either `'dense'` or `'sparse'`
   * @param {string} [datatype]        Type of the values
   *
   * @return {Matrix} The created matrix
   */

  return typed(name$b, {
    '': function _() {
      return _create([]);
    },
    string: function string(format) {
      return _create([], format);
    },
    'string, string': function stringString(format, datatype) {
      return _create([], format, datatype);
    },
    Array: function Array(data) {
      return _create(data);
    },
    Matrix: function Matrix(data) {
      return _create(data, data.storage());
    },
    'Array | Matrix, string': _create,
    'Array | Matrix, string, string': _create
  });
  /**
   * Create a new Matrix with given storage format
   * @param {Array} data
   * @param {string} [format]
   * @param {string} [datatype]
   * @returns {Matrix} Returns a new Matrix
   * @private
   */

  function _create(data, format, datatype) {
    // get storage format constructor
    if (format === 'dense' || format === 'default' || format === undefined) {
      return new DenseMatrix(data, datatype);
    }

    if (format === 'sparse') {
      return new SparseMatrix(data, datatype);
    }

    throw new TypeError('Unknown matrix type ' + JSON.stringify(format) + '.');
  }
});

var name$c = 'unaryMinus';
var dependencies$d = ['typed'];
var createUnaryMinus = /* #__PURE__ */factory(name$c, dependencies$d, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real and
   * complex value are inverted.
   *
   * Syntax:
   *
   *    math.unaryMinus(x)
   *
   * Examples:
   *
   *    math.unaryMinus(3.5)      // returns -3.5
   *    math.unaryMinus(-4.2)     // returns 4.2
   *
   * See also:
   *
   *    add, subtract, unaryPlus
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Number to be inverted.
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */

  return typed(name$c, {
    number: unaryMinusNumber,
    Complex: function Complex(x) {
      return x.neg();
    },
    BigNumber: function BigNumber(x) {
      return x.neg();
    },
    Fraction: function Fraction(x) {
      return x.neg();
    },
    Unit: function Unit(x) {
      var res = x.clone();
      res.value = this(x.value);
      return res;
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since unaryMinus(0) = 0
      return deepMap(x, this);
    } // TODO: add support for string

  });
});

var name$d = 'abs';
var dependencies$e = ['typed'];
var createAbs = /* #__PURE__ */factory(name$d, dependencies$e, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5)                // returns number 3.5
   *    math.abs(-4.2)               // returns number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2])  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            A number or matrix for which to get the absolute value
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}
   *            Absolute value of `x`
   */

  return typed(name$d, {
    number: absNumber,
    Complex: function Complex(x) {
      return x.abs();
    },
    BigNumber: function BigNumber(x) {
      return x.abs();
    },
    Fraction: function Fraction(x) {
      return x.abs();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since abs(0) = 0
      return deepMap(x, this);
    },
    Unit: function Unit(x) {
      return x.abs();
    }
  });
});

var name$e = 'addScalar';
var dependencies$f = ['typed'];
var createAddScalar = /* #__PURE__ */factory(name$e, dependencies$f, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}     Sum of `x` and `y`
   * @private
   */

  return typed(name$e, {
    'number, number': addNumber,
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.add(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.plus(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.add(y);
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (x.value === null || x.value === undefined) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value === null || y.value === undefined) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');
      var res = x.clone();
      res.value = this(res.value, y.value);
      res.fixPrefix = false;
      return res;
    }
  });
});

var name$f = 'algorithm11';
var dependencies$g = ['typed', 'equalScalar'];
var createAlgorithm11 = /* #__PURE__ */factory(name$f, dependencies$g, _ref => {
  var {
    typed,
    equalScalar
  } = _ref;
  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b).
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ???  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ???
   *          ???  0          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */

  return function algorithm11(s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype; // sparse matrix cannot be a Pattern matrix

    if (!avalues) {
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');
    } // rows & columns


    var rows = asize[0];
    var columns = asize[1]; // datatype

    var dt; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string') {
      // datatype
      dt = adt; // find signature that matches (dt, dt)

      eq = typed.find(equalScalar, [dt, dt]); // convert 0 to the same datatype

      zero = typed.convert(0, dt); // convert b to the same datatype

      b = typed.convert(b, dt); // callback

      cf = typed.find(callback, [dt, dt]);
    } // result arrays


    var cvalues = [];
    var cindex = [];
    var cptr = []; // loop columns

    for (var j = 0; j < columns; j++) {
      // initialize ptr
      cptr[j] = cindex.length; // values in j

      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = aindex[k]; // invoke callback

        var v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b); // check value is zero

        if (!eq(v, zero)) {
          // push index & value
          cindex.push(i);
          cvalues.push(v);
        }
      }
    } // update ptr


    cptr[columns] = cindex.length; // return sparse matrix

    return s.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

var name$g = 'algorithm14';
var dependencies$h = ['typed'];
var createAlgorithm14 = /* #__PURE__ */factory(name$g, dependencies$h, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */

  return function algorithm14(a, b, callback, inverse) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype; // datatype

    var dt; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string') {
      // datatype
      dt = adt; // convert b to the same datatype

      b = typed.convert(b, dt); // callback

      cf = typed.find(callback, [dt, dt]);
    } // populate cdata, iterate through dimensions


    var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : []; // c matrix

    return a.createDenseMatrix({
      data: cdata,
      size: clone(asize),
      datatype: dt
    });
  }; // recursive function

  function _iterate(f, level, s, n, av, bv, inverse) {
    // initialize array for this level
    var cv = []; // check we reach the last level

    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv);
      }
    } else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
      }
    }

    return cv;
  }
});

var name$h = 'algorithm01';
var dependencies$i = ['typed'];
var createAlgorithm01 = /* #__PURE__ */factory(name$h, dependencies$i, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij).
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ???  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ???
   *          ???  Dij          ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */

  return function algorithm1(denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype; // sparse matrix arrays

    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype; // validate dimensions

    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    } // check rows & columns


    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    } // sparse matrix cannot be a Pattern matrix


    if (!bvalues) {
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');
    } // rows & columns


    var rows = asize[0];
    var columns = asize[1]; // process data types

    var dt = typeof adt === 'string' && adt === bdt ? adt : undefined; // callback function

    var cf = dt ? typed.find(callback, [dt, dt]) : callback; // vars

    var i, j; // result (DenseMatrix)

    var cdata = []; // initialize c

    for (i = 0; i < rows; i++) {
      cdata[i] = [];
    } // workspace


    var x = []; // marks indicating we have a value in x for a given column

    var w = []; // loop columns in b

    for (j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1; // values in column j

      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k]; // update workspace

        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]); // mark i as updated

        w[i] = mark;
      } // loop rows


      for (i = 0; i < rows; i++) {
        // check row is in workspace
        if (w[i] === mark) {
          // c[i][j] was already calculated
          cdata[i][j] = x[i];
        } else {
          // item does not exist in S
          cdata[i][j] = adata[i][j];
        }
      }
    } // return dense matrix


    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

var name$i = 'algorithm04';
var dependencies$j = ['typed', 'equalScalar'];
var createAlgorithm04 = /* #__PURE__ */factory(name$i, dependencies$j, _ref => {
  var {
    typed,
    equalScalar
  } = _ref;
  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij).
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ???  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ???  A(i,j)       ; A(i,j) !== 0
   *          ???  B(i,j)       ; B(i,j) !== 0
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */

  return function algorithm04(a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype; // sparse matrix arrays

    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype; // validate dimensions

    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    } // check rows & columns


    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    } // rows & columns


    var rows = asize[0];
    var columns = asize[1]; // datatype

    var dt; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt; // find signature that matches (dt, dt)

      eq = typed.find(equalScalar, [dt, dt]); // convert 0 to the same datatype

      zero = typed.convert(0, dt); // callback

      cf = typed.find(callback, [dt, dt]);
    } // result arrays


    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = []; // workspace

    var xa = avalues && bvalues ? [] : undefined;
    var xb = avalues && bvalues ? [] : undefined; // marks indicating we have a value in x for a given column

    var wa = [];
    var wb = []; // vars

    var i, j, k, k0, k1; // loop columns

    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length; // columns mark

      var mark = j + 1; // loop A(:,j)

      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k]; // update c

        cindex.push(i); // update workspace

        wa[i] = mark; // check we need to process values

        if (xa) {
          xa[i] = avalues[k];
        }
      } // loop B(:,j)


      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k]; // check row exists in A

        if (wa[i] === mark) {
          // update record in xa @ i
          if (xa) {
            // invoke callback
            var v = cf(xa[i], bvalues[k]); // check for zero

            if (!eq(v, zero)) {
              // update workspace
              xa[i] = v;
            } else {
              // remove mark (index will be removed later)
              wa[i] = null;
            }
          }
        } else {
          // update c
          cindex.push(i); // update workspace

          wb[i] = mark; // check we need to process values

          if (xb) {
            xb[i] = bvalues[k];
          }
        }
      } // check we need to process values (non pattern matrix)


      if (xa && xb) {
        // initialize first index in j
        k = cptr[j]; // loop index in j

        while (k < cindex.length) {
          // row
          i = cindex[k]; // check workspace has value @ i

          if (wa[i] === mark) {
            // push value (Aij != 0 || (Aij != 0 && Bij != 0))
            cvalues[k] = xa[i]; // increment pointer

            k++;
          } else if (wb[i] === mark) {
            // push value (bij != 0)
            cvalues[k] = xb[i]; // increment pointer

            k++;
          } else {
            // remove index @ k
            cindex.splice(k, 1);
          }
        }
      }
    } // update cptr


    cptr[columns] = cindex.length; // return sparse matrix

    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

var name$j = 'algorithm10';
var dependencies$k = ['typed', 'DenseMatrix'];
var createAlgorithm10 = /* #__PURE__ */factory(name$j, dependencies$k, _ref => {
  var {
    typed,
    DenseMatrix
  } = _ref;
  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b).
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ???  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ???
   *          ???  b          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */

  return function algorithm10(s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype; // sparse matrix cannot be a Pattern matrix

    if (!avalues) {
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');
    } // rows & columns


    var rows = asize[0];
    var columns = asize[1]; // datatype

    var dt; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string') {
      // datatype
      dt = adt; // convert b to the same datatype

      b = typed.convert(b, dt); // callback

      cf = typed.find(callback, [dt, dt]);
    } // result arrays


    var cdata = []; // workspaces

    var x = []; // marks indicating we have a value in x for a given column

    var w = []; // loop columns

    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1; // values in j

      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k]; // update workspace

        x[r] = avalues[k];
        w[r] = mark;
      } // loop rows


      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = [];
        } // check sparse matrix has a value @ i,j


        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        } else {
          // dense matrix value @ i, j
          cdata[i][j] = b;
        }
      }
    } // return dense matrix


    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

var name$k = 'algorithm13';
var dependencies$l = ['typed'];
var createAlgorithm13 = /* #__PURE__ */factory(name$k, dependencies$l, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */

  return function algorithm13(a, b, callback) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype; // b arrays

    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype; // c arrays

    var csize = []; // validate dimensions

    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    } // validate each one of the dimension sizes


    for (var s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s]) {
        throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
      } // update dimension in c


      csize[s] = asize[s];
    } // datatype


    var dt; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt; // callback

      cf = typed.find(callback, [dt, dt]);
    } // populate cdata, iterate through dimensions


    var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : []; // c matrix

    return a.createDenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });
  }; // recursive function

  function _iterate(f, level, s, n, av, bv) {
    // initialize array for this level
    var cv = []; // check we reach the last level

    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = f(av[i], bv[i]);
      }
    } else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
      }
    }

    return cv;
  }
});

var name$l = 'algorithm03';
var dependencies$m = ['typed'];
var createAlgorithm03 = /* #__PURE__ */factory(name$l, dependencies$m, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Iterates over SparseMatrix items and invokes the callback function f(Dij, Sij).
   * Callback function invoked M*N times.
   *
   *
   *          ???  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ???
   *          ???  f(Dij, 0)    ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (C)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */

  return function algorithm03(denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype; // sparse matrix arrays

    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype; // validate dimensions

    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    } // check rows & columns


    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    } // sparse matrix cannot be a Pattern matrix


    if (!bvalues) {
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');
    } // rows & columns


    var rows = asize[0];
    var columns = asize[1]; // datatype

    var dt; // zero value

    var zero = 0; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt; // convert 0 to the same datatype

      zero = typed.convert(0, dt); // callback

      cf = typed.find(callback, [dt, dt]);
    } // result (DenseMatrix)


    var cdata = []; // initialize dense matrix

    for (var z = 0; z < rows; z++) {
      // initialize row
      cdata[z] = [];
    } // workspace


    var x = []; // marks indicating we have a value in x for a given column

    var w = []; // loop columns in b

    for (var j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1; // values in column j

      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k]; // update workspace

        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      } // process workspace


      for (var y = 0; y < rows; y++) {
        // check we have a calculated value for current row
        if (w[y] === mark) {
          // use calculated value
          cdata[y][j] = x[y];
        } else {
          // calculate value
          cdata[y][j] = inverse ? cf(zero, adata[y][j]) : cf(adata[y][j], zero);
        }
      }
    } // return dense matrix


    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

var name$m = 'algorithm05';
var dependencies$n = ['typed', 'equalScalar'];
var createAlgorithm05 = /* #__PURE__ */factory(name$m, dependencies$n, _ref => {
  var {
    typed,
    equalScalar
  } = _ref;
  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij).
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ???  f(Aij, Bij)  ; A(i,j) !== 0 || B(i,j) !== 0
   * C(i,j) = ???
   *          ???  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */

  return function algorithm05(a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype; // sparse matrix arrays

    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype; // validate dimensions

    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    } // check rows & columns


    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    } // rows & columns


    var rows = asize[0];
    var columns = asize[1]; // datatype

    var dt; // equal signature to use

    var eq = equalScalar; // zero value

    var zero = 0; // callback signature to use

    var cf = callback; // process data types

    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt; // find signature that matches (dt, dt)

      eq = typed.find(equalScalar, [dt, dt]); // convert 0 to the same datatype

      zero = typed.convert(0, dt); // callback

      cf = typed.find(callback, [dt, dt]);
    } // result arrays


    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = []; // workspaces

    var xa = cvalues ? [] : undefined;
    var xb = cvalues ? [] : undefined; // marks indicating we have a value in x for a given column

    var wa = [];
    var wb = []; // vars

    var i, j, k, k1; // loop columns

    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length; // columns mark

      var mark = j + 1; // loop values A(:,j)

      for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
        // row
        i = aindex[k]; // push index

        cindex.push(i); // update workspace

        wa[i] = mark; // check we need to process values

        if (xa) {
          xa[i] = avalues[k];
        }
      } // loop values B(:,j)


      for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
        // row
        i = bindex[k]; // check row existed in A

        if (wa[i] !== mark) {
          // push index
          cindex.push(i);
        } // update workspace


        wb[i] = mark; // check we need to process values

        if (xb) {
          xb[i] = bvalues[k];
        }
      } // check we need to process values (non pattern matrix)


      if (cvalues) {
        // initialize first index in j
        k = cptr[j]; // loop index in j

        while (k < cindex.length) {
          // row
          i = cindex[k]; // marks

          var wai = wa[i];
          var wbi = wb[i]; // check Aij or Bij are nonzero

          if (wai === mark || wbi === mark) {
            // matrix values @ i,j
            var va = wai === mark ? xa[i] : zero;
            var vb = wbi === mark ? xb[i] : zero; // Cij

            var vc = cf(va, vb); // check for zero

            if (!eq(vc, zero)) {
              // push value
              cvalues.push(vc); // increment pointer

              k++;
            } else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1);
            }
          }
        }
      }
    } // update cptr


    cptr[columns] = cindex.length; // return sparse matrix

    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

var name$n = 'multiplyScalar';
var dependencies$o = ['typed'];
var createMultiplyScalar = /* #__PURE__ */factory(name$n, dependencies$o, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Multiply two scalar values, `x * y`.
   * This function is meant for internal use: it is used by the public function
   * `multiply`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit}     Multiplication of `x` and `y`
   * @private
   */

  return typed('multiplyScalar', {
    'number, number': multiplyNumber,
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.mul(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.times(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.mul(y);
    },
    'number | Fraction | BigNumber | Complex, Unit': function numberFractionBigNumberComplexUnit(x, y) {
      var res = y.clone();
      res.value = res.value === null ? res._normalize(x) : this(res.value, x);
      return res;
    },
    'Unit, number | Fraction | BigNumber | Complex': function UnitNumberFractionBigNumberComplex(x, y) {
      var res = x.clone();
      res.value = res.value === null ? res._normalize(y) : this(res.value, y);
      return res;
    },
    'Unit, Unit': function UnitUnit(x, y) {
      return x.multiply(y);
    }
  });
});

var name$o = 'multiply';
var dependencies$p = ['typed', 'matrix', 'addScalar', 'multiplyScalar', 'equalScalar', 'dot'];
var createMultiply = /* #__PURE__ */factory(name$o, dependencies$p, _ref => {
  var {
    typed,
    matrix,
    addScalar,
    multiplyScalar,
    equalScalar,
    dot
  } = _ref;
  var algorithm11 = createAlgorithm11({
    typed,
    equalScalar
  });
  var algorithm14 = createAlgorithm14({
    typed
  });

  function _validateMatrixDimensions(size1, size2) {
    // check left operand dimensions
    switch (size1.length) {
      case 1:
        // check size2
        switch (size2.length) {
          case 1:
            // Vector x Vector
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length');
            }

            break;

          case 2:
            // Vector x Matrix
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vector length (' + size1[0] + ') must match Matrix rows (' + size2[0] + ')');
            }

            break;

          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }

        break;

      case 2:
        // check size2
        switch (size2.length) {
          case 1:
            // Matrix x Vector
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix columns (' + size1[1] + ') must match Vector length (' + size2[0] + ')');
            }

            break;

          case 2:
            // Matrix x Matrix
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix A columns (' + size1[1] + ') must match Matrix B rows (' + size2[0] + ')');
            }

            break;

          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }

        break;

      default:
        throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix A has ' + size1.length + ' dimensions)');
    }
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (N)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {number}             Scalar value
   */


  function _multiplyVectorVector(a, b, n) {
    // check empty vector
    if (n === 0) {
      throw new Error('Cannot multiply two empty vectors');
    }

    return dot(a, b);
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Matrix         (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */


  function _multiplyVectorMatrix(a, b) {
    // process storage
    if (b.storage() !== 'dense') {
      throw new Error('Support for SparseMatrix not implemented');
    }

    return _multiplyVectorDenseMatrix(a, b);
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Dense Matrix   (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */


  function _multiplyVectorDenseMatrix(a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype; // b dense

    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype; // rows & columns

    var alength = asize[0];
    var bcolumns = bsize[1]; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    } // result


    var c = []; // loop matrix columns

    for (var j = 0; j < bcolumns; j++) {
      // sum (do not initialize it with zero)
      var sum = mf(adata[0], bdata[0][j]); // loop vector

      for (var i = 1; i < alength; i++) {
        // multiply & accumulate
        sum = af(sum, mf(adata[i], bdata[i][j]));
      }

      c[j] = sum;
    } // return matrix


    return a.createDenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: dt
    });
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {Matrix}             Dense Vector   (M)
   */


  var _multiplyMatrixVector = typed('_multiplyMatrixVector', {
    'DenseMatrix, any': _multiplyDenseMatrixVector,
    'SparseMatrix, any': _multiplySparseMatrixVector
  });
  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Matrix         (NxC)
   *
   * @return {Matrix}             Matrix         (MxC)
   */


  var _multiplyMatrixMatrix = typed('_multiplyMatrixMatrix', {
    'DenseMatrix, DenseMatrix': _multiplyDenseMatrixDenseMatrix,
    'DenseMatrix, SparseMatrix': _multiplyDenseMatrixSparseMatrix,
    'SparseMatrix, DenseMatrix': _multiplySparseMatrixDenseMatrix,
    'SparseMatrix, SparseMatrix': _multiplySparseMatrixSparseMatrix
  });
  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             Dense Vector (M)
   */


  function _multiplyDenseMatrixVector(a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype; // b dense

    var bdata = b._data;
    var bdt = b._datatype; // rows & columns

    var arows = asize[0];
    var acolumns = asize[1]; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    } // result


    var c = []; // loop matrix a rows

    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i]; // sum (do not initialize it with zero)

      var sum = mf(row[0], bdata[0]); // loop matrix a columns

      for (var j = 1; j < acolumns; j++) {
        // multiply & accumulate
        sum = af(sum, mf(row[j], bdata[j]));
      }

      c[i] = sum;
    } // return matrix


    return a.createDenseMatrix({
      data: c,
      size: [arows],
      datatype: dt
    });
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */


  function _multiplyDenseMatrixDenseMatrix(a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype; // b dense

    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype; // rows & columns

    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1]; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    } // result


    var c = []; // loop matrix a rows

    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i]; // initialize row array

      c[i] = []; // loop matrix b columns

      for (var j = 0; j < bcolumns; j++) {
        // sum (avoid initializing sum to zero)
        var sum = mf(row[0], bdata[0][j]); // loop matrix a columns

        for (var x = 1; x < acolumns; x++) {
          // multiply & accumulate
          sum = af(sum, mf(row[x], bdata[x][j]));
        }

        c[i][j] = sum;
      }
    } // return matrix


    return a.createDenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: dt
    });
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            SparseMatrix   (NxC)
   *
   * @return {Matrix}             SparseMatrix   (MxC)
   */


  function _multiplyDenseMatrixSparseMatrix(a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype; // b sparse

    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype; // validate b matrix

    if (!bvalues) {
      throw new Error('Cannot multiply Dense Matrix times Pattern only Matrix');
    } // rows & columns


    var arows = asize[0];
    var bcolumns = bsize[1]; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // equalScalar signature to use

    var eq = equalScalar; // zero value

    var zero = 0; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]); // convert 0 to the same datatype

      zero = typed.convert(0, dt);
    } // result


    var cvalues = [];
    var cindex = [];
    var cptr = []; // c matrix

    var c = b.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    }); // loop b columns

    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length; // indeces in column jb

      var kb0 = bptr[jb];
      var kb1 = bptr[jb + 1]; // do not process column jb if no data exists

      if (kb1 > kb0) {
        // last row mark processed
        var last = 0; // loop a rows

        for (var i = 0; i < arows; i++) {
          // column mark
          var mark = i + 1; // C[i, jb]

          var cij = void 0; // values in b column j

          for (var kb = kb0; kb < kb1; kb++) {
            // row
            var ib = bindex[kb]; // check value has been initialized

            if (last !== mark) {
              // first value in column jb
              cij = mf(adata[i][ib], bvalues[kb]); // update mark

              last = mark;
            } else {
              // accumulate value
              cij = af(cij, mf(adata[i][ib], bvalues[kb]));
            }
          } // check column has been processed and value != 0


          if (last === mark && !eq(cij, zero)) {
            // push row & value
            cindex.push(i);
            cvalues.push(cij);
          }
        }
      }
    } // update ptr


    cptr[bcolumns] = cindex.length; // return sparse matrix

    return c;
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             SparseMatrix    (M, 1)
   */


  function _multiplySparseMatrixVector(a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype; // validate a matrix

    if (!avalues) {
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    } // b dense


    var bdata = b._data;
    var bdt = b._datatype; // rows & columns

    var arows = a._size[0];
    var brows = b._size[0]; // result

    var cvalues = [];
    var cindex = [];
    var cptr = []; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // equalScalar signature to use

    var eq = equalScalar; // zero value

    var zero = 0; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]); // convert 0 to the same datatype

      zero = typed.convert(0, dt);
    } // workspace


    var x = []; // vector with marks indicating a value x[i] exists in a given column

    var w = []; // update ptr

    cptr[0] = 0; // rows in b

    for (var ib = 0; ib < brows; ib++) {
      // b[ib]
      var vbi = bdata[ib]; // check b[ib] != 0, avoid loops

      if (!eq(vbi, zero)) {
        // A values & index in ib column
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          // a row
          var ia = aindex[ka]; // check value exists in current j

          if (!w[ia]) {
            // ia is new entry in j
            w[ia] = true; // add i to pattern of C

            cindex.push(ia); // x(ia) = A

            x[ia] = mf(vbi, avalues[ka]);
          } else {
            // i exists in C already
            x[ia] = af(x[ia], mf(vbi, avalues[ka]));
          }
        }
      }
    } // copy values from x to column jb of c


    for (var p1 = cindex.length, p = 0; p < p1; p++) {
      // row
      var ic = cindex[p]; // copy value

      cvalues[p] = x[ic];
    } // update ptr


    cptr[1] = cindex.length; // return sparse matrix

    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: dt
    });
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix       (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */


  function _multiplySparseMatrixDenseMatrix(a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype; // validate a matrix

    if (!avalues) {
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    } // b dense


    var bdata = b._data;
    var bdt = b._datatype; // rows & columns

    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1]; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // equalScalar signature to use

    var eq = equalScalar; // zero value

    var zero = 0; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]); // convert 0 to the same datatype

      zero = typed.convert(0, dt);
    } // result


    var cvalues = [];
    var cindex = [];
    var cptr = []; // c matrix

    var c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    }); // workspace

    var x = []; // vector with marks indicating a value x[i] exists in a given column

    var w = []; // loop b columns

    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length; // mark in workspace for current column

      var mark = jb + 1; // rows in jb

      for (var ib = 0; ib < brows; ib++) {
        // b[ib, jb]
        var vbij = bdata[ib][jb]; // check b[ib, jb] != 0, avoid loops

        if (!eq(vbij, zero)) {
          // A values & index in ib column
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // a row
            var ia = aindex[ka]; // check value exists in current j

            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark; // add i to pattern of C

              cindex.push(ia); // x(ia) = A

              x[ia] = mf(vbij, avalues[ka]);
            } else {
              // i exists in C already
              x[ia] = af(x[ia], mf(vbij, avalues[ka]));
            }
          }
        }
      } // copy values from x to column jb of c


      for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        // row
        var ic = cindex[p]; // copy value

        cvalues[p] = x[ic];
      }
    } // update ptr


    cptr[bcolumns] = cindex.length; // return sparse matrix

    return c;
  }
  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            SparseMatrix      (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */


  function _multiplySparseMatrixSparseMatrix(a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype; // b sparse

    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype; // rows & columns

    var arows = a._size[0];
    var bcolumns = b._size[1]; // flag indicating both matrices (a & b) contain data

    var values = avalues && bvalues; // datatype

    var dt; // addScalar signature to use

    var af = addScalar; // multiplyScalar signature to use

    var mf = multiplyScalar; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt; // find signatures that matches (dt, dt)

      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    } // result


    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = []; // c matrix

    var c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    }); // workspace

    var x = values ? [] : undefined; // vector with marks indicating a value x[i] exists in a given column

    var w = []; // variables

    var ka, ka0, ka1, kb, kb0, kb1, ia, ib; // loop b columns

    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length; // mark in workspace for current column

      var mark = jb + 1; // B values & index in j

      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        ib = bindex[kb]; // check we need to process values

        if (values) {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka]; // check value exists in current j

            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark; // add i to pattern of C

              cindex.push(ia); // x(ia) = A

              x[ia] = mf(bvalues[kb], avalues[ka]);
            } else {
              // i exists in C already
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
            }
          }
        } else {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka]; // check value exists in current j

            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark; // add i to pattern of C

              cindex.push(ia);
            }
          }
        }
      } // check we need to process matrix values (pattern matrix)


      if (values) {
        // copy values from x to column jb of c
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          // row
          var ic = cindex[p]; // copy value

          cvalues[p] = x[ic];
        }
      }
    } // update ptr


    cptr[bcolumns] = cindex.length; // return sparse matrix

    return c;
  }
  /**
   * Multiply two or more values, `x * y`.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *    math.multiply(x, y, z, ...)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2)        // returns number 20.8
   *    math.multiply(2, 3, 4)       // returns number 24
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.multiply(a, b)          // returns Complex 5 + 14i
   *
   *    const c = [[1, 2], [4, 3]]
   *    const d = [[1, 2, 3], [3, -4, 7]]
   *    math.multiply(c, d)          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    const e = math.unit('2.1 km')
   *    math.multiply(3, e)          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide, prod, cross, dot
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to multiply
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */


  return typed(name$o, extend({
    // we extend the signatures of multiplyScalar with signatures dealing with matrices
    'Array, Array': function ArrayArray(x, y) {
      // check dimensions
      _validateMatrixDimensions(arraySize(x), arraySize(y)); // use dense matrix implementation


      var m = this(matrix(x), matrix(y)); // return array or scalar

      return isMatrix(m) ? m.valueOf() : m;
    },
    'Matrix, Matrix': function MatrixMatrix(x, y) {
      // dimensions
      var xsize = x.size();
      var ysize = y.size(); // check dimensions

      _validateMatrixDimensions(xsize, ysize); // process dimensions


      if (xsize.length === 1) {
        // process y dimensions
        if (ysize.length === 1) {
          // Vector * Vector
          return _multiplyVectorVector(x, y, xsize[0]);
        } // Vector * Matrix


        return _multiplyVectorMatrix(x, y);
      } // process y dimensions


      if (ysize.length === 1) {
        // Matrix * Vector
        return _multiplyMatrixVector(x, y);
      } // Matrix * Matrix


      return _multiplyMatrixMatrix(x, y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use Matrix * Matrix implementation
      return this(x, matrix(y));
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use Matrix * Matrix implementation
      return this(matrix(x, y.storage()), y);
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm11(x, y, multiplyScalar, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, multiplyScalar, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm11(y, x, multiplyScalar, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, multiplyScalar, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf();
    },
    'any, any': multiplyScalar,
    'any, any, ...any': function anyAnyAny(x, y, rest) {
      var result = this(x, y);

      for (var i = 0; i < rest.length; i++) {
        result = this(result, rest[i]);
      }

      return result;
    }
  }, multiplyScalar.signatures));
});

var name$p = 'subtract';
var dependencies$q = ['typed', 'matrix', 'equalScalar', 'addScalar', 'unaryMinus', 'DenseMatrix'];
var createSubtract = /* #__PURE__ */factory(name$p, dependencies$q, _ref => {
  var {
    typed,
    matrix,
    equalScalar,
    addScalar,
    unaryMinus,
    DenseMatrix
  } = _ref; // TODO: split function subtract in two: subtract and subtractScalar

  var algorithm01 = createAlgorithm01({
    typed
  });
  var algorithm03 = createAlgorithm03({
    typed
  });
  var algorithm05 = createAlgorithm05({
    typed,
    equalScalar
  });
  var algorithm10 = createAlgorithm10({
    typed,
    DenseMatrix
  });
  var algorithm13 = createAlgorithm13({
    typed
  });
  var algorithm14 = createAlgorithm14({
    typed
  });
  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */

  return typed(name$p, {
    'number, number': function numberNumber(x, y) {
      return x - y;
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.sub(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.minus(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.sub(y);
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (x.value === null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value === null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value = this(res.value, y.value);
      res.fixPrefix = false;
      return res;
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm05(x, y, this);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm03(y, x, this, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm01(x, y, this, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm13(x, y, this);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return this(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return this(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return this(x, matrix(y));
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm10(x, unaryMinus(y), addScalar);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, this);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm10(y, x, this, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, this, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, this, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, this, true).valueOf();
    }
  });
});
/**
 * Check whether matrix x and y have the same number of dimensions.
 * Throws a DimensionError when dimensions are not equal
 * @param {Matrix} x
 * @param {Matrix} y
 */

function checkEqualDimensions(x, y) {
  var xsize = x.size();
  var ysize = y.size();

  if (xsize.length !== ysize.length) {
    throw new DimensionError(xsize.length, ysize.length);
  }
}

var name$q = 'conj';
var dependencies$r = ['typed'];
var createConj = /* #__PURE__ */factory(name$q, dependencies$r, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Compute the complex conjugate of a complex value.
   * If `x = a+bi`, the complex conjugate of `x` is `a - bi`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.conj(x)
   *
   * Examples:
   *
   *    math.conj(math.complex('2 + 3i'))  // returns Complex 2 - 3i
   *    math.conj(math.complex('2 - 3i'))  // returns Complex 2 + 3i
   *    math.conj(math.complex('-5.2i'))  // returns Complex 5.2i
   *
   * See also:
   *
   *    re, im, arg, abs
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            The complex conjugate of x
   */

  return typed(name$q, {
    number: function number(x) {
      return x;
    },
    BigNumber: function BigNumber(x) {
      return x;
    },
    Complex: function Complex(x) {
      return x.conjugate();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});

var name$r = 'identity';
var dependencies$s = ['typed', 'config', 'matrix', 'BigNumber', 'DenseMatrix', 'SparseMatrix'];
var createIdentity = /* #__PURE__ */factory(name$r, dependencies$s, _ref => {
  var {
    typed,
    config,
    matrix,
    BigNumber,
    DenseMatrix,
    SparseMatrix
  } = _ref;
  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n.
   * The matrix has ones on the diagonal and zeros elsewhere.
   *
   * Syntax:
   *
   *    math.identity(n)
   *    math.identity(n, format)
   *    math.identity(m, n)
   *    math.identity(m, n, format)
   *    math.identity([m, n])
   *    math.identity([m, n], format)
   *
   * Examples:
   *
   *    math.identity(3)                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   *    math.identity(3, 2)                 // returns [[1, 0], [0, 1], [0, 0]]
   *
   *    const A = [[1, 2, 3], [4, 5, 6]]
   *    math.identity(math.size(A))         // returns [[1, 0, 0], [0, 1, 0]]
   *
   * See also:
   *
   *    diag, ones, zeros, size, range
   *
   * @param {...number | Matrix | Array} size   The size for the matrix
   * @param {string} [format]                   The Matrix storage format
   *
   * @return {Matrix | Array | number} A matrix with ones on the diagonal.
   */

  return typed(name$r, {
    '': function _() {
      return config.matrix === 'Matrix' ? matrix([]) : [];
    },
    string: function string(format) {
      return matrix(format);
    },
    'number | BigNumber': function numberBigNumber(rows) {
      return _identity(rows, rows, config.matrix === 'Matrix' ? 'dense' : undefined);
    },
    'number | BigNumber, string': function numberBigNumberString(rows, format) {
      return _identity(rows, rows, format);
    },
    'number | BigNumber, number | BigNumber': function numberBigNumberNumberBigNumber(rows, cols) {
      return _identity(rows, cols, config.matrix === 'Matrix' ? 'dense' : undefined);
    },
    'number | BigNumber, number | BigNumber, string': function numberBigNumberNumberBigNumberString(rows, cols, format) {
      return _identity(rows, cols, format);
    },
    Array: function Array(size) {
      return _identityVector(size);
    },
    'Array, string': function ArrayString(size, format) {
      return _identityVector(size, format);
    },
    Matrix: function Matrix(size) {
      return _identityVector(size.valueOf(), size.storage());
    },
    'Matrix, string': function MatrixString(size, format) {
      return _identityVector(size.valueOf(), format);
    }
  });

  function _identityVector(size, format) {
    switch (size.length) {
      case 0:
        return format ? matrix(format) : [];

      case 1:
        return _identity(size[0], size[0], format);

      case 2:
        return _identity(size[0], size[1], format);

      default:
        throw new Error('Vector containing two values expected');
    }
  }
  /**
   * Create an identity matrix
   * @param {number | BigNumber} rows
   * @param {number | BigNumber} cols
   * @param {string} [format]
   * @returns {Matrix}
   * @private
   */


  function _identity(rows, cols, format) {
    // BigNumber constructor with the right precision
    var Big = isBigNumber(rows) || isBigNumber(cols) ? BigNumber : null;
    if (isBigNumber(rows)) rows = rows.toNumber();
    if (isBigNumber(cols)) cols = cols.toNumber();

    if (!isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function identity must be positive integers');
    }

    if (!isInteger(cols) || cols < 1) {
      throw new Error('Parameters in function identity must be positive integers');
    }

    var one = Big ? new BigNumber(1) : 1;
    var defaultValue = Big ? new Big(0) : 0;
    var size = [rows, cols]; // check we need to return a matrix

    if (format) {
      // create diagonal matrix (use optimized implementation for storage format)
      if (format === 'sparse') {
        return SparseMatrix.diagonal(size, one, 0, defaultValue);
      }

      if (format === 'dense') {
        return DenseMatrix.diagonal(size, one, 0, defaultValue);
      }

      throw new TypeError("Unknown matrix type \"".concat(format, "\""));
    } // create and resize array


    var res = resize([], size, defaultValue); // fill in ones on the diagonal

    var minimum = rows < cols ? rows : cols; // fill diagonal

    for (var d = 0; d < minimum; d++) {
      res[d][d] = one;
    }

    return res;
  }
});

function noBignumber() {
  throw new Error('No "bignumber" implementation available');
}
function noFraction() {
  throw new Error('No "fraction" implementation available');
}
function noMatrix() {
  throw new Error('No "matrix" implementation available');
}

var name$s = 'size';
var dependencies$t = ['typed', 'config', '?matrix'];
var createSize = /* #__PURE__ */factory(name$s, dependencies$t, _ref => {
  var {
    typed,
    config,
    matrix
  } = _ref;
  /**
   * Calculate the size of a matrix or scalar.
   *
   * Syntax:
   *
   *     math.size(x)
   *
   * Examples:
   *
   *     math.size(2.3)                  // returns []
   *     math.size('hello world')        // returns [11]
   *
   *     const A = [[1, 2, 3], [4, 5, 6]]
   *     math.size(A)                    // returns [2, 3]
   *     math.size(math.range(1,6))      // returns [5]
   *
   * See also:
   *
   *     count, resize, squeeze, subset
   *
   * @param {boolean | number | Complex | Unit | string | Array | Matrix} x  A matrix
   * @return {Array | Matrix} A vector with size of `x`.
   */

  return typed(name$s, {
    Matrix: function Matrix(x) {
      return x.create(x.size());
    },
    Array: arraySize,
    string: function string(x) {
      return config.matrix === 'Array' ? [x.length] : matrix([x.length]);
    },
    'number | Complex | BigNumber | Unit | boolean | null': function numberComplexBigNumberUnitBooleanNull(x) {
      // scalar
      return config.matrix === 'Array' ? [] : matrix ? matrix([]) : noMatrix();
    }
  });
});

var name$t = 'format';
var dependencies$u = ['typed'];
var createFormat = /* #__PURE__ */factory(name$t, dependencies$u, _ref => {
  var {
    typed
  } = _ref;
  /**
   * Format a value of any type into a string.
   *
   * Syntax:
   *
   *    math.format(value)
   *    math.format(value, options)
   *    math.format(value, precision)
   *    math.format(value, callback)
   *
   * Where:
   *
   *  - `value: *`
   *    The value to be formatted
   *  - `options: Object`
   *    An object with formatting options. Available options:
   *    - `notation: string`
   *      Number notation. Choose from:
   *      - 'fixed'
   *        Always use regular number notation.
   *        For example '123.40' and '14000000'
   *      - 'exponential'
   *        Always use exponential notation.
   *        For example '1.234e+2' and '1.4e+7'
   *      - 'engineering'
   *        Always use engineering notation: always have exponential notation,
   *        and select the exponent to be a multiple of 3.
   *        For example '123.4e+0' and '14.0e+6'
   *      - 'auto' (default)
   *        Regular number notation for numbers having an absolute value between
   *        `lower` and `upper` bounds, and uses exponential notation elsewhere.
   *        Lower bound is included, upper bound is excluded.
   *        For example '123.4' and '1.4e7'.
   *      - 'bin', 'oct, or 'hex'
   *        Format the number using binary, octal, or hexadecimal notation.
   *        For example '0b1101' and '0x10fe'.
   *    - `wordSize: number`
   *      The word size in bits to use for formatting in binary, octal, or
   *      hexadecimal notation. To be used only with 'bin', 'oct', or 'hex'
   *      values for 'notation' option. When this option is defined the value
   *      is formatted as a signed twos complement integer of the given word
   *      size and the size suffix is appended to the output.
   *      For example format(-1, {notation: 'hex', wordSize: 8}) === '0xffi8'.
   *      Default value is undefined.
   *    - `precision: number`
   *      Limit the number of digits of the formatted value.
   *      For regular numbers, must be a number between 0 and 16.
   *      For bignumbers, the maximum depends on the configured precision,
   *      see function `config()`.
   *      In case of notations 'exponential', 'engineering', and 'auto', `precision`
   *      defines the total number of significant digits returned.
   *      In case of notation 'fixed', `precision` defines the number of
   *      significant digits after the decimal point.
   *      `precision` is undefined by default.
   *    - `lowerExp: number`
   *      Exponent determining the lower boundary for formatting a value with
   *      an exponent when `notation='auto`. Default value is `-3`.
   *    - `upperExp: number`
   *      Exponent determining the upper boundary for formatting a value with
   *      an exponent when `notation='auto`. Default value is `5`.
   *    - `fraction: string`. Available values: 'ratio' (default) or 'decimal'.
   *      For example `format(fraction(1, 3))` will output '1/3' when 'ratio' is
   *      configured, and will output `0.(3)` when 'decimal' is configured.
   *    - `truncate: number`. Specifies the maximum allowed length of the
   *      returned string. If it would have been longer, the excess characters
   *      are deleted and replaced with `'...'`.
   * - `callback: function`
   *   A custom formatting function, invoked for all numeric elements in `value`,
   *   for example all elements of a matrix, or the real and imaginary
   *   parts of a complex number. This callback can be used to override the
   *   built-in numeric notation with any type of formatting. Function `callback`
   *   is called with `value` as parameter and must return a string.
   *
   * When `value` is an Object:
   *
   * - When the object contains a property `format` being a function, this function
   *   is invoked as `value.format(options)` and the result is returned.
   * - When the object has its own `toString` method, this method is invoked
   *   and the result is returned.
   * - In other cases the function will loop over all object properties and
   *   return JSON object notation like '{"a": 2, "b": 3}'.
   *
   * When value is a function:
   *
   * - When the function has a property `syntax`, it returns this
   *   syntax description.
   * - In other cases, a string `'function'` is returned.
   *
   * Examples:
   *
   *    math.format(6.4)                                        // returns '6.4'
   *    math.format(1240000)                                    // returns '1.24e6'
   *    math.format(1/3)                                        // returns '0.3333333333333333'
   *    math.format(1/3, 3)                                     // returns '0.333'
   *    math.format(21385, 2)                                   // returns '21000'
   *    math.format(12e8, {notation: 'fixed'})                  // returns '1200000000'
   *    math.format(2.3,  {notation: 'fixed', precision: 4})    // returns '2.3000'
   *    math.format(52.8, {notation: 'exponential'})            // returns '5.28e+1'
   *    math.format(12400,{notation: 'engineering'})            // returns '12.400e+3'
   *    math.format(2000, {lowerExp: -2, upperExp: 2})          // returns '2e+3'
   *
   *    function formatCurrency(value) {
   *      // return currency notation with two digits:
   *      return '$' + value.toFixed(2)
   *
   *      // you could also use math.format inside the callback:
   *      // return '$' + math.format(value, {notation: 'fixed', precision: 2})
   *    }
   *    math.format([2.1, 3, 0.016], formatCurrency)            // returns '[$2.10, $3.00, $0.02]'
   *
   * See also:
   *
   *    print
   *
   * @param {*} value                               Value to be stringified
   * @param {Object | Function | number} [options]  Formatting options
   * @return {string} The formatted value
   */

  return typed(name$t, {
    any: format$2,
    'any, Object | function | number': format$2
  });
});

var name$u = 'numeric';
var dependencies$v = ['number', '?bignumber', '?fraction'];
var createNumeric = /* #__PURE__ */factory(name$u, dependencies$v, _ref => {
  var {
    number: _number,
    bignumber,
    fraction
  } = _ref;
  var validInputTypes = {
    string: true,
    number: true,
    BigNumber: true,
    Fraction: true
  }; // Load the conversion functions for each output type

  var validOutputTypes = {
    number: x => _number(x),
    BigNumber: bignumber ? x => bignumber(x) : noBignumber,
    Fraction: fraction ? x => fraction(x) : noFraction
  };
  /**
   * Convert a numeric input to a specific numeric type: number, BigNumber, or Fraction.
   *
   * Syntax:
   *
   *    math.numeric(x)
   *
   * Examples:
   *
   *    math.numeric('4')                           // returns number 4
   *    math.numeric('4', 'number')                 // returns number 4
   *    math.numeric('4', 'BigNumber')              // returns BigNumber 4
   *    math.numeric('4', 'Fraction')               // returns Fraction 4
   *    math.numeric(4, 'Fraction')                 // returns Fraction 4
   *    math.numeric(math.fraction(2, 5), 'number') // returns number 0.4
   *
   * See also:
   *
   *    number, fraction, bignumber, string, format
   *
   * @param {string | number | BigNumber | Fraction } value
   *              A numeric value or a string containing a numeric value
   * @param {string} outputType
   *              Desired numeric output type.
   *              Available values: 'number', 'BigNumber', or 'Fraction'
   * @return {number | BigNumber | Fraction}
   *              Returns an instance of the numeric in the requested type
   */

  return function numeric(value, outputType) {
    var inputType = typeOf(value);

    if (!(inputType in validInputTypes)) {
      throw new TypeError('Cannot convert ' + value + ' of type "' + inputType + '"; valid input types are ' + Object.keys(validInputTypes).join(', '));
    }

    if (!(outputType in validOutputTypes)) {
      throw new TypeError('Cannot convert ' + value + ' to type "' + outputType + '"; valid output types are ' + Object.keys(validOutputTypes).join(', '));
    }

    if (outputType === inputType) {
      return value;
    } else {
      return validOutputTypes[outputType](value);
    }
  };
});

var name$v = 'divideScalar';
var dependencies$w = ['typed', 'numeric'];
var createDivideScalar = /* #__PURE__ */factory(name$v, dependencies$w, _ref => {
  var {
    typed,
    numeric
  } = _ref;
  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit}     Quotient, `x / y`
   * @private
   */

  return typed(name$v, {
    'number, number': function numberNumber(x, y) {
      return x / y;
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.div(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.div(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.div(y);
    },
    'Unit, number | Fraction | BigNumber': function UnitNumberFractionBigNumber(x, y) {
      var res = x.clone(); // TODO: move the divide function to Unit.js, it uses internals of Unit

      var one = numeric(1, typeOf(y));
      res.value = this(res.value === null ? res._normalize(one) : res.value, y);
      return res;
    },
    'number | Fraction | BigNumber, Unit': function numberFractionBigNumberUnit(x, y) {
      var res = y.clone();
      res = res.pow(-1); // TODO: move the divide function to Unit.js, it uses internals of Unit

      var one = numeric(1, typeOf(x));
      res.value = this(x, y.value === null ? y._normalize(one) : y.value);
      return res;
    },
    'Unit, Unit': function UnitUnit(x, y) {
      return x.divide(y);
    }
  });
});

var name$w = 'add';
var dependencies$x = ['typed', 'matrix', 'addScalar', 'equalScalar', 'DenseMatrix', 'SparseMatrix'];
var createAdd = /* #__PURE__ */factory(name$w, dependencies$x, _ref => {
  var {
    typed,
    matrix,
    addScalar,
    equalScalar,
    DenseMatrix,
    SparseMatrix
  } = _ref;
  var algorithm01 = createAlgorithm01({
    typed
  });
  var algorithm04 = createAlgorithm04({
    typed,
    equalScalar
  });
  var algorithm10 = createAlgorithm10({
    typed,
    DenseMatrix
  });
  var algorithm13 = createAlgorithm13({
    typed
  });
  var algorithm14 = createAlgorithm14({
    typed
  });
  /**
   * Add two or more values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *    math.add(x, y, z, ...)
   *
   * Examples:
   *
   *    math.add(2, 3)               // returns number 5
   *    math.add(2, 3, 4)            // returns number 9
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(-4, 1)
   *    math.add(a, b)               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   *    const c = math.unit('5 cm')
   *    const d = math.unit('2.1 mm')
   *    math.add(c, d)               // returns Unit 52.1 mm
   *
   *    math.add("2.3", "4")         // returns number 6.3
   *
   * See also:
   *
   *    subtract, sum
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
   */

  return typed(name$w, extend({
    // we extend the signatures of addScalar with signatures dealing with matrices
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, addScalar);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm01(x, y, addScalar, false);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm01(y, x, addScalar, true);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm04(x, y, addScalar);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return this(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return this(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return this(x, matrix(y));
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, addScalar, false);
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm10(x, y, addScalar, false);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, addScalar, true);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm10(y, x, addScalar, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, addScalar, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, addScalar, true).valueOf();
    },
    'any, any': addScalar,
    'any, any, ...any': function anyAnyAny(x, y, rest) {
      var result = this(x, y);

      for (var i = 0; i < rest.length; i++) {
        result = this(result, rest[i]);
      }

      return result;
    }
  }, addScalar.signatures));
});

var name$x = 'dot';
var dependencies$y = ['typed', 'addScalar', 'multiplyScalar', 'conj', 'size'];
var createDot = /* #__PURE__ */factory(name$x, dependencies$y, _ref => {
  var {
    typed,
    addScalar,
    multiplyScalar,
    conj,
    size
  } = _ref;
  /**
   * Calculate the dot product of two vectors. The dot product of
   * `A = [a1, a2, ..., an]` and `B = [b1, b2, ..., bn]` is defined as:
   *
   *    dot(A, B) = conj(a1) * b1 + conj(a2) * b2 + ... + conj(an) * bn
   *
   * Syntax:
   *
   *    math.dot(x, y)
   *
   * Examples:
   *
   *    math.dot([2, 4, 1], [2, 2, 3])       // returns number 15
   *    math.multiply([2, 4, 1], [2, 2, 3])  // returns number 15
   *
   * See also:
   *
   *    multiply, cross
   *
   * @param  {Array | Matrix} x     First vector
   * @param  {Array | Matrix} y     Second vector
   * @return {number}               Returns the dot product of `x` and `y`
   */

  return typed(name$x, {
    'Array | DenseMatrix, Array | DenseMatrix': _denseDot,
    'SparseMatrix, SparseMatrix': _sparseDot
  });

  function _validateDim(x, y) {
    var xSize = _size(x);

    var ySize = _size(y);

    var xLen, yLen;

    if (xSize.length === 1) {
      xLen = xSize[0];
    } else if (xSize.length === 2 && xSize[1] === 1) {
      xLen = xSize[0];
    } else {
      throw new RangeError('Expected a column vector, instead got a matrix of size (' + xSize.join(', ') + ')');
    }

    if (ySize.length === 1) {
      yLen = ySize[0];
    } else if (ySize.length === 2 && ySize[1] === 1) {
      yLen = ySize[0];
    } else {
      throw new RangeError('Expected a column vector, instead got a matrix of size (' + ySize.join(', ') + ')');
    }

    if (xLen !== yLen) throw new RangeError('Vectors must have equal length (' + xLen + ' != ' + yLen + ')');
    if (xLen === 0) throw new RangeError('Cannot calculate the dot product of empty vectors');
    return xLen;
  }

  function _denseDot(a, b) {
    var N = _validateDim(a, b);

    var adata = isMatrix(a) ? a._data : a;
    var adt = isMatrix(a) ? a._datatype : undefined;
    var bdata = isMatrix(b) ? b._data : b;
    var bdt = isMatrix(b) ? b._datatype : undefined; // are these 2-dimensional column vectors? (as opposed to 1-dimensional vectors)

    var aIsColumn = _size(a).length === 2;
    var bIsColumn = _size(b).length === 2;
    var add = addScalar;
    var mul = multiplyScalar; // process data types

    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      var dt = adt; // find signatures that matches (dt, dt)

      add = typed.find(addScalar, [dt, dt]);
      mul = typed.find(multiplyScalar, [dt, dt]);
    } // both vectors 1-dimensional


    if (!aIsColumn && !bIsColumn) {
      var c = mul(conj(adata[0]), bdata[0]);

      for (var i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i]), bdata[i]));
      }

      return c;
    } // a is 1-dim, b is column


    if (!aIsColumn && bIsColumn) {
      var _c = mul(conj(adata[0]), bdata[0][0]);

      for (var _i = 1; _i < N; _i++) {
        _c = add(_c, mul(conj(adata[_i]), bdata[_i][0]));
      }

      return _c;
    } // a is column, b is 1-dim


    if (aIsColumn && !bIsColumn) {
      var _c2 = mul(conj(adata[0][0]), bdata[0]);

      for (var _i2 = 1; _i2 < N; _i2++) {
        _c2 = add(_c2, mul(conj(adata[_i2][0]), bdata[_i2]));
      }

      return _c2;
    } // both vectors are column


    if (aIsColumn && bIsColumn) {
      var _c3 = mul(conj(adata[0][0]), bdata[0][0]);

      for (var _i3 = 1; _i3 < N; _i3++) {
        _c3 = add(_c3, mul(conj(adata[_i3][0]), bdata[_i3][0]));
      }

      return _c3;
    }
  }

  function _sparseDot(x, y) {
    _validateDim(x, y);

    var xindex = x._index;
    var xvalues = x._values;
    var yindex = y._index;
    var yvalues = y._values; // TODO optimize add & mul using datatype

    var c = 0;
    var add = addScalar;
    var mul = multiplyScalar;
    var i = 0;
    var j = 0;

    while (i < xindex.length && j < yindex.length) {
      var I = xindex[i];
      var J = yindex[j];

      if (I < J) {
        i++;
        continue;
      }

      if (I > J) {
        j++;
        continue;
      }

      if (I === J) {
        c = add(c, mul(xvalues[i], yvalues[j]));
        i++;
        j++;
      }
    }

    return c;
  } // TODO remove this once #1771 is fixed


  function _size(x) {
    return isMatrix(x) ? x.size() : size(x);
  }
});

var name$y = 'det';
var dependencies$z = ['typed', 'matrix', 'subtract', 'multiply', 'divideScalar', 'isZero', 'unaryMinus'];
var createDet = /* #__PURE__ */factory(name$y, dependencies$z, _ref => {
  var {
    typed,
    matrix,
    subtract,
    multiply,
    divideScalar,
    isZero,
    unaryMinus
  } = _ref;
  /**
   * Calculate the determinant of a matrix.
   *
   * Syntax:
   *
   *    math.det(x)
   *
   * Examples:
   *
   *    math.det([[1, 2], [3, 4]]) // returns -2
   *
   *    const A = [
   *      [-2, 2, 3],
   *      [-1, 1, 3],
   *      [2, 0, -1]
   *    ]
   *    math.det(A) // returns 6
   *
   * See also:
   *
   *    inv
   *
   * @param {Array | Matrix} x  A matrix
   * @return {number} The determinant of `x`
   */

  return typed(name$y, {
    any: function any(x) {
      return clone(x);
    },
    'Array | Matrix': function det(x) {
      var size;

      if (isMatrix(x)) {
        size = x.size();
      } else if (Array.isArray(x)) {
        x = matrix(x);
        size = x.size();
      } else {
        // a scalar
        size = [];
      }

      switch (size.length) {
        case 0:
          // scalar
          return clone(x);

        case 1:
          // vector
          if (size[0] === 1) {
            return clone(x.valueOf()[0]);
          } else {
            throw new RangeError('Matrix must be square ' + '(size: ' + format$2(size) + ')');
          }

        case 2:
          {
            // two dimensional array
            var rows = size[0];
            var cols = size[1];

            if (rows === cols) {
              return _det(x.clone().valueOf(), rows);
            } else {
              throw new RangeError('Matrix must be square ' + '(size: ' + format$2(size) + ')');
            }
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' + '(size: ' + format$2(size) + ')');
      }
    }
  });
  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {number} rows     Number of rows of the matrix (zero-based)
   * @param {number} cols     Number of columns of the matrix (zero-based)
   * @returns {number} det
   * @private
   */

  function _det(matrix, rows, cols) {
    if (rows === 1) {
      // this is a 1 x 1 matrix
      return clone(matrix[0][0]);
    } else if (rows === 2) {
      // this is a 2 x 2 matrix
      // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
      return subtract(multiply(matrix[0][0], matrix[1][1]), multiply(matrix[1][0], matrix[0][1]));
    } else {
      // Bareiss algorithm
      // this algorithm have same complexity as LUP decomposition (O(n^3))
      // but it preserve precision of floating point more relative to the LUP decomposition
      var negated = false;
      var rowIndices = new Array(rows).fill(0).map((_, i) => i); // matrix index of row i

      for (var k = 0; k < rows; k++) {
        var k_ = rowIndices[k];

        if (isZero(matrix[k_][k])) {
          var _k = void 0;

          for (_k = k + 1; _k < rows; _k++) {
            if (!isZero(matrix[rowIndices[_k]][k])) {
              k_ = rowIndices[_k];
              rowIndices[_k] = rowIndices[k];
              rowIndices[k] = k_;
              negated = !negated;
              break;
            }
          }

          if (_k === rows) return matrix[k_][k]; // some zero of the type
        }

        var piv = matrix[k_][k];
        var piv_ = k === 0 ? 1 : matrix[rowIndices[k - 1]][k - 1];

        for (var i = k + 1; i < rows; i++) {
          var i_ = rowIndices[i];

          for (var j = k + 1; j < rows; j++) {
            matrix[i_][j] = divideScalar(subtract(multiply(matrix[i_][j], piv), multiply(matrix[i_][k], matrix[k_][j])), piv_);
          }
        }
      }

      var det = matrix[rowIndices[rows - 1]][rows - 1];
      return negated ? unaryMinus(det) : det;
    }
  }
});

var name$z = 'inv';
var dependencies$A = ['typed', 'matrix', 'divideScalar', 'addScalar', 'multiply', 'unaryMinus', 'det', 'identity', 'abs'];
var createInv = /* #__PURE__ */factory(name$z, dependencies$A, _ref => {
  var {
    typed,
    matrix,
    divideScalar,
    addScalar,
    multiply,
    unaryMinus,
    det,
    identity,
    abs
  } = _ref;
  /**
   * Calculate the inverse of a square matrix.
   *
   * Syntax:
   *
   *     math.inv(x)
   *
   * Examples:
   *
   *     math.inv([[1, 2], [3, 4]])  // returns [[-2, 1], [1.5, -0.5]]
   *     math.inv(4)                 // returns 0.25
   *     1 / 4                       // returns 0.25
   *
   * See also:
   *
   *     det, transpose
   *
   * @param {number | Complex | Array | Matrix} x     Matrix to be inversed
   * @return {number | Complex | Array | Matrix} The inverse of `x`.
   */

  return typed(name$z, {
    'Array | Matrix': function ArrayMatrix(x) {
      var size = isMatrix(x) ? x.size() : arraySize(x);

      switch (size.length) {
        case 1:
          // vector
          if (size[0] === 1) {
            if (isMatrix(x)) {
              return matrix([divideScalar(1, x.valueOf()[0])]);
            } else {
              return [divideScalar(1, x[0])];
            }
          } else {
            throw new RangeError('Matrix must be square ' + '(size: ' + format$2(size) + ')');
          }

        case 2:
          // two dimensional array
          {
            var rows = size[0];
            var cols = size[1];

            if (rows === cols) {
              if (isMatrix(x)) {
                return matrix(_inv(x.valueOf(), rows, cols), x.storage());
              } else {
                // return an Array
                return _inv(x, rows, cols);
              }
            } else {
              throw new RangeError('Matrix must be square ' + '(size: ' + format$2(size) + ')');
            }
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' + '(size: ' + format$2(size) + ')');
      }
    },
    any: function any(x) {
      // scalar
      return divideScalar(1, x); // FIXME: create a BigNumber one when configured for bignumbers
    }
  });
  /**
   * Calculate the inverse of a square matrix
   * @param {Array[]} mat     A square matrix
   * @param {number} rows     Number of rows
   * @param {number} cols     Number of columns, must equal rows
   * @return {Array[]} inv    Inverse matrix
   * @private
   */

  function _inv(mat, rows, cols) {
    var r, s, f, value, temp;

    if (rows === 1) {
      // this is a 1 x 1 matrix
      value = mat[0][0];

      if (value === 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }

      return [[divideScalar(1, value)]];
    } else if (rows === 2) {
      // this is a 2 x 2 matrix
      var d = det(mat);

      if (d === 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }

      return [[divideScalar(mat[1][1], d), divideScalar(unaryMinus(mat[0][1]), d)], [divideScalar(unaryMinus(mat[1][0]), d), divideScalar(mat[0][0], d)]];
    } else {
      // this is a matrix of 3 x 3 or larger
      // calculate inverse using gauss-jordan elimination
      //      https://en.wikipedia.org/wiki/Gaussian_elimination
      //      http://mathworld.wolfram.com/MatrixInverse.html
      //      http://math.uww.edu/~mcfarlat/inverse.htm
      // make a copy of the matrix (only the arrays, not of the elements)
      var A = mat.concat();

      for (r = 0; r < rows; r++) {
        A[r] = A[r].concat();
      } // create an identity matrix which in the end will contain the
      // matrix inverse


      var B = identity(rows).valueOf(); // loop over all columns, and perform row reductions

      for (var c = 0; c < cols; c++) {
        // Pivoting: Swap row c with row r, where row r contains the largest element A[r][c]
        var ABig = abs(A[c][c]);
        var rBig = c;
        r = c + 1;

        while (r < rows) {
          if (abs(A[r][c]) > ABig) {
            ABig = abs(A[r][c]);
            rBig = r;
          }

          r++;
        }

        if (ABig === 0) {
          throw Error('Cannot calculate inverse, determinant is zero');
        }

        r = rBig;

        if (r !== c) {
          temp = A[c];
          A[c] = A[r];
          A[r] = temp;
          temp = B[c];
          B[c] = B[r];
          B[r] = temp;
        } // eliminate non-zero values on the other rows at column c


        var Ac = A[c];
        var Bc = B[c];

        for (r = 0; r < rows; r++) {
          var Ar = A[r];
          var Br = B[r];

          if (r !== c) {
            // eliminate value at column c and row r
            if (Ar[c] !== 0) {
              f = divideScalar(unaryMinus(Ar[c]), Ac[c]); // add (f * row c) to row r to eliminate the value
              // at column c

              for (s = c; s < cols; s++) {
                Ar[s] = addScalar(Ar[s], multiply(f, Ac[s]));
              }

              for (s = 0; s < cols; s++) {
                Br[s] = addScalar(Br[s], multiply(f, Bc[s]));
              }
            }
          } else {
            // normalize value at Acc to 1,
            // divide each value on row r with the value at Acc
            f = Ac[c];

            for (s = c; s < cols; s++) {
              Ar[s] = divideScalar(Ar[s], f);
            }

            for (s = 0; s < cols; s++) {
              Br[s] = divideScalar(Br[s], f);
            }
          }
        }
      }

      return B;
    }
  }
});

var name$A = 'divide';
var dependencies$B = ['typed', 'matrix', 'multiply', 'equalScalar', 'divideScalar', 'inv'];
var createDivide = /* #__PURE__ */factory(name$A, dependencies$B, _ref => {
  var {
    typed,
    matrix,
    multiply,
    equalScalar,
    divideScalar,
    inv
  } = _ref;
  var algorithm11 = createAlgorithm11({
    typed,
    equalScalar
  });
  var algorithm14 = createAlgorithm14({
    typed
  });
  /**
   * Divide two values, `x / y`.
   * To divide matrices, `x` is multiplied with the inverse of `y`: `x * inv(y)`.
   *
   * Syntax:
   *
   *    math.divide(x, y)
   *
   * Examples:
   *
   *    math.divide(2, 3)            // returns number 0.6666666666666666
   *
   *    const a = math.complex(5, 14)
   *    const b = math.complex(4, 1)
   *    math.divide(a, b)            // returns Complex 2 + 3i
   *
   *    const c = [[7, -6], [13, -4]]
   *    const d = [[1, 2], [4, 3]]
   *    math.divide(c, d)            // returns Array [[-9, 4], [-11, 6]]
   *
   *    const e = math.unit('18 km')
   *    math.divide(e, 4.5)          // returns Unit 4 km
   *
   * See also:
   *
   *    multiply
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                      Quotient, `x / y`
   */

  return typed('divide', extend({
    // we extend the signatures of divideScalar with signatures dealing with matrices
    'Array | Matrix, Array | Matrix': function ArrayMatrixArrayMatrix(x, y) {
      // TODO: implement matrix right division using pseudo inverse
      // https://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // https://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // https://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return multiply(x, inv(y));
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, divideScalar, false);
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm11(x, y, divideScalar, false);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, divideScalar, false).valueOf();
    },
    'any, Array | Matrix': function anyArrayMatrix(x, y) {
      return multiply(x, inv(y));
    }
  }, divideScalar.signatures));
});

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var BigNumber = /* #__PURE__ */createBigNumberClass({
  config
});
var Complex$1 = /* #__PURE__ */createComplexClass({});
var Fraction$1 = /* #__PURE__ */createFractionClass({});
var Matrix = /* #__PURE__ */createMatrixClass({});
var DenseMatrix = /* #__PURE__ */createDenseMatrixClass({
  Matrix
});
var typed = /* #__PURE__ */createTyped({
  BigNumber,
  Complex: Complex$1,
  DenseMatrix,
  Fraction: Fraction$1
});
var abs$1 = /* #__PURE__ */createAbs({
  typed
});
var addScalar = /* #__PURE__ */createAddScalar({
  typed
});
var bignumber = /* #__PURE__ */createBignumber({
  BigNumber,
  typed
});
var conj = /* #__PURE__ */createConj({
  typed
});
var equalScalar = /* #__PURE__ */createEqualScalar({
  config,
  typed
});
var format$3 = /* #__PURE__ */createFormat({
  typed
});
var isZero = /* #__PURE__ */createIsZero({
  typed
});
var multiplyScalar = /* #__PURE__ */createMultiplyScalar({
  typed
});
var number = /* #__PURE__ */createNumber({
  typed
});
var SparseMatrix = /* #__PURE__ */createSparseMatrixClass({
  Matrix,
  equalScalar,
  typed
});
var unaryMinus = /* #__PURE__ */createUnaryMinus({
  typed
});
var fraction$1 = /* #__PURE__ */createFraction({
  Fraction: Fraction$1,
  typed
});
var matrix = /* #__PURE__ */createMatrix({
  DenseMatrix,
  Matrix,
  SparseMatrix,
  typed
});
var numeric = /* #__PURE__ */createNumeric({
  bignumber,
  fraction: fraction$1,
  number
});
var size = /* #__PURE__ */createSize({
  matrix,
  config,
  typed
});
var subtract = /* #__PURE__ */createSubtract({
  DenseMatrix,
  addScalar,
  equalScalar,
  matrix,
  typed,
  unaryMinus
});
var divideScalar = /* #__PURE__ */createDivideScalar({
  numeric,
  typed
});
var add$1 = /* #__PURE__ */createAdd({
  DenseMatrix,
  SparseMatrix,
  addScalar,
  equalScalar,
  matrix,
  typed
});
var dot = /* #__PURE__ */createDot({
  addScalar,
  conj,
  multiplyScalar,
  size,
  typed
});
var identity = /* #__PURE__ */createIdentity({
  BigNumber,
  DenseMatrix,
  SparseMatrix,
  config,
  matrix,
  typed
});
var multiply = /* #__PURE__ */createMultiply({
  addScalar,
  dot,
  equalScalar,
  matrix,
  multiplyScalar,
  typed
});
var det = /* #__PURE__ */createDet({
  divideScalar,
  isZero,
  matrix,
  multiply,
  subtract,
  typed,
  unaryMinus
});
var inv = /* #__PURE__ */createInv({
  abs: abs$1,
  addScalar,
  det,
  divideScalar,
  identity,
  matrix,
  multiply,
  typed,
  unaryMinus
});
var divide$1 = /* #__PURE__ */createDivide({
  divideScalar,
  equalScalar,
  inv,
  matrix,
  multiply,
  typed
});

const getGuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
const toTree = (data, id, pid) => {
    let result = [];
    if (!Array.isArray(data)) {
        return result;
    }
    data.forEach((item) => {
        delete item.children;
    });
    let map = {};
    data.forEach((item) => {
        map[item[id]] = item;
    });
    data.forEach((item) => {
        let parent = map[item[pid]];
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        }
        else {
            result.push(item);
        }
    });
    return result;
};
const objMerge = (source, target) => {
    Object.keys(target).forEach((item) => {
        source[item] = target[item];
    });
};
const timeout = (time) => {
    return new Promise((resolt, reject) => {
        setTimeout(() => {
            resolt(null);
        }, time);
    });
};
const numAdd = (start, end) => {
    return format$3(add$1(bignumber(start), bignumber(end)), {
        notation: "fixed",
    });
};
const numSub = (start, end) => {
    return format$3(subtract(bignumber(start), bignumber(end)), {
        notation: "fixed",
    });
};
const numMul = (start, end) => {
    return format$3(multiply(bignumber(start), bignumber(end)), {
        notation: "fixed",
    });
};
const numDiv = (start, end) => {
    return format$3(divide$1(bignumber(start), bignumber(end)), {
        notation: "fixed",
    });
};
const sumAdd = (array) => {
    const sum = array?.reduce((a, b) => {
        let c = numAdd(a, b);
        return c;
    }, 0);
    return sumAdd;
};
var utils = {
    getGuid,
    toTree,
    objMerge,
    timeout,
    calculate: {
        numAdd,
        numSub,
        numMul,
        numDiv,
        sumAdd,
    },
};

function mitt (n) {
  return {
    all: n = n || new Map(),
    on: function (t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    },
    off: function (t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    },
    emit: function (t, e) {
      var i = n.get(t);
      i && i.slice().map(function (n) {
        n(e);
      }), (i = n.get("*")) && i.slice().map(function (n) {
        n(t, e);
      });
    }
  };
}

const emitter = mitt();
emitter.resetOn = emitter.on;
const MittContext = React__default.createContext({ emitter });
const MittProvider = ({ children }) => {
    return (React__default.createElement(MittContext.Provider, { value: { emitter } }, children));
};
const useMitt = () => {
    const context = useContext(MittContext);
    const ref = useRef([]);
    useEffect(() => {
        emitter.on = (name, fn) => {
            ref.current.push({
                key: name,
                value: fn,
            });
            emitter.resetOn(name, fn);
        };
        return () => {
            ref.current.forEach((item) => {
                emitter.off(item.key, item.value);
            });
            ref.current = [];
        };
    }, []);
    return context;
};
var useMitt$1 = { MittProvider, useMitt };

const Provide = React__default.createContext({});
const Provider = (props) => {
    const { children, value } = props;
    return React__default.createElement(Provide.Provider, { value: value }, children);
};
const useInject = () => useContext(Provide);
var useProvide = { Provider, useInject };

function depsAreSame(oldDeps, deps) {
    if (oldDeps === deps)
        return true;
    for (let i = 0; i < oldDeps.length; i++) {
        if (!Object.is(oldDeps[i], deps[i]))
            return false;
    }
    return true;
}
function useCreation(factory, deps) {
    const { current } = useRef({
        deps,
        obj: undefined,
        initialized: false,
    });
    if (current.initialized === false || !depsAreSame(current.deps, deps)) {
        current.deps = deps;
        current.obj = factory();
        current.initialized = true;
    }
    return current.obj;
}

const useUpdate = () => {
    const [, setState] = useState({});
    return useCallback(() => setState({}), []);
};

const isObject$1 = (value) => value !== null && typeof value === "object";
const proxyMap = new WeakMap();
const rawMap = new WeakMap();
function observer(initialVal, cb) {
    const existingProxy = proxyMap.get(initialVal);
    if (existingProxy) {
        return existingProxy;
    }
    if (rawMap.has(initialVal)) {
        return initialVal;
    }
    const proxy = new Proxy(initialVal, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            return isObject$1(res) ? observer(res, cb) : Reflect.get(target, key);
        },
        set(target, key, val) {
            const ret = Reflect.set(target, key, val);
            cb();
            return ret;
        },
        deleteProperty(target, key) {
            const ret = Reflect.deleteProperty(target, key);
            cb();
            return ret;
        },
    });
    proxyMap.set(initialVal, proxy);
    rawMap.set(proxy, initialVal);
    return proxy;
}
function useReactive(initialState, value) {
    const update = useUpdate();
    const stateRef = useRef(initialState);
    const state = useCreation(() => {
        return observer(stateRef.current, () => {
            if (value) {
                setTimeout(() => {
                    if (Object.keys(state).some((item) => item == "value")) {
                        const newObj = state.value;
                        Object.keys(state).forEach((item) => {
                            Reflect.deleteProperty(state, item);
                        });
                        Object.keys(newObj).forEach((key) => {
                            state[key] = newObj[key];
                        });
                        update();
                    }
                    else {
                        update();
                    }
                });
            }
            else {
                update();
            }
        });
    }, []);
    return state;
}

const comparison = (oldVal, newVal) => {
    let finallyContent = true;
    try {
        const oldlist = Object.keys(oldVal);
        const newlist = Object.keys(newVal);
        if (!(oldlist.length == newlist.length)) {
            finallyContent = false;
        }
        oldlist.forEach((key) => {
            if (newlist.includes(key)) {
                const obJold = oldVal[key];
                const obJnew = newVal[key];
                if (!(typeof obJold == "object" && typeof obJnew == "object")) {
                    if (!(oldVal[key] == newVal[key])) {
                        finallyContent = false;
                    }
                }
            }
            else {
                finallyContent = false;
            }
        });
        return finallyContent;
    }
    catch (error) {
        return false;
    }
};
function useWatch(state, callBack, params = { immediate: true, deep: true }) {
    const storage = useRef([]);
    useEffect(() => {
        const oldContent = storage.current[storage.current.length - 1];
        if (params?.param) {
            const value = state[params.param];
            if (_.isEqual(value, oldContent)) {
                return;
            }
            storage.current.push(_.cloneDeep(value));
        }
        else {
            if (params?.deep) {
                if (_.isEqual(state, oldContent)) {
                    return;
                }
            }
            else {
                if (comparison(state, oldContent)) {
                    return;
                }
            }
            storage.current.push(_.cloneDeep(state));
        }
        const start = storage.current[storage.current.length - 2];
        const end = storage.current[storage.current.length - 1];
        if (!params?.immediate) {
            if (!start)
                return;
        }
        if (storage.current.length > 2) {
            storage.current.shift();
        }
        callBack(start, end);
    });
    return state;
}

var niceErrors = {
  0: "Invalid value for configuration 'enforceActions', expected 'never', 'always' or 'observed'",
  1: function _(annotationType, key) {
    return "Cannot apply '" + annotationType + "' to '" + key.toString() + "': Field not found.";
  },

  /*
  2(prop) {
      return `invalid decorator for '${prop.toString()}'`
  },
  3(prop) {
      return `Cannot decorate '${prop.toString()}': action can only be used on properties with a function value.`
  },
  4(prop) {
      return `Cannot decorate '${prop.toString()}': computed can only be used on getter properties.`
  },
  */
  5: "'keys()' can only be used on observable objects, arrays, sets and maps",
  6: "'values()' can only be used on observable objects, arrays, sets and maps",
  7: "'entries()' can only be used on observable objects, arrays and maps",
  8: "'set()' can only be used on observable objects, arrays and maps",
  9: "'remove()' can only be used on observable objects, arrays and maps",
  10: "'has()' can only be used on observable objects, arrays and maps",
  11: "'get()' can only be used on observable objects, arrays and maps",
  12: "Invalid annotation",
  13: "Dynamic observable objects cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  14: "Intercept handlers should return nothing or a change object",
  15: "Observable arrays cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  16: "Modification exception: the internal structure of an observable array was changed.",
  17: function _(index, length) {
    return "[mobx.array] Index out of bounds, " + index + " is larger than " + length;
  },
  18: "mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js",
  19: function _(other) {
    return "Cannot initialize from classes that inherit from Map: " + other.constructor.name;
  },
  20: function _(other) {
    return "Cannot initialize map from " + other;
  },
  21: function _(dataStructure) {
    return "Cannot convert to map from '" + dataStructure + "'";
  },
  22: "mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js",
  23: "It is not possible to get index atoms from arrays",
  24: function _(thing) {
    return "Cannot obtain administration from " + thing;
  },
  25: function _(property, name) {
    return "the entry '" + property + "' does not exist in the observable map '" + name + "'";
  },
  26: "please specify a property",
  27: function _(property, name) {
    return "no observable property '" + property.toString() + "' found on the observable object '" + name + "'";
  },
  28: function _(thing) {
    return "Cannot obtain atom from " + thing;
  },
  29: "Expecting some object",
  30: "invalid action stack. did you forget to finish an action?",
  31: "missing option for computed: get",
  32: function _(name, derivation) {
    return "Cycle detected in computation " + name + ": " + derivation;
  },
  33: function _(name) {
    return "The setter of computed value '" + name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?";
  },
  34: function _(name) {
    return "[ComputedValue '" + name + "'] It is not possible to assign a new value to a computed value.";
  },
  35: "There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`",
  36: "isolateGlobalState should be called before MobX is running any reactions",
  37: function _(method) {
    return "[mobx] `observableArray." + method + "()` mutates the array in-place, which is not allowed inside a derivation. Use `array.slice()." + method + "()` instead";
  },
  38: "'ownKeys()' can only be used on observable objects",
  39: "'defineProperty()' can only be used on observable objects"
};
var errors = process.env.NODE_ENV !== "production" ? niceErrors : {};

function die(error) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (process.env.NODE_ENV !== "production") {
    var e = typeof error === "string" ? error : errors[error];
    if (typeof e === "function") e = e.apply(null, args);
    throw new Error("[MobX] " + e);
  }

  throw new Error(typeof error === "number" ? "[MobX] minified error nr: " + error + (args.length ? " " + args.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + error);
}

var mockGlobal = {};

function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }

  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  if (typeof self !== "undefined") {
    return self;
  }

  return mockGlobal;
}

var assign = Object.assign;
var getDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var objectPrototype = Object.prototype;
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
var hasProxy = typeof Proxy !== "undefined";
var plainObjectString = /*#__PURE__*/Object.toString();

function assertProxies() {
  if (!hasProxy) {
    die(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
  }
}

function warnAboutProxyRequirement(msg) {
  if (process.env.NODE_ENV !== "production" && globalState.verifyProxies) {
    die("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + msg);
  }
}

function getNextId() {
  return ++globalState.mobxGuid;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */


function once(func) {
  var invoked = false;
  return function () {
    if (invoked) {
      return;
    }

    invoked = true;
    return func.apply(this, arguments);
  };
}

var noop = function noop() {};

function isFunction$1(fn) {
  return typeof fn === "function";
}

function isStringish(value) {
  var t = typeof value;

  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return true;
  }

  return false;
}

function isObject$2(value) {
  return value !== null && typeof value === "object";
}

function isPlainObject$1(value) {
  if (!isObject$2(value)) {
    return false;
  }

  var proto = Object.getPrototypeOf(value);

  if (proto == null) {
    return true;
  }

  var protoConstructor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof protoConstructor === "function" && protoConstructor.toString() === plainObjectString;
} // https://stackoverflow.com/a/37865170


function isGenerator(obj) {
  var constructor = obj == null ? void 0 : obj.constructor;

  if (!constructor) {
    return false;
  }

  if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) {
    return true;
  }

  return false;
}

function addHiddenProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value
  });
}

function addHiddenFinalProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: value
  });
}

function createInstanceofPredicate(name, theClass) {
  var propName = "isMobX" + name;
  theClass.prototype[propName] = true;
  return function (x) {
    return isObject$2(x) && x[propName] === true;
  };
}

function isES6Map(thing) {
  return thing instanceof Map;
}

function isES6Set(thing) {
  return thing instanceof Set;
}

var hasGetOwnPropertySymbols = typeof Object.getOwnPropertySymbols !== "undefined";
/**
 * Returns the following: own enumerable keys and symbols.
 */

function getPlainObjectKeys(object) {
  var keys = Object.keys(object); // Not supported in IE, so there are not going to be symbol props anyway...

  if (!hasGetOwnPropertySymbols) {
    return keys;
  }

  var symbols = Object.getOwnPropertySymbols(object);

  if (!symbols.length) {
    return keys;
  }

  return [].concat(keys, symbols.filter(function (s) {
    return objectPrototype.propertyIsEnumerable.call(object, s);
  }));
} // From Immer utils
// Returns all own keys, including non-enumerable and symbolic


var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : hasGetOwnPropertySymbols ? function (obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} :
/* istanbul ignore next */
Object.getOwnPropertyNames;

function stringifyKey(key) {
  if (typeof key === "string") {
    return key;
  }

  if (typeof key === "symbol") {
    return key.toString();
  }

  return new String(key).toString();
}

function toPrimitive(value) {
  return value === null ? null : typeof value === "object" ? "" + value : value;
}

function hasProp(target, prop) {
  return objectPrototype.hasOwnProperty.call(target, prop);
} // From Immer utils


var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(target) {
  // Polyfill needed for Hermes and IE, see https://github.com/facebook/hermes/issues/274
  var res = {}; // Note: without polyfill for ownKeys, symbols won't be picked up

  ownKeys(target).forEach(function (key) {
    res[key] = getDescriptor(target, key);
  });
  return res;
};

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var storedAnnotationsSymbol = /*#__PURE__*/Symbol("mobx-stored-annotations");
/**
 * Creates a function that acts as
 * - decorator
 * - annotation object
 */

function createDecoratorAnnotation(annotation) {
  function decorator(target, property) {
    storeAnnotation(target, property, annotation);
  }

  return Object.assign(decorator, annotation);
}
/**
 * Stores annotation to prototype,
 * so it can be inspected later by `makeObservable` called from constructor
 */


function storeAnnotation(prototype, key, annotation) {
  if (!hasProp(prototype, storedAnnotationsSymbol)) {
    addHiddenProp(prototype, storedAnnotationsSymbol, _extends$1({}, prototype[storedAnnotationsSymbol]));
  } // @override must override something


  if (process.env.NODE_ENV !== "production" && isOverride(annotation) && !hasProp(prototype[storedAnnotationsSymbol], key)) {
    var fieldName = prototype.constructor.name + ".prototype." + key.toString();
    die("'" + fieldName + "' is decorated with 'override', " + "but no such decorated member was found on prototype.");
  } // Cannot re-decorate


  assertNotDecorated(prototype, annotation, key); // Ignore override

  if (!isOverride(annotation)) {
    prototype[storedAnnotationsSymbol][key] = annotation;
  }
}

function assertNotDecorated(prototype, annotation, key) {
  if (process.env.NODE_ENV !== "production" && !isOverride(annotation) && hasProp(prototype[storedAnnotationsSymbol], key)) {
    var fieldName = prototype.constructor.name + ".prototype." + key.toString();
    var currentAnnotationType = prototype[storedAnnotationsSymbol][key].annotationType_;
    var requestedAnnotationType = annotation.annotationType_;
    die("Cannot apply '@" + requestedAnnotationType + "' to '" + fieldName + "':" + ("\nThe field is already decorated with '@" + currentAnnotationType + "'.") + "\nRe-decorating fields is not allowed." + "\nUse '@override' decorator for methods overriden by subclass.");
  }
}
/**
 * Collects annotations from prototypes and stores them on target (instance)
 */


function collectStoredAnnotations(target) {
  if (!hasProp(target, storedAnnotationsSymbol)) {
    if (process.env.NODE_ENV !== "production" && !target[storedAnnotationsSymbol]) {
      die("No annotations were passed to makeObservable, but no decorated members have been found either");
    } // We need a copy as we will remove annotation from the list once it's applied.


    addHiddenProp(target, storedAnnotationsSymbol, _extends$1({}, target[storedAnnotationsSymbol]));
  }

  return target[storedAnnotationsSymbol];
}

var $mobx = /*#__PURE__*/Symbol("mobx administration");

var Atom = /*#__PURE__*/function () {
  // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed

  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */
  function Atom(name_) {
    if (name_ === void 0) {
      name_ = process.env.NODE_ENV !== "production" ? "Atom@" + getNextId() : "Atom";
    }

    this.name_ = void 0;
    this.isPendingUnobservation_ = false;
    this.isBeingObserved_ = false;
    this.observers_ = new Set();
    this.diffValue_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.NOT_TRACKING_;
    this.onBOL = void 0;
    this.onBUOL = void 0;
    this.name_ = name_;
  } // onBecomeObservedListeners


  var _proto = Atom.prototype;

  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function (listener) {
        return listener();
      });
    }
  };

  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function (listener) {
        return listener();
      });
    }
  }
  /**
   * Invoke this method to notify mobx that your atom has been used somehow.
   * Returns true if there is currently a reactive context.
   */
  ;

  _proto.reportObserved = function reportObserved$1() {
    return reportObserved(this);
  }
  /**
   * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
   */
  ;

  _proto.reportChanged = function reportChanged() {
    startBatch();
    propagateChanged(this);
    endBatch();
  };

  _proto.toString = function toString() {
    return this.name_;
  };

  return Atom;
}();

var isAtom = /*#__PURE__*/createInstanceofPredicate("Atom", Atom);

function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
  if (onBecomeObservedHandler === void 0) {
    onBecomeObservedHandler = noop;
  }

  if (onBecomeUnobservedHandler === void 0) {
    onBecomeUnobservedHandler = noop;
  }

  var atom = new Atom(name); // default `noop` listener will not initialize the hook Set

  if (onBecomeObservedHandler !== noop) {
    onBecomeObserved(atom, onBecomeObservedHandler);
  }

  if (onBecomeUnobservedHandler !== noop) {
    onBecomeUnobserved(atom, onBecomeUnobservedHandler);
  }

  return atom;
}

function identityComparer(a, b) {
  return a === b;
}

function structuralComparer(a, b) {
  return deepEqual(a, b);
}

function shallowComparer(a, b) {
  return deepEqual(a, b, 1);
}

function defaultComparer(a, b) {
  if (Object.is) {
    return Object.is(a, b);
  }

  return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
}

var comparer = {
  identity: identityComparer,
  structural: structuralComparer,
  "default": defaultComparer,
  shallow: shallowComparer
};

function deepEnhancer(v, _, name) {
  // it is an observable already, done
  if (isObservable(v)) {
    return v;
  } // something that can be converted and mutated?


  if (Array.isArray(v)) {
    return observable.array(v, {
      name: name
    });
  }

  if (isPlainObject$1(v)) {
    return observable.object(v, undefined, {
      name: name
    });
  }

  if (isES6Map(v)) {
    return observable.map(v, {
      name: name
    });
  }

  if (isES6Set(v)) {
    return observable.set(v, {
      name: name
    });
  }

  if (typeof v === "function" && !isAction(v) && !isFlow(v)) {
    if (isGenerator(v)) {
      return flow(v);
    } else {
      return autoAction(name, v);
    }
  }

  return v;
}

function shallowEnhancer(v, _, name) {
  if (v === undefined || v === null) {
    return v;
  }

  if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v)) {
    return v;
  }

  if (Array.isArray(v)) {
    return observable.array(v, {
      name: name,
      deep: false
    });
  }

  if (isPlainObject$1(v)) {
    return observable.object(v, undefined, {
      name: name,
      deep: false
    });
  }

  if (isES6Map(v)) {
    return observable.map(v, {
      name: name,
      deep: false
    });
  }

  if (isES6Set(v)) {
    return observable.set(v, {
      name: name,
      deep: false
    });
  }

  if (process.env.NODE_ENV !== "production") {
    die("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
  }
}

function referenceEnhancer(newValue) {
  // never turn into an observable
  return newValue;
}

function refStructEnhancer(v, oldValue) {
  if (process.env.NODE_ENV !== "production" && isObservable(v)) {
    die("observable.struct should not be used with observable values");
  }

  if (deepEqual(v, oldValue)) {
    return oldValue;
  }

  return v;
}

var OVERRIDE = "override";

function isOverride(annotation) {
  return annotation.annotationType_ === OVERRIDE;
}

function createActionAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$1,
    extend_: extend_$1
  };
}

function make_$1(adm, key, descriptor, source) {
  var _this$options_; // bound


  if ((_this$options_ = this.options_) != null && _this$options_.bound) {
    return this.extend_(adm, key, descriptor, false) === null ? 0
    /* Cancel */
    : 1
    /* Break */
    ;
  } // own


  if (source === adm.target_) {
    return this.extend_(adm, key, descriptor, false) === null ? 0
    /* Cancel */
    : 2
    /* Continue */
    ;
  } // prototype


  if (isAction(descriptor.value)) {
    // A prototype could have been annotated already by other constructor,
    // rest of the proto chain must be annotated already
    return 1
    /* Break */
    ;
  }

  var actionDescriptor = createActionDescriptor(adm, this, key, descriptor, false);
  defineProperty(source, key, actionDescriptor);
  return 2
  /* Continue */
  ;
}

function extend_$1(adm, key, descriptor, proxyTrap) {
  var actionDescriptor = createActionDescriptor(adm, this, key, descriptor);
  return adm.defineProperty_(key, actionDescriptor, proxyTrap);
}

function assertActionDescriptor(adm, _ref, key, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var value = _ref2.value;

  if (process.env.NODE_ENV !== "production" && !isFunction$1(value)) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on properties with a function value."));
  }
}

function createActionDescriptor(adm, annotation, key, descriptor, // provides ability to disable safeDescriptors for prototypes
safeDescriptors) {
  var _annotation$options_, _annotation$options_$, _annotation$options_2, _annotation$options_$2, _annotation$options_3, _annotation$options_4, _adm$proxy_2;

  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }

  assertActionDescriptor(adm, annotation, key, descriptor);
  var value = descriptor.value;

  if ((_annotation$options_ = annotation.options_) != null && _annotation$options_.bound) {
    var _adm$proxy_;

    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }

  return {
    value: createAction((_annotation$options_$ = (_annotation$options_2 = annotation.options_) == null ? void 0 : _annotation$options_2.name) != null ? _annotation$options_$ : key.toString(), value, (_annotation$options_$2 = (_annotation$options_3 = annotation.options_) == null ? void 0 : _annotation$options_3.autoAction) != null ? _annotation$options_$2 : false, // https://github.com/mobxjs/mobx/discussions/3140
    (_annotation$options_4 = annotation.options_) != null && _annotation$options_4.bound ? (_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_ : undefined),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}

function createFlowAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$2,
    extend_: extend_$2
  };
}

function make_$2(adm, key, descriptor, source) {
  var _this$options_; // own


  if (source === adm.target_) {
    return this.extend_(adm, key, descriptor, false) === null ? 0
    /* Cancel */
    : 2
    /* Continue */
    ;
  } // prototype
  // bound - must annotate protos to support super.flow()


  if ((_this$options_ = this.options_) != null && _this$options_.bound && (!hasProp(adm.target_, key) || !isFlow(adm.target_[key]))) {
    if (this.extend_(adm, key, descriptor, false) === null) {
      return 0
      /* Cancel */
      ;
    }
  }

  if (isFlow(descriptor.value)) {
    // A prototype could have been annotated already by other constructor,
    // rest of the proto chain must be annotated already
    return 1
    /* Break */
    ;
  }

  var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, false, false);
  defineProperty(source, key, flowDescriptor);
  return 2
  /* Continue */
  ;
}

function extend_$2(adm, key, descriptor, proxyTrap) {
  var _this$options_2;

  var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, (_this$options_2 = this.options_) == null ? void 0 : _this$options_2.bound);
  return adm.defineProperty_(key, flowDescriptor, proxyTrap);
}

function assertFlowDescriptor(adm, _ref, key, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var value = _ref2.value;

  if (process.env.NODE_ENV !== "production" && !isFunction$1(value)) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on properties with a generator function value."));
  }
}

function createFlowDescriptor(adm, annotation, key, descriptor, bound, // provides ability to disable safeDescriptors for prototypes
safeDescriptors) {
  if (safeDescriptors === void 0) {
    safeDescriptors = globalState.safeDescriptors;
  }

  assertFlowDescriptor(adm, annotation, key, descriptor);
  var value = descriptor.value; // In case of flow.bound, the descriptor can be from already annotated prototype

  if (!isFlow(value)) {
    value = flow(value);
  }

  if (bound) {
    var _adm$proxy_; // We do not keep original function around, so we bind the existing flow


    value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_); // This is normally set by `flow`, but `bind` returns new function...

    value.isMobXFlow = true;
  }

  return {
    value: value,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: safeDescriptors ? adm.isPlainObject_ : true,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: false,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: safeDescriptors ? false : true
  };
}

function createComputedAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$3,
    extend_: extend_$3
  };
}

function make_$3(adm, key, descriptor) {
  return this.extend_(adm, key, descriptor, false) === null ? 0
  /* Cancel */
  : 1
  /* Break */
  ;
}

function extend_$3(adm, key, descriptor, proxyTrap) {
  assertComputedDescriptor(adm, this, key, descriptor);
  return adm.defineComputedProperty_(key, _extends$1({}, this.options_, {
    get: descriptor.get,
    set: descriptor.set
  }), proxyTrap);
}

function assertComputedDescriptor(adm, _ref, key, _ref2) {
  var annotationType_ = _ref.annotationType_;
  var get = _ref2.get;

  if (process.env.NODE_ENV !== "production" && !get) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' can only be used on getter(+setter) properties."));
  }
}

function createObservableAnnotation(name, options) {
  return {
    annotationType_: name,
    options_: options,
    make_: make_$4,
    extend_: extend_$4
  };
}

function make_$4(adm, key, descriptor) {
  return this.extend_(adm, key, descriptor, false) === null ? 0
  /* Cancel */
  : 1
  /* Break */
  ;
}

function extend_$4(adm, key, descriptor, proxyTrap) {
  var _this$options_$enhanc, _this$options_;

  assertObservableDescriptor(adm, this, key, descriptor);
  return adm.defineObservableProperty_(key, descriptor.value, (_this$options_$enhanc = (_this$options_ = this.options_) == null ? void 0 : _this$options_.enhancer) != null ? _this$options_$enhanc : deepEnhancer, proxyTrap);
}

function assertObservableDescriptor(adm, _ref, key, descriptor) {
  var annotationType_ = _ref.annotationType_;

  if (process.env.NODE_ENV !== "production" && !("value" in descriptor)) {
    die("Cannot apply '" + annotationType_ + "' to '" + adm.name_ + "." + key.toString() + "':" + ("\n'" + annotationType_ + "' cannot be used on getter/setter properties"));
  }
}

var AUTO = "true";
var autoAnnotation = /*#__PURE__*/createAutoAnnotation();

function createAutoAnnotation(options) {
  return {
    annotationType_: AUTO,
    options_: options,
    make_: make_$5,
    extend_: extend_$5
  };
}

function make_$5(adm, key, descriptor, source) {
  var _this$options_3, _this$options_4; // getter -> computed


  if (descriptor.get) {
    return computed.make_(adm, key, descriptor, source);
  } // lone setter -> action setter


  if (descriptor.set) {
    // TODO make action applicable to setter and delegate to action.make_
    var set = createAction(key.toString(), descriptor.set); // own

    if (source === adm.target_) {
      return adm.defineProperty_(key, {
        configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
        set: set
      }) === null ? 0
      /* Cancel */
      : 2
      /* Continue */
      ;
    } // proto


    defineProperty(source, key, {
      configurable: true,
      set: set
    });
    return 2
    /* Continue */
    ;
  } // function on proto -> autoAction/flow


  if (source !== adm.target_ && typeof descriptor.value === "function") {
    var _this$options_2;

    if (isGenerator(descriptor.value)) {
      var _this$options_;

      var flowAnnotation = (_this$options_ = this.options_) != null && _this$options_.autoBind ? flow.bound : flow;
      return flowAnnotation.make_(adm, key, descriptor, source);
    }

    var actionAnnotation = (_this$options_2 = this.options_) != null && _this$options_2.autoBind ? autoAction.bound : autoAction;
    return actionAnnotation.make_(adm, key, descriptor, source);
  } // other -> observable
  // Copy props from proto as well, see test:
  // "decorate should work with Object.create"


  var observableAnnotation = ((_this$options_3 = this.options_) == null ? void 0 : _this$options_3.deep) === false ? observable.ref : observable; // if function respect autoBind option

  if (typeof descriptor.value === "function" && (_this$options_4 = this.options_) != null && _this$options_4.autoBind) {
    var _adm$proxy_;

    descriptor.value = descriptor.value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
  }

  return observableAnnotation.make_(adm, key, descriptor, source);
}

function extend_$5(adm, key, descriptor, proxyTrap) {
  var _this$options_5, _this$options_6; // getter -> computed


  if (descriptor.get) {
    return computed.extend_(adm, key, descriptor, proxyTrap);
  } // lone setter -> action setter


  if (descriptor.set) {
    // TODO make action applicable to setter and delegate to action.extend_
    return adm.defineProperty_(key, {
      configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
      set: createAction(key.toString(), descriptor.set)
    }, proxyTrap);
  } // other -> observable
  // if function respect autoBind option


  if (typeof descriptor.value === "function" && (_this$options_5 = this.options_) != null && _this$options_5.autoBind) {
    var _adm$proxy_2;

    descriptor.value = descriptor.value.bind((_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_);
  }

  var observableAnnotation = ((_this$options_6 = this.options_) == null ? void 0 : _this$options_6.deep) === false ? observable.ref : observable;
  return observableAnnotation.extend_(adm, key, descriptor, proxyTrap);
}

var OBSERVABLE = "observable";
var OBSERVABLE_REF = "observable.ref";
var OBSERVABLE_SHALLOW = "observable.shallow";
var OBSERVABLE_STRUCT = "observable.struct"; // Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases

var defaultCreateObservableOptions = {
  deep: true,
  name: undefined,
  defaultDecorator: undefined,
  proxy: true
};
Object.freeze(defaultCreateObservableOptions);

function asCreateObservableOptions(thing) {
  return thing || defaultCreateObservableOptions;
}

var observableAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE);
var observableRefAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_REF, {
  enhancer: referenceEnhancer
});
var observableShallowAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_SHALLOW, {
  enhancer: shallowEnhancer
});
var observableStructAnnotation = /*#__PURE__*/createObservableAnnotation(OBSERVABLE_STRUCT, {
  enhancer: refStructEnhancer
});
var observableDecoratorAnnotation = /*#__PURE__*/createDecoratorAnnotation(observableAnnotation);

function getEnhancerFromOptions(options) {
  return options.deep === true ? deepEnhancer : options.deep === false ? referenceEnhancer : getEnhancerFromAnnotation(options.defaultDecorator);
}

function getAnnotationFromOptions(options) {
  var _options$defaultDecor;

  return options ? (_options$defaultDecor = options.defaultDecorator) != null ? _options$defaultDecor : createAutoAnnotation(options) : undefined;
}

function getEnhancerFromAnnotation(annotation) {
  var _annotation$options_$, _annotation$options_;

  return !annotation ? deepEnhancer : (_annotation$options_$ = (_annotation$options_ = annotation.options_) == null ? void 0 : _annotation$options_.enhancer) != null ? _annotation$options_$ : deepEnhancer;
}
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */


function createObservable(v, arg2, arg3) {
  // @observable someProp;
  if (isStringish(arg2)) {
    storeAnnotation(v, arg2, observableAnnotation);
    return;
  } // already observable - ignore


  if (isObservable(v)) {
    return v;
  } // plain object


  if (isPlainObject$1(v)) {
    return observable.object(v, arg2, arg3);
  } // Array


  if (Array.isArray(v)) {
    return observable.array(v, arg2);
  } // Map


  if (isES6Map(v)) {
    return observable.map(v, arg2);
  } // Set


  if (isES6Set(v)) {
    return observable.set(v, arg2);
  } // other object - ignore


  if (typeof v === "object" && v !== null) {
    return v;
  } // anything else


  return observable.box(v, arg2);
}

Object.assign(createObservable, observableDecoratorAnnotation);
var observableFactories = {
  box: function box(value, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
  },
  array: function array(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return (globalState.useProxies === false || o.proxy === false ? createLegacyArray : createObservableArray)(initialValues, getEnhancerFromOptions(o), o.name);
  },
  map: function map(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
  },
  set: function set(initialValues, options) {
    var o = asCreateObservableOptions(options);
    return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
  },
  object: function object(props, decorators, options) {
    return extendObservable(globalState.useProxies === false || (options == null ? void 0 : options.proxy) === false ? asObservableObject({}, options) : asDynamicObservableObject({}, options), props, decorators);
  },
  ref: /*#__PURE__*/createDecoratorAnnotation(observableRefAnnotation),
  shallow: /*#__PURE__*/createDecoratorAnnotation(observableShallowAnnotation),
  deep: observableDecoratorAnnotation,
  struct: /*#__PURE__*/createDecoratorAnnotation(observableStructAnnotation)
}; // eslint-disable-next-line

var observable = /*#__PURE__*/assign(createObservable, observableFactories);
var COMPUTED = "computed";
var COMPUTED_STRUCT = "computed.struct";
var computedAnnotation = /*#__PURE__*/createComputedAnnotation(COMPUTED);
var computedStructAnnotation = /*#__PURE__*/createComputedAnnotation(COMPUTED_STRUCT, {
  equals: comparer.structural
});
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */

var computed = function computed(arg1, arg2) {
  if (isStringish(arg2)) {
    // @computed
    return storeAnnotation(arg1, arg2, computedAnnotation);
  }

  if (isPlainObject$1(arg1)) {
    // @computed({ options })
    return createDecoratorAnnotation(createComputedAnnotation(COMPUTED, arg1));
  } // computed(expr, options?)


  if (process.env.NODE_ENV !== "production") {
    if (!isFunction$1(arg1)) {
      die("First argument to `computed` should be an expression.");
    }

    if (isFunction$1(arg2)) {
      die("A setter as second argument is no longer supported, use `{ set: fn }` option instead");
    }
  }

  var opts = isPlainObject$1(arg2) ? arg2 : {};
  opts.get = arg1;
  opts.name || (opts.name = arg1.name || "");
  /* for generated name */

  return new ComputedValue(opts);
};

Object.assign(computed, computedAnnotation);
computed.struct = /*#__PURE__*/createDecoratorAnnotation(computedStructAnnotation);

var _getDescriptor$config, _getDescriptor; // mobx versions


var currentActionId = 0;
var nextActionId = 1;
var isFunctionNameConfigurable = (_getDescriptor$config = (_getDescriptor = /*#__PURE__*/getDescriptor(function () {}, "name")) == null ? void 0 : _getDescriptor.configurable) != null ? _getDescriptor$config : false; // we can safely recycle this object

var tmpNameDescriptor = {
  value: "action",
  configurable: true,
  writable: false,
  enumerable: false
};

function createAction(actionName, fn, autoAction, ref) {
  if (autoAction === void 0) {
    autoAction = false;
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isFunction$1(fn)) {
      die("`action` can only be invoked on functions");
    }

    if (typeof actionName !== "string" || !actionName) {
      die("actions should have valid names, got: '" + actionName + "'");
    }
  }

  function res() {
    return executeAction(actionName, autoAction, fn, ref || this, arguments);
  }

  res.isMobxAction = true;

  if (isFunctionNameConfigurable) {
    tmpNameDescriptor.value = actionName;
    Object.defineProperty(res, "name", tmpNameDescriptor);
  }

  return res;
}

function executeAction(actionName, canRunAsDerivation, fn, scope, args) {
  var runInfo = _startAction(actionName, canRunAsDerivation, scope, args);

  try {
    return fn.apply(scope, args);
  } catch (err) {
    runInfo.error_ = err;
    throw err;
  } finally {
    _endAction(runInfo);
  }
}

function _startAction(actionName, canRunAsDerivation, // true for autoAction
scope, args) {
  var notifySpy_ = process.env.NODE_ENV !== "production" && isSpyEnabled() && !!actionName;
  var startTime_ = 0;

  if (process.env.NODE_ENV !== "production" && notifySpy_) {
    startTime_ = Date.now();
    var flattenedArgs = args ? Array.from(args) : EMPTY_ARRAY;
    spyReportStart({
      type: ACTION,
      name: actionName,
      object: scope,
      arguments: flattenedArgs
    });
  }

  var prevDerivation_ = globalState.trackingDerivation;
  var runAsAction = !canRunAsDerivation || !prevDerivation_;
  startBatch();
  var prevAllowStateChanges_ = globalState.allowStateChanges; // by default preserve previous allow

  if (runAsAction) {
    untrackedStart();
    prevAllowStateChanges_ = allowStateChangesStart(true);
  }

  var prevAllowStateReads_ = allowStateReadsStart(true);
  var runInfo = {
    runAsAction_: runAsAction,
    prevDerivation_: prevDerivation_,
    prevAllowStateChanges_: prevAllowStateChanges_,
    prevAllowStateReads_: prevAllowStateReads_,
    notifySpy_: notifySpy_,
    startTime_: startTime_,
    actionId_: nextActionId++,
    parentActionId_: currentActionId
  };
  currentActionId = runInfo.actionId_;
  return runInfo;
}

function _endAction(runInfo) {
  if (currentActionId !== runInfo.actionId_) {
    die(30);
  }

  currentActionId = runInfo.parentActionId_;

  if (runInfo.error_ !== undefined) {
    globalState.suppressReactionErrors = true;
  }

  allowStateChangesEnd(runInfo.prevAllowStateChanges_);
  allowStateReadsEnd(runInfo.prevAllowStateReads_);
  endBatch();

  if (runInfo.runAsAction_) {
    untrackedEnd(runInfo.prevDerivation_);
  }

  if (process.env.NODE_ENV !== "production" && runInfo.notifySpy_) {
    spyReportEnd({
      time: Date.now() - runInfo.startTime_
    });
  }

  globalState.suppressReactionErrors = false;
}

function allowStateChanges(allowStateChanges, func) {
  var prev = allowStateChangesStart(allowStateChanges);

  try {
    return func();
  } finally {
    allowStateChangesEnd(prev);
  }
}

function allowStateChangesStart(allowStateChanges) {
  var prev = globalState.allowStateChanges;
  globalState.allowStateChanges = allowStateChanges;
  return prev;
}

function allowStateChangesEnd(prev) {
  globalState.allowStateChanges = prev;
}

var _Symbol$toPrimitive;

var CREATE = "create";
_Symbol$toPrimitive = Symbol.toPrimitive;

var ObservableValue = /*#__PURE__*/function (_Atom) {
  _inheritsLoose(ObservableValue, _Atom);

  function ObservableValue(value, enhancer, name_, notifySpy, equals) {
    var _this;

    if (name_ === void 0) {
      name_ = process.env.NODE_ENV !== "production" ? "ObservableValue@" + getNextId() : "ObservableValue";
    }

    if (notifySpy === void 0) {
      notifySpy = true;
    }

    if (equals === void 0) {
      equals = comparer["default"];
    }

    _this = _Atom.call(this, name_) || this;
    _this.enhancer = void 0;
    _this.name_ = void 0;
    _this.equals = void 0;
    _this.hasUnreportedChange_ = false;
    _this.interceptors_ = void 0;
    _this.changeListeners_ = void 0;
    _this.value_ = void 0;
    _this.dehancer = void 0;
    _this.enhancer = enhancer;
    _this.name_ = name_;
    _this.equals = equals;
    _this.value_ = enhancer(value, undefined, name_);

    if (process.env.NODE_ENV !== "production" && notifySpy && isSpyEnabled()) {
      // only notify spy if this is a stand-alone observable
      spyReport({
        type: CREATE,
        object: _assertThisInitialized(_this),
        observableKind: "value",
        debugObjectName: _this.name_,
        newValue: "" + _this.value_
      });
    }

    return _this;
  }

  var _proto = ObservableValue.prototype;

  _proto.dehanceValue = function dehanceValue(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.set = function set(newValue) {
    var oldValue = this.value_;
    newValue = this.prepareNewValue_(newValue);

    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportStart({
          type: UPDATE,
          object: this,
          observableKind: "value",
          debugObjectName: this.name_,
          newValue: newValue,
          oldValue: oldValue
        });
      }

      this.setNewValue_(newValue);

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportEnd();
      }
    }
  };

  _proto.prepareNewValue_ = function prepareNewValue_(newValue) {
    checkIfStateModificationsAreAllowed(this);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this,
        type: UPDATE,
        newValue: newValue
      });

      if (!change) {
        return globalState.UNCHANGED;
      }

      newValue = change.newValue;
    } // apply modifier


    newValue = this.enhancer(newValue, this.value_, this.name_);
    return this.equals(this.value_, newValue) ? globalState.UNCHANGED : newValue;
  };

  _proto.setNewValue_ = function setNewValue_(newValue) {
    var oldValue = this.value_;
    this.value_ = newValue;
    this.reportChanged();

    if (hasListeners(this)) {
      notifyListeners(this, {
        type: UPDATE,
        object: this,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };

  _proto.get = function get() {
    this.reportObserved();
    return this.dehanceValue(this.value_);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately) {
      listener({
        observableKind: "value",
        debugObjectName: this.name_,
        object: this,
        type: UPDATE,
        newValue: this.value_,
        oldValue: undefined
      });
    }

    return registerListener(this, listener);
  };

  _proto.raw = function raw() {
    // used by MST ot get undehanced value
    return this.value_;
  };

  _proto.toJSON = function toJSON() {
    return this.get();
  };

  _proto.toString = function toString() {
    return this.name_ + "[" + this.value_ + "]";
  };

  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };

  _proto[_Symbol$toPrimitive] = function () {
    return this.valueOf();
  };

  return ObservableValue;
}(Atom);

var _Symbol$toPrimitive$1;
/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */


_Symbol$toPrimitive$1 = Symbol.toPrimitive;

var ComputedValue = /*#__PURE__*/function () {
  // nodes we are looking at. Our value depends on these nodes
  // during tracking it's an array with new observed observers
  // to check for cycles
  // N.B: unminified as it is used by MST

  /**
   * Create a new computed value based on a function expression.
   *
   * The `name` property is for debug purposes only.
   *
   * The `equals` property specifies the comparer function to use to determine if a newly produced
   * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
   * compares based on identity comparison (===), and `structuralComparer` deeply compares the structure.
   * Structural comparison can be convenient if you always produce a new aggregated object and
   * don't want to notify observers if it is structurally the same.
   * This is useful for working with vectors, mouse coordinates etc.
   */
  function ComputedValue(options) {
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.observing_ = [];
    this.newObserving_ = null;
    this.isBeingObserved_ = false;
    this.isPendingUnobservation_ = false;
    this.observers_ = new Set();
    this.diffValue_ = 0;
    this.runId_ = 0;
    this.lastAccessedBy_ = 0;
    this.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    this.unboundDepsCount_ = 0;
    this.value_ = new CaughtException(null);
    this.name_ = void 0;
    this.triggeredBy_ = void 0;
    this.isComputing_ = false;
    this.isRunningSetter_ = false;
    this.derivation = void 0;
    this.setter_ = void 0;
    this.isTracing_ = TraceMode.NONE;
    this.scope_ = void 0;
    this.equals_ = void 0;
    this.requiresReaction_ = void 0;
    this.keepAlive_ = void 0;
    this.onBOL = void 0;
    this.onBUOL = void 0;

    if (!options.get) {
      die(31);
    }

    this.derivation = options.get;
    this.name_ = options.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + getNextId() : "ComputedValue");

    if (options.set) {
      this.setter_ = createAction(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", options.set);
    }

    this.equals_ = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer["default"]);
    this.scope_ = options.context;
    this.requiresReaction_ = options.requiresReaction;
    this.keepAlive_ = !!options.keepAlive;
  }

  var _proto = ComputedValue.prototype;

  _proto.onBecomeStale_ = function onBecomeStale_() {
    propagateMaybeChanged(this);
  };

  _proto.onBO = function onBO() {
    if (this.onBOL) {
      this.onBOL.forEach(function (listener) {
        return listener();
      });
    }
  };

  _proto.onBUO = function onBUO() {
    if (this.onBUOL) {
      this.onBUOL.forEach(function (listener) {
        return listener();
      });
    }
  }
  /**
   * Returns the current value of this computed value.
   * Will evaluate its computation first if needed.
   */
  ;

  _proto.get = function get() {
    if (this.isComputing_) {
      die(32, this.name_, this.derivation);
    }

    if (globalState.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_) {
      if (shouldCompute(this)) {
        this.warnAboutUntrackedRead_();
        startBatch(); // See perf test 'computed memoization'

        this.value_ = this.computeValue_(false);
        endBatch();
      }
    } else {
      reportObserved(this);

      if (shouldCompute(this)) {
        var prevTrackingContext = globalState.trackingContext;

        if (this.keepAlive_ && !prevTrackingContext) {
          globalState.trackingContext = this;
        }

        if (this.trackAndCompute()) {
          propagateChangeConfirmed(this);
        }

        globalState.trackingContext = prevTrackingContext;
      }
    }

    var result = this.value_;

    if (isCaughtException(result)) {
      throw result.cause;
    }

    return result;
  };

  _proto.set = function set(value) {
    if (this.setter_) {
      if (this.isRunningSetter_) {
        die(33, this.name_);
      }

      this.isRunningSetter_ = true;

      try {
        this.setter_.call(this.scope_, value);
      } finally {
        this.isRunningSetter_ = false;
      }
    } else {
      die(34, this.name_);
    }
  };

  _proto.trackAndCompute = function trackAndCompute() {
    // N.B: unminified as it is used by MST
    var oldValue = this.value_;
    var wasSuspended =
    /* see #1208 */
    this.dependenciesState_ === IDerivationState_.NOT_TRACKING_;
    var newValue = this.computeValue_(true);
    var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals_(oldValue, newValue);

    if (changed) {
      this.value_ = newValue;

      if (process.env.NODE_ENV !== "production" && isSpyEnabled()) {
        spyReport({
          observableKind: "computed",
          debugObjectName: this.name_,
          object: this.scope_,
          type: "update",
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }

    return changed;
  };

  _proto.computeValue_ = function computeValue_(track) {
    this.isComputing_ = true; // don't allow state changes during computation

    var prev = allowStateChangesStart(false);
    var res;

    if (track) {
      res = trackDerivedFunction(this, this.derivation, this.scope_);
    } else {
      if (globalState.disableErrorBoundaries === true) {
        res = this.derivation.call(this.scope_);
      } else {
        try {
          res = this.derivation.call(this.scope_);
        } catch (e) {
          res = new CaughtException(e);
        }
      }
    }

    allowStateChangesEnd(prev);
    this.isComputing_ = false;
    return res;
  };

  _proto.suspend_ = function suspend_() {
    if (!this.keepAlive_) {
      clearObserving(this);
      this.value_ = undefined; // don't hold on to computed value!

      if (process.env.NODE_ENV !== "production" && this.isTracing_ !== TraceMode.NONE) {
        console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access.");
      }
    }
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    var _this = this;

    var firstTime = true;
    var prevValue = undefined;
    return autorun(function () {
      // TODO: why is this in a different place than the spyReport() function? in all other observables it's called in the same place
      var newValue = _this.get();

      if (!firstTime || fireImmediately) {
        var prevU = untrackedStart();
        listener({
          observableKind: "computed",
          debugObjectName: _this.name_,
          type: UPDATE,
          object: _this,
          newValue: newValue,
          oldValue: prevValue
        });
        untrackedEnd(prevU);
      }

      firstTime = false;
      prevValue = newValue;
    });
  };

  _proto.warnAboutUntrackedRead_ = function warnAboutUntrackedRead_() {
    if (!(process.env.NODE_ENV !== "production")) {
      return;
    }

    if (this.isTracing_ !== TraceMode.NONE) {
      console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }

    if (typeof this.requiresReaction_ === "boolean" ? this.requiresReaction_ : globalState.computedRequiresReaction) {
      console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute.");
    }
  };

  _proto.toString = function toString() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  };

  _proto.valueOf = function valueOf() {
    return toPrimitive(this.get());
  };

  _proto[_Symbol$toPrimitive$1] = function () {
    return this.valueOf();
  };

  return ComputedValue;
}();

var isComputedValue = /*#__PURE__*/createInstanceofPredicate("ComputedValue", ComputedValue);
var IDerivationState_;

(function (IDerivationState_) {
  // before being run or (outside batch and not being observed)
  // at this point derivation is not holding any data about dependency tree
  IDerivationState_[IDerivationState_["NOT_TRACKING_"] = -1] = "NOT_TRACKING_"; // no shallow dependency changed since last computation
  // won't recalculate derivation
  // this is what makes mobx fast

  IDerivationState_[IDerivationState_["UP_TO_DATE_"] = 0] = "UP_TO_DATE_"; // some deep dependency changed, but don't know if shallow dependency changed
  // will require to check first if UP_TO_DATE or POSSIBLY_STALE
  // currently only ComputedValue will propagate POSSIBLY_STALE
  //
  // having this state is second big optimization:
  // don't have to recompute on every dependency change, but only when it's needed

  IDerivationState_[IDerivationState_["POSSIBLY_STALE_"] = 1] = "POSSIBLY_STALE_"; // A shallow dependency has changed since last computation and the derivation
  // will need to recompute when it's needed next.

  IDerivationState_[IDerivationState_["STALE_"] = 2] = "STALE_";
})(IDerivationState_ || (IDerivationState_ = {}));

var TraceMode;

(function (TraceMode) {
  TraceMode[TraceMode["NONE"] = 0] = "NONE";
  TraceMode[TraceMode["LOG"] = 1] = "LOG";
  TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));

var CaughtException = function CaughtException(cause) {
  this.cause = void 0;
  this.cause = cause; // Empty
};

function isCaughtException(e) {
  return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */


function shouldCompute(derivation) {
  switch (derivation.dependenciesState_) {
    case IDerivationState_.UP_TO_DATE_:
      return false;

    case IDerivationState_.NOT_TRACKING_:
    case IDerivationState_.STALE_:
      return true;

    case IDerivationState_.POSSIBLY_STALE_:
      {
        // state propagation can occur outside of action/reactive context #2195
        var prevAllowStateReads = allowStateReadsStart(true);
        var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.

        var obs = derivation.observing_,
            l = obs.length;

        for (var i = 0; i < l; i++) {
          var obj = obs[i];

          if (isComputedValue(obj)) {
            if (globalState.disableErrorBoundaries) {
              obj.get();
            } else {
              try {
                obj.get();
              } catch (e) {
                // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                untrackedEnd(prevUntracked);
                allowStateReadsEnd(prevAllowStateReads);
                return true;
              }
            } // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
            // and `derivation` is an observer of `obj`
            // invariantShouldCompute(derivation)


            if (derivation.dependenciesState_ === IDerivationState_.STALE_) {
              untrackedEnd(prevUntracked);
              allowStateReadsEnd(prevAllowStateReads);
              return true;
            }
          }
        }

        changeDependenciesStateTo0(derivation);
        untrackedEnd(prevUntracked);
        allowStateReadsEnd(prevAllowStateReads);
        return false;
      }
  }
}

function checkIfStateModificationsAreAllowed(atom) {
  if (!(process.env.NODE_ENV !== "production")) {
    return;
  }

  var hasObservers = atom.observers_.size > 0; // Should not be possible to change observed state outside strict mode, except during initialization, see #563

  if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "always")) {
    console.warn("[MobX] " + (globalState.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + atom.name_);
  }
}

function checkIfStateReadsAreAllowed(observable) {
  if (process.env.NODE_ENV !== "production" && !globalState.allowStateReads && globalState.observableRequiresReaction) {
    console.warn("[mobx] Observable '" + observable.name_ + "' being read outside a reactive context.");
  }
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */


function trackDerivedFunction(derivation, f, context) {
  var prevAllowStateReads = allowStateReadsStart(true); // pre allocate array allocation + room for variation in deps
  // array will be trimmed by bindDependencies

  changeDependenciesStateTo0(derivation);
  derivation.newObserving_ = new Array(derivation.observing_.length + 100);
  derivation.unboundDepsCount_ = 0;
  derivation.runId_ = ++globalState.runId;
  var prevTracking = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  globalState.inBatch++;
  var result;

  if (globalState.disableErrorBoundaries === true) {
    result = f.call(context);
  } else {
    try {
      result = f.call(context);
    } catch (e) {
      result = new CaughtException(e);
    }
  }

  globalState.inBatch--;
  globalState.trackingDerivation = prevTracking;
  bindDependencies(derivation);
  warnAboutDerivationWithoutDependencies(derivation);
  allowStateReadsEnd(prevAllowStateReads);
  return result;
}

function warnAboutDerivationWithoutDependencies(derivation) {
  if (!(process.env.NODE_ENV !== "production")) {
    return;
  }

  if (derivation.observing_.length !== 0) {
    return;
  }

  if (typeof derivation.requiresObservable_ === "boolean" ? derivation.requiresObservable_ : globalState.reactionRequiresObservable) {
    console.warn("[mobx] Derivation '" + derivation.name_ + "' is created/updated without reading any observable value.");
  }
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */


function bindDependencies(derivation) {
  // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
  var prevObserving = derivation.observing_;
  var observing = derivation.observing_ = derivation.newObserving_;
  var lowestNewObservingDerivationState = IDerivationState_.UP_TO_DATE_; // Go through all new observables and check diffValue: (this list can contain duplicates):
  //   0: first occurrence, change to 1 and keep it
  //   1: extra occurrence, drop it

  var i0 = 0,
      l = derivation.unboundDepsCount_;

  for (var i = 0; i < l; i++) {
    var dep = observing[i];

    if (dep.diffValue_ === 0) {
      dep.diffValue_ = 1;

      if (i0 !== i) {
        observing[i0] = dep;
      }

      i0++;
    } // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
    // not hitting the condition


    if (dep.dependenciesState_ > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = dep.dependenciesState_;
    }
  }

  observing.length = i0;
  derivation.newObserving_ = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
  // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
  //   0: it's not in new observables, unobserve it
  //   1: it keeps being observed, don't want to notify it. change to 0

  l = prevObserving.length;

  while (l--) {
    var _dep = prevObserving[l];

    if (_dep.diffValue_ === 0) {
      removeObserver(_dep, derivation);
    }

    _dep.diffValue_ = 0;
  } // Go through all new observables and check diffValue: (now it should be unique)
  //   0: it was set to 0 in last loop. don't need to do anything.
  //   1: it wasn't observed, let's observe it. set back to 0


  while (i0--) {
    var _dep2 = observing[i0];

    if (_dep2.diffValue_ === 1) {
      _dep2.diffValue_ = 0;
      addObserver(_dep2, derivation);
    }
  } // Some new observed derivations may become stale during this derivation computation
  // so they have had no chance to propagate staleness (#916)


  if (lowestNewObservingDerivationState !== IDerivationState_.UP_TO_DATE_) {
    derivation.dependenciesState_ = lowestNewObservingDerivationState;
    derivation.onBecomeStale_();
  }
}

function clearObserving(derivation) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
  var obs = derivation.observing_;
  derivation.observing_ = [];
  var i = obs.length;

  while (i--) {
    removeObserver(obs[i], derivation);
  }

  derivation.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
}

function untracked(action) {
  var prev = untrackedStart();

  try {
    return action();
  } finally {
    untrackedEnd(prev);
  }
}

function untrackedStart() {
  var prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}

function untrackedEnd(prev) {
  globalState.trackingDerivation = prev;
}

function allowStateReadsStart(allowStateReads) {
  var prev = globalState.allowStateReads;
  globalState.allowStateReads = allowStateReads;
  return prev;
}

function allowStateReadsEnd(prev) {
  globalState.allowStateReads = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */


function changeDependenciesStateTo0(derivation) {
  if (derivation.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
    return;
  }

  derivation.dependenciesState_ = IDerivationState_.UP_TO_DATE_;
  var obs = derivation.observing_;
  var i = obs.length;

  while (i--) {
    obs[i].lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
  }
}

var MobXGlobals = function MobXGlobals() {
  this.version = 6;
  this.UNCHANGED = {};
  this.trackingDerivation = null;
  this.trackingContext = null;
  this.runId = 0;
  this.mobxGuid = 0;
  this.inBatch = 0;
  this.pendingUnobservations = [];
  this.pendingReactions = [];
  this.isRunningReactions = false;
  this.allowStateChanges = false;
  this.allowStateReads = true;
  this.enforceActions = true;
  this.spyListeners = [];
  this.globalReactionErrorHandlers = [];
  this.computedRequiresReaction = false;
  this.reactionRequiresObservable = false;
  this.observableRequiresReaction = false;
  this.disableErrorBoundaries = false;
  this.suppressReactionErrors = false;
  this.useProxies = true;
  this.verifyProxies = false;
  this.safeDescriptors = true;
};

var canMergeGlobalState = true;
var isolateCalled = false;

var globalState = /*#__PURE__*/function () {
  var global = /*#__PURE__*/getGlobal();

  if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals) {
    canMergeGlobalState = false;
  }

  if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version) {
    canMergeGlobalState = false;
  }

  if (!canMergeGlobalState) {
    // Because this is a IIFE we need to let isolateCalled a chance to change
    // so we run it after the event loop completed at least 1 iteration
    setTimeout(function () {
      if (!isolateCalled) {
        die(35);
      }
    }, 1);
    return new MobXGlobals();
  } else if (global.__mobxGlobals) {
    global.__mobxInstanceCount += 1;

    if (!global.__mobxGlobals.UNCHANGED) {
      global.__mobxGlobals.UNCHANGED = {};
    } // make merge backward compatible


    return global.__mobxGlobals;
  } else {
    global.__mobxInstanceCount = 1;
    return global.__mobxGlobals = /*#__PURE__*/new MobXGlobals();
  }
}();

function isolateGlobalState() {
  if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) {
    die(36);
  }

  isolateCalled = true;

  if (canMergeGlobalState) {
    var global = getGlobal();

    if (--global.__mobxInstanceCount === 0) {
      global.__mobxGlobals = undefined;
    }

    globalState = new MobXGlobals();
  }
}
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }


function addObserver(observable, node) {
  // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
  // invariantObservers(observable);
  observable.observers_.add(node);

  if (observable.lowestObserverState_ > node.dependenciesState_) {
    observable.lowestObserverState_ = node.dependenciesState_;
  } // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");

}

function removeObserver(observable, node) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
  // invariantObservers(observable);
  observable.observers_["delete"](node);

  if (observable.observers_.size === 0) {
    // deleting last observer
    queueForUnobservation(observable);
  } // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");

}

function queueForUnobservation(observable) {
  if (observable.isPendingUnobservation_ === false) {
    // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
    observable.isPendingUnobservation_ = true;
    globalState.pendingUnobservations.push(observable);
  }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */


function startBatch() {
  globalState.inBatch++;
}

function endBatch() {
  if (--globalState.inBatch === 0) {
    runReactions(); // the batch is actually about to finish, all unobserving should happen here.

    var list = globalState.pendingUnobservations;

    for (var i = 0; i < list.length; i++) {
      var observable = list[i];
      observable.isPendingUnobservation_ = false;

      if (observable.observers_.size === 0) {
        if (observable.isBeingObserved_) {
          // if this observable had reactive observers, trigger the hooks
          observable.isBeingObserved_ = false;
          observable.onBUO();
        }

        if (observable instanceof ComputedValue) {
          // computed values are automatically teared down when the last observer leaves
          // this process happens recursively, this computed might be the last observabe of another, etc..
          observable.suspend_();
        }
      }
    }

    globalState.pendingUnobservations = [];
  }
}

function reportObserved(observable) {
  checkIfStateReadsAreAllowed(observable);
  var derivation = globalState.trackingDerivation;

  if (derivation !== null) {
    /**
     * Simple optimization, give each derivation run an unique id (runId)
     * Check if last time this observable was accessed the same runId is used
     * if this is the case, the relation is already known
     */
    if (derivation.runId_ !== observable.lastAccessedBy_) {
      observable.lastAccessedBy_ = derivation.runId_; // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...

      derivation.newObserving_[derivation.unboundDepsCount_++] = observable;

      if (!observable.isBeingObserved_ && globalState.trackingContext) {
        observable.isBeingObserved_ = true;
        observable.onBO();
      }
    }

    return true;
  } else if (observable.observers_.size === 0 && globalState.inBatch > 0) {
    queueForUnobservation(observable);
  }

  return false;
} // function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }

/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes


function propagateChanged(observable) {
  // invariantLOS(observable, "changed start");
  if (observable.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }

  observable.lowestObserverState_ = IDerivationState_.STALE_; // Ideally we use for..of here, but the downcompiled version is really slow...

  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      if (process.env.NODE_ENV !== "production" && d.isTracing_ !== TraceMode.NONE) {
        logTraceInfo(d, observable);
      }

      d.onBecomeStale_();
    }

    d.dependenciesState_ = IDerivationState_.STALE_;
  }); // invariantLOS(observable, "changed end");
} // Called by ComputedValue when it recalculate and its value changed


function propagateChangeConfirmed(observable) {
  // invariantLOS(observable, "confirmed start");
  if (observable.lowestObserverState_ === IDerivationState_.STALE_) {
    return;
  }

  observable.lowestObserverState_ = IDerivationState_.STALE_;
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.POSSIBLY_STALE_) {
      d.dependenciesState_ = IDerivationState_.STALE_;

      if (process.env.NODE_ENV !== "production" && d.isTracing_ !== TraceMode.NONE) {
        logTraceInfo(d, observable);
      }
    } else if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_ // this happens during computing of `d`, just keep lowestObserverState up to date.
    ) {
      observable.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
    }
  }); // invariantLOS(observable, "confirmed end");
} // Used by computed when its dependency changed, but we don't wan't to immediately recompute.


function propagateMaybeChanged(observable) {
  // invariantLOS(observable, "maybe start");
  if (observable.lowestObserverState_ !== IDerivationState_.UP_TO_DATE_) {
    return;
  }

  observable.lowestObserverState_ = IDerivationState_.POSSIBLY_STALE_;
  observable.observers_.forEach(function (d) {
    if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
      d.dependenciesState_ = IDerivationState_.POSSIBLY_STALE_;
      d.onBecomeStale_();
    }
  }); // invariantLOS(observable, "maybe end");
}

function logTraceInfo(derivation, observable) {
  console.log("[mobx.trace] '" + derivation.name_ + "' is invalidated due to a change in: '" + observable.name_ + "'");

  if (derivation.isTracing_ === TraceMode.BREAK) {
    var lines = [];
    printDepTree(getDependencyTree(derivation), lines, 1); // prettier-ignore

    new Function("debugger;\n/*\nTracing '" + derivation.name_ + "'\n\nYou are entering this break point because derivation '" + derivation.name_ + "' is being traced and '" + observable.name_ + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
  }
}

function printDepTree(tree, lines, depth) {
  if (lines.length >= 1000) {
    lines.push("(and many more)");
    return;
  }

  lines.push("" + "\t".repeat(depth - 1) + tree.name);

  if (tree.dependencies) {
    tree.dependencies.forEach(function (child) {
      return printDepTree(child, lines, depth + 1);
    });
  }
}

var Reaction = /*#__PURE__*/function () {
  // nodes we are looking at. Our value depends on these nodes
  function Reaction(name_, onInvalidate_, errorHandler_, requiresObservable_) {
    if (name_ === void 0) {
      name_ = process.env.NODE_ENV !== "production" ? "Reaction@" + getNextId() : "Reaction";
    }

    this.name_ = void 0;
    this.onInvalidate_ = void 0;
    this.errorHandler_ = void 0;
    this.requiresObservable_ = void 0;
    this.observing_ = [];
    this.newObserving_ = [];
    this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    this.diffValue_ = 0;
    this.runId_ = 0;
    this.unboundDepsCount_ = 0;
    this.isDisposed_ = false;
    this.isScheduled_ = false;
    this.isTrackPending_ = false;
    this.isRunning_ = false;
    this.isTracing_ = TraceMode.NONE;
    this.name_ = name_;
    this.onInvalidate_ = onInvalidate_;
    this.errorHandler_ = errorHandler_;
    this.requiresObservable_ = requiresObservable_;
  }

  var _proto = Reaction.prototype;

  _proto.onBecomeStale_ = function onBecomeStale_() {
    this.schedule_();
  };

  _proto.schedule_ = function schedule_() {
    if (!this.isScheduled_) {
      this.isScheduled_ = true;
      globalState.pendingReactions.push(this);
      runReactions();
    }
  };

  _proto.isScheduled = function isScheduled() {
    return this.isScheduled_;
  }
  /**
   * internal, use schedule() if you intend to kick off a reaction
   */
  ;

  _proto.runReaction_ = function runReaction_() {
    if (!this.isDisposed_) {
      startBatch();
      this.isScheduled_ = false;
      var prev = globalState.trackingContext;
      globalState.trackingContext = this;

      if (shouldCompute(this)) {
        this.isTrackPending_ = true;

        try {
          this.onInvalidate_();

          if (process.env.NODE_ENV !== "production" && this.isTrackPending_ && isSpyEnabled()) {
            // onInvalidate didn't trigger track right away..
            spyReport({
              name: this.name_,
              type: "scheduled-reaction"
            });
          }
        } catch (e) {
          this.reportExceptionInDerivation_(e);
        }
      }

      globalState.trackingContext = prev;
      endBatch();
    }
  };

  _proto.track = function track(fn) {
    if (this.isDisposed_) {
      return; // console.warn("Reaction already disposed") // Note: Not a warning / error in mobx 4 either
    }

    startBatch();
    var notify = isSpyEnabled();
    var startTime;

    if (process.env.NODE_ENV !== "production" && notify) {
      startTime = Date.now();
      spyReportStart({
        name: this.name_,
        type: "reaction"
      });
    }

    this.isRunning_ = true;
    var prevReaction = globalState.trackingContext; // reactions could create reactions...

    globalState.trackingContext = this;
    var result = trackDerivedFunction(this, fn, undefined);
    globalState.trackingContext = prevReaction;
    this.isRunning_ = false;
    this.isTrackPending_ = false;

    if (this.isDisposed_) {
      // disposed during last run. Clean up everything that was bound after the dispose call.
      clearObserving(this);
    }

    if (isCaughtException(result)) {
      this.reportExceptionInDerivation_(result.cause);
    }

    if (process.env.NODE_ENV !== "production" && notify) {
      spyReportEnd({
        time: Date.now() - startTime
      });
    }

    endBatch();
  };

  _proto.reportExceptionInDerivation_ = function reportExceptionInDerivation_(error) {
    var _this = this;

    if (this.errorHandler_) {
      this.errorHandler_(error, this);
      return;
    }

    if (globalState.disableErrorBoundaries) {
      throw error;
    }

    var message = process.env.NODE_ENV !== "production" ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";

    if (!globalState.suppressReactionErrors) {
      console.error(message, error);
      /** If debugging brought you here, please, read the above message :-). Tnx! */
    } else if (process.env.NODE_ENV !== "production") {
      console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)");
    } // prettier-ignore


    if (process.env.NODE_ENV !== "production" && isSpyEnabled()) {
      spyReport({
        type: "error",
        name: this.name_,
        message: message,
        error: "" + error
      });
    }

    globalState.globalReactionErrorHandlers.forEach(function (f) {
      return f(error, _this);
    });
  };

  _proto.dispose = function dispose() {
    if (!this.isDisposed_) {
      this.isDisposed_ = true;

      if (!this.isRunning_) {
        // if disposed while running, clean up later. Maybe not optimal, but rare case
        startBatch();
        clearObserving(this);
        endBatch();
      }
    }
  };

  _proto.getDisposer_ = function getDisposer_() {
    var r = this.dispose.bind(this);
    r[$mobx] = this;
    return r;
  };

  _proto.toString = function toString() {
    return "Reaction[" + this.name_ + "]";
  };

  _proto.trace = function trace$1(enterBreakPoint) {
    if (enterBreakPoint === void 0) {
      enterBreakPoint = false;
    }

    trace(this, enterBreakPoint);
  };

  return Reaction;
}();
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */


var MAX_REACTION_ITERATIONS = 100;

var reactionScheduler = function reactionScheduler(f) {
  return f();
};

function runReactions() {
  // Trampolining, if runReactions are already running, new reactions will be picked up
  if (globalState.inBatch > 0 || globalState.isRunningReactions) {
    return;
  }

  reactionScheduler(runReactionsHelper);
}

function runReactionsHelper() {
  globalState.isRunningReactions = true;
  var allReactions = globalState.pendingReactions;
  var iterations = 0; // While running reactions, new reactions might be triggered.
  // Hence we work with two variables and check whether
  // we converge to no remaining reactions after a while.

  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." + (" Probably there is a cycle in the reactive function: " + allReactions[0]) : "[mobx] cycle in reaction: " + allReactions[0]);
      allReactions.splice(0); // clear reactions
    }

    var remainingReactions = allReactions.splice(0);

    for (var i = 0, l = remainingReactions.length; i < l; i++) {
      remainingReactions[i].runReaction_();
    }
  }

  globalState.isRunningReactions = false;
}

var isReaction = /*#__PURE__*/createInstanceofPredicate("Reaction", Reaction);

function setReactionScheduler(fn) {
  var baseScheduler = reactionScheduler;

  reactionScheduler = function reactionScheduler(f) {
    return fn(function () {
      return baseScheduler(f);
    });
  };
}

function isSpyEnabled() {
  return process.env.NODE_ENV !== "production" && !!globalState.spyListeners.length;
}

function spyReport(event) {
  if (!(process.env.NODE_ENV !== "production")) {
    return;
  } // dead code elimination can do the rest


  if (!globalState.spyListeners.length) {
    return;
  }

  var listeners = globalState.spyListeners;

  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](event);
  }
}

function spyReportStart(event) {
  if (!(process.env.NODE_ENV !== "production")) {
    return;
  }

  var change = _extends$1({}, event, {
    spyReportStart: true
  });

  spyReport(change);
}

var END_EVENT = {
  type: "report-end",
  spyReportEnd: true
};

function spyReportEnd(change) {
  if (!(process.env.NODE_ENV !== "production")) {
    return;
  }

  if (change) {
    spyReport(_extends$1({}, change, {
      type: "report-end",
      spyReportEnd: true
    }));
  } else {
    spyReport(END_EVENT);
  }
}

function spy(listener) {
  if (!(process.env.NODE_ENV !== "production")) {
    console.warn("[mobx.spy] Is a no-op in production builds");
    return function () {};
  } else {
    globalState.spyListeners.push(listener);
    return once(function () {
      globalState.spyListeners = globalState.spyListeners.filter(function (l) {
        return l !== listener;
      });
    });
  }
}

var ACTION = "action";
var ACTION_BOUND = "action.bound";
var AUTOACTION = "autoAction";
var AUTOACTION_BOUND = "autoAction.bound";
var DEFAULT_ACTION_NAME = "<unnamed action>";
var actionAnnotation = /*#__PURE__*/createActionAnnotation(ACTION);
var actionBoundAnnotation = /*#__PURE__*/createActionAnnotation(ACTION_BOUND, {
  bound: true
});
var autoActionAnnotation = /*#__PURE__*/createActionAnnotation(AUTOACTION, {
  autoAction: true
});
var autoActionBoundAnnotation = /*#__PURE__*/createActionAnnotation(AUTOACTION_BOUND, {
  autoAction: true,
  bound: true
});

function createActionFactory(autoAction) {
  var res = function action(arg1, arg2) {
    // action(fn() {})
    if (isFunction$1(arg1)) {
      return createAction(arg1.name || DEFAULT_ACTION_NAME, arg1, autoAction);
    } // action("name", fn() {})


    if (isFunction$1(arg2)) {
      return createAction(arg1, arg2, autoAction);
    } // @action


    if (isStringish(arg2)) {
      return storeAnnotation(arg1, arg2, autoAction ? autoActionAnnotation : actionAnnotation);
    } // action("name") & @action("name")


    if (isStringish(arg1)) {
      return createDecoratorAnnotation(createActionAnnotation(autoAction ? AUTOACTION : ACTION, {
        name: arg1,
        autoAction: autoAction
      }));
    }

    if (process.env.NODE_ENV !== "production") {
      die("Invalid arguments for `action`");
    }
  };

  return res;
}

var action = /*#__PURE__*/createActionFactory(false);
Object.assign(action, actionAnnotation);
var autoAction = /*#__PURE__*/createActionFactory(true);
Object.assign(autoAction, autoActionAnnotation);
action.bound = /*#__PURE__*/createDecoratorAnnotation(actionBoundAnnotation);
autoAction.bound = /*#__PURE__*/createDecoratorAnnotation(autoActionBoundAnnotation);

function isAction(thing) {
  return isFunction$1(thing) && thing.isMobxAction === true;
}
/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */


function autorun(view, opts) {
  var _opts$name, _opts;

  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isFunction$1(view)) {
      die("Autorun expects a function as first argument");
    }

    if (isAction(view)) {
      die("Autorun does not accept actions since actions are untrackable");
    }
  }

  var name = (_opts$name = (_opts = opts) == null ? void 0 : _opts.name) != null ? _opts$name : process.env.NODE_ENV !== "production" ? view.name || "Autorun@" + getNextId() : "Autorun";
  var runSync = !opts.scheduler && !opts.delay;
  var reaction;

  if (runSync) {
    // normal autorun
    reaction = new Reaction(name, function () {
      this.track(reactionRunner);
    }, opts.onError, opts.requiresObservable);
  } else {
    var scheduler = createSchedulerFromOptions(opts); // debounced autorun

    var isScheduled = false;
    reaction = new Reaction(name, function () {
      if (!isScheduled) {
        isScheduled = true;
        scheduler(function () {
          isScheduled = false;

          if (!reaction.isDisposed_) {
            reaction.track(reactionRunner);
          }
        });
      }
    }, opts.onError, opts.requiresObservable);
  }

  function reactionRunner() {
    view(reaction);
  }

  reaction.schedule_();
  return reaction.getDisposer_();
}

var run = function run(f) {
  return f();
};

function createSchedulerFromOptions(opts) {
  return opts.scheduler ? opts.scheduler : opts.delay ? function (f) {
    return setTimeout(f, opts.delay);
  } : run;
}

var ON_BECOME_OBSERVED = "onBO";
var ON_BECOME_UNOBSERVED = "onBUO";

function onBecomeObserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_OBSERVED, thing, arg2, arg3);
}

function onBecomeUnobserved(thing, arg2, arg3) {
  return interceptHook(ON_BECOME_UNOBSERVED, thing, arg2, arg3);
}

function interceptHook(hook, thing, arg2, arg3) {
  var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
  var cb = isFunction$1(arg3) ? arg3 : arg2;
  var listenersKey = hook + "L";

  if (atom[listenersKey]) {
    atom[listenersKey].add(cb);
  } else {
    atom[listenersKey] = new Set([cb]);
  }

  return function () {
    var hookListeners = atom[listenersKey];

    if (hookListeners) {
      hookListeners["delete"](cb);

      if (hookListeners.size === 0) {
        delete atom[listenersKey];
      }
    }
  };
}

var NEVER = "never";
var ALWAYS = "always";
var OBSERVED = "observed"; // const IF_AVAILABLE = "ifavailable"

function configure(options) {
  if (options.isolateGlobalState === true) {
    isolateGlobalState();
  }

  var useProxies = options.useProxies,
      enforceActions = options.enforceActions;

  if (useProxies !== undefined) {
    globalState.useProxies = useProxies === ALWAYS ? true : useProxies === NEVER ? false : typeof Proxy !== "undefined";
  }

  if (useProxies === "ifavailable") {
    globalState.verifyProxies = true;
  }

  if (enforceActions !== undefined) {
    var ea = enforceActions === ALWAYS ? ALWAYS : enforceActions === OBSERVED;
    globalState.enforceActions = ea;
    globalState.allowStateChanges = ea === true || ea === ALWAYS ? false : true;
  }

  ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function (key) {
    if (key in options) {
      globalState[key] = !!options[key];
    }
  });
  globalState.allowStateReads = !globalState.observableRequiresReaction;

  if (process.env.NODE_ENV !== "production" && globalState.disableErrorBoundaries === true) {
    console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
  }

  if (options.reactionScheduler) {
    setReactionScheduler(options.reactionScheduler);
  }
}

function extendObservable(target, properties, annotations, options) {
  if (process.env.NODE_ENV !== "production") {
    if (arguments.length > 4) {
      die("'extendObservable' expected 2-4 arguments");
    }

    if (typeof target !== "object") {
      die("'extendObservable' expects an object as first argument");
    }

    if (isObservableMap(target)) {
      die("'extendObservable' should not be used on maps, use map.merge instead");
    }

    if (!isPlainObject$1(properties)) {
      die("'extendObservable' only accepts plain objects as second argument");
    }

    if (isObservable(properties) || isObservable(annotations)) {
      die("Extending an object with another observable (object) is not supported");
    }
  } // Pull descriptors first, so we don't have to deal with props added by administration ($mobx)


  var descriptors = getOwnPropertyDescriptors(properties);
  var adm = asObservableObject(target, options)[$mobx];
  startBatch();

  try {
    ownKeys(descriptors).forEach(function (key) {
      adm.extend_(key, descriptors[key], // must pass "undefined" for { key: undefined }
      !annotations ? true : key in annotations ? annotations[key] : true);
    });
  } finally {
    endBatch();
  }

  return target;
}

function getDependencyTree(thing, property) {
  return nodeToDependencyTree(getAtom(thing, property));
}

function nodeToDependencyTree(node) {
  var result = {
    name: node.name_
  };

  if (node.observing_ && node.observing_.length > 0) {
    result.dependencies = unique(node.observing_).map(nodeToDependencyTree);
  }

  return result;
}

function unique(list) {
  return Array.from(new Set(list));
}

var generatorId = 0;

function FlowCancellationError() {
  this.message = "FLOW_CANCELLED";
}

FlowCancellationError.prototype = /*#__PURE__*/Object.create(Error.prototype);

var flowAnnotation = /*#__PURE__*/createFlowAnnotation("flow");
var flowBoundAnnotation = /*#__PURE__*/createFlowAnnotation("flow.bound", {
  bound: true
});
var flow = /*#__PURE__*/Object.assign(function flow(arg1, arg2) {
  // @flow
  if (isStringish(arg2)) {
    return storeAnnotation(arg1, arg2, flowAnnotation);
  } // flow(fn)


  if (process.env.NODE_ENV !== "production" && arguments.length !== 1) {
    die("Flow expects single argument with generator function");
  }

  var generator = arg1;
  var name = generator.name || "<unnamed flow>"; // Implementation based on https://github.com/tj/co/blob/master/index.js

  var res = function res() {
    var ctx = this;
    var args = arguments;
    var runId = ++generatorId;
    var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
    var rejector;
    var pendingPromise = undefined;
    var promise = new Promise(function (resolve, reject) {
      var stepId = 0;
      rejector = reject;

      function onFulfilled(res) {
        pendingPromise = undefined;
        var ret;

        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
        } catch (e) {
          return reject(e);
        }

        next(ret);
      }

      function onRejected(err) {
        pendingPromise = undefined;
        var ret;

        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen["throw"]).call(gen, err);
        } catch (e) {
          return reject(e);
        }

        next(ret);
      }

      function next(ret) {
        if (isFunction$1(ret == null ? void 0 : ret.then)) {
          // an async iterator
          ret.then(next, reject);
          return;
        }

        if (ret.done) {
          return resolve(ret.value);
        }

        pendingPromise = Promise.resolve(ret.value);
        return pendingPromise.then(onFulfilled, onRejected);
      }

      onFulfilled(undefined); // kick off the process
    });
    promise.cancel = action(name + " - runid: " + runId + " - cancel", function () {
      try {
        if (pendingPromise) {
          cancelPromise(pendingPromise);
        } // Finally block can return (or yield) stuff..


        var _res = gen["return"](undefined); // eat anything that promise would do, it's cancelled!


        var yieldedPromise = Promise.resolve(_res.value);
        yieldedPromise.then(noop, noop);
        cancelPromise(yieldedPromise); // maybe it can be cancelled :)
        // reject our original promise

        rejector(new FlowCancellationError());
      } catch (e) {
        rejector(e); // there could be a throwing finally block
      }
    });
    return promise;
  };

  res.isMobXFlow = true;
  return res;
}, flowAnnotation);
flow.bound = /*#__PURE__*/createDecoratorAnnotation(flowBoundAnnotation);

function cancelPromise(promise) {
  if (isFunction$1(promise.cancel)) {
    promise.cancel();
  }
}

function isFlow(fn) {
  return (fn == null ? void 0 : fn.isMobXFlow) === true;
}

function _isObservable(value, property) {
  if (!value) {
    return false;
  }

  if (property !== undefined) {
    if (process.env.NODE_ENV !== "production" && (isObservableMap(value) || isObservableArray(value))) {
      return die("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
    }

    if (isObservableObject(value)) {
      return value[$mobx].values_.has(property);
    }

    return false;
  } // For first check, see #701


  return isObservableObject(value) || !!value[$mobx] || isAtom(value) || isReaction(value) || isComputedValue(value);
}

function isObservable(value) {
  if (process.env.NODE_ENV !== "production" && arguments.length !== 1) {
    die("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
  }

  return _isObservable(value);
}

function trace() {
  if (!(process.env.NODE_ENV !== "production")) {
    die("trace() is not available in production builds");
  }

  var enterBreakPoint = false;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (typeof args[args.length - 1] === "boolean") {
    enterBreakPoint = args.pop();
  }

  var derivation = getAtomFromArgs(args);

  if (!derivation) {
    return die("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  }

  if (derivation.isTracing_ === TraceMode.NONE) {
    console.log("[mobx.trace] '" + derivation.name_ + "' tracing enabled");
  }

  derivation.isTracing_ = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}

function getAtomFromArgs(args) {
  switch (args.length) {
    case 0:
      return globalState.trackingDerivation;

    case 1:
      return getAtom(args[0]);

    case 2:
      return getAtom(args[0], args[1]);
  }
}
/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */


function transaction(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }

  startBatch();

  try {
    return action.apply(thisArg);
  } finally {
    endBatch();
  }
}

function getAdm(target) {
  return target[$mobx];
} // Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
// and skip either the internal values map, or the base object with its property descriptors!


var objectProxyTraps = {
  has: function has(target, name) {
    if (process.env.NODE_ENV !== "production" && globalState.trackingDerivation) {
      warnAboutProxyRequirement("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead.");
    }

    return getAdm(target).has_(name);
  },
  get: function get(target, name) {
    return getAdm(target).get_(name);
  },
  set: function set(target, name, value) {
    var _getAdm$set_;

    if (!isStringish(name)) {
      return false;
    }

    if (process.env.NODE_ENV !== "production" && !getAdm(target).values_.has(name)) {
      warnAboutProxyRequirement("add a new observable property through direct assignment. Use 'set' from 'mobx' instead.");
    } // null (intercepted) -> true (success)


    return (_getAdm$set_ = getAdm(target).set_(name, value, true)) != null ? _getAdm$set_ : true;
  },
  deleteProperty: function deleteProperty(target, name) {
    var _getAdm$delete_;

    if (process.env.NODE_ENV !== "production") {
      warnAboutProxyRequirement("delete properties from an observable object. Use 'remove' from 'mobx' instead.");
    }

    if (!isStringish(name)) {
      return false;
    } // null (intercepted) -> true (success)


    return (_getAdm$delete_ = getAdm(target).delete_(name, true)) != null ? _getAdm$delete_ : true;
  },
  defineProperty: function defineProperty(target, name, descriptor) {
    var _getAdm$definePropert;

    if (process.env.NODE_ENV !== "production") {
      warnAboutProxyRequirement("define property on an observable object. Use 'defineProperty' from 'mobx' instead.");
    } // null (intercepted) -> true (success)


    return (_getAdm$definePropert = getAdm(target).defineProperty_(name, descriptor)) != null ? _getAdm$definePropert : true;
  },
  ownKeys: function ownKeys(target) {
    if (process.env.NODE_ENV !== "production" && globalState.trackingDerivation) {
      warnAboutProxyRequirement("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead.");
    }

    return getAdm(target).ownKeys_();
  },
  preventExtensions: function preventExtensions(target) {
    die(13);
  }
};

function asDynamicObservableObject(target, options) {
  var _target$$mobx, _target$$mobx$proxy_;

  assertProxies();
  target = asObservableObject(target, options);
  return (_target$$mobx$proxy_ = (_target$$mobx = target[$mobx]).proxy_) != null ? _target$$mobx$proxy_ : _target$$mobx.proxy_ = new Proxy(target, objectProxyTraps);
}

function hasInterceptors(interceptable) {
  return interceptable.interceptors_ !== undefined && interceptable.interceptors_.length > 0;
}

function registerInterceptor(interceptable, handler) {
  var interceptors = interceptable.interceptors_ || (interceptable.interceptors_ = []);
  interceptors.push(handler);
  return once(function () {
    var idx = interceptors.indexOf(handler);

    if (idx !== -1) {
      interceptors.splice(idx, 1);
    }
  });
}

function interceptChange(interceptable, change) {
  var prevU = untrackedStart();

  try {
    // Interceptor can modify the array, copy it to avoid concurrent modification, see #1950
    var interceptors = [].concat(interceptable.interceptors_ || []);

    for (var i = 0, l = interceptors.length; i < l; i++) {
      change = interceptors[i](change);

      if (change && !change.type) {
        die(14);
      }

      if (!change) {
        break;
      }
    }

    return change;
  } finally {
    untrackedEnd(prevU);
  }
}

function hasListeners(listenable) {
  return listenable.changeListeners_ !== undefined && listenable.changeListeners_.length > 0;
}

function registerListener(listenable, handler) {
  var listeners = listenable.changeListeners_ || (listenable.changeListeners_ = []);
  listeners.push(handler);
  return once(function () {
    var idx = listeners.indexOf(handler);

    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  });
}

function notifyListeners(listenable, change) {
  var prevU = untrackedStart();
  var listeners = listenable.changeListeners_;

  if (!listeners) {
    return;
  }

  listeners = listeners.slice();

  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](change);
  }

  untrackedEnd(prevU);
}

function makeObservable(target, annotations, options) {
  var adm = asObservableObject(target, options)[$mobx];
  startBatch();

  try {
    var _annotations;

    if (process.env.NODE_ENV !== "production" && annotations && target[storedAnnotationsSymbol]) {
      die("makeObservable second arg must be nullish when using decorators. Mixing @decorator syntax with annotations is not supported.");
    } // Default to decorators


    (_annotations = annotations) != null ? _annotations : annotations = collectStoredAnnotations(target); // Annotate

    ownKeys(annotations).forEach(function (key) {
      return adm.make_(key, annotations[key]);
    });
  } finally {
    endBatch();
  }

  return target;
} // proto[keysSymbol] = new Set<PropertyKey>()

var SPLICE = "splice";
var UPDATE = "update";
var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859

var arrayTraps = {
  get: function get(target, name) {
    var adm = target[$mobx];

    if (name === $mobx) {
      return adm;
    }

    if (name === "length") {
      return adm.getArrayLength_();
    }

    if (typeof name === "string" && !isNaN(name)) {
      return adm.get_(parseInt(name));
    }

    if (hasProp(arrayExtensions, name)) {
      return arrayExtensions[name];
    }

    return target[name];
  },
  set: function set(target, name, value) {
    var adm = target[$mobx];

    if (name === "length") {
      adm.setArrayLength_(value);
    }

    if (typeof name === "symbol" || isNaN(name)) {
      target[name] = value;
    } else {
      // numeric string
      adm.set_(parseInt(name), value);
    }

    return true;
  },
  preventExtensions: function preventExtensions() {
    die(15);
  }
};

var ObservableArrayAdministration = /*#__PURE__*/function () {
  // this is the prop that gets proxied, so can't replace it!
  function ObservableArrayAdministration(name, enhancer, owned_, legacyMode_) {
    if (name === void 0) {
      name = process.env.NODE_ENV !== "production" ? "ObservableArray@" + getNextId() : "ObservableArray";
    }

    this.owned_ = void 0;
    this.legacyMode_ = void 0;
    this.atom_ = void 0;
    this.values_ = [];
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.enhancer_ = void 0;
    this.dehancer = void 0;
    this.proxy_ = void 0;
    this.lastKnownLength_ = 0;
    this.owned_ = owned_;
    this.legacyMode_ = legacyMode_;
    this.atom_ = new Atom(name);

    this.enhancer_ = function (newV, oldV) {
      return enhancer(newV, oldV, process.env.NODE_ENV !== "production" ? name + "[..]" : "ObservableArray[..]");
    };
  }

  var _proto = ObservableArrayAdministration.prototype;

  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.dehanceValues_ = function dehanceValues_(values) {
    if (this.dehancer !== undefined && values.length > 0) {
      return values.map(this.dehancer);
    }

    return values;
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }

    if (fireImmediately) {
      listener({
        observableKind: "array",
        object: this.proxy_,
        debugObjectName: this.atom_.name_,
        type: "splice",
        index: 0,
        added: this.values_.slice(),
        addedCount: this.values_.length,
        removed: [],
        removedCount: 0
      });
    }

    return registerListener(this, listener);
  };

  _proto.getArrayLength_ = function getArrayLength_() {
    this.atom_.reportObserved();
    return this.values_.length;
  };

  _proto.setArrayLength_ = function setArrayLength_(newLength) {
    if (typeof newLength !== "number" || isNaN(newLength) || newLength < 0) {
      die("Out of range: " + newLength);
    }

    var currentLength = this.values_.length;

    if (newLength === currentLength) {
      return;
    } else if (newLength > currentLength) {
      var newItems = new Array(newLength - currentLength);

      for (var i = 0; i < newLength - currentLength; i++) {
        newItems[i] = undefined;
      } // No Array.fill everywhere...


      this.spliceWithArray_(currentLength, 0, newItems);
    } else {
      this.spliceWithArray_(newLength, currentLength - newLength);
    }
  };

  _proto.updateArrayLength_ = function updateArrayLength_(oldLength, delta) {
    if (oldLength !== this.lastKnownLength_) {
      die(16);
    }

    this.lastKnownLength_ += delta;

    if (this.legacyMode_ && delta > 0) {
      reserveArrayBuffer(oldLength + delta + 1);
    }
  };

  _proto.spliceWithArray_ = function spliceWithArray_(index, deleteCount, newItems) {
    var _this = this;

    checkIfStateModificationsAreAllowed(this.atom_);
    var length = this.values_.length;

    if (index === undefined) {
      index = 0;
    } else if (index > length) {
      index = length;
    } else if (index < 0) {
      index = Math.max(0, length + index);
    }

    if (arguments.length === 1) {
      deleteCount = length - index;
    } else if (deleteCount === undefined || deleteCount === null) {
      deleteCount = 0;
    } else {
      deleteCount = Math.max(0, Math.min(deleteCount, length - index));
    }

    if (newItems === undefined) {
      newItems = EMPTY_ARRAY;
    }

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_,
        type: SPLICE,
        index: index,
        removedCount: deleteCount,
        added: newItems
      });

      if (!change) {
        return EMPTY_ARRAY;
      }

      deleteCount = change.removedCount;
      newItems = change.added;
    }

    newItems = newItems.length === 0 ? newItems : newItems.map(function (v) {
      return _this.enhancer_(v, undefined);
    });

    if (this.legacyMode_ || process.env.NODE_ENV !== "production") {
      var lengthDelta = newItems.length - deleteCount;
      this.updateArrayLength_(length, lengthDelta); // checks if internal array wasn't modified
    }

    var res = this.spliceItemsIntoValues_(index, deleteCount, newItems);

    if (deleteCount !== 0 || newItems.length !== 0) {
      this.notifyArraySplice_(index, newItems, res);
    }

    return this.dehanceValues_(res);
  };

  _proto.spliceItemsIntoValues_ = function spliceItemsIntoValues_(index, deleteCount, newItems) {
    if (newItems.length < MAX_SPLICE_SIZE) {
      var _this$values_;

      return (_this$values_ = this.values_).splice.apply(_this$values_, [index, deleteCount].concat(newItems));
    } else {
      // The items removed by the splice
      var res = this.values_.slice(index, index + deleteCount); // The items that that should remain at the end of the array

      var oldItems = this.values_.slice(index + deleteCount); // New length is the previous length + addition count - deletion count

      this.values_.length += newItems.length - deleteCount;

      for (var i = 0; i < newItems.length; i++) {
        this.values_[index + i] = newItems[i];
      }

      for (var _i = 0; _i < oldItems.length; _i++) {
        this.values_[index + newItems.length + _i] = oldItems[_i];
      }

      return res;
    }
  };

  _proto.notifyArrayChildUpdate_ = function notifyArrayChildUpdate_(index, newValue, oldValue) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      type: UPDATE,
      debugObjectName: this.atom_.name_,
      index: index,
      newValue: newValue,
      oldValue: oldValue
    } : null; // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
    // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled

    if (process.env.NODE_ENV !== "production" && notifySpy) {
      spyReportStart(change);
    }

    this.atom_.reportChanged();

    if (notify) {
      notifyListeners(this, change);
    }

    if (process.env.NODE_ENV !== "production" && notifySpy) {
      spyReportEnd();
    }
  };

  _proto.notifyArraySplice_ = function notifyArraySplice_(index, added, removed) {
    var notifySpy = !this.owned_ && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: SPLICE,
      index: index,
      removed: removed,
      added: added,
      removedCount: removed.length,
      addedCount: added.length
    } : null;

    if (process.env.NODE_ENV !== "production" && notifySpy) {
      spyReportStart(change);
    }

    this.atom_.reportChanged(); // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe

    if (notify) {
      notifyListeners(this, change);
    }

    if (process.env.NODE_ENV !== "production" && notifySpy) {
      spyReportEnd();
    }
  };

  _proto.get_ = function get_(index) {
    if (index < this.values_.length) {
      this.atom_.reportObserved();
      return this.dehanceValue_(this.values_[index]);
    }

    console.warn(process.env.NODE_ENV !== "production" ? "[mobx] Out of bounds read: " + index : "[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
  };

  _proto.set_ = function set_(index, newValue) {
    var values = this.values_;

    if (index < values.length) {
      // update at index in range
      checkIfStateModificationsAreAllowed(this.atom_);
      var oldValue = values[index];

      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          type: UPDATE,
          object: this.proxy_,
          index: index,
          newValue: newValue
        });

        if (!change) {
          return;
        }

        newValue = change.newValue;
      }

      newValue = this.enhancer_(newValue, oldValue);
      var changed = newValue !== oldValue;

      if (changed) {
        values[index] = newValue;
        this.notifyArrayChildUpdate_(index, newValue, oldValue);
      }
    } else if (index === values.length) {
      // add a new item
      this.spliceWithArray_(index, 0, [newValue]);
    } else {
      // out of bounds
      die(17, index, values.length);
    }
  };

  return ObservableArrayAdministration;
}();

function createObservableArray(initialValues, enhancer, name, owned) {
  if (name === void 0) {
    name = process.env.NODE_ENV !== "production" ? "ObservableArray@" + getNextId() : "ObservableArray";
  }

  if (owned === void 0) {
    owned = false;
  }

  assertProxies();
  var adm = new ObservableArrayAdministration(name, enhancer, owned, false);
  addHiddenFinalProp(adm.values_, $mobx, adm);
  var proxy = new Proxy(adm.values_, arrayTraps);
  adm.proxy_ = proxy;

  if (initialValues && initialValues.length) {
    var prev = allowStateChangesStart(true);
    adm.spliceWithArray_(0, 0, initialValues);
    allowStateChangesEnd(prev);
  }

  return proxy;
} // eslint-disable-next-line


var arrayExtensions = {
  clear: function clear() {
    return this.splice(0);
  },
  replace: function replace(newItems) {
    var adm = this[$mobx];
    return adm.spliceWithArray_(0, adm.values_.length, newItems);
  },
  // Used by JSON.stringify
  toJSON: function toJSON() {
    return this.slice();
  },

  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function splice(index, deleteCount) {
    for (var _len = arguments.length, newItems = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      newItems[_key - 2] = arguments[_key];
    }

    var adm = this[$mobx];

    switch (arguments.length) {
      case 0:
        return [];

      case 1:
        return adm.spliceWithArray_(index);

      case 2:
        return adm.spliceWithArray_(index, deleteCount);
    }

    return adm.spliceWithArray_(index, deleteCount, newItems);
  },
  spliceWithArray: function spliceWithArray(index, deleteCount, newItems) {
    return this[$mobx].spliceWithArray_(index, deleteCount, newItems);
  },
  push: function push() {
    var adm = this[$mobx];

    for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }

    adm.spliceWithArray_(adm.values_.length, 0, items);
    return adm.values_.length;
  },
  pop: function pop() {
    return this.splice(Math.max(this[$mobx].values_.length - 1, 0), 1)[0];
  },
  shift: function shift() {
    return this.splice(0, 1)[0];
  },
  unshift: function unshift() {
    var adm = this[$mobx];

    for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      items[_key3] = arguments[_key3];
    }

    adm.spliceWithArray_(0, 0, items);
    return adm.values_.length;
  },
  reverse: function reverse() {
    // reverse by default mutates in place before returning the result
    // which makes it both a 'derivation' and a 'mutation'.
    if (globalState.trackingDerivation) {
      die(37, "reverse");
    }

    this.replace(this.slice().reverse());
    return this;
  },
  sort: function sort() {
    // sort by default mutates in place before returning the result
    // which goes against all good practices. Let's not change the array in place!
    if (globalState.trackingDerivation) {
      die(37, "sort");
    }

    var copy = this.slice();
    copy.sort.apply(copy, arguments);
    this.replace(copy);
    return this;
  },
  remove: function remove(value) {
    var adm = this[$mobx];
    var idx = adm.dehanceValues_(adm.values_).indexOf(value);

    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }

    return false;
  }
};
/**
 * Wrap function from prototype
 * Without this, everything works as well, but this works
 * faster as everything works on unproxied values
 */

addArrayExtension("concat", simpleFunc);
addArrayExtension("flat", simpleFunc);
addArrayExtension("includes", simpleFunc);
addArrayExtension("indexOf", simpleFunc);
addArrayExtension("join", simpleFunc);
addArrayExtension("lastIndexOf", simpleFunc);
addArrayExtension("slice", simpleFunc);
addArrayExtension("toString", simpleFunc);
addArrayExtension("toLocaleString", simpleFunc); // map

addArrayExtension("every", mapLikeFunc);
addArrayExtension("filter", mapLikeFunc);
addArrayExtension("find", mapLikeFunc);
addArrayExtension("findIndex", mapLikeFunc);
addArrayExtension("flatMap", mapLikeFunc);
addArrayExtension("forEach", mapLikeFunc);
addArrayExtension("map", mapLikeFunc);
addArrayExtension("some", mapLikeFunc); // reduce

addArrayExtension("reduce", reduceLikeFunc);
addArrayExtension("reduceRight", reduceLikeFunc);

function addArrayExtension(funcName, funcFactory) {
  if (typeof Array.prototype[funcName] === "function") {
    arrayExtensions[funcName] = funcFactory(funcName);
  }
} // Report and delegate to dehanced array


function simpleFunc(funcName) {
  return function () {
    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
} // Make sure callbacks recieve correct array arg #2326


function mapLikeFunc(funcName) {
  return function (callback, thisArg) {
    var _this2 = this;

    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_);
    return dehancedValues[funcName](function (element, index) {
      return callback.call(thisArg, element, index, _this2);
    });
  };
} // Make sure callbacks recieve correct array arg #2326


function reduceLikeFunc(funcName) {
  return function () {
    var _this3 = this;

    var adm = this[$mobx];
    adm.atom_.reportObserved();
    var dehancedValues = adm.dehanceValues_(adm.values_); // #2432 - reduce behavior depends on arguments.length

    var callback = arguments[0];

    arguments[0] = function (accumulator, currentValue, index) {
      return callback(accumulator, currentValue, index, _this3);
    };

    return dehancedValues[funcName].apply(dehancedValues, arguments);
  };
}

var isObservableArrayAdministration = /*#__PURE__*/createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);

function isObservableArray(thing) {
  return isObject$2(thing) && isObservableArrayAdministration(thing[$mobx]);
}

var _Symbol$iterator, _Symbol$toStringTag;

var ObservableMapMarker = {};
var ADD = "add";
var DELETE = "delete"; // just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
// But: https://github.com/mobxjs/mobx/issues/1556

_Symbol$iterator = Symbol.iterator;
_Symbol$toStringTag = Symbol.toStringTag;

var ObservableMap = /*#__PURE__*/function () {
  // hasMap, not hashMap >-).
  function ObservableMap(initialData, enhancer_, name_) {
    var _this = this;

    if (enhancer_ === void 0) {
      enhancer_ = deepEnhancer;
    }

    if (name_ === void 0) {
      name_ = process.env.NODE_ENV !== "production" ? "ObservableMap@" + getNextId() : "ObservableMap";
    }

    this.enhancer_ = void 0;
    this.name_ = void 0;
    this[$mobx] = ObservableMapMarker;
    this.data_ = void 0;
    this.hasMap_ = void 0;
    this.keysAtom_ = void 0;
    this.interceptors_ = void 0;
    this.changeListeners_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = enhancer_;
    this.name_ = name_;

    if (!isFunction$1(Map)) {
      die(18);
    }

    this.keysAtom_ = createAtom(process.env.NODE_ENV !== "production" ? this.name_ + ".keys()" : "ObservableMap.keys()");
    this.data_ = new Map();
    this.hasMap_ = new Map();
    allowStateChanges(true, function () {
      _this.merge(initialData);
    });
  }

  var _proto = ObservableMap.prototype;

  _proto.has_ = function has_(key) {
    return this.data_.has(key);
  };

  _proto.has = function has(key) {
    var _this2 = this;

    if (!globalState.trackingDerivation) {
      return this.has_(key);
    }

    var entry = this.hasMap_.get(key);

    if (!entry) {
      var newEntry = entry = new ObservableValue(this.has_(key), referenceEnhancer, process.env.NODE_ENV !== "production" ? this.name_ + "." + stringifyKey(key) + "?" : "ObservableMap.key?", false);
      this.hasMap_.set(key, newEntry);
      onBecomeUnobserved(newEntry, function () {
        return _this2.hasMap_["delete"](key);
      });
    }

    return entry.get();
  };

  _proto.set = function set(key, value) {
    var hasKey = this.has_(key);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: hasKey ? UPDATE : ADD,
        object: this,
        newValue: value,
        name: key
      });

      if (!change) {
        return this;
      }

      value = change.newValue;
    }

    if (hasKey) {
      this.updateValue_(key, value);
    } else {
      this.addValue_(key, value);
    }

    return this;
  };

  _proto["delete"] = function _delete(key) {
    var _this3 = this;

    checkIfStateModificationsAreAllowed(this.keysAtom_);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        name: key
      });

      if (!change) {
        return false;
      }
    }

    if (this.has_(key)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);

      var _change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: this.data_.get(key).value_,
        name: key
      } : null;

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportStart(_change);
      } // TODO fix type


      transaction(function () {
        var _this3$hasMap_$get;

        _this3.keysAtom_.reportChanged();

        (_this3$hasMap_$get = _this3.hasMap_.get(key)) == null ? void 0 : _this3$hasMap_$get.setNewValue_(false);

        var observable = _this3.data_.get(key);

        observable.setNewValue_(undefined);

        _this3.data_["delete"](key);
      });

      if (notify) {
        notifyListeners(this, _change);
      }

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportEnd();
      }

      return true;
    }

    return false;
  };

  _proto.updateValue_ = function updateValue_(key, newValue) {
    var observable = this.data_.get(key);
    newValue = observable.prepareNewValue_(newValue);

    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: UPDATE,
        object: this,
        oldValue: observable.value_,
        name: key,
        newValue: newValue
      } : null;

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportStart(change);
      } // TODO fix type


      observable.setNewValue_(newValue);

      if (notify) {
        notifyListeners(this, change);
      }

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportEnd();
      }
    }
  };

  _proto.addValue_ = function addValue_(key, newValue) {
    var _this4 = this;

    checkIfStateModificationsAreAllowed(this.keysAtom_);
    transaction(function () {
      var _this4$hasMap_$get;

      var observable = new ObservableValue(newValue, _this4.enhancer_, process.env.NODE_ENV !== "production" ? _this4.name_ + "." + stringifyKey(key) : "ObservableMap.key", false);

      _this4.data_.set(key, observable);

      newValue = observable.value_; // value might have been changed

      (_this4$hasMap_$get = _this4.hasMap_.get(key)) == null ? void 0 : _this4$hasMap_$get.setNewValue_(true);

      _this4.keysAtom_.reportChanged();
    });
    var notifySpy = isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ADD,
      object: this,
      name: key,
      newValue: newValue
    } : null;

    if (process.env.NODE_ENV !== "production" && notifySpy) {
      spyReportStart(change);
    } // TODO fix type


    if (notify) {
      notifyListeners(this, change);
    }

    if (process.env.NODE_ENV !== "production" && notifySpy) {
      spyReportEnd();
    }
  };

  _proto.get = function get(key) {
    if (this.has(key)) {
      return this.dehanceValue_(this.data_.get(key).get());
    }

    return this.dehanceValue_(undefined);
  };

  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.keys = function keys() {
    this.keysAtom_.reportObserved();
    return this.data_.keys();
  };

  _proto.values = function values() {
    var self = this;
    var keys = this.keys();
    return makeIterable({
      next: function next() {
        var _keys$next = keys.next(),
            done = _keys$next.done,
            value = _keys$next.value;

        return {
          done: done,
          value: done ? undefined : self.get(value)
        };
      }
    });
  };

  _proto.entries = function entries() {
    var self = this;
    var keys = this.keys();
    return makeIterable({
      next: function next() {
        var _keys$next2 = keys.next(),
            done = _keys$next2.done,
            value = _keys$next2.value;

        return {
          done: done,
          value: done ? undefined : [value, self.get(value)]
        };
      }
    });
  };

  _proto[_Symbol$iterator] = function () {
    return this.entries();
  };

  _proto.forEach = function forEach(callback, thisArg) {
    for (var _iterator = _createForOfIteratorHelperLoose(this), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          key = _step$value[0],
          value = _step$value[1];
      callback.call(thisArg, value, key, this);
    }
  }
  /** Merge another object into this object, returns this. */
  ;

  _proto.merge = function merge(other) {
    var _this5 = this;

    if (isObservableMap(other)) {
      other = new Map(other);
    }

    transaction(function () {
      if (isPlainObject$1(other)) {
        getPlainObjectKeys(other).forEach(function (key) {
          return _this5.set(key, other[key]);
        });
      } else if (Array.isArray(other)) {
        other.forEach(function (_ref) {
          var key = _ref[0],
              value = _ref[1];
          return _this5.set(key, value);
        });
      } else if (isES6Map(other)) {
        if (other.constructor !== Map) {
          die(19, other);
        }

        other.forEach(function (value, key) {
          return _this5.set(key, value);
        });
      } else if (other !== null && other !== undefined) {
        die(20, other);
      }
    });
    return this;
  };

  _proto.clear = function clear() {
    var _this6 = this;

    transaction(function () {
      untracked(function () {
        for (var _iterator2 = _createForOfIteratorHelperLoose(_this6.keys()), _step2; !(_step2 = _iterator2()).done;) {
          var key = _step2.value;

          _this6["delete"](key);
        }
      });
    });
  };

  _proto.replace = function replace(values) {
    var _this7 = this; // Implementation requirements:
    // - respect ordering of replacement map
    // - allow interceptors to run and potentially prevent individual operations
    // - don't recreate observables that already exist in original map (so we don't destroy existing subscriptions)
    // - don't _keysAtom.reportChanged if the keys of resulting map are indentical (order matters!)
    // - note that result map may differ from replacement map due to the interceptors


    transaction(function () {
      // Convert to map so we can do quick key lookups
      var replacementMap = convertToMap(values);
      var orderedData = new Map(); // Used for optimization

      var keysReportChangedCalled = false; // Delete keys that don't exist in replacement map
      // if the key deletion is prevented by interceptor
      // add entry at the beginning of the result map

      for (var _iterator3 = _createForOfIteratorHelperLoose(_this7.data_.keys()), _step3; !(_step3 = _iterator3()).done;) {
        var key = _step3.value; // Concurrently iterating/deleting keys
        // iterator should handle this correctly

        if (!replacementMap.has(key)) {
          var deleted = _this7["delete"](key); // Was the key removed?


          if (deleted) {
            // _keysAtom.reportChanged() was already called
            keysReportChangedCalled = true;
          } else {
            // Delete prevented by interceptor
            var value = _this7.data_.get(key);

            orderedData.set(key, value);
          }
        }
      } // Merge entries


      for (var _iterator4 = _createForOfIteratorHelperLoose(replacementMap.entries()), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
            _key = _step4$value[0],
            _value = _step4$value[1]; // We will want to know whether a new key is added

        var keyExisted = _this7.data_.has(_key); // Add or update value


        _this7.set(_key, _value); // The addition could have been prevent by interceptor


        if (_this7.data_.has(_key)) {
          // The update could have been prevented by interceptor
          // and also we want to preserve existing values
          // so use value from _data map (instead of replacement map)
          var _value2 = _this7.data_.get(_key);

          orderedData.set(_key, _value2); // Was a new key added?

          if (!keyExisted) {
            // _keysAtom.reportChanged() was already called
            keysReportChangedCalled = true;
          }
        }
      } // Check for possible key order change


      if (!keysReportChangedCalled) {
        if (_this7.data_.size !== orderedData.size) {
          // If size differs, keys are definitely modified
          _this7.keysAtom_.reportChanged();
        } else {
          var iter1 = _this7.data_.keys();

          var iter2 = orderedData.keys();
          var next1 = iter1.next();
          var next2 = iter2.next();

          while (!next1.done) {
            if (next1.value !== next2.value) {
              _this7.keysAtom_.reportChanged();

              break;
            }

            next1 = iter1.next();
            next2 = iter2.next();
          }
        }
      } // Use correctly ordered map


      _this7.data_ = orderedData;
    });
    return this;
  };

  _proto.toString = function toString() {
    return "[object ObservableMap]";
  };

  _proto.toJSON = function toJSON() {
    return Array.from(this);
  };
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */


  _proto.observe_ = function observe_(listener, fireImmediately) {
    if (process.env.NODE_ENV !== "production" && fireImmediately === true) {
      die("`observe` doesn't support fireImmediately=true in combination with maps.");
    }

    return registerListener(this, listener);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _createClass(ObservableMap, [{
    key: "size",
    get: function get() {
      this.keysAtom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return "Map";
    }
  }]);

  return ObservableMap;
}(); // eslint-disable-next-line


var isObservableMap = /*#__PURE__*/createInstanceofPredicate("ObservableMap", ObservableMap);

function convertToMap(dataStructure) {
  if (isES6Map(dataStructure) || isObservableMap(dataStructure)) {
    return dataStructure;
  } else if (Array.isArray(dataStructure)) {
    return new Map(dataStructure);
  } else if (isPlainObject$1(dataStructure)) {
    var map = new Map();

    for (var key in dataStructure) {
      map.set(key, dataStructure[key]);
    }

    return map;
  } else {
    return die(21, dataStructure);
  }
}

var _Symbol$iterator$1, _Symbol$toStringTag$1;

var ObservableSetMarker = {};
_Symbol$iterator$1 = Symbol.iterator;
_Symbol$toStringTag$1 = Symbol.toStringTag;

var ObservableSet = /*#__PURE__*/function () {
  function ObservableSet(initialData, enhancer, name_) {
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }

    if (name_ === void 0) {
      name_ = process.env.NODE_ENV !== "production" ? "ObservableSet@" + getNextId() : "ObservableSet";
    }

    this.name_ = void 0;
    this[$mobx] = ObservableSetMarker;
    this.data_ = new Set();
    this.atom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.dehancer = void 0;
    this.enhancer_ = void 0;
    this.name_ = name_;

    if (!isFunction$1(Set)) {
      die(22);
    }

    this.atom_ = createAtom(this.name_);

    this.enhancer_ = function (newV, oldV) {
      return enhancer(newV, oldV, name_);
    };

    if (initialData) {
      this.replace(initialData);
    }
  }

  var _proto = ObservableSet.prototype;

  _proto.dehanceValue_ = function dehanceValue_(value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  _proto.clear = function clear() {
    var _this = this;

    transaction(function () {
      untracked(function () {
        for (var _iterator = _createForOfIteratorHelperLoose(_this.data_.values()), _step; !(_step = _iterator()).done;) {
          var value = _step.value;

          _this["delete"](value);
        }
      });
    });
  };

  _proto.forEach = function forEach(callbackFn, thisArg) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this), _step2; !(_step2 = _iterator2()).done;) {
      var value = _step2.value;
      callbackFn.call(thisArg, value, value, this);
    }
  };

  _proto.add = function add(value) {
    var _this2 = this;

    checkIfStateModificationsAreAllowed(this.atom_);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: ADD,
        object: this,
        newValue: value
      });

      if (!change) {
        return this;
      } // ideally, value = change.value would be done here, so that values can be
      // changed by interceptor. Same applies for other Set and Map api's.

    }

    if (!this.has(value)) {
      transaction(function () {
        _this2.data_.add(_this2.enhancer_(value, undefined));

        _this2.atom_.reportChanged();
      });
      var notifySpy = process.env.NODE_ENV !== "production" && isSpyEnabled();
      var notify = hasListeners(this);

      var _change = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ADD,
        object: this,
        newValue: value
      } : null;

      if (notifySpy && process.env.NODE_ENV !== "production") {
        spyReportStart(_change);
      }

      if (notify) {
        notifyListeners(this, _change);
      }

      if (notifySpy && process.env.NODE_ENV !== "production") {
        spyReportEnd();
      }
    }

    return this;
  };

  _proto["delete"] = function _delete(value) {
    var _this3 = this;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: DELETE,
        object: this,
        oldValue: value
      });

      if (!change) {
        return false;
      }
    }

    if (this.has(value)) {
      var notifySpy = process.env.NODE_ENV !== "production" && isSpyEnabled();
      var notify = hasListeners(this);

      var _change2 = notify || notifySpy ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: DELETE,
        object: this,
        oldValue: value
      } : null;

      if (notifySpy && process.env.NODE_ENV !== "production") {
        spyReportStart(_change2);
      }

      transaction(function () {
        _this3.atom_.reportChanged();

        _this3.data_["delete"](value);
      });

      if (notify) {
        notifyListeners(this, _change2);
      }

      if (notifySpy && process.env.NODE_ENV !== "production") {
        spyReportEnd();
      }

      return true;
    }

    return false;
  };

  _proto.has = function has(value) {
    this.atom_.reportObserved();
    return this.data_.has(this.dehanceValue_(value));
  };

  _proto.entries = function entries() {
    var nextIndex = 0;
    var keys = Array.from(this.keys());
    var values = Array.from(this.values());
    return makeIterable({
      next: function next() {
        var index = nextIndex;
        nextIndex += 1;
        return index < values.length ? {
          value: [keys[index], values[index]],
          done: false
        } : {
          done: true
        };
      }
    });
  };

  _proto.keys = function keys() {
    return this.values();
  };

  _proto.values = function values() {
    this.atom_.reportObserved();
    var self = this;
    var nextIndex = 0;
    var observableValues = Array.from(this.data_.values());
    return makeIterable({
      next: function next() {
        return nextIndex < observableValues.length ? {
          value: self.dehanceValue_(observableValues[nextIndex++]),
          done: false
        } : {
          done: true
        };
      }
    });
  };

  _proto.replace = function replace(other) {
    var _this4 = this;

    if (isObservableSet(other)) {
      other = new Set(other);
    }

    transaction(function () {
      if (Array.isArray(other)) {
        _this4.clear();

        other.forEach(function (value) {
          return _this4.add(value);
        });
      } else if (isES6Set(other)) {
        _this4.clear();

        other.forEach(function (value) {
          return _this4.add(value);
        });
      } else if (other !== null && other !== undefined) {
        die("Cannot initialize set from " + other);
      }
    });
    return this;
  };

  _proto.observe_ = function observe_(listener, fireImmediately) {
    // ... 'fireImmediately' could also be true?
    if (process.env.NODE_ENV !== "production" && fireImmediately === true) {
      die("`observe` doesn't support fireImmediately=true in combination with sets.");
    }

    return registerListener(this, listener);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.toJSON = function toJSON() {
    return Array.from(this);
  };

  _proto.toString = function toString() {
    return "[object ObservableSet]";
  };

  _proto[_Symbol$iterator$1] = function () {
    return this.values();
  };

  _createClass(ObservableSet, [{
    key: "size",
    get: function get() {
      this.atom_.reportObserved();
      return this.data_.size;
    }
  }, {
    key: _Symbol$toStringTag$1,
    get: function get() {
      return "Set";
    }
  }]);

  return ObservableSet;
}(); // eslint-disable-next-line


var isObservableSet = /*#__PURE__*/createInstanceofPredicate("ObservableSet", ObservableSet);
var descriptorCache = /*#__PURE__*/Object.create(null);
var REMOVE = "remove";

var ObservableObjectAdministration = /*#__PURE__*/function () {
  function ObservableObjectAdministration(target_, values_, name_, // Used anytime annotation is not explicitely provided
  defaultAnnotation_) {
    if (values_ === void 0) {
      values_ = new Map();
    }

    if (defaultAnnotation_ === void 0) {
      defaultAnnotation_ = autoAnnotation;
    }

    this.target_ = void 0;
    this.values_ = void 0;
    this.name_ = void 0;
    this.defaultAnnotation_ = void 0;
    this.keysAtom_ = void 0;
    this.changeListeners_ = void 0;
    this.interceptors_ = void 0;
    this.proxy_ = void 0;
    this.isPlainObject_ = void 0;
    this.appliedAnnotations_ = void 0;
    this.pendingKeys_ = void 0;
    this.target_ = target_;
    this.values_ = values_;
    this.name_ = name_;
    this.defaultAnnotation_ = defaultAnnotation_;
    this.keysAtom_ = new Atom(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"); // Optimization: we use this frequently

    this.isPlainObject_ = isPlainObject$1(this.target_);

    if (process.env.NODE_ENV !== "production" && !isAnnotation(this.defaultAnnotation_)) {
      die("defaultAnnotation must be valid annotation");
    }

    if (process.env.NODE_ENV !== "production") {
      // Prepare structure for tracking which fields were already annotated
      this.appliedAnnotations_ = {};
    }
  }

  var _proto = ObservableObjectAdministration.prototype;

  _proto.getObservablePropValue_ = function getObservablePropValue_(key) {
    return this.values_.get(key).get();
  };

  _proto.setObservablePropValue_ = function setObservablePropValue_(key, newValue) {
    var observable = this.values_.get(key);

    if (observable instanceof ComputedValue) {
      observable.set(newValue);
      return true;
    } // intercept


    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: UPDATE,
        object: this.proxy_ || this.target_,
        name: key,
        newValue: newValue
      });

      if (!change) {
        return null;
      }

      newValue = change.newValue;
    }

    newValue = observable.prepareNewValue_(newValue); // notify spy & observers

    if (newValue !== globalState.UNCHANGED) {
      var notify = hasListeners(this);
      var notifySpy = process.env.NODE_ENV !== "production" && isSpyEnabled();

      var _change = notify || notifySpy ? {
        type: UPDATE,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: observable.value_,
        name: key,
        newValue: newValue
      } : null;

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportStart(_change);
      }

      observable.setNewValue_(newValue);

      if (notify) {
        notifyListeners(this, _change);
      }

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportEnd();
      }
    }

    return true;
  };

  _proto.get_ = function get_(key) {
    if (globalState.trackingDerivation && !hasProp(this.target_, key)) {
      // Key doesn't exist yet, subscribe for it in case it's added later
      this.has_(key);
    }

    return this.target_[key];
  }
  /**
   * @param {PropertyKey} key
   * @param {any} value
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.set_ = function set_(key, value, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    } // Don't use .has(key) - we care about own


    if (hasProp(this.target_, key)) {
      // Existing prop
      if (this.values_.has(key)) {
        // Observable (can be intercepted)
        return this.setObservablePropValue_(key, value);
      } else if (proxyTrap) {
        // Non-observable - proxy
        return Reflect.set(this.target_, key, value);
      } else {
        // Non-observable
        this.target_[key] = value;
        return true;
      }
    } else {
      // New prop
      return this.extend_(key, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true
      }, this.defaultAnnotation_, proxyTrap);
    }
  } // Trap for "in"
  ;

  _proto.has_ = function has_(key) {
    if (!globalState.trackingDerivation) {
      // Skip key subscription outside derivation
      return key in this.target_;
    }

    this.pendingKeys_ || (this.pendingKeys_ = new Map());
    var entry = this.pendingKeys_.get(key);

    if (!entry) {
      entry = new ObservableValue(key in this.target_, referenceEnhancer, process.env.NODE_ENV !== "production" ? this.name_ + "." + stringifyKey(key) + "?" : "ObservableObject.key?", false);
      this.pendingKeys_.set(key, entry);
    }

    return entry.get();
  }
  /**
   * @param {PropertyKey} key
   * @param {Annotation|boolean} annotation true - use default annotation, false - ignore prop
   */
  ;

  _proto.make_ = function make_(key, annotation) {
    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }

    if (annotation === false) {
      return;
    }

    assertAnnotable(this, annotation, key);

    if (!(key in this.target_)) {
      var _this$target_$storedA; // Throw on missing key, except for decorators:
      // Decorator annotations are collected from whole prototype chain.
      // When called from super() some props may not exist yet.
      // However we don't have to worry about missing prop,
      // because the decorator must have been applied to something.


      if ((_this$target_$storedA = this.target_[storedAnnotationsSymbol]) != null && _this$target_$storedA[key]) {
        return; // will be annotated by subclass constructor
      } else {
        die(1, annotation.annotationType_, this.name_ + "." + key.toString());
      }
    }

    var source = this.target_;

    while (source && source !== objectPrototype) {
      var descriptor = getDescriptor(source, key);

      if (descriptor) {
        var outcome = annotation.make_(this, key, descriptor, source);

        if (outcome === 0
        /* Cancel */
        ) {
          return;
        }

        if (outcome === 1
        /* Break */
        ) {
          break;
        }
      }

      source = Object.getPrototypeOf(source);
    }

    recordAnnotationApplied(this, annotation, key);
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {Annotation|boolean} annotation true - use default annotation, false - copy as is
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.extend_ = function extend_(key, descriptor, annotation, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    if (annotation === true) {
      annotation = this.defaultAnnotation_;
    }

    if (annotation === false) {
      return this.defineProperty_(key, descriptor, proxyTrap);
    }

    assertAnnotable(this, annotation, key);
    var outcome = annotation.extend_(this, key, descriptor, proxyTrap);

    if (outcome) {
      recordAnnotationApplied(this, annotation, key);
    }

    return outcome;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.defineProperty_ = function defineProperty_(key, descriptor, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    try {
      startBatch(); // Delete

      var deleteOutcome = this.delete_(key);

      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      } // ADD interceptor


      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: descriptor.value
        });

        if (!change) {
          return null;
        }

        var newValue = change.newValue;

        if (descriptor.value !== newValue) {
          descriptor = _extends$1({}, descriptor, {
            value: newValue
          });
        }
      } // Define


      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key, descriptor);
      } // Notify


      this.notifyPropertyAddition_(key, descriptor.value);
    } finally {
      endBatch();
    }

    return true;
  } // If original descriptor becomes relevant, move this to annotation directly
  ;

  _proto.defineObservableProperty_ = function defineObservableProperty_(key, value, enhancer, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    try {
      startBatch(); // Delete

      var deleteOutcome = this.delete_(key);

      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      } // ADD interceptor


      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: value
        });

        if (!change) {
          return null;
        }

        value = change.newValue;
      }

      var cachedDescriptor = getCachedObservablePropDescriptor(key);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: true,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      }; // Define

      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key, descriptor);
      }

      var observable = new ObservableValue(value, enhancer, process.env.NODE_ENV !== "production" ? this.name_ + "." + key.toString() : "ObservableObject.key", false);
      this.values_.set(key, observable); // Notify (value possibly changed by ObservableValue)

      this.notifyPropertyAddition_(key, observable.value_);
    } finally {
      endBatch();
    }

    return true;
  } // If original descriptor becomes relevant, move this to annotation directly
  ;

  _proto.defineComputedProperty_ = function defineComputedProperty_(key, options, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    }

    try {
      startBatch(); // Delete

      var deleteOutcome = this.delete_(key);

      if (!deleteOutcome) {
        // Failure or intercepted
        return deleteOutcome;
      } // ADD interceptor


      if (hasInterceptors(this)) {
        var change = interceptChange(this, {
          object: this.proxy_ || this.target_,
          name: key,
          type: ADD,
          newValue: undefined
        });

        if (!change) {
          return null;
        }
      }

      options.name || (options.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + key.toString() : "ObservableObject.key");
      options.context = this.proxy_ || this.target_;
      var cachedDescriptor = getCachedObservablePropDescriptor(key);
      var descriptor = {
        configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
        enumerable: false,
        get: cachedDescriptor.get,
        set: cachedDescriptor.set
      }; // Define

      if (proxyTrap) {
        if (!Reflect.defineProperty(this.target_, key, descriptor)) {
          return false;
        }
      } else {
        defineProperty(this.target_, key, descriptor);
      }

      this.values_.set(key, new ComputedValue(options)); // Notify

      this.notifyPropertyAddition_(key, undefined);
    } finally {
      endBatch();
    }

    return true;
  }
  /**
   * @param {PropertyKey} key
   * @param {PropertyDescriptor} descriptor
   * @param {boolean} proxyTrap whether it's called from proxy trap
   * @returns {boolean|null} true on success, false on failure (proxyTrap + non-configurable), null when cancelled by interceptor
   */
  ;

  _proto.delete_ = function delete_(key, proxyTrap) {
    if (proxyTrap === void 0) {
      proxyTrap = false;
    } // No such prop


    if (!hasProp(this.target_, key)) {
      return true;
    } // Intercept


    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy_ || this.target_,
        name: key,
        type: REMOVE
      }); // Cancelled

      if (!change) {
        return null;
      }
    } // Delete


    try {
      var _this$pendingKeys_, _this$pendingKeys_$ge;

      startBatch();
      var notify = hasListeners(this);
      var notifySpy = process.env.NODE_ENV !== "production" && isSpyEnabled();
      var observable = this.values_.get(key); // Value needed for spies/listeners

      var value = undefined; // Optimization: don't pull the value unless we will need it

      if (!observable && (notify || notifySpy)) {
        var _getDescriptor;

        value = (_getDescriptor = getDescriptor(this.target_, key)) == null ? void 0 : _getDescriptor.value;
      } // delete prop (do first, may fail)


      if (proxyTrap) {
        if (!Reflect.deleteProperty(this.target_, key)) {
          return false;
        }
      } else {
        delete this.target_[key];
      } // Allow re-annotating this field


      if (process.env.NODE_ENV !== "production") {
        delete this.appliedAnnotations_[key];
      } // Clear observable


      if (observable) {
        this.values_["delete"](key); // for computed, value is undefined

        if (observable instanceof ObservableValue) {
          value = observable.value_;
        } // Notify: autorun(() => obj[key]), see #1796


        propagateChanged(observable);
      } // Notify "keys/entries/values" observers


      this.keysAtom_.reportChanged(); // Notify "has" observers
      // "in" as it may still exist in proto

      (_this$pendingKeys_ = this.pendingKeys_) == null ? void 0 : (_this$pendingKeys_$ge = _this$pendingKeys_.get(key)) == null ? void 0 : _this$pendingKeys_$ge.set(key in this.target_); // Notify spies/listeners

      if (notify || notifySpy) {
        var _change2 = {
          type: REMOVE,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: value,
          name: key
        };

        if (process.env.NODE_ENV !== "production" && notifySpy) {
          spyReportStart(_change2);
        }

        if (notify) {
          notifyListeners(this, _change2);
        }

        if (process.env.NODE_ENV !== "production" && notifySpy) {
          spyReportEnd();
        }
      }
    } finally {
      endBatch();
    }

    return true;
  }
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */
  ;

  _proto.observe_ = function observe_(callback, fireImmediately) {
    if (process.env.NODE_ENV !== "production" && fireImmediately === true) {
      die("`observe` doesn't support the fire immediately property for observable objects.");
    }

    return registerListener(this, callback);
  };

  _proto.intercept_ = function intercept_(handler) {
    return registerInterceptor(this, handler);
  };

  _proto.notifyPropertyAddition_ = function notifyPropertyAddition_(key, value) {
    var _this$pendingKeys_2, _this$pendingKeys_2$g;

    var notify = hasListeners(this);
    var notifySpy = process.env.NODE_ENV !== "production" && isSpyEnabled();

    if (notify || notifySpy) {
      var change = notify || notifySpy ? {
        type: ADD,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: key,
        newValue: value
      } : null;

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportStart(change);
      }

      if (notify) {
        notifyListeners(this, change);
      }

      if (process.env.NODE_ENV !== "production" && notifySpy) {
        spyReportEnd();
      }
    }

    (_this$pendingKeys_2 = this.pendingKeys_) == null ? void 0 : (_this$pendingKeys_2$g = _this$pendingKeys_2.get(key)) == null ? void 0 : _this$pendingKeys_2$g.set(true); // Notify "keys/entries/values" observers

    this.keysAtom_.reportChanged();
  };

  _proto.ownKeys_ = function ownKeys_() {
    this.keysAtom_.reportObserved();
    return ownKeys(this.target_);
  };

  _proto.keys_ = function keys_() {
    // Returns enumerable && own, but unfortunately keysAtom will report on ANY key change.
    // There is no way to distinguish between Object.keys(object) and Reflect.ownKeys(object) - both are handled by ownKeys trap.
    // We can either over-report in Object.keys(object) or under-report in Reflect.ownKeys(object)
    // We choose to over-report in Object.keys(object), because:
    // - typically it's used with simple data objects
    // - when symbolic/non-enumerable keys are relevant Reflect.ownKeys works as expected
    this.keysAtom_.reportObserved();
    return Object.keys(this.target_);
  };

  return ObservableObjectAdministration;
}();

function asObservableObject(target, options) {
  var _options$name;

  if (process.env.NODE_ENV !== "production" && options && isObservableObject(target)) {
    die("Options can't be provided for already observable objects.");
  }

  if (hasProp(target, $mobx)) {
    if (process.env.NODE_ENV !== "production" && !(getAdministration(target) instanceof ObservableObjectAdministration)) {
      die("Cannot convert '" + getDebugName(target) + "' into observable object:" + "\nThe target is already observable of different type." + "\nExtending builtins is not supported.");
    }

    return target;
  }

  if (process.env.NODE_ENV !== "production" && !Object.isExtensible(target)) {
    die("Cannot make the designated object observable; it is not extensible");
  }

  var name = (_options$name = options == null ? void 0 : options.name) != null ? _options$name : process.env.NODE_ENV !== "production" ? (isPlainObject$1(target) ? "ObservableObject" : target.constructor.name) + "@" + getNextId() : "ObservableObject";
  var adm = new ObservableObjectAdministration(target, new Map(), String(name), getAnnotationFromOptions(options));
  addHiddenProp(target, $mobx, adm);
  return target;
}

var isObservableObjectAdministration = /*#__PURE__*/createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);

function getCachedObservablePropDescriptor(key) {
  return descriptorCache[key] || (descriptorCache[key] = {
    get: function get() {
      return this[$mobx].getObservablePropValue_(key);
    },
    set: function set(value) {
      return this[$mobx].setObservablePropValue_(key, value);
    }
  });
}

function isObservableObject(thing) {
  if (isObject$2(thing)) {
    return isObservableObjectAdministration(thing[$mobx]);
  }

  return false;
}

function recordAnnotationApplied(adm, annotation, key) {
  var _adm$target_$storedAn;

  if (process.env.NODE_ENV !== "production") {
    adm.appliedAnnotations_[key] = annotation;
  } // Remove applied decorator annotation so we don't try to apply it again in subclass constructor


  (_adm$target_$storedAn = adm.target_[storedAnnotationsSymbol]) == null ? true : delete _adm$target_$storedAn[key];
}

function assertAnnotable(adm, annotation, key) {
  // Valid annotation
  if (process.env.NODE_ENV !== "production" && !isAnnotation(annotation)) {
    die("Cannot annotate '" + adm.name_ + "." + key.toString() + "': Invalid annotation.");
  }
  /*
  // Configurable, not sealed, not frozen
  // Possibly not needed, just a little better error then the one thrown by engine.
  // Cases where this would be useful the most (subclass field initializer) are not interceptable by this.
  if (__DEV__) {
      const configurable = getDescriptor(adm.target_, key)?.configurable
      const frozen = Object.isFrozen(adm.target_)
      const sealed = Object.isSealed(adm.target_)
      if (!configurable || frozen || sealed) {
          const fieldName = `${adm.name_}.${key.toString()}`
          const requestedAnnotationType = annotation.annotationType_
          let error = `Cannot apply '${requestedAnnotationType}' to '${fieldName}':`
          if (frozen) {
              error += `\nObject is frozen.`
          }
          if (sealed) {
              error += `\nObject is sealed.`
          }
          if (!configurable) {
              error += `\nproperty is not configurable.`
              // Mention only if caused by us to avoid confusion
              if (hasProp(adm.appliedAnnotations!, key)) {
                  error += `\nTo prevent accidental re-definition of a field by a subclass, `
                  error += `all annotated fields of non-plain objects (classes) are not configurable.`
              }
          }
          die(error)
      }
  }
  */
  // Not annotated


  if (process.env.NODE_ENV !== "production" && !isOverride(annotation) && hasProp(adm.appliedAnnotations_, key)) {
    var fieldName = adm.name_ + "." + key.toString();
    var currentAnnotationType = adm.appliedAnnotations_[key].annotationType_;
    var requestedAnnotationType = annotation.annotationType_;
    die("Cannot apply '" + requestedAnnotationType + "' to '" + fieldName + "':" + ("\nThe field is already annotated with '" + currentAnnotationType + "'.") + "\nRe-annotating fields is not allowed." + "\nUse 'override' annotation for methods overriden by subclass.");
  }
}
/**
 * This array buffer contains two lists of properties, so that all arrays
 * can recycle their property definitions, which significantly improves performance of creating
 * properties on the fly.
 */


var OBSERVABLE_ARRAY_BUFFER_SIZE = 0; // Typescript workaround to make sure ObservableArray extends Array

var StubArray = function StubArray() {};

function inherit(ctor, proto) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ctor.prototype, proto);
  } else if (ctor.prototype.__proto__ !== undefined) {
    ctor.prototype.__proto__ = proto;
  } else {
    ctor.prototype = proto;
  }
}

inherit(StubArray, Array.prototype); // Weex proto freeze protection was here,
// but it is unclear why the hack is need as MobX never changed the prototype
// anyway, so removed it in V6

var LegacyObservableArray = /*#__PURE__*/function (_StubArray, _Symbol$toStringTag, _Symbol$iterator) {
  _inheritsLoose(LegacyObservableArray, _StubArray);

  function LegacyObservableArray(initialValues, enhancer, name, owned) {
    var _this;

    if (name === void 0) {
      name = process.env.NODE_ENV !== "production" ? "ObservableArray@" + getNextId() : "ObservableArray";
    }

    if (owned === void 0) {
      owned = false;
    }

    _this = _StubArray.call(this) || this;
    var adm = new ObservableArrayAdministration(name, enhancer, owned, true);
    adm.proxy_ = _assertThisInitialized(_this);
    addHiddenFinalProp(_assertThisInitialized(_this), $mobx, adm);

    if (initialValues && initialValues.length) {
      var prev = allowStateChangesStart(true); // @ts-ignore

      _this.spliceWithArray(0, 0, initialValues);

      allowStateChangesEnd(prev);
    }

    return _this;
  }

  var _proto = LegacyObservableArray.prototype;

  _proto.concat = function concat() {
    this[$mobx].atom_.reportObserved();

    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return Array.prototype.concat.apply(this.slice(), //@ts-ignore
    arrays.map(function (a) {
      return isObservableArray(a) ? a.slice() : a;
    }));
  };

  _proto[_Symbol$iterator] = function () {
    var self = this;
    var nextIndex = 0;
    return makeIterable({
      next: function next() {
        return nextIndex < self.length ? {
          value: self[nextIndex++],
          done: false
        } : {
          done: true,
          value: undefined
        };
      }
    });
  };

  _createClass(LegacyObservableArray, [{
    key: "length",
    get: function get() {
      return this[$mobx].getArrayLength_();
    },
    set: function set(newLength) {
      this[$mobx].setArrayLength_(newLength);
    }
  }, {
    key: _Symbol$toStringTag,
    get: function get() {
      return "Array";
    }
  }]);

  return LegacyObservableArray;
}(StubArray, Symbol.toStringTag, Symbol.iterator);

Object.entries(arrayExtensions).forEach(function (_ref) {
  var prop = _ref[0],
      fn = _ref[1];

  if (prop !== "concat") {
    addHiddenProp(LegacyObservableArray.prototype, prop, fn);
  }
});

function createArrayEntryDescriptor(index) {
  return {
    enumerable: false,
    configurable: true,
    get: function get() {
      return this[$mobx].get_(index);
    },
    set: function set(value) {
      this[$mobx].set_(index, value);
    }
  };
}

function createArrayBufferItem(index) {
  defineProperty(LegacyObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
}

function reserveArrayBuffer(max) {
  if (max > OBSERVABLE_ARRAY_BUFFER_SIZE) {
    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max + 100; index++) {
      createArrayBufferItem(index);
    }

    OBSERVABLE_ARRAY_BUFFER_SIZE = max;
  }
}

reserveArrayBuffer(1000);

function createLegacyArray(initialValues, enhancer, name) {
  return new LegacyObservableArray(initialValues, enhancer, name);
}

function getAtom(thing, property) {
  if (typeof thing === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      if (property !== undefined) {
        die(23);
      }

      return thing[$mobx].atom_;
    }

    if (isObservableSet(thing)) {
      return thing[$mobx];
    }

    if (isObservableMap(thing)) {
      if (property === undefined) {
        return thing.keysAtom_;
      }

      var observable = thing.data_.get(property) || thing.hasMap_.get(property);

      if (!observable) {
        die(25, property, getDebugName(thing));
      }

      return observable;
    }

    if (isObservableObject(thing)) {
      if (!property) {
        return die(26);
      }

      var _observable = thing[$mobx].values_.get(property);

      if (!_observable) {
        die(27, property, getDebugName(thing));
      }

      return _observable;
    }

    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
      return thing;
    }
  } else if (isFunction$1(thing)) {
    if (isReaction(thing[$mobx])) {
      // disposer function
      return thing[$mobx];
    }
  }

  die(28);
}

function getAdministration(thing, property) {
  if (!thing) {
    die(29);
  }

  if (property !== undefined) {
    return getAdministration(getAtom(thing, property));
  }

  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
    return thing;
  }

  if (isObservableMap(thing) || isObservableSet(thing)) {
    return thing;
  }

  if (thing[$mobx]) {
    return thing[$mobx];
  }

  die(24, thing);
}

function getDebugName(thing, property) {
  var named;

  if (property !== undefined) {
    named = getAtom(thing, property);
  } else if (isAction(thing)) {
    return thing.name;
  } else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing)) {
    named = getAdministration(thing);
  } else {
    // valid for arrays as well
    named = getAtom(thing);
  }

  return named.name_;
}

var toString = objectPrototype.toString;

function deepEqual(a, b, depth) {
  if (depth === void 0) {
    depth = -1;
  }

  return eq(a, b, depth);
} // Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.


function eq(a, b, depth, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } // `null` or `undefined` only equal to itself (strict comparison).


  if (a == null || b == null) {
    return false;
  } // `NaN`s are equivalent, but non-reflexive.


  if (a !== a) {
    return b !== b;
  } // Exhaust primitive checks


  var type = typeof a;

  if (type !== "function" && type !== "object" && typeof b != "object") {
    return false;
  } // Compare `[[Class]]` names.


  var className = toString.call(a);

  if (className !== toString.call(b)) {
    return false;
  }

  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]": // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

    case "[object String]":
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return "" + a === "" + b;

    case "[object Number]":
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) {
        return +b !== +b;
      } // An `egal` comparison is performed for other numeric values.


      return +a === 0 ? 1 / +a === 1 / b : +a === +b;

    case "[object Date]":
    case "[object Boolean]":
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;

    case "[object Symbol]":
      return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);

    case "[object Map]":
    case "[object Set]":
      // Maps and Sets are unwrapped to arrays of entry-pairs, adding an incidental level.
      // Hide this extra level by increasing the depth.
      if (depth >= 0) {
        depth++;
      }

      break;
  } // Unwrap any wrapped objects.


  a = unwrap(a);
  b = unwrap(b);
  var areArrays = className === "[object Array]";

  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") {
      return false;
    } // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.


    var aCtor = a.constructor,
        bCtor = b.constructor;

    if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor && isFunction$1(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
      return false;
    }
  }

  if (depth === 0) {
    return false;
  } else if (depth < 0) {
    depth = -1;
  } // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.


  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;

  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  } // Add the first object to the stack of traversed objects.


  aStack.push(a);
  bStack.push(b); // Recursively compare objects and arrays.

  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;

    if (length !== b.length) {
      return false;
    } // Deep compare the contents, ignoring non-numeric properties.


    while (length--) {
      if (!eq(a[length], b[length], depth - 1, aStack, bStack)) {
        return false;
      }
    }
  } else {
    // Deep compare objects.
    var keys = Object.keys(a);
    var key;
    length = keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.

    if (Object.keys(b).length !== length) {
      return false;
    }

    while (length--) {
      // Deep compare each member
      key = keys[length];

      if (!(hasProp(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack))) {
        return false;
      }
    }
  } // Remove the first object from the stack of traversed objects.


  aStack.pop();
  bStack.pop();
  return true;
}

function unwrap(a) {
  if (isObservableArray(a)) {
    return a.slice();
  }

  if (isES6Map(a) || isObservableMap(a)) {
    return Array.from(a.entries());
  }

  if (isES6Set(a) || isObservableSet(a)) {
    return Array.from(a.entries());
  }

  return a;
}

function makeIterable(iterator) {
  iterator[Symbol.iterator] = getSelf;
  return iterator;
}

function getSelf() {
  return this;
}

function isAnnotation(thing) {
  return (// Can be function
    thing instanceof Object && typeof thing.annotationType_ === "string" && isFunction$1(thing.make_) && isFunction$1(thing.extend_)
  );
}
/**
 * (c) Michel Weststrate 2015 - 2020
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get a global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */


["Symbol", "Map", "Set"].forEach(function (m) {
  var g = getGlobal();

  if (typeof g[m] === "undefined") {
    die("MobX requires global '" + m + "' to be available or polyfilled");
  }
});

if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
  // See: https://github.com/andykog/mobx-devtools/
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: {
      getDebugName: getDebugName
    },
    $mobx: $mobx
  });
}

if (!useState) {
  throw new Error("mobx-react-lite requires React with Hooks support");
}

if (!makeObservable) {
  throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
}

function defaultNoopBatch(callback) {
  callback();
}
function observerBatching(reactionScheduler) {
  if (!reactionScheduler) {
    reactionScheduler = defaultNoopBatch;

    if ("production" !== process.env.NODE_ENV) {
      console.warn("[MobX] Failed to get unstable_batched updates from react-dom / react-native");
    }
  }

  configure({
    reactionScheduler: reactionScheduler
  });
}

function printDebugValue(v) {
  return getDependencyTree(v);
}

var FinalizationRegistryLocal = typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry;

function createTrackingData(reaction) {
  var trackingData = {
    reaction: reaction,
    mounted: false,
    changedBeforeMount: false,
    cleanAt: Date.now() + CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS
  };
  return trackingData;
}
/**
 * The minimum time before we'll clean up a Reaction created in a render
 * for a component that hasn't managed to run its effects. This needs to
 * be big enough to ensure that a component won't turn up and have its
 * effects run without being re-rendered.
 */

var CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS = 10000;
/**
 * The frequency with which we'll check for leaked reactions.
 */

var CLEANUP_TIMER_LOOP_MILLIS = 10000;

/**
 * FinalizationRegistry-based uncommitted reaction cleanup
 */

function createReactionCleanupTrackingUsingFinalizationRegister(FinalizationRegistry) {
  var cleanupTokenToReactionTrackingMap = new Map();
  var globalCleanupTokensCounter = 1;
  var registry = new FinalizationRegistry(function cleanupFunction(token) {
    var trackedReaction = cleanupTokenToReactionTrackingMap.get(token);

    if (trackedReaction) {
      trackedReaction.reaction.dispose();
      cleanupTokenToReactionTrackingMap.delete(token);
    }
  });
  return {
    addReactionToTrack: function (reactionTrackingRef, reaction, objectRetainedByReact) {
      var token = globalCleanupTokensCounter++;
      registry.register(objectRetainedByReact, token, reactionTrackingRef);
      reactionTrackingRef.current = createTrackingData(reaction);
      reactionTrackingRef.current.finalizationRegistryCleanupToken = token;
      cleanupTokenToReactionTrackingMap.set(token, reactionTrackingRef.current);
      return reactionTrackingRef.current;
    },
    recordReactionAsCommitted: function (reactionRef) {
      registry.unregister(reactionRef);

      if (reactionRef.current && reactionRef.current.finalizationRegistryCleanupToken) {
        cleanupTokenToReactionTrackingMap.delete(reactionRef.current.finalizationRegistryCleanupToken);
      }
    },
    forceCleanupTimerToRunNowForTests: function () {// When FinalizationRegistry in use, this this is no-op
    },
    resetCleanupScheduleForTests: function () {// When FinalizationRegistry in use, this this is no-op
    }
  };
}

var __values = undefined && undefined.__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * timers, gc-style, uncommitted reaction cleanup
 */

function createTimerBasedReactionCleanupTracking() {
  /**
   * Reactions created by components that have yet to be fully mounted.
   */
  var uncommittedReactionRefs = new Set();
  /**
   * Latest 'uncommitted reactions' cleanup timer handle.
   */

  var reactionCleanupHandle;
  /* istanbul ignore next */

  /**
   * Only to be used by test functions; do not export outside of mobx-react-lite
   */

  function forceCleanupTimerToRunNowForTests() {
    // This allows us to control the execution of the cleanup timer
    // to force it to run at awkward times in unit tests.
    if (reactionCleanupHandle) {
      clearTimeout(reactionCleanupHandle);
      cleanUncommittedReactions();
    }
  }
  /* istanbul ignore next */


  function resetCleanupScheduleForTests() {
    var e_1, _a;

    if (uncommittedReactionRefs.size > 0) {
      try {
        for (var uncommittedReactionRefs_1 = __values(uncommittedReactionRefs), uncommittedReactionRefs_1_1 = uncommittedReactionRefs_1.next(); !uncommittedReactionRefs_1_1.done; uncommittedReactionRefs_1_1 = uncommittedReactionRefs_1.next()) {
          var ref = uncommittedReactionRefs_1_1.value;
          var tracking = ref.current;

          if (tracking) {
            tracking.reaction.dispose();
            ref.current = null;
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (uncommittedReactionRefs_1_1 && !uncommittedReactionRefs_1_1.done && (_a = uncommittedReactionRefs_1.return)) _a.call(uncommittedReactionRefs_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      uncommittedReactionRefs.clear();
    }

    if (reactionCleanupHandle) {
      clearTimeout(reactionCleanupHandle);
      reactionCleanupHandle = undefined;
    }
  }

  function ensureCleanupTimerRunning() {
    if (reactionCleanupHandle === undefined) {
      reactionCleanupHandle = setTimeout(cleanUncommittedReactions, CLEANUP_TIMER_LOOP_MILLIS);
    }
  }

  function scheduleCleanupOfReactionIfLeaked(ref) {
    uncommittedReactionRefs.add(ref);
    ensureCleanupTimerRunning();
  }

  function recordReactionAsCommitted(reactionRef) {
    uncommittedReactionRefs.delete(reactionRef);
  }
  /**
   * Run by the cleanup timer to dispose any outstanding reactions
   */


  function cleanUncommittedReactions() {
    reactionCleanupHandle = undefined; // Loop through all the candidate leaked reactions; those older
    // than CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS get tidied.

    var now = Date.now();
    uncommittedReactionRefs.forEach(function (ref) {
      var tracking = ref.current;

      if (tracking) {
        if (now >= tracking.cleanAt) {
          // It's time to tidy up this leaked reaction.
          tracking.reaction.dispose();
          ref.current = null;
          uncommittedReactionRefs.delete(ref);
        }
      }
    });

    if (uncommittedReactionRefs.size > 0) {
      // We've just finished a round of cleanups but there are still
      // some leak candidates outstanding.
      ensureCleanupTimerRunning();
    }
  }

  return {
    addReactionToTrack: function (reactionTrackingRef, reaction,
    /**
     * On timer based implementation we don't really need this object,
     * but we keep the same api
     */
    objectRetainedByReact) {
      reactionTrackingRef.current = createTrackingData(reaction);
      scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
      return reactionTrackingRef.current;
    },
    recordReactionAsCommitted: recordReactionAsCommitted,
    forceCleanupTimerToRunNowForTests: forceCleanupTimerToRunNowForTests,
    resetCleanupScheduleForTests: resetCleanupScheduleForTests
  };
}

var _a = FinalizationRegistryLocal ? createReactionCleanupTrackingUsingFinalizationRegister(FinalizationRegistryLocal) : createTimerBasedReactionCleanupTracking(),
    addReactionToTrack = _a.addReactionToTrack,
    recordReactionAsCommitted = _a.recordReactionAsCommitted;

var __read = undefined && undefined.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

function observerComponentNameFor(baseComponentName) {
  return "observer".concat(baseComponentName);
}
/**
 * We use class to make it easier to detect in heap snapshots by name
 */


var ObjectToBeRetainedByReact =
/** @class */
function () {
  function ObjectToBeRetainedByReact() {}

  return ObjectToBeRetainedByReact;
}();

function objectToBeRetainedByReactFactory() {
  return new ObjectToBeRetainedByReact();
}

function useObserver(fn, baseComponentName) {
  if (baseComponentName === void 0) {
    baseComponentName = "observed";
  }

  var _a = __read(React__default.useState(objectToBeRetainedByReactFactory), 1),
      objectRetainedByReact = _a[0]; // Force update, see #2982


  var _b = __read(React__default.useState(), 2),
      setState = _b[1];

  var forceUpdate = function () {
    return setState([]);
  }; // StrictMode/ConcurrentMode/Suspense may mean that our component is
  // rendered and abandoned multiple times, so we need to track leaked
  // Reactions.


  var reactionTrackingRef = React__default.useRef(null);

  if (!reactionTrackingRef.current) {
    // First render for this component (or first time since a previous
    // reaction from an abandoned render was disposed).
    var newReaction = new Reaction(observerComponentNameFor(baseComponentName), function () {
      // Observable has changed, meaning we want to re-render
      // BUT if we're a component that hasn't yet got to the useEffect()
      // stage, we might be a component that _started_ to render, but
      // got dropped, and we don't want to make state changes then.
      // (It triggers warnings in StrictMode, for a start.)
      if (trackingData_1.mounted) {
        // We have reached useEffect(), so we're mounted, and can trigger an update
        forceUpdate();
      } else {
        // We haven't yet reached useEffect(), so we'll need to trigger a re-render
        // when (and if) useEffect() arrives.
        trackingData_1.changedBeforeMount = true;
      }
    });
    var trackingData_1 = addReactionToTrack(reactionTrackingRef, newReaction, objectRetainedByReact);
  }

  var reaction = reactionTrackingRef.current.reaction;
  React__default.useDebugValue(reaction, printDebugValue);
  React__default.useEffect(function () {
    // Called on first mount only
    recordReactionAsCommitted(reactionTrackingRef);

    if (reactionTrackingRef.current) {
      // Great. We've already got our reaction from our render;
      // all we need to do is to record that it's now mounted,
      // to allow future observable changes to trigger re-renders
      reactionTrackingRef.current.mounted = true; // Got a change before first mount, force an update

      if (reactionTrackingRef.current.changedBeforeMount) {
        reactionTrackingRef.current.changedBeforeMount = false;
        forceUpdate();
      }
    } else {
      // The reaction we set up in our render has been disposed.
      // This can be due to bad timings of renderings, e.g. our
      // component was paused for a _very_ long time, and our
      // reaction got cleaned up
      // Re-create the reaction
      reactionTrackingRef.current = {
        reaction: new Reaction(observerComponentNameFor(baseComponentName), function () {
          // We've definitely already been mounted at this point
          forceUpdate();
        }),
        mounted: true,
        changedBeforeMount: false,
        cleanAt: Infinity
      };
      forceUpdate();
    }

    return function () {
      reactionTrackingRef.current.reaction.dispose();
      reactionTrackingRef.current = null;
    };
  }, []); // render the original component, but have the
  // reaction track the observables, so that rendering
  // can be invalidated (see above) once a dependency changes

  var rendering;
  var exception;
  reaction.track(function () {
    try {
      rendering = fn();
    } catch (e) {
      exception = e;
    }
  });

  if (exception) {
    throw exception; // re-throw any exceptions caught during rendering
  }

  return rendering;
}

var warnObserverOptionsDeprecated = true;
var hasSymbol = typeof Symbol === "function" && Symbol.for; // Using react-is had some issues (and operates on elements, not on types), see #608 / #609

var ReactForwardRefSymbol = hasSymbol ? Symbol.for("react.forward_ref") : typeof forwardRef === "function" && forwardRef(function (props) {
  return null;
})["$$typeof"];
var ReactMemoSymbol = hasSymbol ? Symbol.for("react.memo") : typeof memo === "function" && memo(function (props) {
  return null;
})["$$typeof"]; // n.b. base case is not used for actual typings or exported in the typing files

function observer$1(baseComponent, // TODO remove in next major
options) {
  var _a;

  if (process.env.NODE_ENV !== "production" && warnObserverOptionsDeprecated && options) {
    warnObserverOptionsDeprecated = false;
    console.warn("[mobx-react-lite] `observer(fn, { forwardRef: true })` is deprecated, use `observer(React.forwardRef(fn))`");
  }

  if (ReactMemoSymbol && baseComponent["$$typeof"] === ReactMemoSymbol) {
    throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");
  } // The working of observer is explained step by step in this talk: https://www.youtube.com/watch?v=cPF4iBedoF0&feature=youtu.be&t=1307

  var useForwardRef = (_a = options === null || options === void 0 ? void 0 : options.forwardRef) !== null && _a !== void 0 ? _a : false;
  var render = baseComponent;
  var baseComponentName = baseComponent.displayName || baseComponent.name; // If already wrapped with forwardRef, unwrap,
  // so we can patch render and apply memo

  if (ReactForwardRefSymbol && baseComponent["$$typeof"] === ReactForwardRefSymbol) {
    useForwardRef = true;
    render = baseComponent["render"];

    if (typeof render !== "function") {
      throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");
    }
  }

  var observerComponent = function (props, ref) {
    return useObserver(function () {
      return render(props, ref);
    }, baseComponentName);
  }; // Don't set `displayName` for anonymous components,
  // so the `displayName` can be customized by user, see #3192.


  if (baseComponentName !== "") {
    observerComponent.displayName = baseComponentName;
  } // Support legacy context: `contextTypes` must be applied before `memo`


  if (baseComponent.contextTypes) {
    observerComponent.contextTypes = baseComponent.contextTypes;
  }

  if (useForwardRef) {
    // `forwardRef` must be applied prior `memo`
    // `forwardRef(observer(cmp))` throws:
    // "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))"
    observerComponent = forwardRef(observerComponent);
  } // memo; we are not interested in deep updates
  // in props; we assume that if deep objects are changed,
  // this is in observables, which would have been tracked anyway


  observerComponent = memo(observerComponent);
  copyStaticProperties(baseComponent, observerComponent);

  if ("production" !== process.env.NODE_ENV) {
    Object.defineProperty(observerComponent, "contextTypes", {
      set: function () {
        var _a;

        throw new Error("[mobx-react-lite] `".concat(this.displayName || ((_a = this.type) === null || _a === void 0 ? void 0 : _a.displayName) || "Component", ".contextTypes` must be set before applying `observer`."));
      }
    });
  }

  return observerComponent;
} // based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js

var hoistBlackList = {
  $$typeof: true,
  render: true,
  compare: true,
  type: true,
  // Don't redefine `displayName`,
  // it's defined as getter-setter pair on `memo` (see #3192).
  displayName: true
};

function copyStaticProperties(base, target) {
  Object.keys(base).forEach(function (key) {
    if (!hoistBlackList[key]) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
    }
  });
}

if ("production" !== process.env.NODE_ENV) ;

function useLocalObservable(initializer, annotations) {
  return useState(function () {
    return observable(initializer(), annotations, {
      autoBind: true
    });
  })[0];
}

var __read$1 = undefined && undefined.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

observerBatching(unstable_batchedUpdates);

var symbolId = 0;

function createSymbol(name) {
  if (typeof Symbol === "function") {
    return Symbol(name);
  }

  var symbol = "__$mobx-react " + name + " (" + symbolId + ")";
  symbolId++;
  return symbol;
}

var createdSymbols = {};

function newSymbol(name) {
  if (!createdSymbols[name]) {
    createdSymbols[name] = createSymbol(name);
  }

  return createdSymbols[name];
}

function shallowEqual(objA, objB) {
  //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (var i = 0; i < keysA.length; i++) {
    if (!Object.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function is(x, y) {
  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
} // based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
/**
 * Helper to set `prop` to `this` as non-enumerable (hidden prop)
 * @param target
 * @param prop
 * @param value
 */


function setHiddenProp(target, prop, value) {
  if (!Object.hasOwnProperty.call(target, prop)) {
    Object.defineProperty(target, prop, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value
    });
  } else {
    target[prop] = value;
  }
}
/**
 * Utilities for patching componentWillUnmount, to make sure @disposeOnUnmount works correctly icm with user defined hooks
 * and the handler provided by mobx-react
 */


var mobxMixins = /*#__PURE__*/newSymbol("patchMixins");
var mobxPatchedDefinition = /*#__PURE__*/newSymbol("patchedDefinition");

function getMixins(target, methodName) {
  var mixins = target[mobxMixins] = target[mobxMixins] || {};
  var methodMixins = mixins[methodName] = mixins[methodName] || {};
  methodMixins.locks = methodMixins.locks || 0;
  methodMixins.methods = methodMixins.methods || [];
  return methodMixins;
}

function wrapper(realMethod, mixins) {
  var _this = this;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  } // locks are used to ensure that mixins are invoked only once per invocation, even on recursive calls


  mixins.locks++;

  try {
    var retVal;

    if (realMethod !== undefined && realMethod !== null) {
      retVal = realMethod.apply(this, args);
    }

    return retVal;
  } finally {
    mixins.locks--;

    if (mixins.locks === 0) {
      mixins.methods.forEach(function (mx) {
        mx.apply(_this, args);
      });
    }
  }
}

function wrapFunction(realMethod, mixins) {
  var fn = function fn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    wrapper.call.apply(wrapper, [this, realMethod, mixins].concat(args));
  };

  return fn;
}

function patch(target, methodName, mixinMethod) {
  var mixins = getMixins(target, methodName);

  if (mixins.methods.indexOf(mixinMethod) < 0) {
    mixins.methods.push(mixinMethod);
  }

  var oldDefinition = Object.getOwnPropertyDescriptor(target, methodName);

  if (oldDefinition && oldDefinition[mobxPatchedDefinition]) {
    // already patched definition, do not repatch
    return;
  }

  var originalMethod = target[methodName];
  var newDefinition = createDefinition(target, methodName, oldDefinition ? oldDefinition.enumerable : undefined, mixins, originalMethod);
  Object.defineProperty(target, methodName, newDefinition);
}

function createDefinition(target, methodName, enumerable, mixins, originalMethod) {
  var _ref;

  var wrappedFunc = wrapFunction(originalMethod, mixins);
  return _ref = {}, _ref[mobxPatchedDefinition] = true, _ref.get = function get() {
    return wrappedFunc;
  }, _ref.set = function set(value) {
    if (this === target) {
      wrappedFunc = wrapFunction(value, mixins);
    } else {
      // when it is an instance of the prototype/a child prototype patch that particular case again separately
      // since we need to store separate values depending on wether it is the actual instance, the prototype, etc
      // e.g. the method for super might not be the same as the method for the prototype which might be not the same
      // as the method for the instance
      var newDefinition = createDefinition(this, methodName, enumerable, mixins, value);
      Object.defineProperty(this, methodName, newDefinition);
    }
  }, _ref.configurable = true, _ref.enumerable = enumerable, _ref;
}

var mobxAdminProperty = $mobx || "$mobx"; // BC

var mobxObserverProperty = /*#__PURE__*/newSymbol("isMobXReactObserver");
var mobxIsUnmounted = /*#__PURE__*/newSymbol("isUnmounted");
var skipRenderKey = /*#__PURE__*/newSymbol("skipRender");
var isForcingUpdateKey = /*#__PURE__*/newSymbol("isForcingUpdate");

function makeClassComponentObserver(componentClass) {
  var target = componentClass.prototype;

  if (componentClass[mobxObserverProperty]) {
    var displayName = getDisplayName(target);
    console.warn("The provided component class (" + displayName + ")\n                has already been declared as an observer component.");
  } else {
    componentClass[mobxObserverProperty] = true;
  }

  if (target.componentWillReact) {
    throw new Error("The componentWillReact life-cycle event is no longer supported");
  }

  if (componentClass["__proto__"] !== PureComponent) {
    if (!target.shouldComponentUpdate) {
      target.shouldComponentUpdate = observerSCU;
    } else if (target.shouldComponentUpdate !== observerSCU) {
      // n.b. unequal check, instead of existence check, as @observer might be on superclass as well
      throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.");
    }
  } // this.props and this.state are made observable, just to make sure @computed fields that
  // are defined inside the component, and which rely on state or props, re-compute if state or props change
  // (otherwise the computed wouldn't update and become stale on props change, since props are not observable)
  // However, this solution is not without it's own problems: https://github.com/mobxjs/mobx-react/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aobservable-props-or-not+


  makeObservableProp(target, "props");
  makeObservableProp(target, "state");

  if (componentClass.contextType) {
    makeObservableProp(target, "context");
  }

  var originalRender = target.render;

  if (typeof originalRender !== "function") {
    var _displayName = getDisplayName(target);

    throw new Error("[mobx-react] class component (" + _displayName + ") is missing `render` method." + "\n`observer` requires `render` being a function defined on prototype." + "\n`render = () => {}` or `render = function() {}` is not supported.");
  }

  target.render = function () {
    this.render =  createReactiveRender.call(this, originalRender);
    return this.render();
  };

  patch(target, "componentDidMount", function () {
    this[mobxIsUnmounted] = false;

    if (!this.render[mobxAdminProperty]) {
      // Reaction is re-created automatically during render, but a component can re-mount and skip render #3395.
      // To re-create the reaction and re-subscribe to relevant observables we have to force an update.
      Component.prototype.forceUpdate.call(this);
    }
  });
  patch(target, "componentWillUnmount", function () {

    var reaction = this.render[mobxAdminProperty];

    if (reaction) {
      reaction.dispose(); // Forces reaction to be re-created on next render

      this.render[mobxAdminProperty] = null;
    } else {
      // Render may have been hot-swapped and/or overriden by a subclass.
      var _displayName2 = getDisplayName(this);

      console.warn("The reactive render of an observer class component (" + _displayName2 + ")\n                was overriden after MobX attached. This may result in a memory leak if the\n                overriden reactive render was not properly disposed.");
    }

    this[mobxIsUnmounted] = true;
  });
  return componentClass;
} // Generates a friendly name for debugging


function getDisplayName(comp) {
  return comp.displayName || comp.name || comp.constructor && (comp.constructor.displayName || comp.constructor.name) || "<component>";
}

function createReactiveRender(originalRender) {
  var _this = this;
  /**
   * If props are shallowly modified, react will render anyway,
   * so atom.reportChanged() should not result in yet another re-render
   */


  setHiddenProp(this, skipRenderKey, false);
  /**
   * forceUpdate will re-assign this.props. We don't want that to cause a loop,
   * so detect these changes
   */

  setHiddenProp(this, isForcingUpdateKey, false);
  var initialName = getDisplayName(this);
  var boundOriginalRender = originalRender.bind(this);
  var isRenderingPending = false;

  var createReaction = function createReaction() {
    var reaction = new Reaction(initialName + ".render()", function () {
      if (!isRenderingPending) {
        // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.test.tsx)
        // This unidiomatic React usage but React will correctly warn about this so we continue as usual
        // See #85 / Pull #44
        isRenderingPending = true;

        if (_this[mobxIsUnmounted] !== true) {
          var hasError = true;

          try {
            setHiddenProp(_this, isForcingUpdateKey, true);

            if (!_this[skipRenderKey]) {
              Component.prototype.forceUpdate.call(_this);
            }

            hasError = false;
          } finally {
            setHiddenProp(_this, isForcingUpdateKey, false);

            if (hasError) {
              reaction.dispose(); // Forces reaction to be re-created on next render

              _this.render[mobxAdminProperty] = null;
            }
          }
        }
      }
    });
    reaction["reactComponent"] = _this;
    return reaction;
  };

  function reactiveRender() {
    var _reactiveRender$mobxA;

    isRenderingPending = false; // Create reaction lazily to support re-mounting #3395

    var reaction = (_reactiveRender$mobxA = reactiveRender[mobxAdminProperty]) != null ? _reactiveRender$mobxA : reactiveRender[mobxAdminProperty] = createReaction();
    var exception = undefined;
    var rendering = undefined;
    reaction.track(function () {
      try {
        // TODO@major
        // Optimization: replace with _allowStateChangesStart/End (not available in mobx@6.0.0)
        rendering = allowStateChanges(false, boundOriginalRender);
      } catch (e) {
        exception = e;
      }
    });

    if (exception) {
      throw exception;
    }

    return rendering;
  }

  return reactiveRender;
}

function observerSCU(nextProps, nextState) {


  if (this.state !== nextState) {
    return true;
  } // update if props are shallowly not equal, inspired by PureRenderMixin
  // we could return just 'false' here, and avoid the `skipRender` checks etc
  // however, it is nicer if lifecycle events are triggered like usually,
  // so we return true here if props are shallowly modified.


  return !shallowEqual(this.props, nextProps);
}

function makeObservableProp(target, propName) {
  var valueHolderKey = newSymbol("reactProp_" + propName + "_valueHolder");
  var atomHolderKey = newSymbol("reactProp_" + propName + "_atomHolder");

  function getAtom() {
    if (!this[atomHolderKey]) {
      setHiddenProp(this, atomHolderKey, createAtom("reactive " + propName));
    }

    return this[atomHolderKey];
  }

  Object.defineProperty(target, propName, {
    configurable: true,
    enumerable: true,
    get: function get() {
      var prevReadState = false; // Why this check? BC?
      // @ts-expect-error

      if (allowStateReadsStart && allowStateReadsEnd) {
        prevReadState = allowStateReadsStart(true);
      }

      getAtom.call(this).reportObserved(); // Why this check? BC?
      // @ts-expect-error

      if (allowStateReadsStart && allowStateReadsEnd) {
        allowStateReadsEnd(prevReadState);
      }

      return this[valueHolderKey];
    },
    set: function set(v) {
      if (!this[isForcingUpdateKey] && !shallowEqual(this[valueHolderKey], v)) {
        setHiddenProp(this, valueHolderKey, v);
        setHiddenProp(this, skipRenderKey, true);
        getAtom.call(this).reportChanged();
        setHiddenProp(this, skipRenderKey, false);
      } else {
        setHiddenProp(this, valueHolderKey, v);
      }
    }
  });
}
/**
 * Observer function / decorator
 */


function observer$2(component) {
  if (component["isMobxInjector"] === true) {
    console.warn("Mobx observer: You are trying to use `observer` on a component that already has `inject`. Please apply `observer` before applying `inject`");
  }

  if (Object.prototype.isPrototypeOf.call(Component, component) || Object.prototype.isPrototypeOf.call(PureComponent, component)) {
    // Class component
    return makeClassComponentObserver(component);
  } else {
    // Function component
    return observer$1(component);
  }
}
if (!Component) throw new Error("mobx-react requires React to be available");
if (!observable) throw new Error("mobx-react requires mobx to be available");

configure({ enforceActions: "never" });
class Store {
    constructor(initvalue) {
        this.value = null;
        makeObservable(this, {
            value: observable,
            setValue: action,
        });
        if (initvalue) {
            this.value = initvalue;
        }
    }
    setValue(v) {
        this.value = v;
    }
}

const storeData = new Map();
function useLocalStore(initData, name) {
    if (typeof initData == "string" && name == null) {
        if (initData.startsWith("state:")) {
            name = initData;
            initData = null;
        }
    }
    const localStore = useLocalObservable(() => {
        if (!name) {
            return new Store(initData);
        }
        if (storeData.has(name)) {
            const getStore = storeData.get(name);
            if (initData != null) {
                getStore.setValue(initData);
            }
            return getStore;
        }
        else {
            const newStore = new Store(initData);
            storeData.set(name, newStore);
            return newStore;
        }
    });
    return [
        localStore.value,
        function (item) {
            localStore.setValue(item);
        },
    ];
}
var index = {
    observer: observer$2,
    useLocalStore,
};

export { useMitt$1 as mitt, useProvide as provide, index as store, useReactive, useWatch, utils };
