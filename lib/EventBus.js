var Emiter = require("events").EventEmitter,
    Event = require("./DomainEvent");

class EventBus extends Emiter {

    constructor(eventstore, repos, actorListener) {

        this.repos = repos;
        this.actorListener = actorListener;
        this.es = eventstore;

        this.es.useEventPublisher((evt, cb) => {
            this.emit(evt.targetType + "." + evt.targetId + ":" + evt.name, evt);
            this.emit(evt.targetType + "." + evt.targetId, evt);
            this.emit(evt.targetType + ":" + evt.name, evt);
            this.emit("." + evt.targetId + ":" + evt.name, evt);
            this.emit(":" + evt.name, evt);
            this.emit(evt.targetType, evt);
            this.emit("*", evt);
            if (evt.contextId) {
                this.emit(evt.targetType + "." + evt.targetId + ":" + evt.name + "&" + evt.contextId, evt);
                this.emit(evt.targetType + "." + evt.targetId + "&" + evt.contextId, evt);
                this.emit(evt.targetType + ":" + evt.name + "&" + evt.contextId, evt);
                this.emit("." + evt.targetId + ":" + evt.name + "&" + evt.contextId, evt);
                this.emit(":" + evt.name + "&" + evt.contextId, evt);
                this.emit(evt.targetType + "&" + evt.contextId, evt);
            }
        });

        this.es.init();

    }

    publish(actor) {



        var self = this;
        this.es.getFromSnapshot(actor.id, function (err, snap, stream) {

            var history = stream.events;

            if (history.length > 20) {
                self.es.createSnapshot({
                    streamId: actor.id,
                    data: actor.json,
                    revision: stream.lastRevision
                }, function (err) {
                    // snapshot saved
                });
            }

            if (actor.uncommittedEvents.length) {
                stream.addEvents(actor.uncommittedEvents);
                stream.commit();
                actor.uncommittedEvents = [];
            }

        })
    }


}

module.exports = EventBus;

