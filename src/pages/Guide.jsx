import React, { useState } from 'react';
import styled from 'styled-components';

const GuidePage = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' hoặc 'play'

  return (
    <GuideContainer>
      <TabContainer>
        <TabButton 
          $isActive={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Hướng dẫn tạo ô chữ
        </TabButton>
        <TabButton 
          $isActive={activeTab === 'play'} 
          onClick={() => setActiveTab('play')}
        >
          Hướng dẫn chơi
        </TabButton>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'create' ? (
          <div>Nội dung hướng dẫn tạo ô chữ</div>
        ) : (
          <div>Nội dung hướng dẫn chơi</div>
        )}
      </ContentContainer>
    </GuideContainer>
  );
};

export default GuidePage;

const GuideContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 40px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px;
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  background-color: ${props => props.$isActive ? '#4CAF50' : '#e0e0e0'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$isActive ? '#45a049' : '#d0d0d0'};
  }

  &:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ContentContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;
`;