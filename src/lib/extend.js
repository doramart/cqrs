import Actor from './Actor.js';
import {inherits} from 'util';

export default function extend(options) {
    function ActorClass(data) {
        Actor.call(this, data);
    }

    inherits(ActorClass, Actor);
    for (let k in options) {
        if (k !== 'type')
            ActorClass.prototype[k] = options[k];
    }

    // extend static method
    ActorClass.type = options.type;
    ActorClass.toJSON = options.toJSON ||  Actor.toJSON;
    ActorClass.parse = options.parse || Actor.parse;
    return ActorClass;
}