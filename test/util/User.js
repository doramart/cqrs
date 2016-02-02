'use strict';

const Actor = require('../../lib/Actor');
const id = Symbol('id');
const uuid = require("uuid").v1;
const name = Symbol('name');
const alive = Symbol('alive');

class User extends Actor {

    constructor(username) {
        super();
        this[id] = uuid();
        this[name] = username;
        this[alive] = true;
        this.money = 0;
    }

    static parse(json) {
        const user = new User(json.name);
        user[id] = json.id;
        user[alive] = json.alive;
        user.moeny = json.money;
        return user;
    }

    changeName(name) {
        this.apply('changeName', {name});
    }

    recharge(money, service) {
        service.apply('recharge', money);
    }

    deduct(money, service) {
        service.apply('deduct', money);
    }

    when(event) {

        switch (event.name) {
            case 'changeName':
                this[name] = event.data.name;
                break;
            case 'remove':
                this[alive] = false;
                break;
            case 'recharge':
                this.money += event.data;
                break;
            case 'deduct':
                this.money -= event.data;
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
            id: actor[id],
            name: actor[name],
            alive: actor[alive]
        }
    }

    static getType() {
        return 'User';
    }


}

module.exports = User;