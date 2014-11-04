System.register("lib/Repository", [], function() {
  "use strict";
  var __moduleName = "lib/Repository";
  var thunkify = require("thunkify");
  var co = require("co");
  var cache = Symbol("cache");
  var Repository = function Repository(Actor, eventstore) {
    this.Actor = Actor;
    this.eventstore = eventstore;
    this.getFromSnapShot = thunkify(this.eventstore.getFromSnapshot).bind(this.eventstore);
    this.createSnapshot = thunkify(this.eventstore.createSnapshot).bind(this.eventstore);
    this[$traceurRuntime.toProperty(cache)] = {};
  };
  ($traceurRuntime.createClass)(Repository, {
    create: $traceurRuntime.initGeneratorFunction(function $__1(data) {
      var actor,
          stream,
          $__2,
          $__3,
          $__4,
          $__5,
          $__6;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              actor = new this.Actor(data);
              $ctx.state = 16;
              break;
            case 16:
              $__2 = this.getFromSnapShot;
              $__3 = actor.id;
              $__4 = $__2.call(this, $__3);
              $ctx.state = 6;
              break;
            case 6:
              $ctx.state = 2;
              return $__4;
            case 2:
              $__5 = $ctx.sent;
              $ctx.state = 4;
              break;
            case 4:
              $__6 = $__5[1];
              stream = $__6;
              $ctx.state = 8;
              break;
            case 8:
              $ctx.state = 10;
              return this.createSnapshot({
                aggregateId: actor.id,
                aggregate: this.Actor.typeName,
                data: actor.json,
                revision: stream.revision
              });
            case 10:
              $ctx.maybeThrow();
              $ctx.state = 12;
              break;
            case 12:
              this[$traceurRuntime.toProperty(cache)][$traceurRuntime.toProperty(actor.id)] = actor;
              $ctx.state = 18;
              break;
            case 18:
              $ctx.returnValue = actor;
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, $__1, this);
    }),
    clear: function(id) {
      delete this[$traceurRuntime.toProperty(cache)][$traceurRuntime.toProperty(id)];
    },
    getFromCache: function(id) {
      return this[$traceurRuntime.toProperty(cache)][$traceurRuntime.toProperty(id)];
    },
    get: $traceurRuntime.initGeneratorFunction(function $__7(id) {
      var actor,
          result,
          snapshot,
          stream,
          snap,
          history,
          historyv;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $ctx.state = (actor = this.getFromCache(id)) ? 1 : 2;
              break;
            case 1:
              $ctx.returnValue = actor;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 5;
              return this.getFromSnapShot(id);
            case 5:
              result = $ctx.sent;
              $ctx.state = 7;
              break;
            case 7:
              $ctx.state = (actor = this.getFromCache(id)) ? 8 : 9;
              break;
            case 8:
              $ctx.returnValue = actor;
              $ctx.state = -2;
              break;
            case 9:
              snapshot = result[0];
              stream = result[1];
              $ctx.state = 17;
              break;
            case 17:
              $ctx.state = (!snapshot) ? 11 : 12;
              break;
            case 11:
              $ctx.returnValue = null;
              $ctx.state = -2;
              break;
            case 12:
              snap = snapshot.data;
              history = stream.events;
              actor = new this.Actor();
              actor.loadSnap(snap);
              historyv = [];
              history.forEach(function(e) {
                historyv.push(e.payload);
              });
              actor.loadEvents(historyv);
              this[$traceurRuntime.toProperty(cache)][$traceurRuntime.toProperty(actor.id)] = actor;
              $ctx.state = 19;
              break;
            case 19:
              $ctx.returnValue = actor;
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, $__7, this);
    })
  }, {});
  module.exports = Repository;
  return {};
});
System.get("lib/Repository" + '');
