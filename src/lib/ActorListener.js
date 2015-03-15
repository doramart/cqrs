var Actor = require("./Actor"), _ = require("underscore");

/**
 * Only cqrs container use it.
 * @class ActorListener
 */
class ActorListener extends Actor {

    constructor() {
        super({id: 'ActorListenerId', repos: {}});
    }

    /**
     * type is ActorListener
     * @member type
     * @see AbstractActor#type
     */
    static get type() {
        return "ActorListener"
    }

    /**
     * Listen a actor's domain event.
     * @memberof ActorListener.prototype
     * @member listen
     * @param eventName
     * @param actor
     * @param handle
     * @param isOne
     */
    listen(eventName, actor, handle, isOne) {
        let actorType = actor.type;
        let actorId = actor.id;
        let param = {eventName, actorType, actorId, handle, isOne};
        this._apply("listen", param);
    }

    /**
     * Listen once a actor's domain event.
     * @memberof ActorListener.prototype
     * @member listenOne
     * @see Abstractor#listen
     */
    listenOne() {
        var args = _.toArray(arguments);
        args[3] = true;
        this.listen.apply(this,args);
    }

    /**
     *
     * @memberof ActorListener#prototype
     * @member pub
     * @param event domain event
     */
    pub(event) {

        var list = this._data.repos[event.name] || [];

        list.forEach(listener=> {
            this.myDomain.get(listener.actorType, listener.actorId, function (err, actor) {
                if (actor && actor[listener.handle])
                    actor[listener.handle](event);
            });
        });

        this._apply("emit", event.name);
    }

    _when(event) {

        var repos = this._data.repos;
        if (event.name === "listen") {


            let eventName = event.data.eventName;
            let repo;
            repo = (repo = repos[eventName]) ? repos[eventName] : (repos[eventName] = []);
            repo.push(event.data);

        } else if (event.name === "emit") {

            var list = repos[event.data] || [];

            for (var i = 0, len = list.length; i < len; i++) {
                let listener = list[i];
                if (listener.isOne) {
                    list[i] = null;
                }
            }
            repos[event.data] = _.compact(list);
        }

    }

}

module.exports = ActorListener;