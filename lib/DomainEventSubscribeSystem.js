'use strict';
const EventEmitter = require('events').EventEmitter;
const DefaultSubscribeDB = require('./DefaultSubscribeDB');

/**
 * @private
 */
class DomainEventSubscribeSystem extends EventEmitter {

    constructor(db) {
        super();
        if (!db) {
            db = new DefaultSubscribeDB();
        }
        this.db = db;

        this.on('publish', (event) => {
            this.emit("*", event);
            for (let eventAlias of event.alias) {

                process.nextTick(n=>this.emit(eventAlias, event));

                this.db.findByEvent(eventAlias, (err, infos)=> {
                    infos.forEach(info => {
                        process.nextTick(n=> {
                            this.emit('call', info, event);
                        });
                    });
                });
            }

        });
    }

    unSubscribe(subscriberId, event) {
        this.db.removeBy(subscriberId, event);
    }

    subscribe(subscriberType, subscriberId, event, handle, timeout) {
        timeout = timeout ? timeout + Date.now() : null;
        this.db.save({subscribeType, subscriberId, event, handle, timeout});
    }

    clear() {
        this.db.findByTimeout((err, infos) => {
            this.db.clearByTimeout();
            infos.forEach(info=> {
                this.emit('timeout', info);
            });
        });
    }

}

module.exports = DomainEventSubscribeSystem;