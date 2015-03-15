var should = require("should");
var AbstractActor = require("../lib/AbstractActor");

describe("AbstractActor", function () {

    var actor;

    it("#new", function () {

        Object.defineProperty(AbstractActor.prototype, "id", {
            get: function () {
                return "id001";
            }
        });


        Object.defineProperty(AbstractActor, "type", {
            get: function () {
                return "xxxxx";
            }
        });


        actor = new AbstractActor();
        actor.$$uncommittedEvents.should.eql([]);
        should.exist(AbstractActor.parse);
        should.exist(AbstractActor.toJSON);
        should.exist(actor._when);
    })

    it("#loadEvents", function (done) {
        actor._when = function (event) {
            event.name.should.eql("testevent");
            done()
        };
        actor.$$loadEvents([
            {name: "testevent"}
        ])
    })

    it("#apply", function (done) {
        actor._when = function () {
        };
        actor._apply("test1");
        actor._apply("test2");
        actor.$$uncommittedEvents.length.should.eql(2);
        actor.once("apply", function () {
            done();
        });
        actor._apply("test3");

    });

    it("#listen", function (done) {

        actor.once("listen", function (event) {
            should.exist(event.eventName);
            should.exist(event.handle);
            should.not.exist(event.contextId);
            done();
        });

        actor._listen("test", "change");
    });

});