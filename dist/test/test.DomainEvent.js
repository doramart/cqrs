"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var should = require("should");
var DomainEvent = require("../lib/DomainEvent");
var Actor = require("../lib/Actor");

var User = (function (Actor) {
    function User() {
        _classCallCheck(this, User);

        if (Actor != null) {
            Actor.apply(this, arguments);
        }
    }

    _inherits(User, Actor);

    _prototypeProperties(User, {
        type: {
            get: function () {
                return "User";
            },
            configurable: true
        }
    });

    return User;
})(Actor);

describe("DomainEvent", function () {
    var event1;
    var event2;
    var user = new User();

    it("#new", function () {
        event1 = new DomainEvent("test", user);
        event2 = new DomainEvent("test2", user, { name: "leo" }, "testcontext");
    });

    it("#members", function () {

        should.not.exist(event1.contextId);
        event2.contextId.should.eql("testcontext");

        should.not.exist(event1.data);
        event2.data.should.eql({ name: "leo" });

        should.exist(event1.date);
        should.exist(event2.date);

        event1.name.should.eql("test");
        event2.name.should.eql("test2");

        event1.actorId.should.eql(user.id);
        event2.actorType.should.eql(user.type);
    });
});