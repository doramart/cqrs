var inherits = require("util").inherits,
    Entity = require("./Entity");

function Root() {
    Entity.call(this);
}

inherits(Root, Entity);

Root.extend = function () {

    option.methods = option.methods || {};
    option.when = option.when || function () {
    };

    var Class = function () {
        Root.call(this);
        if (option.constructor) {
            option.constructor.apply(this, arguments);
        }
    }

    inherits(Class, Root);

    for (var k in option.methods) {
        Class.prototype[k] = option.methods[k];
    }

    Class.prototype.loadSnap = option.loadSnap ? function(snap){
        if (this.__isLoadSnap) return;
        option.loadSnap(snap);
        this.__isLoadSnap = true;
    }  : function (snap) {
        if (this.__isLoadSnap) return;
        this.__data = snap;
        this.__isLoadSnap = true;
    }

    Class.prototype.loadEvents = function (events) {
        if (this.__isLoadEvents) return;
        events.forEach(function (event) {
            this.when(event);
        })
        this.__isLoadEvents = true;
    }


    return Class;

}
