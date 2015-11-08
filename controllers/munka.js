var express = require("express");
var router = express.Router();
var session = require("express-session");

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
        req.session.munkak = munkak;
        res.render('munkak/munkalista', {
            munkak : decorateMunkak(munkak),
            messages : req.flash('info'),
        });
    });
});


module.exports = router;
