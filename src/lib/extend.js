import Actor from './Actor.js';
import {inherits} from 'util';

export default function extend(options) {
    function ActorClass(data) {
        data = data || {};
        if (options.init) {
            options.init.call(this, data);
        }
        Actor.call(this, data);
    }

    inherits(ActorClass, Actor);
    for (let k in options) {
        if (k !== 'type' && k !== 'init')
            ActorClass.prototype[k] = options[k];
    }

    // extend static method
    ActorClass.type = options.type;
    ActorClass.toJSON = options.toJSON || Actor.toJSON;
    ActorClass.parse = options.parse || Actor.parse;
    return ActorClass;
}