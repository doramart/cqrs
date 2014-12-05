var co = require("co"), Actor = require("./Actor"), _ = require("underscore");

module.exports = Actor.extend("ActorListener", {

    init(){
        this._data.id = "ActorListenerId";
        this._data.repos = {};
    },

    // must need = this.actorRepso
    listen(command) {

        let actorId = command.actor.id
            , actorType = command.actor.type
            , handle = command.handle
            , context = command.context
            , onlyContext = command.onlyContext
            , isOne = !!command.isOne
            , listener = {actorId, actorType, handle, context, onlyContext, isOne}
            , eventName = command.eventName;


        this.apply("listen", {eventName, listener});

    },

    listenOne(command) {
        command.isOne = true;
        this.listen(command);
    },

    pub(command, di) {

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
                    actor.call(listener.handle, event, null, listener.contextId);
                }
            }

            di.apply("emit", eventName);

        })();
    },

    when(event) {

        var repos = data.repos;

        if (event.name === "listen") {

            var eventName = event.data.eventName;
            var repo;
            repo = (repo = repos[eventName]) ? repos[eventName] : (repos[eventName] = []);
            repo.push(event.data.listener);
        } else if (event.name === "emit") {

            var list = repos[event.data.data] || [];

            for (var i = 0, len = list.length; i < len; i++) {
                var listener = list[i];
                if (listener.isOne) {
                    list[i] = null;
                }
            }
            repos[event.data] = _.compact(list);
        }

    }

});

