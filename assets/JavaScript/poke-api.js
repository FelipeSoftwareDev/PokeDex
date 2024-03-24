// Não posso me esquecer de importar esse script no final do HTML, se n nada disso vai funcionar!
//Essa função vai basicamente abstrair todo esse trecho de código que dá o resultado do consumo do HTTP.
const pokeApi = {};


function convertPokeApiDetailToPokemon(pokeDetail){
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
return fetch(pokemon.url)
.then((response) => response.json())
.then(convertPokeApiDetailToPokemon)
}

// Atribuindo valores default aos parâmetros da função (offset e limit são os parâmetros, 0 e 10 são seus valores default)

pokeApi.getPokemons = () => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
};

