var Emiter = require("events").EventEmitter,
    Event = require("./Event"),
    co = require("co");

class EventBus {

    constructor(eventstore, repos) {

        this.repos = repos;

        this.es = eventstore;

        this.emitter = new Emiter();

        this.es.useEventPublisher((evt, cb) => {

            let event = Event.reborn(evt);
            this.emitter.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name, event);
            this.emitter.emit(evt.data.targetType + ":" + evt.name, event);
            this.emitter.emit("." + evt.data.targetId + ":" + evt.name, event);
            this.emitter.emit(":" + evt.name, event);
            this.emitter.emit(evt.data.targetType, event);
            if (evt.contextId) {
                this.emitter.emit(evt.data.targetType + "." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
                this.emitter.emit(evt.data.targetType + ":" + evt.name + "&" + evt.contextId, event);
                this.emitter.emit("." + evt.data.targetId + ":" + evt.name + "&" + evt.contextId, event);
                this.emitter.emit(":" + evt.name + "&" + evt.contextId, event);
                this.emitter.emit(evt.data.targetType + "&" + evt.contextId, event);
            }
        })

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

    listen(actor, eventname, handleName, contextId, onlyContext) {

        var actorId = actor.id;
        var actorType = actor.typeName;

        this.emitter.on(eventname + (onlyContext && contextId ? "&" + contextId : ""), event=> {

            co(function *(self) {
                var act = yield self.repos[actorType].get(actorId);
                act.call(handleName, event, contextId);
            })(this);

        })
    }

}

module.exports = EventBus;

