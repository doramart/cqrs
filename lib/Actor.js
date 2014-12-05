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
        this._data = data;
        this._data.id = uid;
    }

    /**
     * @member id
     * @memberof Actor.prototype
     * @returns {string}
     */
    get id() {
        return this._data.id;
    }

    /**
     * @member type
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

    static extend(methods = {}) {


        var whenFun = methods.when;
        delete methods.when;

        var typeName = methods.type;
        delete methods.type;

        class Type extends Actor {
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