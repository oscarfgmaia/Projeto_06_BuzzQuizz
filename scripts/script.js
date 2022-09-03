const urlAPI = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
const quizzList = document.querySelector('.all-quizz ul');
const quizzListPage = document.querySelector('.quizz-list-page');
const createQuizzPage = document.querySelector('.create-quizz');
const doQuizzPage = document.querySelector('.do-quizz-page');
const resultsBox = document.querySelector('.results-box');
const loading = document.querySelector('.loading-page');
let quizzUrl = {};
let qIndex = 0;
let rightAnswers = 0;
let selectedAnswers = 0;
let levels;
getQuizzList();

// reset variables
function resetVariables() {
	qIndex = 0;
	rightAnswers = 0;
	selectedAnswers = 0;
	console.log(qIndex);
	console.log(rightAnswers);
	console.log(selectedAnswers);
}

// Randomizador
function comparador() {
	return Math.random() - 0.5;
}

// Mostrar carregando página
function loadingPage() {
	if (loading.classList.contains('hidden')) {
		loading.classList.remove('hidden');
	} else {
		loading.classList.add('hidden');
	}
}

// Ir para a página de criar quizz
function goScreen1() {
	quizzListPage.classList.add('hidden');
	createQuizzPage.classList.remove('hidden');
}

// popular lista geral de quizzes

function getQuizzList() {
	const quizzList = axios.get(`${urlAPI}`);
	loadingPage();
	quizzList.then(fillQuizList);
	quizzList.catch(getQuizzError);
}

function fillQuizList(promise) {
	const array = promise.data;
	quizzList.innerHTML = '';
	loadingPage();
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

// Deletar quizz do usuário
function deleteQuizz() {
	if (confirm('Você tem certeza que deseja deletar esse quizz?') === true) {
		console.log('confirmado');
		window.location.reload();
	} else {
		console.log('desistiu');
	}
}

// ir para página do quizz
function getQuizzInfo(data) {
	const quizzPage = axios.get(`${urlAPI}/${data.id}`);
	quizzUrl = data;

	loadingPage();

	quizzPage.then(goToQuizz);
	quizzPage.catch(getQuizzError);
}

function goToQuizz(promise) {
	loadingPage();
	levels = promise.data.levels;
	const questions = promise.data.questions;

	const quizzTitle = document.querySelector('.quizz-header span');
	const quizzImg = document.querySelector('.quizz-header img');
	quizzTitle.innerHTML = `${promise.data.title}`;
	quizzImg.src = `${promise.data.image}`;

	quizzListPage.classList.add('hidden');
	doQuizzPage.classList.remove('hidden');

	fillQuestions(questions);
	const quizzHeader = document.querySelector('.quizz-header');
	quizzHeader.scrollIntoView();
}

// Popular página do quizz
function fillQuestions(questions) {
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

	let scrollToNextQuestion = () => {
		const nextQuestion = selectedData.parentNode.parentNode.nextElementSibling;
		if (nextQuestion !== null) {
			nextQuestion.scrollIntoView();
		}
	};
	setTimeout(scrollToNextQuestion, 2000);

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

	console.log(qIndex);
	console.log(rightAnswers);
	console.log(selectedAnswers);

	if (qIndex === selectedAnswers) {
		resultsBox.classList.remove('hidden');
		setTimeout(showResults, 1000);
		let scrollToResult = () => {
			resultsBox.scrollIntoView();
		};
		setTimeout(scrollToResult, 2000);
	}
}

function showResults() {
	const resultsDiv = document.querySelector('.results');
	resultsDiv.innerHTML = '';
	let score = Math.round((rightAnswers / qIndex) * 100);

	for (let i = 0; i < levels.length; i++) {
		if (score <= levels[i].minValue) {
			resultsDiv.innerHTML = `
			<div class="results-header">
				<p>${levels[i].minValue}</p>
			</div>
			<div class="results-description">
				<img src=${levels[i].image} alt="${levels[i].text}" />
				<div>${levels[i].text}</div>
			</div>
			`;
			break;
		}
	}
	console.log(resultsBox.innerHTML);
}

// Recomeçar o quizz

function restartThisQuizz() {
	resetVariables();
	getQuizzInfo(quizzUrl);
	resultsBox.classList.add('hidden');
	console.log(resultsBox.innerHTML);
	const quizzHeader = document.querySelector('.quizz-header');
	quizzHeader.scrollIntoView();
}

// Voltar para HomePage

function returnHome() {
	window.location.reload();
}

// // mostrar número de caracteres no input (colocar no input ou textarea onkeyup="showChars(this)")

// function showChars(num) {
// 	console.log(num.value.length);
// }

// // mostrar número de caracteres no input (colocar no input ou textarea onkeyup="showChars(this)")

// function showChars(num) {
// 	console.log(num.value.length);
// }

// validação criação quizz step1

let quizzCreated = {
	title: 'Título do quizz',
	image: 'https://http.cat/411.jpg',
	questions: [],
	levels: [],
};

let quizzUserTitle = document.getElementById('title-quizz-user');
let quizzUserUrl = document.getElementById('url-quizz-user');
let quizzUserHowManyQuestions = document.getElementById('questions-quizz-user');
let quizzUserHowManyLevels = document.getElementById('levels-quizz-user');
function validarStep1() {
	/*página 1 data*/
	quizzUserTitle = document.getElementById('title-quizz-user');
	quizzUserUrl = document.getElementById('url-quizz-user');
	quizzUserHowManyQuestions = document.getElementById('questions-quizz-user');
	quizzUserHowManyLevels = document.getElementById('levels-quizz-user');

	let title = () => {
		if (quizzUserTitle.value.length >= 20 && quizzUserTitle.value.length <= 65) {
			return true;
		} else {
			return false;
		}
	};

	let questions = () => {
		// + na frente da string converte para inteiro ou float também
		quizzUserHowManyQuestions = +quizzUserHowManyQuestions.value;
		quizzUserHowManyQuestions = Math.round(quizzUserHowManyQuestions);
		if (quizzUserHowManyQuestions >= 3 && quizzUserHowManyQuestions != NaN) {
			return true;
		} else {
			return false;
		}
	};

	let levels = () => {
		// + na frente da string converte para inteiro ou float também
		quizzUserHowManyLevels = +quizzUserHowManyLevels.value;
		quizzUserHowManyLevels = Math.round(quizzUserHowManyLevels);
		if (quizzUserHowManyLevels >= 2 && quizzUserHowManyLevels != NaN) {
			return true;
		} else {
			return false;
		}
	};

	if (
		title() === true &&
		verificarURL(quizzUserUrl.value) === true &&
		questions() === true &&
		levels() === true
	) {
		alert('IR PARA PRÓXIMA PÁGINA');
		quizzCreated.title = quizzUserTitle.value;
		quizzCreated.image = quizzUserUrl.value;
		const screen1 = document.querySelector('.create-quizz');
		const screen2 = screen1.nextElementSibling;
		screen1.classList.add('hidden');
		screen2.classList.remove('hidden');

		return true;
	} else {
		alert('Por favor, preencha os dados corretamente.');
		return false;
	}
	popularPerguntas(quizzUserHowManyQuestions);
}

//falta finalizar a verificação das respostas incorretas
function validarStep2() {
	let respostaCorreta = () => {
		const input = document.getElementById('resposta-user');
		if (input.value != '') {
			console.log(input.value);
			return true;
		}
		console.log(input.value);
		return false;
	};
	verificarRespostaIncorreta('wrong-answer-1');
	verificarRespostaIncorreta('wrong-answer-2');
	verificarRespostaIncorreta('wrong-answer-3');

	let verificarRespostaIncorreta = (id) => {
		const wrong = document.querySelector('#' + id);
		let li = wrong.parentNode;
		let wrongUrl = li.nextElementSibling.children[0];
		if (wrong.value != '') {
			verificarURL(wrongUrl.value);
		}
	};
}
const perguntasData = [];
function popularPerguntas(qtdPerguntas) {
	for (let i = 1; i < qtdPerguntas; i++) {
		const pagina = document.querySelector('.user-create-quizz.screen2');
		const botao = document.querySelector('.screen2 .btn');
		const novaPergunta = document.createElement('div');
		novaPergunta.classList.add('container-x');
		novaPergunta.setAttribute('id', `index-${i}`);
		novaPergunta.innerHTML = `
				<span class="step title">Pergunta ${i + 1}</span>
				<span title="Editar">
					<svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="chooseQuestion(this)">
						<path
							d="M18.1594 15.4969L19.6038 14.0594C19.8295 13.8348 20.2222 13.992 20.2222 14.3155V20.8471C20.2222 22.0375 19.2517 23.0034 18.0556 23.0034H2.16667C0.970486 23.0034 0 22.0375 0 20.8471V5.03462C0 3.84419 0.970486 2.87837 2.16667 2.87837H14.5122C14.8326 2.87837 14.9951 3.2647 14.7694 3.4938L13.325 4.9313C13.2573 4.99868 13.167 5.03462 13.0677 5.03462H2.16667V20.8471H18.0556V15.7485C18.0556 15.6542 18.0917 15.5643 18.1594 15.4969ZM25.2281 6.43169L13.3747 18.2282L9.2941 18.6774C8.11146 18.8077 7.10486 17.8149 7.23576 16.629L7.68715 12.568L19.5406 0.771533C20.5743 -0.257178 22.2444 -0.257178 23.2736 0.771533L25.2236 2.71216C26.2573 3.74087 26.2573 5.40747 25.2281 6.43169ZM20.7684 7.81978L18.1458 5.20981L9.75903 13.5608L9.42951 16.4942L12.3771 16.1663L20.7684 7.81978ZM23.6934 4.2395L21.7434 2.29888C21.5583 2.1147 21.2559 2.1147 21.0753 2.29888L19.6806 3.68696L22.3031 6.29692L23.6979 4.90884C23.8785 4.72017 23.8785 4.42368 23.6934 4.2395Z"
							fill="black" />
					</svg>
				</span>
			</div>
			`;
		pagina.insertBefore(novaPergunta, botao);
	}
}

function chooseQuestion(elemento) {
	console.log('choose');
	const container = elemento.parentNode.parentNode;
	console.log(container.id);
}

/*página 2 data*/

function verificarURL(valueURL) {
	if (valueURL.includes('http') === true) {
		return true;
	} else {
		return false;
	}
}

function getInfoPage2() {
	console.log('get info 2');
	let quizzUserPerguntaText = document.getElementById('pergunta-texto');
	let quizzUserPerguntaColor = document.getElementById('pergunta-background');
	let quizzUserCorrectAnswer = document.getElementById('resposta-user');
	let quizzUserCorrectUrl = document.getElementById('url-resposta-quizz-user');
	let quizzUserIncorrectAnswer1 = document.getElementById('wrong-answer-1');
	let quizzUserIncorrectAnswer1Url = document.getElementById('wrong-answer-url-1');
	let quizzUserIncorrectAnswer2 = document.getElementById('wrong-answer-2');
	let quizzUserIncorrectAnswer2Url = document.getElementById('wrong-answer-url-2');
	let quizzUserIncorrectAnswer3 = document.getElementById('wrong-answer-3');
	let quizzUserIncorrectAnswer3Url = document.getElementById('wrong-answer-url-3');

	let possibilidadeRespostas = [
		{
			text: quizzUserCorrectAnswer.value,
			image: quizzUserCorrectUrl.value,
			isCorrectAnswer: true,
		},
		{
			text: quizzUserIncorrectAnswer1.value,
			image: quizzUserIncorrectAnswer1Url.value,
			isCorrectAnswer: false,
		},
		{
			text: quizzUserIncorrectAnswer2.value,
			image: quizzUserIncorrectAnswer2Url.value,
			isCorrectAnswer: false,
		},
		{
			text: quizzUserIncorrectAnswer3.value,
			image: quizzUserIncorrectAnswer3Url.value,
			isCorrectAnswer: false,
		},
	];

	let questionObj = {
		title: '',
		color: '',
		answers: [],
	};

	let titlePergunta = () => {
		if (questionObj.title.length >= 20) {
			return true;
		} else {
			return false;
		}
	};

	let corPergunta = () => {
		if (questionObj.color[0] === '#' && questionObj.color.length === 7) {
			const hex = [
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'a',
				'A',
				'b',
				'B',
				'c',
				'C',
				'd',
				'D',
				'e',
				'E',
				'f',
				'F',
			];
			for (let i = 1; i < questionObj.color.length; i++) {
				if (hex.includes(questionObj.color[i]) === false) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	};

	function temConteudo(elemento) {
		if (elemento.text != '') {
			return true;
		}
		return false;
	}
	function urlValida(elemento) {
		if (verificarURL(elemento.image) === true) {
			return true;
		}
		return false;
	}

	let setarInputsTitulosPerguntas = () => {
		questionObj.title = quizzUserPerguntaText.value;
		questionObj.color = quizzUserPerguntaColor.value;
	};
	setarInputsTitulosPerguntas();
	if (titlePergunta() === true && corPergunta() === true) {
		const respostasComConteudo = possibilidadeRespostas.filter(temConteudo);
		console.log('respostasIncorretasComConteudo');
		console.log(respostasComConteudo);
		const respostasComUrlValida = respostasComConteudo.filter(urlValida);
		console.log('respostaComUIRL');
		console.log(respostasComUrlValida);
		if (
			respostasComUrlValida.length === respostasComConteudo.length &&
			respostasComUrlValida.length != 0
		) {
			for (let i = 0; i < respostasComUrlValida.length; i++) {
				if (i === 0) {
					questionObj.answers.push(respostasComUrlValida[i]);
				} else if (i === 1) {
					questionObj.answers.push(respostasComUrlValida[i]);
				} else if (i === 2) {
					questionObj.answers.push(respostasComUrlValida[i]);
				} else if (i === 3) {
					questionObj.answers.push(respostasComUrlValida[i]);
				} else {
					console.log('tem coisa errada');
				}
			}
			quizzCreated.questions.push(questionObj);
		} else {
			console.log('tem coisa errada - validação respostas');
		}
	} else {
		console.log('tem coisa errada - validação titulo');
	}
}

function getInfoPage3() {
	console.log('get info 3');
	let quizzUserLevelTitle = document.getElementById('nivel-title');
	let quizzUserLevelPercentage = document.getElementById('percentage');
	let quizzUserLevelUrl = document.getElementById('url-nivel');
	let quizzUserLevelDescription = document.getElementById('description-nivel');

	let lvlObj = {
		title: '',
		image: '',
		text: '',
		minValue: 0,
	};

	let setarInputs = () => {
		lvlObj.title = quizzUserLevelTitle.value;
		lvlObj.image = quizzUserLevelUrl.value;
		lvlObj.text = quizzUserLevelDescription.value;
		lvlObj.minValue = quizzUserLevelPercentage.value;
	};

	let titleLevel = () => {
		if (quizzUserLevelTitle.value.length >= 10) {
			console.log('title ok');
			return true;
		} else {
			console.log('title failed');
			return false;
		}
	};

	let percentageLevel = () => {
		if (quizzUserLevelPercentage.value != '') {
			let teste = quizzUserLevelPercentage.value;
			teste = +teste;
			if (teste >= 0 && teste <= 100) {
				lvlObj.minValue = teste;
				return true;
			} else {
				console.log('% FAILED');
				return false;
			}
		}
		return false;
	};

	let descriptionLevel = () => {
		if (quizzUserLevelDescription.value.length >= 30) {
			console.log('DESCRIPTION ok');
			return true;
		} else {
			console.log('descrpt failed');
			return false;
		}
	};
	function urlValida(element) {
		if (verificarURL(element.image) === true) {
			console.log('URL ok');
			return true;
		}
		return false;
	}

	setarInputs();
	if (
		titleLevel() === true &&
		percentageLevel() === true &&
		urlValida(lvlObj) &&
		descriptionLevel() === true
	) {
		console.log('ENTROU NO IF');
		quizzCreated.levels.push(lvlObj);
	} else {
		console.log('Não entrou no IF');
	}
	console.log(quizzCreated);
}
