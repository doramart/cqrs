'use strict';

const uid = require('uuid').v1;
const qs = require('querystring');

class DomainEvent {

    constructor(params) {

        this.actorId = params.actor.id;

        this.actorType = params.actor.type;

        this.id = uid();

        this.data = params.data;

        this.name = params.name;

        this.method = params.method;

        this.contextId = params.contextId || '';

        this.sagaId = params.sagaId || '';

        this.date = Date.now();

        this.parent = params.parent;

        this.alias = [
            `${this.actorType}.${this.actorId}.${this.name}.${this.sagaId}.${this.contextId}.${this.method}`,
            `${this.actorType}.${this.actorId}.${this.name}.${this.sagaId}..${this.method}`,
            `${this.actorType}.${this.actorId}.${this.name}..${this.contextId}.${this.method}`,
            `${this.actorType}.${this.actorId}.${this.name}...${this.method}`,
            `${this.actorType}.${this.actorId}.${this.name}.${this.sagaId}.${this.contextId}.${this.method}`,

            `${this.actorType}.${this.actorId}.${this.name}...`,
            `.${this.actorId}.${this.name}...`,

            `${this.actorType}.${this.actorId}....${this.method}`,
            `${this.actorType}.....${this.method}`,
            `..${this.name}...${this.method}`
        ];
        if(this.sagaId){
            this.alias.push(`...${this.sagaId}..${this.method}`)
        }


        Object.freeze(this);

    }

    get json() {
        return DomainEvent.toJSON(this);
    }

    static toJSON(event) {
        return JSON.parse(JSON.stringify(event));
    }

    static parse(json) {
        var event = Object.setPrototypeOf(json, this.prototype);
        Object.freeze(event);
        return event;
    }

}

module.exports = DomainEvent;