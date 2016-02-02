'use strict';
const EventBus = require('../lib/EventBus');
const ES = require('../lib/EventStore');
const fs = require('fs');
const User = require('./util/User');
const uncommittedEvents = Symbol.for('uncommittedEvents');

describe('EventBus', function () {

    let bus;
    let es;

    it('#clear', function () {
        try {
            fs.unlinkSync(require('path').join(__dirname, '..', 'testdb', 'events'));
            fs.unlinkSync(require('path').join(__dirname, '..', 'testdb', 'snaps'));
        } catch (e) {
        }
    });

    it("#new", function () {
        es = new ES(function (event) {
        });

        bus = new EventBus(es);
    });


    it("#publish", function (done) {

        var user = new User();

        es.createSnap({
            id: 's001',
            latestEventIndex: 0,
            index: 0,
            date: Date.now(),
            data: {name:'leoleo'},
            actorId: user.id,
            actorType: 'user'
        }, function (err) {


            bus.once('publish',function (events) {
                console.log(events);
                done()
            });
            
            user[uncommittedEvents] = [
                {
                    name: "myevent",
                    id: 'e001',
                    parents: [],
                    index: 0,
                    date: Date.now(),
                    data: {},
                    actorId: user.id,
                    actorType: 'user',
                    contextId: null,
                    sagaId: null
                },
                {
                    id: 'e002',
                    index: 1,
                    name: "myevent",
                    parents: [],
                    date: Date.now(),
                    data: {},
                    actorId: 'a001',
                    actorType: user.id,
                    contextId: null,
                    sagaId: null
                }
            ];

            bus.publish(user);

        });


    });

});