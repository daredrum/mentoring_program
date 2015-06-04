var formApp = angular.module('formApp', []);

formApp.controller('mainController', function() {
    this.inputName = '';
    this.panelName = 'Mike';
    this.onSubmit = function($event) {
        $event.preventDefault();
        if (this.inputName) this.panelName = this.inputName;
    }
});
