var ActorListener = require("../lib/ActorListener"),
    Actor = require("../lib/Actor"),
    should = require("should"),
    User = Actor.extend("User", {
        handle: function (event, di) {
            di.apply("handle event");
        },
        when: function (event,data) {
            if(event.name === "handle event"){
                data.name = "leo";

            }
        }
    });

describe("ActorListener", function () {

    var actorListener,user =  new User;

    it("#new", function () {
        actorListener = new ActorListener(null,true);

        var actorRepos = {
            User: {
                get: function* () {
                    return user;
                }
            }
        };

        actorListener.actorRepos = actorRepos;

    })

    it("#listen", function () {

        actorListener.on("apply", function (al) {
            var listeners  = al.json.repos.test;
        })

        actorListener.call("listen",{
            eventName:"test",
            actor:user,
            handleMethodName:"handle"
        })
    })

    it("#pub", function (done) {

        should.not.exist(user.json.name);

        user.on("apply", function (u) {
            user.json.name.should.eql("leo");
        })

        actorListener.call("listenOne",{
            eventName:"test",
            actor:user,
            handleMethodName:"handle"
        })

        actorListener.call("pub",{eventName:"test",event:{name:"leo"}});

        setTimeout(function () {
            var listeners  = actorListener.json.repos.test;
            done()
        },200);

    });

})