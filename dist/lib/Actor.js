"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var AbstractActor = require("./AbstractActor");
var uid = require("shortid");
var inherits = require("util").inherits;
var debug = require("debug")("Actor");

/**
 * @class Actor
 * @augments AbstractActor
 * @param data {{}}
 */

var Actor = (function (AbstractActor) {
    function Actor() {
        var data = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Actor);

        _get(Object.getPrototypeOf(Actor.prototype), "constructor", this).call(this);
        /**
         * Only call it use _when.
         * @see Actor#_when
         * @member Actor#_data
         * @protected
         * @type {Object}
         */
        this._data = data;
        if (!this._data.id) this._data.id = uid();
        this.on("apply", this.refreshData);
        this.refreshData();
    }

    _inherits(Actor, AbstractActor);

    _prototypeProperties(Actor, {
        type: {

            /**
             * @member type {String}
             * @memberof Actor
             * @static
             */

            get: function () {
                return this.name;
            },
            configurable: true
        },
        parse: {

            /**
             * @method parse
             * @memberof Actor
             * @see AbstractActor#parse
             * @param json {Object}
             * @static
             * @return {Actor}
             */

            value: function parse(json) {
                var actor = new this(json);
                actor._data.id = json.id;
                return actor;
            },
            writable: true,
            configurable: true
        },
        toJSON: {

            /**
             * @method toJSON
             * @memberof Actor
             * @param actor {Actor}
             * @return {object}
             * @static
             * @see AbstractActor.toJSON
             */

            value: function toJSON(actor) {
                return JSON.parse(JSON.stringify(actor._data));
            },
            writable: true,
            configurable: true
        }
    }, {
        refreshData: {

            /**
             * refresh actor's data
             * @method refreshData
             * @memberof Actor#prototype
             */

            value: function refreshData() {
                /**
                 * @readonly
                 * @member Actor#data
                 * @public
                 * @type {Object}
                 */
                this.data = this.constructor.toJSON(this);
            },
            writable: true,
            configurable: true
        },
        id: {

            /**
             * @member id {string}
             * @memberof Actor.prototype
             * @type {String}
             */

            get: function () {
                return this._data.id;
            },
            configurable: true
        },
        $$loadEvents: {
            value: function $$loadEvents(events) {
                _get(Object.getPrototypeOf(Actor.prototype), "$$loadEvents", this).call(this, events);
                this.refreshData();
            },
            writable: true,
            configurable: true
        }
    });

    return Actor;
})(AbstractActor);

module.exports = Actor;