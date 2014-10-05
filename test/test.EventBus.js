var EventBus = require("../lib/EventBus"),
    eventstore = require("eventstore"),
    Event = require("../lib/Event"),
    AggregateRoot = require("../lib/AggregateRoot"),
    es = eventstore();


describe("EventBus", function () {

    var bus;

    it("#new", function () {

        bus = new EventBus(es);
        es.init();

    })

    it("#publish", function (done) {

        var User = AggregateRoot.extend({
            className:"User",
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

        var user = new User();

        var aid = user.get("id");
        bus.on("User." + aid + ":changeName", function (event) {
            bus.on("." + aid + ":changeName", function (event) {
                bus.on("." + aid, function (event) {
                    bus.on("User:changeName", function (event) {
                        bus.on("User", function (event) {
                            bus.on(":changeName", function (event) {
                                done();
                            })
                        })
                    })
                })
            })
        })


        user.uncommittedEvents.push(new Event({aggregateType:"User",aggregateId: user.get("id"), name: "changeName", data: {name: "leo123"}}));
        bus.publish(user);

    })

})