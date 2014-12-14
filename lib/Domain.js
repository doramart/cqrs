var EventStore = require("eventstore"),
    Repository = require("./Repository"),
    co = require("co"),
    Actor = require("./Actor"),
    eventstore = Symbol("eventstore"),
    ActorListener = require("./ActorListener"),
    EventBus = require("./EventBus");


class Domain {

    constructor(options) {
        this[eventstore] = EventStore(options);
        this.ActorClasses = {};
        this.repos = {};
        this.eventBus = new EventBus(this[eventstore]);

        var self = this;
        co(function*() {

            self.register(ActorListener);
            var repo = self.repos["ActorListener"];
            var actorListener = yield repo.get("ActorListenerId");
            if (!actorListener) {
                actorListener = yield repo.create();
            }
            self.actorListener = actorListener;
            actorListener.actorRepos = self.repos;

            self.eventBus.on("*", function (evt) {

                if (evt.targetType === "ActorListener") return;

                actorListener.pub({eventName: evt.targetType + "." + evt.targetId + ":" + evt.name, event: evt});
                actorListener.pub({eventName: evt.targetType + "." + evt.targetId, event: evt});
                actorListener.pub({eventName: evt.targetType + ":" + evt.name, event: evt});
                actorListener.pub({eventName: "." + evt.targetId + ":" + evt.name, event: evt});
                actorListener.pub({eventName: ":" + evt.name, event: evt});
                actorListener.pub({eventName: evt.targetType, event: evt});

                if (evt.contextId) {
                    actorListener.pub({
                        eventName: evt.targetType + "." + evt.targetId + "&" + evt.contextId,
                        event: evt
                    });
                    actorListener.pub({eventName: evt.targetType + ":" + evt.name + "&" + evt.contextId, event: evt});
                    actorListener.pub({
                        eventName: "." + evt.targetId + ":" + evt.name + "&" + evt.contextId,
                        event: evt
                    });
                    actorListener.pub({eventName: ":" + evt.name + "&" + evt.contextId, event: evt});
                    actorListener.pub({eventName: evt.targetType + "&" + evt.contextId, event: evt});
                }
            })
        })();

        this[eventstore].init();
    }

    register(ActorClass) {

        var self = this;

        if (typeof ActorClass !== "function") {
            ActorClass = Actor.extend(arguments[0], arguments[1]);
        }

        if (!ActorClass.prototype.myDomain) {
            Object.defineProperty(ActorClass.prototype, "myDomain", {
                get() {
                    return self;
                }
            });
        }

        this.ActorClasses[ActorClass.type] = ActorClass;

        var repo = new Repository(ActorClass, this[eventstore]);
        this.repos[ActorClass.type] = repo;

        this._actorEventHandle(repo);

        return this;
    }

    _actorEventHandle(repo) {

        var self = this;

        function actorApplyEventHandle(actor) {
            self.eventBus.publish(actor);
        }

        function actorListenEventHandle(eventName, handle, contextId) {
            self.actorListener.listen({eventName, actor: this, handle, contextId});
        }

        // listen actor
        let listenActorEventHandle = actor=> {

            actor.on("apply", actorApplyEventHandle);
            actor.on("listen", actorListenEventHandle);
            if (actor.uncommittedEvents.length) {
                this.eventBus.publish(actor);
            }
        }

        repo.on("create", listenActorEventHandle);

    }

    create(actorType, data, callback) {
        callback = callback || function () {
        };
        var eventBus = this.eventBus;
        var repo = this.repos[actorType];
        co(function *() {
            try {
                var actor = yield repo.create(data);
                // doto
                eventBus._publish({
                    targetType: actor.type,
                    targetId: actor.id,
                    name: "create"
                });

                callback(null, actor.id);

            } catch (e) {
                callback(e);

            }
        })()

    }

    get(actorType, actorId, cb) {
        var self = this;
        co(function* () {
            try {
                var repo = self.repos[actorType];
                var actor = yield repo.get(actorId);
                cb(null, actor);
            } catch (e) {
                cb(e);
            }
        })()
    }

    addListener(eventName, listener) {
        this.eventBus.on(eventName, listener);
    }

    getHistory(...opts) {
        this[eventstore].getEvents(...opts);
    }

}

module.exports = Domain;
