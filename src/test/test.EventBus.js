require('babel/polyfill');

var Repository = require("../lib/Repository");
var Actor = require("../lib/Actor");
var ES = require("eventstore");
var es = new ES();
var EventBus = require("../lib/EventBus");
var ActorListener = require("../lib/ActorListener");
var co = require("co");
var should = require("should");

class User extends Actor {
    static get type() {
        return "User"
    }

    changeName(name) {
        this._apply("changeName", name);
    }

    finish(name) {
        this._apply("finish");
    }

    _when(event, set) {
        if (event.name === "finish") {
            this._data.finish = "ok";
        }
    }
}

describe("EventBus", function () {

    let bus, actor, repos = {};

    it("#new", function () {
        bus = new EventBus(es, repos, new ActorListener);
    });

    it("#init", function (done) {

        var uid;

        repos[User.type] = new Repository(User, es);

        co(function *() {
            actor = yield repos[User.type].create({name: "leo"});
            done();
        });
    });

    it("#publsh", function (done) {

        actor.changeName("bright");
        actor.$$uncommittedEvents.length.should.eql(1);
        bus.publish(actor);

        setTimeout(function () {
            actor.$$uncommittedEvents.should.eql([]);
            done()
        }, 10)

    })

})