var Emiter = require("events").EventEmitter,
    Event = require("./Event");

class EventBus extends Emiter {

    constructor(eventstore, repos, actorListener) {

        this.repos = repos;
        this.actorListener = actorListener;
        this.es = eventstore;

        this.es.useEventPublisher((evt, cb) => {
            let event = Event.reborn(evt);
            this.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name, event);
            this.emit(evt.data.targetType + "." + evt.data.targetId, event);
            this.emit(evt.data.targetType + ":" + evt.name, event);
            this.emit("." + evt.data.targetId + ":" + evt.name, event);
            this.emit(":" + evt.name, event);
            this.emit(evt.data.targetType, event);
            this.emit("*", event);
            if (evt.contextId) {
                this.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
                this.emit(evt.data.targetType + "." + evt.data.targetId + "&" + evt.contextId, event);
                this.emit(evt.data.targetType + ":" + evt.name + "&" + evt.contextId, event);
                this.emit("." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
                this.emit(":" + evt.name + "&" + evt.contextId, event);
                this.emit(evt.data.targetType + "&" + evt.contextId, event);
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

