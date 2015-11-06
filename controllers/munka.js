var express = require("express");
var router = express.Router();
var passport = require("passport");

//ViewModel
var statusText = {
    'free' : 'Betöltetlen',
    'taken' : 'Betöltött',
    'pending' : 'Döntésre vár',
};

var statusClasses = {
  'free' : 'success',
  'taken' : 'danger',
  'pending' : 'info',
};


function decorateMunkak(munkaContainer){
    return munkaContainer.map(function (e) {
        e.statusText = statusText[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

//Munkák lista
router.get('/munkalista', function (req, res){
     req.app.models.munka.find().then(function (munkak) {
        console.log(munkak); //munkak kiirasa konzolra, törölhető
        res.render('munkak/munkalista', {
            munkak : decorateMunkak(munkak),
            messages : req.flash('info'),
        });
    });
});

//Munka felvétele
router.get('/felvesz', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = req.flash(data) || [{}].pop();
    
        res.render('munkak/felvesz', {
            validationErrors : validationErrors,
            data : data,
        });
});

router.post('/felvesz', function (req, res) {
    // adatok ellenőrzése
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
        res.redirect('/munkak/felvesz');
    }
    else {
        req.app.models.munka.create({
            status  : 'free',
            varos   : req.body.varos,
            leiras  : req.body.leiras,
            tipus   : req.body.tipus,
            oraber  : req.body.oraber,
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

module.exports = router;
