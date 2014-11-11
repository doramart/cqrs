var Domain = require("./dist/lib/Domain"), Actor = require("./dist/lib/Actor");

function wrap(){
    return new Domain;
}

wrap.Actor = Actor;

module.exports = wrap;
