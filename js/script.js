let loadPokemonCounter = 20;
let morePokemonCounter = 20;
let loadPokemonOffset = 0;
let pokemonImages = [];
let pokemonBackgroundColor = [];
let pokemonGermanName = [];
let pokemonWeight = [];
let pokemonHeight = [];
let pokemonStats = [];
let currentImage;
let allPokemon = [];

function init() {
  loadAllPokemon();  
}

/* loading from api */
async function loadAllPokemon() {
  let url = `${API_URL.species}?limit=${loadPokemonCounter}&offset=0`;  
  let response = await fetch(url);
  let responseAsJson = await response.json();
  await showAllPokemon(responseAsJson);
}

/* show pokedex */
async function showAllPokemon(responseAsJson) {
  let pokedex = document.getElementById('pokedex');
  pokedex.innerHTML = '';
  j = 1;
  allPokemon = [];
  for (let i = 0; i < responseAsJson['results'].length; i++) {
    const pokemon = responseAsJson['results'][i]['name'];
    await getPokemonPicture(j);
    await getPokemonBmi(j);
    await renderPokedexSpeciesColor(j);
    formattedPokemonNumber = formatNumber(j);
    await renderPokedexPokemon(i, pokemon);
    allPokemon.push(pokemon);
    j++;    
  }
  await renderMorePokemon();
}

function formatNumber(number) {
  return number.toString().padStart(3, '0');
}

async function loadMorePokemon() {
  loadPokemonCounter = loadPokemonCounter + morePokemonCounter;
  loadPokemonOffset = loadPokemonOffset + morePokemonCounter;
  pokemonImages = [];
  pokemonBackgroundColor = [];
  pokemonGermanName = [];
  loadAllPokemon();
}

async function showPokemonDetail(id, pokemon, formattedPokemonNumber, pokemonBackgroundColor, pokemonWeight, pokemonHeight) {
  document.getElementById('container').classList.toggle('d-none');
  document.getElementById('detail').classList.toggle('d-none');
  document.getElementById('right').innerHTML = `#${formattedPokemonNumber}`;
  document.getElementById('headline').style = `background: linear-gradient(${pokemonBackgroundColor}, #9198e5);`;
  document.getElementById('pokemonPicture').innerHTML = `<img class="pokemonImages" src="${pokemonImages[id]}" title="Picture of ${pokemon}" alt="Picture of ${pokemon}">`;
  await renderPokemonGeneral(pokemon, pokemonWeight, pokemonHeight);
  await loadPokemonStats(pokemon);
}

async function loadPokemonStats(pokemon) {
    pokemonStats = [];
    let url = `${API_URL.single}${pokemon}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let pokemonSum = 0;    
    for (let i = 0; i < responseAsJson['stats'].length; i++) {
      pokemonStats.push(responseAsJson['stats'][i]['base_stat']);
      pokemonSum = pokemonSum + pokemonStats[i];
    }
  renderPokemonStats(pokemonSum);  
  await renderPokemonType(responseAsJson);
}

async function getPokemonPicture(pokemon) {
  let url = `${API_URL.single}${pokemon}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();
  pokemonImages.push(
    responseAsJson['sprites']['other']['home']['front_default'],
  );  
}

async function getPokemonBmi(pokemon){
  let url = `${API_URL.single}${pokemon}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();
  let formattedWeight = responseAsJson['weight'] / 10;
  let formattedHeight = responseAsJson['height'] / 10;
  pokemonWeight.push(formattedWeight);
  pokemonHeight.push(formattedHeight);
}

function closeDetail() {
  document.getElementById('container').classList.toggle('d-none');
  document.getElementById('detail').classList.toggle('d-none');
}

function doNotClose(event) {
  event.stopPropagation();
}

function getLanguage() {
  let language = localStorage.getItem('language');
  document.getElementById('whoAmI').innerHTML = `Zuletzt war ${who} hier!`;
}

function setLanguage() {
  let language = document.getElementById('myInput').value;
  localStorage.setItem('language', language);  
}