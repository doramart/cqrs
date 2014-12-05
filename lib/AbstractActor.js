var EventEmitter = require("events").EventEmitter;
var uid = require("shortid");
var DomainEvent = require("./DomainEvent");

/**
 * @class AbstractActor
 * @example
 * class User extends AbstractActor{
 *
 *     constructor(name,age){
 *         this.name = name;
 *         this.age = age;
 *     }
 *
 *     // domain method
 *     // here don't change data, please use when method.
 *     change(name,age){
 *          // don't write `this.name = name`
 *          this.apply("change",{name,age});
 *     }
 *
 *     // change user's data.
 *     when(event){
 *          switch(event.name){
 *              case "change":
 *                this.name = event.data.name;
 *                this.age = event.data.age;
 *              break;
 *          }
 *     }
 *
 * }
 */
class AbstractActor extends EventEmitter {


    constructor() {

        /**
         * uncommitted events.
         *
         * @member AbstractActor#uncommittedEvents {DomainEvent[]}
         */
        this.uncommittedEvents = [];

    }

    /**
     * actor's type
     * @member type {string}
     * @memberof AbstractActor.prototype
     * @readonly
     */
    get type() {
        return this.constructor.type;
    }

    /**
     * actor's id , is a abstract , need implements it.
     * @member id {string}
     * @memberof AbstractActor.prototype
     * @readonly
     * @abstract
     */
    get id() {
        throw new Error("no implements");
    }

    /**
     * load events , only call once.
     * @method loadEvents
     * @param events
     * @memberof AbstractActor.prototype
     */
    loadEvents(events) {
        events.forEach(event => {
            this.when(event);
        });
        delete this.loadEvents;
    }

    /**
     * parse json to actor instance,
     * can rewrite it.
     * @method parse
     * @param json
     * @memberof AbstractActor
     * @returns {AbstractActor}
     * @static
     * @abstract
     * @example
     * User.parse = function(json){
     *   var user = new User(json.name,json.age);
     *   return user;
     * }
     */
    static parse(json) {

    }

    /**
     * parse data to json
     * @method toJSON
     * @memberof AbstractActor
     * @param actor - AbstractActor instance.
     * @returns {Object}
     * @abstract
     * @static
     */
    static toJSON(actor) {

    }

    /**
     * if change actor's data , only use it.
     *
     * @method when
     * @memberof AbstractActor.prototype
     * @param event
     * @abstract
     * @example
     * when(event){
     *   switch(event.name){
     *      case "changeName":
     *          this.data.name = event.data.name;
     *      break;
     *      ......
     *   }
     * }
     */
    when(event) {

    }

    /**
     * @method apply
     * @protected
     * @param eventName {string}
     * @param data {object}
     * @param [contextId] {boolean | string}
     * @memberof AbstractActor.prototype
     * @fires AbstractActor#apply
     * @see DomainEvent
     */
    apply(...opts) {
        opts.splice(1,0,this);
        var event = new DomainEvent(...opts);
        this.when(event);
        this.uncommittedEvents = this.uncommittedEvents || [];
        this.uncommittedEvents.push(event);
        this.emit("apply");
    }

    /**
     *
     * mean is the actor listen a domain's event, and use `handle` to handle.
     *
     * @method listen
     * @protected
     * @param eventName {string} - listent event's name
     * @param handle {string} - handle method name
     * @param [contextId] {string} - a context string , e.g. Saga
     * @fires AbstractActor#listen
     * @memberof AbstractActor.prototype
     */
    listen(eventName, handle, contextId) {
        this.emit('listen', {eventName, handle, contextId});
    }

    /**
     * actor's type.
     * @member type {string}
     * @memberof AbstractActor
     * @static
     * @abstract
     * @readonly
     */
    static get type() {
        throw new Error("please implements it");
    }

    /**
     * framework provide
     * @member myDomain {Domain}
     * @memberof AbstractActor.prototype
     * @abstract
     */

}


// events description.

/**
 * @event AbstractActor#listen
 * @property {string} eventName
 * @property {string} handle
 * @property {string} contextId
 */


/**
 * @event AbstractActor#apply
 */

module.exports = AbstractActor;