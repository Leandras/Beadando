var express = require("express");
var router = express.Router();
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();
var qs = require('querystring');


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
        //req.session.munkak = munkak; //Szerk gomb mellé tenni
        res.render('munkak/munkalista', {
            munkak : decorateMunkak(munkak),
            messages : req.flash('info'),
        });
    });
});


router.post('/munkalista', function(req, res){
    var azon = qs.stringify(req.body).slice(0, 2);
    req.session.azon = azon;
    req.app.models.munka.find().where({azonosito : azon}).where({user : req.session.user.azon}).then(function(munka){
        if(munka.length > 0){
            res.redirect('../munkak_ado/szerkeszt')
        }else{
            messages : req.flash('info', 'Ezt a munkát Ön nem szerkesztheti.');
            res.redirect('munkalista');
        }
    });
  
});

router.post('/elfogad', function(req, res) {
    var azon = qs.stringify(req.body).slice(0, 2);
    
    req.app.models.munka.find().where({azonosito : azon}).then(function(munka){
        if(munka){
            if(!req.session.user.isMunkaado){
                if(munka[0].status == 'pending'){
                    messages : req.flash('info', 'Munkaadó jóváhagyására vár.')
                    res.redirect('/munkak/munkalista')
                
                }else if(munka[0].status == 'taken'){
                    messages : req.flash('info', 'Ezt a munkát már betöltötték.')
                    res.redirect('/munkak/munkalista')
                }else{
                    req.app.models.munka.find().where({azonosito : azon}).then(function(munka) {
                        req.app.models.munka.update(
                        {status: munka[0].status}, {status : 'pending'}
                        ).where({azonosito : azon}).exec(function utana(updated){
                            messages : req.flash('info', 'Sikeresen regisztrálta magát a munkára!')
                            res.redirect('/munkak/munkalista')
                        });
                        })
                    }
            }else if(req.session.user.isMunkaado && munka[0].status == 'pending'){
                if(munka[0].user == req.session.user.azon){
                req.session.azon = azon;
                res.redirect('/munkak_ado/jovahagy');
                }else{
                    messages : req.flash('info', 'Más által feladott munkáról nem dönthet.')
                    res.redirect('/munkak/munkalista')
                }
            }
            else{
            messages : req.flash('info', 'Munkaadó nem fogadhat el munkát.');
            res.redirect('/munkak//munkalista');
        }
        }
        
    });
});

router.post('/torol', function(req, res) {
    var azon = qs.stringify(req.body).slice(0, 2);
    req.session.azon = azon;
    req.app.models.munka.find().where({azonosito : azon}).where({user : req.session.user.azon}).then(function (munka){
        if(munka.length > 0){
            res.redirect('../munkak_ado/delete')
        }else{
            messages : req.flash('info', 'Ezt a munkát Ön nem törölheti.');
            res.redirect('munkalista');
        }
    })
})

module.exports = router;
