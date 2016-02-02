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

Other document
==============

    TODO ......


LICENSE
=======
MIT