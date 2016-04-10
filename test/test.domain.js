'use strict';

const Domain = require('../lib/Domain');
const User = require('./util/User');
const Actor = require('../lib/Actor');
const T = require('./util/T');
const should = require('should');
const co = require('co');

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

    });

    it('#getHistory', function (done) {


        co(function *() {
            try {
                yield domain.call(`User.${from}.changeName`, 'bright');
                let hist = yield domain.getHistory(from);
                hist.snap.name.should.eql('bright');
            } catch (err) {
                console.log(err);
            }

            done();

        });
    });



    it('#createBefor', function (done) {
        class People extends Actor {

            constructor() {
                super();
            }

            change(data, serv) {

            }

            static changeBefor() {
                //throw new Error('erewr');
            }

            static createBefor(data, service) {

                return function *() {
                    let result = yield new Promise((resolve, reject)=> {

                        setTimeout(function () {
                            resolve('haha---- error');
                        }, 1000)
                    });
                    console.log(result);
                }
            }
        }

        let domain = new Domain().register(People);

        domain.create('People', 'leo', function (err, json) {

            domain.call(`People.${json.id}.change`,null, function (err, json) {
                console.log(err);
                done()
            });
        });

    });

});