"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.com = exports.vm = exports.VM = exports.Reminder = exports.LocalStorage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.item_view = item_view;
exports.main_view = main_view;
exports.vm_init = vm_init;

var _fableCore = require("fable-core");

var _fableMithril = require("./fable-mithril");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorage = exports.LocalStorage = function () {
  function LocalStorage(id) {
    _classCallCheck(this, LocalStorage);

    this.store_id = id;
  }

  _createClass(LocalStorage, [{
    key: "get",
    value: function get() {
      var $var1 = function (_arg1) {
        return _arg1 == null ? null : _arg1;
      }(localStorage.getItem(this.store_id));

      if ($var1 != null) {
        return function (json) {
          return _fableCore.Util.ofJson(json);
        }($var1);
      } else {
        return $var1;
      }
    }
  }, {
    key: "set",
    value: function set(ls) {
      localStorage.setItem(this.store_id, _fableCore.Util.toJson(ls));
    }
  }]);

  return LocalStorage;
}();

_fableCore.Util.setInterfaces(LocalStorage.prototype, [], "Mithril-todo.LocalStorage");

var Reminder = exports.Reminder = function () {
  function Reminder(description, date, edited, error, editing, prev) {
    _classCallCheck(this, Reminder);

    this.description = description;
    this.date = date;
    this.edited = edited;
    this.error = error;
    this.editing = editing;
    this.prev = prev;
  }

  _createClass(Reminder, [{
    key: "Equals",
    value: function Equals(other) {
      return _fableCore.Util.equalsRecords(this, other);
    }
  }], [{
    key: "New",
    value: function New(dis, dte) {
      return new Reminder(_fableMithril.Mithril.property(dis), _fableMithril.Mithril.property(function () {
        var copyOfStruct = _fableCore.Date.utcNow();

        return _fableCore.Date.ticks(copyOfStruct);
      }()), _fableMithril.Mithril.property(false), _fableMithril.Mithril.property(false), _fableMithril.Mithril.property(false), _fableMithril.Mithril.property(""));
    }
  }]);

  return Reminder;
}();

_fableCore.Util.setInterfaces(Reminder.prototype, ["FSharpRecord", "System.IEquatable"], "Mithril-todo.Reminder");

var VM = exports.VM = function () {
  function VM() {
    _classCallCheck(this, VM);

    this.local = new LocalStorage("reminder_list");
    this.dis = _fableMithril.Mithril.property("");
  }

  _createClass(VM, [{
    key: "Add",
    value: function Add() {
      if (!(this.Discription() === "") ? _fableCore.RegExp.replace(this.Discription(), "/\\s/g", "").length <= this.MaxString : false) {
        this.List = [function (arg00) {
          return function (arg10) {
            return Reminder.New(arg00, arg10);
          };
        }(_fableCore.String.trim(this.Discription(), "both"))(_fableCore.Date.utcNow())].concat(this.List);
        this.Discription("");
      }
    }
  }, {
    key: "onunload",
    value: function onunload(evt) {}
  }, {
    key: "MaxString",
    get: function get() {
      return 100;
    }
  }, {
    key: "List",
    get: function get() {
      var matchValue = this.local.get();

      if (matchValue == null) {
        return new Array(0);
      } else {
        return matchValue.map(function (x) {
          return new Reminder(_fableMithril.Mithril.property(x.description), _fableMithril.Mithril.property(x.date), _fableMithril.Mithril.property(x.edited), _fableMithril.Mithril.property(x.error), _fableMithril.Mithril.property(x.editing), _fableMithril.Mithril.property(x.prev));
        });
      }
    },
    set: function set(x) {
      this.local.set(x);
    }
  }, {
    key: "Discription",
    get: function get() {
      return this.dis;
    }
  }]);

  return VM;
}();

_fableCore.Util.setInterfaces(VM.prototype, ["Fable.Import.MithrilBase.Controller"], "Mithril-todo.VM");

function item_view(vm, index, r) {
  var charlim = vm.MaxString - _fableCore.RegExp.replace(r.description(), "/\\s/g", "").length;

  var charlimit = _fableMithril.Mithril.elem("span", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("inner-status " + (r.editing() ? "show" : "hide"))])), _fableCore.List.ofArray([String(charlim) + " characters left"]));

  var description = _fableMithril.Mithril.elem("div", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("description " + (r.editing() ? "hide" : "")), ["data-edited", r.edited], ["data-error", r.error], _fableMithril.Mithril.onEvent("ondblclick", function (e) {
    r.editing(true);
    r.prev(r.description());
  })])), _fableCore.List.ofArray([r.description()]));

  var ts = _fableCore.Date.op_Subtraction(_fableCore.Date.utcNow(), function () {
    var copyOfStruct = _fableCore.Date.utcNow();

    return _fableCore.Date.addTicks(copyOfStruct, r.date() - function () {
      var copyOfStruct_1 = _fableCore.Date.utcNow();

      return _fableCore.Date.ticks(copyOfStruct_1);
    }());
  }());

  var ago = _fableCore.TimeSpan.days(ts) > 0 ? function () {
    var copyOfStruct = _fableCore.TimeSpan.days(ts);

    return String(copyOfStruct);
  }() + " days ago" : _fableCore.TimeSpan.hours(ts) > 0 ? function () {
    var copyOfStruct = _fableCore.TimeSpan.hours(ts);

    return String(copyOfStruct);
  }() + " hours ago" : _fableCore.TimeSpan.minutes(ts) > 0 ? function () {
    var copyOfStruct = _fableCore.TimeSpan.minutes(ts);

    return String(copyOfStruct);
  }() + " minutes ago" : function () {
    var copyOfStruct = _fableCore.TimeSpan.seconds(ts);

    return String(copyOfStruct);
  }() + " seconds ago";

  var edit = _fableMithril.Mithril.elem("textarea", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css(r.editing() ? "show" : "hide"), _fableMithril.Mithril.incss(_fableCore.List.ofArray([["height", "29px"], ["min-height", "0px"]])), ["rows", 1], _fableMithril.Mithril.onEvent("oninput", _fableMithril.Mithril.bindattr("value", function (arg00) {
    r.description(arg00);
  })), _fableMithril.Mithril.onEvent("onkeyup", function (e) {
    var e2 = e;

    if (e2.keyCode === 13) {
      r.editing(false);
    } else {
      if (e2.keyCode === 27) {
        r.description(r.prev());
        r.editing(false);
      } else {
        _fableMithril.Mithril.redrawStrategy("none");
      }
    }
  }), _fableMithril.Mithril.onEvent("onblur", function (e) {
    r.description(r.prev());
    r.editing(false);
  })])), _fableCore.List.ofArray([r.description()]));

  var lbl = _fableMithril.Mithril.elem("label", _fableMithril.Mithril.attr(_fableCore.List.ofArray([["data-date", r.date]])), _fableCore.List.ofArray([description, edit, charlimit, _fableMithril.Mithril.elem("span", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("date")])), _fableCore.List.ofArray([ago]))]));

  return _fableMithril.Mithril.elem("li", null, _fableCore.List.ofArray([lbl, _fableMithril.Mithril.elem("span", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("destroy"), _fableMithril.Mithril.onEvent("onclick", function (e) {
    vm.List = Array.from(_fableCore.Seq.choose(function (tupledArg) {
      return tupledArg[1] ? null : tupledArg[0];
    }, Array.from(_fableCore.Seq.mapIndexed(function (i, x) {
      return i === index ? [x, true] : [x, false];
    }, vm.List))));
  })])), new _fableCore.List())]));
}

function main_view(vm1) {
  return _fableMithril.Mithril.elem("section", _fableMithril.Mithril.attr(_fableCore.List.ofArray([["id", "reminderapp"]])), _fableCore.List.ofArray([_fableMithril.Mithril.elem("div", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("tasks-Container")])), _fableCore.List.ofArray([_fableMithril.Mithril.elem("h1", null, _fableCore.List.ofArray(["Notifications"])), _fableMithril.Mithril.elem("input", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("add-remind"), ["placeholder", "Notification test"], ["autofocus", true], ["value", vm1.Discription()], _fableMithril.Mithril.onEvent("onkeyup", function (e) {
    var e2 = e;

    if (e2.keyCode === 13) {
      vm1.Add();
    } else {
      if (e2.keyCode === 27) {
        vm1.Discription("");
      } else {
        _fableMithril.Mithril.redrawStrategy("none");
      }
    }
  }), _fableMithril.Mithril.onEvent("oninput", _fableMithril.Mithril.bindattr("value", function () {
    var objectArg = vm1.Discription;
    return function (arg00) {
      objectArg(arg00);
    };
  }()))])), new _fableCore.List()), _fableMithril.Mithril.elem("button", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("add"), _fableMithril.Mithril.onEvent("onclick", function (e) {
    vm1.Add();
  })])), _fableCore.List.ofArray(["+"])), _fableMithril.Mithril.elem("div", _fableMithril.Mithril.attr(_fableCore.List.ofArray([["id", "input-status"]])), _fableCore.RegExp.replace(vm1.Discription(), "/\\s/g", "").length <= vm1.MaxString ? _fableCore.List.ofArray([function () {
    var copyOfStruct = vm1.MaxString - _fableCore.RegExp.replace(vm1.Discription(), "/\\s/g", "").length;

    return String(copyOfStruct);
  }() + " character left"]) : _fableCore.List.ofArray([_fableMithril.Mithril.elem("span", _fableMithril.Mithril.attr(_fableCore.List.ofArray([_fableMithril.Mithril.css("danger")])), _fableCore.List.ofArray(["limit of " + function () {
    var copyOfStruct = vm1.MaxString;
    return String(copyOfStruct);
  }()]))]))])), _fableMithril.Mithril.elem("ul", _fableMithril.Mithril.attr(_fableCore.List.ofArray([["id", "todo-list"]])), vm1.List.length === 0 ? new _fableCore.List() : _fableCore.Seq.toList(Array.from(_fableCore.Seq.mapIndexed(function (index, r) {
    return item_view(vm1, index, r);
  }, vm1.List))))]));
}

var vm = exports.vm = new VM();

function vm_init(x) {
  return vm;
}

var com = exports.com = _fableMithril.Mithril.newComponent(function (x) {
  return vm_init(x);
}, function (vm1) {
  return main_view(vm1);
});

_fableMithril.Mithril.mount(document.body, com);