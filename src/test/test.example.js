var Transfer = require("../example/Transfer");
var User = require("../example/User");
var cqrs = require('../..');
var Domain = cqrs.Domain;
var domain = new Domain();
var should = require("should");


describe("Transfers Example", function () {

    var fromId;
    var toId;
    var transferId;
    var money = 20;

    it("#create 2 user", function (done) {
        domain.register(User).register(Transfer);
        domain.create("User", {}, function (err, userId) {
            fromId = userId;
            domain.create("User", {}, function (err, userId) {
                toId = userId;
                done();
            });
        });
    });

    it("#recharge for fromUser", function (done) {
        domain.get("User", fromId).then(function (user) {
            user.recharge(100); // then fromUser have 100.00
            user.data.money.should.eql(100);
            done();

        });
    });

    it("#create a transfer", function (done) {
        // create a transfer saga
        domain.create("Transfer", {}, function (err, tid) {
            transferId = tid;
            done();
        });
    });

    it("#transfer", function (done) {
        domain.on("Transfer." + transferId + ":finish", function () {
            setTimeout(function () {
                done();
            });

        });
        domain.get("Transfer", transferId).then(function (t) {
            t.transfer(fromId, toId, money);
        });
    });


    it("#fromUser's money", function (done) {

        domain.get("User", fromId).then(function (user) {

            user.data.money.should.eql(80);
            done();
        });

    });


    it("#toUser's money", function (done) {

        domain.get("User", fromId).then(function (user) {

            user.data.money.should.eql(80);
            done();

        }).catch(function (err) {
            console.log(err)
        });

    });

});