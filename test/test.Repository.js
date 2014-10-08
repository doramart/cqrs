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
            changeName: function (data,apply) {
                apply("changeName", data);
            },
            changeAge: function (data,apply) {
                apply("changeAge", data);
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
            console.log(err);
            user = u;
            uid = user.get("id");

            user.changeName({name:"leo"});

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