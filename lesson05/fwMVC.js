/**
 * Created by dare on 5/17/15.
 * Framework MVC
 */

;(function(window){

window.MVC = {};

/** Default class options **/

var defaultModelOptions = {

}

var defaultModelOptions = {

}

var defaultModelOptions = {

}

/**
 * Model
 * @param options
 * @constructor
 */

var Model = function(options) {
	this.__store = {};
	this.options = extend(defaultModelOptions, options);
}

Model.prototype = {
	constructor: Model,

	get: function(name) {
		var data = this.__store[name];
		return data || null;
	},

	set: function(name, data) {
		this.__store[name] = data;
	}
}

/**
 * Constructor
 * @param options
 * @constructor
 */

var Controller = function(options) {
	this.options = extend(defaultModelOptions, options);
}

/**
 * View
 * @param options
 * @constructor
 */

var View = function(options) {
	this.options = extend(defaultModelOptions, options);
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
 * Extend
 * @param object
 * @param mixin
 */

function extend(object, mixin) {
	for (var key in mixin) {
		if (mixin.hasOwnProperty(key)) object.prototype[key] = mixin[key];
	}
}

})(window);

