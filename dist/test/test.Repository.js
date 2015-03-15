"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

require("babel/polyfill");
var Repository = require("../lib/Repository");
var Actor = require("../lib/Actor");
var ES = require("eventstore");
var co = require("co");
var should = require("should");

describe("Repository", function () {
    var User = (function (Actor) {
        function User() {
            _classCallCheck(this, User);

            if (Actor != null) {
                Actor.apply(this, arguments);
            }
        }

        _inherits(User, Actor);

        return User;
    })(Actor);

    var es = new ES(),
        repos;

    var uid;

    it("#new", function () {
        repos = new Repository(User, es);
    });

    it("#create", function (done) {
        co(regeneratorRuntime.mark(function callee$2$0() {
            var user;
            return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.next = 2;
                        return repos.create({ name: "leo" });

                    case 2:
                        user = context$3$0.sent;

                        uid = user.id;
                        user.data.name.should.eql("leo");
                        done();

                    case 6:
                    case "end":
                        return context$3$0.stop();
                }
            }, callee$2$0, this);
        }));
    });

    it("#get", function (done) {
        setTimeout(function () {
            co(regeneratorRuntime.mark(function callee$3$0() {
                var user;
                return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            repos.clear(uid);
                            context$4$0.next = 3;
                            return repos.get(uid);

                        case 3:
                            user = context$4$0.sent;

                            user.data.name.should.eql("leo");
                            done();

                        case 6:
                        case "end":
                            return context$4$0.stop();
                    }
                }, callee$3$0, this);
            }));
        });
    });
});