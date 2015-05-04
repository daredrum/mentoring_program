function Proxy() {
	this._cash = {};
}

Proxy.prototype = {
	constructor: Proxy,

	get: function(url, fn) {
		if (this._cash[url]) {
			return fn(this._cash[url]);
		}
		this._makeRequest(url, fn);
	},

	_makeRequest: function(url, fn) {
		var self = this,
		    xhr = new XMLHttpRequest();

		xhr.open('GET', url, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;

			if (xhr.status === 200) {
				var data = self._cash[url] = xhr.responseText;
				fn(data);
			}
		}

		xhr.send();
	}
}

var proxy = new Proxy();

proxy.get('http://api.openweathermap.org/data/2.5/weather?q=london', function(data) {
	console.dir(data);
});
proxy.get('http://api.openweathermap.org/data/2.5/weather?q=london', function(data) {
	console.dir(data);
});
proxy.get('http://api.openweathermap.org/data/2.5/weather?q=moscow', function(data) {
	console.dir(data);
});
proxy.get('http://api.openweathermap.org/data/2.5/weather?q=london', function(data) {
	console.dir(data);
});
proxy.get('http://api.openweathermap.org/data/2.5/weather?q=london', function(data) {
	console.dir(data);
});
proxy.get('http://api.openweathermap.org/data/2.5/weather?q=moscow', function(data) {
	console.dir(data);
});
setTimeout(function() {
	console.log(proxy._cash);
}, 1000);