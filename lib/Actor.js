var dataKye = Symbol("dataKey"),
    set = Symbol["set"],
    isLoadEvents = Symbol("isLoadEvents"),
    apply = Symbol("apply"),
    listen = Symbol("listen"),
    when = Symbol("when"),
    create = Symbol("create"),
    otherWhen = Symbol("otherWhen"),

    uid = require("shortid"),
    Event = require("./Event"),
    EventEmitter = require("events").EventEmitter,

    typeNames = [];


class Actor extends EventEmitter {

    constructor(data = {}, isCreate = false) {
        this[dataKye] = data;
        this[set]("id", uid());
        this[set]("alive", true);
        this.uncommittedEvents = [];
        if (isCreate) {
            this[create](data);
        }
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

[when](event, set) {
    if (event.name === "remove") {
        set("alive", false);
    }

    if (this[otherWhen])
        this[otherWhen](event, set);

}

    // publish domain event
    // is apply success , then emit apply event
[apply](name, data, caller = {}, contextId = null) {
    caller = caller || {}
    if (this.get("alive")) {
        var event = new Event(name, {
            callerId: caller.id,
            callerType: caller.typeName,
            targetId: this.get("id"),
            targetType: this.typeName,
            data: data
        }, contextId);

        this[when](event, this[set].bind(this));
        this.uncommittedEvents.push(event.json);
        this.emit("apply", this);
    }
}

[create](data) {

}

    remove() {
        this[apply]("remove");

    }

    call(commandName, data = {}, caller = {}, contextId = null) {
        this[commandName](data, {
            apply: (eventName, data, cxt)=> {
                this[apply](eventName, data, caller, cxt || contextId);
            },
            listen: (eventName, handleName, cxt, onlyContext)=> {
                if (cxt === true) {
                    onlyContext = cxt;
                    cxt = contentId
                }

                this.emit('listen', this, eventName, handleName, cxt || contextId, onlyContext);
            },
            call: (actorId, commandName, data, cxt)=> {
                this.emit("call", actorId, commandName, data, this, cxt || contextId);
            }
        });
    }

    static extend(options) {

        var typeName = options.typeName;

        if (typeNames.indexOf(typeName) !== -1)
            throw new Error("type name is exist.")

        var methods = options.methods || {};


        class Type extends Actor {
        }

        if (methods.create) {
            var createFun = methods.create;
            delete methods.create;
            Object.defineProperty(Type, constructor, {
                value: createFun
            })
        }

        Object.defineProperty(Type, "typeName", {
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