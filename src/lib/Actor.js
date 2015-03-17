var AbstractActor = require("./AbstractActor");
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
         * Only call it use _when.
         * @see Actor#_when
         * @member Actor#_data
         * @protected
         * @type {Object}
         */
        this._data = data;
        if (!this._data.id)
            this._data.id = uid();
        this.on("apply", this.refreshData);
        this.refreshData();

    }

    /**
     * refresh actor's data
     * @method refreshData
     * @memberof Actor#prototype
     */
    refreshData() {
        /**
         * @readonly
         * @member Actor#data
         * @public
         * @type {Object}
         */
        this.data = this.constructor.toJSON(this);
    }

    /**
     * @member id {string}
     * @memberof Actor.prototype
     * @type {String}
     */
    get id() {
        return this._data.id;
    }

    $$loadEvents(events) {
        super.$$loadEvents(events);
        this.refreshData();
    }

    /**
     * @member type {String}
     * @memberof Actor
     * @static
     */
    static get type() {
        return this.name;
    }

    /**
     * @method parse
     * @memberof Actor
     * @see AbstractActor.parse
     * @param json {Object}
     * @static
     * @return {Actor}
     */
    static parse(json) {
        var actor = new this(json);
        actor._data.id = json.id;
        return actor;
    }

    /**
     * @method toJSON
     * @memberof Actor
     * @param actor {Actor}
     * @return {object}
     * @static
     * @see AbstractActor.toJSON
     */
    static toJSON(actor) {
        return JSON.parse(JSON.stringify(actor._data));
    }

}


module.exports = Actor;