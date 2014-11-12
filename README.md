Note
====

Now only preview.

domain
======

Domain for javascript, from CQRS & DDD idea.

Install
=======

    npm install ddd-cqrs --save

Use it
======


#### create a domain object
```
var domain = require("ddd-cqrs")();
```

#### register Actor class , Actor like DDD's AggregateRoot.

domain.register({
    typeName:"User",
    methods:{},
    when:function(event,set){}
})

#### domain#create(typeName,data,callback)

create actor object.

domain.create("User",data,function(err,actorId){
    ...
})



LICENSE
=======
MIT