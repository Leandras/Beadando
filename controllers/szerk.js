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
        req.app.models.munka.find().where({user : req.session.user.azon}).then(function (munka){
            if(munka.length > 0){
                req.flash('info', 'Csak egy munkát vehet fel.');
                res.redirect('/munkak/munkalista');
            }else{
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
            })
    
    }
});


router.get('/szerkeszt', function(req, res) {
    console.log("User teszt: " + req.session.user.azon)
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
        //Innen kezdődik a próba kód
    });

router.post('/szerkeszt', function(req, res) {
  
    req.checkBody('varos', 'Hibás város').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('oraber').notEmpty().isInt().withMessage('Kötelező megadni!');
    req.checkBody('tipus').notEmpty().withMessage('Kötelező megadni!');
    
    req.app.models.munka.find().where({user : req.session.user.azon}).then(function(munka){
        for(var i = 0; i < munka.length; ++i){
            console.log("Városok: " + munka[i])
            console.log("Munkák száma: " + munka.length)
        req.app.models.munka.update(
            {varos : munka[i].varos},{ varos : req.body.varos}
            ).exec(function utana(updated){
                
            });
        }
         console.log("updated")
         res.redirect('../munkak/munkalista');
    });   

     
 
       
    //}
    
    
});

router.get('/delete', function(req, res) {
      req.app.models.munka.destroy({user : req.session.user.azon}).exec(function deleteCB(err){
          if(err){
            
              res.redirect('../munkak/munkalista');
          }else{
            
            req.flash('info', 'A munkák törölve lettek.')
            res.redirect('../munkak/munkalista')
        }
     
    });
});
//handbar helpers

function blabla(req, res){
    hbs.reggisterHelper('leptet', function(){
    res.redirect('../munkak_ado/szerkeszt')
})
}


module.exports = router;
