import React from 'react';
import styled from 'styled-components';

const RegisterSuccessModal = ({ show, onClose, onLoginClick }) => {
  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <SuccessIcon>✓</SuccessIcon>
        <Title>Đăng ký thành công!</Title>
        <Message>
          Tài khoản của bạn đã được tạo thành công. 
          Bạn có thể đăng nhập ngay bây giờ.
        </Message>
        <ButtonGroup>
          <LoginButton onClick={onLoginClick}>
            Đăng nhập ngay
          </LoginButton>
          <CloseButton onClick={onClose}>
            Để sau
          </CloseButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #4CAF50;
  border-radius: 50%;
  color: white;
  font-size: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 15px;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LoginButton = styled(Button)`
  background: #2196F3;
  color: white;
  border: none;

  &:hover {
    background: #1976D2;
  }
`;

const CloseButton = styled(Button)`
  background: white;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

export default RegisterSuccessModal; 