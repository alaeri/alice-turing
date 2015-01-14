$(function() {
  // Handler for .ready() called.
  $("#next").click(function(){
  	userText=$("#text").val();
  	arg="..."
  	if(userText.length>0){
  		arg=userText;
  		$("#text").val("");
  	}
  	$.ajax({url:"talk/"+arg,success:function(result){
    	$("#answer").html(result);
 	}});
  });
  $("#discard").click(function(){
  	$.ajax({url:"discard",success:function(result){
    	// $.ajax({url:"talk/...",success:function(result){
    	// 	$("#answer").html(result);
 		//}});
  	}});
  });
  $("#reward").click(function(){
  	$.ajax({url:"reward",success:function(result){
    	// $.ajax({url:"talk/...",success:function(result){
    	// 	$("#answer").html(result);
 		//}});
  	}});
  });
  $("#text").keyup(function(event){
    if(event.keyCode == 13){
        $("#next").click();
    }
  });
});
