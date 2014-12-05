var Actor = require("..").Actor,
    shortid = require("shortid");

module.exports = Actor.extend("Transfer", {
    transfer: function (data, di) {
        // if start and stop
        if (this.data.start) {
            return;
        }
        var fromId = data.fromId,
            toId = data.toId,
            money = data.money,
            tid = shortid();

        di.listen("User." + fromId, "handle");
        di.listen("User." + toId, "handle");
        data.tid = tid;
        di.apply("transferStart", data);
        // transfer start !
        di.call({typeName: "User", actorId: fromId, methodName: "deduct", data: {id: tid}});
    },
    handle: function (event, di) {
        switch (event.name) {

            case "deduct":
                di.call({
                    typeName: "User",
                    actorId: this.data.toId,
                    methodName: "recharge",
                    data: {id: this.data.tid}
                });
                break;
            case "recharge":
                di.call({
                    typeName: "User",
                    actorId: this.data.fromId,
                    methodName: "deductFinish",
                    data: {id: this.data.tid}
                });
                break;
            case "deductFinish":
                di.call({
                    typeName: "User",
                    actorId: this.data.toId,
                    methodName: "rechargeFinish",
                    data: {id: this.data.tid}
                });
                break;
            case "rechargeFinish":
                di.apply("transferSuccess");
                break;
        }
    },
    when: function (event, data) {
        switch (event.name) {
            case "transferStart":
                for (var k in event.data.data) {
                    data[k] = event.data.data[k];
                }
                data.start = true;
                break;
            case "transferSuccess":
                data.success = true;
                break;

        }

        this.refreshData();

    }
});