var co = require("co"), Actor = require("./Actor"), _ = require("underscore");

/**
 * @class ActorListener
 */
var ActorListener = Actor.extend({

    type: "ActorListener",

    init() {
        this._data.id = "ActorListenerId";
        this._data.repos = {};
    },


    /**
     * actor handle contextId
     * @param command
     */
    listen(eventName, actor, handle, isOne) {
        this.apply("listen", {eventName, actorType: actor.type, actorId: actor.id, handle, isOne});
    },

    listenOne() {
        arguments[3] = true;
        this.listen.apply(this, arguments);
    },

    pub(event) {

        var self = this;
        var list = self._data.repos[event.eventName] || [];

        list.forEach(listener=> {
            this.myDomain.get(listener.actorType, listener.actorId, function (err, actor) {
                if (actor && actor[listener.handle])
                    actor[listener.handle](event);
            });
        });

        this.apply("emit", event.eventName);
    },

    when(event) {

        var repos = this._data.repos;
        if (event.name === "listen") {

            var eventName = event.data.eventName;
            var repo;
            repo = (repo = repos[eventName]) ? repos[eventName] : (repos[eventName] = []);
            repo.push(event.data);
        } else if (event.name === "emit") {

            var list = repos[event.data] || [];

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


module.exports = ActorListener;