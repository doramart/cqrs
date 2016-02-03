'use strict';

const Actor = require('../lib/Actor');

class User extends Actor {

    constructor(data) {
        super({
            name: data.name,
            money: 0
        });
    }

    changeName(name) {
        this.apply('changeName', {name});
    }

    recharge(money, service) {
        service.apply('recharge', {money});
    }

    deduct(money, service) {
        service.apply('deduct', {money});
    }

    when(event) {

        switch (event.name) {
            case 'changeName':
                this._data.name = event.data.name;
                break;
            case 'recharge':
                this._data.money += event.data.money;
                break;
            case 'deduct':
                this._data.money -= event.data.money;
                break;
        }

    }

}

module.exports = User;