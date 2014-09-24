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
                        self.apply("start",[user1_id,user2_id]);
                        user1.deduct(money,self.get("id"));
                        user2.recharge(money,self.get("id"));
                    } else {
                        self.apply("error");
                    }

                });
            });

        },

        _finish:function(){

            var roles = this.get("roles"),self = this;

            this.domain.repos.User.get(roles[0], function (err, user1) {

                self.domain.repos.User.get(roles[1], function (err, user2) {

                    if (user1 && user2) {
                        user1.finish(self.get("id"));
                        user1.finish(self.get("id"));
                        self.completed();
                    }

                });
            });
        }

    },

    listeners: {
        "deduct": function (event) {
            if (this.get("recharged")) {
                this.apply("deducted");
                this._finish();
            } else {
                this.apply("deducted");
            }
        },
        "recharge": function (event) {
            if (this.get("deducted")) {
                this.apply("recharged");
                this._finish();
            } else {
                this.apply("recharged");
            }
        }
    },

    when: function (event) {
        switch (event.name) {
            case "start":
                this.set("start", true);
                this.set("roles",event.data);
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
