'use strict';

const uncommittedEvents = Symbol.for('uncommittedEvents');
const loadEvents = Symbol.for('loadEvents');

class Actor {

    constructor(data) {
        this[uncommittedEvents] = [];
    }

    get json() {
        let data = this.constructor.toJSON(this);
        Object.freeze(data);
        return data;
    }

    get type() {
        return this.constructor.getType();
    }

    [loadEvents](events) {
        events.forEach(event => {
            this.when(event);
        });
    }

    /**
     * implements it, but don't call it yourself.
     *
     * @protected
     * @abstract
     */
    when() {

    }

    isAlive() {
    }

    get id() {
        return this.json.id;
    }

    static toJSON(actor) {

    }

    static parse(json) {

    }

    static getType() {
        return this.name;
    }

}

module.exports = Actor;