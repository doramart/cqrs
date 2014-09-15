var EventBus = require("../lib/EventBus"),
    eventstore = require("eventstore"),
    Event = require("../lib/Event"),
    AggregateRoot = require("../lib/AggregateRoot"),
    es = eventstore();



describe("#EventBus",function(){

    var bus;

    it("#new" , function(){

        bus = new EventBus(es);
        es.init();

    })

    it("#publish",function(done){

        var User = AggregateRoot.extend({
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

        bus.on("changeName",function(event){
            done();
        })


        var user = new User();
        user.uncommittedEvents.push(new Event(user.get("id"),"changeName",{name:"leo123"}));
        bus.publish(user);

    })

})