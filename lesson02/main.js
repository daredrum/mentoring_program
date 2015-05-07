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

	this.isSort = options.isSort || false;
	this.containerElem = document.querySelector(selectorContainer);
	this.perPage = (+options.perPage !== NaN && +options.perPage) || 10;
	this.page = 0;
	this.direction = 'up';
	this.collection = (options.items instanceof Array && options.items) || [];
	this.decoratorList = [];

	this.init();
};

PrettyList.prototype = {
	constructor : PrettyList,

	decorators : {
		sorting : {
			filter : function(list, context) {
				var arr = (context.direction === 'up') ? list.sort() : list.sort().reverse();
				return arr;
			}
		},
		pagination : {
			filter : function(list, context) {
				var start = context.page * context.perPage,
					end = start + context.perPage;
				return list.slice(start, end);
			}
		}
	},

	init : function() {
		this.listElem = document.createElement('ul');
		this.listElem.className = 'ui-prettylist-items'
		this.containerElem.appendChild(this.listElem);

		this.checkPagination();
		if (this.isSort) this.initSortPanel();

		this.filter();
	},

	add : function(name) {
		if (name) this.collection.push(name);
		this.checkPagination(true);
	},

	filter : function() {
		var length = this.decoratorList.length,
			list = this.collection,
			name;

		for (var i=0; i<length; i++) {
			name = this.decoratorList[i];
			list = this.decorators[name].filter(list, this);
		}
		this.showList(list);
	},

	showList : function(list) {
		var self = this;
		self.clearList(function() {
			var fragment = document.createDocumentFragment();
			list.forEach(function(name) {
				var itemElem = document.createElement('li');
				itemElem.className = 'ui-prettylist-item';
				itemElem.innerHTML = name;
				fragment.appendChild(itemElem);
			});
			self.listElem.appendChild(fragment);
		}, 500);
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


	// Pagination

	checkPagination : function(refresh) {
		if (this.collection.length > this.perPage) {
			this.initPagination(0, refresh);
			if (this.decoratorList.indexOf('pagination') === -1) this.decoratorList.push('pagination');
		}
	},

	initPagination : function(page, refresh) {
		if (this.containerElem.querySelector('.ui-prettylist-pagination') === null || refresh) {
			this.createPagination();
		}
		var paginationElem = this.containerElem.querySelector('.ui-prettylist-pagination');
		var	paginationActiveElem = paginationElem.querySelector('.ui-prettylist-pagination-item.active');
		var	paginationCurrentElem = paginationElem.querySelectorAll('.ui-prettylist-pagination-item')[page];
		this.removeClass(paginationActiveElem, 'active');
		this.addClass(paginationCurrentElem, 'active');
	},

	createPagination : function() {
		var paginationListElem = this.containerElem.querySelector('.ui-prettylist-pagination');
		if (!paginationListElem) {
			paginationListElem = document.createElement('ul');
			paginationListElem.className = 'ui-prettylist-pagination';
			this.containerElem.appendChild(paginationListElem);
		}

		var amountPages = Math.ceil(this.collection.length / this.perPage),
			fragment = document.createDocumentFragment();
		for (var i=1; i<=amountPages; i++) {
			var	paginationItemElem = document.createElement('li');
			paginationItemElem.className = 'ui-prettylist-pagination-item';
			paginationItemElem.innerHTML = i;
			fragment.appendChild(paginationItemElem);
		}
		paginationListElem.innerHTML = '';
		paginationListElem.appendChild(fragment);

		paginationListElem.addEventListener('click', this.onClickPagination.bind(this), false);
	},

	onClickPagination : function(e) {
		var elem = e.target,
			page = elem.innerHTML - 1;
		this.page = page;
		this.initPagination(page);
		this.filter();
	},


	// Sort

	initSortPanel : function() {
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
			this.direction = 'down';
		} else if (this.hasClass(elem, 'down')) {
			this.changeClass(elem, 'down', 'up');
			this.direction = 'up';
		} else {
			this.addClass(elem, 'up');
			this.direction = 'up';
		}
		if (!this.decoratorList['sorting']) this.decoratorList.unshift('sorting');
		this.page = 0;
		this.filter(0);
	}
};



extend(PrettyList, Mixin);



var prettyList = new PrettyList({
	items : ['Mike1', 'John2', 'Piter3', 'Mike4', 'John5', 'Piter6', 'Mike7', 'John8', 'Piter9', 'Mike10', 'John11', 'Piter12'],
	perPage: 5
});
prettyList.add('Nike13');


var prettySortList = new PrettyList({
	selectorContainer : '.ui-prettysortlist-container',
	items : ['Mike1', 'John2', 'Piter3', 'Andre4', 'Bob5', 'Poll6', 'Ray7', 'Loi8', 'Sam9', 'Cat10', 'Van11', 'Tom12'],
	isSort: true,
	perPage: 4
});
prettySortList.add('Nike13');