document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const toggleMusicButton = document.getElementById("toggleMusicButton");
    const pokemonInfo = document.getElementById("pokemonInfo");
    const gameList = document.getElementById("pokemonGames");
    const pokemonThemeSong = document.getElementById("pokemonTheme");
    const pokemonTypeContainer = document.getElementById("pokemonType");
    const pokemonName = document.getElementById("pokemonName");
    const pokemonImage = document.getElementById("pokemonImage");
    const pokemonHeight = document.getElementById("pokemonHeight");
    const pokemonWeight = document.getElementById("pokemonWeight");

    let isPlaying = true;

    // Hide Pokémon card at start
    pokemonInfo.style.display = "none";

    // Auto-play music
    function playMusic() {
        pokemonThemeSong.volume = 0.5;
        pokemonThemeSong.play().catch(() => {
            toggleMusicButton.innerHTML = "▶";
            isPlaying = false;
        });
    }

    setTimeout(playMusic, 1000);

    // Toggle Music
    toggleMusicButton.addEventListener("click", function () {
        if (isPlaying) {
            pokemonThemeSong.pause();
            toggleMusicButton.innerHTML = "▶";
        } else {
            pokemonThemeSong.play();
            toggleMusicButton.innerHTML = "⏸";
        }
        isPlaying = !isPlaying;
    });

    searchButton.addEventListener("click", function () {
        let query = searchInput.value.trim().toLowerCase();
        if (!query) {
            alert("Enter a Pokémon or Pokédex ID!");
            return;
        }
        fetchPokemon(query);
    });

    function fetchPokemon(query) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
            .then(response => {
                if (!response.ok) throw new Error("Pokémon not found!");
                return response.json();
            })
            .then(data => {
                displayPokemonData(data);
            })
            .catch(() => {
                alert("Pokémon not found!");
            });
    }

    function displayPokemonData(data) {
        // Update Pokémon Name and Image
        pokemonName.textContent = capitalize(data.name);
        pokemonImage.src = data.sprites.front_default;
        pokemonImage.style.display = "block"; // Ensure image is visible
        pokemonImage.style.margin = "0 auto"; // Center image
        pokemonImage.style.width = "150px";
        pokemonImage.style.height = "150px";

        // Convert Height & Weight
        pokemonHeight.textContent = `Height: ${Math.floor((data.height * 3.937) / 12)}'${Math.round((data.height * 3.937) % 12)}"`;
        pokemonWeight.textContent = `Weight: ${Math.round(data.weight * 0.2205)} lbs`;

        // Clear previous type badges
        pokemonTypeContainer.innerHTML = "";
        data.types.forEach(typeInfo => {
            const typeName = typeInfo.type.name;
            const typeBadge = document.createElement("span");
            typeBadge.textContent = capitalize(typeName);
            typeBadge.classList.add("type-badge", typeName);
            pokemonTypeContainer.appendChild(typeBadge);
        });

        // Clear and update game versions (Basic list, centered)
        gameList.innerHTML = "";
        let gameVersions = data.game_indices.map(g => capitalize(g.version.name));

        if (gameVersions.length > 0) {
            gameList.innerHTML = "" + gameVersions.join(", ");
        } else {
            gameList.innerHTML = "This Pokemon has not appeared in any versions yet.";
        }

        // Show Pokémon Card after Search
        pokemonInfo.style.display = "block";
    }

    function capitalize(str) {
        return str.toUpperCase(); // Make the name fully uppercase
    }
});
