import { render, act, fireEvent } from "@testing-library/react";
import PeopleList from "../components/PeopleList";
import { fetchCharacters } from "../services/api";

// Mock the fetchCharacters function
jest.mock("../services/api", () => ({
  fetchCharacters: jest.fn(),
}));

describe("PeopleList", () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    (fetchCharacters as jest.Mock).mockReset();
  });

  test("renders loading state while fetching characters", async () => {
    // Set up the mock implementation to return a promise that never resolves
    (fetchCharacters as jest.Mock).mockResolvedValue(new Promise(() => {}));

    // Render the component
    const { getByText } = render(<PeopleList />);

    // Check that the loading text is displayed
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state when fetching characters fails", async () => {
    // Set up the mock implementation to throw an error
    (fetchCharacters as jest.Mock).mockRejectedValue(
      new Error("Error fetching characters")
    );

    // Render the component
    const { getByText } = render(<PeopleList />);

    // Wait for the component to finish rendering
    await act(async () => {});

    // Check that the error message is displayed
    expect(getByText("Failed to load data")).toBeInTheDocument();
  });

  test("renders character items when characters are fetched successfully", async () => {
    // Set up the mock implementation to return an array of characters
    const characters = [
      {
        name: "Luke Skywalker",
        hair_color: "blond",
        skin_color: "fair",
        eye_color: "blue",
        birth_year: "19BBY",
        homeworld: "Tatooine",
        url: "https://swapi.dev/api/people/1/",
        species: ["Human"],
        vehicles: ["https://swapi.dev/api/vehicles/14/"],
      },
      // Add more characters if needed
    ];
    (fetchCharacters as jest.Mock).mockResolvedValue(characters);

    // Render the component
    const { getByText } = render(<PeopleList />);

    // Wait for the component to finish rendering
    await act(async () => {});

    // Check that the character items are rendered
    for (const character of characters) {
      expect(getByText(character.name)).toBeInTheDocument();
    }
  });
});
