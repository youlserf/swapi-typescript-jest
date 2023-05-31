import { Species, Homeworld, Character } from "../Interfaces";

export const fetchSpecies = async (speciesUrl: string): Promise<Species> => {
  try {
    const response = await fetch(speciesUrl);
    const data = await response.json();
    const species: Species = {
      name: data.name,
    };
    return species;
  } catch (error) {
    console.error("Error fetching species:", error);
    return { name: "Unknown species" };
  }
};

export const fetchHomeworld = async (
  homeworldUrl: string
): Promise<Homeworld> => {
  try {
    const response = await fetch(homeworldUrl);
    const data = await response.json();
    const homeworld: Homeworld = {
      name: data.name,
    };
    return homeworld;
  } catch (error) {
    console.error("Error fetching homeworld:", error);
    return { name: "Unknown homeworld" };
  }
};

export const fetchCharacters = async () => {
  try {
    // Fetch data from three pages (page 1 and 2)
    const characters = [];
    for (let i = 1; i <= 2; i++) {
      const page = Math.floor(Math.random() * 10) + 1;
      const response = await fetch(
        `https://swapi.dev/api/people/?page=${page}`
      );

      const data = await response.json();
      const results = data.results;

      const characterData = await Promise.all(
        results.map(async (result: Character) => {
          const species =
            result.species.length > 0
              ? await fetchSpecies(result.species[0])
              : { name: "Not identified" };
          const homeworld = await fetchHomeworld(result.homeworld);

          return {
            name: result.name,
            hair_color: result.hair_color,
            skin_color: result.skin_color,
            eye_color: result.eye_color,
            birth_year: result.birth_year,
            homeworld: homeworld.name,
            url: result.url,
            species: [species.name],
            vehicles: result.vehicles,
          };
        })
      );

      // Simulate a delay of 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      characters.push(...characterData);
    }

    return characters;
  } catch (error) {
    throw new Error("Error fetching characters");
  }
};
