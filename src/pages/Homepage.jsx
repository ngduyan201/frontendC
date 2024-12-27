import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import imageLeft from '../assets/imgs/playnow.png';
import imageRight from '../assets/imgs/create.png';
import EditModal from '../components/modals/Edit';
import demoVideo from '../assets/videos/demo.mp4';

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
      {/* Trang 1 - Hero Section */}
      <HeroSection>
        <LeftColumn>
          <WelcomeText>
            <Title>Chào mừng bạn đến với Trò chơi Ô chữ!</Title>
            <Description>
              Nơi học tập trở nên thú vị và đầy hứng khởi! Khám phá kho tàng kiến thức qua những ô chữ độc đáo, thử thách trí tuệ của bạn với các câu đố hấp dẫn.
            </Description>
            <Features>
              <Feature> Trải nghiệm học tập tương tác</Feature>
              <Feature> Rèn luyện tư duy logic</Feature>
              <Feature> Mở rộng vốn kiến thức</Feature>
              <Feature> Thi đấu vui vẻ cùng bạn bè</Feature>
            </Features>
            <CallToAction>
              Bắt đầu hành trình khám phá ngay hôm nay!
            </CallToAction>
          </WelcomeText>
        </LeftColumn>
        <RightColumn>
          <StyledVideo autoPlay muted loop controls>
            <source src={demoVideo} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </StyledVideo>
        </RightColumn>
      </HeroSection>

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

const HeroSection = styled.section`
  display: flex;
  min-height: 600px;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding-right: 40px;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const WelcomeText = styled.div`
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Features = styled.div`
  margin: 2rem 0;
`;

const Feature = styled.div`
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0.8rem 0;
  display: flex;
  align-items: center;
  
  &:before {
    content: "";
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
    margin-right: 12px;
  }
`;

const CallToAction = styled.div`
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
  margin-top: 2rem;
  padding: 1rem 0;
  text-align: center;
  background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent);
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  background-color: transparent;
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
