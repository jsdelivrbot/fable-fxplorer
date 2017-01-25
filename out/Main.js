var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { setType } from "fable-core/Symbol";
import _Symbol from "fable-core/Symbol";
import { Interface, compareRecords, equalsRecords } from "fable-core/Util";
import { Mithril } from "./fable-mithril";
import { toList, reduce } from "fable-core/Seq";
import { Params, NodeType, Element as _Element, newNode } from "./Types";
import { calc_leafs } from "./TreeLogic";
import { fsFormat } from "fable-core/String";
import { ofArray } from "fable-core/List";
import List from "fable-core/List";
export var Point = function () {
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
export function point(_x, _y) {
    return new Point(_x, _y);
}
export var Engine = function () {
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
        value: function (key, size) {
            var index = this.tree().findIndex(function (x) {
                return x.key === key;
            });
            this.tree()[index].size(size);
        }
    }, {
        key: "Add",
        value: function (parent) {
            var nkey = 1 + reduce(function (f) {
                return function (x, y) {
                    return f(x) > f(y) ? x : y;
                };
            }(function (x) {
                return x.key;
            }), this.tree()).key;
            var name = "new.txt";
            var nnode = newNode(nkey, parent, new _Element("TextBox", [name]), new NodeType("TLeaf", []));
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
export function createTextBoxELM(n, f, engine) {
    var translation = fsFormat("translate(%fpx,%fpx) scale(%f,%f)")(function (x) {
        return x;
    })(n.position()[0])(n.position()[1])(n.scale())(n.scale());
    var textbox = Mithril.elem("textarea", Mithril.attr(new List()), ofArray([f]));
    var v = Mithril.elem("div", Mithril.attr(ofArray([Mithril.css(ofArray([["-web-kit-transfrom-origin", translation], ["transform-origin", translation]]))])), ofArray([textbox]));
    return v;
}
export function createELM(n, engine) {
    var matchValue = n.element;

    if (matchValue.Case === "TextBox") {
        return createTextBoxELM(n, matchValue.Fields[0], engine);
    } else {
        return Mithril.elem("div", null, toList(matchValue.Fields[0].map(function (x) {
            return createELM(x, engine);
        })));
    }
}
export function createTreeView(engine) {
    var root = Mithril.elem("div", Mithril.attr(ofArray([Mithril.onEvent("onmouseup", function (e) {
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
    var origin = Mithril.elem("div", Mithril.attr(ofArray([Mithril.css(ofArray([["position", "relative"], ["width", "0px"], ["height", "0px"]]))])), ofArray([root]));
    return origin;
}
export function createWindow() {
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
Mithril.mount(document.body, createWindow());
//# sourceMappingURL=Main.js.map