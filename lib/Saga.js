var Root = require("./Root"),
    EventEmitter = require("events").EventEmitter,
    inherits = require("util").inherits;

function Saga() {
}

Saga.extend = function (option) {

    option.listeners = option.listeners || {};
    var R = Root.extend(option);

    // Saga Class
    var Class = function () {

        // extend Root
        R.apply(this, arguments);

        this.set("_isCompleted", false);
        var emitter = new EventEmitter();

        for (var n in option.listeners) {
            emitter.on(n, option.listeners[n]);
        }
    }

    inherits(Class, R);

    Class.prototype.isCompleted = function () {
        return this.get("_isCompleted");
    }

    Class.prototype.completed = function(){
        // DOTO
        this.publish({name:"completed"});
    }

}






