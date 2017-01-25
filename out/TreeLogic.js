import List from "fable-core/List";
import { concat, map, mapFold, sumBy, fold, singleton, collect } from "fable-core/Seq";
import { NodeType, Node as _Node, Element as _Element } from "./Types";
import { fsFormat } from "fable-core/String";

function _self(k, tree) {
    return tree.find(function (x) {
        return k === x.key;
    });
}

export { _self as self };
export function ancestors(k, tree) {
    var ann = function ann(k2) {
        return function (tree2) {
            return function (nodes) {
                var x = _self(k2, tree2);

                var matchValue = x.ntype;

                if (matchValue.Case === "TRoot") {
                    return nodes;
                } else {
                    return ann(x.parent)(tree2)(new List(x, nodes));
                }
            };
        };
    };

    return Array.from(ann(k)(tree)(new List()));
}
export function children(k, tree) {
    return tree.filter(function (x) {
        return x.parent === k;
    });
}
export function parent(k, tree) {
    return tree.find(function (x) {
        return x.key === k.parent;
    });
}
export function leafs2(tree) {
    return tree.filter(function (x) {
        var matchValue = x.ntype;

        if (matchValue.Case === "TLeaf") {
            return true;
        } else if (matchValue.Case === "TBranch") {
            return false;
        } else {
            return false;
        }
    });
}
export function leafs(k, tree) {
    return Array.from(collect(function (x) {
        var matchValue = x.ntype;

        if (matchValue.Case === "TBranch") {
            return leafs(k, tree);
        } else if (matchValue.Case === "TRoot") {
            return new Array(0);
        } else {
            return Array.from(singleton(x));
        }
    }, children(k, tree)));
}
export function root(tree) {
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
export function depth(k, tree) {
    var l1 = ancestors(k, tree).length;
    var l2 = fold(function (max, x) {
        var $var2 = max;
        var $var1 = ancestors(k, tree).length;

        if ($var1 > $var2) {
            return $var1;
        } else {
            return $var2;
        }
    }, 0, children(k, tree));
    return [l1 + 1, l2 + 1];
}
export function size(t) {
    var lfs = leafs2(t);
    return fold(function (acc, x) {
        var $var4 = acc;
        var $var3 = x.size();

        if ($var3 > $var4) {
            return $var3;
        } else {
            return $var4;
        }
    }, 0, lfs) + lfs[0].data.distance;
}
export function size_ext(n) {
    return n.extsize;
}
export function calc_sizes(p, tree) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var x = _step.value;

            var multi = function () {
                var matchValue = x.ntype;

                if (matchValue.Case === "TLeaf") {
                    return p.parent_to_children_scaling;
                } else if (matchValue.Case === "TBranch") {
                    var depth_1 = depth(x.key, tree);
                    return p.parent_to_children_scaling * (1 + depth_1[0] / depth_1[1]);
                } else {
                    return 1;
                }
            }();

            x.data.scale = multi;
        };

        for (var _iterator = tree[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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

    return tree;
}
export function calc_ar(p, tree) {
    var metric = function metric(k) {
        return sumBy(function (x) {
            return x.size() * x.data.scale;
        }, leafs(k, tree));
    };

    var arinternal = function arinternal(k) {
        return function (mp) {
            return function (arp) {
                return Array.from(collect(function (x) {
                    var mx = metric(x.key);
                    var arx = arp / mp * mx;
                    return [(x.data.ar = arx, x)].concat(arinternal(x.key)(mx)(arx));
                }, children(k, tree)));
            };
        };
    };

    var root_1 = root(tree);
    return [(root_1.data.ar = 6.283185307179586, root_1)].concat(arinternal(root_1.key)(metric(root_1.key))(6.283185307179586));
}
export function calc_theta(p, tree) {
    var ctheta = function ctheta(k) {
        return function (theata) {
            return Array.from(collect(function (x) {
                var matchValue = x.ntype;

                if (matchValue.Case === "TBranch") {
                    return ctheta(x.key)(x.data.angle - 0.5 * x.data.ar);
                } else {
                    return Array.from(singleton(x));
                }
            }, function () {
                var mapping = function mapping(th) {
                    return function (x) {
                        x.data.angle = th + 0.5 * x.data.ar;
                        return [x, th + x.data.ar];
                    };
                };

                return function (array) {
                    return mapFold(function ($var5, $var6) {
                        return mapping($var5)($var6);
                    }, theata, array);
                };
            }()(p.sort(children(k, tree)))[0]));
        };
    };

    return ctheta(root(tree).key)(0).concat(Array.from(singleton(root(tree))));
}
export function calc_d(p, tree) {
    var size_r = root(tree).size() * root(tree).data.scale;

    var qx = function qx(q) {
        return Math.cos(q.data.angle * (360 / 6.283185307179586)) * q.data.distance;
    };

    var qy = function qy(q) {
        return Math.sin(q.data.angle * (360 / 6.283185307179586)) * q.data.distance;
    };

    var cd = function cd(n) {
        return function (t) {
            var d1 = n.size() * n.data.scale + size_r;
            var d2 = (n.data.ar > 6.283185307179586 / 4 ? true : n.data.ar === 0) ? 0 : n.size() / Math.sin(n.data.ar / 2 * (360 / 6.283185307179586));
            var d3 = parent(n, t).data.distance;
            var d4 = Float64Array.from(map(function (x) {
                return qx(x) * Math.cos(n.data.angle * (360 / 6.283185307179586)) + qy(x) * Math.sin(n.data.angle * (360 / 6.283185307179586)) + Math.sqrt(function () {
                    var $var7 = n.size() * n.data.scale + x.size() * x.data.scale;
                    return $var7 * $var7;
                }() - function () {
                    var $var8 = qx(x) * Math.sin(n.data.angle * (360 / 6.283185307179586)) - qy(x) * Math.cos(n.data.angle * (360 / 6.283185307179586));
                    return $var8 * $var8;
                }());
            }, ancestors(n.key, t)));
            return fold(function (a, b) {
                var $var10 = b;
                var $var9 = a;

                if ($var9 > $var10) {
                    return $var9;
                } else {
                    return $var10;
                }
            }, 0, new Float64Array([d1, d2, d3]).concat(d4));
        };
    };

    var calc_min = function calc_min(k) {
        return function (t) {
            var tre = t.map(function (x) {
                if (x.parent === k) {
                    x.data.distance = cd(x)(t);
                    return x;
                } else {
                    return x;
                }
            });
            return Array.from(collect(function (x) {
                var matchValue = x.ntype;

                if (matchValue.Case === "TBranch") {
                    return calc_min(x.key)(t);
                } else {
                    return Array.from(singleton(x));
                }
            }, children(k, tre)));
        };
    };

    var temp = calc_min(root(tree).key)(tree);
    var d_leaf = fold(function (max, x) {
        var $var12 = x.data.distance;
        var $var11 = max;

        if ($var11 > $var12) {
            return $var11;
        } else {
            return $var12;
        }
    }, 0, temp);
    return [root(tree)].concat(temp).map(function (x) {
        var matchValue = x.ntype;

        if (matchValue.Case === "TLeaf") {
            x.data.distance = d_leaf;
            return x;
        } else {
            return x;
        }
    });
}
export function clean_intersections(p, tree) {
    return tree;
}
export function calc_rel_position(p, tree) {
    return tree.map(function (x) {
        x.data.pos = [Math.cos(x.data.angle * (360 / 6.283185307179586)) * x.data.distance, Math.sin(x.data.angle * (360 / 6.283185307179586)) * x.data.distance];
        return x;
    });
}
export function calc_tree(p, tree) {
    return function (tree_1) {
        return calc_rel_position(p, tree_1);
    }(function (tree_1) {
        return clean_intersections(p, tree_1);
    }(function (tree_1) {
        return calc_d(p, tree_1);
    }(function (tree_1) {
        return calc_theta(p, tree_1);
    }(function (tree_1) {
        return calc_ar(p, tree_1);
    }(function (tree_1) {
        return calc_sizes(p, tree_1);
    }(tree))))));
}
export function dfs_calc_tree(p, tree) {
    return function (tree_1) {
        return calc_tree(p, tree_1);
    }(tree.map(function (x) {
        var matchValue = x.element;

        if (matchValue.Case === "Tree") {
            var t3 = dfs_calc_tree(p, matchValue.Fields[0]);
            x.element = new _Element("Tree", [t3]);
            x.extsize(size(t3));
            return x;
        } else {
            return x;
        }
    }));
}
export function map_absolute_pos_scale(p, _arg1, scale, tree) {
    return tree.map(function (n) {
        var acc = [[_arg1[0] + n.data.pos[0], _arg1[1] + n.data.pos[1]], scale * n.data.scale];
        n.position(acc[0]);
        fsFormat("abs pos %f %f")(function (x) {
            console.log(x);
        })(acc[0][0])(acc[0][1]);
        n.scale(acc[1]);
        var matchValue = n.element;

        if (matchValue.Case === "Tree") {
            var element = new _Element("Tree", [map_absolute_pos_scale(p, acc[0], acc[1], matchValue.Fields[0])]);
            return new _Node(n.key, n.parent, n.data, element, n.ntype, n.scale, n.position, n.size, n.extsize);
        } else {
            return n;
        }
    });
}
export function calc_abs_position_scale(p, tree) {
    return map_absolute_pos_scale(p, [0, 0], 1, tree);
}
export function render_tree(p, tree) {
    return function (tree_1) {
        return calc_abs_position_scale(p, tree_1);
    }(function (tree_1) {
        return dfs_calc_tree(p, tree_1);
    }(tree));
}
export function calc_leafs(p, tree) {
    var big = Array.from(concat(tree.map(function (x) {
        var matchValue = x.element;

        if (matchValue.Case === "Tree") {
            return matchValue.Fields[0];
        } else {
            return Array.from(singleton(x));
        }
    })));

    var dig = function dig(k) {
        return function (d) {
            return function (tree_1) {
                var c = children(k.key, tree_1);
                var c2 = Array.from(concat(c.map(function (x) {
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
//# sourceMappingURL=TreeLogic.js.map