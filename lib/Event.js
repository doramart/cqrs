var uid = require("shortid");

var dataKey = Symbol("dataKey");
var name = Symbol("name");
var id = Symbol("id");
var time = Symbol("time");

class Event{

    /**
     * @param data {targetId,targetType,sourceId,sourceType}
     */
    constructor(_name = "",data = {}){
        this[name] = _name;
        this[dataKey] = data;
        this[id] = uid();
        this[time] = Date.now();
    }

    get id(){
        return this[id];
    }

    get time(){
        return this[time];
    }

    get name(){
        return this[name];
    }

    get data(){
        return JSON.parse(JSON.stringify(this[dataKey]));
    }

    get json(){
        return {
            data:this.data,
            id:this.id,
            name:this.name,
            time:this.time
        }
    }

    static reborn(json){
        var event = new this();
        event[time] = json.time;
        event[data] = json.data;
        event[name] = json.name;
        event[id] = json.id;
        return event;
    }

}

module.exports = Event;