var Emiter = require("events").EventEmitter,
    inherits = require("util").inherits;

function EventBus(es, repos) {

    Emiter.call(this);

    var self = this;
    this.repos = repos;

    es.useEventPublisher(function (evt) {

        if (evt.sagaId) {
            self.repos.get(evt.sagaId, function (err, saga) {
                if (saga) {
                    saga._emit(evt.aggregateType + "." + evt.aggregateId + ":" + evt.name, evt);
                    saga._emit("." + evt.aggregateId + ":" + evt.name, evt);
                    saga._emit("." + evt.aggregateId, evt);
                    saga._emit(evt.aggregateType + ":" + evt.name, evt);
                    saga._emit(evt.aggregateType, evt);
                    saga._emit(":" + evt.name, evt);
                }
                emit(self);
            })
        }else{
            emit(self);
        }

        function emit(self){
            self.emit(evt.aggregateType + "." + evt.aggregateId + ":" + evt.name, evt);
            self.emit("." + evt.aggregateId + ":" + evt.name, evt);
            self.emit("." + evt.aggregateId, evt);
            self.emit(evt.aggregateType + ":" + evt.name, evt);
            self.emit(evt.aggregateType, evt);
            self.emit(":" + evt.name, evt);
        }

    })

    this.es = es;
}

inherits(EventBus, Emiter);

Object.defineProperties(EventBus.prototype, {

    // publish aggregate uncommited events.
    publish: {
        value: function (aggregation) {
            var self = this;
            this.es.getEventStream(aggregation.get("id"), function (err, stream) {
                if (aggregation.uncommittedEvents.length) {
                    stream.addEvents(aggregation.uncommittedEvents);
                    stream.commit();
                    aggregation.uncommittedEvents = [];
                }
            });
        }
    }

})

module.exports = EventBus;

