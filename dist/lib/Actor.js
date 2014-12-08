System.register("../../lib/Actor", [], function() {
  "use strict";
  var __moduleName = "../../lib/Actor";
  var AbstractActor = require("./AbstractActor");
  var uid = require("shortid");
  var debug = require("debug")("Actor");
  var Actor = function Actor() {
    var data = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $Actor.prototype, "constructor", []);
    this._data = data;
    this._data.id = uid();
    this.on("apply", this.refreshData);
    this.refreshData();
  };
  var $Actor = Actor;
  ($traceurRuntime.createClass)(Actor, {
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
      var whenFun = methods.when;
      delete methods.when;
      var typeName = methods.type;
      delete methods.type;
      var initFun = methods.init;
      delete methods.init;
      var toJSONFun = methods.toJSON;
      delete methods.toJSON;
      var Type = function Type(data) {
        $traceurRuntime.superCall(this, $Type.prototype, "constructor", [data]);
        if (initFun) {
          this.data = this._data = {id: this._data.id};
          initFun.call(this, data);
        }
      };
      var $Type = Type;
      ($traceurRuntime.createClass)(Type, {when: function(event) {
          whenFun.call(this, event);
        }}, {
        get type() {
          return typeName;
        },
        toJSON: function(actor) {
          if (toJSONFun) {
            return toJSONFun.call(this, actor);
          } else {
            return $traceurRuntime.superCall(this, $Type, "toJSON", [actor]);
          }
        }
      }, $Actor);
      var keys = Object.keys(methods);
      keys.forEach((function(k) {
        if (methods[k] === true) {
          Object.defineProperty(Type.prototype, k, {value: function(data) {
              this.apply(k, data);
            }});
        } else {
          Object.defineProperty(Type.prototype, k, {value: methods[k]});
        }
      }));
      return Type;
    }
  }, AbstractActor);
  module.exports = Actor;
  return {};
});
System.get("../../lib/Actor" + '');
