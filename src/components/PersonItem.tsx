import React from "react";
import arrowIcon from "../assets/arrow-right.svg";
import styled from "styled-components";
import { Character, Vehicle } from "../Interfaces";

interface PersonItemProps {
  character: Character;
  setSelectedPerson: (character: Character) => void;
  setError: (error: string) => void;
}

const ListItem = styled.li`
  max-width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
`;

const PersonName = styled.h2`
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.0125em;
  color: #333333;
`;

const PersonDescription = styled.p`
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.0125em;
  color: #828282;
`;

const PersonItem: React.FC<PersonItemProps> = ({
  character,
  setSelectedPerson,
  setError,
}) => {
  const handleCharacterClick = async () => {
    try {
      const vehiclesUrls: string[] = character.vehicles;
      const vehiclesData: string[] = await Promise.all(
        vehiclesUrls.map(async (vehicleUrl: string) => {
          const vehicleResponse = await fetch(vehicleUrl);
          const vehicleData = await vehicleResponse.json();
          const vehicle: Vehicle = {
            name: vehicleData.name,
          };
          return vehicle.name;
        })
      );
      const updatedCharacter: Character = {
        ...character,
        vehicles: vehiclesData,
      };

      setSelectedPerson(updatedCharacter);
    } catch (error) {
      setError("Error fetching character vehicles");
    }
  };

  return (
    <ListItem onClick={handleCharacterClick}>
      <div>
        <PersonName>{character.name}</PersonName>
        <PersonDescription>
          {character.species[0]} from {character.homeworld}
        </PersonDescription>
      </div>
      <img src={arrowIcon} alt="Arrow Icon" />
    </ListItem>
  );
};

export default PersonItem;
