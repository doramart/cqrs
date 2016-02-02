'use strict';

const EventEmitter = require('events').EventEmitter;
const DomainEvent = require('./DomainEvent');
const es = Symbol('es');
const uncommittedEvents = Symbol.for('uncommittedEvents');
const co = require('co');
const thunkify = require('thunkify');
const lockSet = new Set();
const uuid = require("uuid").v4;


class EventBus extends EventEmitter {

    constructor(eventstore) {
        super();
        let that = this;
        eventstore.on("saved events", function (events) {
            events.forEach(event=> {
                process.nextTick(function () {
                    that.emit('publish', event);
                });
            });
        });

        this[es] = {
            getLatestEvent: thunkify(eventstore.getLatestEvent).bind(eventstore),
            saveEvents: thunkify(eventstore.saveEvents).bind(eventstore),
            getLatestSnapshot: thunkify(eventstore.getLatestSnapshot).bind(eventstore),
            createSnap: thunkify(eventstore.createSnap).bind(eventstore)
        };
    }

    publish(actor) {

        if (lockSet.has(actor.id)) {
            return;
        } else {
            lockSet.add(actor.id);
        }
        co(function * () {
            const event = yield this[es].getLatestEvent(actor.id);

            let startIndex = event ? event.index + 1 : 0;

            let events = actor[uncommittedEvents].map(function (evt, index) {
                evt.index += index + startIndex;
                return evt;
            });

            yield this[es].saveEvents(events);
            actor[uncommittedEvents] = [];

            let snap = yield this[es].getLatestSnapshot(actor.id);
            let lastEvent = events[events.length - 1];
            if (lastEvent.index - snap.lastEventId > 10) {
                let newSnap = {
                    id: uuid(),
                    latestEventIndex: lastEvent.index,
                    index: snap.index + 1,
                    date: Date.now(),
                    data: actor.json,
                    actorId: actor.id,
                    actorType: actor.type
                };
                yield this[es].createSnap(newSnap);
            }
            lockSet.delete(actor.id);
            if (actor[uncommittedEvents].length) {
                this.publish(actor);
            }
        }.bind(this)).catch(function (er) {
            console.log(er.stack);
        })
    }

}

module.exports = EventBus;
