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
            this._emiter.on(n, option.listeners[n].bind(this));
        }

    }

    // extend AggregateRoot class
    var Class = AggregateRoot.extend(option);
    inherits(Saga, Class);

    Saga.className = Class.className;

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

        _apply: {
            value: function (name, data) {
                if (this.isCompleted()) return;

                if (this.get("alive")) {

                    var event = new Event({
                        aggregateId: this.get("id"),
                        name: name,
                        aggregateType: this.constructor.className,
                        type: "saga",
                        data: data
                    });
                    this.when(event);
                    this.uncommittedEvents.push(event);
                    this._publish();
                }

            }
        },

        // domain context call , don't call yourself.
        _emit: {
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

    Saga.listeners = option.listeners;

    return Saga;

}






