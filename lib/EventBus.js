var ES = require("./EventStore"), es = new ES();

function EventBus() {
    this.queue = [];
    this._stop = false;
}

Object.defineProperties(EventBus.prototype, {

    start: {
        value: function () {
            var self = this;
            while (!this._stop) {
                process.nextTick(function () {
                    var e = self.queue.pop();
                    if(e){
                        self._publish(e);
                    }
                });
            }
        }
    },

    stop:{
        value:function(){
            this._stop = true;
        }
    },

    _publish: {
        value: function (event) {
            aggre.emit(event); //  1. change aggre data.

            // 2.  publish to listener

        }
    },

    publish: {
        value: function (event) {
            es.save(event).then(function () {
                this.queue.push(event);
            });
        }
    },

    pipe:{
        // e.g.
        // .pipe("User.*.recharge","*.*.toMoney")
        value:function(when,filter,then){

        }
    },

    addListener: {
        // @param eventDes [name,aid,]
        value: function (eventDes,listener) {

        }
    }
})

module.exports = EventBus;