var cqrs = require('../..');
var Actor = cqrs.Actor;

// like Saga.
export default
class Transfer extends Actor {

    static get type() {
        return "Transfer";
    }

    transfer(fromId, toId, money) {
        if (this.data.isBegin) return;

        this._listen("User." + fromId + ":deduct&" + this.id, "__userDeduct");
        this._listen("User." + toId + ":recharge&" + this.id, "__userRecharge");

        this.myDomain.get("User", fromId).then(fromUser => {
            fromUser.deduct(money, this.id);
        });

        this._apply("begin", {fromId, toId, money});
    }

    __userDeduct(event) {

        this.myDomain.get("User", this.data.toId).then(toUser => {
            toUser.recharge(this.data.money, this.id);
        });
    }

    __userRecharge(event) {

        this._apply("finish");
    }

    _when(event) {
        switch (event.name) {
            case "begin":
                this._data.isBegin = true;
                this._data.fromId = event.data.fromId;
                this._data.toId = event.data.toId;
                this._data.money = event.data.money;
                break;

            case "finish":
                this._data.isFinish = true;
                break;
        }
    }


}