'use strict';

const should = require('should');
const Alias  =require('../lib/alias');

describe('alias', function () {

    it('index', function () {
        let alias = Alias();
        alias.name('change').actorType('User').get().should.eql('User..change...');
    });
});

