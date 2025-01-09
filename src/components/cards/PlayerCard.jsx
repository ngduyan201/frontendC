import React from 'react';
import styled from 'styled-components';
import { FaUser, FaTrophy, FaBriefcase } from 'react-icons/fa';

const PlayerCard = ({ rank, name, crosswordCount, occupation }) => {
  return (
    <CardContainer>
      {/* Thứ hạng */}
      <RankBadge $rank={rank}>{rank}</RankBadge>
      
      {/* Tên người dùng */}
      <UserInfo>
        <FaUser />
        <PlayerName>{name}</PlayerName>
      </UserInfo>

      {/* Số ô chữ - Hiển thị ở giữa và to hơn */}
      <CrosswordCount>
        <FaTrophy />
        <span>{crosswordCount} ô chữ</span>
      </CrosswordCount>

      {/* Nghề nghiệp */}
      <OccupationTag>
        <FaBriefcase />
        <span>{occupation}</span>
      </OccupationTag>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  position: relative;
  transition: transform 0.2s;
  gap: 12px;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    padding: 16px 24px;
    gap: 24px;
  }
`;

const RankBadge = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: ${props => props.$rank === 1 ? '#ffd700' : 
               props.$rank === 2 ? '#c0c0c0' : 
               props.$rank === 3 ? '#cd7f32' : '#a0a0a0'};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: auto;
  
  svg {
    color: #666;
    font-size: 16px;
  }
  
  @media (min-width: 768px) {
    min-width: 150px;
  }
`;

const PlayerName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const CrosswordCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  flex: 1;
  justify-content: center;
  
  svg {
    color: #ffd700;
    font-size: 18px;
  }
`;

const OccupationTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  background: #f5f5f5;
  color: #666;
  font-size: 0.9rem;
  min-width: 120px;
  
  svg {
    color: #888;
    font-size: 14px;
  }
`;

export default PlayerCard;
