var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { setType } from "fable-core/Symbol";
import _Symbol from "fable-core/Symbol";
import { Interface, Array as _Array, compareRecords, equalsRecords, Tuple, compareUnions, equalsUnions } from "fable-core/Util";
import { Mithril } from "./fable-mithril";
export var rad = function () {
    function rad() {
        _classCallCheck(this, rad);
    }

    _createClass(rad, [{
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
export var tau = 6.283185307179586;
export var NodeType = function () {
    function NodeType(caseName, fields) {
        _classCallCheck(this, NodeType);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(NodeType, [{
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
export var NodeData = function () {
    function NodeData(distance, ar, angle, pos, scale) {
        _classCallCheck(this, NodeData);

        this.distance = distance;
        this.ar = ar;
        this.angle = angle;
        this.pos = pos;
        this.scale = scale;
    }

    _createClass(NodeData, [{
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
        _classCallCheck(this, _Element);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(_Element, [{
        key: _Symbol.reflection,
        value: function () {
            return {
                type: "Types.Element",
                interfaces: ["FSharpUnion", "System.IEquatable"],
                cases: {
                    TextBox: ["string"],
                    Tree: [_Array(_Node)]
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

export { _Element as Element };
setType("Types.Element", _Element);

var _Node = function () {
    function _Node(key, parent, data, element, ntype, scale, position, size, extsize) {
        _classCallCheck(this, _Node);

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

    _createClass(_Node, [{
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

export { _Node as Node };
setType("Types.Node", _Node);
export var Params = function () {
    function Params(div_tree_threshold, parent_to_children_scaling, ar_scaleing, sort) {
        _classCallCheck(this, Params);

        this.div_tree_threshold = div_tree_threshold;
        this.parent_to_children_scaling = parent_to_children_scaling;
        this.ar_scaleing = ar_scaleing;
        this.sort = sort;
    }

    _createClass(Params, [{
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
export var newND = new NodeData(0, 0, 0, [0, 0], 0);
export function newNode(key, parent, element, ntype) {
    var scale = Mithril.property(1);
    var size = Mithril.property(1);
    return new _Node(key, parent, newND, element, ntype, scale, Mithril.property([0, 0]), size, Mithril.property(1));
}
//# sourceMappingURL=Types.js.map