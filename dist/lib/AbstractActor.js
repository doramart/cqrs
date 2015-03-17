"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = require("events").EventEmitter;
var DomainEvent = require("./DomainEvent");

/**
 * A abstract actor class.
 * @class AbstractActor
 */

var AbstractActor = (function (_EventEmitter) {
  function AbstractActor() {
    _classCallCheck(this, AbstractActor);

    _get(Object.getPrototypeOf(AbstractActor.prototype), "constructor", this).call(this);
    /**
     * Only system calls.
     *
     * uncommitted domain'events.
     *
     * @member AbstractActor#$$uncommittedEvents
     * @type {Array}
     */
    this.$$uncommittedEvents = [];
  }

  _inherits(AbstractActor, _EventEmitter);

  _createClass(AbstractActor, {
    type: {

      /**
       * @member AbstractActor#type
       * @type {String}
       */

      get: function () {
        return this.constructor.type;
      }
    },
    id: {

      /**
       * @member AbstractActor#id
       * @type {String}
       */

      get: function () {
        throw new Error("no implements");
      }
    },
    $$loadEvents: {

      /**
       * Only system calls.
       *
       * load domain'events.
       *
       * @method $$loadEvents
       * @memberof AbstractActor.prototype
       * @param events {Array}
       */

      value: function $$loadEvents(events) {
        var _this = this;

        events.forEach(function (event) {
          _this._when(event);
        });
        this.loadEvents = null;
      }
    },
    _when: {

      /**
       * Only system calls, and must sync.
       * actor's data can only be changed by it.
       * it is a abstract method , need rewrite.
       * @method _when
       * @memberof AbstractActor.prototype
       * @see AbstractActor#$$loadEvents
       * @param event {DomainEvent}
       * @virtual
       * @protected
       */

      value: function _when(event) {}
    },
    _apply: {

      /**
       *
       * @method _apply
       * @memberof AbstractActor.prototype
       * @param name {String} event name
       * @param data {json} event'data
       * @param contextId {String} context's id
       *
       * @fires AbstractActor#apply
       *
       * @protected
       */

      value: function _apply(name, data, contextId) {

        var event = new DomainEvent(name, this, data, contextId);
        this._when(event);
        this.$$uncommittedEvents = this.$$uncommittedEvents || [];
        this.$$uncommittedEvents.push(event);
        /**
         * apply event.
         *
         * @event AbstractActor#apply
         */
        this.emit("apply", this);
      }
    },
    _listen: {

      /**
       * listen a domain'event.
       *
       * @method _listen
       * @memeberof AbstractActor.prototype
       * @param eventName {String}
       * @param handle {String} it's handle method name.
       * @param contextId {String}
       * @fires AbstractActor#listen
       * @protected
       */

      value: function _listen(eventName, handle, contextId) {

        /**
         * @event AbstractActor#listen
         */
        this.emit("listen", { eventName: eventName, handle: handle, contextId: contextId });
      }
    },
    remove: {

      /**
       * @method remove
       * @memberof AbstractActor.prototype
       * @fires AbstractActor#remove
       */

      value: function remove() {

        /**
         * remove event
         * @event AbstractActor#remove
         */
        this.apply("remove");
      }
    }
  }, {
    type: {

      /**
       * @member type
       * @memberof AbstractActor
       * @type {String}
       * @static
       * @abstract
       */

      get: function () {
        throw new Error("please implements it");
      }
    },
    parse: {

      /**
       * parse json data to actor object.
       * @function parse
       * @memberof AbstractActor
       * @static
       */

      value: function parse(json) {}
    },
    toJSON: {

      /**
       * parse actor object to json data.
       * @function toJSON
       * @memberof AbstractActor
       * @static
       */

      value: function toJSON(actor) {}
    }
  });

  return AbstractActor;
})(EventEmitter);

module.exports = AbstractActor;