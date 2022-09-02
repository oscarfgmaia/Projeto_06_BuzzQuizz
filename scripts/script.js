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
			return true;
		} else {
			return false;
		}
	};

	let levels = () => {
		let input = document.getElementById('levels-quizz-user');
		// + na frente da string converte para inteiro ou float também
		input = +input.value;
		input = Math.round(input);
		if (input >= 2 && input != NaN) {
			return true;
		} else {
			return false;
		}
	};

	if (title() === true && url() === true && questions() === true && levels() === true) {
		alert('IR PARA PRÓXIMA PÁGINA');
		console.log(quizzUserTitle.value)
		console.log(quizzUserUrl.value)
		console.log(quizzUserHowManyQuestions.value)
		console.log(quizzUserHowManyLevels.value)
		return true;
	} else {
		alert('Por favor, preencha os dados corretamente.');
		return false;
	}
}

//falta finalizar a verificação das respostas incorretas
function validarStep2() {
	let textoPergunta = () => {
		const input = document.getElementById('pergunta-texto');
		if (input.value.length >= 20) {
			console.log(input.value)
			return true;
		} else {
			console.log(input.value)
			return false;
		}
	};

	let corPergunta = () => {
		const input = document.getElementById('pergunta-background');
		if (input.value[0] === '#' && input.value.length === 7) {
			const hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F']
			for (let i = 1; i < input.value.length; i++) {
				if (hex.includes(input.value[i]) === false) {
					return false
				}
			}
			return true
		}
		else{
			return false;
		}
	
	}

	let respostaCorreta = () => {
		const input = document.getElementById('resposta-user');
		if (input.value != '') {
			console.log(input.value)
			return true
		}
		console.log(input.value)
		return false
	}
	verificarRespostaIncorreta('wrong-answer-1')
 	verificarRespostaIncorreta('wrong-answer-2')
	verificarRespostaIncorreta('wrong-answer-3')

};

function verificarURL(valueURL) {
	console.log(valueURL)
	if (valueURL.includes('http') === true) {
		console.log("true")
		return true;
	} else {
		console.log("false")
		return false;
	}
};

let verificarRespostaIncorreta = (id) => {
	const wrong = document.querySelector('#'+id);
	let li = wrong.parentNode
	let wrongUrl = li.nextElementSibling.children[0];
	if (wrong.value != '') {
		verificarURL(wrongUrl.value)
	}
}


function popularPerguntas(qtdPerguntas){
	
	for(let i=0; i<qtdPerguntas; i++){
			const pagina = document.querySelector('.user-create-quizz.screen2');
			const botao = document.querySelector('.screen2 .btn')
			const novaPergunta = document.createElement('div');
			novaPergunta.classList.add('container-x');
			novaPergunta.innerHTML = 
			`
				<span class="step title">Pergunta ${i+2}</span>
				<span title="Editar">
					<svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M18.1594 15.4969L19.6038 14.0594C19.8295 13.8348 20.2222 13.992 20.2222 14.3155V20.8471C20.2222 22.0375 19.2517 23.0034 18.0556 23.0034H2.16667C0.970486 23.0034 0 22.0375 0 20.8471V5.03462C0 3.84419 0.970486 2.87837 2.16667 2.87837H14.5122C14.8326 2.87837 14.9951 3.2647 14.7694 3.4938L13.325 4.9313C13.2573 4.99868 13.167 5.03462 13.0677 5.03462H2.16667V20.8471H18.0556V15.7485C18.0556 15.6542 18.0917 15.5643 18.1594 15.4969ZM25.2281 6.43169L13.3747 18.2282L9.2941 18.6774C8.11146 18.8077 7.10486 17.8149 7.23576 16.629L7.68715 12.568L19.5406 0.771533C20.5743 -0.257178 22.2444 -0.257178 23.2736 0.771533L25.2236 2.71216C26.2573 3.74087 26.2573 5.40747 25.2281 6.43169ZM20.7684 7.81978L18.1458 5.20981L9.75903 13.5608L9.42951 16.4942L12.3771 16.1663L20.7684 7.81978ZM23.6934 4.2395L21.7434 2.29888C21.5583 2.1147 21.2559 2.1147 21.0753 2.29888L19.6806 3.68696L22.3031 6.29692L23.6979 4.90884C23.8785 4.72017 23.8785 4.42368 23.6934 4.2395Z"
							fill="black" />
					</svg>
				</span>
			</div>
			`
			pagina.insertBefore(novaPergunta,botao);
		}
}

/*página 1 data*/
let quizzUserTitle = document.getElementById('title-quizz-user')
let quizzUserUrl = document.getElementById('url-quizz-user')
let quizzUserHowManyQuestions = document.getElementById('questions-quizz-user')
let quizzUserHowManyLevels = document.getElementById('levels-quizz-user')
/*

/*págiona 2 data
let criarQuizz = {
	title: quizzUserTitle.value,
	image: quizzUserUrl.value,
	questions: [
		{
			title: "Título da pergunta 1",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				},
				{
					text: "Texto da resposta 3",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				},
				{
					text: "Texto da resposta 4",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 2",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 3",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		}
	],
	levels: [
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		},
		{
			title: "Título do nível 2",
			image: "https://http.cat/412.jpg",
			text: "Descrição do nível 2",
			minValue: 50
		}
	]
}

*/