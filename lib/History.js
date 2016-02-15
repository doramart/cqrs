'use strict';

const _reborm = require('./reborm');

class History {

    constructor(ActorClass, events, snap) {
        this.ActorClass = ActorClass;
        this._snap0 = snap;
        this.events = events || [];

        this.position = this.events.length;

        this.reborm = function (events) {
            return _reborm.apply(null, [ActorClass, this._snap0, events]).json;
        };

        this.snap = this.reborm(events);
    }

    next() {
        if (this.events.length === 0 || this.events.length === this.position) {
            return this;
        }

        ++this.position;

        this._createSnap();
        return this;

    }

    prev() {
        if (this.position === 0 || this.events.length === 0) {
            return this;
        }

        --this.position;

        this._createSnap();
        return this;
    }

    _createSnap() {
        let events = this.events.slice(0, this.position);
        this.snap = this.reborm(events);
    }

}

module.exports = History;