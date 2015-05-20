/*** Models ***/

var personModel = MVC.Model({
	url: 'data.json',
	validate: function(data) {
		return !!data;
	}
});

/*** Views ***/

var formContainer = MVC.View({
	className: 'ui-form-container'
});

var formView = MVC.View({
	tagName: 'form',
	className: 'ui-form'
});

var inputView = MVC.View({
	tagName: 'input',
	className: 'ui-input',
	attr: {
		name: 'name',
		placeholder: 'Enter your name'
	}
});

var submitView = MVC.View({
	tagName: 'input',
	className: 'ui-submit',
	attr: {
		type: 'submit'
	}
});

var panelView = MVC.View({
	model: personModel,
	className: 'ui-panel',
	init: function() {
		this.model.on('update', this.onUpdateView, this);
	},
	onUpdateView: function(data) {
		this.el.innerHTML = 'Hello ' + data.name + '!';
	}
});

/*** Controllers ***/

var meinController = MVC.Controller({
	init: function() {
		formView.el.appendChild(inputView.el);
		formView.el.appendChild(submitView.el);
		formContainer.el.appendChild(formView.el);
		formContainer.el.appendChild(panelView.el);
		document.querySelector('.js-container').appendChild(formContainer.el);

		personModel.fetch();
	},

	views: {
		container: formContainer,
		form: formView,
		input: inputView,
		submit: submitView,
		panel: panelView
	},

	events: {
		form: {
			'submit': 'saveNameInModel'
		}
	},

	saveNameInModel: function(event) {
		event.preventDefault();
		var name = inputView.el.name,
			value = inputView.el.value;
		if (value === '') {
			personModel.clear();
		} else {
			personModel.set(name, value);
		}
	}
});

