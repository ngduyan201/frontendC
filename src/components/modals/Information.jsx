import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState('solo');

  if (!isOpen) return null;

  const handlePlayClick = () => {
    switch(gameMode) {
      case 'solo':
        navigate('/play');
        break;
      case 'team':
        navigate('/team-play');
        break;
      case 'code':
        navigate('/code-play');
        break;
      default:
        navigate('/play');
    }
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <HeaderSection>
            <HeaderColumn>
              <ModalTitle>Thông tin ô chữ</ModalTitle>
            </HeaderColumn>
            <HeaderColumn>
              <ModalTitle>Chọn chế độ chơi</ModalTitle>
            </HeaderColumn>
          </HeaderSection>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <InfoSection>
            <InfoGroup>
              <InfoLabel>Tên ô chữ:</InfoLabel>
              <InfoValue>{data.name}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Số câu hỏi:</InfoLabel>
              <InfoValue>{data.numQuestions} câu</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Tác giả:</InfoLabel>
              <InfoValue>{data.author}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Cấp lớp:</InfoLabel>
              <InfoValue>{data.grade || 'Chưa xác định'}</InfoValue>
            </InfoGroup>

            <InfoGroup>
              <InfoLabel>Môn học:</InfoLabel>
              <InfoValue>{data.subject || 'Chưa xác định'}</InfoValue>
            </InfoGroup>
          </InfoSection>

          <GameModeSection>
            <GameModeButtons>
              <ModeButton 
                selected={gameMode === 'solo'}
                onClick={() => setGameMode('solo')}
              >
                Chơi một mình
              </ModeButton>
              <ModeButton 
                selected={gameMode === 'team'}
                onClick={() => setGameMode('team')}
              >
                Chơi theo đội
              </ModeButton>
              <ModeButton 
                selected={gameMode === 'code'}
                onClick={() => setGameMode('code')}
              >
                Tổ chức chơi bằng mã code
              </ModeButton>
            </GameModeButtons>
          </GameModeSection>
        </ModalContent>

        <ModalActions>
          <BackButton onClick={onClose}>Quay lại</BackButton>
          <PlayButton onClick={handlePlayClick}>Chơi</PlayButton>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 85vw;
  max-width: 1000px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  text-align: center;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.div`
  padding: 30px 60px;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  gap: 60px;
`;

const InfoSection = styled.div`
  flex: 1;
  border-right: 1px solid #eee;
  padding-right: 40px;
  max-width: 450px;
  margin: 0 auto;
`;

const GameModeSection = styled.div`
  flex: 1;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  max-width: 450px;
  margin: 0 auto;
`;

const GameModeButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 20px;
`;

const ModeButton = styled.button`
  padding: 20px 30px;
  border: 2px solid ${props => props.selected ? '#4CAF50' : '#ddd'};
  border-radius: 12px;
  background-color: ${props => props.selected ? '#4CAF50' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${props => props.selected ? '#45a049' : '#f0f0f0'};
    border-color: ${props => props.selected ? '#45a049' : '#ccc'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const InfoGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  flex: 1;
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  flex: 2;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 30px;
  border-top: 1px solid #eee;
  background-color: #f8f8f8;
  border-radius: 0 0 12px 12px;
`;

const Button = styled.button`
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const BackButton = styled(Button)`
  background-color: #e0e0e0;
  border: none;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const PlayButton = styled(Button)`
  background-color: #4CAF50;
  border: none;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0 60px;
`;

const HeaderColumn = styled.div`
  flex: 1;
  max-width: 450px;
  display: flex;
  justify-content: center;
`;
