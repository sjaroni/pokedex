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

async function renderPokemonType(responseAsJson){
  let pokemonType = document.getElementById('pokemonType');
  let pokemonTypes = responseAsJson['types'].length;
  for (let i = 0; i < pokemonTypes; i++) {
    let element = responseAsJson['types'][i]['type']['name'];
    let backgroundColor = bgColorSpecies[element];    
    pokemonType.innerHTML += `<button class="pokemonTypeButton" style="background-color: ${backgroundColor}">${element}</button>`;
  }
}

async function renderPokemonGeneral(pokemon, pokemonWeight, pokemonHeight){
  document.getElementById('general').innerHTML = `
  <h1>${pokemon}</h1>
  <div id="pokemonType"></div>
  <div id="bmi">
    <div id="pokemonWeight"><span class="value">${pokemonWeight} kg</span><span class="unit">Weight</span></div>
    <div id="pokemonHeight"><span class="value">${pokemonHeight} m</span><span class="unit">Heigth</span></div>
  </div>
  `;
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