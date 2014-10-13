
function Repository(ClassName, Class, eventstore, eventbus) {
    this.ClassName = ClassName;
    this.Class = Class;
    var self = this;
    this._es = eventstore;
    this._eventBus = eventbus;

    Object.defineProperty(Class.prototype, "_publish", {
        value: function () {
            self._eventBus.publish(this);
        }
    })

    this._es.init();
    this._cache = {};
}

Object.defineProperties(Repository.prototype, {

    create: {
        value: function (data, cb) {
            var self = this;
            var obj = new this.Class(data);
            this._es.getFromSnapshot(obj.get("id"), function (err, snapshot, stream) {
                self._es.createSnapshot({
                    aggregateId: obj.get("id"),
                    aggregate: self.ClassName,
                    data: obj.json(),
                    revision: stream.lastRevision
                }, function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        self._cache[obj.get("id")] = obj;
                        cb(null, obj.get("id"));
                    }
                });
            })
        }
    },

    // doto , new only test.
    clear:{
        value:function(id){
            delete this._cache[id];
        }
    },

    get: {
        value: function (id, cb) {

            var result, self = this;

            function isExist() {
                if (result = self._cache[id]) {
                    cb(null, result);
                    return true;
                }
                return false;
            }

            if (isExist()) return;

            var Class = this.Class;
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

                    var historyv = [];

                    history.forEach(function(e){
                        historyv.push(e.payload);
                    })

                    result.loadEvents(historyv);

                    cb(null, self._cache[id] = result);
                }
            });

        }
    }

})

module.exports = Repository;