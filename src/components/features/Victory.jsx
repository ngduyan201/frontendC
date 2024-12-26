import React from 'react';
import styled, { keyframes } from 'styled-components';
import confetti from 'canvas-confetti';

const Victory = ({ teamName, onClose }) => {
  // Phát âm thanh khi component mount
  React.useEffect(() => {
    // Tạo audio object
    const victorySound = new Audio('/sounds/victory.mp3');
    victorySound.volume = 0.5; // Điều chỉnh âm lượng (0.0 đến 1.0)
    
    // Phát âm thanh
    victorySound.play().catch(error => {
      console.error('Error playing victory sound:', error);
    });

    // Hiệu ứng confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50;
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
    }, 250);

    return () => {
      clearInterval(interval);
      victorySound.pause(); // Dừng âm thanh khi component unmount
      victorySound.currentTime = 0; // Reset về đầu
    };
  }, []);

  return (
    <VictoryOverlay>
      <VictoryContainer>
        <VictoryTitle>🏆 Chúc mừng chiến thắng 🏆</VictoryTitle>
        <TeamName>{teamName}</TeamName>
        <VictoryMessage>
          Xuất sắc! Các bạn đã thể hiện tuyệt vời trong trò chơi này.
        </VictoryMessage>
        <CloseButton onClick={onClose}>Đóng</CloseButton>
      </VictoryContainer>
    </VictoryOverlay>
  );
};

export default Victory;

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const VictoryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const VictoryContainer = styled.div`
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 800px;
  width: 95%;
  animation: ${fadeIn} 0.5s ease-out;
`;

const VictoryTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  color: #1976D2;
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
`;

const TeamName = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  margin: 20px 0;
  background: linear-gradient(to right, #2196F3, #1976D2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  color: #1976D2;
`;

const VictoryMessage = styled.p`
  font-family: 'Roboto', sans-serif;
  color: #455A64;
  font-size: 1.5rem;
  margin: 20px 0;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(to right, #64B5F6, #42A5F5);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(25, 118, 210, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 20px rgba(25, 118, 210, 0.3);
    background: linear-gradient(to right, #42A5F5, #64B5F6);
  }

  &:active {
    transform: translateY(1px);
  }
`;
