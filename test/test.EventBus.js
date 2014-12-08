require("traceur");
var Repository = require("../lib/Repository");
var Actor = require("../lib/Actor");
var ES = require("eventstore");
var es = new ES();
var EventBus = require("../lib/EventBus");
var ActorListener = require("../lib/ActorListener");
var co = require("co");
var should = require("should");

//es.init(function (err) {
//});

describe("EventBus", function () {

    let bus, actor, repos = {}

    it("#new", function () {
        bus = new EventBus(es, repos, new ActorListener);
    })

    it("#init", function (done) {
        var User = Actor.extend({
            type:"User",
            changeName(name) {
                this.apply("changeName", name);
            },
            finish(name) {
                this.apply("finish");
            },

            when(event, set) {
                if (event.name === "finish") {
                    this._data.finish = "ok";
                }
            }

        });

        var uid;

        repos[User.type] = new Repository(User, es);

        co(function *() {
            actor = yield repos[User.type].create({name: "leo"});
            done();
        })()
    })

    it("#publsh", function (done) {

        actor.changeName("bright");
        actor.uncommittedEvents.length.should.eql(1);
        bus.publish(actor);

        setTimeout(function () {
            actor.uncommittedEvents.should.eql([]);
            done()
        },10)

    })

})