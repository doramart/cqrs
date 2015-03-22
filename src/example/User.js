var cqrs = require('../..');
var Actor = cqrs.Actor;

export default
class User extends Actor {

    static get type(){
        return "User";
    }

    constructor() {
        super({money: 0});
    }

    deduct(money,contextId) {
        this._apply("deduct", money,contextId);
    }

    recharge(money,contextId) {
        this._apply("recharge", money,contextId);
    }

    _when(event) {
        switch (event.name) {
            case "deduct":
                this._data.money -= event.data;
                break;
            case "recharge":
                this._data.money += event.data;
                break;
        }
    }
}