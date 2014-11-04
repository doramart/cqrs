var dataKye = Symbol("dataKey"),
    set = Symbol["set"],
    isLoadEvents = Symbol("isLoadEvents"),
    apply = Symbol("apply"),
    listen = Symbol("listen"),
    when = Symbol("when"),

    otherWhen = Symbol("otherWhen"),

    uid = require("shortid"),
    Event = require("./Event"),
    EventEmitter = require("events").EventEmitter,

    typeNames = [];


class Actor extends EventEmitter {

    constructor(data = {}) {
        this[dataKye] = data;
        this[set]("id", uid());
        this[set]("alive", true);
        this.uncommittedEvents = [];
    }

/**
 * Call it must at `when` method.
 * @param k
 * @param v
 */
    [set](k, v) {
    if (arguments.length === 1) {
        for (var n in k) {
            this[set](n, k[n]);
        }
    } else {
        this[dataKye][k] = v;
    }
}

    get(k) {
        return this[dataKye][k];
    }

    get id() {
        return this.get("id");
    }

    get json() {
        var data = JSON.parse(JSON.stringify(this[dataKye]));
        data.id = this.get("id");
        data.alive = this.get("alive");
        return data;
    }

    loadEvents(events) {
        if (this[isLoadEvents]) return;
        var set = this.set.bind(this);
        events.forEach(event => {
            this[when](event, set);
        })
        this[isLoadEvents] = true;
    }

    loadSnap(snap) {
        if (this[isLoadEvents]) return;
        this[set](snap);
        this[isLoadEvents] = true;
    }

/**
 * listen("User.id001","finish");
 * @param eventName
 * @param handleName
 */
    [listen](eventName, handleName) {
    this.emit('listen', eventName, handleName);
}
    [when](event, set) {
    if (event.name === "remove") {
        set("alive", false);
    }

    if(this[otherWhen])
    this[otherWhen](event, set);

}

    // publish domain event
    // is apply success , then emit apply event
[apply](name, data, caller = {}) {
    if (this.get("alive")) {
        var event = new Event(name, {
            callerId: caller.id,
            callerType: caller.typeName,
            targetId: this.get("id"),
            targetType: this.typeName,
            data: data
        });
        this[when](event, this[set].bind(this));
        this.uncommittedEvents.push(event);
        this.emit("apply", this);
    }
}

    remove() {
        this[apply]("remove");

    }

    call(commandName, data, caller) {
        this[commandName](data, {
            apply: (eventName, data)=> {
                this[apply](eventName, data, caller);
            },
            listen: this[listen].bind(this)
        });
    }

    static extend(options) {

        var typeName = options.typeName;

        if (typeNames.indexOf(typeName) !== -1)
            throw new Error("type name is exist.")

        var methods = options.methods;

        class Type extends Actor {
        }

        Object.defineProperty(Type,"typeName",{
            get() {
                return typeName;
            }
        })

        Object.defineProperty(Type.prototype, "typeName", {
            get() {
                return typeName;
            }
        })

        Object.defineProperty(Type.prototype, otherWhen, {
            value: options.when
        })

        for (var k in methods) {
            Object.defineProperty(Type.prototype, k, {
                value: methods[k]
            })
        }

        return Type;
    }

}

module.exports = Actor;