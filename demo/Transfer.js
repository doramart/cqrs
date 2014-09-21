var Domain = require(".."), Saga = Domain.Saga;

module.exports = Saga.extend({

    constructor: function () {
        this.set("start", false);
        this.set("deducted", false);
        this.set("recharged", false);
    },

    methods: {

        transfer: function (user1_id, user2_id, money) {

            var self = this;

            this.domain.repos.User.get(user1_id, function (err, user1) {

                self.domain.repos.User.get(user2_id, function (err, user2) {

                    if (user1 && user2) {
                        self.apply("start");
                        user1.deduct(money);
                        user2.recharge(money);
                    } else {
                        self.apply("error");
                    }

                });
            });


        }
    },

    listeners: {
        "deduct": function (event) {
            if (this.get("recharged")) {
                this.apply("deducted");
                this.completed();
            } else {
                this.apply("deducted");
            }
        },
        "recharge": function (event) {
            if (this.get("deducted")) {
                this.apply("recharged");
                this.completed();
            } else {
                this.apply("recharged");
            }
        }
    },

    when: function (event) {
        switch (event.name) {
            case "start":
                this.set("start", true);
                break;
            case "deducted":
                this.set("deducted", true);
                break;
            case "recharged":
                this.set("recharged", true);
                break;
        }
    }
})
