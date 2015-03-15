var thunkify = require("thunkify");
var Emitter = require("events").EventEmitter;
var cache = Symbol("cache");


/**
 * @class Repository
 */
export default class Repository extends Emitter {

    /**
     * @constructor
     * @param Actor
     * @param eventstore
     */
    constructor(Actor, eventstore) {
        this.__Actor = Actor;
        this.__getFromSnapShot = thunkify(eventstore.getFromSnapshot).bind(eventstore);
        this.__createSnapshot = thunkify(eventstore.createSnapshot).bind(eventstore);
        this.__cache = {}
    }

    /**
     * Create a Actor object.
     * @method *create
     * @memberof Repository.prototype
     * @param data
     * @returns {Actor}
     */
    *create(data) {

        let actor = new this.__Actor(data);
        let result = yield this.__getFromSnapShot(actor.id);
        let stream = result[1];

        yield this.__createSnapshot({
            streamId: actor.id,
            data: this.__Actor.toJSON(actor),
            revision: stream.lastRevision
        });

        this.__cache[actor.id] = actor;

        return actor;

    }


    clear(id) {
        delete this.__cache[id];
    }

    getFromCache(id) {
        return this.__cache[id];
    }

    *get(id) {

        let actor, returnFun = function () {
            if(actor  && actor.data.alive === false){
                return null;
            }else{
                return actor;
            }
        };

        if (actor = this.getFromCache(id)) {
            return returnFun();
        }


        let result = yield this.__getFromSnapShot(id);
        if (actor = this.getFromCache(id)) {
            return returnFun();
        }

        let snapshot = result[0];
        let stream = result[1];

        if (!snapshot) return;

        let snap = snapshot.data;

        actor = new this.__Actor(snap);

        let history = stream.events;

        let historyv = [];

        history.forEach(function (e) {
            historyv.push(e.payload);
        });

        actor.$$loadEvents(historyv);

        this.__cache[actor.id] = actor;

        return returnFun();
    }
}
