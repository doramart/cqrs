var Actor = require("..").Actor,
    shortid = require("shortid");

module.exports = Actor.extend({
    typeName: "Transfer",
    methods: {
        transfer: function (data, di) {

            // if start and stop
            if(this.get("start")){
                return;
            }

            var fromId = data.fromId,
                toId = data.toId,
                money = data.money,
                tid = shortid();

            di.listen("User." + fromId, "handle");
            di.listen("User." + toId, "handle");

            data.tid = tid;

            di.apply("transferStart",data);

            // transfer start !
            di.call({typeName:"User", actorId:fromId, methodName:"deduct",data: {id: tid}});

        },
        handle: function (event, di) {
            switch(event.name){

                case "deduct":
                    di.call({typeName:"User", actorId:this.get("toId"), methodName:"recharge", data:{id: this.get("tid")}});
                    break;
                case "recharge":
                    di.call({typeName:"User",actorId:this.get("fromId"),methodName:"deductFinish", data:{id:this.get("tid")}});
                    break;
                case "deductFinish":
                    di.call({typeName:"User",actorId:this.get("toId"),methodName:"rechargeFinish", data:{id:this.get("tid")}});
                    break;
                case "rechargeFinish":
                    di.apply("transferSuccess");
                    break;
            }
        }
    },
    when: function (event, set) {
        switch(event.name){
            case "transferStart":
                set(event.data.data);
                set("start",true);
                break;
            case "transferSuccess":
                set("success",true);
                break;

        }
    }
});