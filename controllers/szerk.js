var express = require("express");
var router = express.Router();
var Waterline = require("waterline");
var session = require("express-session");


//Munka felvétele
router.get('/felvesz', function(req, res) {
    console.log("User felvesztbe: " + req.session.user.azon) //ÍGY MŰKÖDIK
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = req.flash(data) || [{}].pop();
        res.render('munkak_ado/felvesz', {
            validationErrors : validationErrors,
            data : data,
        });
});

router.post('/felvesz', function (req, res) {
    //adatok ellenőrzése
    req.checkBody('varos', 'Hibás város').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('oraber').notEmpty().isInt().withMessage('Kötelező megadni!');
    req.checkBody('tipus').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/munkak_ado/felvesz');
    }
    else {
        req.app.models.munka.create({
            status  : 'free',
            varos   : req.body.varos,
            leiras  : req.body.leiras,
            tipus   : req.body.tipus,
            oraber  : req.body.oraber,
            user    : req.session.user.azon,
        })
        .then(function (error) {
            req.flash('info', 'Munka sikeresen felvéve!');
            res.redirect('/munkak/munkalista');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
});

//Szerkesztés

router.get('/szerkeszt', function(req, res) {
     req.app.models.munka.find().then(function (munkak) {
        //console.log(munkak); //munkak kiirasa konzolra, törölhető
        console.log("szerkeszt get");
        res.render('munkak_ado/szerkeszt', {
            munkak : munkak,
            messages : req.flash('info'),
        });
    });
});

router.post('/szerkeszt', function(req, res) {
    console.log("szerkeszt post");
    var validationErrors = req.validationErrors(true);
    if(validationErrors){
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/munkak_ado/felvesz');
    }else{
        delete req.app.models.munkak;
        res.redirect('/munkak/munkalista');    
    }
    
});



module.exports = router;
