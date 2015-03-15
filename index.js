var Domain = require("./dist/lib/Domain"), Actor = require("./dist/lib/Actor");

function wrap(options){
    return new Domain(options);
}

wrap.Actor = Actor;

module.exports = wrap;
