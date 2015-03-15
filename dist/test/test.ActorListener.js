"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ActorListener = require("../lib/ActorListener"),
    Actor = require("../lib/Actor"),
    DomainEvent = require("../lib/DomainEvent"),
    should = require("should");

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
    }, {
        handleTest: {
            value: function handleTest(event) {
                console.log("handleTest");
            },
            writable: true,
            configurable: true
        },
        handleTest2: {
            value: function handleTest2(event) {
                console.log("handleTest2");
            },
            writable: true,
            configurable: true
        }
    });

    return User;
})(Actor);

describe("ActorListener", function () {

    var listener;
    var user = new User();
    var event = new DomainEvent("test", user);
    var event2 = new DomainEvent("testOne", user);

    it("#new", function () {
        listener = new ActorListener();
        listener.type.should.eql("ActorListener");
        // only test need.
        listener.myDomain = {
            get: function get(a, b, cb) {
                cb(null, user);
            }
        };
    });

    it("#listen", function () {
        listener.listen("test", user, "handleTest");
    });

    it("#listenOne", function () {
        listener.listenOne("testOne", user, "handleTest2");
    });

    it("#pub", function () {
        listener.pub(event);
        listener.pub(event);
        listener.pub(event2);
        listener.pub(event2);
    });
});