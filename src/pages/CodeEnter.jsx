import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CodePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <BackButton onClick={() => navigate('/library')}>
        <i className="fas fa-arrow-left" /> Quay về Thư viện
      </BackButton>
      
      <Message>
        <Icon>🚧</Icon>
        <Text>Tính năng đang phát triển</Text>
        <SubText>Cảm ơn bạn đã quan tâm!</SubText>
      </Message>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 300px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.1rem;
  }
`;

const Message = styled.div`
  text-align: center;
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const Text = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const SubText = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

export default CodePage; 