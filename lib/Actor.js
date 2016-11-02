'use strict';

const uncommittedEvents = Symbol.for('uncommittedEvents');
const loadEvents = Symbol.for('loadEvents');
const AbstractActor = require('./AbstractActor');
const uuid = require('uuid').v1;

class Actor extends AbstractActor {

    constructor(data) {
        super();
        /**
         * @protected
         */
        this._data = data || {};
        this._data.isAlive = true;
        if (!this._data.id) {
            this._data.id = uuid();
        }
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

    when(event) {
        switch (event.name) {
            case 'remove':
                this._data.isAlive = false;
                break;
        }
    }

    isAlive() {
        return this._data.isAlive;
    }

    get id() {
        return this._data.id;
    }

    static toJSON(actor) {

        return JSON.parse(JSON.stringify(actor._data));
    }

    static parse(json) {
        var actor = {};
        actor._data = json;
        actor.__proto__ = this.prototype;
        return actor;
    }

    static getType() {
        return this.name;
    }
}

module.exports = Actor;