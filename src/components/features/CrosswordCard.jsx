import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CrosswordCard = ({ title, questionCount, author, width }) => {
  return (
    <CardContainer $width={width}>
      <Title>{title}</Title>
      <CardFooter>
        <QuestionCount>Số câu hỏi: {questionCount}</QuestionCount>
        <Author>Tác giả: {author}</Author>
      </CardFooter>
    </CardContainer>
  );
};

CrosswordCard.propTypes = {
  title: PropTypes.string.isRequired,
  questionCount: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  width: PropTypes.string
};

CrosswordCard.defaultProps = {
  title: 'Ô chữ không có tên',
  questionCount: 0,
  author: 'Ẩn danh',
  width: '100%'
};

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: ${props => props.$width || '100%'};
  min-height: 150px;
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
