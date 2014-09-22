var EventEmitter = require("events").EventEmitter,
    AggregateRoot = require("./AggregateRoot"),
    Event = require("./Event"),
    inherits = require("util").inherits;

exports.extend = function (option) {

    option.listeners = option.listeners || {};
    var listenerEventNameList = Object.keys(option.listeners);

    // Saga class
    function Saga() {

        Class.apply(this, arguments);

        this.set("completed", false);
        this._emiter = new EventEmitter();

        for (var n in option.listeners) {
            this._emiter.once(n, option.listeners[n].bind(this));
        }

    }

    // extend AggregateRoot class
    var Class = AggregateRoot.extend(option);
    inherits(Saga, Class);

    // add same saga method.
    Object.defineProperties(Saga.prototype, {

        isCompleted: {
            value: function () {
                return this.get("completed");
            }
        },

        completed: {
            value: function () {
                this.apply("completed");
            }
        },

        apply: {
            value: function (name, data) {
                if (this.isCompleted()) return;
                var event = new Event(this.get("id"), name, "saga", data);
                this.when(event);
                this.uncommittedEvents.push(event);
                this._publish();
            }
        },

        // domain context call , don't call yourself.
        emit: {
            value: function () {
                if (this.isCompleted()) return;
                this._emiter.emit.apply(this._emiter, arguments);
            }
        },

        // domain context call.
        listenerEventNameList: {
            get: function () {
                return listenerEventNameList;
            }
        }

    });

    return Saga;

}






