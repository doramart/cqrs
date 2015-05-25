require('babel/polyfill');

var Domain = require("../lib/Domain");
var Actor = require("../lib/Actor");
var should = require("should");

class User extends Actor {
    static get type() {
        return "User";
    }

    changeName(name) {
        this._apply("changeName", name);
    }

    _when(event) {
        if (event.name === "changeName") {
            this._data.name = event.data;
        }
    }
}

describe("Domain", function () {

    var domain;

    it("#new", function () {
        domain = new Domain();
    });

    it("#register", function () {
        domain.register(User);
        should.exist(domain.__repos["User"]);
    });

    var uid;

    it("#create", function (done) {

        domain.create("User", {name: "brighthas"}, function (err, id) {
            uid = id;
            should.exist(id);
            done();
        });

    });



    it('#call', function (done) {
        domain.call(`User.${uid}.changeName`,['leoleo']).catch((err)=>{console.log(err.stack)});
        domain.get('User',uid).then((u)=>{
            u.data.name.should.eql('leoleo');
            done();
        })
    });

    it("#getEvents", function (done) {
        domain.getEvents(uid, 0, 1000, function (err, evets) {
            done();
        })

    });

    it("#remove", function (done) {
        domain.on('User:remove', function (event) {
            domain.get('User', uid, function (err, user) {
                done();
            });
        });
        domain.get('User', uid, function (err, user) {
            user.remove();
        });
    });

});