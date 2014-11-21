var co = require("co"),Actor = require("./Actor"),_ = require("underscore");

module.exports = Actor.extend("ActorListener", {

    // must need = this.actorRepso
    listen(command, di) {

        let actorId = command.actor.id
            , actorType = command.actor.typeName
            , handleMethodName = command.handleMethodName
            , context = command.context
            , onlyContext = command.onlyContext
            , isOne = !!command.isOne
            , listener = {actorId, actorType, handleMethodName, context, onlyContext,isOne}
            , eventName = command.eventName;

        di.apply("listen", {eventName, listener});

    },

    listenOne(command, di) {
        command.isOne = true;
        this.listen(command, di);
    },

    pub(command,di) {

       var eventName = command.eventName, event = command.event;
        var repos = this.json.repos;
        var self = this;

        co(function *() {

            var list = repos[eventName] || [];
            for (var i = 0, len = list.length; i < len; i++) {
                var listener = list[i];
                var actorRepo = self.actorRepos[listener.actorType];
                var actor = yield actorRepo.get(listener.actorId);

                if (actor) {
                    actor.call(listener.handleMethodName, event, null, listener.contextId);
                }
            }

            di.apply("emit",eventName);

        })();
    },

    toJSON(data) {
        return data;
    },

    when(event, data) {
        if(event.name=== "create"){
            data.id ="ActorListenerId"
            data.repos = {}
        }

        var repos = data.repos;

        if (event.name === "listen") {

            var eventName = event.data.data.eventName;
            var repo;
                repo = (repo = repos[eventName]) ? repos[eventName] : (repos[eventName] = []);
            repo.push(event.data.data.listener);
        }else if(event.name ==="emit"){

            var list = repos[event.data.data] || [];

            for (var i = 0, len = list.length; i < len; i++) {
                var listener = list[i];
                if(listener.isOne){
                    list[i] = null;
                }
            }
            repos[event.data.data] = _.compact(list);
        }

    }

});

