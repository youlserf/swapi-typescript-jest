import { Species, Homeworld, Person } from "../models/Models";

const SWAPI_BASE_URL = "https://swapi.dev/api";
const MAX_PAGES = 2;
const FETCH_DELAY = 1000; // 2 seconds

const fetchJson = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching data from ${url}`);
  }
};

const fetchSpecies = async (speciesUrl: string): Promise<Species> => {
  try {
    const data = await fetchJson(speciesUrl);
    const species: Species = {
      name: data.name,
    };
    return species;
  } catch (error) {
    console.error("Error fetching species:", error);
    return { name: "Unknown species" };
  }
};

const fetchHomeworld = async (homeworldUrl: string): Promise<Homeworld> => {
  try {
    const data = await fetchJson(homeworldUrl);
    const homeworld: Homeworld = {
      name: data.name,
    };
    return homeworld;
  } catch (error) {
    console.error("Error fetching homeworld:", error);
    return { name: "Unknown homeworld" };
  }
};

const fetchPersons = async (): Promise<Person[]> => {
  try {
    const persons: Person[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const url = `${SWAPI_BASE_URL}/people/?page=${randomPage}`;
      const { results } = await fetchJson(url);

      const personData = await Promise.all(
        results.map(async (result: Person) => {
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

      persons.push(...personData);

      if (page < MAX_PAGES) {
        // Simulate a delay between requests to avoid API rate limiting
        await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY));
      }
    }

    return persons;
  } catch (error) {
    throw new Error("Error fetching characters");
  }
};

export { fetchPersons };
