var expect = require("chai").expect;
var bcrypt = require("bcryptjs");

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('../models/user');
var munkaCollection = require('../models/munka');

var User;
function getUserData() {
    return {
        azon: 'mfelhnev',
        password: 'jelszo',
        vezeteknev: 'Gipsz',
        keresztnev: 'Jakab',
        isMunkaado: false,
        engedely: 'munkavallalo',
    };
}
before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(munkaCollection));
    waterlineConfig.connections.default.adapter = 'memory'; //Ha vége a tesztelésnek, nem marad benne szemét

    //waterline inicializálása userre
    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {
    //memóriában lévő userek kitakarítása
        beforeEach(function (done) {
            User.destroy({}, function (err) {
                if(err){
                    console.log(err)
                }
                done();
            });
        });
        
        it('should work', function () {
            expect(true).to.be.true;
        });
        
         it('should be able to create a munkaado', function () {
        return User.create({
                azon: 'mfelhnev',
                password: 'jelszo',
                vezeteknev: 'Gipsz',
                keresztnev: 'Jakab',
                ceg : 'Pfizer',
                varos: 'Pécs',
                isMunkaado : true,
                engedely : 'munkaado',
        })
        .then(function (user) {
            expect(user.azon).to.equal('mfelhnev');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.vezeteknev).to.equal('Gipsz');
            expect(user.keresztnev).to.equal('Jakab');
            expect(user.isMunkaado).to.be.true;
            expect(user.engedely).to.equal('munkaado');
        });
    });    
     it('should be able to create a munkavallalo', function () {
        return User.create({
                azon: 'mfelhnev',
                password: 'jelszo',
                vezeteknev: 'Gipsz',
                keresztnev: 'Jakab',
        })
        .then(function (user) {
            expect(user.azon).to.equal('mfelhnev');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.vezeteknev).to.equal('Gipsz');
            expect(user.keresztnev).to.equal('Jakab');
            expect(user.isMunkaado).to.be.false;
            expect(user.engedely).to.equal('munkavallalo');
        });
    });    
    
    
    it('should be able to find a munkaado', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByAzon(user.azon);
        })
        .then(function (user) {
            expect(user.azon).to.equal('mfelhnev');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.vezeteknev).to.equal('Gipsz');
            expect(user.keresztnev).to.equal('Jakab');
        });
    });
     it('should be able to find a munkavallalo', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByAzon(user.azon);
        })
        .then(function (user) {
            expect(user.azon).to.equal('mfelhnev');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.vezeteknev).to.equal('Gipsz');
            expect(user.keresztnev).to.equal('Jakab');
        });
    });
        [
        {name: 'vezeteknev', value: ''},
        {name: 'keresztnev', value: ''},
        {name: 'azon', value: ''},
        {name: 'password', value: ''},
        {name: 'engedely', value: ''},
    ].forEach(function (attr) {
        it('should throw error for invalid data: ' + attr.name, function () {
            var userData = getUserData();
    
            userData[attr.name] = attr.value;
            
            expect(User.create(userData)).to.throw;
        });    
    });
    
    describe('#validPassword', function() {
    it('should return true with right password', function() {
         return User.create(getUserData()).then(function(user) {
             expect(user.validPassword('jelszo')).to.be.true;
         })
    });
    it('should return false with wrong password', function() {
         return User.create(getUserData()).then(function(user) {
             expect(user.validPassword('titkos')).to.be.false;
         })
    });
});

});

