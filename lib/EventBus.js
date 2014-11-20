var Emiter = require("events").EventEmitter,
    Event = require("./Event");

class EventBus extends Emiter{

    constructor(eventstore, repos ,actorListener) {

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
            this.emit("*",event);
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
        this.es.getEventStream(actor.id, function (err, stream) {
            if (actor.uncommittedEvents.length) {
                stream.addEvents(actor.uncommittedEvents);
                stream.commit();
                actor.uncommittedEvents = [];
            }
        })
    }
    

}

module.exports = EventBus;

