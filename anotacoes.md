Requisições HTTP

URL: https://pokeapi.co/api/v2/pokemon
    ${ip}/${path = caminho de identificação do recurso}

    IP: https://pokeapi.co (Domínio é o mesmo que um IP sendo convertido por um servidor.)
    Path: /api/v2/pokemon (Deste IP eu quero a API na versão 2 e eu quero o recurso pokemon)
    O servidor vai entender que eu to requisitando um pokemon, por isso ele vai trazer a listagem dos pokemons.

    Request method: GET  | POST | PUT | DELET | PATCH | etc
    Get "puxa" a informação | Post adiciona uma informação | PUT atualiza a informação

    De onde serão puxadas as informações(Path Params e Query String):
    id, exemplo: https://pokeapi.co/api/v2/pokemon/1
                 Path^                         id 1^ representando o bulbasaur

     O Query String faz uma query filtrando apenas o valor selecionado associado à chave desejada.            
    Query String: https://pokeapi.co/api/v2/pokemon?type=grass
              Path^  |Query String começa dps do ? ^ e é representada por chave e valor, no caso chave type, valor grass.
    
    Para concatenar, adicionando mais parâmetros na Query, vc usa o &, segue exemplo de 2 filtros
    https://pokeapi.co/api/v2/pokemon?type=grass&name=i
    (Além do pokemon ser tipo grass ele vai precisar ter o nome iniciando em i por exp.)

type = grass
name = i

Exemplo real de Query String:
https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20
Tudo que está dps da interrogação é o query string:
offset=20&limit=20
offset = 20
limit = 20

offset e limit são a paginação da busca, para trafegar menos dados por vez, atravé desses parâmetros podemos "paginar",
se eu quero por exemplo os pokemons iniciais:
offset = 0 limit = 2
vai me dar os 2 primeiros pokemons, se eu mudar o offset para 2, terei os 2 próximos pokemons
Enquanto limit é a quantidade de pokemons da lista que serão "puxados"

offset define a partir de qual posição na lista eu desejo começar a recuperar os dados 
limit determina quantos itens eu quero recuperar a partir dessa posição inicial 

Request Headers
    Configuração das requisições

    Exp Autenticação:
    Authorization: Bearer (Bearer é um tipo de autenticação que veremos)


    Exp: Configurando quais linguas ele aceita e quais são prioridade
    accept-language:
    pt-BR (sem valor depois, quer dizer q é prioridade máxima)
    pt;q=0.9 (0.9 é o nível de prioridade, no caso se não tiver pt-BR ele já vai atrás do pt)
    en-US;q=0.8 (Não tendo nenhum dos pt disponíveis, o browser vai atrás do ingles americano)
    en;q=0.7 (inglês geral. As prioridades vão de 0 a 1 e não inserir valor é o mesmo que inserir 1)
    gl;q=0.6 (GL é global, o browser vai aceitar qualquer lingua, mas dará prioridade às citadas anteriormente)

    Request Body:
    Os dados que a requisição vai passar, no caso faz sentido em POST e PUT porque tem que dizer quais dados você está adicionando
    mas não faz tanto sentido em um GET ou DELET por exemplo.

    STATUS CODE:
    O status da requisição oq aconteceu com ela, exp:
    200-299 Requisição processada normalmente
    300-399 Redirect
    400-499 Erro no client
    500-599 Erro interno no Servidor

    Response Headers
    Configuração das respostas, para sabermos interpretá-la



Response Body:
A resposta da requisição, com as informações que ele tem que retornar, no exemplo da PokeApi quando vc acessa ela te retorna um JSON no body do GET.





> Os 2 são basicamente a configuração da nossa API

Fazendo a primeira requisição pelo JS
Será uma requisição que retorna um json, para isso usaremos o fetch

criar algumas variáveis para ter um controle melhor, serão usadas para páginar a aplicação, passadas no querry string.
A querry string também será salva em uma variável para ser usada no fetch

const offset = 0
const limit = 10
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

// Usaremos o fetch API para fazer a requisição, ele é uma biblioteca que já está innstalada no js do browser, então não precisamos baixar nada nos browsers mais modernos, lembrando que o fetch sempre usa o método get por padrão.

// O fetch retorna uma promise ( usado para ter assincronismo no javascript ) como o nome já diz ela é uma promessa de um response, conforme a busca for executada uma hora vc vai receber o objeto response se der tudo certo.
// O fetch vai ficar aguardando a resposta do servidor e quando chegar a resposta do servidor ele vai chamar o método .then que foi passado como callback
// O retorno do fetch é uma stream de dados, por padrão, posteriormente perceba como transformarei isso em um json

// o método .then serve para processar a response, ele vai receber a response como parametro

fetch(url) .then( function(response){
    console.log(response)
})

Nesse caso estamos apenas retornando a resposta no console para verificar que funcionou, perceba que a URL está usando um querry string pegando como offset e limit o que foi passado na variável.

Perceba que o body da resposta veio como ReadableStream, ou seja uma stream de dados e teremos que converter isso para Json, pra isso vamo adicionar uma função no nosso código anterior, ficando assim:

fetch(url) 
    .then( function(response){

        // o .json me da uma promisse de "any" ou seja um objeto já convertido em json de qualquer tipo, já que o javascript n tem tipagem.

        response.json().then(function(responseBody){
            console.log(responseBody)
            .catch(function(error){
                console.log(error)
            })
            .finally(function(){
                console.log('Requisição Concluída)
            })
    })

    })
    .catch(function(error){
        console.error(error)
    })
    .finally(function(){
        console.log('Requisição concluída')
    })

    Esse código começa a ficar muito complexo e confuso, para enchutar ele vamos usar um método .then seguido do outro
    dessa forma conseguiremos que o primeiro then seja executado transformando a response em um json e o segundo .then trabalhe com essa response já convertida.
    Assim a gente evita de tá fazendo um callback em cima do outro, que tornaria o código extenso e propenso a dar algum
    erro.
    
    O resultado do primeiro then vai ser desencadeado para o segundo

    exemplo do código melhor trabalhado:

    fetch(url)
        .then(function (response){
            return response.json
        })
        .then(function (jsonBody){
            //No parâmetro dessa função o response já é um objeto json, convertido anteriormente pelo primeiro.then
            // Para deixar isso claro, vou mudar o nome do parametro para jsonBody
            console.log(jsonBody)
        })
        .catch(function(error){
            console.error(error)
        })

        Para deixar o código ainda mais enchuto vamos usar as arrow functions:
        Lembrando que Arrow Functions são mais usadas nesse nosso contexto de call back, porque ela não vai ser invocada novamente depois, por isso é uma função anonima e de sintaxe reduzida.

        Como a função só tem uma linha, não precisamos nem definir o corpo dela, apenas colocar a arrow function seguida do seu retorno!!

        fetch(url) 
    .then((response) => response.json())
    .then((jsonBody)=>console.log(jsonBody))
    .catch((error) => console.error(error))
    .finally(()=>console.log('Requisição concluída'))

    // No nosso projeto ainda vamos tirar o finally, n será usado por enquanto.










*Sempre* adicionar o JavaScript no final da página, para que ele seja carregado após toda a parte visual, assim as funções de comportamento do site não impacam o carregamento do resto da página.


O node tem tanto alguma estruturas que são para o funcionamento do servidor, quanto algumas estruturas para o funcionamento e manipulação do browser.

window é o obj que representa o browser para o javascript

o Documento é o documento corrente, no caso o HTML se ele estiver inserido na página html, serve para manipular o documento em questão.

Para pegar um elemento do HTML pelo seu id e usar no script do jscom o método get

document.getElementById("idDoElemento")


Normalize CSS: Vai tornar todo o css padrão para qualquer navegador, ent tanto no chrome quanto no Mozila o css vai se comportar da mesma forma, por exemplo.

------------------------------

Vamos aplicar primeiro o estilo CSS Mobile e pras telas posteriores vamos incrementar o CSS (MOBILE FIRST o nome da técnica)

---------------

const pokemonList = document.getElementById('pokemonList')
pokemonList.innerHTML += '<li>Teste</li>'

document vai acessar o html que foi renderizado no browser (nossa página principal)

getElementById('pokemonList') vai pegar a nossa lista de pokemons
e estamos atribuindo isso a uma variável

pokemonList.innerHTML += '<li>Teste</li>': Aqui estamos somando o HTML que ele já tinha com um novo item.

Código final:

//Aqui pegamos nossa lista HTML
const pokemonList = document.getElementById('pokemonList')

pegamos a lista com a requisição HTTP
fetch(url)
  .then((response) => response.json())
  .then((jsonBody) => jsonBody.results)
  .then((pokemons) => {

    //com a lista já convertida em array estamos agora transformando ele em uma estrutura de li e concatenando sempre
    // ao final das ol

    for (let i = 0; i < pokemons.length; i++) {
      const pokemon = pokemons[i];
      pokemonList.innerHTML += convertPokemonToLi(pokemon)
    }

  })
  .catch((error) => console.error(error));

Porém no método acima o navegador vai ficar renderizando a lista inteira toda vez que for concatenar um item na lista, então para evitar isso vamos criar um Array e fazer um push nesse array a cada pokemon listado, para finalmente mandar o array inteiro pra o navegador renderizar, dessa forma: 


const pokemonList = document.getElementById('pokemonList')

// Aqui vamos invocar a função que nos da o resultado do consumo do HTTP e usar seu resultado para adquirir a lista dos pokemons (criado em outro arquivo.)

pokeApi.getPokemons().then((pokemons) => {
  const listItems = []
    
    for (let i = 0; i < pokemons.length; i++) {
      const pokemon = pokemons[i];
      listItems.push(convertPokemonToLi(pokemon))
    }
    console.log(listItems)

  })
  .catch((error) => console.error(error));

Uma forma muito mais resumida de fazer isso é utilizando o método map do JavaScript, ele fará a mesma coisa que esse trecho de código que está adicionando itens de uma lista em um array para converter uma li em HTML, segue o exemplo: 

const pokemonList = document.getElementById('pokemonList')

// Aqui vamos invocar a função que nos da o resultado do consumo do HTTP e usar seu resultado para adquirir a lista dos pokemons
                             v Perceba que passei um "default" a pokemons, afim de criar array vazio caso não receba valores
pokeApi.getPokemons().then((pokemons = []) => {
 
  // Essa função vai transformar um pokemon em uma string, que é o nome dele.

  const newList = pokemons.map((pokemon) => {
    //E aí novamente estamos usando o convertToLi para converter em uma lista HTML
    return convertPokemonToLi(pokemon)
  })
  // O método join está jutando as listas HTML para serem concatenadas, o parametro ('') serve para limpar o valor deafault
  // do join, que separaria as listas por vírgula.
    const newHtml = newList.join('')

    pokemonList.innerHTML += newHtml
  
})

// Este trecho reduz a verbosidade do código usando o map para 
  // Substituir o laço for que ia listar os pokemons de um a um, Além de utilizar a arrow Function e usar o innerHTML direto na função map e não invocando ela posteriormente, fora  também está na mesma linha sendo usado tudo no mesmo bloco de  código
  
  
function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon">
          <span class="number">#001</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
            <ol class="types">
              <li class="type">grass</li>
              <li class="type">poison</li>
            </ol>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg" 
          alt="${pokemon.name}">
        </div>
        </li>
    `;
}

const pokemonList = document.getElementById('pokemonList')


pokeApi.getPokemons().then((pokemons = []) => {
  
  pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('')
})


Usando o modelo da API do pokeApi o código funciona dessa forma:

function convertPokemonTypesToLi(pokemonTypes) {
  return pokemonTypes.map((typeSlot) => `<li class="type">${typeSlot.type.name}`)
}


function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon">
          <span class="number">#${pokemon.order}</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
            <ol class="types">
                ${convertPokemonTypesToLi(pokemon.types).join('')}
            </ol>
          <img src="${pokemon.sprites.other.dream_world.front_default}" 
          alt="${pokemon.name}">
        </div>
        </li>
    `;
}

const pokemonList = document.getElementById('pokemonList')

// Aqui vamos invocar a função que nos da o resultado do consumo do HTTP e usar seu resultado para adquirir a lista dos pokemons
                          
pokeApi.getPokemons().then((pokemons = []) => {
  const newHtml = pokemons.map(convertPokemonToLi).join('')
  pokemonList.innerHTML = newHtml
})

Agora vamos mudar o modelo da pokeApi para um modelo próprio, personalizado e apenas com as chaves necessárias.
