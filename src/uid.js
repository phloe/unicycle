module.exports = function (length) {
	var id = "";
	
	length = length || 10;
	
	while (id.length < length) {
		id += Math.random().toString(36).slice(2);
	}
	
	return id.slice(0, length);
};