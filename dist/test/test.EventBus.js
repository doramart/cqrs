"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var User = (function (_Actor) {
    function User() {
        _classCallCheck(this, User);

        if (_Actor != null) {
            _Actor.apply(this, arguments);
        }
    }

    _inherits(User, _Actor);

    _createClass(User, {
        changeName: {
            value: function changeName(name) {
                this._apply("changeName", name);
            }
        },
        finish: {
            value: function finish(name) {
                this._apply("finish");
            }
        },
        _when: {
            value: function _when(event, set) {
                if (event.name === "finish") {
                    this._data.finish = "ok";
                }
            }
        }
    }, {
        type: {
            get: function () {
                return "User";
            }
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