/**
 * @name Proxy
 * Proxy pattern
 * @method get
 *  @param {String} url
 *	@param {Function} callback
 */

function Proxy() {
	this._cash = {};
}

Proxy.prototype = {
	constructor: Proxy,

	get: function(url, fn) {
		if (this._cash[url] && this._cash[url].expire > new Date) {
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
				var data = self._cash[url] = JSON.parse(xhr.responseText),
					d = new Date;
				d.getSeconds(d.getSeconds() + 20)
				self._cash[url].expire = d;
				fn(data);
			}
		}

		xhr.send();
	}
}


/**
 * @name Weather
 * Get weather of selected city
 * @method get
 *  @param {String} url
 *	@param {Function} callback
 */

function Weather() {
	this._init();
}

Weather.prototype = {
	constructor: Weather,

	_init: function() {
		this.weatherContainerEl = document.querySelector('.js-city-weather');
		this.action = document.querySelector('.js-form').action;
		this.citySelectEl = document.querySelector('.js-city-select');
		this.citySelectEl.addEventListener('change', this._onSelectCity.bind(this), false);
	},

	_onSelectCity: function(e) {
		e.preventDefault();
		var targetEl = e.target,
			name = targetEl.name,
			value = targetEl.value;
		var url = [
			this.action,
			'?',
			name,
			'=',
			value
		]
		this._getValue(url.join(''));
	},

	_getValue: function(url) {
		if (!this.proxy) this.proxy = new Proxy();
		this.proxy.get(url, this._showData.bind(this));
	},

	_showData: function(data) {
		this.weatherContainerEl.innerHTML = '<b>' + data.name + '</b>: ' + data.main.temp_min + ' - ' + data.main.temp_max + ' K';
		console.log(this.proxy._cash);
	}
}

var weather = new Weather();
