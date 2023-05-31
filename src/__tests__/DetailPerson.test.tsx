import { render, screen } from "@testing-library/react";
import DetailPerson from "../components/DetailPerson";
import { Character } from "../Interfaces";

const mockPerson: Character = {
  name: "Luke Skywalker",
  hair_color: "Blond",
  skin_color: "Fair",
  eye_color: "Blue",
  birth_year: "19BBY",
  homeworld: "Tatooine",
  url: "https://swapi.dev/api/people/1/",
  species: ["https://swapi.dev/api/species/1/"],
  vehicles: [
    "https://swapi.dev/api/vehicles/14/",
    "https://swapi.dev/api/vehicles/30/",
  ],
};

describe("DetailPerson Component", () => {
  beforeEach(() => {
    render(<DetailPerson person={mockPerson} />);
  });

  it("renders general information correctly", () => {
    expect(screen.getByText("General information")).toBeInTheDocument();
    expect(screen.getByText("Eye Color")).toBeInTheDocument();
    expect(screen.getByText(mockPerson.eye_color)).toBeInTheDocument();
    expect(screen.getByText("Hair Color")).toBeInTheDocument();
    expect(screen.getByText(mockPerson.hair_color)).toBeInTheDocument();
    expect(screen.getByText("Skin Color")).toBeInTheDocument();
    expect(screen.getByText(mockPerson.skin_color)).toBeInTheDocument();
    expect(screen.getByText("Birth Year")).toBeInTheDocument();
    expect(screen.getByText(mockPerson.birth_year)).toBeInTheDocument();
  });

  it("renders vehicles correctly", () => {
    expect(screen.getByText("Vehicles")).toBeInTheDocument();
    expect(screen.getByText(mockPerson.vehicles[0])).toBeInTheDocument();
    expect(screen.getByText(mockPerson.vehicles[1])).toBeInTheDocument();
  });
});
