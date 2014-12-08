require("traceur");

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

        actor.when = function (event) {
            if (event.name === "changeName") {
                this._data.name = event.data;
            }
        }

        actor.loadEvents([
            {name: "changeName", data: "brighthas"}
        ])

        actor.data.name.should.eql("brighthas");
        actor._data.should.eql(actor.data);

    });

    it("#type", function () {
        class User extends Actor {
        }
        User.type.should.eql("User");
    })

    it("#toJSON", function () {
        var json = Actor.toJSON(actor);
        json.should.eql(actor.data);
    })


    it("#parse", function () {
        var json = Actor.toJSON(actor);
        var act = Actor.parse(json);
        act.data.should.eql(act._data);
        act.data.should.eql(json);
    })

    it("extend", function () {


        var Book = Actor.extend({
            type: "Book",
            init: function (data) {
                this._data.name = data.name;
                this._data.num = 0;
            },

            access:true,

            changeName: function (name) {
                this.apply("changeName", name);
            },
            when: function (event) {
                switch (event.name) {
                    case "changeName":
                        this._data.name = event.data;
                        break;
                    case "access":
                        this._data.num += 1;
                        break;
                }
            }
        })


        Book.type.should.eql("Book");

        var book = new Book({name: "node.js", price: 150});
        book.data.should.eql(book._data);
        book.data.num.should.eql(0);


        book.changeName("express");
        book.data.name.should.eql("express");

        book.access();
        book.data.num.should.eql(1);

        book.data.should.eql(book._data);

    })
});