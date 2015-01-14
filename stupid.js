//---------------- FIRST DRAFT -----------------//

 
  var exchanges=[];
  var functions=[];
  var rewardindex=0;
  var insContextIndex=0;
  var argContextIndex=0;
  var outContextIndex=0;
  var nextOutput;
  var all=[]; // (allElements)
  var contexts=[];
  var currentElements=[];
 
  var Context= function (){
      this.bottom=0;
      this.top=all.length;
  }
  var Element = function( text, fn){
      this.value=text;
      this.fn=fn;
      this.pause=false;
  } 
  var Exchange = function(input,output){
      this.input=input;
      this.output=output;
  }

  var init=function(){
  	contexts.push(new Context());
     //--------- PRINT ---------------     
    functions.push(function(){
          context=contexts[argContextIndex];
          element=all[context.bottom];
          if(element.fn>=0){
            return 1; //ERROR
          }
          nextOutput=element.value;
          return 0;
    });
    all.push(new Element("#print",0));

    //---------- PAUSE ---------------
    functions.push(function(){
      return 0;
    });
    pause=new Element("#pause",1);
    pause.pause=true;
    all.push(pause);

    //--------- INC CONTEXT ---------
    functions.push(function(){
        insContextIndex++;
        if(insContextIndex==contexts.length){
          contexts.push(new Context());
        }
        return 0;
    });
    all.push(new Element("#incInsContextIndex",2));

    functions.push(function(){
        outContextIndex++;
        if(outContextIndex==contexts.length){
          contexts.push(new Context());
        }
        return 0;
    });
    all.push(new Element("#incOutContextIndex",3));

    functions.push(function(){
        argContextIndex++;
        if(argContextIndex==contexts.length){
          contexts.push(new Context());
        }
        return 0;
    });
    all.push(new Element("#incArgContextIndex",4));

    //--------- DEC CONTEXT ---------
    functions.push(function(){
        if(insContextIndex==0){
          return 1; //ERROR
        }
        insContextIndex--;
        return 0;
    });
    all.push(new Element("#decInsContextIndex",5));

   functions.push(function(){
        if(outContextIndex==0){
          return 1; //ERROR
        }
        outContextIndex--;
        return 0;
    });
    all.push(new Element("#decOutContextIndex",6));

    functions.push(function(){
        if(argContextIndex==0){
          return 1; //ERROR
        }
        argContextIndex--;
        return 0;
    });
    all.push(new Element("#decArgContextIndex",7));

    //---------  FIND   -------------
    functions.push(function(){
        argContext=contexts[argContextIndex];
        valueContext=contexts[outContextIndex];
        value=all[valueContext.bottom].value;
        index=argContext.top;
        while(index>=argContext.bottom){
          if(all[index].value==value){
              valueContext.bottom=index;
              break;
          }
          index--;
        }
        return 0;
        //WE ONLY LOOK FOR ONE ELEMENT.
    });
    all.push(new Element("#findBefore",8));

    functions.push(function(){
        argContext=contexts[argContextIndex];
        valueContext=contexts[outContextIndex];
        value=all[valueContext.bottom].value;
        index=argContext.bottom;
        while(index<=argContext.top){
          if(all[index].value==value){
              valueContext.bottom=index;
              break;
          }
          index++;
        }
        return 0;
        //WE ONLY LOOK FOR ONE ELEMENT.
    });
    all.push(new Element("#findAfter",9));

    functions.push(function(){
       
        outContext=contexts[outContextIndex];
        outContext.bottom=all.length
        outContext.top=all.length;
        return 0;
        
    });
    all.push(new Element("#findEnd",10));

    //----------- RANDOM -------------
    functions.push(function(){
       
        outContext=contexts[outContextIndex];
        outContext.bottom=Math.floor(Math.random()*all.length);
        size=all.length-outContext.bottom;
        outContext.top=outContext.bottom + Math.floor(Math.random()*size);
        return 0;
        
    });
    all.push(new Element("#random",11));
   



    //--------- REWARD INDEX --------
  	rewardIndex=all.length;
  	
  }
  init();

  //concat
  //tokenise
  //save
  //load
  //script apprentissage accelere.


  
  var reply=function(msg){
      all.push(new Element(msg,-1));
      insContextIndex=0;
      context=contexts[insContextIndex];
      elementIndex=context.bottom;
      mprocess(elementIndex,insContextIndex);
  };

  var mprocess=function(elementIndex,oldInsContextIndex){
    error=0;
    currentElement=all[elementIndex];
    currentElements.push(currentElement);
    if(currentElement.fn>=0){
       console.log("execution "+currentElement.value);
  	   error=functions[currentElement.fn].call();
    }else{
      console.log("skipping value "+currentElement.value)
    }
    all.push(currentElement);
    if(insContextIndex!=oldInsContextIndex){
  	  elementIndex=contexts[insContextIndex].bottom;
    }else{
      //CHECK NOT THE END
      elementIndex++;
      if(elementIndex>all.length){
        error=999;
      }
    }
    if(!currentElement.pause&&error==0&&currentElements.length<10){
    //if(currentElements.length<10){
  	  mprocess(elementIndex,insContextIndex); 
    }else{
      console.log("pause="+currentElement.pause+" error ="+error+" reply size="+reply.length);
      currentElements.length=0;
    }
  };

  var reward=function(){
  	all=all.concat(all.slice(rewardIndex));
    rewardIndex=all.length;   
    exchange=new Exchange();
    exchange.reward=true;
    exchanges.push(exchange);
    console.log("#reward");
  };
 
  var discard=function(){
      //rewardIndex=all.length;
      contexts[0].bottom=Math.floor(Math.random()*all.length);
      size=all.length-contexts[0].bottom;
      contexts[0].top=contexts[0].bottom + Math.floor(Math.random()*size);
      exchange=new Exchange();
      exchange.discard=true;
      exchanges.push(exchange);
      console.log("#discard");
  };
  var trim=function(){
    all.length=rewardIndex;
    array=[];
    array=array.concat(all.slice(0,functions.length));
    array=shuffle(array);
    console.log(JSON.stringify(array));
    all=all.concat(array);
     contexts[0].bottom=Math.floor(Math.random()*all.length);
      size=all.length-contexts[0].bottom;
      contexts[0].top=contexts[0].bottom + Math.floor(Math.random()*size);
  
    exchange=new Exchange();
    exchange.trim=true;
    exchanges.push(exchange);
    insContextIndex=0;
    argContextIndex=0;
    outContextIndex=0;
    console.log("#trim");

  }
  var shuffle=function(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };
   
   var train=function(input,expectedOutput){
    success=0;
    successiveErrors=0;
    var training=new Object();
    training.input=input;
    training.expectedOutput=expectedOutput;
    for(var j=0;j<10;j++){
      output=talk(training.input);
      if(output===training.expectedOutput){
        reward();
        success++;
        successiveErrors=0;
      }else{
        successiveErrors++;
        if(successiveErrors==9){
            trim();
            successiveErrors=0;
        }
        if(successiveErrors==3||successiveErrors==6){
          discard();
        }
      }
    }
    training.success=success;
    return training;
  }
 
  var talk=function(input){
    
    reply(input);
    output=nextOutput;
    exchanges.push(new Exchange(input,output));
    nextOutput=null;
    return output;
  };

  exports.reward=reward;
  exports.discard=discard;
  exports.train=train;
  exports.talk=talk;
  //------------- COMMENT LATER ? ------
  exports.history=exchanges;
  exports.all=all;
