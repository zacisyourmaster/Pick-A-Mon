//const populateProfile = () => {};
//const populateTable = (moves) => {};
const POKEURI = "https://pokeapi.co/api/v2/pokemon/";
const form = document.querySelector("#poke-search");

const fetchAndDisplayPokemon = async (name) => {
    try {
        const data = await fetchPokemonData(name);
        const pokeInfo = processPokemonInfo(data);
        populatePokemonBio(pokeInfo);
        const moves = data.moves;
        const movesList = processMovesList(moves);
        populateMovesTable(movesList);
        if (!data) return;
    } catch (e) {
        console.error("Error displaying Pokémon:", error);
    }
    //console.log(moves);
    //populateMovesTable(moveList);
};

const fetchPokemonData = async (pokemonName) => {
    try {
        const response = await fetch(POKEURI + pokemonName);
        if (!response.ok) {
            throw new Error("Coundn't find pokemon");
        }
        return await response.json();
    } catch (e) {
        console.error(error);
        return null;
    }
};
const processPokemonInfo = (data) => {
    return {
        name: data.name,
        id: data.id,
        types: data.types.map((t) => t.type.name),
        types: data.types.map((t) => t.type.name),
        height: (data.height / 10).toFixed(1) + " m",
        weight: (data.weight / 10).toFixed(1) + " kg",
        abilities: data.abilities.map((a) => a.ability.name),
        sprite: data.sprites.other["official-artwork"].front_default,
    };
};
const populatePokemonBio = (pokemonInfo) => {
    const pokemonImage = document.getElementById("poke-pic");
    const title = document.getElementById("poke-title");
    const tbody = document.getElementById("poke-bio-table");
    pokemonImage.src = pokemonInfo.sprite;
    title.innerText = pokemonInfo.name;
    tbody.innerHTML = `
  <tr>
    <th>Number</th>
    <td>${pokemonInfo.id}</td>
  </tr>
  <tr>
    <th>Type</th>
    <td>
      ${pokemonInfo.types
          .map((type) => `<span class="font-bold capitalize">${type}</span>`)
          .join(" ")}
      </td>
  </tr>
  <tr>
    <th>Height</th>
    <td>${pokemonInfo.height}</td>
  </tr>
  <tr>
    <th>Weight</th>
    <td>${pokemonInfo.weight}</td>
  </tr>
  <tr>
    <th>Abilities</th>
    <td>
      <ul class="capitalize">
        ${pokemonInfo.abilities
            .map((ability) => `<li>${ability.replace("-", " ")}</li>`)
            .join("")}
      </ul>
    </td>
  </tr>
  `;
};

const processMovesList = (moves) => {
    const levelUpMoves = moves.filter(
        (move) =>
            move.version_group_details.at(-1).move_learn_method.name ===
            "level-up"
    );
    console.log(levelUpMoves);

    return levelUpMoves
        .map((move) => ({
            level: move.version_group_details.at(-1)?.level_learned_at || 0,
            name: move.move.name,
            type: "--",
            category: "--",
            power: "--",
            accuracy: "--",
        }))
        .sort((a, b) => a.level - b.level);
};
const populateMovesTable = (moves) => {
    const tbody = document.querySelector("#moves-list tbody");
    tbody.innerHTML = "";
    moves.forEach((move) => {
        const row = document.createElement("tr");
        const createCell = (content, isURL) => {
            const td = document.createElement("td");
            td.className = "p-2 capitalize";
            if (isURL) {
                const a = document.createElement("a");
                a.className = "underline";
                a.href = content;
                a.target = "_blank";
                a.textContent = "Details";
                td.appendChild(a);
            } else {
                td.textContent = content;
            }
            return td;
        };

        row.appendChild(createCell(move.level, false)); // Level
        row.appendChild(createCell(move.name.replace("-", " "), false)); // Move name
        /* row.appendChild(createCell("--")); // Type placeholder
    row.appendChild(createCell("--")); // Category placeholder
    row.appendChild(createCell("--")); // Power placeholder
    row.appendChild(createCell("--")); // Accuracy placeholder
*/
        row.appendChild(
            createCell("https://pokemondb.net/move/" + move.name, true)
        );
        tbody.appendChild(row);
    });
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pokemonName = document
        .getElementById("pname")
        .value.trim()
        .toLowerCase();
    if (!pokemonName) {
        alert("Please enter a Pokémon name or number");
        return;
    }
    try {
        fetchAndDisplayPokemon(pokemonName);
    } catch (error) {
        console.error("Error:", error);
        alert("Error loading Pokémon data");
    }
});
