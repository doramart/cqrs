"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

require("babel/polyfill");

var Repository = require("../lib/Repository");
var Actor = require("../lib/Actor");
var ES = require("eventstore");
var es = new ES();
var EventBus = require("../lib/EventBus");
var ActorListener = require("../lib/ActorListener");
var co = require("co");
var should = require("should");

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
        changeName: {
            value: function changeName(name) {
                this._apply("changeName", name);
            },
            writable: true,
            configurable: true
        },
        finish: {
            value: function finish(name) {
                this._apply("finish");
            },
            writable: true,
            configurable: true
        },
        _when: {
            value: function _when(event, set) {
                if (event.name === "finish") {
                    this._data.finish = "ok";
                }
            },
            writable: true,
            configurable: true
        }
    });

    return User;
})(Actor);

describe("EventBus", function () {

    var bus = undefined,
        actor = undefined,
        repos = {};

    it("#new", function () {
        bus = new EventBus(es, repos, new ActorListener());
    });

    it("#init", function (done) {

        var uid;

        repos[User.type] = new Repository(User, es);

        co(regeneratorRuntime.mark(function callee$2$0() {
            return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.next = 2;
                        return repos[User.type].create({ name: "leo" });

                    case 2:
                        actor = context$3$0.sent;

                        done();

                    case 4:
                    case "end":
                        return context$3$0.stop();
                }
            }, callee$2$0, this);
        }));
    });

    it("#publsh", function (done) {

        actor.changeName("bright");
        actor.$$uncommittedEvents.length.should.eql(1);
        bus.publish(actor);

        setTimeout(function () {
            actor.$$uncommittedEvents.should.eql([]);
            done();
        }, 10);
    });
});