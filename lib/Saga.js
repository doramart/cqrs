var EventEmitter = require("events").EventEmitter,
    AggregateRoot = require("./AggregateRoot"),
    inherits = require("util").inherits;

exports.extend = function (option) {

    var Class = AggregateRoot.extend(option);

    function Saga() {

        Class.apply(this,arguments);

        this.set("isCompleted", false);
        var emitter = new EventEmitter();

        for (var n in option.listeners) {
            emitter.on(n, option.listeners[n]);
        }

    }

    inherits(Saga,Class);

    Object.defineProperties(Saga.prototype, {
        isCompleted: {
            value: function () {
                return this.get("isCompleted");
            }
        },
        completed: {
            value: function () {
                this.apply("completed");
            }
        }
    });

    return Saga;

}






