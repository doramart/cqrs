var EventEmiter = require("events").EventEmitter,
    Event = require("./DomainEvent");

/**
 * @class EventBus
 * @param eventstore
 */
export default class EventBus extends EventEmiter {

    constructor(eventstore) {
        this.es = eventstore;
        this.es.useEventPublisher((evt, cb) => {
            this.__publish(evt);
        });
        this.es.init();
    }

    /**
     *
     * @param evt
     * @private
     */
    __publish(evt) {
        this.emit(evt.actorType + "." + evt.actorId + ":" + evt.name, evt);
        this.emit(evt.actorType + "." + evt.actorId, evt);
        this.emit(evt.actorType + ":" + evt.name, evt);
        this.emit("." + evt.actorId + ":" + evt.name, evt);
        this.emit(":" + evt.name, evt);
        this.emit(evt.actorType, evt);
        this.emit("*", evt);
        if (evt.contextId) {
            this.emit(evt.actorType + "." + evt.actorId + ":" + evt.name + "&" + evt.contextId, evt);
            this.emit(evt.actorType + "." + evt.actorId + "&" + evt.contextId, evt);
            this.emit(evt.actorType + ":" + evt.name + "&" + evt.contextId, evt);
            this.emit("." + evt.actorId + ":" + evt.name + "&" + evt.contextId, evt);
            this.emit(":" + evt.name + "&" + evt.contextId, evt);
            this.emit(evt.actorType + "&" + evt.contextId, evt);
        }
    }

    /**
     * @method publish
     * @memberof EventBus.prototype
     * @param actor
     */
    publish(actor) {

        if(actor){
            var self = this;

            this.es.getFromSnapshot(actor.id, function (err, snap, stream) {

                var history = stream.events;

                if (history.length > 20) {
                    self.es.createSnapshot({
                        streamId: actor.id,
                        data: actor.toJSON(),
                        revision: stream.lastRevision
                    }, function (err) {
                        // snapshot saved
                    });
                }

                if (actor.$$uncommittedEvents.length) {
                    stream.addEvents(actor.$$uncommittedEvents);
                    stream.commit();
                    actor.$$uncommittedEvents = [];
                }

            })
        }

    }


}


