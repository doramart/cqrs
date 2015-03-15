"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventStore = require("eventstore"),
    Repository = require("./Repository"),
    co = require("co"),
    Q = require("q"),
    Actor = require("./Actor"),
    DomainEvent = require("./DomainEvent"),
    ActorListener = require("./ActorListener"),
    EventBus = require("./EventBus");

var Domain = (function () {
    function Domain(options) {
        _classCallCheck(this, Domain);

        this.__eventstore = EventStore(options);
        this.repos = {};
        this.eventBus = new EventBus(this.__eventstore);

        var self = this;

        this.__eventstore.init(function () {
            co(regeneratorRuntime.mark(function callee$3$0() {
                var repo, actorListener;
                return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:

                            self.register(ActorListener);
                            repo = self.repos.ActorListener;
                            context$4$0.next = 4;
                            return repo.get("ActorListenerId");

                        case 4:
                            actorListener = context$4$0.sent;

                            if (actorListener) {
                                context$4$0.next = 9;
                                break;
                            }

                            context$4$0.next = 8;
                            return repo.create();

                        case 8:
                            actorListener = context$4$0.sent;

                        case 9:
                            self.actorListener = actorListener;
                            actorListener.actorRepos = self.repos;

                            self.eventBus.on("*", function (evt) {

                                if (evt.targetType === "ActorListener") return;

                                actorListener.pub({ eventName: evt.targetType + "." + evt.targetId + ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: evt.targetType + "." + evt.targetId, event: evt });
                                actorListener.pub({ eventName: evt.targetType + ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: "." + evt.targetId + ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: evt.targetType, event: evt });

                                if (evt.contextId) {
                                    actorListener.pub({
                                        eventName: evt.targetType + "." + evt.targetId + "&" + evt.contextId,
                                        event: evt
                                    });
                                    actorListener.pub({ eventName: evt.targetType + ":" + evt.name + "&" + evt.contextId, event: evt });
                                    actorListener.pub({
                                        eventName: "." + evt.targetId + ":" + evt.name + "&" + evt.contextId,
                                        event: evt
                                    });
                                    actorListener.pub({ eventName: ":" + evt.name + "&" + evt.contextId, event: evt });
                                    actorListener.pub({ eventName: evt.targetType + "&" + evt.contextId, event: evt });
                                }
                            });

                        case 12:
                        case "end":
                            return context$4$0.stop();
                    }
                }, callee$3$0, this);
            }))();
        });
    }

    _prototypeProperties(Domain, null, {
        register: {
            value: function register(ActorClass) {

                var self = this;

                if (typeof ActorClass !== "function") {
                    ActorClass = Actor.extend(arguments[0], arguments[1]);
                }

                if (!ActorClass.prototype.myDomain) {
                    Object.defineProperty(ActorClass.prototype, "myDomain", {
                        get: function get() {
                            return self;
                        }
                    });
                }

                var repo = new Repository(ActorClass, this.__eventstore);
                this.repos[ActorClass.type] = repo;

                this._actorEventHandle(repo);

                return this;
            },
            writable: true,
            configurable: true
        },
        _actorEventHandle: {
            value: function _actorEventHandle(repo) {
                var _this = this;

                var self = this;

                function actorApplyEventHandle(actor) {
                    if (actor.$uncommittedEvents[0].name === "remove") {
                        self.repos[actor.type].clear(actor.id);
                    }
                    self.eventBus.publish(actor);
                }

                function actorListenEventHandle(eventName, handle, contextId) {
                    self.actorListener.listen({ eventName: eventName, actor: this, handle: handle, contextId: contextId });
                }

                // listen actor
                var listenActorEventHandle = function (actor) {
                    actor.on("apply", actorApplyEventHandle);
                    actor.on("listen", actorListenEventHandle);
                    if (actor.$uncommittedEvents.length) {
                        _this.eventBus.publish(actor);
                    }
                };

                repo.on("create", listenActorEventHandle);
            },
            writable: true,
            configurable: true
        },
        create: {
            value: function create(actorType, data, callback) {
                callback = callback || function () {};
                var eventBus = this.eventBus;
                var repo = this.repos[actorType];
                co(regeneratorRuntime.mark(function callee$2$0() {
                    var actor;
                    return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                            case 0:
                                context$3$0.prev = 0;
                                context$3$0.next = 3;
                                return repo.create(data);

                            case 3:
                                actor = context$3$0.sent;

                                // doto
                                eventBus._publish(new DomainEvent("create", actor, actor.constructor.toJSON(actor)));
                                callback(null, actor.id);
                                process.nextTick(function () {
                                    repo.emit("create", actor);
                                });

                                context$3$0.next = 12;
                                break;

                            case 9:
                                context$3$0.prev = 9;
                                context$3$0.t0 = context$3$0["catch"](0);

                                callback(context$3$0.t0);

                            case 12:
                            case "end":
                                return context$3$0.stop();
                        }
                    }, callee$2$0, this, [[0, 9]]);
                }))();
            },
            writable: true,
            configurable: true
        },
        get: {
            value: function get(actorType, actorId, cb) {
                var defer = Q.defer();
                var self = this;
                co(regeneratorRuntime.mark(function callee$2$0() {
                    var repo, actor;
                    return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                            case 0:
                                context$3$0.prev = 0;
                                repo = self.repos[actorType];
                                context$3$0.next = 4;
                                return repo.get(actorId);

                            case 4:
                                actor = context$3$0.sent;

                                defer.resolve(actor);
                                context$3$0.next = 12;
                                break;

                            case 8:
                                context$3$0.prev = 8;
                                context$3$0.t1 = context$3$0["catch"](0);

                                defer.reject(context$3$0.t1);
                                if (cb) {
                                    cb(context$3$0.t1);
                                }

                            case 12:
                                if (cb) {
                                    cb(null, actor);
                                }

                            case 13:
                            case "end":
                                return context$3$0.stop();
                        }
                    }, callee$2$0, this, [[0, 8]]);
                }))();
                return defer.promise;
            },
            writable: true,
            configurable: true
        },
        addListener: {
            value: function addListener(eventName, listener) {
                this.eventBus.on(eventName, listener);
                return this;
            },
            writable: true,
            configurable: true
        },
        once: {
            value: function once(eventName, listener) {
                this.eventBus.once(eventName, listener);
                return this;
            },
            writable: true,
            configurable: true
        },
        on: {
            value: function on(eventName, listener) {
                this.eventBus.on(eventName, listener);
                return this;
            },
            writable: true,
            configurable: true
        },
        getHistory: {
            value: function getHistory() {
                var _eventstore;

                for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
                    opts[_key] = arguments[_key];
                }

                (_eventstore = this.__eventstore).getEvents.apply(_eventstore, opts);
            },
            writable: true,
            configurable: true
        }
    });

    return Domain;
})();

module.exports = Domain;