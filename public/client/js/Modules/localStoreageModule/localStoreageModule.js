$.widget( "TestNamespace.localStoreageModule", {
	// default options
	options: {
		list : Array()
		},
	
	// the constructor
	_create: function() {
						
		var thisWidget = this;

		var dataContainer = create("div").attr("class","dataContainer");
		var newDataInput = create("input").attr({class:"newDataInput",type:"text"});
		
	var loadbutton = create("button").attr('id', 'loadButton').text("Load Data").button({
            icons: {
                primary: "ui-icon-plus"
            }
			}).click(function() {

			dataContainer.children().remove();
			
			var loadedlist = amplify.store("list");
			if(loadedlist instanceof Array)
			{
				thisWidget.options.list = loadedlist;
			}
			
			for(var i=0;i < thisWidget.options.list.length;i++)
			{
				var visual = thisWidget.createVisual(thisWidget.options.list[i].Value);
				dataContainer.append(visual);
			}
		});
		
		var saveButton =  create("button").text("Save Data").button({
            icons: {
                primary: "ui-icon-disk"
            }
			}).click(function() {
				amplify.store( "list", thisWidget.options.list);
		});
		
		var newDataButton =  create("button").text("New Data").button({
            icons: {
                primary: "ui-icon-plus"
            }
			}).click(function() {
			
			var newitem = {Key:newGuid(),Value:newDataInput.val()};
			thisWidget.options.list.push(newitem);
			
			var visual = thisWidget.createVisual(newitem.Value)
			dataContainer.append(visual);
			
		});		
			
		this.element.append(loadbutton);
		this.element.append(saveButton);
		this.element.append(newDataButton);
		this.element.append(dataContainer);
		this.element.append(newDataInput);
		this._refresh();
	},
	createVisual: function(value) {
		
		return create("div").text(value);
	
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