var Domain = require("../lib/Domain"),should = require("should");

describe("Domain", function () {

    var domain = new Domain(), UserClass;

    it("#register", function () {
        UserClass = Domain.AggregateRoot.extend({
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

        domain.register("User",UserClass);
    })


    it("#repos.User",function(){
        should.exist(domain.repos.User);
    })

    it("#eventBus",function(){
        should.exist(domain.eventBus);
    })

})