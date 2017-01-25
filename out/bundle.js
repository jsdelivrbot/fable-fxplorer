(function (exports) {
'use strict';

var fableGlobal = function () {
    var globalObj = typeof window !== "undefined" ? window
        : (typeof global !== "undefined" ? global
            : (typeof self !== "undefined" ? self : null));
    if (typeof globalObj.__FABLE_CORE__ === "undefined") {
        globalObj.__FABLE_CORE__ = {
            types: new Map(),
            symbols: {
                reflection: Symbol("reflection"),
            }
        };
    }
    return globalObj.__FABLE_CORE__;
}();
function setType(fullName, cons) {
    fableGlobal.types.set(fullName, cons);
}

var _Symbol = (fableGlobal.symbols);

var NonDeclaredType = (function () {
    function NonDeclaredType(kind, definition, generics) {
        this.kind = kind;
        this.definition = definition;
        this.generics = generics;
    }
    NonDeclaredType.prototype.Equals = function (other) {
        if (this.kind === other.kind && this.definition === other.definition) {
            return typeof this.generics === "object"
                ? equalsRecords(this.generics, other.generics)
                : this.generics === other.generics;
        }
        return false;
    };
    return NonDeclaredType;
}());
var Any = new NonDeclaredType("Any");
var Unit = new NonDeclaredType("Unit");

function FableArray(t, isTypedArray) {
    if (isTypedArray === void 0) { isTypedArray = false; }
    var def = null, genArg = null;
    if (isTypedArray) {
        def = t;
    }
    else {
        genArg = t;
    }
    return new NonDeclaredType("Array", def, genArg);
}
function Tuple(ts) {
    return new NonDeclaredType("Tuple", null, ts);
}

function Interface(definition) {
    return new NonDeclaredType("Interface", definition);
}




function hasInterface(obj, interfaceName) {
    if (interfaceName === "System.Collections.Generic.IEnumerable") {
        return typeof obj[Symbol.iterator] === "function";
    }
    else if (typeof obj[_Symbol.reflection] === "function") {
        var interfaces = obj[_Symbol.reflection]().interfaces;
        return Array.isArray(interfaces) && interfaces.indexOf(interfaceName) > -1;
    }
    return false;
}


function toString(o) {
    return o != null && typeof o.ToString == "function" ? o.ToString() : String(o);
}

function equals(x, y) {
    if (x === y)
        return true;
    else if (x == null)
        return y == null;
    else if (y == null)
        return false;
    else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y))
        return false;
    else if (typeof x.Equals === "function")
        return x.Equals(y);
    else if (Array.isArray(x)) {
        if (x.length != y.length)
            return false;
        for (var i = 0; i < x.length; i++)
            if (!equals(x[i], y[i]))
                return false;
        return true;
    }
    else if (ArrayBuffer.isView(x)) {
        if (x.byteLength !== y.byteLength)
            return false;
        var dv1 = new DataView(x.buffer), dv2 = new DataView(y.buffer);
        for (var i = 0; i < x.byteLength; i++)
            if (dv1.getUint8(i) !== dv2.getUint8(i))
                return false;
        return true;
    }
    else if (x instanceof Date)
        return x.getTime() == y.getTime();
    else
        return false;
}
function compare(x, y) {
    if (x === y)
        return 0;
    if (x == null)
        return y == null ? 0 : -1;
    else if (y == null)
        return 1;
    else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y))
        return -1;
    else if (typeof x.CompareTo === "function")
        return x.CompareTo(y);
    else if (Array.isArray(x)) {
        if (x.length != y.length)
            return x.length < y.length ? -1 : 1;
        for (var i = 0, j = 0; i < x.length; i++)
            if ((j = compare(x[i], y[i])) !== 0)
                return j;
        return 0;
    }
    else if (ArrayBuffer.isView(x)) {
        if (x.byteLength != y.byteLength)
            return x.byteLength < y.byteLength ? -1 : 1;
        var dv1 = new DataView(x.buffer), dv2 = new DataView(y.buffer);
        for (var i = 0, b1 = 0, b2 = 0; i < x.byteLength; i++) {
            b1 = dv1.getUint8(i), b2 = dv2.getUint8(i);
            if (b1 < b2)
                return -1;
            if (b1 > b2)
                return 1;
        }
        return 0;
    }
    else if (x instanceof Date)
        return compare(x.getTime(), y.getTime());
    else
        return x < y ? -1 : 1;
}
function equalsRecords(x, y) {
    if (x === y) {
        return true;
    }
    else {
        var keys = Object.getOwnPropertyNames(x);
        for (var i = 0; i < keys.length; i++) {
            if (!equals(x[keys[i]], y[keys[i]]))
                return false;
        }
        return true;
    }
}
function compareRecords(x, y) {
    if (x === y) {
        return 0;
    }
    else {
        var keys = Object.getOwnPropertyNames(x);
        for (var i = 0; i < keys.length; i++) {
            var res = compare(x[keys[i]], y[keys[i]]);
            if (res !== 0)
                return res;
        }
        return 0;
    }
}
function equalsUnions(x, y) {
    if (x === y) {
        return true;
    }
    else if (x.Case !== y.Case) {
        return false;
    }
    else {
        for (var i = 0; i < x.Fields.length; i++) {
            if (!equals(x.Fields[i], y.Fields[i]))
                return false;
        }
        return true;
    }
}
function compareUnions(x, y) {
    if (x === y) {
        return 0;
    }
    else {
        var res = compare(x.Case, y.Case);
        if (res !== 0)
            return res;
        for (var i = 0; i < x.Fields.length; i++) {
            res = compare(x.Fields[i], y.Fields[i]);
            if (res !== 0)
                return res;
        }
        return 0;
    }
}

function ofArray(args, base) {
    var acc = base || new List$1();
    for (var i = args.length - 1; i >= 0; i--) {
        acc = new List$1(args[i], acc);
    }
    return acc;
}
var List$1 = (function () {
    function List(head, tail) {
        this.head = head;
        this.tail = tail;
    }
    List.prototype.ToString = function () {
        return "[" + Array.from(this).map(toString).join("; ") + "]";
    };
    List.prototype.Equals = function (x) {
        if (this === x) {
            return true;
        }
        else {
            var iter1 = this[Symbol.iterator](), iter2 = x[Symbol.iterator]();
            for (;;) {
                var cur1 = iter1.next(), cur2 = iter2.next();
                if (cur1.done)
                    return cur2.done ? true : false;
                else if (cur2.done)
                    return false;
                else if (!equals(cur1.value, cur2.value))
                    return false;
            }
        }
    };
    List.prototype.CompareTo = function (x) {
        if (this === x) {
            return 0;
        }
        else {
            var acc = 0;
            var iter1 = this[Symbol.iterator](), iter2 = x[Symbol.iterator]();
            for (;;) {
                var cur1 = iter1.next(), cur2 = iter2.next();
                if (cur1.done)
                    return cur2.done ? acc : -1;
                else if (cur2.done)
                    return 1;
                else {
                    acc = compare(cur1.value, cur2.value);
                    if (acc != 0)
                        return acc;
                }
            }
        }
    };
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            var cur = this, acc = 0;
            while (cur.tail != null) {
                cur = cur.tail;
                acc++;
            }
            return acc;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype[Symbol.iterator] = function () {
        var cur = this;
        return {
            next: function () {
                var tmp = cur;
                cur = cur.tail;
                return { done: tmp.tail == null, value: tmp.head };
            }
        };
    };
    List.prototype[_Symbol.reflection] = function () {
        return {
            type: "Microsoft.FSharp.Collections.FSharpList",
            interfaces: ["System.IEquatable", "System.IComparable"]
        };
    };
    return List;
}());

var Enumerator = (function () {
    function Enumerator(iter) {
        this.iter = iter;
    }
    Enumerator.prototype.MoveNext = function () {
        var cur = this.iter.next();
        this.current = cur.value;
        return !cur.done;
    };
    Object.defineProperty(Enumerator.prototype, "Current", {
        get: function () {
            return this.current;
        },
        enumerable: true,
        configurable: true
    });
    Enumerator.prototype.Reset = function () {
        throw new Error("JS iterators cannot be reset");
    };
    Enumerator.prototype.Dispose = function () { };
    return Enumerator;
}());


function toList(xs) {
    return foldBack(function (x, acc) {
        return new List$1(x, acc);
    }, xs, new List$1());
}





function concat$1(xs) {
    return delay(function () {
        var iter = xs[Symbol.iterator]();
        var output = null;
        return unfold(function (innerIter) {
            var hasFinished = false;
            while (!hasFinished) {
                if (innerIter == null) {
                    var cur = iter.next();
                    if (!cur.done) {
                        innerIter = cur.value[Symbol.iterator]();
                    }
                    else {
                        hasFinished = true;
                    }
                }
                else {
                    var cur = innerIter.next();
                    if (!cur.done) {
                        output = cur.value;
                        hasFinished = true;
                    }
                    else {
                        innerIter = null;
                    }
                }
            }
            return innerIter != null && output != null ? [output, innerIter] : null;
        }, null);
    });
}


function compareWith(f, xs, ys) {
    var nonZero = tryFind(function (i) { return i != 0; }, map2(function (x, y) { return f(x, y); }, xs, ys));
    return nonZero != null ? nonZero : count(xs) - count(ys);
}
function delay(f) {
    return _a = {},
        _a[Symbol.iterator] = function () { return f()[Symbol.iterator](); },
        _a;
    var _a;
}










function fold(f, acc, xs) {
    if (Array.isArray(xs) || ArrayBuffer.isView(xs)) {
        return xs.reduce(f, acc);
    }
    else {
        var cur = void 0;
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            cur = iter.next();
            if (cur.done)
                break;
            acc = f(acc, cur.value, i);
        }
        return acc;
    }
}
function foldBack(f, xs, acc) {
    var arr = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
    for (var i = arr.length - 1; i >= 0; i--) {
        acc = f(arr[i], acc, i);
    }
    return acc;
}

















function count(xs) {
    return Array.isArray(xs) || ArrayBuffer.isView(xs)
        ? xs.length
        : fold(function (acc, x) { return acc + 1; }, 0, xs);
}
function map$1(f, xs) {
    return delay(function () { return unfold(function (iter) {
        var cur = iter.next();
        return !cur.done ? [f(cur.value), iter] : null;
    }, xs[Symbol.iterator]()); });
}

function map2(f, xs, ys) {
    return delay(function () {
        var iter1 = xs[Symbol.iterator]();
        var iter2 = ys[Symbol.iterator]();
        return unfold(function () {
            var cur1 = iter1.next(), cur2 = iter2.next();
            return !cur1.done && !cur2.done ? [f(cur1.value, cur2.value), null] : null;
        });
    });
}














function reduce(f, xs) {
    if (Array.isArray(xs) || ArrayBuffer.isView(xs))
        return xs.reduce(f);
    var iter = xs[Symbol.iterator]();
    var cur = iter.next();
    if (cur.done)
        throw new Error("Seq was empty");
    var acc = cur.value;
    for (;;) {
        cur = iter.next();
        if (cur.done)
            break;
        acc = f(acc, cur.value);
    }
    return acc;
}





function singleton$1(x) {
    return unfold(function (x) { return x != null ? [x, null] : null; }, x);
}









function tryFind(f, xs, defaultValue) {
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done)
            return defaultValue === void 0 ? null : defaultValue;
        if (f(cur.value, i))
            return cur.value;
    }
}









function unfold(f, acc) {
    return _a = {},
        _a[Symbol.iterator] = function () {
            return {
                next: function () {
                    var res = f(acc);
                    if (res != null) {
                        acc = res[1];
                        return { done: false, value: res[0] };
                    }
                    return { done: true };
                }
            };
        },
        _a;
    var _a;
}

var MapTree = (function () {
    function MapTree(caseName, fields) {
        this.Case = caseName;
        this.Fields = fields;
    }
    return MapTree;
}());
function tree_sizeAux(acc, m) {
    return m.Case === "MapOne"
        ? acc + 1
        : m.Case === "MapNode"
            ? tree_sizeAux(tree_sizeAux(acc + 1, m.Fields[2]), m.Fields[3])
            : acc;
}
function tree_size(x) {
    return tree_sizeAux(0, x);
}

function tree_find(comparer, k, m) {
    var res = tree_tryFind(comparer, k, m);
    if (res != null)
        return res;
    throw new Error("key not found");
}
function tree_tryFind(comparer, k, m) {
    if (m.Case === "MapOne") {
        var c = comparer.Compare(k, m.Fields[0]);
        return c === 0 ? m.Fields[1] : null;
    }
    else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_tryFind(comparer, k, m.Fields[2]);
        }
        else {
            if (c === 0) {
                return m.Fields[1];
            }
            else {
                return tree_tryFind(comparer, k, m.Fields[3]);
            }
        }
    }
    return null;
}
function tree_mem(comparer, k, m) {
    if (m.Case === "MapOne") {
        return comparer.Compare(k, m.Fields[0]) === 0;
    }
    else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_mem(comparer, k, m.Fields[2]);
        }
        else {
            if (c === 0) {
                return true;
            }
            else {
                return tree_mem(comparer, k, m.Fields[3]);
            }
        }
    }
    else {
        return false;
    }
}
function tree_collapseLHS(stack) {
    if (stack.tail != null) {
        if (stack.head.Case === "MapOne") {
            return stack;
        }
        else if (stack.head.Case === "MapNode") {
            return tree_collapseLHS(ofArray([
                stack.head.Fields[2],
                new MapTree("MapOne", [stack.head.Fields[0], stack.head.Fields[1]]),
                stack.head.Fields[3]
            ], stack.tail));
        }
        else {
            return tree_collapseLHS(stack.tail);
        }
    }
    else {
        return new List$1();
    }
}
function tree_mkIterator(s) {
    return { stack: tree_collapseLHS(new List$1(s, new List$1())), started: false };
}
function tree_moveNext(i) {
    function current(i) {
        if (i.stack.tail == null) {
            return null;
        }
        else if (i.stack.head.Case === "MapOne") {
            return [i.stack.head.Fields[0], i.stack.head.Fields[1]];
        }
        throw new Error("Please report error: Map iterator, unexpected stack for current");
    }
    if (i.started) {
        if (i.stack.tail == null) {
            return { done: true, value: null };
        }
        else {
            if (i.stack.head.Case === "MapOne") {
                i.stack = tree_collapseLHS(i.stack.tail);
                return {
                    done: i.stack.tail == null,
                    value: current(i)
                };
            }
            else {
                throw new Error("Please report error: Map iterator, unexpected stack for moveNext");
            }
        }
    }
    else {
        i.started = true;
        return {
            done: i.stack.tail == null,
            value: current(i)
        };
    }
    
}
var FableMap = (function () {
    function FableMap() {
    }
    FableMap.prototype.ToString = function () {
        return "map [" + Array.from(this).map(toString).join("; ") + "]";
    };
    FableMap.prototype.Equals = function (m2) {
        return this.CompareTo(m2) === 0;
    };
    FableMap.prototype.CompareTo = function (m2) {
        var _this = this;
        return this === m2 ? 0 : compareWith(function (kvp1, kvp2) {
            var c = _this.comparer.Compare(kvp1[0], kvp2[0]);
            return c !== 0 ? c : compare(kvp1[1], kvp2[1]);
        }, this, m2);
    };
    FableMap.prototype[Symbol.iterator] = function () {
        var i = tree_mkIterator(this.tree);
        return {
            next: function () { return tree_moveNext(i); }
        };
    };
    FableMap.prototype.entries = function () {
        return this[Symbol.iterator]();
    };
    FableMap.prototype.keys = function () {
        return map$1(function (kv) { return kv[0]; }, this);
    };
    FableMap.prototype.values = function () {
        return map$1(function (kv) { return kv[1]; }, this);
    };
    FableMap.prototype.get = function (k) {
        return tree_find(this.comparer, k, this.tree);
    };
    FableMap.prototype.has = function (k) {
        return tree_mem(this.comparer, k, this.tree);
    };
    FableMap.prototype.set = function (k, v) {
        throw new Error("not supported");
    };
    FableMap.prototype.delete = function (k) {
        throw new Error("not supported");
    };
    FableMap.prototype.clear = function () {
        throw new Error("not supported");
    };
    Object.defineProperty(FableMap.prototype, "size", {
        get: function () {
            return tree_size(this.tree);
        },
        enumerable: true,
        configurable: true
    });
    FableMap.prototype[_Symbol.reflection] = function () {
        return {
            type: "Microsoft.FSharp.Collections.FSharpMap",
            interfaces: ["System.IEquatable", "System.IComparable", "System.Collections.Generic.IDictionary"]
        };
    };
    return FableMap;
}());

function choose$$1(f, xs) {
    var r = fold(function (acc, x) {
        var y = f(x);
        return y != null ? new List$1(y, acc) : acc;
    }, new List$1(), xs);
    return reverse$$1(r);
}









function reverse$$1(xs) {
    return fold(function (acc, x) { return new List$1(x, acc); }, new List$1(), xs);
}

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Globals = function () {
    function Globals() {
        _classCallCheck$1(this, Globals);
    }

    _createClass$1(Globals, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Fable.Import.Globals",
                properties: {
                    m: Interface("Fable.Import.MithrilBase.Static")
                }
            };
        }
    }]);

    return Globals;
}();
setType("Fable.Import.Globals", Globals);
var Mithril = function (__exports) {
    var m = __exports.m = require("mithril");

    var _VirtualElement___ = __exports["|VirtualElement|_|"] = function (o) {
        if (o.tag != null) {
            return o;
        }
    };

    var elem = __exports.elem = function (tagName, attr, children) {
        var c = Array.from(choose$$1(function (x) {
            if (typeof x === "string") {
                var s = x;
                return s;
            } else {
                var activePatternResult83 = _VirtualElement___(x);

                if (activePatternResult83 != null) {
                    var v = activePatternResult83;
                    return v;
                } else if (hasInterface(x, "Fable.Import.MithrilBase.Component")) {
                    var _c = x;
                    return _c;
                }
            }
        }, children));
        var ve = attr == null ? m.apply(undefined, [tagName].concat(_toConsumableArray(c))) : m.apply(undefined, [tagName, attr].concat(_toConsumableArray(c)));
        return ve;
    };

    var onEvent = __exports.onEvent = function (eventType, f) {
        return [eventType, function (delegateArg0) {
            f(delegateArg0);
        }];
    };

    var attr = __exports.attr = function (ls) {
        var a = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = ls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var forLoopVar = _step.value;

                if (typeof forLoopVar[1] === "string") {
                    var o2 = forLoopVar[1];

                    if (forLoopVar[0] === "class") {
                        a.className = o2;
                    } else {
                        a[forLoopVar[0]] = forLoopVar[1];
                    }
                } else {
                    a[forLoopVar[0]] = forLoopVar[1];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return a;
    };

    var event = __exports.event = function (evt, v, func) {
        var f = function f(a) {
            return func(a);
        };

        return [evt, m.withAttr(v, function (delegateArg0) {
            return f(delegateArg0);
        })];
    };

    var bindattr = __exports.bindattr = function (str, func) {
        var f = function f(a) {
            return func(a);
        };

        var s = m.withAttr(str, function (delegateArg0) {
            return f(delegateArg0);
        });
        return function (e) {
            s(e);
        };
    };

    var cls = __exports.cls = function (str) {
        return ["class", str];
    };

    var name = __exports.name = function (str) {
        return ["name", str];
    };

    var css = __exports.css = function (ls) {
        var s = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = ls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var forLoopVar = _step2.value;
                s.key = forLoopVar[1];
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return ["style", s];
    };

    var newComponent = __exports.newComponent = function (c, v) {
        var o = {};

        o.controller = function (x) {
            return c(x);
        };

        o.view = v;
        return o;
    };

    var mount = __exports.mount = function (elm, componen) {
        return m.mount(elm, componen);
    };

    var property = __exports.property = function (ob) {
        return m.prop(ob);
    };

    var prom = __exports.prom = function (ob) {
        return m.prop(ob);
    };

    var routeComponent = __exports.routeComponent = function (elm, root, routes) {
        m.route(elm, root, routes);
    };

    var route = __exports.route = function () {
        var objectArg = m;
        return function (arg00) {
            objectArg.route(arg00);
        };
    };

    var reroute = __exports.reroute = function (route_1) {
        m.route(route_1);
    };

    var defmodule = __exports.defmodule = function (elm, componen) {
        return m.module(elm, componen);
    };

    var defcomponent = __exports.defcomponent = function (componen, args) {
        return m.component.apply(m, [componen].concat(_toConsumableArray(args)));
    };

    var redraw = __exports.redraw = function () {
        m.redraw(true);
    };

    var trust = __exports.trust = function (html) {
        return m.trust(html);
    };

    var redrawStrategy = __exports.redrawStrategy = function (rdw) {
        m.redraw.strategy(rdw);
    };

    var render = __exports.render = function (elm, children) {
        m.render(elm, children);
    };

    var forceRender = __exports.forceRender = function (elm, children, force) {
        m.render(elm, children, force);
    };

    var requestJSON = __exports.requestJSON = function (opt) {
        return m.request(opt);
    };

    var requestXHR = __exports.requestXHR = function (opt) {
        return m.request(opt);
    };

    var sync = __exports.sync = function (promises) {
        return m.sync(promises);
    };

    var startComputation = __exports.startComputation = function () {
        m.startComputation();
    };

    var endComputation = __exports.endComputation = function () {
        m.endComputation();
    };

    return __exports;
}({});

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rad = function () {
    function rad() {
        _classCallCheck$2(this, rad);
    }

    _createClass$2(rad, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.rad",
                properties: {}
            };
        }
    }]);

    return rad;
}();
setType("Types.rad", rad);

var NodeType = function () {
    function NodeType(caseName, fields) {
        _classCallCheck$2(this, NodeType);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass$2(NodeType, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.NodeType",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    TBranch: [],
                    TLeaf: [],
                    TRoot: []
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return equalsUnions(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return compareUnions(this, other);
        }
    }]);

    return NodeType;
}();
setType("Types.NodeType", NodeType);
var NodeData = function () {
    function NodeData(distance, ar, angle, pos, scale) {
        _classCallCheck$2(this, NodeData);

        this.distance = distance;
        this.ar = ar;
        this.angle = angle;
        this.pos = pos;
        this.scale = scale;
    }

    _createClass$2(NodeData, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.NodeData",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    distance: "number",
                    ar: "number",
                    angle: "number",
                    pos: Tuple(["number", "number"]),
                    scale: "number"
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return equalsRecords(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return compareRecords(this, other);
        }
    }]);

    return NodeData;
}();
setType("Types.NodeData", NodeData);

var _Element = function () {
    function _Element(caseName, fields) {
        _classCallCheck$2(this, _Element);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass$2(_Element, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.Element",
                interfaces: ["FSharpUnion", "System.IEquatable"],
                cases: {
                    TextBox: ["string"],
                    Tree: [FableArray(_Node)]
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return equalsUnions(this, other);
        }
    }]);

    return _Element;
}();

setType("Types.Element", _Element);

var _Node = function () {
    function _Node(key, parent, data, element, ntype, scale, position, size, extsize) {
        _classCallCheck$2(this, _Node);

        this.key = key;
        this.parent = parent;
        this.data = data;
        this.element = element;
        this.ntype = ntype;
        this.scale = scale;
        this.position = position;
        this.size = size;
        this.extsize = extsize;
    }

    _createClass$2(_Node, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.Node",
                interfaces: ["FSharpRecord", "System.IEquatable"],
                properties: {
                    key: "number",
                    parent: "number",
                    data: NodeData,
                    element: _Element,
                    ntype: NodeType,
                    scale: Interface("Fable.Import.MithrilBase.Property"),
                    position: Interface("Fable.Import.MithrilBase.Property"),
                    size: Interface("Fable.Import.MithrilBase.Property"),
                    extsize: Interface("Fable.Import.MithrilBase.Property")
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return equalsRecords(this, other);
        }
    }]);

    return _Node;
}();

setType("Types.Node", _Node);
var Params = function () {
    function Params(div_tree_threshold, parent_to_children_scaling, ar_scaleing, sort) {
        _classCallCheck$2(this, Params);

        this.div_tree_threshold = div_tree_threshold;
        this.parent_to_children_scaling = parent_to_children_scaling;
        this.ar_scaleing = ar_scaleing;
        this.sort = sort;
    }

    _createClass$2(Params, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.Params",
                interfaces: ["FSharpRecord"],
                properties: {
                    div_tree_threshold: "number",
                    parent_to_children_scaling: "number",
                    ar_scaleing: "number",
                    sort: "function"
                }
            };
        }
    }]);

    return Params;
}();
setType("Types.Params", Params);
var newND = new NodeData(0, 0, 0, [0, 0], 0);
function newNode(key, parent, element, ntype) {
    var scale = Mithril.property(1);
    var size = Mithril.property(1);
    return new _Node(key, parent, newND, element, ntype, scale, Mithril.property([0, 0]), size, Mithril.property(1));
}

var Long = (function () {
    function Long(low, high, unsigned) {
        this.eq = this.equals;
        this.neq = this.notEquals;
        this.lt = this.lessThan;
        this.lte = this.lessThanOrEqual;
        this.gt = this.greaterThan;
        this.gte = this.greaterThanOrEqual;
        this.comp = this.compare;
        this.neg = this.negate;
        this.abs = this.absolute;
        this.sub = this.subtract;
        this.mul = this.multiply;
        this.div = this.divide;
        this.mod = this.modulo;
        this.shl = this.shiftLeft;
        this.shr = this.shiftRight;
        this.shru = this.shiftRightUnsigned;
        this.Equals = this.equals;
        this.CompareTo = this.compare;
        this.ToString = this.toString;
        this.low = low | 0;
        this.high = high | 0;
        this.unsigned = !!unsigned;
    }
    Long.prototype.toInt = function () {
        return this.unsigned ? this.low >>> 0 : this.low;
    };
    Long.prototype.toNumber = function () {
        if (this.unsigned)
            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    Long.prototype.toString = function (radix) {
        if (radix === void 0) { radix = 10; }
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) {
            if (this.eq(MIN_VALUE)) {
                var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            }
            else
                return '-' + this.neg().toString(radix);
        }
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero())
                return digits + result;
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    };
    Long.prototype.getHighBits = function () {
        return this.high;
    };
    Long.prototype.getHighBitsUnsigned = function () {
        return this.high >>> 0;
    };
    Long.prototype.getLowBits = function () {
        return this.low;
    };
    Long.prototype.getLowBitsUnsigned = function () {
        return this.low >>> 0;
    };
    Long.prototype.getNumBitsAbs = function () {
        if (this.isNegative())
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) != 0)
                break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };
    Long.prototype.isZero = function () {
        return this.high === 0 && this.low === 0;
    };
    Long.prototype.isNegative = function () {
        return !this.unsigned && this.high < 0;
    };
    Long.prototype.isPositive = function () {
        return this.unsigned || this.high >= 0;
    };
    Long.prototype.isOdd = function () {
        return (this.low & 1) === 1;
    };
    Long.prototype.isEven = function () {
        return (this.low & 1) === 0;
    };
    Long.prototype.equals = function (other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    };
    Long.prototype.notEquals = function (other) {
        return !this.eq(other);
    };
    Long.prototype.lessThan = function (other) {
        return this.comp(other) < 0;
    };
    Long.prototype.lessThanOrEqual = function (other) {
        return this.comp(other) <= 0;
    };
    Long.prototype.greaterThan = function (other) {
        return this.comp(other) > 0;
    };
    Long.prototype.greaterThanOrEqual = function (other) {
        return this.comp(other) >= 0;
    };
    Long.prototype.compare = function (other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.eq(other))
            return 0;
        var thisNeg = this.isNegative(), otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    };
    Long.prototype.negate = function () {
        if (!this.unsigned && this.eq(MIN_VALUE))
            return MIN_VALUE;
        return this.not().add(ONE);
    };
    Long.prototype.absolute = function () {
        if (!this.unsigned && this.isNegative())
            return this.negate();
        else
            return this;
    };
    Long.prototype.add = function (addend) {
        if (!isLong(addend))
            addend = fromValue(addend);
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;
        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };
    Long.prototype.subtract = function (subtrahend) {
        if (!isLong(subtrahend))
            subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };
    Long.prototype.multiply = function (multiplier) {
        if (this.isZero())
            return ZERO;
        if (!isLong(multiplier))
            multiplier = fromValue(multiplier);
        if (multiplier.isZero())
            return ZERO;
        if (this.eq(MIN_VALUE))
            return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE))
            return this.isOdd() ? MIN_VALUE : ZERO;
        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        }
        else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;
        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };
    Long.prototype.divide = function (divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        if (divisor.isZero())
            throw Error('division by zero');
        if (this.isZero())
            return this.unsigned ? UZERO : ZERO;
        var approx = 0, rem = ZERO, res = ZERO;
        if (!this.unsigned) {
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                    return MIN_VALUE;
                else if (divisor.eq(MIN_VALUE))
                    return ONE;
                else {
                    var halfThis = this.shr(1);
                    var approx_1 = halfThis.div(divisor).shl(1);
                    if (approx_1.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    }
                    else {
                        rem = this.sub(divisor.mul(approx_1));
                        res = approx_1.add(rem.div(divisor));
                        return res;
                    }
                }
            }
            else if (divisor.eq(MIN_VALUE))
                return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            }
            else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = ZERO;
        }
        else {
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return UZERO;
            if (divisor.gt(this.shru(1)))
                return UONE;
            res = UZERO;
        }
        rem = this;
        while (rem.gte(divisor)) {
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }
            if (approxRes.isZero())
                approxRes = ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };
    Long.prototype.modulo = function (divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };
    
    Long.prototype.not = function () {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };
    
    Long.prototype.and = function (other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    Long.prototype.or = function (other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    Long.prototype.xor = function (other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    Long.prototype.shiftLeft = function (numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits = numBits & 63;
        if (numBits === 0)
            return this;
        else if (numBits < 32)
            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return fromBits(0, this.low << (numBits - 32), this.unsigned);
    };
    Long.prototype.shiftRight = function (numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits = numBits & 63;
        if (numBits === 0)
            return this;
        else if (numBits < 32)
            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    };
    Long.prototype.shiftRightUnsigned = function (numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits = numBits & 63;
        if (numBits === 0)
            return this;
        else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            }
            else if (numBits === 32)
                return fromBits(high, 0, this.unsigned);
            else
                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    };
    Long.prototype.toSigned = function () {
        if (!this.unsigned)
            return this;
        return fromBits(this.low, this.high, false);
    };
    Long.prototype.toUnsigned = function () {
        if (this.unsigned)
            return this;
        return fromBits(this.low, this.high, true);
    };
    Long.prototype.toBytes = function (le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    };
    Long.prototype.toBytesLE = function () {
        var hi = this.high, lo = this.low;
        return [
            lo & 0xff,
            (lo >>> 8) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 24) & 0xff,
            hi & 0xff,
            (hi >>> 8) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 24) & 0xff
        ];
    };
    Long.prototype.toBytesBE = function () {
        var hi = this.high, lo = this.low;
        return [
            (hi >>> 24) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 8) & 0xff,
            hi & 0xff,
            (lo >>> 24) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 8) & 0xff,
            lo & 0xff
        ];
    };
    Long.prototype[_Symbol.reflection] = function () {
        return {
            type: "System.Int64",
            interfaces: ["FSharpRecord", "System.IComparable"],
            properties: {
                low: "number",
                high: "number",
                unsigned: "boolean"
            }
        };
    };
    return Long;
}());
var INT_CACHE = {};
var UINT_CACHE = {};
function isLong(obj) {
    return (obj && obj instanceof Long);
}
function fromInt(value, unsigned) {
    if (unsigned === void 0) { unsigned = false; }
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    }
    else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}
function fromNumber(value, unsigned) {
    if (unsigned === void 0) { unsigned = false; }
    if (isNaN(value) || !isFinite(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    }
    else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}
var pow_dbl = Math.pow;
function fromString(str, unsigned, radix) {
    if (unsigned === void 0) { unsigned = false; }
    if (radix === void 0) { radix = 10; }
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        radix = unsigned,
            unsigned = false;
    }
    else {
        unsigned = !!unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    var p = str.indexOf('-');
    if (p > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }
    var radixToPower = fromNumber(pow_dbl(radix, 8));
    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        }
        else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}
function fromValue(val) {
    if (val instanceof Long)
        return val;
    if (typeof val === 'number')
        return fromNumber(val);
    if (typeof val === 'string')
        return fromString(val);
    return fromBits(val.low, val.high, val.unsigned);
}
var TWO_PWR_16_DBL = 1 << 16;
var TWO_PWR_24_DBL = 1 << 24;
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
var ZERO = fromInt(0);
var UZERO = fromInt(0, true);
var ONE = fromInt(1);
var UONE = fromInt(1, true);
var NEG_ONE = fromInt(-1);
var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);
var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);

var fsFormatRegExp = /(^|[^%])%([0+ ]*)(-?\d+)?(?:\.(\d+))?(\w)/;



function toHex(value) {
    return value < 0
        ? "ff" + (16777215 - (Math.abs(value) - 1)).toString(16)
        : value.toString(16);
}
function fsFormat(str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var _cont;
    function isObject(x) {
        return x !== null && typeof x === "object" && !(x instanceof Number) && !(x instanceof String) && !(x instanceof Boolean);
    }
    function formatOnce(str, rep) {
        return str.replace(fsFormatRegExp, function (_, prefix, flags, pad, precision, format) {
            switch (format) {
                case "f":
                case "F":
                    rep = rep.toFixed(precision || 6);
                    break;
                case "g":
                case "G":
                    rep = rep.toPrecision(precision);
                    break;
                case "e":
                case "E":
                    rep = rep.toExponential(precision);
                    break;
                case "O":
                    rep = toString(rep);
                    break;
                case "A":
                    try {
                        rep = JSON.stringify(rep, function (k, v) {
                            return v && v[Symbol.iterator] && !Array.isArray(v) && isObject(v) ? Array.from(v)
                                : v && typeof v.ToString === "function" ? toString(v) : v;
                        });
                    }
                    catch (err) {
                        rep = "{" + Object.getOwnPropertyNames(rep).map(function (k) { return k + ": " + String(rep[k]); }).join(", ") + "}";
                    }
                    break;
                case "x":
                    rep = toHex(Number(rep));
                    break;
                case "X":
                    rep = toHex(Number(rep)).toUpperCase();
                    break;
            }
            var plusPrefix = flags.indexOf("+") >= 0 && parseInt(rep) >= 0;
            if (!isNaN(pad = parseInt(pad))) {
                var ch = pad >= 0 && flags.indexOf("0") >= 0 ? "0" : " ";
                rep = padLeft(rep, Math.abs(pad) - (plusPrefix ? 1 : 0), ch, pad < 0);
            }
            var once = prefix + (plusPrefix ? "+" + rep : rep);
            return once.replace(/%/g, "%%");
        });
    }
    function makeFn(str) {
        return function (rep) {
            var str2 = formatOnce(str, rep);
            return fsFormatRegExp.test(str2)
                ? makeFn(str2) : _cont(str2.replace(/%%/g, "%"));
        };
    }
    if (args.length === 0) {
        return function (cont) {
            _cont = cont;
            return fsFormatRegExp.test(str) ? makeFn(str) : _cont(str);
        };
    }
    else {
        for (var i = 0; i < args.length; i++) {
            str = formatOnce(str, args[i]);
        }
        return str.replace(/%%/g, "%");
    }
}








function padLeft(str, len, ch, isRight) {
    ch = ch || " ";
    str = String(str);
    len = len - str.length;
    for (var i = -1; ++i < len;)
        str = isRight ? str + ch : ch + str;
    return str;
}

function children(k, tree) {
    return tree.filter(function (x) {
        return x.parent === k;
    });
}



function root(tree) {
    return tree.find(function (x) {
        var matchValue = x.ntype;

        if (matchValue.Case === "TLeaf") {
            return false;
        } else if (matchValue.Case === "TBranch") {
            return false;
        } else {
            return true;
        }
    });
}














function calc_leafs(p, tree) {
    var big = Array.from(concat$1(tree.map(function (x) {
        var matchValue = x.element;

        if (matchValue.Case === "Tree") {
            return matchValue.Fields[0];
        } else {
            return Array.from(singleton$1(x));
        }
    })));

    var dig = function dig(k) {
        return function (d) {
            return function (tree_1) {
                var c = children(k.key, tree_1);
                var c2 = Array.from(concat$1(c.map(function (x) {
                    return dig(x)(d + 1)(tree_1);
                })));

                if (c.length > p.div_tree_threshold) {
                    k.ntype = new NodeType("TLeaf", []);
                    k.element = new _Element("Tree", [c2]);
                } else if (c.length > 0) {
                    k.ntype = new NodeType("TBranch", []);
                } else {
                    k.ntype = new NodeType("TLeaf", []);
                }

                return [k].concat(c2);
            };
        };
    };

    return dig(root(tree))(0)(big);
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    _createClass(Point, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "UILogic.Point",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    x: "number",
                    y: "number"
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return equalsRecords(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return compareRecords(this, other);
        }
    }]);

    return Point;
}();
setType("UILogic.Point", Point);
function point(_x, _y) {
    return new Point(_x, _y);
}
var Engine = function () {
    _createClass(Engine, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "UILogic.Engine",
                interfaces: ["Fable.Import.MithrilBase.Controller"],
                properties: {
                    Config: Interface("Fable.Import.MithrilBase.BasicProperty"),
                    Tree: Interface("Fable.Import.MithrilBase.BasicProperty")
                }
            };
        }
    }]);

    function Engine(t, c) {
        _classCallCheck(this, Engine);

        this.config = Mithril.property(c);
        this.tree = Mithril.property(t);
        this.scale = Mithril.property(0);
        this.translation = Mithril.property(point(0, 0));
        this.lastDragPoint = null;
        this.lastMousePositionOnTarget = null;
        this.lastCenterPositionOnTarget = null;
    }

    _createClass(Engine, [{
        key: "Resize",
        value: function (key, size$$1) {
            var index = this.tree().findIndex(function (x) {
                return x.key === key;
            });
            this.tree()[index].size(size$$1);
        }
    }, {
        key: "Add",
        value: function (parent$$1) {
            var nkey = 1 + reduce(function (f) {
                return function (x, y) {
                    return f(x) > f(y) ? x : y;
                };
            }(function (x) {
                return x.key;
            }), this.tree()).key;
            var name = "new.txt";
            var nnode = newNode(nkey, parent$$1, new _Element("TextBox", [name]), new NodeType("TLeaf", []));
            this.tree(calc_leafs(this.config(), this.tree().concat([nnode])));
        }
    }, {
        key: "Pan",
        value: function (evt) {
            var e = evt;
            var matchValue = this.lastDragPoint;

            if (matchValue == null) {} else {
                this.translation(point(this.translation().x + (e.clientX - matchValue.x), this.translation().y + (e.clientY - matchValue.y)));
                this.lastDragPoint = point(e.clientX, e.clientY);
            }
        }
    }, {
        key: "Zoom",
        value: function (evt) {
            var e = evt;
            var matchValue = [e.wheelDelta, this.scale()];

            if (matchValue[0] > 0 ? matchValue[1] >= 1 : false) {
                this.scale(matchValue[1] + 0.5);
            } else if (matchValue[0] > 0) {
                this.scale(matchValue[1] + 0.1);
            } else if (matchValue[0] < 0 ? matchValue[1] > 1 : false) {
                this.scale(matchValue[1] - 0.5);
            } else if (matchValue[0] < 0 ? matchValue[1] > 0.1 : false) {
                this.scale(matchValue[1] - 0.1);
            }
        }
    }, {
        key: "EndPan",
        value: function () {
            this.lastDragPoint = null;
        }
    }, {
        key: "StartPan",
        value: function (evt) {
            var e = evt;
            this.lastDragPoint = point(e.clientX, e.clientY);
        }
    }, {
        key: "onunload",
        value: function (evt) {}
    }, {
        key: "Tree",
        get: function () {
            return this.tree;
        }
    }, {
        key: "Config",
        get: function () {
            return this.config;
        }
    }]);

    return Engine;
}();
setType("UILogic.Engine", Engine);
function createTextBoxELM(n, f, engine) {
    var translation = fsFormat("translate(%fpx,%fpx) scale(%f,%f)")(function (x) {
        return x;
    })(n.position()[0])(n.position()[1])(n.scale())(n.scale());
    var textbox = Mithril.elem("textarea", Mithril.attr(new List$1()), ofArray([f]));
    var v = Mithril.elem("div", Mithril.attr(ofArray([Mithril.css(ofArray([["-web-kit-transfrom-origin", translation], ["transform-origin", translation]]))])), ofArray([textbox]));
    return v;
}
function createELM(n, engine) {
    var matchValue = n.element;

    if (matchValue.Case === "TextBox") {
        return createTextBoxELM(n, matchValue.Fields[0], engine);
    } else {
        return Mithril.elem("div", null, toList(matchValue.Fields[0].map(function (x) {
            return createELM(x, engine);
        })));
    }
}
function createTreeView(engine) {
    var root$$1 = Mithril.elem("div", Mithril.attr(ofArray([Mithril.onEvent("onmouseup", function (e) {
        engine.EndPan();
    }), Mithril.onEvent("onmousedown", function (arg00) {
        engine.StartPan(arg00);
    }), Mithril.onEvent("onmousemove", function (arg00) {
        engine.Pan(arg00);
    }), Mithril.onEvent("wheel", function (e) {
        e.preventDefault();
        engine.Zoom(e);
    })])), toList(engine.Tree().map(function (x) {
        return createELM(x, engine);
    })));
    var origin = Mithril.elem("div", Mithril.attr(ofArray([Mithril.css(ofArray([["position", "relative"], ["width", "0px"], ["height", "0px"]]))])), ofArray([root$$1]));
    return origin;
}
function createWindow() {
    var orgin = [newNode(0, -1, new _Element("TextBox", ["Hello"]), new NodeType("TRoot", [])), newNode(1, 0, new _Element("TextBox", ["Hi"]), new NodeType("TLeaf", [])), newNode(2, 0, new _Element("TextBox", ["test"]), new NodeType("TLeaf", []))];
    var engine = new Engine(orgin, new Params(10, 0.5, 1, function (x) {
        return x;
    }));

    var vminit = function vminit(x) {
        return engine;
    };

    var com = Mithril.newComponent(vminit, function (engine_1) {
        return createTreeView(engine_1);
    });
    return com;
}

exports.Point = Point;
exports.point = point;
exports.Engine = Engine;
exports.createTextBoxELM = createTextBoxELM;
exports.createELM = createELM;
exports.createTreeView = createTreeView;
exports.createWindow = createWindow;

}((this.main = this.main || {})));

//# sourceMappingURL=bundle.js.map