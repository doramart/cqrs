var uid = require("shortid");
module.exports = function Event(aid,name,type, data) {
    this.id = uid();
    this.aggregateId = aid;
    this.type = type;
    this.time = Date.now();
    this.name = name;
    this.data = data;
}