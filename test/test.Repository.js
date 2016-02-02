'use strict';

const Repository = require('../lib/Repository');
const ES = require('../lib/EventStore');
const fs = require('fs');
const Actor = require('../lib/Actor');
const id = Symbol('id');
const uuid = require("uuid").v1;
const name = Symbol('name');
const alive = Symbol('alive');
const should = require("should");


const User = require('./util/User');
describe('Repository', function () {



    let repo;
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

        repo = new Repository(User, es);
    });

    let userId;

    it("#create", function (done) {
        repo.create('leo', function (err, user) {
            userId = user.id;
            user.name.should.eql('leo');

            es.getLatestSnapshot(user.id, function (err, snap) {
                should.exist(snap.id);
                snap.index.should.eql(0);
                snap.data.name.should.eql('leo');
                snap.actorId.should.eql(user.id);
                done();

            });

        });
    });

    it("#get", function (done) {
        repo.clear(userId);
        repo.get(userId, function (err,user) {
            user.json.name.should.eql('leo');
            done();
        });
    });


});