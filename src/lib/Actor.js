import AbstractActor from './AbstractActor';
import uid from 'shortid';
import DomainEvent from './DomainEvent.js';

/**
 * @class Actor
 * @augments AbstractActor
 * @param data {{}}
 */
export default
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

        this._data.__isAlive = true;
        this.on('apply', this.refreshData);
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

    __when(event){
        if(event.name === 'remove'){
            this._data.__isAlive = false;
        }
    }

    _apply(name, data, contextId) {

        var event = new DomainEvent(name, this, data, contextId);
        this.__when(event);
        this._when(event);
        this.$$uncommittedEvents = this.$$uncommittedEvents || [];
        this.$$uncommittedEvents.push(event);
        /**
         * apply event.
         *
         * @event AbstractActor#apply
         */
        this.emit('apply', this);
    }

    get isAlive(){
        return this._data.__isAlive;
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
        events.forEach(event => {
            this.__when(event);
            this._when(event);
        });
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


