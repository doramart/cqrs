'use strict';
const DB = require('nedb');
const _ = require('lodash');

function cb() {
}

class DefaultSubscribeDB {

    constructor() {
        this.collection = new DB();
    }

    save(subscribeInfo, callback) {

        let info;

        if (subscribeInfo.timeout) {
            info = _.pick(subscribeInfo, ['subscriberId', 'event', 'timeout']);
        } else {
            info = _.pick(subscribeInfo, ['subscriberId', 'event']);
        }

        this.collection.find(info, {}, (err, result) => {
            if (!result.length) {
                this.collection.insert(subscribeInfo, callback || cb);
            } else {
                callback(new Error('can\'t repeat subscribe'));
            }
        });

    }

    removeBy(subscriberId, event, callback) {
        this.collection.remove({subscriberId, event}, {}, callback || cb);
    }

    findByEvent(event, callback) {
        this.collection.findOne({event}, callback || cb);
    }

    findByTimeout(callback) {
        this.collection.find({timeout: {$lt: Date.now()}}, {}, callback || cb);
    }

    clearByTimeout(callback) {
        this.collection.remove({timeout: {$lt: Date.now()}}, {}, callback || cb);
    }
}

module.exports = DefaultSubscribeDB;