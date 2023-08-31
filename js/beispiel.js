let currentPokemonData;

async function loadPokemon(){
  let url = `https://pokeapi.co/api/v2/pokemon/charmander`;
  let response = await fetch(url);  
  currentPokemonData = await response.json();
  renderPokemon();
}

function renderPokemon(){
  
  let currentPokemon = document.getElementById('currentPokemon');
  currentPokemon.innerHTML = '';
  
  //X currentPokemon.innerHTML = currentPokemonData['name']; // farbe?
  // currentPokemon.innerHTML = currentPokemonData['name'].toUpperCase(); // name
   currentPokemon.innerHTML = currentPokemonData['id']; // nummer
    // https://pokeapi.co/api/v2/pokemon-species/25/
    // von hier yellow! // farbe
    // base_happiness    
    // capture_rate
    // 33 flavor_text
    // 5 language name (deutscher Name)

  // currentPokemon.innerHTML = currentPokemonData['types'][0]['type']['name']; // typ
  
}

/*!SECTION
https://pokeapi.co/api/v2/language/6/

Pokemon nach Farbe zum Sortieren
https://pokeapi.co/api/v2/pokemon-color/
name und url

id

https://pokeapi.co/api/v2/pokemon-species/7/
names, language, name

Einzelnes Pokemon
https://veekun.com/dex/pokemon/pikachu
https://pokeapi.co/api/v2/pokemon/pikachu
https://pokeapi.co/api/v2/pokemon/squirtle
name

  abilities - 0 - ability - name
  abilities - 1 - ability - name



home - front_default

types - 0 - type - name
types - 1 - type - name
height
weight

stats - stat - base_stat und name

Beispiel mit einzeldaten

https://veekun.com/dex/pokemon/search?sort=evolution-chain&introduced_in=1


alle pokemon
https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=40


<span class="unit" title="Total">Total</span><span class="value">${pokemonSum}</span>
*/


