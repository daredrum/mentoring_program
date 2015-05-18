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

		trigger: function(event) {
			var events = this.events;
			if (typeof event === 'string' && events[event]) {
				events[event].forEach(function(item, i, arr) {
					if (item instanceof Function) item();
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
		mixin(defaultModelOptions, options);
	}

	Model.prototype = {
		constructor: Model,

		get: function(name) {
			var data = this.__store[name];
			return data || null;
		},

		set: function(name, data) {
			this.__store[name] = data;
		},

		fetch: function() {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', this.options.url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState !== 4) return;

				if (xhr.status === 200) {
					this.__store = JSON.parse(xhr.responseText);
				} else {
					console.error("Data not found");
				}
			}
			xhr.send();
		}
	}

	extend(Model.prototype, EventAggregator);

	/**
	 * Constructor
	 * @param options
	 * @constructor
	 */

	var Controller = function(options) {
		mixin(defaultModelOptions, options);
	}

	/**
	 * View
	 * @param options
	 * @constructor
	 */

	var View = function(options) {
		mixin(defaultModelOptions, options);
		(typeof this.init === 'function') && this.init();
		this.__init();
	}

	View.prototype = {
		constructor: View,

		__init: function() {
			this.el = document.createElement(this.tagName);
			this.el.setAttribute('id', this.id);
			this.el.setAttribute('className', this.className);
			this.el.innerHTML = this.html;
		}
	}

	MVC.Model = function(options) {
		return new Model(options);
	}

	MVC.Controller = function(options) {
		return new Model(options);
	}

	MVC.View = function(options) {
		return new Model(options);
	}

})(window);

