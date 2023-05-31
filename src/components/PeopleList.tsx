import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import PullToRefresh from "react-pull-to-refresh";

import arrowLeft from "../assets/arrow-left.svg";
import DetailPerson from "./DetailPerson";
import PersonItem from "./PersonItem";
import Loader from "./Loader";
import { Character } from "../Interfaces";
import Header from "./Header";

import { fetchCharacters } from "../services/api";

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
  gap: 16px;
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
`;

const CharactersContainer = styled.div`
  padding-top: 16px;
  display: flex;
  gap: 16px;
  flex-direction: column;
  background-color: white;
  flex: 1;
  max-height: 100%;
  overflow-y: scroll;

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
  @media (max-width: 500px) {
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

const PeopleList = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoBackIcon, setShowGoBackIcon] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const characters = await fetchCharacters();
      setCharacters(characters);
    } catch (error) {
      setError("Error fetching characters");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const characters = await fetchCharacters();
        setCharacters(characters);
      } catch (error) {
        setError("Error fetching characters");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const shouldShowGoBackIcon = window.innerWidth < 500;
      setShowGoBackIcon(shouldShowGoBackIcon);
      if (selectedPerson && window.innerWidth < 500 && containerRef.current) {
        containerRef.current.style.display = "none";
      } else {
        if (containerRef.current) {
          containerRef.current.style.display = "flex";
        }
      }
    };

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
        showGoBackIcon={selectedPerson && showGoBackIcon ? true : false}
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
          <CharactersContainer>
            <PullToRefresh onRefresh={() => handleRefresh()}>
              {!error && !isLoading && (
                <>
                  {characters.map((character, index) => (
                    <PersonItem
                      key={index}
                      character={character}
                      setSelectedPerson={setSelectedPerson}
                      setError={setError}
                    />
                  ))}
                </>
              )}

              {isLoading ? (
                <LoadingText>
                  <Loader /> <p>Loading...</p>
                </LoadingText>
              ) : (
                error && <ErrorText>Failed to load data</ErrorText>
              )}
            </PullToRefresh>
          </CharactersContainer>
        </div>
        {selectedPerson && (
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
