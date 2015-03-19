[API DOC](http://leogiese.github.io/cqrs/api/index.html)
---------------------------------------------------------

#### DDD-CQRS-Actor framework for javascript.


![](https://raw.githubusercontent.com/leogiese/cqrs/master/img.png)

Install
=======

    npm install cqrs --save

Use
===

#### create a domain

    var Domain = require("cqrs").Domain;
    var domain = new Domain(options)

+ options for eventstore , see [eventstore - Provide implementation for storage](https://github.com/adrai/node-eventstore#provide-implementation-for-storage)

#### domain#register

register Actor class , Actor like DDD's AggregateRoot.

e.g.

    domain.register({
        type:"User",
        changeName:function(name){},
        when:function(event){}
    })

or


    var Actor = require("cqrs").Actor;
    var User = Actor.extend({
         type:"User",
         changeName:function(name){},
         when:function(event){}
    })
    domain.register(User);



#### domain#create(typeName,data,callback)

create actor object.

    domain.create("User",data,function(err,actorId){})

#### domain#addListener(eventName,handleFunction)

listen a domain event.

    domain.addListener("User:changeName",function(domainEvent){});

#### domain#get(typeName,actorId,callback)

    domain.get("User","id0001" , function(err , actor){ })

Actor API
=========

#### Defined Actor class

    var User = Actor.extend(options);


#### Defined methods

    Actor.extend({
        type:"User",
        changeName:function(name){
            // you can validat and throw error ...
            di.apply("changeName",name);
        },
        when:function(event){
            //see next step
        }
    })

or

    Actor.extend({
        type:"User",
        changeName:true,
        when:function(event){
            //see next step
        }
    })

`changeName:true` Equivalent to

    changeName:function(data){
        this.apply("changeName",data.name);
    }

`change:["name","age"]` Equivalent to

    change:function(data){
        this.apply("change" , {name:data.name,age:data.age})
    }

the method cann't change self data. and must use `when` method to changed.


#### Actor#when(event)

The method only set self data according `event` , no only logic code.

+ event , domain event.

e.g.

    Actor.extend("User",{
        changeName:function(name){
            this.apply("changeName",name);
        },
        when:function(event){
            if(event.name === "changName"){
                this._data.name = event.data;
            }
        }
    })

#### Actor#listen(eventName,handleName,[contextId])

e.g.

    Actor.extend("User",{
        test:function(){
            // listen `Book.changeName` domain' event , and use `handle` method to handle.
            this.listen("Book.changeName","handle");
            this.apply("test");
        },

        handle:function(event){

        }

    })

#### Actor#toJSON(actor)

static method

return actor object.

#### Actor#parse(json)

static method

return actor's json data.

LICENSE
=======
MIT