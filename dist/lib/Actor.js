"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var AbstractActor = require("./AbstractActor");
var uid = require("shortid");

/**
 * @class Actor
 * @augments AbstractActor
 * @param data {{}}
 */

var Actor = (function (_AbstractActor) {
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

    _inherits(Actor, _AbstractActor);

    _createClass(Actor, {
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
            }
        },
        id: {

            /**
             * @member id {string}
             * @memberof Actor.prototype
             * @type {String}
             */

            get: function () {
                return this._data.id;
            }
        },
        $$loadEvents: {
            value: function $$loadEvents(events) {
                _get(Object.getPrototypeOf(Actor.prototype), "$$loadEvents", this).call(this, events);
                this.refreshData();
            }
        }
    }, {
        type: {

            /**
             * @member type {String}
             * @memberof Actor
             * @static
             */

            get: function () {
                return this.name;
            }
        },
        parse: {

            /**
             * @method parse
             * @memberof Actor
             * @see AbstractActor.parse
             * @param json {Object}
             * @static
             * @return {Actor}
             */

            value: function parse(json) {
                var actor = new this(json);
                actor._data.id = json.id;
                return actor;
            }
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
            }
        }
    });

    return Actor;
})(AbstractActor);

module.exports = Actor;