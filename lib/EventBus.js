var Emiter = require("events").EventEmitter,
    co = require("co"),
    emitter = Symbol("emitter"),
    inherits = require("util").inherits;

class EventBus extends Emiter {

    constructor(es, repos) {


        this.listenerRepo = {}

        this.es = es;
        var self = this;
        this.repos = repos;

        es.useEventPublisher(function (evt) {

            co(function *() {

                if (evt.callerId) {

                    var actor = yield self.repos[evt.callerType].get(evt.callerId);

                    if (actor) {
                        saga._emit(evt.aggregateType + "." + evt.aggregateId + ":" + evt.name, evt);
                        saga._emit("." + evt.aggregateId + ":" + evt.name, evt);
                        saga._emit("." + evt.aggregateId, evt);
                        saga._emit(evt.aggregateType + ":" + evt.name, evt);
                        saga._emit(evt.aggregateType, evt);
                        saga._emit(":" + evt.name, evt);
                    }

                    emit(self);

                } else {
                    emit(self);
                }

                function emit(self) {
                    self.emit(evt.aggregateType + "." + evt.aggregateId + ":" + evt.name, evt);
                    self.emit("." + evt.aggregateId + ":" + evt.name, evt);
                    self.emit("." + evt.aggregateId, evt);
                    self.emit(evt.aggregateType + ":" + evt.name, evt);
                    self.emit(evt.aggregateType, evt);
                    self.emit(":" + evt.name, evt);
                }
            })()

        })

    }

    publsh(actor) {
        this.es.getEventStream(actor.id, function (err, stream) {
            if (aggregation.uncommittedEvents.length) {
                stream.addEvents(aggregation.uncommittedEvents);
                stream.commit();
                actor.uncommittedEvents = [];
            }
        })
    }

    listen(eventname, actor, handleName) {

        if(!this.listenerRepo[eventname]){
            this.listenerRepo[eventname] = []
        }


    }

}

module.exports = EventBus;

