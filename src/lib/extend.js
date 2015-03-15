var Actor = require("./Actor");
var inherits = require("util").inherits;

/**
 * create a subclass
 * @param options
 * @example
 * var User = Actor.extend({
     *   init:function(data){
     *       this._data = data;
     *   },
     *   read:function(){
     *
     *   },
     *   change:function(data){
     *      this.apply("change",data);
     *   },
     *   when:function(event){
     *      if(event.name === "change"){
     *          this._data.name = event.data.name;
     *          this._data.age = event.data.age;
     *      }
     *   }
     * })
 */
export default function(methods = {}) {


    var whenFun = methods._when;
    var typeName = methods.type;
    var initFun = methods.init;
    var toJSONFun = methods.toJSON;
    var parseFun = methods.parse;


    function Type(data){
        data = data || {};
        data.alive = true;
        this._data = data;
        if (initFun) {
            initFun.call(this, data);
        }
        Actor.call(this,this._data);
        if (!this._data.id) {
            this._data.id = uid();
        }
    }

    inherits(Type,Actor);

    Type.prototype._when = function(event) {
        if (event.name === "remove") {
            this._data.alive = false;
        }
        if (whenFun)
            whenFun.call(this, event);
    };


    Type.type = typeName;

    Type.toJSON = function(actor) {
        var json;
        if (toJSONFun) {
            json = toJSONFun.call(this, actor);
        } else {
            json = Actor.toJSON(actor);
        }
        json.alive = actor._data.alive;
        return json;
    };

    Type.parse = function(json) {
        var actor;
        if (parseFun) {
            actor = parseFun.call(this, json);
        } else {
            actor = Actor.parse(json);
        }

        actor._data.alive = json.alive;
        actor.refreshData();
        return actor;
    };

    var keys = Object.keys(methods);

    keys.forEach((k)=> {
        if (["_when", "type", "init", "toJSON"].indexOf(k) === -1) {

            if (methods[k] === true) {
                Object.defineProperty(Type.prototype, k, {
                    value: function (data) {
                        this._apply(k, data);
                    }
                })
            } else {
                Object.defineProperty(Type.prototype, k, {
                    value: methods[k]
                })
            }
        }
    });

    return Type;

};