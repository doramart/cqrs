var Actor = require("./Actor"), _ = require("underscore");

/**
 * cqrs's core component.
 * only cqrs container use it.
 * @class ActorListener
 * @extends Actor
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
     * @method listen
     * @param eventName
     * @param actor
     * @param handle
     * @param isOne
     */
    listen(eventName, actor, handle, isOne) {

        let actorType = actor.type;
        let actorId = actor.id;
        let data = {eventName, actorType, actorId, handle, isOne};
        this._apply("listen", data);
    }

    /**
     * Listen once a actor's domain event.
     * @memberof ActorListener.prototype
     * @method listenOne
     * @see ActorListener#listen
     */
    listenOne() {
        var args = _.toArray(arguments);
        args[3] = true;
        this.listen.apply(this,args);
    }

    /**
     * publish domain'event. when have event's listener , then call the listener's handle method.
     * the listener is a actor object.
     * @memberof ActorListener.prototype
     * @method pub
     * @param event {DomainEvent} domain event
     */
    pub(event) {
        var listeners = this._data.repos[event.eventName] || [];
        listeners.forEach(listener=> {
            this.myDomain.get(listener.actorType, listener.actorId, (err, actor) => {
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
            let repo = repos[eventName] ? repos[eventName] : (repos[eventName] = []);
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