var dataKye = Symbol("dataKey"),
    isLoadEvents = Symbol("isLoadEvents"),
    apply = Symbol("apply"),
    listen = Symbol("listen"),
    readDataKye = Symbol("readDataKye"),

    Command = require("command"),
    when = Symbol("when"),
    create = Symbol("create"),
    getDI = Symbol("getDI"),

    uid = require("shortid"),
    EventEmitter = require("events").EventEmitter;

class Actor extends EventEmitter {

    constructor(data, isCreate = false) {
        data = data || {};
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

    refreshData() {
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
        var data = this.reborn(event.data);
        for (var k in data) {
            this[dataKye][k] = data[k];
        }
    }

    if (this._otherWhen)
        this._otherWhen(event, this[dataKye]);
}

    //publish domain event
    //is apply success , then emit apply event
[apply]() {

    return Command("name", "data", "caller", "contextId", [, {}, {}], arguments, opts => {
        var event = {
            name: opts.name,
            callerId: opts.caller.id,
            callerType: opts.caller.type,
            targetType: this.type,
            targetId: this.id,
            data: opts.data,
            contextId: opts.contextId
        };

        this[when](event);
        this.uncommittedEvents.push(event);

        this.emit("apply", this);
    });

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
            return this[apply](eventName, data, {}, cxt);
        },
        listen: ()=> {
            return Command(
                "name", "handle", "contextId", "onlyContext", arguments, opts => {
                    this.emit('listen', opts);
                });
        },
        call: (command)=> {
            this.emit("call", command);
        },

        create: (...opts)=> {
            opts.unshift("create");
            this.emit(...opts);
        }
    }
}

    call() {

        return Command("commandName", "data", "caller", "contextId"
            , [, {}, {}]
            , arguments
            , opts => {

                let commandName = opts.commandName
                    , data = opts.data || {}
                    , caller = opts.caller || {}
                    , contextId = null;

                this[commandName](data, this[getDI](data, caller, contextId));

            });
    }

}


module.exports = Actor;