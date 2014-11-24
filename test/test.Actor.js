require("traceur");

var should = require("should");
var Actor = require("../lib/Actor");

describe("Actor", function () {

    var actor;

    it("#new", function () {
        actor = new Actor({name: "leo", book: "xxx"});
        var data = actor.json;
        should.exist(data.id);
        data.name.should.eql("leo");
        data.book.should.eql("xxx");
    })


    it("#json", function () {
        var data = actor.json;
        data.name.should.eql("leo");
        data.book.should.eql("xxx")
        should.exist(data.id);
    })


    it("#apply", function () {

        //var caller = new Actor();

        var User = Actor.extend("User", {
            changeName: function (name, service) {
                service.apply("changeName", name);
            }
        })

        var caller = new User();
        var actor = new User();

        actor.on("apply", function () {
            this.uncommittedEvents.length.should.eql(1);
            var event = this.uncommittedEvents[0];
            should.exist(event.id);
            should.exist(event.time);
            event.name.should.eql("changeName");
            var data = event.data;
            data.callerId.should.eql(caller.json.id);
            data.callerType.should.eql("User");
            data.targetId.should.eql(actor.json.id)
            data.targetType.should.eql("User");
            data.data.should.eql("leo");
        });

        actor.call("changeName", "leo", caller);

    })

    it("#listen", function (done) {
        var User = Actor.extend("User", {
            changeName: function (name, service) {
                service.listen("change", "finishChange");
            },
            finishChange: function (data, service) {
                done();
            }
        })

        var user = new User();

        user.on("listen", function (event, methodname) {
            this.call("finishChange", methodname);
        });

        user.call("changeName");
    })

    it("#when", function () {
        var User = Actor.extend("User", {
                changeName: function (name, service) {
                    service.apply("changeName", name);
                },
            when: function (event, data) {
                if (event.name === "changeName") {
                    data.name = event.data.data;
                }
            }
        })

        var user = new User();

        user.call("changeName", "leo");
        user.json.name.should.eql("leo");
    })

    it("#create actor usbclass 1", function (done) {

        var User = Actor.extend("User",{
            changeAge:true,
            when: function (event,data) {
                if(event.name === "changeAge"){
                    done();
                }
            }
        })
        var user = new User();

        user.call("changeAge");

    })


    it("#create actor usbclass 2", function (done) {

        var User = Actor.extend("User",{
            change:["name","age"],
            when: function (event,data) {
                if(event.name === "change"){
                    var mydata = event.data.data;
                    mydata.name.should.eql("leo");
                    mydata.age.should.eql(22);
                    done()
                }
            }
        })
        var user = new User();

        user.call("change",{name:"leo",age:22});

    })



})