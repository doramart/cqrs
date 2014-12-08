System.register("../../test/test.AbstractActor", [], function() {
  "use strict";
  var __moduleName = "../../test/test.AbstractActor";
  var should = require("should");
  var AbstractActor = require("../lib/AbstractActor");
  describe("AbstractActor", function() {
    var actor;
    it("#new", function() {
      Object.defineProperty(AbstractActor.prototype, "id", {get: function() {
          return "id001";
        }});
      Object.defineProperty(AbstractActor, "type", {get: function() {
          return "xxxxx";
        }});
      actor = new AbstractActor();
      actor.uncommittedEvents.should.eql([]);
      should.exist(AbstractActor.parse);
      should.exist(AbstractActor.toJSON);
      should.exist(actor.when);
    });
    it("#loadEvents", function(done) {
      actor.when = function(event) {
        event.name.should.eql("testevent");
        done();
      };
      actor.loadEvents([{name: "testevent"}]);
    });
    it("#apply", function(done) {
      actor.when = function() {};
      actor.apply("test1");
      actor.apply("test2");
      actor.uncommittedEvents.length.should.eql(2);
      actor.once("apply", function() {
        done();
      });
      actor.apply("test3");
    });
    it("#listen", function(done) {
      actor.once("listen", function(event) {
        should.exist(event.eventName);
        should.exist(event.handle);
        should.not.exist(event.contextId);
        done();
      });
      actor.listen("test", "change");
      console.log("hahah");
    });
  });
  return {};
});
System.get("../../test/test.AbstractActor" + '');
