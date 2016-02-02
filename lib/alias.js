'use strict';

let props = Symbol('props');

module.exports = function () {
    return {
        [props]: new Map(),
        name(name){
            this[props].set('name', name);
            return this;
        },
        actorType(type){
            this[props].set('type', type);
            return this;
        },
        actorId(id){
            this[props].set('id', id);
            return this;
        },
        sagaId(id){
            this[props].set('sagaId', id);
            return this;
        },
        contextId(id){
            this[props].set('contextId', id);
            return this;
        },
        method(method){
            this[props].set('method', method);
            return this;
        },
        get(){
            return `${this[props].get('type') || ''}.${this[props].get('id') || ''}.${this[props].get('name') || ''}.${this[props].get('sagaId') || ''}.${this[props].get('contextId') || ''}.${this[props].get('method') || ''}`;
        }
    }
};