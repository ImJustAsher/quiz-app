// Lecture: Create Question List

/*******************************
*********QUIZ CONTROLLER********
*******************************/
var quizController = (function() {
	//*********Question Constructor*********/
	function Question(id, questionText, options, correctAnswer) {
		this.id = id;
		this.questionText = questionText;
		this.options = options;
		this.correctAnswer = correctAnswer;
	}

	var questionLocalStorage = {
		setQuestionCollection: function(newCollection) {
			localStorage.setItem('questionCollection', JSON.stringify(newCollection));
		},
		getQuestionCollection: function() {
			return JSON.parse(localStorage.getItem('questionCollection'));
		},
		removeQuestionCollection: function() {
			localStorage.removeItem('questionCollection');
		}
	};
	if (questionLocalStorage.getQuestionCollection() === null) {
		questionLocalStorage.setQuestionCollection([]);
	}

	let quizProgress = {
		questionIndex: 0
	};

	return {
		getQuizProgress: quizProgress,

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
			} else {
				alert('Please, Insert Question');

				return false;
			}
		},

		checkAnswer: function(ans) {
			if (
				questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer ===
				ans.textContent
			) {
				return true;
			} else {
				return false;
			}
		}
	};
})();

/*******************************
**********UI CONTROLLER*********
*******************************/
var UIController = (function() {
	var domItems = {
		//*******Admin Panel Elements********/
		questInsertBtn: document.getElementById('question-insert-btn'),
		newQuestionText: document.getElementById('new-question-text'),
		adminOptions: document.querySelectorAll('.admin-option'),
		adminOptionsContainer: document.querySelector('.admin-options-container'),
		insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
		questUpdateBtn: document.getElementById('question-update-btn'),
		questDeleteBtn: document.getElementById('question-delete-btn'),
		questsClearBtn: document.getElementById('questions-clear-btn'),
		askedQuestText: document.getElementById('asked-question-text'),
		quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
		progressBar: document.querySelector('progress'),
		progressPar: document.getElementById('progress')
	};

	return {
		getDomItems: domItems,
		addInputsDynamically: function() {
			var addInput = function() {
				var inputHTML, z;

				z = document.querySelectorAll('.admin-option').length;

				inputHTML =
					'<div class="admin-option-wrapper"><input type="radio" class="admin-option-' +
					z +
					'" name="answer" value="' +
					z +
					'"><input type="text" class="admin-option admin-option-' +
					z +
					'" value=""></div>';

				domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

				domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
					'focus',
					addInput
				);

				domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
			};

			domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
		},

		createQuestionList: function(getQuestions) {
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

						domItems.insertedQuestsWrapper.innerHTML = '';
					}
				}
			}
		},

		displayQuestion: function(storageQuestList, progress) {
			let newOptionHTML, characterArr;

			characterArr = [ 'A', 'B', 'C', 'D', 'E', 'F' ];

			if (storageQuestList.getQuestionCollection().length > 0) {
				domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[
					progress.questionIndex
				].questionText;

				domItems.quizOptionsWrapper.innerHTML = '';

				for (
					let i = 0;
					i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length;
					i++
				) {
					newOptionHTML =
						'<div class="choice-' +
						i +
						'"><span class="choice-' +
						i +
						'">' +
						characterArr[i] +
						'</span><p  class="choice-' +
						i +
						'">' +
						storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] +
						'</p></div>';

					domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
				}
			}
		},

		displayProgress: function(storageQuestList, progress) {
			domItems.progressBar.max = storageQuestList.getQuestionCollection().length;

			domItems.progressBar.value = progress.questionIndex + 1;

			domItems.progressPar.textContent =
				progress.questionIndex + 1 + '/' + storageQuestList.getQuestionCollection().length;
		}
	};
})();

/*******************************
***********CONTROLLER***********
*******************************/
let controller = (function(quizCtrl, UICtrl) {
	let selectedDomItems = UICtrl.getDomItems;

	UICtrl.addInputsDynamically();

	UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

	selectedDomItems.questInsertBtn.addEventListener('click', function() {
		let adminOptions = document.querySelectorAll('.admin-option');
		let checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
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
		UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
	});

	UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

	UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

	selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {
		let updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

		for (let i = 0; i < updatedOptionsDiv.length; i++) {
			if (e.target.className === 'choice-' + i) {
				let answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
			}
		}
	});
})(quizController, UIController);
