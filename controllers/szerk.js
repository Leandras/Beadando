var express = require("express");
var router = express.Router();
var Waterline = require("waterline");
var session = require("express-session");
var hbs = require('hbs');



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


router.get('/szerkeszt', function(req, res) {
   req.app.models.munka.find().where({ user  :   req.session.user.azon }).then(function (munka) {
       if(munka.length == 0){
           req.flash('info', 'Még nem vett fel munkát.')
           res.redirect('../munkak/munkalista');
       }
       else{
            res.render('munkak_ado/szerkeszt', {
            munka : munka,
            messages : req.flash('info'),
            });
        }
            
        
        });
        
    });

router.post('/szerkeszt', function(req, res) {
  
    req.checkBody('varos', 'Hibás város').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('oraber').notEmpty().isInt().withMessage('Kötelező megadni!');
    req.checkBody('tipus').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    if(validationErrors){
        console.log("Validation error")
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/munkak_ado/szerkeszt');
    }else{
        req.app.models.munka.update({
            status  : 'free',
            varos   : req.app.models.munka.varos,
            leiras  : req.app.models.munka.leiras,
            tipus   : req.app.models.munka.tipus,
            oraber  : req.app.models.munka.oraber,
            },
            {
            status  : 'taken',
            varos   : req.body.varos,
            leiras  : req.body.leiras,
            tipus   : req.body.tipus,
            oraber  : req.body.oraber,
            }
        ).then(function (error, updated) {
            req.flash('info', 'Munka sikeresen módosítva!');
            res.redirect('/munkak/munkalista');
        })
        .catch(function (err, done) {
                return done(null, false, {
                    message :   err.details
                });
            })
    }
    
});

router.delete('/szerkeszt', function(req, res) {
    console.log("törlés")
})

//functions
function functionKEtto(id){
    console.log("Id test:" + id);
}


//handlebar saját
hbs.registerHelper('getId', function(obj) {
    console.log(obj.id)
})

module.exports = router;
