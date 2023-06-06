import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PullToRefresh from "react-pull-to-refresh";
import DetailPerson from "./DetailPerson";
import PersonItem, { ListItem } from "./PersonItem";
import Loader from "../Loader";

import Header from "./Header";

import { fetchPersons } from "../../services/api";
import { Person } from "../../models/Models";

const PeopleList = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoBackIcon, setShowGoBackIcon] = useState(false);

  const [nextPage, setNextPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const refreshPeople = async () => {
    setNextPage(1);
    setSelectedPerson(null);
    setPeople([]);
    fetchMorePeople();
  };

  const fetchMorePeople = async () => {
    try {
      if (isLoading) {
        return;
      }

      setError(null);
      setIsLoading(true);
      const persons = await fetchPersons(nextPage);
      const newPeople = [...people, ...persons];
      setPeople(newPeople);

      setNextPage(nextPage + 1);
    } catch (error) {
      setError("Error fetching persons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResize = () => {
    const shouldShowGoBackIcon = window.innerWidth < 550;
    setShowGoBackIcon(shouldShowGoBackIcon);
    if (selectedPerson && window.innerWidth < 550 && containerRef.current) {
      containerRef.current.style.display = "none";
    } else {
      if (containerRef.current) {
        containerRef.current.style.display = "flex";
      }
    }
  };

  useEffect(() => {
    fetchMorePeople();
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedPerson]);

  const handleGoBack = () => {
    setSelectedPerson(null);
  };

  return (
    <Container>
      <Header
        title={
          selectedPerson && showGoBackIcon
            ? selectedPerson.name
            : "People of Star Wars"
        }
        showGoBackIcon={!!(selectedPerson && showGoBackIcon)}
        onGoBack={handleGoBack}
      />
      <MainContent>
        <div
          ref={containerRef}
          style={{
            borderRight: showGoBackIcon ? "" : "1px solid rgba(0, 0, 0, 0.1)",
            paddingRight: "32px",
            maxWidth: "350px",
            minWidth: "350px",
            maxHeight: "100vh",
            minHeight: "100vh",
            flex: 2,
            zIndex: 1,
          }}
        >
          <PersonsContainer>
            <PullToRefresh
              onRefresh={() => refreshPeople()}
              style={{ minHeight: "100%" }}
            >
              {!error && !isLoading && (
                <>
                  {people.map((person, index) => (
                    <PersonItem
                      key={index}
                      person={person}
                      setSelectedPerson={setSelectedPerson}
                      setError={setError}
                      setIsLoading={setIsLoadingDescription}
                      isLoading={isLoadingDescription}
                    />
                  ))}
                  <div
                    style={{
                      paddingBottom: "16px",
                      paddingTop: "16px",
                      display: "flex",
                      justifyContent: "center",
                      minWidth: "100%",
                    }}
                  >
                    {people.length > 0 && (
                      <Button onClick={fetchMorePeople}>Fetch More</Button>
                    )}
                  </div>
                  <div
                    style={{
                      paddingBottom: "16px",
                      paddingTop: "16px",
                      backgroundColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    <p>Spacer</p>
                  </div>
                </>
              )}

              {isLoading && !selectedPerson ? (
                <LoadingText>
                  <Loader /> <p>Loading...</p>
                </LoadingText>
              ) : (
                error && (
                  <div style={{ minHeight: "100%", paddingTop: "16px" }}>
                    <ErrorText>Failed to load data</ErrorText>
                  </div>
                )
              )}
            </PullToRefresh>
          </PersonsContainer>
        </div>
        {!isLoading && selectedPerson && (
          <InformationContainer>
            <div style={{ paddingLeft: "16px", paddingRight: "16px" }}>
              <DetailPerson person={selectedPerson} />
            </div>
          </InformationContainer>
        )}
      </MainContent>
    </Container>
  );
};

export default PeopleList;

const Container = styled.div`
  min-width: 350px;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
`;

const PersonsContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  background-color: white;
  flex: 1;
  max-height: 100%;
  overflow-y: scroll;
  padding-bottom: 4rem;

  /* Customize the scrollbar */
  ::-webkit-scrollbar {
    width: 0px; /* Width of the scrollbar */
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent; /* Transparent background */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2); /* Transparent background with opacity */
    border-radius: 4px; /* Rounded corners */
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(
      0,
      0,
      0,
      0.4
    ); /* Transparent background with opacity on hover */
  }
`;

const InformationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  @media (max-width: 550px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    transition: all 0.5;
  }
`;

const LoadingText = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorText = styled.p`
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  color: #ec5757;
  text-align: center;
`;

const Button = styled.button`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  min-height: 3rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;

  &:hover,
  &:focus {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(0, 0, 0, 0.65);
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    background-color: #f0f0f1;
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    color: rgba(0, 0, 0, 0.65);
    transform: translateY(0);
  }
`;
