export interface Vehicle {
  name: string;
}
export interface Person {
  name: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  homeworld: string;
  url: string;
  species: string[];
  //  vehicles: Vehicle[];
  vehicles: string[];
}

export interface Species {
  name: string;
}

export interface Homeworld {
  name: string;
}
