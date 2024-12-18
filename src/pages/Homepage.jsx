import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import imageLeft from '../assets/imgs/playnow.png';
import imageRight from '../assets/imgs/create.png';
import EditModal from '../components/modals/Edit';

const Homepage = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handlePlayClick = () => {
    navigate('/library');
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <MainContent>
      {/* Trang 1 */}
      <Section>
        <Placeholder>Video minh họa hoặc nội dung chính của trang</Placeholder>
      </Section>

      {/* Trang 2 */}
      <SecondSection>
        <ImageContainer>
          <Image src={imageLeft} alt="Chơi ngay" />
          <ActionButton onClick={handlePlayClick}>Chơi ngay</ActionButton>
        </ImageContainer>
        <Divider />
        <ImageContainer>
          <Image src={imageRight} alt="Tạo ô chữ" />
          <ActionButton onClick={handleCreateClick}>Tạo ô chữ</ActionButton>
        </ImageContainer>
      </SecondSection>

      <EditModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        mode="create"
        onCrosswordCreate={(crosswordData) => {
          navigate('/create', { 
            state: { 
              crosswordId: crosswordData.id,
              crosswordInfo: crosswordData 
            } 
          });
        }}
      />
    </MainContent>
  );
};

export default Homepage;

// Styled-components
const MainContent = styled.main`
  padding: 20px;
`;

const Section = styled.section`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Placeholder = styled.div`
  font-size: 1.5rem;
  color: #666;
  text-align: center;
`;

const SecondSection = styled.div`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Image = styled.img`
  width: 50%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Divider = styled.div`
  width: 2px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 20px;
`;

const ActionButton = styled.button`
  position: absolute;
  font-family: 'Bungee Shade', cursive;
  font-size: 3rem;
  color: white;
  border: none;
  background: none;
  cursor: pointer;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  &:hover {
    text-shadow: 4px 4px 9px rgba(0, 0, 255, 0.8);
  }
`;
