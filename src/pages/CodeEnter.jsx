import React from 'react';
import styled from 'styled-components';

const CodePage = () => {
  return (
    <Container>
      <Message>
        <Icon>🚧</Icon>
        <Text>Tính năng đang phát triển</Text>
        <SubText>Cảm ơn bạn đã quan tâm!</SubText>
      </Message>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 300px); // Tăng giá trị trừ đi để giảm chiều cao
  display: flex;
  justify-content: center;
  align-items: center;
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