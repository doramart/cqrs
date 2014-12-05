var AbstractActor = require("./Actor");
var uid = require("shortid");


/**
 * @class Actor
 * @augments AbstractActor
 * @param data {{}}
 */
class Actor extends AbstractActor {

    constructor(data = {}) {
        super();
        /**
         * only subclass use it , if public same data look behind example .
         *
         *
         * @example
         *
         * var User = Actor.extend({
         *    get name(){
         *       return this.data.name;
         *    }
         * })
         *
         * var user = new User(...);
         *
         * user.name; // Good
         *
         * user.data.name;  // Bad
         *
         * @member Actor#data
         * @protected
         * @type {{}}
         */
        this.data = data;
        this.data.id = uid;
    }

    /**
     * @member id {string}
     * @memberof Actor.prototype
     * @returns {string}
     */
    get id() {
        return this.data.id;
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
        actor.data.id = json.id;
        return actor;
    }

    /**
     * @method toJSON
     * @memberof Actor.prototype
     * @param actor
     * @returns {object}
     */
    static toJSON(actor) {
        return JSON.parse(JSON.stringify(actor.data));
    }

    /**
     * create a subclass
     * @param options
     * @example
     * var User = Actor.extend({
     *   init:function(data){
     *       this.data = data;
     *   },
     *   read:function(){
     *
     *   },
     *   change:function(data){
     *      this.apply("change",data);
     *   },
     *   when:function(event){
     *      if(event.name === "change"){
     *          this.data.name = event.data.name;
     *          this.data.age = event.data.age;
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