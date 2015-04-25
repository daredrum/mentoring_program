var Mediator = {
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


// Control
var Control = function() {
	this.first = true;
	this.disabled = false;
	this.init();
};

Control.prototype = {
	constructor: Control,

	init: function() {
		document.querySelector('.js-play').onclick = this.onPlay.bind(this);
		document.querySelector('.js-reset').onclick = this.onReset.bind(this);
		Mediator.on('stop', this.stop, this);
	},

	onPlay: function() {
		if (this.first) {
			Mediator.trigger('start');
			this.first = false;
		}
		if (!this.disabled) {
			Mediator.trigger('increase');
		}
	},

	onReset: function() {
		Mediator.trigger('clear');
		this.disabled = false;
		this.first = true;
	},

	stop: function() {
		this.disabled = true;
	}
}

new Control;


// Counter
var Counter = function() {
	this.init();
}

Counter.prototype = {
	constructor: Counter,

	init: function() {
		Mediator.on('increase', this.increase, this);
		Mediator.on('clear', this.clear, this);
	},

	increase: function() {
		var counterEl = document.querySelector('.js-counter'),
			value = +counterEl.innerHTML;
		if (!isNaN(value)) counterEl.innerHTML = ++value;
	},

	clear: function() {
		document.querySelector('.js-counter').innerHTML = 0;
	}
}

new Counter;


// Timer
var Timer = function(options) {
	this.durations = options.duration || 60;
	this.init();
};

Timer.prototype = {
	constructor: Timer,

	init: function() {
		Mediator.on('start', this.start, this);
		Mediator.on('clear', this.reset, this);
		this.reset();
	},

	start: function() {
		var self = this;
		self.timer = setTimeout(function() {
			self.increaseTime();
		}, 1000);
	},

	stop: function() {
		Mediator.trigger('stop');
	},

	increaseTime: function() {
		var self = this,
			timerEl = document.querySelector('.js-timer'),
			value = +timerEl.innerHTML;
		if (!isNaN(value)) {
			timerEl.innerHTML = (--value !== 0) ? value : 0;
		}
		if (value !== 0) {
			self.timer = setTimeout(function() {
				self.increaseTime();
			}, 1000);
		} else {
			self.stop();
		}
	},

	reset: function() {
		document.querySelector('.js-timer').innerHTML = this.durations;
	}
}

new Timer({
	duration: 10
});
