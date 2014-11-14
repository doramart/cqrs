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
#### domain#addListener(eventName,handleFunction)
```
domain.addListener("User:changeName",function(domainEvent){

});
```

Actor API
=========

#### Defined Actor class
```
var User = Actor.extend("User",methods);
```


#### Defined methods

```
Actor.extend("User",{
    changeName:function(data,di){
        var name = data.name;
        if(name.length <3 || name.length > 18){
            throw new Error("name char size must >3 and <18");
        }
        di.apply("change name",data.name);
    }
})
```

the method cann't change self data. and must use `when` method.

#### `when(event,set)`

when method only set self data.

```
Actor.extend("User",{
    changeName:function(data,di){
        var name = data.name;
        if(name.length <3 || name.length > 18){
            throw new Error("name char size must >3 and <18");
        }
        di.apply("change name",data.name);
    },
    when:function(event,set){
        if(event.name === "change name"){
            set("name",event.data);
        }
    }
})
```

LICENSE
=======
MIT