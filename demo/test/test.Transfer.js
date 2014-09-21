var should = require("should"),Transfer = require("../Transfer");

describe("Transfer",function(){

    var transfer;

    it("#new",function(){
        transfer = new Transfer();
    })

    it("#start event",function(){
        transfer.get("start").should.eql(false);
        transfer.when({name:"start"});
        transfer.get("start").should.eql(true);
    })

    it("#listener deduct event",function(){
        transfer.isCompleted().should.eql(false);
        transfer.get("deducted").should.eql(false);
        transfer.emit("deduct");
        transfer.get("deducted").should.eql(true);
        transfer.isCompleted().should.eql(false);

    })

    it("#listener recharge event",function(){
        transfer.isCompleted().should.eql(false);
        transfer.get("recharged").should.eql(false);
        transfer.emit("recharge");
        transfer.get("recharged").should.eql(true);
        transfer.isCompleted().should.eql(true);
    })


})



