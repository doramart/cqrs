'use strict';
const Db = require('tingodb')().Db;
const path = require('path');
const EventEmitter = require("events").EventEmitter;

class EventStore extends EventEmitter {

    constructor() {
        super();
        const db = new Db(path.join(__dirname, '..', 'testdb'), {});
        this.events = db.collection("events");
        this.snaps = db.collection("snaps");
    }

    createSnap(data, cb) {
        this.snaps.insert(data, function (err) {
            cb(err);
        });
    }

    saveEvents(data, cb) {

        if (!Array.isArray(data)) {
            data = [data];
        }

        this.events.insert(data, err=> {
            cb(err);
            if (!err) {
                this.emit('saved events', data);
            }
        });
    }

    getLatestSnapshot(actorId, cb) {
        this.snaps.findOne({actorId}, {sort: [['date', 'desc'], ['index', 'desc']]}, cb);
    }

    getEvents(actorId, cb) {
        this.events.find({
            actorId
        }, {sort: [['date', 'asc'], ['index', 'asc']]}).toArray(cb);
    }

    getLatestEvent(actorId, cb) {
        this.events.findOne({actorId}, {sort: [['date', 'desc'], ['index', 'desc']]}, cb);
    }

    getEventsBySnapshot(snapId, cb) {
        this.getSnapshotById({id: snapId}, (err, snap)=> {
            if (snap) {
                this.events.find({
                    actorId: snap.actorId,
                    index: {'$gt': snap.latestEventIndex}
                }, {sort: [['date', 'asc'], ['index', 'asc']]}).toArray(cb);
            } else {
                cb(null, []);
            }
        });
    }

    getSnapshotByIndex(actorId, index, cb) {
        this.snaps.findOne({actorId, index}, cb);

    }

    getSnapshotByLastIndex(actorId, index, cb) {
        this.getLatestSnapshot(actorId, (err, snap)=> {
            if (snap) {
                if (index === 0) {
                    cb(null, snap);
                } else {
                    this.getSnapshotByIndex(actorId, snap.index - index, cb);
                }
            } else if (err) {
                cb(err);
            } else {
                cb(null, null);
            }

        });
    }

    getSnapshotById(id, cb) {
        this.snaps.findOne({id}, cb);
    }

    getEventById(id, cb) {
        this.events.findOne({id}, cb);
    }

    getEventTree(parentEventId, cb) {

    }

}


module.exports = EventStore;