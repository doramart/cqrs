"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

require("babel/polyfill");

var Domain = require("../lib/Domain");
var Actor = require("../lib/Actor");
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
        when: {
            value: function when(event) {
                if (event.name === "changeName") {
                    this._data.name = event.data;
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

describe("Domain", function () {

    var domain;

    it("#new", function () {
        domain = new Domain();
    });

    it("#register", function () {
        domain.register(User);
        should.exist(domain.__repos.User);
    });

    var uid;

    it("#create", function (done) {

        domain.create("User", { name: "brighthas" }, function (err, id) {
            uid = id;
            should.exist(id);
            done();
        });
    });

    it("#getEvents", function (done) {
        domain.getEvents(uid, 0, 1000, function (err, evets) {
            done();
        });
    });
});