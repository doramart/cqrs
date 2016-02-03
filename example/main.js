'use strict';

const Domain = require('../lib/Domain');
const domain = new Domain();
const User = require('./User');
const Transfer = require('./Transfer');
const debug = require('debug')('example');

domain.register(Transfer).register(User);


let fromId, toId, transferId;

domain.create('User', {name: 'leo'})
    .then(function (fromUser) {
        fromId = fromUser.id;
        debug('From user id = %s', fromId);
        return domain.create('User', {name: 'liang'});
    })
    .then(function (toUser) {
        toId = toUser.id;
        debug('To user id = %s', toId);
        return domain.create('Transfer', {from: fromId, to: toId});
    })
    .then(function (transfer) {
        transferId = transfer.id;
        debug('Transfer id = %s', transferId);
        console.log(Domain.Alias().actorType('Transfer').name('end').get());
        domain.on(Domain.Alias().actorType('Transfer').name('end').get(), function (event) {
            console.log('transfer finish!');
        });
        domain.call(`Transfer.${transferId}.transfer`,null);
    })
    .catch(err=>console.err(err));
