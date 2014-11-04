var eventstore = require("eventstore"),
    Repository = require("./Repository"),
    Saga = require("./Saga"),
    AggregateRoot = require("./AggregateRoot"),
    EventBus = require("./EventBus");


function Domain() {
    this._es = eventstore();
    this._AggregateClasses = {};
    this._eventBus = new EventBus(this._es, this.repos);
    this._es.init();
    this._repos = {};
}

Object.defineProperties(Domain.prototype, {

    _register: {
        value: function (Class) {
            this._AggregateClasses[Class.className] = Class;
            this._repos[Class.className] = new Repository(Class.className, Class, this._es, this._eventBus);
        }
    },

    register: {
        value: function (option) {
            if (option.type === "saga") {
                this.registerSaga(option);
            } else {
                this.registerAggregateRoot(option);
            }
            return this;
        }
    },

    registerSaga: {
        value: function (option) {

            var Class = Saga.extend(option);

            var self = this;

            Object.defineProperty(Class.prototype, "domain", {
                get: function () {
                    return {
                        exec: function (command) {
                            command.sagaId = this.get("id");
                            command.sagaType = this.className;
                            self._exec(command)
                        }
                    }
                }
            })

            this._register(Class);

            return this;
        }

    },

    registerAggregateRoot: {
        value: function (option) {

            var Class = AggregateRoot.extend(option);

            var self = this;

            Object.defineProperty(Class.prototype, "domain", {
                get: function () {
                    return {
                        exec: function (command) {
                            self.exec(command);
                        }
                    }
                }
            })

            this._register(Class);

            return this;
        }
    },

    _exec: {
        value: function (command) {
            this._repos[command.AggregateType].get(command.aggregateId, function (err, obj) {
                obj[methodName](data, function () {
                    this._apply(command.methodName, command.data, command.sagaId, command.sagaType);
                }.bind(obj));
            })
        }
    },

    exec: {
        value: function (command) {
            delete command.sagaId;
            delete command.sagaType;
            this._exec(command);
        }
    },

    create: {
        value: function (className, data, cb) {
            this._repos[className].create(data, cb);
        }
    },

    get: {
        value: function (className, id, cb) {
            this._repos[className].get(id, function (err, obj) {
                if (obj) {
                    cb(null, obj.json());
                } else {
                    cb(err);
                }
            })
        }
    },

    addListener: {
        value: function (eventName, listener) {
            this._eventBus.on(eventName, listener);
        }
    }

})

module.exports = Domain;
