var Domain = require(".."),
    Root = Domain.AggregateRoot;

module.exports = Root.extend({

    constructor:function(data){
        this.set("money",0.0);
    },

    methods: {
        recharge: function (money) {
            // validat code omitted
            this.apply("recharge", money);
        },
        deduct: function (money) {
            // validat code omitted
            this.apply("deduct", money);
        }
    },
    when: function (event) {
        switch (event.name) {
            case "recharge":
                var money = this.get("money") + event.data;
                this.set("money", money);
                break;

            case "deduct":
                var money = this.get("money") - event.data;
                this.set("money", money);
                break;
        }
    }
})