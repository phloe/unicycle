var Dispatcher = require("flux").Dispatcher;
var StoreFactory = require("./src/StoreFactory");
var CrudStoreFactory = require("./src/CrudStoreFactory");
var ActionCreatorFactory = require("./src/ActionCreatorFactory");
var CrudActionCreatorFactory = require("./src/CrudActionCreatorFactory");

module.exports = function () {
	
	var dispatcher = new Dispatcher();
	
	this.dispatcher = dispatcher;
	
	this.store = StoreFactory(dispatcher);
	
	this.crudStore = CrudStoreFactory(dispatcher);
	
	this.actions = ActionCreatorFactory(dispatcher);
	
	this.crudActions = CrudActionCreatorFactory(dispatcher);
	
};
