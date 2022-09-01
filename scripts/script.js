//test to get request - working

/* const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
promise.then(load)
function load(promise){
    console.log(promise.data)
} */


//validação criação quizz step1

function validarStep1(){
    let title = () =>{
        const input = document.getElementById('title-quizz-user')
        if(input.value.length >= 20 && input.value.length <= 65){
            return true
        }
        else{
            return false
        }
    }

    let url = () =>{
        const url = document.getElementById('url-quizz-user')
        const urlQuizz = document.createElement('a')
        urlQuizz.href = url.value
        if(urlQuizz.href.includes('http')){
            return true
        }
        else{
            return false
        }
    }

    let questions = () =>{
        let input = document.getElementById('questions-quizz-user')
        //+ na frente da string converte para inteiro ou float também
        input = +input.value
        input = Math.round(input)
        if(input >= 3 && input != NaN){
            console.log(input)
            return true
        }
        else{
            console.log(input)
            return false
        }
    }

    let levels = () =>{
        let input = document.getElementById('levels-quizz-user')
        //+ na frente da string converte para inteiro ou float também
        input = +input.value
        input = Math.round(input)
        if(input >= 2 && input != NaN){
            console.log(input)
            return true
        }
        else{
            console.log(input)
            return false
        }
    }

    if(title() === true && url() === true && questions() === true && levels() === true){
        alert("IR PARA PRÓXIMA PÁGINA")
        return true
    }else{
        alert("Por favor, preencha os dados corretamente.")
        return false
    }
}
