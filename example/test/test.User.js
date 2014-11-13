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

    it("#call recharge", function (done) {
        domain.call({
            typeName:"User",
            actorId:uid,
            methodName:"recharge",
            data:{id:"t01",money:20}
        }, function (err) {
            should.not.exist(err);
            domain.get("User",uid, function (err,u) {
                u.orderforms.t01.should.eql(20);
                done();
            })
        })
    })

    it("#call rechargeFinish", function (done) {
        domain.call({
            typeName:"User",
            actorId:uid,
            methodName:"rechargeFinish",
            data:{id:"t01"}
        }, function (err) {
            should.not.exist(err);
            domain.get("User",uid, function (err,u) {
                u.money.should.eql(120);
                done();
            })
        })
    })

    it("#call deduct", function (done) {
        domain.call({
            typeName:"User",
            actorId:uid,
            methodName:"deduct",
            data:{id:"t02",money:20}
        }, function (err) {
            should.not.exist(err);
            domain.get("User",uid, function (err,u) {
                u.orderforms.t02.should.eql(20);
                u.money.should.eql(100);
                done();
            })
        })
    })

    it("#call deductFinish", function (done) {
        domain.call({
            typeName:"User",
            actorId:uid,
            methodName:"deductFinish",
            data:{id:"t02"}
        }, function (err) {
            should.not.exist(err);
            domain.get("User",uid, function (err,u) {
                u.money.should.eql(100);
                should.not.exist(u.orderforms.t02);
                done();
            })
        })
    })




});
