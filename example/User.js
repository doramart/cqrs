var Actor = require("..").Actor;

module.exports = Actor.extend({
    typeName:"User",
    methods:{

        recharge: function (data, di) {
            // validat code ...
            di.apply("recharge",data);
        },
        
        rechargeFinish: function (data,di) {
            // validat code ...
            di.apply("rechargeFinish",data);
        },

        deduct: function (data,di) {
            // validat code ...
            di.apply("deduct",data);
        },

        deductFinish: function (data,di) {
            // validat code ...
            di.apply("deductFinish",data);
        }

    },
    // the method listen self domain event, and only set data , no other.
    when: function (event,set) {
        switch(event.name){
            case "create":
                // init default data;
                set("orderforms",{});
                set("money",100);
                break;
            case "recharge":
                var orderforms = this.get("orderforms");
                orderforms[event.data.id] = event.data.money;
                break;

            case "rechargeFinish":
                var orderforms = this.get("orderforms");
                var money1  = orderforms[event.data.id];
                var money = this.get("money");
                set("money",money+money1);
                delete orderforms[event.data.id];
                break;

            case "deduct":
                var orderforms = this.get("orderforms");
                orderforms[event.data.id] = event.data.money;
                var money = this.get("money");
                set("money",money-event.data.money);
                break;

            case "deductFinish":
                delete orderforms[event.data.id];
                break;
        }
    }
})