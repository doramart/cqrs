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


var Transfer ＝ Actor.extend({
    typeName:"Transfer",

    // 定义方法
    methods:{
        transfer(data,di){

            var from = data.from;
            var to = data.to;

            // 转账金额
            var money = data.money;

            // 监听from 的冻结事件
            di.listen("User."+from.id+":freeze", "freeze",true);

            // 监听to 的充值事件
            di.listen("User."+to.id+":recharge","recharge", true);


            // 监听from 完成付款事件
            di.listen("User."+from.id+":finishTransfer" , "fromFinishTransfer" , true);

            // 监听 to 完成充值事件
            di.listen("User."+from.id+":finishRecharge", "toFinishTransfer", true);

            // 调用from的 transfer 方法, 这一步会让from产生冻结事件
            di.call(from.id,"transfer",{money:money , transferId: this.id});


            di.apply("begin",data);

        }

        freeze(data,di){
            // 发出领域事件
            di.apply("freeze");

            // 调用 to 用户的充值方法
            var toUserId = this.get("to");
            var money = this.get("moeny");
            di.call(toUserId,"racharge",{money:money,reachargeId: this.id});
        }

        reacharg(){
            di.apply("recharge");

            // 调用 from用户的 finishTransfer 方法
            var fromUserId = this.get("from");
            var money = this.get("moeny");
            di.call(fromUserId,"finishTransfer",{transferId:this.id});
        }

        fromFinishTransfer(data,id){
            di.apply("finishTransfer");

            // 调用 from用户的 finishTransfer 方法
            var fromUserId = this.get("from");
            var money = this.get("moeny");
            di.call(fromUserId,"finishTransfer",{transferId:this.id});
        }

    }
})




var User = Actor.extend({
    typeName:"User",
    methods:{
        changeName:function(data,di){

           di.listen("User.id001:changeAge","finish",cxt,true);
           di.call("id001","changeAge",22,[cxt]);
           di.apply("changeName",data);


        },

        finish:function(data,di){

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

```
var user = new User();

user.on("apply",function(this){
    console.log(this.get("name")) ; // leo giese
})

user.call("changeName","leo giese");

```

LICENSE
=======
MIT