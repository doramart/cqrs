Version
=======

    1.0-pre

    node.js version > 4.0

DDD-CQRS-Actor framework for javascript.
========================================

    doc todo ...

Install
=======

    npm install cqrs --save

Test
====
    npm test


Create actor class
==================

    'use strict';

    const Actor = require('Domain').Actor;
    const uuid = require("uuid").v1;

    class User extends Actor {

        constructor(data) {
            super();
            this._name = data.name;
            this._age = data.age;
            this._isAlive = true;
            this._id = uuid();
        }

        static parse(json) {
            let user = new this(json);
            user._isAlive = json.isAlive;
            return user;
        }

        changeName(name) {
            this.apply('changeName', {name});
        }

        when(event) {

            switch (event.name) {
                case 'changeName':
                    this._name = event.data.name;
                    break;
            }

        }

        isAlive() {
            return this._isAlive;
        }

        get id() {
            return this._id;
        }

        static toJSON(actor) {
            return {
                id: actor._id,
                age:actor._age,
                name: actor._name,
                isAlive: actor._isAlive
            }
        }

    }


LICENSE
=======
MIT