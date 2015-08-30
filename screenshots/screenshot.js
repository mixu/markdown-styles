var system = require('system');

/**
 * Checks if value is a javascript String
 *
 * @param  mixed  value
 * @return Boolean
 */
function isString(value) {
    'use strict';
    return isType(value, 'string');
}
/**
 * Checks if value is a javascript Number
 *
 * @param  mixed  value
 * @return Boolean
 */
function isNumber(value) {
    'use strict';
    return isType(value, 'number');
}

/**
 * Shorthands for checking if a value is of the given type. Can check for
 * arrays.
 *
 * @param  mixed   what      The value to check
 * @param  String  typeName  The type name ("string", "number", "function", etc.)
 * @return Boolean
 */
function isType(what, typeName) {
    'use strict';
    if (typeof typeName !== 'string' || !typeName) {
        throw new Error('You must pass isType() a typeName string');
    }
    return betterTypeOf(what).toLowerCase() === typeName.toLowerCase();
}


/**
 * Object recursive merging utility.
 *
 * @param  Object  origin  the origin object
 * @param  Object  add     the object to merge data into origin
 * @param  Object  opts    optional options to be passed in
 * @return Object
 */
function mergeObjects(origin, add, opts) {
    'use strict';

    var options = opts || {},
        keepReferences = options.keepReferences;

    if (phantom.casperEngine === 'slimerjs') {
        // Because of an issue in the module system of slimerjs (security membranes?)
        // constructor is undefined.
        // let's use an other algorithm
        return mergeObjectsInGecko(origin, add, options);
    }

    for (var p in add) {
        if (add[p] && add[p].constructor === Object) {
            if (origin[p] && origin[p].constructor === Object) {
                origin[p] = mergeObjects(origin[p], add[p]);
            } else {
                origin[p] = keepReferences ? add[p] : clone(add[p]);
            }
        } else {
            origin[p] = add[p];
        }
    }
    return origin;
}


/**
 * Provides a better typeof operator equivalent, able to retrieve the array
 * type.
 *
 * CAVEAT: this function does not necessarilly map to classical js "type" names,
 * notably a `null` will map to "null" instead of "object".
 *
 * @param  mixed  input
 * @return String
 * @see    http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 */
function betterTypeOf(input) {
    'use strict';
    switch (input) {
        case undefined:
            return 'undefined';
        case null:
            return 'null';
        default:
        try {
            var type = Object.prototype.toString.call(input).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
            if (type === 'object' &&
                phantom.casperEngine !== 'phantomjs' &&
                '__type' in input) {
                type = input.__type;
            }
            // gecko returns window instead of domwindow
            else if (type === 'window') {
                return 'domwindow';
            }
            return type;
        } catch (e) {
            return typeof input;
        }
    }
}

/**
 * Extracts, normalize and organize PhantomJS CLI arguments in a dedicated
 * Object.
 *
 * @param  array  phantomArgs  system.args value
 * @return Object
 */
function parse(phantomArgs) {
    'use strict';
    var extract = {
        args: [],
        options: {},
        raw: {
            args: [],
            options: {}
        },
        drop: function drop(what) {
            if (isNumber(what)) {
                // deleting an arg by its position
                this.args = this.args.filter(function _filter(arg, index) {
                    return index !== what;
                });
                // raw
                if ('raw' in this) {
                    this.raw.args = this.raw.args.filter(function _filter(arg, index) {
                        return index !== what;
                    });
                }
            } else if (isString(what)) {
                // deleting an arg by its value
                this.args = this.args.filter(function _filter(arg) {
                    return arg !== what;
                });
                // deleting an option by its name (key)
                delete this.options[what];
                // raw
                if ('raw' in this) {
                    this.raw.args = this.raw.args.filter(function _filter(arg) {
                        return arg !== what;
                    });
                    delete this.raw.options[what];
                }
            } else {
                throw new Error('Cannot drop argument of type ' + typeof what);
            }
        },
        has: function has(what) {
            if (isNumber(what)) {
                return what in this.args;
            }
            if (isString(what)) {
                return what in this.options;
            }
            throw new Error('Unsupported cli arg tester ' + typeof what);
        },
        get: function get(what, def) {
            if (isNumber(what)) {
                return what in this.args ? this.args[what] : def;
            }
            if (isString(what)) {
                return what in this.options ? this.options[what] : def;
            }
            throw new Error('Unsupported cli arg getter ' + typeof what);
        }
    };
    phantomArgs.forEach(function _forEach(arg) {
        if (arg.indexOf('--') === 0) {
            // named option
            var optionMatch = arg.match(/^--(.*?)=(.*)/i);
            if (optionMatch) {
                extract.options[optionMatch[1]] = castArgument(optionMatch[2]);
                extract.raw.options[optionMatch[1]] = optionMatch[2];
            } else {
                // flag
                var flagMatch = arg.match(/^--(.*)/);
                if (flagMatch) {
                    extract.options[flagMatch[1]] = extract.raw.options[flagMatch[1]] = true;
                }
            }
        } else {
            // positional arg
            extract.args.push(castArgument(arg));
            extract.raw.args.push(arg);
        }
    });
    extract.raw = mergeObjects(extract.raw, {
        drop: function() {
            return extract.drop.apply(extract, arguments);
        },
        has: extract.has,
        get: extract.get
    });
    return extract;
}

/**
 * Cast a string argument to its typed equivalent.
 *
 * @param  String  arg
 * @return Mixed
 */
function castArgument(arg) {
    'use strict';
    if (arg.match(/^-?\d+$/)) {
        return parseInt(arg, 10);
    } else if (arg.match(/^-?\d+\.\d+$/)) {
        return parseFloat(arg);
    } else if (arg.match(/^(true|false)$/i)) {
        return arg.trim().toLowerCase() === 'true' ? true : false;
    } else {
        return arg;
    }
}

var args = parse(system.args);
// console.log(args.get('url'), args.get('out'));



var page = require('webpage').create();
page.viewportSize = { width: 800, height: 600 };
page.evaluate(function() {
    document.body.bgColor = 'white';
});
page.open(args.get('url'), function() {
  page.render(args.get('out'));
  phantom.exit();
});

