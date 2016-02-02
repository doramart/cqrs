'use strict';

const DomainEvent = require('./DomainEvent');
const uncommittedEvents = Symbol.for('uncommittedEvents');
const loadEvents = Symbol.for('loadEvents');

/**
 * @augments AbstractActor
 * @param data {{}}
 */
class Actor {

    constructor(data) {
        this[uncommittedEvents] = [];
    }

    /**
     * @public
     */
    get json() {
        let data = this.constructor.toJSON(this);
        Object.freeze(data);
        return data;
    }

    /**
     * @public
     */
    get type() {
        return this.constructor.getType();
    }

/**
 * @protected
 * @param name
 * @param data
 * @param contextId
 */
    apply(name, data, contextId) {
        if (this.isAlive()) {
            var event = new DomainEvent(name, this, data, contextId);
            this.when(event);
            this[uncommittedEvents] = this[uncommittedEvents] || [];
            this[uncommittedEvents].push(event.json);
            /**
             * apply event.
             *
             * @event AbstractActor#apply
             */
            this.emit('apply', this);
        }
    }

    [loadEvents](events) {
    events.forEach(event => {
        this.when(event);
    });
}

    /**
     * @protected
     * @param event
     * @param handle
     */
    //subscribe(event, handle, timeout) {
    //    if (this.isAlive()) {
    //        this.apply('subscribe', {event, handle, timeout});
    //    }
    //}

    /**
     * @protected
     * @param event
     */
    //unSubscribe(event) {
    //    this.apply('unSubscribe', {event});
    //}

    /**
     * implements it, but don't call it yourself.
     *
     * @protected
     * @abstract
     */
    when() {

    }

    /**
     * @public
     * @abstract
     */
    isAlive() {

    }

    /**
     * @public
     * @abstract
     */
    get id() {

    }

    /**
     * @public
     * @abstract
     */
    static toJSON(actor) {

    }

    /**
     *
     * @param json
     */
    static parse(json) {

    }

    /**
     * @public
     */
    static getType() {
        return this.name;
    }

}

module.exports = Actor;