"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmiter = require("events").EventEmitter,
    Event = require("./DomainEvent");

/**
 * @class EventBus
 * @param eventstore
 */

var EventBus = (function (EventEmiter) {
    function EventBus(eventstore) {
        var _this = this;

        _classCallCheck(this, EventBus);

        this.es = eventstore;
        this.es.useEventPublisher(function (evt, cb) {
            _this.__publish(evt);
        });
        this.es.init();
    }

    _inherits(EventBus, EventEmiter);

    _prototypeProperties(EventBus, null, {
        __publish: {

            /**
             *
             * @param evt
             * @private
             */

            value: function __publish(evt) {
                this.emit(evt.actorType + "." + evt.actorId + ":" + evt.name, evt);
                this.emit(evt.actorType + "." + evt.actorId, evt);
                this.emit(evt.actorType + ":" + evt.name, evt);
                this.emit("." + evt.actorId + ":" + evt.name, evt);
                this.emit(":" + evt.name, evt);
                this.emit(evt.actorType, evt);
                this.emit("*", evt);
                if (evt.contextId) {
                    this.emit(evt.actorType + "." + evt.actorId + ":" + evt.name + "&" + evt.contextId, evt);
                    this.emit(evt.actorType + "." + evt.actorId + "&" + evt.contextId, evt);
                    this.emit(evt.actorType + ":" + evt.name + "&" + evt.contextId, evt);
                    this.emit("." + evt.actorId + ":" + evt.name + "&" + evt.contextId, evt);
                    this.emit(":" + evt.name + "&" + evt.contextId, evt);
                    this.emit(evt.actorType + "&" + evt.contextId, evt);
                }
            },
            writable: true,
            configurable: true
        },
        publish: {

            /**
             * @method publish
             * @memberof EventBus.prototype
             * @param actor
             */

            value: function publish(actor) {

                if (actor) {
                    var self = this;

                    this.es.getFromSnapshot(actor.id, function (err, snap, stream) {

                        var history = stream.events;

                        if (history.length > 20) {
                            self.es.createSnapshot({
                                streamId: actor.id,
                                data: actor.json,
                                revision: stream.lastRevision
                            }, function (err) {});
                        }

                        if (actor.$$uncommittedEvents.length) {
                            stream.addEvents(actor.$$uncommittedEvents);
                            stream.commit();
                            actor.$$uncommittedEvents = [];
                        }
                    });
                }
            },
            writable: true,
            configurable: true
        }
    });

    return EventBus;
})(EventEmiter);

module.exports = EventBus;

// snapshot saved