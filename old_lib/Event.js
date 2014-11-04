var uid = require("shortid");
module.exports = function Event(opt) {
    this.id = uid();
    this.aggregateId = opt.aggregateId;
    this.aggregateType = opt.aggregateType;
    this.type = opt.type;
    this.time = Date.now();
    this.sagaId = opt.sagaId;
    this.sagaType = opt.sagaType;
    this.name = opt.name;
    this.data = opt.data;

}