var Domain = require("../lib/Domain"),should = require("should");

describe("Domain", function () {

    var domain = new Domain(), UserClass;

    it("#register", function () {
        domain.register({
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
                changeName: function (data,apply) {
                    apply("changeName", data);
                },
                changeAge: function (age) {
                    apply("changeAge", data);
                }
            }
        });
    })

    var uid;

    it("#create",function(){
        domain.create("User",null,function(err,id){
            uid = id;
        })
    })

    it("#get",function(){
        domain.get("User",uid,function(err,data){
            data.alive.should.eql(true);
        })
    })

})