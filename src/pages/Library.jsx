import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { crosswordService } from '../services/crosswordService';
import CrosswordCard from '../components/features/CrosswordCard';
import InformationModal from '../components/modals/Information';
import { toast } from 'react-toastify';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryCrosswords, setLibraryCrosswords] = useState({
    random: [],
    mostPlayed: [],
    newest: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Thêm state cho modal
  const [selectedCrossword, setSelectedCrossword] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Thêm state cho filters
  const [filters, setFilters] = useState({
    subject: '',
    grade: ''
  });

  // Thêm data cho dropdowns
  const grades = [
    'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
    'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
    'Lớp 10', 'Lớp 11', 'Lớp 12'
  ];

  const getSubjectsByGrade = (grade) => {
    if (!grade) return [];
    
    const gradeNum = parseInt(grade.split(' ')[1]);
    
    if (gradeNum >= 1 && gradeNum <= 5) {
      return [
        'Tiếng Việt', 'Toán', 'Tiếng Anh', 'Đạo Đức', 
        'Tự nhiên và Xã hội', 'Lịch sử', 'Địa lý', 'Khoa học',
        'Tin học', 'Công nghệ', 'Âm nhạc', 'Mĩ Thuật'
      ];
    } else if (gradeNum >= 6 && gradeNum <= 9) {
      return [
        'Ngữ văn', 'Toán', 'Tiếng Anh', 'Giáo dục công dân',
        'Lịch sử', 'Địa lí', 'Vật Lí', 'Hoá học', 'Sinh học',
        'Công nghệ', 'Tin học', 'Âm nhạc', 'Mĩ thuật',
        'Hoạt động trải nghiệm'
      ];
    } else {
      return [
        'Ngữ văn', 'Toán', 'Tiếng Anh', 
        'Giáo dục quốc phòng và an ninh', 'Hoạt động trải nghiệm',
        'Lịch sử', 'Địa lý', 'Giáo dục kinh tế và pháp luật',
        'Vật lí', 'Hoá học', 'Sinh học', 'Công nghệ',
        'Tin học', 'Âm nhạc', 'Mĩ thuật'
      ];
    }
  };

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

  // Thêm hàm xử lý click vào card
  const handleCardClick = (crossword) => {
    // Format dữ liệu cho modal
    const modalData = {
      _id: crossword._id,
      name: crossword.title,
      numQuestions: crossword.questionCount,
      author: crossword.author,
      grade: crossword.grade,
      subject: crossword.subject,
      timesPlayed: crossword.timesPlayed || 0
    };
    
    setSelectedCrossword(modalData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCrossword(null);
  };

  // Thêm states cho tìm kiếm và phân trang
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 9; // 3x3 grid

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (!searchQuery && !filters.grade && !filters.subject) {
      setIsSearching(false);
      return;
    }
    
    setIsLoading(true);
    setIsSearching(true);
    setCurrentPage(1);

    try {
      const response = await crosswordService.searchCrosswords({
        query: searchQuery,
        subject: filters.subject,
        grade: filters.grade,
        page: 1,
        limit: ITEMS_PER_PAGE
      });

      if (response.success) {
        setSearchResults(response.data.crosswords);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tìm kiếm');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = async (pageNumber) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);

    try {
      const response = await crosswordService.searchCrosswords({
        query: searchQuery,
        subject: filters.subject,
        grade: filters.grade,
        page: pageNumber,
        limit: ITEMS_PER_PAGE
      });

      if (response.success) {
        setSearchResults(response.data.crosswords);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tải trang');
      }
    } catch (error) {
      console.error('Page change error:', error);
      toast.error('Có lỗi xảy ra khi tải trang');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm quay lại giao diện mặc định
  const handleBackToDefault = () => {
    setIsSearching(false);
    setSearchQuery('');
    setFilters({ grade: '', subject: '' });
    setSearchResults([]);
    setCurrentPage(1);
  };

  return (
    <Container>
      <SearchContainer>
        <SearchGroup>
          <SearchLabel>Nhập nội dung bạn muốn khám phá ở đây:</SearchLabel>
          <SearchInput 
            type="text" 
            placeholder="Hãy nhập gì đó..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <SearchButton onClick={handleSearch}>
            Tìm kiếm
          </SearchButton>
        </SearchGroup>
        
        <FiltersGroup>
          <FilterSelect
            value={filters.grade}
            onChange={(e) => {
              const newGrade = e.target.value;
              setFilters(prev => ({
                ...prev,
                grade: newGrade,
                subject: ''
              }));
            }}
          >
            <option value="">Tất cả các lớp</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </FilterSelect>

          <FilterSelect 
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            disabled={!filters.grade}
          >
            <option value="">Tất cả môn học</option>
            {getSubjectsByGrade(filters.grade).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </FilterSelect>
        </FiltersGroup>
      </SearchContainer>

      {isSearching ? (
        <SearchResultsContainer>
          <SearchHeader>
            <BackButton onClick={handleBackToDefault}>
              <i className="fas fa-arrow-left" /> Quay lại
            </BackButton>
            <ResultsCount>
              Tìm thấy {searchResults.length} kết quả
            </ResultsCount>
          </SearchHeader>

          <ResultsGrid>
            {searchResults
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map((crossword) => (
                <CrosswordCard 
                  key={crossword._id}
                  title={crossword.title}
                  questionCount={crossword.questionCount}
                  timesPlayed={crossword.timesPlayed || 0}
                  author={crossword.author}
                  grade={crossword.grade}
                  onClick={() => handleCardClick(crossword)}
                />
            ))}
          </ResultsGrid>

          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PageButton
                  key={page}
                  onClick={() => handlePageChange(page)}
                  $isActive={currentPage === page}
                >
                  {page}
                </PageButton>
              ))}
            </Pagination>
          )}
        </SearchResultsContainer>
      ) : (
        <LibraryContent>
          <Section color="#f0f4f8">
            <SectionTitle>Ô chữ mới nhất</SectionTitle>
            <CardGrid>
              {libraryCrosswords.newest.map((crossword) => (
                <CrosswordCard 
                  key={crossword._id}
                  title={crossword.title}
                  questionCount={crossword.questionCount}
                  timesPlayed={crossword.timesPlayed || 0}
                  author={crossword.author}
                  grade={crossword.grade}
                  onClick={() => handleCardClick(crossword)}
                />
              ))}
            </CardGrid>
          </Section>

          <Section color="#fff5f5">
            <SectionTitle>Ô chữ phổ biến</SectionTitle>
            <CardGrid>
              {libraryCrosswords.mostPlayed.map((crossword) => (
                <CrosswordCard 
                  key={crossword._id}
                  title={crossword.title}
                  questionCount={crossword.questionCount}
                  timesPlayed={crossword.timesPlayed || 0}
                  author={crossword.author}
                  grade={crossword.grade}
                  onClick={() => handleCardClick(crossword)}
                />
              ))}
            </CardGrid>
          </Section>

          <Section color="#f0f8f1">
            <SectionTitle>Ô chữ ngẫu nhiên</SectionTitle>
            <CardGrid>
              {libraryCrosswords.random.map((crossword) => (
                <CrosswordCard 
                  key={crossword._id}
                  title={crossword.title}
                  questionCount={crossword.questionCount}
                  timesPlayed={crossword.timesPlayed || 0}
                  author={crossword.author}
                  grade={crossword.grade}
                  onClick={() => handleCardClick(crossword)}
                />
              ))}
            </CardGrid>
          </Section>
        </LibraryContent>
      )}

      {/* Thêm Modal */}
      {selectedCrossword && (
        <InformationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={selectedCrossword}
        />
      )}

      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default Library;

// Styled Components
const Container = styled.div`
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 15px;
`;

const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
`;

const FiltersGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const SearchLabel = styled.span`
  font-size: 1.1rem;
  color: #333;
  margin-right: 20px;
  font-weight: 500;
  white-space: nowrap;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  padding-right: 120px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }

  &::placeholder {
    color: #999;
    font-size: 1.1rem;
  }
`;

const FilterSelect = styled.select`
  padding: 15px 20px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  background: white;
  min-width: 180px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4CAF50;
  }

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
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

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  padding: 12px 25px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

const SearchResultsContainer = styled.div`
  padding: 20px;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
  }
`;

const ResultsCount = styled.div`
  color: #666;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${props => props.$isActive ? '#4CAF50' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isActive ? '#45a049' : '#f5f5f5'};
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SectionTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #3498db;
`;

const Section = styled.div`
  background-color: ${props => props.color || '#f8f9fa'};
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  padding: 10px 0;
`;
