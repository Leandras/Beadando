var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
    
    it('should see welcome page', function() {
        browser.assert.text('div.page-header > h1', 'Szabadúszó');
    });
});


describe('User visits new error page', function (argument) {

    var browser = new Browser(
    );
    
    before(function() {
        return browser.visit('/munkak_ado/felvesz');
       
    });
    
    it('should go to the authentication page', function () {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
    
    it('should be able to login with correct credentials', function (done) {
        browser
            .fill('azon', '2')
            .fill('password', '2')
            .pressButton('button[id=login]') //'button[type=submit]'
            .then(function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/munkak/munkalista' });
                done();
            });
    });
        
    it('should go the jobs page', function () {
        return browser.visit('/munkak_ado/felvesz')
        .then(function () {
            browser.assert.success();
            browser.assert.text('div.page-header > h1', 'Új munka felvétele');
        });
    });
    
    it('should show jobs if the form fields are not right', function () {
        return browser
            .fill('varos', '')
            .fill('tipus', '')
            .fill('leiras', '')
            .fill('oraber', '')
            .pressButton('button[type=submit]')
            .then(function() {
                // browser.assert.redirected();
                browser.assert.success();
                browser.assert.element('form .form-group:nth-child(1) [name=varos]');
                browser.assert.hasClass('form .form-group:nth-child(1)', 'has-error');
                browser.assert.element('form .form-group:nth-child(2) [name=tipus]');
                browser.assert.hasClass('form .form-group:nth-child(2)', 'has-error');
                browser.assert.element('form .form-group:nth-child(3) [name=leiras]');
                browser.assert.hasClass('form .form-group:nth-child(3)', 'has-error');
                browser.assert.element('form .form-group:nth-child(4) [name=oraber]');
                browser.assert.hasClass('form .form-group:nth-child(4)', 'has-error');
            });
    });

    
    
});