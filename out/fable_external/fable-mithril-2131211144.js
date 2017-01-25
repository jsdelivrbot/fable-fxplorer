"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mithril = exports.Globals = exports.MithrilBase = undefined;

var _fableCore = require("fable-core");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MithrilBase = exports.MithrilBase = function ($exports) {
  return $exports;
}({});

var Globals = exports.Globals = function Globals() {
  _classCallCheck(this, Globals);
};

_fableCore.Util.setInterfaces(Globals.prototype, [], "Fable.Import.Globals");

var Mithril = exports.Mithril = function ($exports) {
  var get_m = $exports.get_m = require("mithril");

  var $VirtualElement$_$ = $exports.$VirtualElement$_$ = function $VirtualElement$_$(o) {
    return o.tag != null ? o : null;
  };

  var elem = $exports.elem = function elem(tagName, attr, children) {
    var c = Array.from(_fableCore.List.choose(function (x) {
      return typeof x === "string" ? function () {
        var s = x;
        return s;
      }() : function () {
        var activePatternResult83 = $VirtualElement$_$(x);

        if (activePatternResult83 != null) {
          var v = activePatternResult83;
          return v;
        } else {
          if (_fableCore.Util.hasInterface(x, "Fable.Import.MithrilBase.Component")) {
            var c = x;
            return c;
          }
        }
      }();
    }, children));
    var ve = attr == null ? get_m.apply(undefined, [tagName].concat(_toConsumableArray(c))) : get_m.apply(undefined, [tagName, attr].concat(_toConsumableArray(c)));
    return ve;
  };

  var onEvent = $exports.onEvent = function onEvent(eventType, f) {
    return [eventType, function (delegateArg0) {
      f(delegateArg0);
    }];
  };

  var VirtualDOM = $exports.VirtualDOM = function ($exports) {
    return $exports;
  }({});

  var Events = $exports.Events = function ($exports) {
    return $exports;
  }({});

  var attr = $exports.attr = function attr(ls) {
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

  var event = $exports.event = function event(evt, v, func) {
    var f = function f(a) {
      return func(a);
    };

    return [evt, get_m.withAttr(v, function (delegateArg0) {
      return f(delegateArg0);
    })];
  };

  var bindattr = $exports.bindattr = function bindattr(str, func) {
    var f = function f(a) {
      return func(a);
    };

    var s = get_m.withAttr(str, function (delegateArg0) {
      return f(delegateArg0);
    });
    return function (e) {
      s(e);
    };
  };

  var css = $exports.css = function css(str) {
    return ["class", str];
  };

  var name = $exports.name = function name(str) {
    return ["name", str];
  };

  var incss = $exports.incss = function incss(ls) {
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

  var newComponent = $exports.newComponent = function newComponent(c, v) {
    var o = {};

    o.controller = function (x) {
      return c(x);
    };

    o.view = v;
    return o;
  };

  var mount = $exports.mount = function mount(elm, componen) {
    return get_m.mount(elm, componen);
  };

  var property = $exports.property = function property(ob) {
    return get_m.prop(ob);
  };

  var prom = $exports.prom = function prom(ob) {
    return get_m.prop(ob);
  };

  var routeComponent = $exports.routeComponent = function routeComponent(elm, root, routes) {
    get_m.route(elm, root, routes);
  };

  var route = $exports.route = function route() {
    var objectArg = get_m;
    return function (arg00) {
      objectArg.route(arg00);
    };
  };

  var reroute = $exports.reroute = function reroute(route_1) {
    get_m.route(route_1);
  };

  var defmodule = $exports.defmodule = function defmodule(elm, componen) {
    return get_m.module(elm, componen);
  };

  var defcomponent = $exports.defcomponent = function defcomponent(componen, args) {
    return get_m.component.apply(get_m, [componen].concat(_toConsumableArray(args)));
  };

  var redraw = $exports.redraw = function redraw() {
    get_m.redraw(true);
  };

  var trust = $exports.trust = function trust(html) {
    return get_m.trust(html);
  };

  var redrawStrategy = $exports.redrawStrategy = function redrawStrategy(rdw) {
    get_m.redraw.strategy(rdw);
  };

  var render = $exports.render = function render(elm, children) {
    get_m.render(elm, children);
  };

  var forceRender = $exports.forceRender = function forceRender(elm, children, force) {
    get_m.render(elm, children, force);
  };

  var requestJSON = $exports.requestJSON = function requestJSON(opt) {
    return get_m.request(opt);
  };

  var requestXHR = $exports.requestXHR = function requestXHR(opt) {
    return get_m.request(opt);
  };

  var sync = $exports.sync = function sync(promises) {
    return get_m.sync(promises);
  };

  var startComputation = $exports.startComputation = function startComputation() {
    get_m.startComputation();
  };

  var endComputation = $exports.endComputation = function endComputation() {
    get_m.endComputation();
  };

  return $exports;
}({});