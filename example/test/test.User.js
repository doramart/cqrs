var domain = require("../domain");
var should = require("should");


var uid;

describe("domain", function () {

    it("#create", function (done) {
        domain.addListener("User:create", function (event) {
            event.data.data.money.should.eql(100);
            event.data.data.orderforms.should.eql({});
            done();
        });
        domain.create("User",{}, function (err,id) {
            uid = id;
            should.exist(id);
            should.not.exist(err);
        });
    });

    it("#call", function (done) {
        domain.call({
            typeName:"User",
            actorId:uid,
            methodName:"recharge",
            data:{money:20}
        }, function (err) {
            should.not.exist(err);
            done();
        })
    })
});
