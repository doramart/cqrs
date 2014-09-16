var EventEmitter = require("events").EventEmitter,
    AggregateRoot = require("./AggregateRoot"),
    inherits = require("util").inherits;

exports.extend = function (option) {

    option.listeners = option.listeners || {};

    // Saga class
    function Saga() {

        Class.apply(this, arguments);

        this.set("isCompleted", false);
        this._emiter = new EventEmitter();

        for (var n in option.listeners) {
            this._emiter.on(n, option.listeners[n].bind(this));
        }

    }

    // extend AggregateRoot class
    var Class = AggregateRoot.extend(option);
    inherits(Saga, Class);

    // add same saga method.
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
        },
        emit:{
            value:function(){
                this._emiter.emit.apply(this._emiter,arguments);
            }
        }
    });

    return Saga;

}






