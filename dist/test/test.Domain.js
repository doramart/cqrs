System.register("../../test/test.Domain", [], function() {
  "use strict";
  var __moduleName = "../../test/test.Domain";
  var Domain = require("../lib/Domain");
  var should = require("should");
  describe("Domain", function() {
    var domain;
    it("#new", function() {
      domain = new Domain();
    });
    it("#register", function() {
      domain.register({
        typeName: "User",
        methods: {changeName: function(name, apply) {
            apply("changeName", name);
          }},
        when: function(event, set) {
          if (event.name === "changeName") {
            set("name", event.data);
          }
        }
      });
      should.exist(domain.repos[$traceurRuntime.toProperty("User")]);
      should.exist(domain.ActorClasses[$traceurRuntime.toProperty("User")]);
    });
    var uid;
    it("#create", function(done) {
      domain.addListener("User:create", function(event) {
        console.log(event);
      });
      domain.create("User", {name: "brighthas"}, function(err, id) {
        uid = id;
        should.exist(id);
        done();
      });
    });
    it("#call", function(done) {});
  });
  return {};
});
System.get("../../test/test.Domain" + '');
