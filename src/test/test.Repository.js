require('babel/polyfill');
var Repository = require("../lib/Repository");
var Actor = require("../lib/Actor");
var ES = require("eventstore");
var co = require("co");
var should = require("should");

describe("Repository", function () {

    class User extends Actor {
    }

    var es = new ES, repos;

    var uid;

    it("#new", function () {
        repos = new Repository(User, es);
    });

    it("#create", function (done) {
        co(function *() {
            var user = yield repos.create({name: "leo"});
            uid = user.id;
            user.data.name.should.eql("leo");
            done();
        });
    });

    it("#get", function (done) {
        setTimeout(()=> {
            co(function* () {
                repos.clear(uid);
                var user = yield repos.get(uid);
                user.data.name.should.eql("leo");
                done();
            });
        })
    });

});