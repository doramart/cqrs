'use strict';

const Domain = require('../lib/Domain');
const User = require('./util/User');
const T = require('./util/T');
const should = require('should');


describe('Domain', function () {

    let domain;


    it('#new', function () {
        domain = new Domain();
        domain.register(User);
        domain.register(T);
    });

    let from;
    let to;

    let tid;

    it('#create from', function (done) {
        domain.create('User', 'leo', function (err, actor) {
            from = actor.id;
            done();
        });
    });

    it('#create to', function (done) {
        domain.create('User', 'leo', function (err, actor) {
            to = actor.id;
            done();
        });
    });

    it('# create transfer', function (done) {

        domain.create('T', {from, to}, function (err, t) {
            tid = t.id;
            done();
        });
    });


    it('# transfer', function (done) {
        domain.call('T.' + tid + '.transfer', null, function (err) {
        });

        domain.once(Domain.Alias().name('end').actorId(tid).get(), function (event) {
            domain._get('T', tid, function (err, t) {
                t.json.state.should.eql('end');
                done();
            })
        });

    })


});