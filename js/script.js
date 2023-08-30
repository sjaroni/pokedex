let loadPokemonCounter = 20;
let morePokemonCounter = 20;
let loadPokemonOffset = 0;
let pokemonImages = [];
let pokemonBackgroundColor = [];
let pokemonWeight = [];
let pokemonHeight = [];
let pokemonStats = [];
let currentImage;
let allPokemon = [];

function init() {
  loadAllPokemon();  
}

async function loadAllPokemon() {
  let url = `${API_URL.species}?limit=${loadPokemonCounter}&offset=0`;  
  let response = await fetch(url);
  let responseAsJson = await response.json();
  await renderAllPokemon(responseAsJson);
}

async function renderAllPokemon(responseAsJson) {
  let pokedex = document.getElementById('pokedex');
  pokedex.innerHTML = '';
  j = 1;
  allPokemon = [];
  for (let i = 0; i < responseAsJson['results'].length; i++) {
    const pokemon = responseAsJson['results'][i]['name'];
    await renderPokedexDetails(j);
    await renderPokedexSpeciesColor(j);
    formattedPokemonNumber = formatNumber(j);
    await renderPokedex(i, pokemon);
    allPokemon.push(pokemon);
    j++;    
  }
  await renderMorePokemonCounter();
}

async function renderMorePokemonCounter(){
  let morePokemonCounterText = document.getElementById('morePokemonCounter');
  morePokemonCounterText.innerHTML = ' ' + morePokemonCounter + ' ';
}

function formatNumber(number) {
  return number.toString().padStart(3, '0');
}

async function loadMorePokemon() {
  loadPokemonCounter = loadPokemonCounter + morePokemonCounter;
  loadPokemonOffset = loadPokemonOffset + morePokemonCounter;
  pokemonImages = [];
  loadAllPokemon();
}

async function showPokemonDetail(id, pokemon, formattedPokemonNumber, pokemonBackgroundColor, pokemonWeight, pokemonHeight) {
  document.getElementById('container').classList.toggle('d-none');
  document.getElementById('detail').classList.toggle('d-none');
  document.getElementById('right').innerHTML = `#${formattedPokemonNumber}`;
  document.getElementById('headline').style = `background-color: ${pokemonBackgroundColor}`;
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
       pokemonStats.push(
        responseAsJson['stats'][i]['base_stat']
       );
      pokemonSum = pokemonSum + pokemonStats[i];
    }
  renderPokemonStats(pokemonSum);  
  await renderPokemonType(responseAsJson);
}

function closeDetail() {
  document.getElementById('container').classList.toggle('d-none');
  document.getElementById('detail').classList.toggle('d-none');
}

function previousImage() {
  currentImage = getCurrentImage();
  if (currentImage == 0) {
    showImage(imagesArrayLength - 1);
  } else {
    showImage(currentImage - 1);
  }
}

function nextImage() {
  currentImage = getCurrentImage();
  if (currentImage == imagesArrayLength - 1) {
    showImage(0);
  } else {
    showImage(currentImage + 1);
  }
}

function getCurrentImage() {
  return +document.getElementById('index').innerHTML;
}

function doNotClose(event) {
  event.stopPropagation();
}
