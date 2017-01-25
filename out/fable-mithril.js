var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { setType } from "fable-core/Symbol";
import _Symbol from "fable-core/Symbol";
import { hasInterface, Interface } from "fable-core/Util";
import { choose } from "fable-core/List";
export var Globals = function () {
    function Globals() {
        _classCallCheck(this, Globals);
    }

    _createClass(Globals, [{
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
export var Mithril = function (__exports) {
    var m = __exports.m = require("mithril");

    var _VirtualElement___ = __exports["|VirtualElement|_|"] = function (o) {
        if (o.tag != null) {
            return o;
        }
    };

    var elem = __exports.elem = function (tagName, attr, children) {
        var c = Array.from(choose(function (x) {
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
//# sourceMappingURL=fable-mithril.js.map