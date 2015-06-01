module.exports = function (dispatcher) {
	
	return function (name, signatures) {
		
		var prefix = name.toUpperCase();
			
		var creators = {};
		
		Object.keys(signatures).forEach(function (creatorName) {
			var sigArgs = signatures[creatorName];
			
			creators[creatorName] = function () {
				var args = arguments;
				var action = {
					type: prefix + "_" + creatorName.toUpperCase()
				};
				sigArgs.forEach(function (arg, index) {
					action[arg] = args[index];
				});
				dispatcher.dispatch(action);
			}
			
		});
		
		return creators;
	};
	
};
