"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var thunkify = require("thunkify");
var Emitter = require("events").EventEmitter;
var cache = Symbol("cache");

/**
 * @class Repository
 */

var Repository = (function (Emitter) {

    /**
     * @constructor
     * @param Actor
     * @param eventstore
     */

    function Repository(Actor, eventstore) {
        _classCallCheck(this, Repository);

        this.__Actor = Actor;
        this.__getFromSnapShot = thunkify(eventstore.getFromSnapshot).bind(eventstore);
        this.__createSnapshot = thunkify(eventstore.createSnapshot).bind(eventstore);
        this.__cache = {};
    }

    _inherits(Repository, Emitter);

    _prototypeProperties(Repository, null, {
        create: {

            /**
             * Create a Actor object.
             * @method *create
             * @memberof Repository.prototype
             * @param data
             * @returns {Actor}
             */

            value: regeneratorRuntime.mark(function create(data) {
                var _this = this;

                var actor, result, stream;
                return regeneratorRuntime.wrap(function create$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                        case 0:
                            actor = new _this.__Actor(data);
                            context$2$0.next = 3;
                            return _this.__getFromSnapShot(actor.id);

                        case 3:
                            result = context$2$0.sent;
                            stream = result[1];
                            context$2$0.next = 7;
                            return _this.__createSnapshot({
                                streamId: actor.id,
                                data: _this.__Actor.toJSON(actor),
                                revision: stream.lastRevision
                            });

                        case 7:

                            _this.__cache[actor.id] = actor;

                            return context$2$0.abrupt("return", actor);

                        case 9:
                        case "end":
                            return context$2$0.stop();
                    }
                }, create, this);
            }),
            writable: true,
            configurable: true
        },
        clear: {
            value: function clear(id) {
                delete this.__cache[id];
            },
            writable: true,
            configurable: true
        },
        getFromCache: {
            value: function getFromCache(id) {
                return this.__cache[id];
            },
            writable: true,
            configurable: true
        },
        get: {
            value: regeneratorRuntime.mark(function get(id) {
                var _this = this;

                var actor, returnFun, result, snapshot, stream, snap, history, historyv;
                return regeneratorRuntime.wrap(function get$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                        case 0:
                            actor = undefined, returnFun = function returnFun() {
                                if (actor && actor.data.alive === false) {
                                    return null;
                                } else {
                                    return actor;
                                }
                            };

                            if (!(actor = _this.getFromCache(id))) {
                                context$2$0.next = 3;
                                break;
                            }

                            return context$2$0.abrupt("return", returnFun());

                        case 3:
                            context$2$0.next = 5;
                            return _this.__getFromSnapShot(id);

                        case 5:
                            result = context$2$0.sent;

                            if (!(actor = _this.getFromCache(id))) {
                                context$2$0.next = 8;
                                break;
                            }

                            return context$2$0.abrupt("return", returnFun());

                        case 8:
                            snapshot = result[0];
                            stream = result[1];

                            if (snapshot) {
                                context$2$0.next = 12;
                                break;
                            }

                            return context$2$0.abrupt("return");

                        case 12:
                            snap = snapshot.data;

                            actor = new _this.__Actor(snap);

                            history = stream.events;
                            historyv = [];

                            history.forEach(function (e) {
                                historyv.push(e.payload);
                            });

                            actor.$$loadEvents(historyv);

                            _this.__cache[actor.id] = actor;

                            return context$2$0.abrupt("return", returnFun());

                        case 20:
                        case "end":
                            return context$2$0.stop();
                    }
                }, get, this);
            }),
            writable: true,
            configurable: true
        }
    });

    return Repository;
})(Emitter);

module.exports = Repository;