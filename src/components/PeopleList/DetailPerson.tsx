import styled from "styled-components";
import { Person } from "../../models/Models";

interface DetailPersonProps {
  person: Person | null;
}

const DetailPerson = ({ person }: DetailPersonProps) => {
  return (
    <>
      {person && (
        <>
          <Heading>General information</Heading>
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <ListItem>
              <Label>Eye Color</Label>
              <Value>{person.eye_color}</Value>
            </ListItem>
          </div>
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <ListItem>
              <Label>Hair Color</Label>
              <Value>{person.hair_color}</Value>
            </ListItem>
          </div>
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <ListItem>
              <Label>Skin Color</Label>
              <Value>{person.skin_color}</Value>
            </ListItem>
          </div>
          <div
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <ListItem>
              <Label>Birth Year</Label>
              <Value>{person.birth_year}</Value>
            </ListItem>
          </div>
          <Heading>Vehicles</Heading>
          {person.vehicles.map((vehicle: string, index: number) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <ListItem>
                <Value>{vehicle}</Value>
              </ListItem>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default DetailPerson;

const Heading = styled.h2`
  padding-top: 32px;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.0125em;
  color: #333333;
  text-align: start;
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style: none;
  padding-top: 14px;
  padding-bottom: 14px;
  @media (max-width: 750px) and (min-width: 500px) {
    flex-direction: column;
  }
`;

const Label = styled.p`
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.0125em;
  color: #828282;
  text-align: start;
`;

const Value = styled.p`
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.0125em;
  color: #333333;
  text-align: start;
`;
