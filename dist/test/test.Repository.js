System.register("test/test.Repository", [], function() {
  "use strict";
  var __moduleName = "test/test.Repository";
  require("traceur");
  var Repository = require("../lib/Repository");
  var Actor = require("../lib/Actor");
  var ES = require("eventstore");
  var co = require("co");
  var should = require("should");
  var thunkify = require("thunkify");
  describe("Repository", function() {
    var User = Actor.extend({typeName: "People"}),
        es = new ES,
        repos;
    var uid;
    it("#new", function() {
      repos = new Repository(User, es);
    });
    it("#create", function(done) {
      co($traceurRuntime.initGeneratorFunction(function $__0() {
        var user,
            getFromSnapShot,
            rs,
            snap;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $ctx.state = 2;
                return repos.create({name: "leo"});
              case 2:
                user = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                uid = user.id;
                user.get("name").should.eql("leo");
                getFromSnapShot = thunkify(es.getFromSnapshot).bind(es);
                $ctx.state = 10;
                break;
              case 10:
                $ctx.state = 6;
                return getFromSnapShot(user.id);
              case 6:
                rs = $ctx.sent;
                $ctx.state = 8;
                break;
              case 8:
                snap = rs[0];
                should.exist(snap);
                done();
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__0, this);
      }))();
    });
    it("#get", function(done) {
      co($traceurRuntime.initGeneratorFunction(function $__0() {
        var user;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                repos.clear(uid);
                $ctx.state = 6;
                break;
              case 6:
                $ctx.state = 2;
                return repos.get(uid);
              case 2:
                user = $ctx.sent;
                $ctx.state = 4;
                break;
              case 4:
                user.get("name").should.eql("leo");
                done();
                $ctx.state = -2;
                break;
              default:
                return $ctx.end();
            }
        }, $__0, this);
      }))();
    });
  });
  return {};
});
System.get("test/test.Repository" + '');
