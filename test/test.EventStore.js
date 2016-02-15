'use strict';

const should = require("should");
const ES = require('../lib/EventStore');
const fs = require('fs');
const thunkify = require("thunkify");
const co = require('co');

describe("eventstore", function () {

    let es;

    it('#clear', function () {
        try {
            fs.unlinkSync(require('path').join(__dirname, '..', 'testdb', 'events'))
            fs.unlinkSync(require('path').join(__dirname, '..', 'testdb', 'snaps'))
        } catch (e) {
        }
    });

    it("#new", function () {
        es = new ES(function (event) {
        });
    });

    it('#saveEvents', function (done) {
        es.saveEvents([
            {
                name: "myevent1",
                id: 'e001',
                parents: [],
                index: 0,
                date: Date.now(),
                data: {},
                actorId: 'a001',
                actorType: 'user',
                contextId: null,
                sagaId: null
            },
            {
                id: 'e002',
                index: 1,
                name: "myevent2",
                parents: [],
                date: Date.now(),
                data: {},
                actorId: 'a001',
                actorType: 'user',
                contextId: null,
                sagaId: null
            },
            {
                id: 'e003',
                index: 2,
                name: "myevent3",
                parents: [],
                date: Date.now(),
                data: {},
                actorId: 'a001',
                actorType: 'user',
                contextId: null,
                sagaId: null
            }
        ], function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('#createSnap', function (done) {

        es.createSnap({
            id: 's001',
            latestEventIndex: 0,
            index: 0,
            date: Date.now(),
            data: {},
            actorId: 'a001',
            actorType: 'user'
        }, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('#getLatestSnapshot', function (done) {
        es.createSnap({
            id: 's002',
            latestEventIndex: 0,
            index: 1,
            date: Date.now(),
            data: {},
            actorId: 'a001',
            actorType: 'user'
        }, function (err) {

            es.getLatestSnapshot('a001', function (err, snap) {
                snap.id.should.eql('s002');
                done();
            });

        });
    });

    it('#getEventsBySnapshot', function (done) {
        es.getEventsBySnapshot('s002', function (err, result) {
            result.length.should.eql(2);
            result[0].index.should.eql(1);
            result[1].index.should.eql(2);
            done();
        })
    });

    it('#getSnapshotByIndex', function (done) {
        es.getSnapshotByIndex('a001', 1, function (err, result) {
            result.index.should.eql(1);
            done();
        });
    });

    it('#getSnapshotByLastIndex', function (done) {
        es.getSnapshotByLastIndex('a001', 1, function (err, result) {
            result.index.should.eql(0);
            done()
        });
    });

    it('#getSnapshotById', function (done) {
        es.getSnapshotById('s001', function (err, result) {
            result.id.should.eql('s001');
            done();
        });
    });

    it('#getEventById', function (done) {
        es.getEventById('e002', function (err, result) {
            result.id.should.eql('e002');
            done();
        });
    });
    
    it('#getLatestEvent', function (done) {
        let getLatestEvent = thunkify(es.getLatestEvent).bind(es);
        co(function *() {
            let event = yield getLatestEvent('a001');
            event.index.should.eql(2);
            done();
        });

    });
});


