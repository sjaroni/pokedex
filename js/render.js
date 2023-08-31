/* showing each pokemon on pokedex */
function renderPokedexPokemon(i, pokemon) {
  pokedex.innerHTML += /*html*/ `          
  <div onclick="showPokemonDetail(${i}, '${pokemon}', '${formattedPokemonNumber}', '${pokemonBackgroundColor[i]}', '${pokemonWeight[i]}', '${pokemonHeight[i]}')" 
      id="${formattedPokemonNumber}" style="background: linear-gradient(${pokemonBackgroundColor[i]}, #9198e5);" class="pokemon" title="${pokemon}">
    <img class="pokemonImages" src="${pokemonImages[i]}" alt="Picture of ${pokemon}">
    <p class="pokemonName">${pokemon}</p>
  </div>`;
}

/* get infos of species */
async function renderPokedexSpeciesColor(pokemon) {
  let url = `${API_URL.species}${pokemon}`;
  let response = await fetch(url);
  let responseAsJson = await response.json();
  pokemonBackgroundColor.push(responseAsJson['color']['name']);
  pokemonGermanName.push(responseAsJson['names'][5]['name']);
  //pokemonBackgroundColor.push(responseAsJson['color']['name']);
}

/* render color of species */
function renderPokemonType(responseAsJson) {
  let pokemonType = document.getElementById('pokemonType');
  let pokemonTypes = responseAsJson['types'].length;
  for (let i = 0; i < pokemonTypes; i++) {
    let element = responseAsJson['types'][i]['type']['name'];
    let backgroundColor = bgColorSpecies[element];
    pokemonType.innerHTML += `<button class="pokemonTypeButton" style="background-color: ${backgroundColor}">${element}</button>`;
  }
}

/* getting general infos */
function renderPokemonGeneral(pokemon, pokemonWeight, pokemonHeight) {
  document.getElementById('general').innerHTML = `
  <h1>${pokemon}</h1>
  <div id="pokemonType"></div>
  <div id="bmi">
    <div id="pokemonWeight"><span class="value">${pokemonWeight} kg</span><span class="unit">Weight</span></div>
    <div id="pokemonHeight"><span class="value">${pokemonHeight} m</span><span class="unit">Heigth</span></div>
  </div>
  `;
}

/* render basic stats of each pokemon */
function renderPokemonStats(pokemonSum) {
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

/* getting more pokemon? */
async function renderMorePokemon(){  
  let morePokemonCounterText = document.getElementById('morePokemonCounter');
  morePokemonCounterText.innerHTML = ' ' + morePokemonCounter + ' ';
}