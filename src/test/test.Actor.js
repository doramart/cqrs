require('babel/polyfill');

var should = require("should");
var Actor = require("../lib/Actor");

describe("Actor", function () {

    var actor;

    it("#new", function () {
        actor = new Actor({name: "leo", age: 26});
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

        actor.$$loadEvents([
            {name: "changeName", data: "brighthas"}
        ]);

        actor.data.name.should.eql("brighthas");
        actor._data.should.eql(actor.data);

    });

    it("#type", function () {
        class User extends Actor {
        }
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