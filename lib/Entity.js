var uid = require("shortid");

function Entity() {
    this.__data = {};
    this.set("id", uid());
}

Object.defineProperties(Entity.prototype, {
    set: {
        value: function (k, v) {
            if (arguments.length === 1) {
                for (var n in k) {
                    this.set(n, k[n]);
                }
            } else {
                this.__data[k] = v;
            }
        }
    },
    get: {
        value: function (k) {
            return this.__data[k];
        }
    },
    json: {
        value: function () {
            return JSON.parse(JSON.stringify(this.__data));
        }
    }
})

module.exports = Entity;