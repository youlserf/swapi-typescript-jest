import arrowIcon from "../../assets/arrow-right.svg";
import styled from "styled-components";
import { Person, Vehicle } from "../../models/Models";
import { useState } from "react";

interface PersonItemProps {
  person: Person;
  setSelectedPerson: (person: Person) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  setError: (error: string) => void;
}

const PersonItem = ({
  person,
  setSelectedPerson,
  setError,
}: PersonItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonClick = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const vehiclesUrls: string[] = person.vehicles;
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
      const updatedPerson: Person = {
        ...person,
        vehicles: vehiclesData.length > 0 ? vehiclesData : ["No vehicles"],
      };

      setSelectedPerson(updatedPerson);
    } catch (error) {
      setError("Error fetching person vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ListItem onClick={handlePersonClick}>
      <div>
        <PersonName>{person.name}</PersonName>
        <PersonDescription>
          {person.species[0]} from {person.homeworld}
        </PersonDescription>
      </div>
      <img src={arrowIcon} alt="Arrow Icon" />
    </ListItem>
  );
};

export default PersonItem;

const ListItem = styled.li`
  max-width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
  padding-top: 16px;
  @media (max-width: 450px) {
    padding-right: 25%;
  }
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
