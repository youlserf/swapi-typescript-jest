import styled from "styled-components";
import arrowLeft from "../assets/arrow-left.svg";

interface HeaderProps {
  title: string;
  showGoBackIcon: boolean;
  onGoBack: () => void;
}

const HeaderContainer = styled.header`
  color: #333333;
  background: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const Title = styled.h1`
  flex: 1;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.0125em;
  color: #ffffff;
  width: 155px;
  height: 20px;
`;

const GoBackIcon = styled.img`
  cursor: pointer;
`;

const Header = ({ title, showGoBackIcon, onGoBack }: HeaderProps) => {
  return (
    <HeaderContainer>
      {showGoBackIcon && (
        <GoBackIcon src={arrowLeft} alt="Go Back" onClick={onGoBack} />
      )}
      <Title style={{ textAlign: showGoBackIcon ? "center" : "left" }}>
        {title}
      </Title>
    </HeaderContainer>
  );
};

export default Header;
