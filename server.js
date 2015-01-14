
  /**
   * Module dependencies.
   */

  var express = require('express')
    , routes = require('./routes')
      , http = require('http');
      //  , user = require("user")
      //. message = require("message");

  var fs = require('fs');
  var app = express();
  var chatbot= require ('./turing')

  app.configure(function(){
    app.set('port', process.env.PORT || 3003);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public/'));
  });
  

  app.configure('development', function(){
    app.use(express.errorHandler());
  }); 
  app.get('/reward',  function(req, res, next){
       chatbot.reward();
       res.send();
      });
  
  app.get('/discard',  function(req, res, next){
      chatbot.discard();
       res.send();
      });;
  
  app.get('/talk/:body',  function(req, res, next){
  	//res.send(addHeader()+output +addButtons());
    input=req.params.body;
    var mrefss=chatbot.talk(input);
    console.log("REPLY",mrefss);
  	res.send(mrefss);
  });;
  app.get('/history',  function(req, res, next){
  	res.send(JSON.stringify(chatbot.history));
  });;
  app.get('/all',function (req,res,next){
    res.send(JSON.stringify(chatbot.all));
  });

  app.get('/contexts',function (req, res, next){
    res.send(JSON.stringify(chatbot.contexts));
  });

  app.get('/train/:input/:expectedOutput',function (req, res, next){
    res.send(JSON.stringify(chatbot.train(req.params.input,req.params.expectedOutput)));
  });
  app.get('/trainRepeat',function (req, res, next){
    trainingSession=[];
    for(var i=0;i<3;i++){
      trainingSession.push(chatbot.train(i.toString(),i.toString()));
    }
    res.send(JSON.stringify(trainingSession));
  });
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

