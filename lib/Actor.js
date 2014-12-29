var AbstractActor = require("./AbstractActor");
var uid = require("shortid");
var debug = require("debug")("Actor");

/**
 * @class Actor
 * @augments AbstractActor
 * @param data {{}}
 */
class Actor extends AbstractActor {

    constructor(data = {}) {
        super();
        /**
         * @see Actor#when
         * @member Actor#_data
         * @protected
         * @type {{}}
         */
        this._data = data;
        this._data.id = uid();
        this.on("apply", this.refreshData);
        this.refreshData();
    }

    remove() {
        this.apply("remove");
    }

    /**
     * refress actor's data
     * @member refreshData
     * @memberof Actor#prototype
     */
    refreshData() {
        /**
         * @readonly
         * @member Actor#data
         * @type {Object}
         */
        this.data = this.constructor.toJSON(this);
        Object.freeze(this.data);
    }

    /**
     * @member id {string}
     * @memberof Actor.prototype
     * @returns {string}
     */
    get id() {
        return this._data.id;
    }

    loadEvents(events) {
        super.loadEvents(events);
        this.refreshData();
    }

    /**
     * @member type {string}
     * @memberof Actor.prototype
     * @returns {string}
     */
    static get type() {
        return this.name;
    }

    /**
     * @method parse
     * @memberof Actor.prototype
     * @param json {object}
     */
    static parse(json) {
        var actor = new this(json);
        actor._data.id = json.id;
        return actor;
    }

    /**
     * @method toJSON
     * @memberof Actor.prototype
     * @param actor
     * @returns {object}
     */
    static toJSON(actor) {
        return JSON.parse(JSON.stringify(actor._data));
    }

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
    static extend(methods = {}) {


        var whenFun = methods.when;
        var typeName = methods.type;
        var initFun = methods.init;
        var toJSONFun = methods.toJSON;
        var parseFun = methods.parse;

        class Type extends Actor {

            constructor(data = {}) {
                data.alive = true;
                this._data = data;
                if (initFun) {
                    initFun.call(this, data);
                }
                super(this._data);
                if (!this._data.id) {
                    this._data.id = id;
                }
            }

            when(event) {
                if(event.name === "remove"){
                    this._data.alive = false;
                }
                if (whenFun)
                    whenFun.call(this, event);
            }

            static get type() {
                return typeName;
            }

            static toJSON(actor) {
                var json;
                if (toJSONFun) {
                    json =  toJSONFun.call(this, actor);
                } else {
                    json = super.toJSON(actor);
                }

                json.alive = actor._data.alive;
                return json;
            }

            static parse(json){
                var actor;
                if(parseFun){
                    actor = parseFun.call(this,json);
                }else{
                    actor = super.parse(json);
                }
                actor._data.alive = json.alive;
                actor.refreshData();
                return actor;
            }
        }


        var keys = Object.keys(methods);

        keys.forEach((k)=> {
            if (["when", "type", "init", "toJSON"].indexOf(k) === -1) {
                if (methods[k] === true) {
                    Object.defineProperty(Type.prototype, k, {
                        value: function (data) {
                            this.apply(k, data);
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
    }

}


module.exports = Actor;