    $.widget( "TestNamespace.createThoughtModule", {
			// default options
			options: {
			},
			
			// the constructor
			_create: function() {
				
				var thisWidget = this;
				
				var createFormContainer = create("div","createFormContainer");
				createFormContainer.attr("title","Create Thought");
				
				var thoughtForm = create("form").append(create("fieldset"));
				
				thoughtForm.append(create("label").attr({"for":"title"}).text("title"));
				thoughtForm.append(create("input").attr({"type":"text","name":"title","id":"title"}).addClass('text ui-widget-content ui-corner-all').width("100%"));
				
				thoughtForm.append(create("label").attr({"for":"content"}).text("content"));
    			thoughtForm.append(create("textarea").attr({"name":"content","id":"content"}).addClass('text ui-widget-content ui-corner-all').width("100%"));
					
				createFormContainer.append(thoughtForm);
				
		createFormContainer.dialog({
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
				"Create Thought": function() 
				{
					var thoughtobject = {"title":$("#title").val(),"content":$("#content").val()};
					
						 amplify.publish(messages.thought.create, thoughtobject, thisWidget.parentThought );
						 thoughtobject = null;
						 $("#title").val("");
						 $("#content").val("");
                          thisWidget.parentThought  = null;
						 $(this).dialog("close"); 
				},
                "Cancel": function(){
                    $(this).dialog("close"); 
                    }
			},
		});
				
				
				amplify.subscribe(interface.messages.openCreateView, function(parentThought){
						
                        if(parentThought != undefined)
                        {
                            thisWidget.parentThought = parentThought;
                            createFormContainer.find("#title").val(thisWidget.parentThought.title);
                        }
                        
						createFormContainer.dialog("open");
							
				});
					
				this._refresh();
			},
			parentThought : null,		
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
