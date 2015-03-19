"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Actor = require("./Actor"),
    _ = require("underscore");

/**
 * Only cqrs container use it.
 * @class ActorListener
 * @extends Actor
 */

var ActorListener = (function (_Actor) {
    function ActorListener() {
        _classCallCheck(this, ActorListener);

        _get(Object.getPrototypeOf(ActorListener.prototype), "constructor", this).call(this, { id: "ActorListenerId", repos: {} });
    }

    _inherits(ActorListener, _Actor);

    _createClass(ActorListener, {
        listen: {

            /**
             * Listen a actor's domain event.
             * @memberof ActorListener.prototype
             * @method listen
             * @param eventName
             * @param actor
             * @param handle
             * @param isOne
             */

            value: function listen(eventName, actor, handle, isOne) {
                var actorType = actor.type;
                var actorId = actor.id;
                var param = { eventName: eventName, actorType: actorType, actorId: actorId, handle: handle, isOne: isOne };
                this._apply("listen", param);
            }
        },
        listenOne: {

            /**
             * Listen once a actor's domain event.
             * @memberof ActorListener.prototype
             * @method listenOne
             * @see ActorListener#listen
             */

            value: function listenOne() {
                var args = _.toArray(arguments);
                args[3] = true;
                this.listen.apply(this, args);
            }
        },
        pub: {

            /**
             * publish domain'event. when have event's listener , then call the listener's handle method.
             * the listener is a actor object.
             * @memberof ActorListener.prototype
             * @method pub
             * @param event {DomainEvent} domain event
             */

            value: function pub(event) {
                var _this = this;

                var list = this._data.repos[event.name] || [];

                list.forEach(function (listener) {
                    _this.myDomain.get(listener.actorType, listener.actorId, function (err, actor) {
                        if (actor && actor[listener.handle]) actor[listener.handle](event);
                    });
                });

                this._apply("emit", event.name);
            }
        },
        _when: {
            value: function _when(event) {

                var repos = this._data.repos;
                if (event.name === "listen") {

                    var eventName = event.data.eventName;
                    var repo = undefined;
                    repo = (repo = repos[eventName]) ? repos[eventName] : repos[eventName] = [];
                    repo.push(event.data);
                } else if (event.name === "emit") {

                    var list = repos[event.data] || [];

                    for (var i = 0, len = list.length; i < len; i++) {
                        var listener = list[i];
                        if (listener.isOne) {
                            list[i] = null;
                        }
                    }
                    repos[event.data] = _.compact(list);
                }
            }
        }
    }, {
        type: {

            /**
             * type is ActorListener
             * @member ActorListener#type
             * @see AbstractActor#type
             */

            get: function () {
                return "ActorListener";
            }
        }
    });

    return ActorListener;
})(Actor);

module.exports = ActorListener;