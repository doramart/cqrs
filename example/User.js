var Actor = require("..").Actor;

module.exports = Actor.extend("User", {

    recharge: function (data, di) {
        // validat code ...
        di.apply("recharge", data);
    },

    rechargeFinish: function (data, di) {
        // validat code ...
        di.apply("rechargeFinish", data);
    },

    deduct: function (data, di) {
        // validat code ...
        di.apply("deduct", data);
    },

    deductFinish: function (data, di) {
        // validat code ...
        di.apply("deductFinish", data);
    },

    when: function (event,data) {
        switch (event.name) {
            case "create":
                // init default data;
                data.orderforms = {};
                data.money = 100;
                break;
            case "recharge":

                data.orderforms[event.data.data.id] = event.data.data.money;
                break;

            case "rechargeFinish":
                var orderforms = data.orderforms;
                var money1 = orderforms[event.data.data.id];
                data.money = data.money + money1;
                delete orderforms[event.data.data.id];
                break;

            case "deduct":
                var orderforms = data.orderforms;
                orderforms[event.data.data.id] = event.data.data.money;
                data.money = data.money - event.data.data.money;
                break;

            case "deductFinish":
                var orderforms = data.orderforms;
                delete orderforms[event.data.data.id];
                break;
        }
    }
})