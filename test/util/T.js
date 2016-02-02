'use strict';

const Actor = require('../../lib/Actor');
const id = Symbol('id');
const uuid = require("uuid").v1;
const name = Symbol('name');
const alive = Symbol('alive');

class T extends Actor {

    constructor(data) {
        super();
        this[id] = uuid();
        this.state = 'start';
        this.from = data.from;
        this.to = data.to;
        this[alive] = true;
    }

    static parse(json) {
        const t = new this(json);
        t[id] = json.id;
        t[alive] = json.alive;
        t.state = json.state;
        return t;
    }

    * transfer(data, service) {
        service.apply('begin');
        yield service.sagaCall('User.' + this.from + '.deduct', 120);
        yield service.sagaCall('User.' + this.to + '.recharge', 120);
        service.apply('end');
    }

    when(event) {

        switch (event.name) {
            case 'begin':
                this.state = 'begin';
                break;
            case 'end':
                this.state = 'end';
                break;
        }

    }

    isAlive() {
        return this[alive];
    }

    get id() {
        return this[id];
    }

    static toJSON(actor) {
        return {
            state: actor.state,
            id: actor[id],
            from: actor.from,
            to: actor.to,
            alive: actor[alive]
        }
    }

    static getType() {
        return 'T';
    }


}

module.exports = T;