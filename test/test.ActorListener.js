var ActorListener = require("../lib/ActorListener"),
    Domain = require("../lib/Domain"),
    domain = new Domain(),
    Actor = require("../lib/Actor"),
    should = require("should"),
    User = Actor.extend({
        type: "User",
        handle: function (event) {
            this.apply("handle event");
        },
        when: function (event) {
            if (event.name === "handle event") {
                this._data.name = "leo";

            }
        }
    });

domain.register(User).register(ActorListener);

describe("ActorListener", function () {

    var actorListener, user = new User;

    it("#new", function () {

        actorListener = new ActorListener();

        var actorRepos = {
            User: {
                get: function* () {
                    return user;
                }
            }
        };

        actorListener.actorRepos = actorRepos;

    });

    it("#listen", function (done) {

        actorListener.once("apply", function (event) {
            done();
        });

        actorListener.listen("test", user, "handle");

    });

    it("#pub", function (done) {

        should.not.exist(user._data.name);

        user.on("apply", function (u) {
            user._data.name.should.eql("leo");
        });

        actorListener.listenOne("test", user, "handle");

        actorListener.pub({eventName: "test", event: {name: "leo"}});

        setTimeout(function () {
            var listeners = actorListener._data.repos.test;
            done()
        }, 200);

    });

})