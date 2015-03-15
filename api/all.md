#Index

**Classes**

* [class: AbstractActor](#AbstractActor)
  * [new AbstractActor()](#new_AbstractActor)
  * [abstractActor.type](#AbstractActor#type)
  * [abstractActor.id](#AbstractActor#id)
  * [abstractActor.remove](#AbstractActor#remove)
  * [AbstractActor.type](#AbstractActor.type)
  * [abstractActor.$$uncommittedEvents](#AbstractActor#$$uncommittedEvents)
  * [abstractActor.$$loadEvents](#AbstractActor#$$loadEvents)
  * [abstractActor._when](#AbstractActor#_when)
  * [abstractActor._apply(name, data, contextId)](#AbstractActor#_apply)
  * [AbstractActor.parse()](#AbstractActor.parse)
  * [AbstractActor.toJSON()](#AbstractActor.toJSON)
  * [event: "apply"](#AbstractActor#event_apply)
  * [event: "remove"](#AbstractActor#event_remove)
* [class: Actor](#Actor)
  * [new Actor(data)](#new_Actor)
  * [actor.type](#Actor#type)
  * [actor._data](#Actor#_data)
  * [actor.data](#Actor#data)
  * [actor.id](#Actor#id)
  * [actor.remove](#Actor#remove)
  * [actor.$$uncommittedEvents](#Actor#$$uncommittedEvents)
  * [actor.$$loadEvents](#Actor#$$loadEvents)
  * [actor._when](#Actor#_when)
  * [actor.parse(json)](#Actor#parse)
  * [actor.toJSON(actor)](#Actor#toJSON)
  * [actor._apply(name, data, contextId)](#Actor#_apply)
  * [event: "apply"](#Actor#event_apply)
  * [event: "remove"](#Actor#event_remove)
* [class: ActorListener](#ActorListener)
* [class: DomainEvent](#DomainEvent)
  * [new DomainEvent(name, actor, data, [contextId])](#new_DomainEvent)
  * [domainEvent.id](#DomainEvent#id)
  * [domainEvent.data](#DomainEvent#data)
  * [domainEvent.name](#DomainEvent#name)
  * [domainEvent.contextId](#DomainEvent#contextId)
  * [domainEvent.date](#DomainEvent#date)

**Functions**

* [listen(command)](#listen)
 
<a name="AbstractActor"></a>
#class: AbstractActor
**Members**

* [class: AbstractActor](#AbstractActor)
  * [new AbstractActor()](#new_AbstractActor)
  * [abstractActor.type](#AbstractActor#type)
  * [abstractActor.id](#AbstractActor#id)
  * [abstractActor.remove](#AbstractActor#remove)
  * [AbstractActor.type](#AbstractActor.type)
  * [abstractActor.$$uncommittedEvents](#AbstractActor#$$uncommittedEvents)
  * [abstractActor.$$loadEvents](#AbstractActor#$$loadEvents)
  * [abstractActor._when](#AbstractActor#_when)
  * [abstractActor._apply(name, data, contextId)](#AbstractActor#_apply)
  * [AbstractActor.parse()](#AbstractActor.parse)
  * [AbstractActor.toJSON()](#AbstractActor.toJSON)
  * [event: "apply"](#AbstractActor#event_apply)
  * [event: "remove"](#AbstractActor#event_remove)

<a name="new_AbstractActor"></a>
##new AbstractActor()
A abstract actor class.

<a name="AbstractActor#type"></a>
##abstractActor.type
**Type**: `String`  
<a name="AbstractActor#id"></a>
##abstractActor.id
**Type**: `String`  
<a name="AbstractActor#remove"></a>
##abstractActor.remove
**Fires**

- [remove](#AbstractActor#event_remove)

<a name="AbstractActor.type"></a>
##AbstractActor.type
<a name="AbstractActor#$$uncommittedEvents"></a>
##abstractActor.$$uncommittedEvents
Only system calls.

uncommitted domain'events.

**Type**: `Array`  
<a name="AbstractActor#$$loadEvents"></a>
##abstractActor.$$loadEvents
Only system calls.

load domain'events.

**Params**

- events `Array`  

<a name="AbstractActor#_when"></a>
##abstractActor._when
Only system calls.
actor's data can only be changed by it.
it is a abstract method , need rewrite .

**Params**

- event <code>[DomainEvent](#DomainEvent)</code>  

**Access**: protected  
<a name="AbstractActor#_apply"></a>
##abstractActor._apply(name, data, contextId)
**Params**

- name `String` - event name  
- data `json` - event'data  
- contextId `String` - context's id  

**Fires**

- [apply](#AbstractActor#event_apply)

**Access**: protected  
<a name="AbstractActor.parse"></a>
##AbstractActor.parse()
parse json data to actor object.

<a name="AbstractActor.toJSON"></a>
##AbstractActor.toJSON()
parse actor object to json data.

<a name="AbstractActor#event_apply"></a>
##event: "apply"
apply event.

<a name="AbstractActor#event_remove"></a>
##event: "remove"
remove event

<a name="Actor"></a>
#class: Actor
**Extends**: `AbstractActor`  
**Members**

* [class: Actor](#Actor)
  * [new Actor(data)](#new_Actor)
  * [actor.type](#Actor#type)
  * [actor._data](#Actor#_data)
  * [actor.data](#Actor#data)
  * [actor.id](#Actor#id)
  * [actor.remove](#Actor#remove)
  * [actor.$$uncommittedEvents](#Actor#$$uncommittedEvents)
  * [actor.$$loadEvents](#Actor#$$loadEvents)
  * [actor._when](#Actor#_when)
  * [actor.parse(json)](#Actor#parse)
  * [actor.toJSON(actor)](#Actor#toJSON)
  * [actor._apply(name, data, contextId)](#Actor#_apply)
  * [event: "apply"](#Actor#event_apply)
  * [event: "remove"](#Actor#event_remove)

<a name="new_Actor"></a>
##new Actor(data)
**Params**

- data `Object`  

**Extends**: `AbstractActor`  
<a name="Actor#type"></a>
##actor.type
**Type**: `string`  
**Returns**: `string`  
<a name="Actor#_data"></a>
##actor._data
**Type**: `Object`  
**Access**: protected  
<a name="Actor#data"></a>
##actor.data
**Type**: `Object`  
**Read only**: true  
<a name="Actor#id"></a>
##actor.id
**Type**: `string`  
**Returns**: `string`  
<a name="Actor#remove"></a>
##actor.remove
**Fires**

- [remove](#AbstractActor#event_remove)

<a name="Actor#$$uncommittedEvents"></a>
##actor.$$uncommittedEvents
Only system calls.

uncommitted domain'events.

**Type**: `Array`  
<a name="Actor#$$loadEvents"></a>
##actor.$$loadEvents
Only system calls.

load domain'events.

**Params**

- events `Array`  

<a name="Actor#_when"></a>
##actor._when
Only system calls.
actor's data can only be changed by it.
it is a abstract method , need rewrite .

**Params**

- event <code>[DomainEvent](#DomainEvent)</code>  

**Access**: protected  
<a name="Actor#parse"></a>
##actor.parse(json)
**Params**

- json `object`  

<a name="Actor#toJSON"></a>
##actor.toJSON(actor)
**Params**

- actor   

**Returns**: `object`  
<a name="Actor#_apply"></a>
##actor._apply(name, data, contextId)
**Params**

- name `String` - event name  
- data `json` - event'data  
- contextId `String` - context's id  

**Fires**

- [apply](#AbstractActor#event_apply)

**Access**: protected  
<a name="Actor#event_apply"></a>
##event: "apply"
apply event.

<a name="Actor#event_remove"></a>
##event: "remove"
remove event

<a name="ActorListener"></a>
#class: ActorListener
**Members**

* [class: ActorListener](#ActorListener)

<a name="DomainEvent"></a>
#class: DomainEvent
**Members**

* [class: DomainEvent](#DomainEvent)
  * [new DomainEvent(name, actor, data, [contextId])](#new_DomainEvent)
  * [domainEvent.id](#DomainEvent#id)
  * [domainEvent.data](#DomainEvent#data)
  * [domainEvent.name](#DomainEvent#name)
  * [domainEvent.contextId](#DomainEvent#contextId)
  * [domainEvent.date](#DomainEvent#date)

<a name="new_DomainEvent"></a>
##new DomainEvent(name, actor, data, [contextId])
**Params**

- name `string` - event's name  
- actor <code>[Actor](#Actor)</code>  
- data `Object`  
- \[contextId\] `string` | `boolean` - if true auto generate a context'ID , or string ID.  

<a name="DomainEvent#id"></a>
##domainEvent.id
**Type**: `string`  
**Read only**: true  
<a name="DomainEvent#data"></a>
##domainEvent.data
**Type**: `*`  
**Read only**: true  
<a name="DomainEvent#name"></a>
##domainEvent.name
**Type**: `string`  
**Read only**: true  
<a name="DomainEvent#contextId"></a>
##domainEvent.contextId
**Type**: `string` | `boolean`  
**Read only**: true  
<a name="DomainEvent#date"></a>
##domainEvent.date
create time

**Type**: `number`  
**Read only**: true  
<a name="listen"></a>
#listen(command)
actor handle contextId

**Params**

- command   

