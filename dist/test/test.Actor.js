"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

require("babel/polyfill");

var should = require("should");
var Actor = require("../lib/Actor");

describe("Actor", function () {

    var actor;

    it("#new", function () {
        actor = new Actor({ name: "leo", age: 26 });
        actor._data.name.should.eql("leo");
        actor._data.age.should.eql(26);
        actor._data.should.eql(actor.data);
        actor.id.should.eql(actor.data.id);
        actor.type.should.eql(Actor.type);
    });

    it("#loadEvents", function () {

        actor._when = function (event) {
            if (event.name === "changeName") {
                this._data.name = event.data;
            }
        };

        actor.$$loadEvents([{ name: "changeName", data: "brighthas" }]);

        actor.data.name.should.eql("brighthas");
        actor._data.should.eql(actor.data);
    });

    it("#type", function () {
        var User = (function (_Actor) {
            function User() {
                _classCallCheck(this, User);

                if (_Actor != null) {
                    _Actor.apply(this, arguments);
                }
            }

            _inherits(User, _Actor);

            return User;
        })(Actor);

        User.type.should.eql("User");
    });

    it("#toJSON", function () {
        var json = Actor.toJSON(actor);
        json.should.eql(actor.data);
    });

    it("#parse", function () {
        var json = Actor.toJSON(actor);
        var act = Actor.parse(json);
        act.data.should.eql(act._data);
        act.data.should.eql(json);
    });
});