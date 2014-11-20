#### DDD-CQRS-Actor framework for javascript.


![](https://raw.githubusercontent.com/leogiese/cqrs/master/img.png)

Install
=======

    npm install cqrs --save

Use
===

#### create a domain

    var domain = require("cqrs")();

#### domain#register

register Actor class , Actor like DDD's AggregateRoot.

e.g.

    domain.register("User",{
        changeName:function(data,di){},
        when:function(event,data){}
    })

or


    var Actor = require("cqrs").Actor;
    var User = Actor.extend("User",{
        changeName:function(data,di){},
        when:function(event,data){}
    })
    domain.register(User);



#### domain#create(typeName,data,callback)

create actor object.

    domain.create("User",data,function(err,actorId){})

#### domain#call(command,callback)

call actor's domain method.

+ command {typeName, actorId, methodName, [data], [contextId]}

+ callback(err)


    var command = {
        typeName:"User",
        actorId:uid,
        methodName:"recharge",
        data:{money:20}
    }

    domain.call(command, function (err) {});


#### domain#addListener(eventName,handleFunction)

listen a domain event.

    domain.addListener("User:changeName",function(domainEvent){});

#### domain#get(typeName,actorId,callback)

get a actor's json, isn't entity.

    domain.get("User","id0001" , function(err , jsonData){ })

Actor API
=========

#### Defined Actor class

    var User = Actor.extend("User",methods);


#### Defined methods

    Actor.extend("User",{
        changeName:function(data,di){
            // you can validat and throw error ...
            di.apply("changeName",data.name);
        },
        changeAge:function(data){
            di.apply("changeAge",data.age);
        },
        when:function(){
            //see next step
        }
    })

the method cann't change self data. and must use `when` method to changed.

#### Actor#when(event,data)

The method only set self data according `event` , no only logic code.

+ event , domain event.
+ data , writable data.

e.g.

    Actor.extend("User",{
        changeName:function(data,di){
            var name = data.name;
            di.apply("changeName",name);
        },
        when:function(event,data){
            if(event.name === "changName"){
                data.name = event.data.data;
            }
        }
    })

#### Actor#toJSON

The method is private , and `actor.json` call ,  default code :

    toJSON(data) {
        return JSON.parse(JSON.stringify(data));
    }

can custom

e.g.

    Actor.extend("User",{
        changeName:function(data,di){

            ......

            var mydata = this.json;
            console.log(mydata.name); // xxx---

            ......
        },
        toJSON:function(data){
            data.name = data.name + "---";
            return JSON.parse(JSON.stringify(data));
        }
    })

#### Actor#json / Actor#data / Actor#refreshData

`json` is internal call `toJSON` , and refresh `data` , and  `data` is a readonly.

if want data is new , can use  `refreshData`

e.g.


    Actor.extend("User",{
        changeName:function(data,di){
            this.refreshData();
            this.data; // is new value
        }
    })



LICENSE
=======
MIT