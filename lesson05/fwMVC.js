/**
 * Created by dare on 5/17/15.
 * Framework MVC
 */

;(function(window){

	window.MVC = {};

	/** Default class options **/

	var defaultModelOptions = {
		url: '/',
	}

	var defaultControllerOptions = {

	}

	var defaultViewOptions = {
		tagName: 'div',
		id: '',
		className: '',
		html: ''
	}

	/**
	 * EventAggregator
	 * @type {{events: {}, trigger: Function, on: Function}}
	 */

	var EventAggregator = {
		events: {},

		trigger: function(event, data) {
			var events = this.events;
			if (typeof event === 'string' && events[event]) {
				events[event].forEach(function(item, i, arr) {
					if (item instanceof Function) item(data);
				});
			}
		},

		on: function(event, fn, context) {
			var events = this.events;
			if (typeof event === 'string') {
				if (!events[event]) events[event] = [];
				events[event].push(fn.bind(context));
			}
		}
	}

	/**
	 * ExtendClass
	 * @param Child
	 * @param Parent
	 */

	function extendClass(Child, Parent) {
		var F = function() { };
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.prototype.superclass = Parent.prototype;
	}

	/**
	 * Mixin
	 * @param arguments[0] - current object
	 * @param arguments[1...] - mixin objects
	 */

	function mixin() {
		var obj = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var mixin = arguments[i]
			for (var key in mixin) {
				if (mixin.hasOwnProperty(key)) obj[key] = mixin[key];
			}
		}
	}

	/**
	 * Model
	 * @param options
	 * @constructor
	 */

	var Model = function(options) {
		this.__store = {};
		mixin(this, defaultModelOptions, options);
		this.__init();
	}

	Model.prototype = {
		constructor: Model,

		__init: function() {
			(typeof this.init === 'function') && this.init();
		},

		get: function(name) {
			var data = this.__store[name];
			return data || null;
		},

		set: function(name, data) {
			if (typeof this.validate === 'function' && !this.validate(data)) return;
			this.__store[name] = data;
			this.trigger('update', this.__store);
		},

		fetch: function() {
			var self = this,
				xhr = new XMLHttpRequest();
			xhr.open('GET', self.url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState !== 4) return;

				if (xhr.status === 200) {
					self.__store = JSON.parse(xhr.responseText);
					self.trigger('update', self.__store);
				} else {
					console.error("Data not found");
				}
			}
			xhr.send();
		},

		clear: function() {
			this.__store = {};
		}
	}

	mixin(Model.prototype, EventAggregator);

	/**
	 * Constructor
	 * @param options
	 * @constructor
	 */

	var Controller = function(options) {
		mixin(this, defaultControllerOptions, options);
		this.__init();
	}

	Controller.prototype = {
		constructor: Controller,

		__init: function() {
			this.__eventSubscribe();
			(typeof this.init === 'function') && this.init();
		},

		__eventSubscribe: function() {
			var events = this.events;
			if (!(events instanceof Object)) return;
			for (var key in events) {
				if (!events.hasOwnProperty(key)) continue;
				var elObj = this.events[key];
				if (!(elObj instanceof Object)) continue;
				for (var eKey in elObj) {
					if (!elObj.hasOwnProperty(eKey) && typeof this[elObj[eKey]] !== 'function') continue;
					var el = this.views[key] && this.views[key].el;
					if (!el) continue;
					el.addEventListener(eKey, this[elObj[eKey]]);
				}
			}
		}
	}

	/**
	 * View
	 * @param options
	 * @constructor
	 */

	var View = function(options) {
		mixin(this, defaultViewOptions, options);
		this.__init();
	}

	View.prototype = {
		constructor: View,

		__init: function() {
			this.el = document.createElement(this.tagName);
			if (this.id) this.el.setAttribute('id', this.id);
			if (this.className) this.el.setAttribute('class', this.className);
			if (this.html) this.el.innerHTML = this.html;

			if (this.attr) this.__addAttribute(this.el);

			(typeof this.init === 'function') && this.init();
		},

		__addAttribute: function(el) {
			var attr = this.attr;
			if (!(attr instanceof Object)) return;
			for (var key in attr) {
				if (!attr.hasOwnProperty(key)) continue;
				this.el.setAttribute(key, attr[key]);
			}
		}

	}

	MVC.Model = function(options) {
		return new Model(options);
	}

	MVC.Controller = function(options) {
		return new Controller(options);
	}

	MVC.View = function(options) {
		return new View(options);
	}

})(window);

