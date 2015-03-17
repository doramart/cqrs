"use strict";

var extend = require("../lib/extend");
var should = require("should");

describe("extend", function () {
    it("extend", function () {

        var Book = extend({
            type: "Book",
            init: function init(data) {
                this._data.name = data.name;
                this._data.num = 0;
            },

            access: true,

            changeName: function changeName(name) {
                this._apply("changeName", name);
            },
            _when: function _when(event) {
                switch (event.name) {
                    case "changeName":
                        this._data.name = event.data;
                        break;
                    case "access":
                        this._data.num += 1;
                        break;
                }
            }
        });

        Book.type.should.eql("Book");

        var book = new Book({ name: "node.js", price: 150 });
        book.data.should.eql(book._data);
        book.data.num.should.eql(0);

        book.changeName("express");
        book.data.name.should.eql("express");

        book.access();
        book.data.num.should.eql(1);

        book.data.should.eql(book._data);
    });
});