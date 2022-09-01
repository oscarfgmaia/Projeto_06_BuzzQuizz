const urlAPI = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
const quizzList = document.querySelector('.all-quizz ul');
const quizzListPage = document.querySelector('.quizz-list-page');
const createQuizzPage = document.querySelector('.create-quizz');
const doQuizzPage = document.querySelector('.do-quizz-page');
let qIndex = 0;
let rightAnswers = 0;
let selectedAnswers = 0;
getQuizzList();

// Randomizador
function comparador() {
	return Math.random() - 0.5;
}

// Ir para a página de criar quizz
function goScreen1() {
	quizzListPage.classList.add('hidden');
	createQuizzPage.classList.remove('hidden');
}

// popular lista geral de quizzes

function getQuizzList() {
	const quizzList = axios.get(`${urlAPI}`);

	quizzList.then(fillQuizList);
	quizzList.catch(getQuizzError);
}

function fillQuizList(promise) {
	const array = promise.data;
	quizzList.innerHTML = '';

	array.forEach((i) => {
		quizzList.innerHTML += `
		<li class="single-quizz" onclick="getQuizzInfo(this)" id="${i.id}" title="${i.title}">
		    <img src=${i.image} alt="${i.title}"/>
		    <div class="gradient-filter"></div>
		    <span>${i.title}</span>
		</li>
		`;
	});
}

function getQuizzError(error) {
	alert(`Erro ${error.response.status}: ${error.response.data}`);
}

// ir para página do quizz
function getQuizzInfo(data) {
	const quizzPage = axios.get(`${urlAPI}/${data.id}`);

	quizzPage.then(goToQuizz);
	quizzPage.catch(getQuizzError);
}

function goToQuizz(promise) {
	const levels = promise.data.levels;
	const questions = promise.data.questions;

	const quizzTitle = document.querySelector('.quizz-header span');
	const quizzImg = document.querySelector('.quizz-header img');
	quizzTitle.innerHTML = `${promise.data.title}`;
	quizzImg.src = `${promise.data.image}`;

	quizzListPage.classList.add('hidden');
	doQuizzPage.classList.remove('hidden');

	fillQuestions(levels, questions);
}

// Popular página do quizz
function fillQuestions(levels, questions) {
	const questionList = document.querySelector('.questions');
	questionList.innerHTML = '';

	qIndex = 0;
	questions.forEach((question) => {
		questionList.innerHTML += `
			<li class="question q${qIndex}">
				<div class="question-header" style="background-color: ${question.color}">
					<span>${question.title}</span>
				</div>
				<ul class="answers">
					<li class="">
						<img src="" alt="couldn't load image" />
						<div class="light-filter hidden"></div>
						<span>Resp 1</span>
					</li>
				</ul>
			</li>
			`;

		const answersList = document.querySelector(`.q${qIndex} .answers`);
		answersList.innerHTML = '';
		const arrayAnswers = question.answers;
		const ramdomAnswers = arrayAnswers.sort(comparador);

		ramdomAnswers.forEach((answer) => {
			answersList.innerHTML += `
			<li class="${answer.isCorrectAnswer}Answer" onclick="selectAnswer(this)">
				<img src="${answer.image}" alt="${answer.text}" />
				<div class="light-filter hidden"></div>
				<span>${answer.text}</span>
			</li>
			`;
		});

		qIndex++;
	});
}

// Seleção de respostas
function selectAnswer(selectedData) {
	const answers = selectedData.parentNode.getElementsByTagName('li');
	console.log(selectedData.classList);

	for (let i = 0; i < answers.length; i++) {
		if (answers[i].classList.contains('selected')) {
			console.log(`já tem resposta selecionada em ${selectedData.parentNode.parentNode.classList}`);
			`1.If \n Selected Answers: ${selectedAnswers} \n Right Answers: ${rightAnswers}`;
			break;
		} else {
			selectedData.classList.add('selected');
			selectedAnswers++;
			for (let i1 = 0; i1 < answers.length; i1++) {
				console.log(
					`2.If \n Selected Answers: ${selectedAnswers} \n Right Answers: ${rightAnswers}`
				);
				if (selectedData.classList.contains('trueAnswer')) {
					rightAnswers++;
					console.log(
						`3.If \n Selected Answers: ${selectedAnswers} \n Right Answers: ${rightAnswers}`
					);
					break;
				}
			}
			break;
		}
	}

	// mudar cor da resposta
	for (let i2 = 0; i2 < answers.length; i2++) {
		if (answers[i2].classList.contains('falseAnswer')) {
			answers[i2].classList.add('wrong');
		} else if (answers[i2].classList.contains('trueAnswer')) {
			answers[i2].classList.add('right');
		}

		if (!answers[i2].classList.contains('selected')) {
			answers[i2].querySelector('.light-filter').classList.remove('hidden');
		}
	}
}

// Recomeçar o quizz

function restartThisQuizz() {
	console.log('restart');
}

// Voltar para HomePage

function returnHome() {
	quizzListPage.classList.remove('hidden');
	doQuizzPage.classList.add('hidden');
}

// validação criação quizz step1

function validarStep1() {
	let title = () => {
		const input = document.getElementById('title-quizz-user');
		if (input.value.length >= 20 && input.value.length <= 65) {
			return true;
		} else {
			return false;
		}
	};

	let url = () => {
		const url = document.getElementById('url-quizz-user');
		const urlQuizz = document.createElement('a');
		urlQuizz.href = url.value;
		if (urlQuizz.href.includes('http')) {
			return true;
		} else {
			return false;
		}
	};

	let questions = () => {
		let input = document.getElementById('questions-quizz-user');
		// + na frente da string converte para inteiro ou float também
		input = +input.value;
		input = Math.round(input);
		if (input >= 3 && input != NaN) {
			console.log(input);
			return true;
		} else {
			console.log(input);
			return false;
		}
	};

	let levels = () => {
		let input = document.getElementById('levels-quizz-user');
		// + na frente da string converte para inteiro ou float também
		input = +input.value;
		input = Math.round(input);
		if (input >= 2 && input != NaN) {
			console.log(input);
			return true;
		} else {
			console.log(input);
			return false;
		}
	};

	if (title() === true && url() === true && questions() === true && levels() === true) {
		alert('IR PARA PRÓXIMA PÁGINA');
		return true;
	} else {
		alert('Por favor, preencha os dados corretamente.');
		return false;
	}
}
