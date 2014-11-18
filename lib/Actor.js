var dataKye = Symbol("dataKey"),
    isLoadEvents = Symbol("isLoadEvents"),
    apply = Symbol("apply"),
    listen = Symbol("listen"),
    readDataKye = Symbol("readDataKye"),
    when = Symbol("when"),
    create = Symbol("create"),
    getDI = Symbol("getDI"),

    uid = require("shortid"),
    Event = require("./Event"),
    EventEmitter = require("events").EventEmitter;

class Actor extends EventEmitter {

    constructor(data, isCreate = false) {
        data = data || {}
        this[dataKye] = data;
        this[readDataKye] = {};
        this[dataKye].id = uid();
        this.uncommittedEvents = [];
        if (isCreate) {
            this[create](this[dataKye]);
        }
    }

    get id() {
        return this[dataKye].id;
    }

    get data() {
        return this[readDataKye];
    }

    get json() {
        return this[readDataKye] = this.toJSON(this[dataKye]);
    }

    refreshData(){
        this.json;
    }

    // can rewrite
    toJSON(data) {
        return JSON.parse(JSON.stringify(data));
    }

    loadEvents(events) {
        if (this[isLoadEvents]) return;
        events.forEach(event => {
            this[when](event);
        })
        this[isLoadEvents] = true;
    }

    loadSnap(snap) {
        if (this[isLoadEvents]) return;
        this[dataKye] = this.reborn(snap);
        this[isLoadEvents] = true;
    }

    // can rewrtite
    reborn(data) {
        return data;
    }

[when](event) {

    if (event.name === "create") {
        this[dataKye] === this.reborn(event.data);
    }

    if (this._otherWhen)
        this._otherWhen(event, this[dataKye]);
}

    //publish domain event
    //is apply success , then emit apply event
[apply](name, data, caller = {}, contextId = null) {
    caller = caller || {}
    var event = new Event(name, {
        callerId: caller.id,
        callerType: caller.typeName,
        targetId: this.json.id,
        targetType: this.typeName,
        data: data
    }, contextId);

    this[when](event);
    this.uncommittedEvents.push(event.json);

    this.emit("apply", this);
}

[create](data) {
    this.create(data, this[getDI]());
}

    remove() {
        this[apply]("remove");
    }

    /**
     * default create method
     * @param data
     * @param di
     */
    create(data, di) {
        di.apply("create", data);
    }

[getDI](data = {}, caller = {}, contextId = null) {
    return {
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
        call: (command)=> {
            this.emit("call", command);
        }
    }
}

    call(commandName, data = {}, caller = {}, contextId = null) {
        this[commandName](data, this[getDI](data, caller, contextId));
    }

    static extend(typeName, methods = {}) {

        class Type extends Actor {
        }

        if (methods.create) {
            var createFun = methods.create;
            delete methods.create;
            Object.defineProperty(Type.prototype, "create", {
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


        for (var k in methods) {
            if (k === "when") {
                Object.defineProperty(Type.prototype, "_otherWhen", {
                    value: methods[k]
                })
            } else {
                Object.defineProperty(Type.prototype, k, {
                    value: methods[k]
                })
            }

        }

        return Type;
    }

}


module.exports = Actor;