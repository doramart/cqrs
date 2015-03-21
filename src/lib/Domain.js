var EventStore = require("eventstore"),
    Repository = require("./Repository"),
    co = require("co"),
    Q = require("q"),
    Actor = require("./Actor"),
    DomainEvent = require("./DomainEvent"),
    ActorListener = require("./ActorListener"),
    EventBus = require("./EventBus");

/**
 * @class Domain
 * @param options {json}
 * @param EventBus {EventBus}
 * @param ActorListener {ActorListener}
 */
export default
class Domain {

    constructor(options) {

        /**
         *
         * @memberof Domain.prototype
         * @member __eventstore
         * @type {*|Eventstore|exports}
         * @private
         */
        this.__eventstore = EventStore(options);

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

                var repo = self.__repos["ActorListener"];

                var actorListener = yield repo.get("ActorListenerId");

                if (!actorListener) {
                    actorListener = yield repo.create();
                }

                /**
                 * @memberof Domain.prototype
                 * @member __actorListener
                 * @type {ActorListener}
                 * @private
                 */
                self.__actorListener = actorListener;

                self.__eventBus.on("*", function (evt) {

                    if (evt.actorType === "ActorListener") return;

                    actorListener.pub({eventName: evt.actorType + "." + evt.actorId + ":" + evt.name, event: evt});
                    actorListener.pub({eventName: evt.actorType + "." + evt.actorId, event: evt});
                    actorListener.pub({eventName: evt.actorType + ":" + evt.name, event: evt});
                    actorListener.pub({eventName: "." + evt.actorId + ":" + evt.name, event: evt});
                    actorListener.pub({eventName: ":" + evt.name, event: evt});
                    actorListener.pub({eventName: evt.actorType, event: evt});

                    if (evt.contextId) {
                        actorListener.pub({
                            eventName: evt.actorType + "." + evt.actorId + "&" + evt.contextId,
                            event: evt
                        });
                        actorListener.pub({
                            eventName: evt.actorType + ":" + evt.name + "&" + evt.contextId,
                            event: evt
                        });
                        actorListener.pub({
                            eventName: "." + evt.actorId + ":" + evt.name + "&" + evt.contextId,
                            event: evt
                        });
                        actorListener.pub({eventName: ":" + evt.name + "&" + evt.contextId, event: evt});
                        actorListener.pub({eventName: evt.actorType + "&" + evt.contextId, event: evt});
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

        ActorClass.prototype.myDomain = this;

        var repo = new Repository(ActorClass, this.__eventstore);

        this.__repos[ActorClass.type] = repo;

        this.__actorEventHandle(repo);

        return this;
    }

    __actorEventHandle(repo) {

        var self = this;

        function actorApplyEventHandle(actor) {
            if (actor.$$uncommittedEvents[0].name === "remove") {
                self.__repos[actor.type].clear(actor.id);
            }
            self.__eventBus.publish(actor);
        }

        function actorListenEventHandle(eventName, handle, contextId) {
            self.__actorListener.listen({eventName, actor: this, handle, contextId});
        }

        // listen actor
        let listenActorEventHandle = actor=> {
            actor.on("apply", actorApplyEventHandle);
            actor.on("listen", actorListenEventHandle);
            if (actor.$$uncommittedEvents.length) {
                this.__eventBus.publish(actor);
            }
        };

        repo.on("create", listenActorEventHandle);

    }

    /**
     * create a actor object.
     * @method create
     * @param actorType {String}  actor's type.
     * @param data {json}
     * @param callback {Function}
     */
    create(actorType, data, callback) {
        callback = callback || function () {};
        var eventBus = this.__eventBus;
        var repo = this.__repos[actorType];
        co(function *() {
            try {
                var actor = yield repo.create(data);
                // doto
                eventBus.__publish(new DomainEvent("create", actor, actor.constructor.toJSON(actor)));
                callback(null, actor.id);
                process.nextTick(function () {
                    repo.emit("create", actor);
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
        var defer = Q.defer();
        var self = this;
        co(function* () {
            try {
                var repo = self.__repos[actorType];
                var actor = yield repo.get(actorId);
                defer.resolve(actor);
            } catch (e) {
                defer.reject(e);
                if (cb) {
                    cb(e);
                }
            }
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

