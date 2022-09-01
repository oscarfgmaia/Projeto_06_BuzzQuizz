const urlAPI = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
const quizzList = document.querySelector('.all-quizz ul');
const quizzListPage = document.querySelector('.quizz-list-page');
const createQuizzPage = document.querySelector('.create-quizz');
const doQuizzPage = document.querySelector('.do-quizz-page');
getQuizzList();

// Randomizador
function comparador() {
	return Math.random() - 0.5;
}

// test to get request - working
/* const promise = axios.get(`${urlAPI}`)
promise.then(load)
function load(promise){
    console.log(promise.data)
} */
//
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

	let qIndex = 0;
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
			<li class="${answer.isCorrectAnswer}Answer" onclick="selectAnswer()">
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
function selectAnswer() {
	const selectTheAnswer = document.querySelector('.answers');
	console.log(selectTheAnswer);
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
