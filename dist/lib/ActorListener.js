System.register("../../lib/ActorListener", [], function() {
  "use strict";
  var __moduleName = "../../lib/ActorListener";
  var co = require("co"),
      Actor = require("./Actor"),
      _ = require("underscore");
  module.exports = Actor.extend("ActorListener", {
    init: function() {
      this._data.id = "ActorListenerId";
      this._data.repos = {};
    },
    listen: function(command) {
      var actorId = command.actor.id,
          actorType = command.actor.type,
          handle = command.handle,
          context = command.context,
          onlyContext = command.onlyContext,
          isOne = !!command.isOne,
          listener = {
            actorId: actorId,
            actorType: actorType,
            handle: handle,
            context: context,
            onlyContext: onlyContext,
            isOne: isOne
          },
          eventName = command.eventName;
      this.apply("listen", {
        eventName: eventName,
        listener: listener
      });
    },
    listenOne: function(command) {
      command.isOne = true;
      this.listen(command);
    },
    pub: function(command, di) {
      var eventName = command.eventName,
          event = command.event;
      var repos = this.json.repos;
      var self = this;
      co($traceurRuntime.initGeneratorFunction(function $__0() {
        var list,
            i,
            len,
            listener,
            actorRepo,
            actor;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                list = repos[eventName] || [];
                $ctx.state = 13;
                break;
              case 13:
                i = 0, len = list.length;
                $ctx.state = 11;
                break;
              case 11:
                $ctx.state = (i < len) ? 5 : 9;
                break;
              case 8:
                i++;
                $ctx.state = 11;
                break;
              case 5:
                listener = list[i];
                actorRepo = self.actorRepos[listener.actorType];
                $ctx.state = 6;
                break;
              case 6:
                $ctx.state = 2;
                return actorRepo.get(listener.actorId);
              case 2:
                actor = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                if (actor) {
                  actor.call(listener.handle, event, null, listener.contextId);
                }
                $ctx.state = 8;
                break;
              case 9:
                di.apply("emit", eventName);
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__0, this);
      }))();
    },
    when: function(event) {
      var repos = data.repos;
      if (event.name === "listen") {
        var eventName = event.data.eventName;
        var repo;
        repo = (repo = repos[eventName]) ? repos[eventName] : (repos[eventName] = []);
        repo.push(event.data.listener);
      } else if (event.name === "emit") {
        var list = repos[event.data.data] || [];
        for (var i = 0,
            len = list.length; i < len; i++) {
          var listener = list[i];
          if (listener.isOne) {
            list[i] = null;
          }
        }
        repos[event.data] = _.compact(list);
      }
    }
  });
  return {};
});
System.get("../../lib/ActorListener" + '');
