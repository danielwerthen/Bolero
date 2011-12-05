$.widget( "TestNamespace.timelineModule", {
	// default options
	options: {
		o: null
		},
	counter: 0,
	// the constructor
	_create: function() {
		
		var thisWidget = this;

		var canvas = create("canvas");
	
		//subscribe to mediator updates
		amplify.subscribe(thought.messages.add, function(arg){
			thisWidget.ItemAdded(canvas,arg.thought);		
		});
		
		this.element.append(canvas);
			
		this._refresh();
	},
	ItemAdded: function(canvas, thought) { 

		var ctx = canvas[0].getContext("2d");
		
		ctx.fillStyle = "#FF1C0A";
		ctx.beginPath();
		ctx.rect(0+this.counter, 0, 20, 20);
		ctx.closePath();
		ctx.fill();
		
		
		this.counter = this.counter + 50;
	},
	
	postList: Array(),
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