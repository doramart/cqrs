const MemSubscribeDB = require('../lib/MemSubscribeDB');
const should = require('should');

describe('MemSubscribeDB', function () {

    'use strict';
    let mdb;

    it('#new', function () {
        mdb = new MemSubscribeDB;
    });

    it('#save', function (done) {
        mdb.save({event: 'event001', subscriberId: 'id001'}, function (err) {
            should.not.exist(err);
            done();
        });
    });

    it('#findByEvent', function (done) {
        mdb.findByEvent('event001', function (err,info) {
            info.subscriberId.should.eql('id001');
            done();
        });
    });
    
    it('#removeBy', function (done) {
        mdb.removeBy('id001','event001', function () {
            mdb.findByEvent('event001', function (err,info) {
                should.not.exist(info);
                done();
            });
        });
    });

});