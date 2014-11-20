System.register("../../test/test.Command", [], function() {
  "use strict";
  var __moduleName = "../../test/test.Command";
  var Command = require("../lib/Command");
  var should = require("should");
  describe("Command", function() {
    var cmd;
    it("#new", function() {
      cmd = new Command("name", "age", "type");
    });
    it("#call", function() {
      cmd.name("leo").age(22).type("User");
      cmd.opts.name.should.eql("leo");
      cmd.opts.age.should.eql(22);
      cmd.opts.type.should.eql("User");
    });
    it("#exec", function(done) {
      cmd.once("exec", function(opts) {
        should.exist(opts);
        done();
      });
      cmd.exec();
    });
  });
  return {};
});
System.get("../../test/test.Command" + '');
