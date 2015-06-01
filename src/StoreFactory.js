var Store = require("./Store");

var CHANGE_EVENT = "change";

module.exports = function (dispatcher) {
	
	return function (name, handlers) {
		
		var store = new Store(name, handlers, dispatcher);
		
		return {
		
			get: function (id) {
				var l = store.items.length;
				var i = 0;
				while (i < l) {
					if (store.items[i].id === id) {
						return store.items[i];
					}
					i++;
				}
				return null;
			},
			
			getAll: function () {
				return store.items;
			},
			
			register: function (func) {
				store.addListener(CHANGE_EVENT, func);
			},
			
			unregister: function (func) {
				store.removeListener(CHANGE_EVENT, func);
			},
			
			dispatchToken: store.dispatchToken
		
		};
		
	};

};
