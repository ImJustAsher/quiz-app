// Lecture: Create Question List

/*******************************
*********QUIZ CONTROLLER********
*******************************/
// 1
var quizController = (function() {
	// 4
	//*********Question Constructor*********/
	function Question(id, questionText, options, correctAnswer) {
		this.id = id;
		this.questionText = questionText;
		this.options = options;
		this.correctAnswer = correctAnswer;
	}

	//34
	var questionLocalStorage = {
		// 35
		setQuestionCollection: function(newCollection) {
			localStorage.setItem('questionCollection', JSON.stringify(newCollection));
		},
		// 36
		getQuestionCollection: function() {
			return JSON.parse(localStorage.getItem('questionCollection'));
		},
		// 37
		removeQuestionCollection: function() {
			localStorage.removeItem('questionCollection');
		}
	};
	if (questionLocalStorage.getQuestionCollection() === null) {
		questionLocalStorage.setQuestionCollection([]);
	}
	return {
		getQuestionLocalStorage: questionLocalStorage,
		addQuestionOnLocalStorage: function(newQuestText, opts) {
			var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
			if (questionLocalStorage.getQuestionCollection() === null) {
				questionLocalStorage.setQuestionCollection([]);
			}
			optionsArr = [];

			for (var i = 0; i < opts.length; i++) {
				if (opts[i].value !== '') {
					optionsArr.push(opts[i].value);
				}
				// 26
				if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
					// 27
					corrAns = opts[i].value;
					// 60
					isChecked = true;
				}
			}

			if (questionLocalStorage.getQuestionCollection().length > 0) {
				questionId =
					questionLocalStorage.getQuestionCollection()[
						questionLocalStorage.getQuestionCollection().length - 1
					].id + 1;
			} else {
				questionId = 0;
			}
			if (newQuestText.value !== '') {
				// 55
				if (optionsArr.length > 1) {
					// 58
					if (isChecked) {
						newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
						getStoredQuests = questionLocalStorage.getQuestionCollection();
						getStoredQuests.push(newQuestion);
						questionLocalStorage.setQuestionCollection(getStoredQuests);

						newQuestText.value = '';
						for (var x = 0; x < opts.length; x++) {
							opts[x].value = '';
							opts[x].previousElementSibling.checked = false;
						}
						console.log(questionLocalStorage.getQuestionCollection());
						return true;
					} else {
						alert("You didn't a check correct answer, or you checked an answer without value");
						return false;
					}
				} else {
					alert('You must insert at least two options');
					return false;
				}
				// 53
			} else {
				// 54
				alert('Please, Insert Question');
				// 99
				return false;
			}
		}
	};
})();

/*******************************
**********UI CONTROLLER*********
*******************************/
// 2
var UIController = (function() {
	// 5
	var domItems = {
		//*******Admin Panel Elements********/
		questInsertBtn: document.getElementById('question-insert-btn'),
		newQuestionText: document.getElementById('new-question-text'),
		adminOptions: document.querySelectorAll('.admin-option'),
		adminOptionsContainer: document.querySelector('.admin-options-container'),
		insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
		questUpdateBtn: document.getElementById('question-update-btn'),
		questDeleteBtn: document.getElementById('question-delete-btn'),
		questsClearBtn: document.getElementById('questions-clear-btn')
	};

	// 7
	return {
		getDomItems: domItems, // 8
		// 63
		addInputsDynamically: function() {
			// 67
			var addInput = function() {
				// 68
				// console.log('Works');
				// 69         // 71
				var inputHTML, z;
				// 72
				z = document.querySelectorAll('.admin-option').length;
				// 70                                                                                 //73
				inputHTML =
					'<div class="admin-option-wrapper"><input type="radio" class="admin-option-' +
					z +
					'" name="answer" value="' +
					z +
					'"><input type="text" class="admin-option admin-option-' +
					z +
					'" value=""></div>';
				// 74
				domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
				// 75
				domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
					'focus',
					addInput
				);
				// 76
				domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
			};
			// 66
			domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
		},
		// 79
		createQuestionList: function(getQuestions) {
			// 86          // 91
			var questHTML, numberingArr;
			numberingArr = [];
			domItems.insertedQuestsWrapper.innerHTML = '';
			for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
				numberingArr.push(i + 1);
				questHTML =
					'<p><span>' +
					numberingArr[i] +
					'. ' +
					getQuestions.getQuestionCollection()[i].questionText +
					'</span><button id="question-' +
					getQuestions.getQuestionCollection()[i].id +
					'">Edit</button></p>';
				domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
			}
		},

		editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn) {
			let getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

			if ('question-'.indexOf(event.target.id)) {
				getId = parseInt(event.target.id.split('-')[1]);

				getStorageQuestList = storageQuestList.getQuestionCollection();

				for (let i = 0; i < getStorageQuestList.length; i++) {
					if (getStorageQuestList[i].id === getId) {
						foundItem = getStorageQuestList[i];

						placeInArr = i;
					}
				}
				domItems.newQuestionText.value = foundItem.questionText;
				domItems.adminOptions.innerHTML = '';

				optionHTML = '';

				for (let x = 0; x < foundItem.options.length; x++) {
					optionHTML +=
						'<div class="admin-option-wrapper"><input type="radio" class="admin-option-' +
						x +
						'" name="answer" value="' +
						x +
						'"><input type="text" class="admin-option admin-option-' +
						x +
						'" value="' +
						foundItem.options[x] +
						'"></div>';
				}
				domItems.adminOptions.innerHTML = optionHTML;

				domItems.questUpdateBtn.style.visibility = 'visible';
				domItems.questDeleteBtn.style.visibility = 'visible';
				domItems.questInsertBtn.style.visibility = 'hidden';
				domItems.questsClearBtn.style.pointerEvents = 'none';

				addInpsDynFn();

				let backDefaultView = function() {
					let updatedOptions;
					domItems.newQuestionText.value = '';
					updatedOptions = document.querySelectorAll('.admin-option');

					for (let i = 0; i < updatedOptions.length; i++) {
						updatedOptions[i].value = '';
						updatedOptions[i].previousElementSibling.checked = false;
					}

					domItems.questUpdateBtn.style.visibility = 'visible';
					domItems.questDeleteBtn.style.visibility = 'hidden';
					domItems.questInsertBtn.style.visibility = 'visible';
					domItems.questsClearBtn.style.pointerEvents = '';

					updateQuestListFn(storageQuestList);
				};

				let updateQuestion = function() {
					let newOptions, optionEls;

					newOptions = [];

					foundItem.questionText = document.newQuestText.value;

					foundItem.correctAnswer = '';

					foundItem.correctAnswer = '';

					for (let i = 0; i < optionEls.length; i++) {
						if (optionEls[i].value !== '') {
							newOptions.push(optionEls[i].value);
							if (optionEls[i].previousElementSibling.checked) {
								foundItem.correctAnswer = optionEls[i].value;
							}
						}
					}

					foundItems.options = newOptions;

					if (foundItem.questionText !== '') {
						if (foundItem.options.length > 1) {
							if (foundItem.correctAnswer !== '') {
								getStorageQuestList.splice(placeInArr, 1, foundItem);

								storageQuestList.setQuestionCollection(getStorageQuestList);

								backDefaultView();
							} else {
								alert("You didn't check a correct answer, or you checked an answer without value");
							}
						} else {
							alert('You must insert at least two options');
						}
					} else {
						alert('Please Insert Question');
					}
				};

				domItems.questUpdateBtn.onclick = updateQuestion;

				let deleteQuestion = function() {
					getStorageQuestList.splice(placeInArr, 1);

					storageQuestList.setQuestionCollection(getStorageQuestList);
				};

				domItems.questDeleteBtn.onclick = deleteQuestion;
			}
		},

		clearQuestList: function(storageQuestList) {
			if (storageQuestList.getQuestionCollection !== null) {
				if (storageQuestList.getQuestionCollection().length > 0) {
					let conf = confirm('Warning! You will lose entire question list');
					if (conf) {
						storageQuestList.removeQuestionCollection();
					}
				}
			}
		}
	};
})();

/*******************************
***********CONTROLLER***********
*******************************/
// 3
var controller = (function(quizCtrl, UICtrl) {
	var selectedDomItems = UICtrl.getDomItems;

	UICtrl.addInputsDynamically();

	UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

	selectedDomItems.questInsertBtn.addEventListener('click', function() {
		var adminOptions = document.querySelectorAll('.admin-option');
		var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
		if (checkBoolean) {
			UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
		}
	});

	selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
		UICtrl.editQuestList(
			e,
			quizCtrl.getQuestionLocalStorage,
			UICtrl.addInputsDynamically,
			UICtrl.createQuestionList
		);
	});

	selectedDomItems.questsClearBtn.addEventListener('click', function() {
		UICtrl.clearQuestList;
	});
})(quizController, UIController);
