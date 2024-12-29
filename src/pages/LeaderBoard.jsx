import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PlayerCard from '../components/cards/PlayerCard';
import userService from '../services/userService';

const LeaderBoard = () => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await userService.getTopCrosswordCreators();
        
        // Kiểm tra response và lấy data từ response.data
        if (response?.success && Array.isArray(response.data)) {
          setPlayers(response.data);
        } else {
          setPlayers([]);
        }

      } catch (error) {
        setError('Không thể tải bảng xếp hạng');
        setPlayers([]);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <PageContainer>
      <PageTitle>Bảng Xếp hạng top 10 người chơi sở hữu nhiều ô chữ công khai nhất</PageTitle>
      <LeaderboardList>
        {players.length > 0 ? (
          players.map((player, index) => (
            <PlayerCard
              key={player.id}
              rank={index + 1}
              name={player.name}
              crosswordCount={player.crosswordCount}
              occupation={player.occupation}
            />
          ))
        ) : (
          <EmptyMessage>
            {error || 'Chưa có dữ liệu bảng xếp hạng'}
          </EmptyMessage>
        )}
      </LeaderboardList>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
`;

export default LeaderBoard;
