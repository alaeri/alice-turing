//-------- TURING v1--------------
//
// this is the third implementation
// Each function takes in input a list of elements and outputs a list of element.
//
//---------- VARS ----------------
var functions=[];
var functionsTitle=[];
var exchanges=[];
var all=[];
//--------- DECLARATIONS ----------
var Element = function( value,fnIndex){
      this.value=value;
      this.fnIndex=fnIndex;
      this.elements=[];
      //console.log("CREATING "+JSON.stringify(this));
}
var Exchange = function(input,output){
      this.input=input;
      this.output=output;
}

//---------- INIT --------------------
var init=function(){
	
    addFunction = function (title, nfunction){
    	//console.log(title+nfunction);
    	functions.push(nfunction);
    	functionsTitle.push(title);
    	//console.log(functions);
	}
	addFunction("moveRight",function(value,argList){
		//xxconsole.log("moveRight"+value+JSON.stringify(argList));
		if(argList.length>1){
			 var retList=cloneArray(argList,1,argList.length);
			 return retList;
		}
		return [];
	});
	addFunction("sliceBefore",function(value,argList){
		//console.log("sliceBefore"+value+JSON.stringify(argList));
		for(var i=0;i<argList.length;i++){
			if(argList[i].value===value){
				retList= cloneArray(argList,i,argList.length);
				return retList;
			}
		}
		return [];
	});
	addFunction("sliceAfter",function(value,argList){
		//console.log("sliceAfter"+value+JSON.stringify(argList));
		for(var i=0;i<argList.length;i++){
			if(argList[i].value===value){
				return cloneArray(argList,0,i);
			}
		}
		return [];
	});
	addFunction("getChildrenElements",function(value,argList){
		//console.log("getChildrenElements"+value+JSON.stringify(argList));
		if(argList.length>0){
			var element=argList[0];
			//console.log(JSON.stringify(element));
			return cloneArray(element.elements,0,element.elements.length);
		}
		return [];
	});

}
init();
//--------- PROCESS ------------------
var cloneArray=function(argList,start,end){
	//console.log("cloning: "+start + end + JSON.stringify(argList));
	var retList=[];
	for(var i=start;i<end;i++){
		var clonedElement=cloneElement(argList[i]);
		retList.push(clonedElement);
	}
	//console.log("cloned: "+JSON.stringify(retList));
	return retList;
}
var cloneElement=function(arg){
	var ret=new Element(arg.value,arg.fnIndex);
	//console.log("cloning: "+JSON.stringify(arg));
	ret.elements=cloneArray(arg.elements,0,arg.elements.length);
	//console.log("cloned: "+JSON.stringify(ret));
	return ret;
}
var createRandomElement=function(value){
	var fnIndex=Math.floor(Math.random()*functions.length);
	var element=new Element(value,fnIndex);
	//console.log("CREATED RANDOM ELEMENT "+JSON.stringify(element));
	return element;
}
var makeStartingElementsList=function(value,all){
	var list=[];
	list.push(createRandomElement(value));
	//list.push(createRandomElement(value));
	
	// for( i=0;i<all.length;i++){
	// 	list.push(cloneElement(all[i]));
	// }
	// list.push(createRandomElement(value));
	//list.push(createRandomElement(value));
	//console.log("CREATED RANDOM ELEMENTS "+ JSON.stringify(list));


	return list;


}
var mprocess=function(elements){

	//for(var i=0;i<elements.length;i++){
	while(elements.length>0){
		var element=elements[0];
		//console.log("PROCESSING  "+JSON.stringify(element));

    	element.elements=functions[element.fnIndex].call(this,element.value,elements);
    	
    	if(element.elements.length>0){
    	    return element.elements;
    	}else{
    		elements.shift();
    	}
    	
	}
	return [];
};

//-------------MAIN---------------
var talk=function(input){
	while(true){
  		var lastElement=createRandomElement(input);
    	lastElement.elements=makeStartingElementsList(input,all);
    	//console.log("STARTING ELEMENT  "+JSON.stringify(lastElement));

    	all.unshift(lastElement);
    	
    	outPutElements=mprocess(all);

    	if(outPutElements.length>0){
    		//console.log("OUTPUTTTTT"+JSON.stringify(outPutElements));
    		var output=outPutElements[0].value;
    	 	exchanges.push(new Exchange(input,output));
    		return output;
    	}else{
    		all.shift();
    		//return "aaaaa";
    	}
	}
    
};
var reward=function(){
	all.unshift(cloneElement(all[all.length-1]));
};
var train=function(input,expectedOutput){
    success=0;
    var training=new Object();
    training.input=input;
    training.expectedOutput=expectedOutput;
    for(var j=0;j<10;j++){
      output=talk(training.input);
      if(output===training.expectedOutput){
        reward();
        success++;
      }else{
          discard();
      }
    }
    training.success=success;
    return training;
  
};
var discard=function(){
	all.shift();
};

//------------ INTERFACE --------------
exports.reward=reward;
exports.discard=discard;
exports.train=train;
exports.talk=talk;
exports.history=exchanges;
exports.all=all;