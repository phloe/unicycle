var Emitter = require("events").EventEmitter;
var assign = require("lodash.assign");

var CHANGE_EVENT = "change";

function Store (name, handlers, dispatcher) {
	
	this.items = [];
	
	this.handlers = {};
	
	var prefix = name.toUpperCase();
			
	handlers = assign({}, handlers || {});
	
	Object.keys(handlers).forEach(function (type) {
		var _type = (type.match(/^[A-Z_-]+$/)) ? type : prefix + "_" + type.toUpperCase();
		this.handlers[_type] = handlers[type];
	}, this);
	
	this.dispatchToken = dispatcher.register(function (action) {
		if (action.type in this.handlers) {
			this.handlers[action.type].apply(this, arguments);
		}
	}.bind(this));
}

Store.prototype = Object.create(Emitter.prototype);

Store.prototype.emitChange = function () {
	this.emit(CHANGE_EVENT);
};

module.exports = Store;