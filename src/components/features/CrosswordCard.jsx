import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaUser, FaQuestion, FaGamepad } from 'react-icons/fa';

const getBackgroundColor = (grade) => {
  const gradeNum = parseInt(grade.replace('Lớp ', ''));
  
  if (gradeNum >= 1 && gradeNum <= 5) {
    return '#adff2f'; // greenyellow
  } else if (gradeNum >= 6 && gradeNum <= 9) {
    return '#87cefa'; // lightskyblue
  } else {
    return '#ffb6c1'; // lightpink (10-12 và các trường hợp khác)
  }
};

const CrosswordCard = memo(({ 
  title = 'Ô chữ không có tên',
  questionCount = 0,
  author = 'Ẩn danh',
  width = '100%',
  height = '150px',
  onClick,
  timesPlayed = 0,
  grade = '1'
}) => {
  return (
    <CardContainer $width={width} $height={height} onClick={onClick} $grade={grade}>
      <Title>{title}</Title>
      <CardFooter>
        <InfoItem>
          <FaQuestion size={18} color="#FF9800" /> {questionCount}
        </InfoItem>
        <InfoItem>
          <FaUser size={18} color="#2196F3" /> {author}
        </InfoItem>
        <InfoItem>
          <FaGamepad size={18} color="#9C27B0" /> {timesPlayed}
        </InfoItem>
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
  onClick: PropTypes.func,
  timesPlayed: PropTypes.number,
  grade: PropTypes.string
};

const CardContainer = styled.div`
  background: ${props => getBackgroundColor(props.$grade)};
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
  min-width: 300px;
  max-width: 400px;

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
  gap: 15px;
  flex-wrap: nowrap;
`;

const InfoItem = styled.span`
  color: #666;
  font-size: 1.1rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    color: #555;
  }
`;

export default CrosswordCard;
