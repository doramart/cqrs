var AbstractActor = require("./Actor");
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
        this._data.id = uid;
        this.on("apply", this._refreshData);

    }

    _refreshData() {
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
        this._refreshData();
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
        delete methods.when;

        var typeName = methods.type;
        delete methods.type;

        var initFun = methods.init;
        delete methods.init;

        var toJSONFun = methods.toJSON;
        delete methods.toJSON;

        class Type extends Actor {

            constructor(data) {
                super(data);
                if (init)
                    initFun.apply(this, data);
            }

            when() {
                whenFun.apply(this, arguments);
            }

            static type() {
                return typeName;
            }

            static toJSON(actor) {
                if (toJSONFun) {
                    return toJSONFun.call(this, actor);
                } else {
                    return super.toJSON(actor);
                }
            }
        }


        var keys = Object.keys(methods);

        keys.forEach((k)=> {
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
        });

        return Type;
    }

}


module.exports = Actor;