var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('login', {
        errorMessages : req.flash('error')
    });
});

router.post('/', passport.authenticate('local', {
    successRedirect :   '/munkak/munkalista',
    failureRedirect :   '/login',
    failureFlash    :   true,
    badRequestMessage:  'Hibás adatok' //nem írja ki...
    
}));

router.get('/signupemp', function (req, res) {
    res.render('login/signupemp', {
        errorMessages: req.flash('error')
    });
});

router.post('/signupemp', passport.authenticate('local-signupemp', {
    successRedirect:    '/login',
    failureRedirect:    '/login/signupemp',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'
}));


router.get('/signup', function(req, res) {
    res.render('login/signup', {
        errorMessages : req.flash('error')
    });
});

router.post('/signup', passport.authenticate('local-signup', {
    status          :   'munkaado',
    successRedirect :   '/login',
    failureRedirect :   '/login/signup',
    failureFlash    :   true,
    badRequestMessage:  'Hiányzó adatok'
}));


module.exports = router;