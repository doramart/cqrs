'use strict';

const Actor = require('../lib/Actor');

class Transfer extends Actor {

    constructor(data) {
        super({
            state: 'start',
            from: data.from,
            to: data.to
        });
    }

    * transfer(data, service) {
        service.apply('begin');
        yield service.sagaCall(`User.${this.json.from}.deduct`, 120);
        yield service.sagaCall(`User.${this.json.to}.recharge`, 120);
        service.apply('end');
    }

    when(event) {

        switch (event.name) {
            case 'begin':
                this._data.state = 'begin';
                break;
            case 'end':
                this._data.state = 'end';
                break;
        }

    }

}

module.exports = Transfer;