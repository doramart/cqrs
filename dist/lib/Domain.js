System.register("../../lib/Domain", [], function() {
  "use strict";
  var __moduleName = "../../lib/Domain";
  var eventstore = require("eventstore"),
      Repository = require("./Repository"),
      co = require("co"),
      Actor = require("./Actor"),
      ActorListener = require("./ActorListener"),
      EventBus = require("./EventBus");
  var Domain = function Domain() {
    this.eventstore = eventstore();
    this.ActorClasses = {};
    this.repos = {};
    this.eventBus = new EventBus(this.eventstore, this.repos);
    this.eventstore.init();
    this.actorListener = new ActorListener(this.repos);
  };
  ($traceurRuntime.createClass)(Domain, {
    register: function(ActorClass) {
      var self = this;
      if (ActorClass instanceof Actor) {} else {
        ActorClass = Actor.extend(ActorClass);
      }
      this.ActorClasses[$traceurRuntime.toProperty(ActorClass.typeName)] = ActorClass;
      var repo = new Repository(ActorClass, this.eventstore);
      this.repos[$traceurRuntime.toProperty(ActorClass.typeName)] = repo;
      this._actorEventHandle(repo);
      return this;
    },
    _actorEventHandle: function(repo) {
      var self = this;
      function actorApplyEventHandle(actor) {
        self.eventBus.publish(actor);
      }
      function actorListenEventHandle() {
        var $__2;
        for (var opt = [],
            $__1 = 0; $__1 < arguments.length; $__1++)
          opt[$traceurRuntime.toProperty($__1)] = arguments[$traceurRuntime.toProperty($__1)];
        ($__2 = self.actorListener).listen.apply($__2, $traceurRuntime.spread(opt));
      }
      function actorCallEventHandle(actorId, commandName, data, caller, contextId) {
        co($traceurRuntime.initGeneratorFunction(function $__3() {
          var actor;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $ctx.state = 2;
                  return repo.get(actorId);
                case 2:
                  actor = $ctx.sent;
                  $ctx.state = 4;
                  break;
                case 4:
                  if (actor) {
                    actor.call(commandName, data, caller, contextId);
                  }
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__3, this);
        }))();
      }
      var listenActorEventHandle = (function(actor) {
        actor.on("apply", actorApplyEventHandle);
        actor.on("listen", actorListenEventHandle);
        actor.on("call", actorCallEventHandle);
      });
      repo.on("create", listenActorEventHandle);
      repo.on("reborn", listenActorEventHandle);
    },
    call: function(actorType, actorId, methodName, data, contextId) {
      co($traceurRuntime.initGeneratorFunction(function $__3() {
        var $__2,
            repo,
            actor;
        var $arguments = arguments;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                repo = this.repos[$traceurRuntime.toProperty(actorType)];
                $ctx.state = 6;
                break;
              case 6:
                $ctx.state = 2;
                return repo.get(actorId);
              case 2:
                actor = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                ($__2 = actor).call.apply($__2, $traceurRuntime.spread($arguments));
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__3, this);
      }))();
    },
    get: function(actorType, actorId, cb) {
      co($traceurRuntime.initGeneratorFunction(function $__3() {
        var repo,
            actor;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                repo = this.repos[$traceurRuntime.toProperty(actorType)];
                actor = repo.get(actorId);
                cb(actor);
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__3, this);
      }))();
    },
    addListener: function(eventName, listener) {
      this.eventBus.on(eventName, listener);
    }
  }, {});
  module.exports = Domain;
  return {};
});
System.get("../../lib/Domain" + '');
