var domain = require("../domain");
var should = require("should");


var toId, fromId, transferId;

describe("Transfer", function () {

    it("#init", function (done) {

        domain.create("User", {}, function (err, id) {
            toId = id;
            domain.create("User", {}, function (err, id) {
                fromId = id;
                done();
            });
        });
    });

    it("#new", function (done) {
        domain.create("Transfer", {}, function (err, id) {
            should.exist(id);
            transferId = id;
            done()
        });
    })

    it("#transfer", function (done) {

        domain.addListener('Transfer', function (event) {
              if(event.name === "transferSuccess"){
                  done();
              }

        })

        domain.call(
            {
                typeName: "Transfer",
                actorId: transferId,
                methodName: "transfer",
                data: {toId: toId, fromId: fromId, money: 50}
            }, function (err) {
            });
    })



});
