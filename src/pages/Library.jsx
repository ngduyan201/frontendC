import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { crosswordService } from '../services/crosswordService';
import CrosswordCard from '../components/features/CrosswordCard';
import { toast } from 'react-toastify';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryCrosswords, setLibraryCrosswords] = useState({
    random: [],
    mostPlayed: [],
    newest: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLibraryCrosswords = async () => {
      setIsLoading(true);
      try {
        const response = await crosswordService.fetchLibraryCrosswords();
        if (response.success) {
          setLibraryCrosswords(response.data);
        } else {
          toast.error('Không thể tải danh sách ô chữ');
        }
      } catch (error) {
        console.error('Error loading library crosswords:', error);
        toast.error('Có lỗi xảy ra khi tải thư viện');
      } finally {
        setIsLoading(false);
      }
    };

    loadLibraryCrosswords();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <LibraryContainer>
      <SearchContainer>
        <SearchLabel>Nhập nội dung bạn muốn khám phá ở đây:</SearchLabel>
        <SearchInput 
          type="text" 
          placeholder="Tìm kiếm ô chữ..." 
          value={searchQuery}
          onChange={handleSearchChange} 
        />
      </SearchContainer>

      <LibraryContent>
        <LibraryColumn>
          <ColumnHeader>
            <ColumnTitle>Ô chữ ngẫu nhiên</ColumnTitle>
          </ColumnHeader>
          <CrosswordList>
            {libraryCrosswords.random.map((crossword) => (
              <CrosswordCard 
                key={crossword._id}
                title={crossword.title || 'Ô chữ không có tên'}
                questionCount={crossword.questionCount || 0}
                author={crossword.author || 'Ẩn danh'}
              />
            ))}
          </CrosswordList>
        </LibraryColumn>

        <LibraryColumn>
          <ColumnHeader>
            <ColumnTitle>Được chơi nhiều nhất</ColumnTitle>
          </ColumnHeader>
          <CrosswordList>
            {libraryCrosswords.mostPlayed.map((crossword) => (
              <CrosswordCard 
                key={crossword._id}
                title={crossword.title || 'Ô chữ không có tên'}
                questionCount={crossword.questionCount || 0}
                author={crossword.author || 'Ẩn danh'}
              />
            ))}
          </CrosswordList>
        </LibraryColumn>

        <LibraryColumn>
          <ColumnHeader>
            <ColumnTitle>Ô chữ mới nhất</ColumnTitle>
          </ColumnHeader>
          <CrosswordList>
            {libraryCrosswords.newest.map((crossword) => (
              <CrosswordCard 
                key={crossword._id}
                title={crossword.title || 'Ô chữ không có tên'}
                questionCount={crossword.questionCount || 0}
                author={crossword.author || 'Ẩn danh'}
              />
            ))}
          </CrosswordList>
        </LibraryColumn>
      </LibraryContent>

      {isLoading && <LoadingSpinner />}
    </LibraryContainer>
  );
};

export default Library;

// Styled Components
const LibraryContainer = styled.div`
  background-size: cover;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  padding: 15px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchLabel = styled.span`
  font-size: 1.1rem;
  color: #333;
  margin-right: 20px;
  font-weight: 500;
  white-space: nowrap;
`;

const SearchInput = styled.input`
  width: 400px;
  padding: 12px 15px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(102, 102, 102, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const LibraryContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 0 20px;
`;

const LibraryColumn = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColumnHeader = styled.div`
  padding-bottom: 10px;
  border-bottom: 2px solid #333;
  margin-bottom: 20px;
`;

const ColumnTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  text-align: center;
`;

const CrosswordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
