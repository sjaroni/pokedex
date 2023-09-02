let loadPokemonCounter = 20;
let morePokemonCounter = 20;
let loadPokemonOffset = 0;
let pokemonImages = [];
let pokemonBackgroundColor = [];
let allPokemon = [];
let allPokemonGerman = [];
let pokemonWeight = [];
let pokemonHeight = [];
let pokemonStats = [];
let currentImage;
let language;

async function init() {
  getLanguage();
  await loadAllPokemon();
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
  allPokemonGerman = [];
  loadAllPokemon();
}

async function showPokemonDetail(
  id,
  pokemon,
  formattedPokemonNumber,
  pokemonBackgroundColor,
  pokemonWeight,
  pokemonHeight,
) {
  document.getElementById('container').classList.toggle('d-none');
  document.getElementById('detail').classList.toggle('d-none');
  document.getElementById('right').innerHTML = `#${formattedPokemonNumber}`;
  document.getElementById(
    'headline',
  ).style = `background: linear-gradient(${pokemonBackgroundColor}, #9198e5);`;
  document.getElementById(
    'pokemonPicture',
  ).innerHTML = `<img class="pokemonImages" src="${pokemonImages[id]}" title="Picture of ${pokemon}" alt="Picture of ${pokemon}">`;  
  await renderPokemonGeneral(pokemon, pokemonWeight, pokemonHeight);  
  await loadPokemonStats(id);
}

async function loadPokemonStats(id) {
  pokemonStats = [];
  let url = `${API_URL.single}${id}`;
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

async function getPokemonBmi(pokemon) {
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

async function setLanguage() {  
  let flagImage = document.getElementById('languageHeader');  
  flagImage.classList.toggle('grayscale');

  if (flagImage.classList.contains('grayscale')) {
    language = 'en';
  } else {
    language = 'de';
  }  
  localStorage.setItem('language', language);
  await loadAllPokemon();
}

function getLanguage() {  
  language = localStorage.getItem('language');
  if (!language) {
    language = 'en';
    localStorage.setItem('language', language);
  }
  else if (language == 'en')
  {   
    document.getElementById('languageHeader').classList.add('grayscale');
  }
  else{   
    document.getElementById('languageHeader').classList.remove('grayscale');
  }
}