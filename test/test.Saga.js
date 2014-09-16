var Saga = require("../lib/Saga"),
    wrap = require("../lib/wrapAggregateObj"),
    should = require("should");

describe("Saga", function () {

    var User, user;

    it("#extend", function () {

        User = Saga.extend({
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
            },
            listeners:{
                "test":function(evt){
                    console.log("test event.");
                }
            }
        });

    })

    it("#new", function () {
        user = new User();
    })

    it("#id", function () {
        should.exist(user.get("id"));
    })

    it("#set", function () {
        user.set("name", "leo");
        user.get("name").should.eql("leo");
    })

    it("#json", function () {
        var data = user.json();
        data.id.should.eql(user.get("id"));
        data.name.should.eql(user.get("name"));
        user.json().should.not.equal(data);
    })

    it("#loadSnap", function () {
        user.loadSnap({id: "001", name: "leogiese"});
        user.get("id").should.eql("001");
        user.get("name").should.eql("leogiese");

        user.loadSnap({id: "002", name: "leogiese2"});
        user.get("id").should.eql("001");
        user.get("name").should.eql("leogiese");
    })

    it("#custom loadSnap",function(){
        var P = Saga.extend({loadSnap:function(snap){
            this.set({n:"leo"});
        }})

        var p = new P();
        p.loadSnap();
        p.get("n").should.eql("leo");
    })

    it("#loadEvents", function () {
        user.loadEvents([
            {name: "changeName", data: {name: "brighthas"}},
            {name: "changeAge", data: {age: 22}}
        ])
        user.get("name").should.eql("brighthas");
        user.get("age").should.eql(22);

    })

    it("#call method", function () {

        // only test.
        user._publish = function () {
            //  this.when({name: eventName, data: data});
        }
        user.changeName("zeng");
        user.changeAge(30);
        user.get("name").should.eql("zeng");
        user.get("age").should.eql(30);

    })

    it("#listeners",function(){
        user.emit("test");
    })

    it("#wrap", function () {
        var me = wrap(user);
        me.changeName("liang");
        me.changeAge(32);
        me.get("name").should.eql("liang");
        me.get("age").should.eql(32);
    })

})