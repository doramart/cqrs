"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Actor = require("./Actor"),
    _ = require("underscore");

/**
 * Only cqrs container use it.
 * @class ActorListener
 */

var ActorListener = (function (Actor) {
    function ActorListener() {
        _classCallCheck(this, ActorListener);

        _get(Object.getPrototypeOf(ActorListener.prototype), "constructor", this).call(this, { id: "ActorListenerId", repos: {} });
    }

    _inherits(ActorListener, Actor);

    _prototypeProperties(ActorListener, {
        type: {

            /**
             * type is ActorListener
             * @member type
             * @see AbstractActor#type
             */

            get: function () {
                return "ActorListener";
            },
            configurable: true
        }
    }, {
        listen: {

            /**
             * Listen a actor's domain event.
             * @memberof ActorListener.prototype
             * @member listen
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
            },
            writable: true,
            configurable: true
        },
        listenOne: {

            /**
             * Listen once a actor's domain event.
             * @memberof ActorListener.prototype
             * @member listenOne
             * @see Abstractor#listen
             */

            value: function listenOne() {
                var args = _.toArray(arguments);
                args[3] = true;
                this.listen.apply(this, args);
            },
            writable: true,
            configurable: true
        },
        pub: {

            /**
             *
             * @memberof ActorListener#prototype
             * @member pub
             * @param event domain event
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
            },
            writable: true,
            configurable: true
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
            },
            writable: true,
            configurable: true
        }
    });

    return ActorListener;
})(Actor);

module.exports = ActorListener;