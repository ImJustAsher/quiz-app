var quizController = (function() {
	localStorage.setItem('data', JSON.stringify([ 1, 2, 3, 4 ]));
	localStorage.setItem('data', JSON.stringify({ name: 'John' }));
})();

var UIController = (function() {
	var num1 = 30;

	return {
		sum: function(num2) {
			return num1 + num2;
		}
	};
})();

var controller = (function(quizCtrl, UICtrl) {
	console.log(UICtrl.sum(100) + quizCtrl.publicMethod());
})(quizController, UIController);
