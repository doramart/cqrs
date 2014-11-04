Note
====

Now only preview.

domain
======

Domain for javascript, from CQRS & DDD idea.

Install
=======

    npm install domain --save

create Actor class
==================

```

var User = Actor.extend({
    typeName:"User",
    methods:{
        changeName:function(data,service){

           service.apply("changeName",data);

        }
    },
    when:function(event,set){
        if(event.name === "changeName"){
            set("name",event.data);
        }
    }
})

```

#### new object

var user = new User();

user.on("apply",function(this){
    console.log(this.get("name")) ; // leo giese
})

user.call("changeName","leo giese");


LICENSE
=======
MIT