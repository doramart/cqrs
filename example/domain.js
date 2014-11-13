var domain = require("..")(),User = require("./User"),Transfer = require("./Transfer");

domain.register(User);
domain.register(Transfer);

module.exports = domain;