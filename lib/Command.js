var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

class Command extends EventEmitter{

     constructor(...optionkeys){

         var opts = this.opts = {}

         optionkeys.forEach(k=>{
            this[k] = (v)=>{
                opts[k] = v;
                return this;
            }
         })

     }

    exec(){
        this.emit("exec",this.opts);
    }

}

module.exports = Command;