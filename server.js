var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");


//ORM modul
var Waterline = require("waterline");
var waterlineConfig = require("./config/waterline")

//ORM
var orm = new Waterline();
var munkaCollection = require("./models/munka");
var userCollection = require("./models/user");
orm.loadCollection(Waterline.Collection.extend(munkaCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));

//Controllerek
var munkakController = require("./controllers/munka");
var indexController = require("./controllers/index");
var loginController = require("./controllers/login");
var szerkController = require("./controllers/szerk");
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',  //Ez "védi" a session
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize()); 
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done){
    done(null, obj);
});

var LocalStrategy = require('passport-local').Strategy;


//Munka vállaló regisztráció
passport.use('local-signupemp', new LocalStrategy({
    usernameField   :   'azon',
    passwordField   :   'password',
    passReqToCallback:  true,
    },
    function(req, azon, password, done){
        req.app.models.user.findOne({azon   :   azon}, function(err, user) {
            if(err){
                return done(err);
            }
            if(user){
                return done(null, false, { message  :   'A felhasználó név már létezik!'});
            }
            req.app.models.user.create(req.body).then(function(user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, {
                    message :   err.details
                });
            })
        });
    }
));


//Munka adó regisztráció
passport.use('local-signup', new LocalStrategy({
    usernameField   :   'azon',
    passwordField   :   'password',
    passReqToCallback:  true,
    },
    function(req, azon, password, done){
        req.app.models.user.findOne({azon   :   azon}, function(err, user) {
            if(err){
                return done(err);
            }
            if(user){
                return done(null, false, { message  :   'A felhasználó név már létezik!'});
            }
            req.app.models.user.create({
                azon    :   req.body.azon,
                password:   req.body.password,
                vezeteknev: req.body.vezeteknev,
                keresztnev: req.body.keresztnev,
                engedely  : 'munkaado',
                isMunkaado: 'true',
                }).then(function(user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, {
                    message :   err.details
                });
            })
        });
    }
));

//User Stratégia
passport.use('local', new LocalStrategy({ 
        usernameField: 'azon',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, azon, password, done) {
        req.app.models.user.findOne({ azon : azon }, function(err, user) {
            if (err) { 
                return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Hibás adatokat adott meg!' });
            }
            req.session.user = user;
            return done(null, user);
        });
    }
));

//Jelenlegi felhasználó lekérdezése
function getCurrentUser(req, res){
    res.send(req.user.azon);
}

function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}

app.use(setLocalsForLayout());
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        return next(); }
    res.redirect('/login');
}

function andRestrictTo(engedely) {
    return function(req, res, next) {
        if (req.user.engedely == engedely) {
            return next();
        } else {
           res.redirect('/munkak/munkalista');
        }
    }
}


//endpoints
app.use('/', indexController);
app.use('/munkak',ensureAuthenticated, munkakController);
app.use('/login', loginController);
app.use('/munkak_ado',andRestrictTo('munkaado'), szerkController);


app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


//ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;         
    
    app.models = models.collections;
    //app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});




