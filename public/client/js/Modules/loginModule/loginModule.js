    $.widget( "TestNamespace.loginModule", {
			// default options
			options: {
			},
			
			// the constructor
			_create: function() {
				
				var thisWidget = this;
				
				var loginFormContainer = create("div","loginFormContainer");
				loginFormContainer.attr("title","Login");
				
				var thoughtForm = create("form").append(create("fieldset"));
				
				thoughtForm.append(create("label").attr({"for":"username"}).text("username"));
				thoughtForm.append(create("input").attr({"type":"text","name":"username","id":"username"}).addClass('text ui-widget-content ui-corner-all').width("100%"));
				
				thoughtForm.append(create("label").attr({"for":"content"}).text("password"));
    			thoughtForm.append(create("input").attr({"type":"password","name":"password","id":"password"}).addClass('text ui-widget-content ui-corner-all').width("100%"));
					
				loginFormContainer.append(thoughtForm);
				
		loginFormContainer.dialog({
			autoOpen: false,
			height: 300,
			width: 500,
			modal: true,
			resizable: false,
			draggable: false,
			open: function(event, ui) { 
				$(".ui-dialog-titlebar-close").hide(); 
				
					},
			buttons: {
				"Login": function() 
				{
					var loginobject = {"username":$("#username").val(),"password":$("#password").val()};
					
						 amplify.publish(interface.messages.login, loginobject );
						 loginobject = null;
						 $("#username").val("");
						 $("#password").val("");
						 $(this).dialog("close"); 
				},
			},
		});
				
				
				amplify.subscribe(interface.messages.openLoginView, function(arg){
						
						loginFormContainer.dialog("open");
							
				});
					
				this._refresh();
			},
					
			// called when created, and later when changing options
			_refresh: function() {
				
				// trigger a callback/event
				this._trigger( "change" );
			},

			// events bound via _bind are removed automatically
			// revert other modifications here
			_destroy: function() {
				// remove generated elements
				this.changer.remove();

			},

			// _setOptions is called with a hash of all options that are changing
			// always refresh when changing options
			_setOptions: function() {
				// in 1.9 would use _superApply
				$.Widget.prototype._setOptions.apply( this, arguments );
				this._refresh();
			},

			// _setOption is called for each individual option that is changing
			_setOption: function( key, value ) {

				// in 1.9 would use _super
				$.Widget.prototype._setOption.call( this, key, value );
			}
		});
