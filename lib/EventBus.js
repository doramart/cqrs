var Emiter = require("events").EventEmitter,
    inherits = require("util").inherits;

function EventBus(es, repos) {

    Emiter.call(this);

    var self = this;
    this.repos = repos;

    es.useEventPublisher(function (evt) {
        self.emit(evt.name, evt);
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

