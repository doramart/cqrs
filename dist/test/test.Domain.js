"use strict";

var Domain = require("../lib/Domain");
var should = require("should");

describe("Domain", function () {

    var domain;

    it("#new", function () {
        domain = new Domain();
    });

    it("#register", function () {

        domain.register({
            type: "User",
            changeName: function changeName(name) {
                this.apply("changeName", name);
            },
            when: function when(event) {
                if (event.name === "changeName") {
                    this._data.name = event.data;
                }
            }
        });

        should.exist(domain.repos.User);
        should.exist(domain.ActorClasses.User);
    });

    var uid;

    it("#create", function (done) {

        domain.create("User", { name: "brighthas" }, function (err, id) {
            uid = id;
            should.exist(id);
            done();
        });
    });

    it("#getHisitory", function (done) {
        domain.getHistory(uid, 0, 1000, function (err, evets) {
            done();
        });
    });
});