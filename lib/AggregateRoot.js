var inherits = require("util").inherits,
    Event = require("./Event"),
    uid = require("shortid");

function AggregateRoot() {
    this.__data = {};
    this.set("id", uid());
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
        value: function () {
            throw new Error("Please implement when method.");
        }
    },
    apply: {
        value: function (name, data) {
            var event = new Event(this.get("id"),name, data);
            this.when(event);
            this.uncommittedEvents.push(event);
            this._publish();
        }
    }
})

AggregateRoot.extend = function (option) {

    var Class = function () {
        AggregateRoot.call(this);
        if (option.constructor) {
            option.constructor.apply(this, arguments[0]);
        }
    }

    inherits(Class, AggregateRoot);

    for (var k in option.methods || {}) {
        Class.prototype[k] = option.methods[k];
    }

    if (option.when) {
        Object.defineProperty(Class.prototype, "when", {
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