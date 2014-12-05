System.register("../../lib/Actor", [], function() {
  "use strict";
  var __moduleName = "../../lib/Actor";
  var AbstractActor = require("./Actor");
  var uid = require("shortid");
  var Actor = function Actor() {
    var data = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $Actor.prototype, "constructor", []);
    this.data = data;
    this.data.id = uid;
  };
  var $Actor = Actor;
  ($traceurRuntime.createClass)(Actor, {get id() {
      return this.data.id;
    }}, {
    get type() {
      return this.name;
    },
    parse: function(json) {
      var actor = new this(json);
      actor.data.id = json.id;
      return actor;
    },
    toJSON: function(actor) {
      return JSON.parse(JSON.stringify(actor.data));
    },
    extend: function() {
      var methods = arguments[0] !== (void 0) ? arguments[0] : {};
      var whenFun = methods.when;
      delete methods.when;
      var typeName = methods.type;
      delete methods.type;
      var initFun = methods.init;
      delete methods.init;
      var Type = function Type(data) {
        $traceurRuntime.superCall(this, $Type.prototype, "constructor", [data]);
        if (init)
          initFun.apply(this, data);
      };
      var $Type = Type;
      ($traceurRuntime.createClass)(Type, {when: function() {
          whenFun.apply(this, arguments);
        }}, {type: function() {
          return typeName;
        }}, $Actor);
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
