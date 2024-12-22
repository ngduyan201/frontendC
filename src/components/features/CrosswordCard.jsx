import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CrosswordCard = memo(({ 
  title = 'Ô chữ không có tên',
  questionCount = 0,
  author = 'Ẩn danh',
  width = '100%',
  height = '150px',
  onClick 
}) => {
  return (
    <CardContainer $width={width} $height={height} onClick={onClick}>
      <Title>{title}</Title>
      <CardFooter>
        <QuestionCount>Số câu hỏi: {questionCount}</QuestionCount>
        <Author>Tác giả: {author}</Author>
      </CardFooter>
    </CardContainer>
  );
});

CrosswordCard.propTypes = {
  title: PropTypes.string,
  questionCount: PropTypes.number,
  author: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func
};

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: ${props => props.$width};
  height: ${props => props.$height};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const QuestionCount = styled.span`
  color: #666;
  font-size: 1rem;
`;

const Author = styled.span`
  color: #666;
  font-size: 1rem;
`;

export default CrosswordCard;
