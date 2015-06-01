var assign = require("lodash.assign");
var StoreFactory = require("./StoreFactory");
var timestamp = require("./timestamp");
var uid = require("./uid");

var CHANGE_EVENT = "change";

module.exports = function (dispatcher) {
	
	var _StoreFactory = StoreFactory(dispatcher);
	
	return function (name, create, handlers) {
		
		var defaultHandlers = {
	
			create: function (action) {
				var item = create ? create(action.data) : action.data;
				var time = timestamp();
				item.id = uid();
				item.c_data = time;
				item.m_data = time;
				this.items.push(item);
				this.emitChange();
			},
			
			read: function (action) {
				this.items = action.data;
				this.emitChange();
			},
			
			update: function (action) {
				var index = this.items.indexOf(item);
				if (index > -1) {
					var item = this.items[index];
					var _item = assign({}, item, action.data);
					_item.m_date = timestamp();
					this.items.splice(index, 1, _item);
					this.emitChange();
				}
			},
			
			delete: function (action) {
				var index = this.items.indexOf(item);
				if (index > -1) {
					this.items.splice(index, 1);
					this.emitChange();
				}
			}
			
		};
		
		return _StoreFactory(name, assign({}, defaultHandlers, handlers || {}));
		
	};

};
