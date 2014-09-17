var eventstore = require("eventstore"),
    wrapAggregateObj = require("./wrapAggregateObj"),
    EventBus = require("./EventBus");


function Domain() {
    var self = this;
    this._es = eventstore();
    this._AggregateClasses = {};
    this._eventBus = new EventBus(this._es);
    this._publish = function(){
        self._eventBus.publish(this);
    }
    this._es.init();
    this._cache = {}; // { id : aggregationObject }

}

Object.defineProperties(Domain.prototype, {
    get: {
        value: function (AggregationClassName, id, cb) {

            var result, self = this;


            function isExist() {
                if (result = self._cache[id]) {
                    cb(null, result);
                    return true;
                }
                return false;
            }

            if (isExist()) return;

            var Class = this._AggregateClasses[AggregationClassName];

            this._es.getFromSnapshot(id, function (err, snapshot, stream) {

                if (err) {

                    if (isExist()) return;
                    cb(err);

                } else {

                    if (isExist()) return;
                    var snap = snapshot.data;
                    var history = stream.events;
                    result = new Class();

                    // mix aggregate object.
                    result.loadSnap(snap);
                    result.loadEvents(history);

                    // set eventbus publish method.
                    result._publish = self._publish();

                    cb(null, self._cache[id] = wrapAggregateObj(result));
                }
            });

        }
    },
    registerAggregateClass: {
        value: function (name, Class) {
            this._AggregateClasses[name] = Class;
        }
    }

})

module.exports = Domain;