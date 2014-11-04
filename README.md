Note
====

Now only preview.

domain
======

Domain for javascript, from CQRS / DDD idea.

Install
=======

    npm install domain --save

create Actor class
==================

e.g.

```

Actor.extend({})

```

#### call it

var user = new User();

user.on("apply",function(this){
    console.log(this.get("name")) ; // leo giese
})

user.call("changeName","leo giese");


LICENSE
=======
MIT