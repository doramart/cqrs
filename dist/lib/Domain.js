"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventStore = require("eventstore"),
    Repository = require("./Repository"),
    co = require("co"),
    Q = require("q"),
    Actor = require("./Actor"),
    DomainEvent = require("./DomainEvent"),
    ActorListener = require("./ActorListener"),
    EventBus = require("./EventBus");

/**
 * @class Domain
 * @param options {json}
 */

var Domain = (function () {
    function Domain(options) {
        var _this = this;

        _classCallCheck(this, Domain);

        /**
         *
         * @memberof Domain.prototype
         * @member __eventstore
         * @type {*|Eventstore|exports}
         * @private
         */
        this.__eventstore = EventStore(options);

        /**
         * @memberof Domain.prototype
         * @member __repos
         * @type {{Repository}}
         * @private
         */
        this.__repos = {};

        /**
         * @memberof Domain.prototype
         * @member __eventBus
         * @type {EventBus}
         * @private
         */
        this.__eventBus = new EventBus(this.__eventstore);

        // init eventstore
        this.__eventstore.init(function () {

            var self = _this;

            co(regeneratorRuntime.mark(function callee$3$0() {
                var repo, actorListener;
                return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:

                            self.register(ActorListener);

                            repo = self.__repos.ActorListener;
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

                            /**
                             * @memberof Domain.prototype
                             * @member __actorListener
                             * @type {ActorListener}
                             * @private
                             */
                            self.__actorListener = actorListener;

                            self.__eventBus.on("*", function (evt) {

                                if (evt.actorType === "ActorListener") return;

                                actorListener.pub({ eventName: evt.actorType + "." + evt.actorId + ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: evt.actorType + "." + evt.actorId, event: evt });
                                actorListener.pub({ eventName: evt.actorType + ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: "." + evt.actorId + ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: ":" + evt.name, event: evt });
                                actorListener.pub({ eventName: evt.actorType, event: evt });

                                if (evt.contextId) {
                                    actorListener.pub({
                                        eventName: evt.actorType + "." + evt.actorId + "&" + evt.contextId,
                                        event: evt
                                    });
                                    actorListener.pub({
                                        eventName: evt.actorType + ":" + evt.name + "&" + evt.contextId,
                                        event: evt
                                    });
                                    actorListener.pub({
                                        eventName: "." + evt.actorId + ":" + evt.name + "&" + evt.contextId,
                                        event: evt
                                    });
                                    actorListener.pub({ eventName: ":" + evt.name + "&" + evt.contextId, event: evt });
                                    actorListener.pub({ eventName: evt.actorType + "&" + evt.contextId, event: evt });
                                }
                            });

                        case 11:
                        case "end":
                            return context$4$0.stop();
                    }
                }, callee$3$0, this);
            }));
        });
    }

    _createClass(Domain, {
        register: {

            /**
             * @memberof Domain.prototype
             * @method register
             * @param ActorClass {Actor}
             * @returns {Domain}
             */

            value: function register(ActorClass) {

                ActorClass.prototype.myDomain = this;

                var repo = new Repository(ActorClass, this.__eventstore);

                this.__repos[ActorClass.type] = repo;

                this.__actorEventHandle(repo);

                return this;
            }
        },
        __actorEventHandle: {
            value: function __actorEventHandle(repo) {
                var _this = this;

                var self = this;

                function actorApplyEventHandle(actor) {
                    if (actor.$$uncommittedEvents[0].name === "remove") {
                        self.__repos[actor.type].clear(actor.id);
                    }
                    self.__eventBus.publish(actor);
                }

                function actorListenEventHandle(eventName, handle, contextId) {
                    self.__actorListener.listen({ eventName: eventName, actor: this, handle: handle, contextId: contextId });
                }

                // listen actor
                var listenActorEventHandle = function (actor) {
                    actor.on("apply", actorApplyEventHandle);
                    actor.on("listen", actorListenEventHandle);
                    if (actor.$$uncommittedEvents.length) {
                        _this.__eventBus.publish(actor);
                    }
                };

                repo.on("create", listenActorEventHandle);
            }
        },
        create: {

            /**
             * create a actor object.
             * @method create
             * @param actorType {String}  actor's type.
             * @param data {json}
             * @param callback {Function}
             */

            value: function create(actorType, data, callback) {
                callback = callback || function () {};
                var eventBus = this.__eventBus;
                var repo = this.__repos[actorType];
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

                                eventBus.__publish(new DomainEvent("create", actor, actor.constructor.toJSON(actor)));
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
                }));
            }
        },
        get: {

            /**
             * get a actor
             * @method get
             * @param actorType {String}
             * @param actorId {String}
             * @param cb {Function}
             * @returns {Promise}
             */

            value: function get(actorType, actorId, cb) {
                var defer = Q.defer();
                var self = this;
                co(regeneratorRuntime.mark(function callee$2$0() {
                    var repo, actor;
                    return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                            case 0:
                                context$3$0.prev = 0;
                                repo = self.__repos[actorType];
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
                }));
                return defer.promise;
            }
        },
        once: {

            /**
             * once listen domain'event.
             * @method once
             * @memberof Domain.prototype
             * @param eventName
             * @param listener
             */

            value: function once(eventName, listener) {
                this.__eventBus.once(eventName, listener);
            }
        },
        on: {

            /**
             * listen domain'event.
             * @method on
             * @memberof Domain.prototype
             * @param eventName
             * @param listener
             */

            value: function on(eventName, listener) {
                this.__eventBus.on(eventName, listener);
            }
        },
        getEvents: {

            /**
             * @method getEvents
             * @memberof Domain.prototype
             * @param opts
             */

            value: function getEvents() {
                var _eventstore;

                for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
                    opts[_key] = arguments[_key];
                }

                (_eventstore = this.__eventstore).getEvents.apply(_eventstore, opts);
            }
        }
    });

    return Domain;
})();

module.exports = Domain;