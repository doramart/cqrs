var thunkify = require("thunkify");
var Emitter = require("events").EventEmitter;
var cache = Symbol("cache");


class Repository extends Emitter {

    constructor(Actor, eventstore) {
        this.Actor = Actor;
        this.eventstore = eventstore;
        this.getFromSnapShot = thunkify(this.eventstore.getFromSnapshot).bind(this.eventstore);
        this.createSnapshot = thunkify(this.eventstore.createSnapshot).bind(this.eventstore);
        this[cache] = {}
    }

    *create(data) {

        let actor = new this.Actor(data);
        let result = yield this.getFromSnapShot(actor.id);
        let stream = result[1];

        yield this.createSnapshot({
            streamId: actor.id,
            data: this.Actor.toJSON(actor),
            revision: stream.lastRevision
        });

        this[cache][actor.id] = actor;

        return actor;

    }

    clear(id) {
        delete this[cache][id];
    }

    getFromCache(id) {
        return this[cache][id];
    }

    *get(id) {

        let actor;

        if (actor = this.getFromCache(id)) {
            return actor;
        }


        let result = yield this.getFromSnapShot(id);
        if (actor = this.getFromCache(id)) {
            return actor;
        }

        let snapshot = result[0];
        let stream = result[1];

        if (!snapshot) return;

        let snap = snapshot.data;

        actor = new this.Actor(snap);

        let history = stream.events;

        if (history.length) {
            let evt = history[history.length - 1];
            if (evt.payload.name === "remove") {
                return null;
            }
        }

        let historyv = [];

        history.forEach(function (e) {
            historyv.push(e.payload);
        });

        actor.loadEvents(historyv);

        this[cache][actor.id] = actor;

        return actor;
    }
}

module.exports = Repository;