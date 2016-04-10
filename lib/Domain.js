'use strict';

const debug = require('debug')('Domain');
const EventStore = require('./MemEventStore');
const Repository = require('./Repository');
const co = require('co');
const Actor = require('./Actor');
const DomainEvent = require('./DomainEvent');
const EventBus = require('./EventBus');
const _ = require('lodash');
const service = Symbol('service');
const eventstore = Symbol('eventstore');
const thunkify = require('thunkify');
const repos = Symbol('repos');
const eventbus = Symbol('eventbus');
const Alias = require('./alias');
const subScribeSystem = Symbol('subScribeSystem');
const isGenerator = require("is-generator");
const AbstractActor = require("./AbstractActor");
const DomainEventSubsubScribeSystem = require("./DomainEventSubscribeSystem");
const es = Symbol('es');
const uncommittedEvents = Symbol.for('uncommittedEvents');
const Actors = Symbol('Actors');
const loadEvents = Symbol.for('loadEvents');
const History = require('./History');

class Domain {

    /**
     *
     * @param opts {EventStore,subscribeDB}
     * @returns {Promise|*}
     */
    constructor(opts) {

        opts = opts || {};

        let that = this;

        if (opts.EventStore) {
            this[eventstore] = new opts.EventStore();
        } else {
            this[eventstore] = new EventStore();
        }

        if (opts.subscribeDB) {
            this[subScribeSystem] = new DomainEventSubsubScribeSystem(subScribeDB);
        } else {
            this[subScribeSystem] = new DomainEventSubsubScribeSystem();
        }


        this[es] = {
            getSnapshotByIndex: thunkify(this[eventstore].getSnapshotByIndex).bind(this[eventstore]),
            getEvents: thunkify(this[eventstore].getEvents).bind(this[eventstore]),
            getLatestEvent: thunkify(this[eventstore].getLatestEvent).bind(this[eventstore]),
            getLatestSnapshot: thunkify(this[eventstore].getLatestSnapshot).bind(this[eventstore])
        };

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
                        method: this.method,
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
        this[Actors] = {};

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

    register(ActorClass) {
        this[Actors][ActorClass.getType()] = ActorClass;
        this[repos][ActorClass.getType()] = new Repository(ActorClass, this[eventstore]);
        return this;
    }

    create(actorType, data, callback) {

        return new Promise((resolve, reject) => {
            callback = callback || function () {
            };
            let repo = this[repos][actorType];
            let Class = this[Actors][actorType];
            try {

                let create = () => {
                    repo.create(data, function (err, json) {
                        callback(err, json);
                        resolve(json);
                    });
                };


                if (Class.createBefor) {

                    const serv = Object.create(this[service]);
                    let result = Class.createBefor(data, serv);
                    if (result && isGenerator.fn(result)) {
                        co(function *() {
                            yield result();

                        }).then(function () {

                            create();
                        }).catch(function (e) {
                            callback(e);
                            reject(e);
                        });
                    } else {
                        create();
                    }

                } else {
                    create();
                }

            } catch (e) {
                callback(e);
                reject(e);
            }
        });


    }

    once(eventName, listener) {
        this[subScribeSystem].once(eventName, listener);
        return this;
    }

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

    * getHistory(id) {
        const snap = yield this[es].getSnapshotByIndex(id, 0);
        let ActorClass;
        if (snap && (ActorClass = this[Actors][snap.actorType])) {
            const events = yield this[es].getEvents(id);
            return new History(ActorClass, events, snap);
        } else {
            throw new Error(`actor's id=${id} no exist`);
        }
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

    get(actorType, actorId, cb) {
        this._get(actorType, actorId, function (err, actor) {
            if (actor) {
                cb(actor.json);
            } else {
                cb();
            }
        })
    }

    call(methodName, args, callback, sagaId) {

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
                        let Class = this[Actors][type];

                        let call = ()=> {
                            if (isGenerator.fn(actor[method])) {
                                co(function *() {
                                    yield actor[method](args, serv);
                                }).catch(function (err) {
                                    console.log(err.stack);
                                });
                            } else {
                                actor[method](args, serv);
                            }
                            resolve();
                            callback(null);
                        };

                        if (Class[method + 'Befor']) {

                            let result = Class[method + 'Befor'](args, serv);
                            if (result && isGenerator.fn(result)) {
                                co(function *() {
                                    yield result();

                                }).then(function () {

                                    call();
                                }).catch(function (e) {
                                    callback(e);
                                    reject(e);
                                });
                            } else {
                                call();
                            }

                        } else {
                            call();
                        }

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

    static get Alias() {
        return Alias;
    }

    static get Actor() {
        return Actor;
    }

    static get AbstractActor() {
        return AbstractActor;
    }
}


module.exports = Domain;
