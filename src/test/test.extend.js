var cqrs = require('../..');
var Domain = cqrs.Domain;
var extend = cqrs.extend;
var should = require("should");

describe('extend', function () {

    it('#extend', function (done) {

        let User = extend({
            type: 'User',
            changeName: function (name) {
                this._apply("changeName", {name});
            },
            _when: function (event) {
                switch (event.name) {
                    case "changeName":
                        this._data.name = event.data.name;
                        break;
                }
            }
        });

        var domain = new Domain();

        domain.register(User);

        domain.on('init', function () {
            domain.create('User', {name: 'liang'}, function (err, uid) {
                should.exist(uid);
                done();
            })
        });


    });
});