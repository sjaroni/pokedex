let loadPokemonCounter = 20;
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
}

async function renderPokedex(i, pokemon){
  pokedex.innerHTML += /*html*/ `          
  <div onclick="showPokemonDetail(${i}, '${pokemon}', '${formattedPokemonNumber}', '${pokemonBackgroundColor[i]}', '${pokemonWeight[i]}', '${pokemonHeight[i]}')" id="${formattedPokemonNumber}" style="background-color: ${pokemonBackgroundColor[i]}" class="pokemon" title="${pokemon}">
    <img class="pokemonImages" src="${pokemonImages[i]}" alt="Picture of ${pokemon}">
    <p class="pokemonName">${pokemon}</p>
  </div>`;
}

async function renderPokedexDetails(pokemon) {
  let url = `${API_URL.single}${pokemon}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();
  pokemonImages.push(responseAsJson['sprites']['other']['home']['front_default'],);

  let formattedWeight = responseAsJson['weight']/10;
  let formattedHeight = responseAsJson['height']/10;
  
  pokemonWeight.push(formattedWeight,);
  pokemonHeight.push(formattedHeight,);
}

async function renderPokedexSpeciesColor(pokemon) {
  let url = `${API_URL.species}${pokemon}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();
  pokemonBackgroundColor.push(responseAsJson['color']['name']);
}

function formatNumber(number) {
  return number.toString().padStart(3, '0');
}

async function loadMorePokemon() {
  loadPokemonCounter = loadPokemonCounter + 20;
  loadPokemonOffset = loadPokemonOffset + 20;
  pokemonImages = [];
  loadAllPokemon();
}

async function showPokemonDetail(id, pokemon, formattedPokemonNumber, pokemonBackgroundColor, pokemonWeight, pokemonHeight) {
  document.getElementById('container').classList.toggle('d-none');
  document.getElementById('detail').classList.toggle('d-none');
  document.getElementById('right').innerHTML = `#${formattedPokemonNumber}`;
  document.getElementById('headline').style = `background-color: ${pokemonBackgroundColor}`;
  document.getElementById(
    'pokemonPicture',
  ).innerHTML = `<img class="pokemonImages" src="${pokemonImages[id]}" title="Picture of ${pokemon}" alt="Picture of ${pokemon}">`;
  document.getElementById('general').innerHTML = `
    <h1>${pokemon}</h1>
    <div id="pokemonType"></div>
    <div id="bmi">
      <div id="pokemonWeight"><span class="value">${pokemonWeight} kg</span><span class="unit">Weight</span></div>
      <div id="pokemonHeight"><span class="value">${pokemonHeight} m</span><span class="unit">Heigth</span></div>
    </div>
    `;

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

async function renderPokemonType(responseAsJson){
  let pokemonType = document.getElementById('pokemonType');
  let pokemonTypes = responseAsJson['types'].length;
  for (let i = 0; i < pokemonTypes; i++) {
    let element = responseAsJson['types'][i]['type']['name'];
    let backgroundColor = bgColorSpecies[element];    
    pokemonType.innerHTML += `<button class="pokemonTypeButton" style="background-color: ${backgroundColor}">${element}</button>`;
  }
}

function renderPokemonStats(pokemonSum){
  document.getElementById('stats').innerHTML = `
    <h2>Base Stats</h2>
    <div class="pokemonStats">
      <div class="statsRow">
        <div class="statsColumn">
          <span class="unit" title="Hit Points">HP</span>
          <span class="value">${pokemonStats[0]}</span>
        </div>
        <div class="statsColumn">
          <span class="unit" title="Attack">Atk</span>
          <span class="value">${pokemonStats[1]}</span>
        </div>
      </div>  
      <div class="statsRow">
        <div class="statsColumn">
          <span class="unit" title="Defense">Def</span>
          <span class="value">${pokemonStats[2]}</span>
        </div>
        <div class="statsColumn">
          <span class="unit" title="Special-Attack">SpA</span>
          <span class="value">${pokemonStats[3]}</span>
        </div>
      </div>
      <div class="statsRow">
        <div class="statsColumn">
          <span class="unit" title="Special-Defense">SpD</span>
          <span class="value">${pokemonStats[4]}</span>
        </div>
        <div class="statsColumn">
          <span class="unit" title="Speed">Spd</span>
          <span class="value">${pokemonStats[5]}</span>
        </div>
      </div>
    </div>
    <h2>Total ${pokemonSum}</h2>
    `;
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
