var domain = require("../domain");
var should = require("should");



describe("domain", function () {

    it("#create", function (done) {
        domain.addListener("User:create", function (event) {
            event.data.data.money.should.eql(100);
            event.data.data.orderforms.should.eql({});
            done();
        });
        domain.create("User",{}, function (err,id) {
            should.exist(id);
            should.not.exist(err);
        });
    });
});
