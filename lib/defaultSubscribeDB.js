'use strict';
const tingodb = require('tingodb');

class DefaultSubscribeDB {

    constructor(dbpath, collectionName) {
        const DB = tingodb().Db;
        const db = new DB(dbpath || process.cwd(), {});
        this.collection = db.collection(collectionName || "defaultDB");
    }

    save(subscribeInfo, callback) {
        callback = callback || function () {
        };
        this.collection.find({subscriberId: subscribeInfo.subscriberId, event: subscribeInfo.event})
            .toArray((err, result)=> {
                if (!result.length) {
                    this.collection.insert(subscribeInfo, callback);
                } else {
                    callback(new Error('can\'t repeat subscribe'));
                }
            });
    }

    /**
     *
     * @param subscriberId
     * @param event
     * @param [callback]
     */
    removeBy(subscriberId, event, callback) {
        callback = callback || function () {
        };
        this.collection.remove({subscriberId, event}, callback);
    }

    findByEvent(event, callback) {
        this.collection.find({event}).toArray(callback);

    }

    findByTimeout(callback) {
        this.collection.find({timeout: {$lt: Date.now()}}).toArray(callback);
    }

    clearByTimeout(callback) {
        callback = callback || function () {
        };
        this.collection.remove({timeout: {$lt: Date.now()}}, callback);
    }
}

module.exports = DefaultSubscribeDB;