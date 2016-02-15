Version
=======

    1.0.0-pre

    node.js version > 4.0

DDD-CQRS-Actor framework for javascript.
========================================

Actor is a aggregate root object.


Install
=======

    npm install cqrs --save

Test
====
    npm test


simple sample
=============

    ///////// user actor class ////////
    'use strict';

    const Actor = require('cqrs').Actor;

    class User extends Actor {

        constructor(data) {
            super(data);
        }

        // business method
        changeName(name,service) {
            if(name.length < 10 && name.length > 2){
               service.apply('changeName', {name});
            }else{
               throw new Error('name char size must < 10 and > 2');
            }
        }

        when(event) {

            switch (event.name) {
                case 'changeName':
                    this.data._name = event.data.name;
                    break;
            }

        }

    }

    //////////// use it //////////
    const Domain = require('cqrs');
    const domain = new Domain();
    const userId = 'id001';

    // register actor class
    domain.register(User);

    // listen domain event.
    domain.once(Domain.Alias().name('changeName').actorId(userId).get(),
    function(event){
        // something
    });

    domain.call(`User.${userId}.changeName`,'liangzeng');


Saga sample
===========

    //////////// Transfer actor class /////////////
    'use strict';

    const Actor = require('cqrs').Actor;

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


    ////////////// User Actor Class ////////////
    'use strict';

    const Actor = require('cqrs').Actor;

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

    ////////////////// main.js ///////////////

    'use strict';

    const Domain = require('cqrs');
    const domain = new Domain();
    const User = require('./User');
    const Transfer = require('./Transfer');
    let fromId, toId, transferId;

    domain.register(Transfer).register(User);

    // listen domain event
    domain.on(Domain.Alias().actorType('Transfer').name('end').get(),
    function (event) {
        console.log('****** transfer finish! ******');
    });

    domain.create('User', {name: 'leo'})
    .then(function (fromUser) {
        fromId = fromUser.id;
        return domain.create('User', {name: 'liang'});
    })
    .then(function (toUser) {
        toId = toUser.id;
        return domain.create('Transfer', {from: fromId, to: toId});
    })
    .then(function (transfer) {
        transferId = transfer.id;
        domain.call(`Transfer.${transferId}.transfer`,null);
    })
    .catch(err=>console.err(err));


LICENSE
=======
MIT