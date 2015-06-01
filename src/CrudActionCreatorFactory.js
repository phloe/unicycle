var assign = require("lodash.assign");
var ActionCreatorFactory = require("./ActionCreatorFactory");

module.exports = function (dispatcher) {
	
	var _ActionCreatorFactory = ActionCreatorFactory(dispatcher);
	
	return function (name, signatures) {
		
		var _signatures = {
			
			create: ["data"],
			
			read: ["data"],
			
			update: ["id", "data"],
			
			delete: ["id"]
			
		};
		
		if (signatures) {
			assign(_signatures, signatures);
		}
		
		return _ActionCreatorFactory(name, _signatures);
	};
	
};
