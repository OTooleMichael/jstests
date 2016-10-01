var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var client = require("./redis").client();
var app = express();
var cry = require("./crypt"),
    encrypt = cry.encrypt,
    decrypt = cry.decrypt;

app.use(cookieParser());
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(checkCookie);
var users = require("./users");

function checkCookie(req,res,next){
    if(req.url=="/login")return next();
    var cookie = req.cookies.session;
    users.findSessionFromCookie(cookie,function(err,session){
        if(err) return fail(err)
        if( new Date() - new Date(session.timestamp) > 25*60*60*1000) return fail("Cookie no longer valid");
        req.user = session;
        return next() 
    });
    function fail(reason){
        return res.render("login",{reason:reason});
    }
}


//IO set up and callback sending to BFO
app.get("/login",function(req,res){
    res.render("login",{reason:"please Log in"})
})
app.get("/proxies",function(req,res){
    res.render("proxies")
})
app.post("/login",function(req,res){
    var user = {
        id:req.body.user,
        user:req.body.user,
        pass:req.body.pass,
        ip:req.ip,
        agent:req.headers['user-agent']
    }
    users.loginUser(user,function(err,token){
        if(err) return res.render("login",{reason:err});
        var cookieString = encrypt(token.user)+"&"+encrypt(token.uuid);
        res.cookie('session',cookieString ,{ maxAge: 900000, httpOnly: true });
        res.redirect(req.body.redirect);
    });
});
app.get('/*', function(req, res) {
    var text = req.cookies;
    res.render("example",{user:req.user,cookies:text,uuid:req.user.uuid,name:req.user.id})
}); //end Bad Route



module.exports = app;





