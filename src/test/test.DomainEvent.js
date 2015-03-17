var should = require('should');
var DomainEvent = require('../lib/DomainEvent');
var Actor = require('../lib/Actor');

class User extends Actor {
    static get type() {
        return "User"
    }
}

describe("DomainEvent", function () {
    var event1;
    var event2;
    var user = new User();

    it("#new", function () {
        event1 = new DomainEvent("test", user);
        event2 = new DomainEvent("test2", user, {name: 'leo'}, 'testcontext');
    });

    it("#members", function () {

        should.not.exist(event1.contextId);
        event2.contextId.should.eql("testcontext");

        should.not.exist(event1.data);
        event2.data.should.eql({name:'leo'});

        should.exist(event1.date);
        should.exist(event2.date);

        event1.name.should.eql('test');
        event2.name.should.eql('test2');

        event1.actorId.should.eql(user.id);
        event2.actorType.should.eql(user.type);

    });

});