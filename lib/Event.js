var uid = require("shortid");
module.exports = function Event(aid,name, data) {
    this.id = uid();
    this.aggregateId = aid;
    this.time = Date.now();
    this.name = name;
    this.data = data;
}