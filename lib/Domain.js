'use strict';

const debug = require('debug')('Domain');
const EventStore = require('./EventStore');
const Repository = require('./Repository');
const co = require('co');
const Actor = require('./Actor');
const DomainEvent = require('./DomainEvent');
const EventBus = require('./EventBus');
const _ = require('lodash');
const service = Symbol('service');
const eventstore = Symbol('eventstore');
const repos = Symbol('repos');
const eventbus = Symbol('eventbus');
const Alias = require('./alias');
const subScribeSystem = Symbol('subScribeSystem');
const isGenerator = require("is-generator");

const DomainEventSubsubScribeSystem = require("./DomainEventSubscribeSystem");
const extend = require("./extend");

const uncommittedEvents = Symbol.for('uncommittedEvents');

/**
 * @class Domain
 * @see EventBus
 * @param eventStoreOptions {object}
 */
class Domain {

    constructor() {

        let that = this;

        this[subScribeSystem] = new DomainEventSubsubScribeSystem;
        this[eventstore] = new EventStore();

        //this[emitter] = new EventEmitter;
        this.inited = false;

        this[service] = {
            Alias,
            actor: null,
            sagaId: null,
            method: null,
            sagaCall () {

                let args = Array.from(arguments);
                args[3] = this.actor.id;
                let method = args[0].split('.')[2];
                return new Promise((resolve, reject) => {
                    const alias = Alias().method(method).sagaId(this.actor.id).get();
                    that[subScribeSystem].once(alias, resolve);
                    that.call.apply(that, args);
                });

            },
            call () {
                that.call.apply(that, arguments);
            },
            apply(name, data){
                if (this.actor.isAlive()) {
                    var event = new DomainEvent({
                        actor: this.actor,
                        data,
                        name,
                        method:this.method,
                        sagaId: this.sagaId
                    });
                    this.actor.when(event);
                    this.actor[uncommittedEvents] = this.actor[uncommittedEvents] || [];
                    this.actor[uncommittedEvents].push(event.json);
                    that[eventbus].publish(this.actor);
                }
            },
            subscribe(alias, handle, timeout){
                const subscriberType = this.actor.type;
                const subscriberId = this.actor.id;
                that[subScribeSystem].subscribe(subscriberType, subscriberId, _.isString(alias) ? alias : alias.get(), handle, timeout);
            },
            unSubscribe(alias){
                const subscriberId = this.actor.id;
                that[subScribeSystem].unSubscribe(subscriberId, _.isString(alias) ? alias : alias.get());
            }
        };

        this[repos] = {};

        /**
         * @memberof Domain.prototype
         * @member __eventBus
         * @type {EventBus}
         * @private
         */
        this[eventbus] = new EventBus(this[eventstore]);

        // todo
        this[eventbus].on("publish", (event)=> {
            this[subScribeSystem].emit("publish", event);
        });


        this[subScribeSystem].on("call", (eventInfo, event)=> {

            const subscriberType = eventInfo.subscriberType;
            const subscriberId = eventInfo.subscriberId;
            const handle = eventInfo.handle;

            this.call(subscriberType + "." + subscriberId + "." + handle, event);
        });

    }


    /**
     * @memberof Domain.prototype
     * @method register
     * @param ActorClass {Actor}
     * @returns {Domain}
     */
    register(ActorClass) {
        let repo = new Repository(ActorClass, this[eventstore]);
        this[repos][ActorClass.getType()] = repo;
        return this;
    }

    /**
     * create a actor object.
     * @method create
     * @param actorType {String}  actor's type.
     * @param data {json}
     * @param callback {Function}
     */
    create(actorType, data, callback) {
        callback = callback || function () {
        };
        let repo = this[repos][actorType];
        co(function *() {
            try {
                repo.create(data, callback);

            } catch (e) {
                callback(e);
            }
        });
    }

    /**
     * once listen domain'event.
     * @method once
     * @memberof Domain.prototype
     * @param eventName
     * @param listener
     */
    once(eventName, listener) {
        this[subScribeSystem].once(eventName, listener);
        return this;
    }

    /**
     * listen domain'event.
     * @method on
     * @memberof Domain.prototype
     * @param eventName
     * @param listener
     */
    on(eventName, listener) {

        if (eventName === 'init') {
            if (this.inited) {
                listener();
            } else {
                this[subScribeSystem].on(eventName, listener);
            }
        } else {
            this[subScribeSystem].on(eventName, listener);
        }

        return this;
    }

    /**
     * @method getEvents
     * @memberof Domain.prototype
     * @param opts
     */
    getHistory() {

        // todo
    }

    _get(actorType, actorId, cb) {
        var self = this;

        var repo = self[repos][actorType];

        repo.get(actorId, function (err, actor) {
            if (cb) {
                cb(null, actor);
            }
        });


    }

    /**
     * domain.call('User.id001.changeName',)
     */
    call(methodName, args, callback, sagaId) {

        debug("call begin");

        methodName = methodName.split('.');

        args = args || [];

        callback = callback || function () {
        };

        let type = methodName[0];
        let id = methodName[1];
        let method = methodName[2];


        return new Promise((resolve, reject)=> {
            this._get(type, id, (err, actor)=> {
                if (actor) {

                    try {
                        const serv = Object.create(this[service]);
                        serv.actor = actor;
                        serv.sagaId = sagaId;
                        serv.method = method;


                        if (isGenerator.fn(actor[method])) {
                            co(function *() {
                                yield actor[method](args, serv);
                            }).catch(function (err) {
                                console.log(err.stack);
                            });
                        } else {
                            actor[method](args, serv);
                        }

                        callback(null);
                    } catch (err) {
                        reject(err);
                        callback(err);
                    }
                } else {
                    err = new Error('no actor');
                    reject(err);
                    callback(err);
                }
            });
        });

    }

    remove(type, id, callback) {
        return this.call(type, id, 'remove', callback);
    }

    static get Alias(){
        return Alias;
    }
}



module.exports = Domain;
