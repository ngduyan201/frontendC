import React, { useState } from 'react';  
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Modal from '../components/modals/Information.jsx';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleButtonClick = (data) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Sample data for each section
  const randomPuzzles = [
    { 
      name: 'Ô chữ về động vật', 
      numQuestions: 5, 
      createdAt: '2023-11-25', 
      author: 'Tác giả 1',
      grade: 'Lớp 6',
      subject: 'Sinh học'
    },
    { 
      name: 'Ô chữ về thực vật', 
      numQuestions: 8, 
      createdAt: '2023-11-28', 
      author: 'Tác giả 2',
      grade: 'Lớp 7',
      subject: 'Sinh học'
    },
    { 
      name: 'Ô chữ về địa lý', 
      numQuestions: 6, 
      createdAt: '2023-11-30', 
      author: 'Tác giả 3',
      grade: 'Lớp 8',
      subject: 'Địa lý'
    },
    { 
      name: 'Ô chữ về khí hậu', 
      numQuestions: 7, 
      createdAt: '2023-11-29', 
      author: 'Tác giả 4',
      grade: 'Lớp 8',
      subject: 'Địa lý'
    },
    { 
      name: 'Ô chữ về sinh vật biển', 
      numQuestions: 9, 
      createdAt: '2023-11-27', 
      author: 'Tác giả 5',
      grade: 'Lớp 7',
      subject: 'Sinh học'
    }
  ];

  const mostPlayedPuzzles = [
    { 
      name: 'Ô chữ về lịch sử Việt Nam', 
      numQuestions: 10, 
      createdAt: '2023-11-20', 
      author: 'Tác giả 6',
      grade: 'Lớp 9',
      subject: 'Lịch sử'
    },
    { 
      name: 'Ô chữ về văn học dân gian', 
      numQuestions: 7, 
      createdAt: '2023-11-22', 
      author: 'Tác giả 7',
      grade: 'Lớp 6',
      subject: 'Ngữ văn'
    },
    { 
      name: 'Ô chữ về vật lý cơ học', 
      numQuestions: 9, 
      createdAt: '2023-11-24', 
      author: 'Tác giả 8',
      grade: 'Lớp 7',
      subject: 'Vật lý'
    },
    { 
      name: 'Ô chữ về hóa học hữu cơ', 
      numQuestions: 8, 
      createdAt: '2023-11-23', 
      author: 'Tác giả 9',
      grade: 'Lớp 9',
      subject: 'Hóa học'
    },
    { 
      name: 'Ô chữ về toán đại số', 
      numQuestions: 6, 
      createdAt: '2023-11-21', 
      author: 'Tác giả 10',
      grade: 'Lớp 8',
      subject: 'Toán học'
    }
  ];

  const newestPuzzles = [
    { 
      name: 'Ô chữ về âm nhạc dân tộc', 
      numQuestions: 6, 
      createdAt: '2023-12-01', 
      author: 'Tác giả 11',
      grade: 'Lớp 8',
      subject: 'Âm nhạc'
    },
    { 
      name: 'Ô chữ về thể thao Olympic', 
      numQuestions: 8, 
      createdAt: '2023-11-29', 
      author: 'Tác giả 12',
      grade: 'Lớp 9',
      subject: 'Thể dục'
    },
    { 
      name: 'Ô chữ về nghệ thuật hiện đại', 
      numQuestions: 7, 
      createdAt: '2023-11-28', 
      author: 'Tác giả 13',
      grade: 'Lớp 6',
      subject: 'Mỹ thuật'
    },
    { 
      name: 'Ô chữ về công nghệ thông tin', 
      numQuestions: 9, 
      createdAt: '2023-11-30', 
      author: 'Tác giả 14',
      grade: 'Lớp 8',
      subject: 'Tin học'
    },
    { 
      name: 'Ô chữ về tiếng Anh giao tiếp', 
      numQuestions: 10, 
      createdAt: '2023-11-27', 
      author: 'Tác giả 15',
      grade: 'Lớp 7',
      subject: 'Tiếng Anh'
    }
  ];

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
          <PuzzleList>
            {randomPuzzles.slice(0, 5).map((puzzle, index) => (
              <PuzzleItem key={index} onClick={() => handleButtonClick(puzzle)}>
                <PuzzleName>{puzzle.name}</PuzzleName>
                <PuzzleInfo>
                  <span>Số câu hỏi: {puzzle.numQuestions}</span>
                  <span>Tác giả: {puzzle.author}</span>
                </PuzzleInfo>
              </PuzzleItem>
            ))}
          </PuzzleList>
        </LibraryColumn>

        <LibraryColumn>
          <ColumnHeader>
            <ColumnTitle>Được chơi nhiều nhất</ColumnTitle>
          </ColumnHeader>
          <PuzzleList>
            {mostPlayedPuzzles.slice(0, 5).map((puzzle, index) => (
              <PuzzleItem key={index} onClick={() => handleButtonClick(puzzle)}>
                <PuzzleName>{puzzle.name}</PuzzleName>
                <PuzzleInfo>
                  <span>Số câu hỏi: {puzzle.numQuestions}</span>
                  <span>Tác giả: {puzzle.author}</span>
                </PuzzleInfo>
              </PuzzleItem>
            ))}
          </PuzzleList>
        </LibraryColumn>

        <LibraryColumn>
          <ColumnHeader>
            <ColumnTitle>Ô chữ mới nhất</ColumnTitle>
          </ColumnHeader>
          <PuzzleList>
            {newestPuzzles.slice(0, 5).map((puzzle, index) => (
              <PuzzleItem key={index} onClick={() => handleButtonClick(puzzle)}>
                <PuzzleName>{puzzle.name}</PuzzleName>
                <PuzzleInfo>
                  <span>Số câu hỏi: {puzzle.numQuestions}</span>
                  <span>Tác giả: {puzzle.author}</span>
                </PuzzleInfo>
              </PuzzleItem>
            ))}
          </PuzzleList>
        </LibraryColumn>
      </LibraryContent>

      <Outlet />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        data={selectedData} 
      />
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

const PuzzleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PuzzleItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f8f8;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PuzzleName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
`;

const PuzzleInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
`;
