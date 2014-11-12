var eventstore = require("eventstore"),
    Repository = require("./Repository"),
    co = require("co"),
    Actor = require("./Actor"),
    ActorListener = require("./ActorListener"),
    EventBus = require("./EventBus");


class Domain {

    constructor() {
        this.eventstore = eventstore();
        this.ActorClasses = {};
        this.repos = {};
        this.eventBus = new EventBus(this.eventstore, this.repos);
        this.eventstore.init();
        this.actorListener = new ActorListener(this.repos);
    }

    register(ActorClass) {

        var self = this;

        if (typeof ActorClass === "function") {
        } else {
            ActorClass = Actor.extend(ActorClass);
        }
        this.ActorClasses[ActorClass.typeName] = ActorClass;

        var repo = new Repository(ActorClass, this.eventstore);
        this.repos[ActorClass.typeName] = repo;

        this._actorEventHandle(repo);

        return this;
    }

    _actorEventHandle(repo) {

        var self = this;

        function actorApplyEventHandle(actor) {
            self.eventBus.publish(actor);
        }

        function actorListenEventHandle(...opt) {
            self.actorListener.listen(...opt);
        }

        function actorCallEventHandle(actorId, commandName, data, caller, contextId) {
            co(function* () {
                var actor = yield repo.get(actorId);
                if (actor) {
                    actor.call(commandName, data, caller, contextId);
                }
            })();
        }

        // listen actor
        let listenActorEventHandle = actor=> {

            actor.on("apply", actorApplyEventHandle);
            actor.on("listen", actorListenEventHandle);
            actor.on("call", actorCallEventHandle);

            if (actor.uncommittedEvents.length) {
                this.eventBus.publish(actor);
            }
        }

        repo.on("create", listenActorEventHandle);

        repo.on("reborn", listenActorEventHandle);
    }

    call(command, callback) {

        var self = this;
        co(function *() {
            try {
                var repo = self.repos[command.typeName];
                if(!repo){
                    throw new Error("please register "+command.typeName);
                }
                var actor = yield repo.get(command.actorId);
                if(!actor){
                    throw new Error("no find by id = "+command.actorId);
                }
                actor.call(command.methodName, command.data || {}, {}, command.contextId);
                callback();
            } catch (err) {
                callback(err);
            }
        })()
    }

    create(actorType, data, callback) {
        var repo = this.repos[actorType];
        co(function *() {
            try {
                var actor = yield repo.create(data);
                callback(null, actor.id);

            } catch (e) {
                callback(e);

            }
        })()

    }

    get(actorType, actorId, cb) {
        var self = this;
        co(function* () {
            var repo = self.repos[actorType];
            var actor = yield repo.get(actorId);
            cb(actor);
        })()
    }

    addListener(eventName, listener) {
        this.eventBus.on(eventName, listener);
    }

}

module.exports = Domain;
