Version
=======

    1.0.0-pre

    node.js version > 4.0

DDD-CQRS-Actor framework for javascript.
========================================

Actor is a aggregate root object.


Install
=======

    npm install cqrs --save

Test
====
    npm test


Create actor class
==================

    'use strict';

    const Actor = require('cqrs').Actor;

    class User extends Actor {

        constructor(data) {
            super(data);
        }

        // business method
        changeName(name,service) {
            if(name.length < 10 && name.length > 2){
               service.apply('changeName', {name});
            }else{
               throw new Error('name char size must < 10 and > 2');
            }
        }

        when(event) {

            switch (event.name) {
                case 'changeName':
                    this.data._name = event.data.name;
                    break;
            }

        }

    }


Create a domain
===============

const Domain = require('cqrs');
const domain = new Domain();

// register actor class
domain.register(User);


LICENSE
=======
MIT