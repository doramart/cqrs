Note
====

Now only preview.

domain
======

Domain for javascript, from CQRS / DDD idea.

Install
=======

    npm install domain --save

Example
=======

    var Domain = require("domain"),
    domain = new Domain(),
    AggregateRoot = Domain.AggregateRoot,

    UserClass = AggregateRoot.extend({
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
    })

    domain.register("User",UserClass);

    var userRepository = domain.repos.User;

    // add listener
    domain.eventBus.on("changeName",function listener(){
        // do samething.
    })


    // call
    userRepository.get(idxxx,function(err,user){
        user.changeName("Leo.Giese");
        user.changeAge(22);
    })

LICENSE
=======
MIT