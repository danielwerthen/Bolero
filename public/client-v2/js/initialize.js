//load external Libraries
$(function(){
	
	
	var dataEngine = create("div").dataEngineModule();
	var communicationModule = create("div").communicationModule();
    var loginDialog = create("div").loginModule(); //this is the way to initialize modules that does´nt have a corresponding visual object.
    $("#menu").menuModule();
	
	
	amplify.subscribe(messages.message.add, function(message) {
          		$("#test").append(create("div").text(message.title));
    });


	
});
	