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

            var self = this;

            Object.defineProperty(Class.prototype,"domain",{
                get:function(){
                    return self;
                }
            })

            this._AggregateClasses[name] = Class;
            this.repos[name] = new Repository(name, Class, this._es, this.eventBus);
        }
    }

})

module.exports = Domain;