// Customers list

var Mixin = {
	addClass : function(elem, newClassName) {

		var className = elem.className,
			reg = new RegExp(newClassName);
		if (!reg.test(className)) {
			className = [className, newClassName].join(' ');
		}
		elem.className = className;
		return elem;
	},

	removeClass : function(elem, excessClass) {
		if (!elem) return null;
		var className = elem.className,
			reg = new RegExp(excessClass);
		elem.className = className.replace(reg, '');
		return elem;
	},

	hasClass : function(elem, checkClass) {
		if (!elem) return null;
		var className = elem.className,
			reg = new RegExp(checkClass);
		return !!reg.test(className);
	},

	changeClass : function(elem, rmCls, newCls) {
		this.removeClass(elem, rmCls);
		this.addClass(elem, newCls);
	}
}

function extend(module, mixin) {
	for (var key in mixin) {
		module.prototype[key] = mixin[key];
	}
}

function extendClass(Child, Parent) {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.prototype.superclass = Parent.prototype;
}

var PrettyList = function(options) {
	var selectorContainer = options.selectorContainer || '.ui-prettylist-container';

	this.containerElem = document.querySelector(selectorContainer);
	this.perPage = (+options.perPage !== NaN && +options.perPage) || 10;
	this.currentPage = 0;
	this.collection = (options.items instanceof Array && options.items) || [];

	this.init();
};

PrettyList.prototype = {
	constructor : PrettyList,

	init : function() {
		this.listElem = document.createElement('ul');
		this.listElem.className = 'ui-prettylist-items'
		this.containerElem.appendChild(this.listElem);
		this.showList(0);
	},

	initPagination : function(page) {
		if (this.containerElem.querySelector('.ui-prettylist-pagination') === null) {
			this.createPagination();
		}
		var paginationElem = this.containerElem.querySelector('.ui-prettylist-pagination');
		var	paginationActiveElem = paginationElem.querySelector('.ui-prettylist-pagination-item.active');
		var	paginationCurrentElem = paginationElem.querySelectorAll('.ui-prettylist-pagination-item')[page];
		this.removeClass(paginationActiveElem, 'active');
		this.addClass(paginationCurrentElem, 'active');
	},

	createPagination : function() {
		var	paginationListElem = document.createElement('ul');
		paginationListElem.className = 'ui-prettylist-pagination';

		var amountPages = Math.ceil(this.collection.length / this.perPage);
		for (var i=1; i<=amountPages; i++) {
			var	paginationItemElem = document.createElement('li');
			paginationItemElem.className = 'ui-prettylist-pagination-item';
			paginationItemElem.innerHTML = i;
			paginationListElem.appendChild(paginationItemElem);
		}
		this.containerElem.appendChild(paginationListElem);

		paginationListElem.addEventListener('click', this.onClick.bind(this), false);
	},

	showList : function(page) {
		page = (+page !== NaN && +page) || 0;
		var self = this,
			collection = this._getCollection(page);
		this.clearList(function() {
			collection.forEach(self.appendToDOM.bind(self));
			self.initPagination(page);
		}, 500);
	},

	add : function(name) {
		if (name) this.collection.push(name);
	},

	appendToDOM : function(name) {
		var itemElem = document.createElement('li');
		itemElem.className = 'ui-prettylist-item';
		itemElem.innerHTML = name;
		this.listElem.appendChild(itemElem);
	},

	onClick : function(e) {
		var elem = e.target;
		var page = +elem.innerHTML;
		this.showList(page - 1);
	},

	clearList : function(fn, delay) {
		var self = this;
		self.addClass(self.listElem, 'hide');
		setTimeout(function() {
			self.listElem.innerHTML = '';
			self.removeClass(self.listElem, 'hide');
			fn();
		}, delay);
	},

	_getCollection : function(page) {
		var start = page * this.perPage,
			end = start + this.perPage;
		return this.collection.slice(start, end);
	}
};

extend(PrettyList, Mixin);


var PrettySortList = function() {
	PrettyList.apply(this, arguments);
};

extendClass(PrettySortList, PrettyList);

extend(PrettySortList, {
	init : function() {
		this.superclass.init.apply(this, arguments);
		this.showSortPanel();
	},

	showSortPanel : function() {
		if (this.containerElem.querySelector('.ui-prettylist-sort') === null) {
			this.createSortPanel();
		};
	},

	createSortPanel : function() {
		var	sortListElem = document.createElement('div');
		sortListElem.className = 'ui-prettylist-sort';
		var sortItemElem = document.createElement('div');
		sortItemElem.className = 'ui-prettylist-sort-item';
		sortItemElem.innerHTML = 'Sort';
		sortListElem.appendChild(sortItemElem);

		this.containerElem.insertBefore(sortListElem, this.listElem);

		sortItemElem.addEventListener('click', this.onClickSort.bind(this), false);
	},

	onClickSort : function(e) {
		var elem = e.target;
		if (this.hasClass(elem, 'up')) {
			this.changeClass(elem, 'up', 'down');
			this.collection = this.collection.reverse();
		} else if (this.hasClass(elem, 'down')) {
			this.changeClass(elem, 'down', 'up');
			this.collection = this.collection.sort();
		} else {
			this.addClass(elem, 'up');
			this.collection = this.collection.sort();
		}
		this.showList(this.currentPage);
	},

	sortUp : function(a, b) {
		return a - b;
	},

	sortDown : function(a, b) {
		return b - a;
	}
});




var prettyList = new PrettyList({
	items : ['Mike1', 'John2', 'Piter3', 'Mike4', 'John5', 'Piter6', 'Mike7', 'John8', 'Piter9', 'Mike10', 'John11', 'Piter12']
});
prettyList.add('Nike13');

var prettySortList = new PrettySortList({
	selectorContainer : '.ui-prettysortlist-container',
	items : ['Mike1', 'John2', 'Piter3', 'Andre4', 'Bob5', 'Poll6', 'Ray7', 'Loi8', 'Sam9', 'Cat10', 'Van11', 'Tom12']
});


prettySortList.add('Nike13');