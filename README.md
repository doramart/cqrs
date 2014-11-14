#### DDD-CQRS framework for javascript.

![](https://raw.githubusercontent.com/leogiese/cqrs/master/img.png)

Install
=======

    npm install cqrs --save

Use it
======

#### create a domain object
```
var domain = require("cqrs")();
```

#### register Actor class , Actor like DDD's AggregateRoot.

```
domain.register("User",{
    changeName:function(data,di){},
    when:function(event,set){}
})
```

#### domain#create(typeName,data,callback)

create actor object.
```
domain.create("User",data,function(err,actorId){
    ...
})
```

#### domain#call(command,callback)

+ command {typeName, actorId, methodName, [data], [contextId]}
+ callback(err)

call actor's domain method.

```
domain.call({
            typeName:"User",
            actorId:uid,
            methodName:"recharge",
            data:{money:20}
        }, function (err) {
            ...
        });
```


LICENSE
=======
MIT