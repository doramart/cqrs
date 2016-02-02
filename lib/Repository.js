'use strict';

const EventEmitter = require('events').EventEmitter;

const ActorKey = Symbol('Actor');
const cacheKey = Symbol('cache');
const co = require('co');
const es = Symbol('es');
const uuid = require('uuid').v4;
const loadEvents = Symbol.for('loadEvents');
const thunkify = require('thunkify');

class Repository extends EventEmitter {

    constructor(Actor, eventstore) {
        super();
        this[es] = {
            getLatestEvent: thunkify(eventstore.getLatestEvent).bind(eventstore),
            saveEvents: thunkify(eventstore.saveEvents).bind(eventstore),
            getLatestSnapshot: thunkify(eventstore.getLatestSnapshot).bind(eventstore),
            createSnap: thunkify(eventstore.createSnap).bind(eventstore),
            getEventsBySnapshot: thunkify(eventstore.getEventsBySnapshot).bind(eventstore)
        };
        this[ActorKey] = Actor;
        this[cacheKey] = {};
    }

    create(data, cb) {

        let actor = new this[ActorKey](data);
        let newSnap = {
            id: uuid(),
            index: 0,
            date: Date.now(),
            data: actor.json,
            actorId: actor.id,
            actorType: actor.type
        };

        co(function * () {
            yield this[es].createSnap(newSnap);

            this[cacheKey][actor.id] = actor;
            cb(null,actor.json);

        }.bind(this));

    }

    /**
     * clear a actor from cache.
     * @method clear
     * @memberof Repository.prototype
     * @param id
     */
    clear(id) {
        this[cacheKey][id] = null;
    }

    /**
     * get actor from cache.
     * @memberof Repository.prototype
     * @method getFromCache
     * @param id {String}
     * @returns {Actor}
     */
    getFromCache(id) {
        return this[cacheKey][id];
    }

    get(id, cb) {
        co(function *() {
            if (Array.isArray(this[cacheKey][id])) {
                this[cacheKey][id].push(cb);
            } else if (!this[cacheKey][id]) {
                this[cacheKey][id] = [];
                let snap = yield this[es].getLatestSnapshot(id);
                if (snap) {
                    let events = yield this[es].getEventsBySnapshot(snap.id);
                    const actor = this[ActorKey].parse(snap.data);
                    actor[loadEvents](events);
                    cb(null, actor);

                    this[cacheKey][id].forEach(callback=> {
                        callback(null, actor);
                    });

                    this[cacheKey][id] = actor;

                } else {
                    cb(null, null);
                }
            } else {
                cb(null, this[cacheKey][id]);
            }
        }.bind(this)).catch(function (err) {
            console.log(err.stack);
        });
    }
}

module.exports = Repository;