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
let currentPokemonId = 0;
let language;
let nextPokemon = document.getElementById('nextPokemon');
let prevPokemon = document.getElementById('prevPokemon');

async function init() {
  await getLanguage();
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
    await renderPokedexSpeciesColor(j);    
    formattedPokemonNumber = formatNumber(j);
    await renderPokedexPokemon(i, pokemon, j);
    allPokemon.push(pokemon);
    j++;
  }
  await renderMorePokemon();
}

function formatNumber(number) {
  return number.toString().padStart(3, '0');
}

async function loadMorePokemon() {
  document.getElementById('morePokemon').setAttribute('disabled', 'true');  
  loadPokemonCounter = loadPokemonCounter + morePokemonCounter;
  loadPokemonOffset = loadPokemonOffset + morePokemonCounter;
  pokemonImages = [];
  pokemonBackgroundColor = [];
  allPokemonGerman = [];  
  await loadAllPokemon();
}

async function showPokemonDetail(id,
  pokemon,formattedPokemonNumber, pokemonBackgroundColor, pokemonWeight, pokemonHeight,) {
  currentPokemonId = id;
  document.getElementById('container').classList.toggle('d-none');  
  let visibilityPrev = id === 1 ? 'hidden' : 'visible';
  let visibilityNext = id === loadPokemonCounter ? 'hidden' : 'visible';
  document.getElementById('prevPokemon').style.visibility = visibilityPrev;
  document.getElementById('nextPokemon').style.visibility = visibilityNext;
  document.getElementById('detail').classList.toggle('d-none');
  document.getElementById('right').innerHTML = `#${formattedPokemonNumber}`;
  document.getElementById('headline').style = `background: linear-gradient(${pokemonBackgroundColor}, #9198e5);`;
  document.getElementById('pokemonPicture').innerHTML = `<img class="pokemonImages" src="${pokemonImages[id - 1]}" title="Picture of ${pokemon}" alt="Picture of ${pokemon}">`;
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
  await renderPokemonStats(pokemonSum);
  await renderPokemonType(responseAsJson);
}

async function getPokemonPicture(pokemon) {
  let url = `${API_URL.single}${pokemon}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();
  pokemonImages.push(
    responseAsJson['sprites']['other']['home']['front_default'],
  );
  await getPokemonBmi(responseAsJson, pokemon);
}

async function getPokemonBmi(responseAsJson, pokemon) {  
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
  await translateText();
}

async function getLanguage() {
  language = localStorage.getItem('language');
  if (!language) {
    language = 'en';
    localStorage.setItem('language', language);
  } else if (language == 'en') {
    document.getElementById('languageHeader').classList.add('grayscale');
  } else {
    document.getElementById('languageHeader').classList.remove('grayscale');
  }
  await translateText();
}

nextPokemon.addEventListener('click', function () {  
  let nextPokemonId = currentPokemonId+1;
  if(nextPokemonId <= loadPokemonCounter)
  {    
    let nextPokemonName = language === 'en' ? allPokemon[currentPokemonId] : allPokemonGerman[currentPokemonId];
    let nextPokemonFormattedNumber = formatNumber(nextPokemonId);
    let nextPokemonBackgroundColor = pokemonBackgroundColor[currentPokemonId];
    let nextPokemonWeight = pokemonWeight[currentPokemonId];
    let nextPokemonHeight = pokemonHeight[currentPokemonId];    
    showPokemonDetail(nextPokemonId, nextPokemonName, nextPokemonFormattedNumber, nextPokemonBackgroundColor, nextPokemonWeight, nextPokemonHeight,);
  }
});

prevPokemon.addEventListener('click', function () {  
  let prevPokemonId = currentPokemonId-1;
  if(prevPokemonId >= 1)
  {    
    let prevPokemonName = language === 'en' ? allPokemon[prevPokemonId-1] : allPokemonGerman[prevPokemonId-1];
    let prevPokemonFormattedNumber = formatNumber(prevPokemonId);
    let prevPokemonBackgroundColor = pokemonBackgroundColor[prevPokemonId-1];
    let prevPokemonWeight = pokemonWeight[prevPokemonId-1];
    let prevPokemonHeight = pokemonHeight[prevPokemonId-1];
    showPokemonDetail(prevPokemonId, prevPokemonName, prevPokemonFormattedNumber, prevPokemonBackgroundColor, prevPokemonWeight, prevPokemonHeight,);
  }
});

async function filterNames(){  
  let search = document.getElementById('search').value;
  document.getElementById('nothingFound').classList.add('d-none');
  let erg = 0;  
  search = search.toLowerCase();
  await hidePokemon(search, erg);
}

async function hidePokemon(search, erg){
  let pokemonElements = document.querySelectorAll(".pokemon");
  for (let i = 0; i < pokemonElements.length; i++) {
    let element = pokemonElements[i].innerText;
    if (element.toLowerCase().includes(search)) {
      pokemonElements[i].classList.remove('d-none');
      erg++;
    }
    else
    {
      pokemonElements[i].classList.add('d-none');
    }
  }
  
  if(erg == 0){
    document.getElementById('nothingFound').classList.remove('d-none');
  }
}

async function translateText(){
  if(language === 'en')
  {
    document.getElementById('translate-text').innerHTML = 'Translate';
    document.getElementById('search').placeholder = 'search Pokemon';
    document.getElementById('languageHeader').title = 'translate Names';
    document.getElementById('translateMore').innerHTML = 'Load more ...';
  } else
  {
    document.getElementById('translate-text').innerHTML = 'Übersetzen';
    document.getElementById('search').placeholder = 'Pokemon suchen';
    document.getElementById('languageHeader').title = 'Namen übersetzen';
    document.getElementById('translateMore').innerHTML = 'Mehr laden ...';
  }
}

function enableLoadingButton() {  
    document.getElementById('morePokemon').removeAttribute('disabled');
}