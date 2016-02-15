'use strict';

const History = require('../lib/History');
const DomainEvent = require('../lib/DomainEvent');
const User = require('./util/User');
const should = require('should');


describe('History', function () {

    let history;

    it('#new', function () {
        let u = new User('leo');
        let snap = {
            id: 's001',
            index: 0,
            date: Date.now(),
            data: u.json,
            actorId: u.id,
            actorType: u.type
        };

        var event0 = new DomainEvent({
            actor: u,
            data: {name: 'liangzeng'},
            name: 'changeName',
            method: 'changeName'
        });

        var event1 = new DomainEvent({
            actor: u,
            data: {name: 'brighthas'},
            name: 'changeName',
            method: 'changeName'
        });


        history = new History(User, [event0, event1], snap);

        history.snap.name.should.eql('brighthas');

    });

    it('#next', function () {
        history.next().snap.name.should.eql('brighthas');
    });

    it('#prev', function () {
        history.prev().snap.name.should.eql('liangzeng');
        history.prev().snap.name.should.eql('leo');
        history.prev().snap.name.should.eql('leo');

    });


});