var eventstore = require("eventstore"),
    Repository = require("./Repository"),
    EventBus = require("./EventBus");


function Domain() {
    this._es = eventstore();
    this._AggregateClasses = {};
    this.repos = {};
    this.eventBus = new EventBus(this._es,this.repos);
    this._es.init();
    this.repos = {};
}

Object.defineProperties(Domain.prototype, {

    register: {
        value: function (name, Class) {
            this._AggregateClasses[name] = Class;
            this.repos[name] = new Repository(name, Class, this._es, this.eventBus);
        }
    }

})

module.exports = Domain;