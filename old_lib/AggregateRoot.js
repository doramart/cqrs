var inherits = require("util").inherits,
    Event = require("./Event"),
    uid = require("shortid");

function AggregateRoot() {

    this.__data = {};
    this.set("id", uid());
    this.set("alive", true);
    this.uncommittedEvents = [];
}

Object.defineProperties(AggregateRoot.prototype, {
    set: {
        value: function (k, v) {
            if (arguments.length === 1) {
                for (var n in k) {
                    this.set(n, k[n]);
                }
            } else {
                this.__data[k] = v;
            }
        }
    },
    get: {
        value: function (k) {
            return this.__data[k];
        }
    },
    json: {
        writable: true,
        value: function () {
            return JSON.parse(JSON.stringify(this.__data));
        }
    },
    loadEvents: {
        value: function (events) {
            if (this.__isLoadEvents) return;
            events.forEach(function (event) {
                this.when(event);
            }.bind(this))
            this.__isLoadEvents = true;
        }
    },
    loadSnap: {
        writable: true,
        value: function (snap) {
            if (this.__isLoadSnap) return;
            this.__data = snap;
            this.__isLoadSnap = true;
        }
    },
    when: {
        writable: true,
        value: function (event) {
            if (event.name === "remove") {
                this.set("alive", false);
            }
            if (event.name === "completed") {
                this.set("completed", true);
            } else {
                this._when(event);
            }
        }
    },
    _apply: {
        value: function (name, data,sagaId, sagaType) {
            if (this.get("alive")) {

                var event = new Event({
                    sagaId:sagaId || null,
                    sagaType:sagaType || null,
                    aggregateId: this.get("id"),
                    name: name,
                    aggregateType: this.constructor.className,
                    type: "aggregate",
                    data: data
                });
                this.when(event);
                this.uncommittedEvents.push(event);
                this._publish();
            }
        }
    },

    remove: {
        value: function () {
            this.apply("remove");
        }
    },

    _publish: {
        writable: true,
        value: function () {
            console.log("please implement _publish method.");
        }
    }
})

AggregateRoot.extend = function (option) {

    option = option || {};

    var Class = function (data, isLoadSnap) {
        AggregateRoot.call(this);
        if (option.constructor && !isLoadSnap) {
            option.constructor.call(this, data);
        }
    }

    var className = Class.className = option.className;

    inherits(Class, AggregateRoot);

    Object.defineProperty(Class.prototype, "className", {
        get function(){
            return className;
        }
    })

    for (var k in option.methods || {}) {
        Class.prototype[k] = option.methods[k];
    }

    if (option.when) {
        Object.defineProperty(Class.prototype, "_when", {
            value: option.when
        })
    }



    if (option.json)
        Object.defineProperty(Class.prototype, "json", {
            value: option.json
        })

    if (option.loadSnap)
        Object.defineProperty(Class.prototype, "loadSnap", {
            value: function (snap) {
                if (this.__isLoadSnap) return;
                option.loadSnap.bind(this)(snap);
                this.__isLoadSnap = true;
            }
        })


    return Class;

}


module.exports = AggregateRoot;