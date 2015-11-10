var express = require("express");
var router = express.Router();
var Waterline = require("waterline");
var session = require("express-session");
var qs = require('querystring');

//Munka felvétele
router.get('/felvesz', function(req, res) {
  //  console.log("User felvesztbe: " + req.session.user.azon) //ÍGY MŰKÖDIK
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
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/munkak_ado/felvesz');
    }
    
    else {
        req.app.models.munka.find().where({user : req.session.user.azon}).then(function (munka){
            if(munka.length > 0){
                req.flash('info', 'Csak egy munkát vehet fel.')
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
    var azon = qs.stringify(req.body).slice(0, 2);
    req.checkBody('varos', 'Hibás város').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('oraber').notEmpty().isInt().withMessage('Kötelező megadni!');
    req.checkBody('tipus').notEmpty().withMessage('Kötelező megadni!');
    
     var azon = qs.stringify(req.body).slice(0, 2);
    
    //2. megoldás, működik de több munkát módosít egyszerre
   
    req.app.models.munka.find().where({azonosito : azon}).then(function(munka) {
        if(munka){
            if(req.body.tipus){
                req.app.models.munka.update(
                    {tipus : munka[0].tipus}, {tipus : req.body.tipus}
            ).exec(function utana(updated){
            });};
            if(req.body.leiras){
                req.app.models.munka.update(
                    {leiras : munka[0].leiras}, {leiras : req.body.leiras}
            ).exec(function utana(updated){
            });};
            if(req.body.oraber){
                req.app.models.munka.update(
                    {oraber : munka[0].oraber}, {oraber : req.body.oraber}
            ).exec(function utana(updated){
            });};
            if(req.body.varos){
                req.app.models.munka.update(
                    {varos : munka[0].varos}, {varos    :   req.body.varos}
            ).exec(function utana(updated){
            });
            }
        }
        res.redirect('../munkak/munkalista')
        });
   
});

router.get('/delete', function(req, res) {
   req.app.models.munka.destroy({user : req.session.user.azon}).exec(function(munka) {
          if(munka){
              res.redirect('../munkak/munkalista');
          }else{
            req.flash('info', 'A munkák törölve lettek.')
            res.redirect('../munkak/munkalista')
        }
    });
});


module.exports = router;