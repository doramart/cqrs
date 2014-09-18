var Domain = require(".."),should = require("should");

describe("main",function(){

    it("#exist",function(){
        should.exist(Domain);
        should.exist(Domain.Saga);
        should.exist(Domain.AggregateRoot);
    })


})