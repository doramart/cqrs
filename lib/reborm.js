'use strict';

const loadEvents = Symbol.for('loadEvents');

module.exports = function reborm(ActorClass, snap, events) {

    const actor = ActorClass.parse(snap.data);
    actor[loadEvents](events);

    return actor;
};