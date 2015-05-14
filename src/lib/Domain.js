import EventStore from 'eventstore';
import _Repository from './Repository';
import co from 'co';
import Q from 'q';
import Actor from './Actor';
import DomainEvent from './DomainEvent';
import _ActorListener from './ActorListener';
import _EventBus from './EventBus';


/**
 * @class Domain
 * @see EventBus
 * @see ActorListener
 * @param eventStoreOptions {object}
 * @param replaceClasses {object} replace default {EventBus | ActorListener | Repository}
 */
export default
class Domain {

    constructor(eventStoreOptions, replaceClasses = {}) {
        // replace default EventBus class
        let EventBus = replaceClasses.EventBus || _EventBus;

        // replace default ActorListener class
        let ActorListener = replaceClasses.ActorListener || _ActorListener;

        // replace default Repository class
        this.__Repository = replaceClasses.Repository || _Repository;

        /**
         *
         * @memberof Domain.prototype
         * @member __eventstore
         * @type {*|Eventstore|exports}
         * @private
         */
        this.__eventstore = EventStore(eventStoreOptions);

        /**
         * @memberof Domain.prototype
         * @member __repos
         * @type {{Repository}}
         * @private
         */
        this.__repos = {};

        /**
         * @memberof Domain.prototype
         * @member __eventBus
         * @type {EventBus}
         * @private
         */
        this.__eventBus = new EventBus(this.__eventstore);

        // init eventstore
        this.__eventstore.init(() => {

            var self = this;

            co(function* () {

                self.register(ActorListener);
                var repo = self.__repos['ActorListener'];
                var actorListener = yield repo.get('ActorListenerId');

                if (!actorListener) {
                    actorListener = yield repo.create();
                }

                actorListener.myDomain = self;

                /**
                 * @memberof Domain.prototype
                 * @member __actorListener
                 * @type {ActorListener}
                 * @private
                 */

                self.__actorListener = actorListener;
                self.__eventBus.on('*', function (evt) {

                    if (evt.actorType === 'ActorListener') return;

                    actorListener.pub({eventName: evt.actorType + '.' + evt.actorId + ':' + evt.name, event: evt});
                    actorListener.pub({eventName: evt.actorType + '.' + evt.actorId, event: evt});
                    actorListener.pub({eventName: evt.actorType + ':' + evt.name, event: evt});
                    actorListener.pub({eventName: '.' + evt.actorId + ':' + evt.name, event: evt});
                    actorListener.pub({eventName: ':' + evt.name, event: evt});
                    actorListener.pub({eventName: evt.actorType, event: evt});

                    if (evt.contextId) {
                        actorListener.pub({
                            eventName: evt.actorType + '.' + evt.actorId + ':' + evt.name + '&' + evt.contextId,
                            event: evt
                        });

                        actorListener.pub({
                            eventName: evt.actorType + '.' + evt.actorId + '&' + evt.contextId,
                            event: evt
                        });
                        actorListener.pub({
                            eventName: evt.actorType + ':' + evt.name + '&' + evt.contextId,
                            event: evt
                        });
                        actorListener.pub({
                            eventName: '.' + evt.actorId + ':' + evt.name + '&' + evt.contextId,
                            event: evt
                        });
                        actorListener.pub({eventName: ':' + evt.name + '&' + evt.contextId, event: evt});
                        actorListener.pub({eventName: evt.actorType + '&' + evt.contextId, event: evt});
                    }
                })
            });
        });
    }

    /**
     * @memberof Domain.prototype
     * @method register
     * @param ActorClass {Actor}
     * @returns {Domain}
     */
    register(ActorClass) {

        var repo = new this.__Repository(ActorClass, this.__eventstore);
        this.__repos[ActorClass.type] = repo;

        this.__actorEventHandle(repo);

        return this;
    }

    __actorEventHandle(repo) {

        var self = this;

        function actorApplyEventHandle(actor) {
            if (actor.$$uncommittedEvents[0].name === 'remove') {
                self.__repos[actor.type].clear(actor.id);
            }
            self.__eventBus.publish(actor);
        }

        function actorListenEventHandle(eventName, handle) {
            self.__actorListener.listen(eventName, this, handle);
        }

        function actorListenOneEventHandle(eventName, handle) {
            self.__actorListener.listen(eventName, this, handle, true);
        }

        // listen actor
        let listenActorEventHandle = actor=> {
            actor.on('apply', actorApplyEventHandle);
            actor.on('listen', actorListenEventHandle);
            actor.on('listenOne', actorListenOneEventHandle);
            if (actor.$$uncommittedEvents.length) {
                this.__eventBus.publish(actor);
            }
        };

        repo.on('create', listenActorEventHandle);

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
        var eventBus = this.__eventBus;
        var repo = this.__repos[actorType];
        co(function *() {
            try {
                var actor = yield repo.create(data);
                // doto
                eventBus.__publish(new DomainEvent('create', actor, actor.constructor.toJSON(actor)));
                callback(null, actor.id);
                process.nextTick(function () {
                    repo.emit('create', actor);
                });

            } catch (e) {
                callback(e);
            }
        });
    }

    /**
     * get a actor
     * @method get
     * @param actorType {String}
     * @param actorId {String}
     * @param cb {Function}
     * @returns {Promise}
     */
    get(actorType, actorId, cb) {
        var self = this;
        var defer = Q.defer();
        co(function* () {
            var repo = self.__repos[actorType];
            var actor = yield repo.get(actorId);
            if (actor) {
                actor.myDomain = self;
            }
            defer.resolve(actor);

            if (cb) {
                cb(null, actor);
            }
        });
        return defer.promise;
    }

    /**
     * once listen domain'event.
     * @method once
     * @memberof Domain.prototype
     * @param eventName
     * @param listener
     */
    once(eventName, listener) {
        this.__eventBus.once(eventName, listener);
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
        this.__eventBus.on(eventName, listener);
        return this;
    }

    /**
     * @method getEvents
     * @memberof Domain.prototype
     * @param opts
     */
    getEvents(...opts) {
        this.__eventstore.getEvents(...opts);
    }


}

