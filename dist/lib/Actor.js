System.register("../../lib/Actor", [], function() {
  "use strict";
  var __moduleName = "../../lib/Actor";
  var AbstractActor = require("./AbstractActor");
  var uid = require("shortid");
  var inherits = require("util").inherits;
  var debug = require("debug")("Actor");
  var Actor = function Actor() {
    var data = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $Actor.prototype, "constructor", []);
    this._data = data;
    if (!this._data.id)
      this._data.id = uid();
    this.on("apply", this.refreshData);
    this.refreshData();
  };
  var $Actor = Actor;
  ($traceurRuntime.createClass)(Actor, {
    remove: function() {
      this.apply("remove");
    },
    refreshData: function() {
      this.data = this.constructor.toJSON(this);
      Object.freeze(this.data);
    },
    get id() {
      return this._data.id;
    },
    loadEvents: function(events) {
      $traceurRuntime.superCall(this, $Actor.prototype, "loadEvents", [events]);
      this.refreshData();
    }
  }, {
    get type() {
      return this.name;
    },
    parse: function(json) {
      var actor = new this(json);
      actor._data.id = json.id;
      return actor;
    },
    toJSON: function(actor) {
      return JSON.parse(JSON.stringify(actor._data));
    },
    extend: function() {
      var methods = arguments[0] !== (void 0) ? arguments[0] : {};
      var $__0 = this;
      var whenFun = methods.when;
      var typeName = methods.type;
      var initFun = methods.init;
      var toJSONFun = methods.toJSON;
      var parseFun = methods.parse;
      function Type(data) {
        data = data || {};
        data.alive = true;
        this._data = data;
        if (initFun) {
          initFun.call(this, data);
        }
        $Actor.call(this, this._data);
        if (!this._data.id) {
          this._data.id = uid();
        }
      }
      inherits(Type, $Actor);
      Type.prototype.when = function(event) {
        if (event.name === "remove") {
          this._data.alive = false;
        }
        if (whenFun)
          whenFun.call(this, event);
      };
      Type.type = typeName;
      Type.toJSON = function(actor) {
        var json;
        if (toJSONFun) {
          json = toJSONFun.call(this, actor);
        } else {
          json = $Actor.toJSON(actor);
        }
        json.alive = actor._data.alive;
        return json;
      };
      Type.parse = function(json) {
        var actor;
        if (parseFun) {
          actor = parseFun.call(this, json);
        } else {
          actor = $traceurRuntime.superCall($__0, $Actor, "parse", [json]);
        }
        actor._data.alive = json.alive;
        actor.refreshData();
        return actor;
      };
      var keys = Object.keys(methods);
      keys.forEach((function(k) {
        if (["when", "type", "init", "toJSON"].indexOf(k) === -1) {
          if (methods[k] === true) {
            Object.defineProperty(Type.prototype, k, {value: function(data) {
                this.apply(k, data);
              }});
          } else {
            Object.defineProperty(Type.prototype, k, {value: methods[k]});
          }
        }
      }));
      return Type;
    }
  }, AbstractActor);
  module.exports = Actor;
  return {};
});
System.get("../../lib/Actor" + '');
