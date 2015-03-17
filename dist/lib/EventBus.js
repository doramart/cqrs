"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmiter = require("events").EventEmitter,
    Event = require("./DomainEvent");

/**
 * @class EventBus
 * @param eventstore
 */

var EventBus = (function (_EventEmiter) {
    function EventBus(eventstore) {
        var _this = this;

        _classCallCheck(this, EventBus);

        this.es = eventstore;
        this.es.useEventPublisher(function (evt, cb) {
            _this.__publish(evt);
        });
        this.es.init();
    }

    _inherits(EventBus, _EventEmiter);

    _createClass(EventBus, {
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
            }
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
            }
        }
    });

    return EventBus;
})(EventEmiter);

module.exports = EventBus;

// snapshot saved