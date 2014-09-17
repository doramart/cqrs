var Repository = require("../lib/Repository"),
    eventstore = require("eventstore"),
    AggregateRoot = require("../lib/AggregateRoot"),
    es = eventstore(),
    EventBus = require("../lib/EventBus"),
    bus = new EventBus(es),
    User = AggregateRoot.extend({
        when: function (event) {
            switch (event.name) {
                case "changeName":
                    this.set("name", event.data.name);
                    break;
                case "changeAge":
                    this.set("age", event.data.age);
                    break;
            }
        },
        methods: {
            changeName: function (name) {
                this.apply("changeName", {name: name});
            },
            changeAge: function (age) {
                this.apply("changeAge", {age: age});
            }
        }
    });


describe("Repository",function(){

    var repository,user,uid;

    it("#new",function(){
        repository = new Repository("User",User,es,bus);
    })

    it("#create",function(done){
        repository.create({name:"leo"},function(err,u){
            user = u;
            uid = user.get("id");

            user.changeName("leo");

            repository.clear(uid);
            done();
        })
    })



    it("#get",function(done){
        repository.get(uid,function(err,result){
            result.get("name").should.eql("leo");
            done();
        })
    })

})