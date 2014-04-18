var crypto = require('crypto'),
    passport = require('passport'),
    data = require('../models/auth')();

exports.home = function(req, res){
    res.render('index', { title: 'Express' })
};

exports.login = function(req, res){
    passport.authenticate('local',
      {successRedirect: '/',
       failureRedirect: '/login',
       failureFlash: true });
}

exports.registerPage = function(req, res) {
    res.render('login/register');
}

exports.registerPost = function(req, res){
    var vpw = req.body.vpw;
    var pwu = req.body.pw;
    var un = req.body.un;


    if(vpw !== pwu) {
        console.log("Bad PW");
        res.redirect('/');
        return;
    }

    var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
//    var pw = crypto.createHmac('sha1', new_salt).update(pwu).digest('hex');
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    new data.ApiUser({email: un, password: vpw, salt: new_salt, created: created}).save().then(function(model) {
        console.log("Created User");
        passport.authenticate('local')(req, res, function () {
            console.log("Authenticated");
            res.redirect('/');
        })
    }, function(err) {
        console.log("Failed to create user");
        res.redirect('/login/register');
    });
}