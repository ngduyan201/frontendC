import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ResetModal, HomeModal } from '../components/modals/PlayModal';
import { crosswordService } from '../services/crosswordService';

const PlayPage = () => {
  const navigate = useNavigate();
  const [puzzleData, setPuzzleData] = useState(null);
  const [questionData, setQuestionData] = useState(''); // Dữ liệu câu hỏi
  const [answer, setAnswer] = useState(''); // Đáp án nhập vào

  // Thêm state cho letters
  const [letters, setLetters] = useState(
    Array(12).fill(null).map(() => Array(17).fill(''))
  );

  // Thêm state để quản lý modal
  const [showResetModal, setShowResetModal] = useState(false);

  // Thêm state mới cho từ khóa
  const [keyword, setKeyword] = useState('');

  // Thêm state quản lý modal cho nút quay lại trang chủ
  const [showHomeModal, setShowHomeModal] = useState(false);

  // Thêm state để theo dõi button được chọn
  const [selectedButton, setSelectedButton] = useState(null);

  // Thêm states mới
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  // Thêm state để quản lý hiệu ứng khung đỏ
  const [showRedBorder, setShowRedBorder] = useState(false);

  useEffect(() => {
    const loadPuzzleData = async () => {
      try {
        // Chỉ cần đọc session đã được tạo
        const currentSession = crosswordService.getCurrentPlaySession();
        console.log('Session hiện tại:', currentSession);

        if (currentSession.success) {
          console.log('Dữ liệu từ session:', currentSession.data);
          setPuzzleData(currentSession.data);
          initializeLettersFromKeyword(currentSession.data.mainKeyword[0]);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    loadPuzzleData();
  }, []);

  // Hàm điều hướng về trang chủ
  const handleGoBack = () => {
    setShowHomeModal(true);
  };

  const handleCloseHomeModal = () => {
    setShowHomeModal(false);
  };

  const handleConfirmGoHome = async () => {
    try {
      // Gọi API để xóa session
      await crosswordService.clearPlaySession();
      setShowHomeModal(false);
      navigate('/library');
    } catch (error) {
      console.error('Error clearing session:', error);
      setShowHomeModal(false);
      navigate('/library');
    }
  };

  // Hàm điều hướng đến phần trả lời từ khoá
  const handleAnswerKeyword = () => {
    console.log('Đi đến phần tr lời từ khoá');
    // Điều hướng đến phần trả lời từ khoá (Bạn có thể làm thêm sau)
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    setIsAnswering(true); // Đánh dấu đang trong quá trình trả lời
  };

  // Thay đổi tên hàm và chức năng
  const handleReset = () => {
    if (!isGameStarted) {
      // Nếu chưa bắt đầu game
      setIsGameStarted(true);
    } else {
      // Nếu đã bắt đầu game, hiện modal xác nhận reset
      setShowResetModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowResetModal(false);
  };

  const handleConfirmReset = () => {
    setShowResetModal(false);
    setSelectedButton(null);
    setAnswer('');
    setIsAnswering(false);
    setKeyword('');
    setIsGameStarted(false); // Quay về trạng thái ban đầu
    // Reset các state khác về giá trị ban đầu
    setLetters(Array(12).fill(null).map(() => Array(17).fill('')));
  };

  // Thêm handler cho từ khóa
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value.toUpperCase());
  };

  // Thêm hàm xử lý khi click button
  const handleButtonClick = (index) => {
    if (!isGameStarted) return; // Không cho phép click nếu chưa bắt đầu
    if (isAnswering) {
      // Nếu đang trả lời, hiện khung đỏ
      setShowRedBorder(true);
      setTimeout(() => {
        setShowRedBorder(false);
      }, 3000); // Tắt khung đỏ sau 3 giây
      return;
    }
    setSelectedButton(index);
  };

  // Thêm hàm xử lý khi submit câu trả lời
  const handleAnswerSubmit = () => {
    setAnswer('');
    setIsAnswering(false);
  };

    return (
    <PlayPageContainer>
      <Banner>
        <BackButton onClick={handleGoBack}>Quay lại</BackButton>
        <PuzzleName>{puzzleData ? puzzleData.name : 'Đang tải...'}</PuzzleName>
        <StartButton onClick={handleReset}>
          {isGameStarted ? 'Chơi lại từ đầu' : 'Bắt đầu chơi'}
        </StartButton>
      </Banner>

      <ResetModal 
        show={showResetModal}
        onConfirm={handleConfirmReset}
        onClose={handleCloseModal}
      />

      <HomeModal 
        show={showHomeModal}
        onConfirm={handleConfirmGoHome}
        onClose={handleCloseHomeModal}
      />

      <MainContent>
        <GridWrapper>
          <ButtonColumn>
            {Array.from({ length: 12 }, (_, index) => (
              <RoundButton 
                key={index} 
                $isSelected={selectedButton === index}
                onClick={() => handleButtonClick(index)}
                disabled={!isGameStarted}
              >
                {index + 1}
              </RoundButton>
            ))}
          </ButtonColumn>

          <GridContainer>
            {letters.map((row, rowIndex) => (
              <GridRow key={rowIndex}>
                {row.map((letter, colIndex) => (
                  <GridCell 
                    key={`${rowIndex}-${colIndex}`}
                    $isKeywordColumn={colIndex === 8}
                    $hasLetter={letter !== ''}
                  >
                    {letter && <Letter>{letter}</Letter>}
                  </GridCell>
                ))}
              </GridRow>
            ))}
          </GridContainer>
        </GridWrapper>

        <RightPanel>
          <QuestionForm>
            <FormTitle>Câu hỏi</FormTitle>
            <QuestionBox>
              {!isGameStarted 
                ? 'Vui lòng bấm "Bắt đầu chơi" để bắt đầu trò chơi'
                : selectedButton === null 
                  ? 'Vui lòng chọn một câu hỏi'
                  : questionData
              }
            </QuestionBox>
          </QuestionForm>

          <AnswerForm>
            <FormHeader>
              <FormTitle>Nhập đáp án</FormTitle>
              <SubmitButton 
                onClick={handleAnswerSubmit}
                disabled={!isGameStarted || selectedButton === null}
              >
                Xác nhận
              </SubmitButton>
            </FormHeader>
            <InputBox 
              type="text" 
              value={answer} 
              onChange={handleAnswerChange} 
              placeholder="Nhập câu trả lời ở đây..."
              disabled={!isGameStarted || selectedButton === null}
              $showRedBorder={showRedBorder}
            />
          </AnswerForm>

          <KeywordForm>
            <FormHeader>
              <FormTitle>Từ khóa</FormTitle>
              <SubmitButton 
                onClick={() => console.log('Xác nhận từ khóa')}
                disabled={!isGameStarted}
              >
                Xác nhận
              </SubmitButton>
            </FormHeader>
            <InputBox 
              type="text" 
              placeholder="Nhập từ khóa của ô chữ..."
              value={keyword}
              onChange={handleKeywordChange}
              disabled={!isGameStarted}
            />
          </KeywordForm>
        </RightPanel>
      </MainContent>
    </PlayPageContainer>
  );
};

export default PlayPage;

// Styled-components

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const FormTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#4CAF50'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#45a049'};
  }
`;

const PlayPageContainer = styled.div`
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 60px;
  background-color: #f1f1f1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  height: 80px;
`;

const BackButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 120px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #444;
  }
`;

const StartButton = styled(BackButton)`
  background-color: #FFA500;
`;

const PuzzleName = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin: 0 40px;
  font-weight: bold;
`;

const MainContent = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px 40px 20px 20px;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
`;

const GridWrapper = styled.div`
  display: flex;
  gap: 3px;
  box-sizing: border-box;
  align-items: center;
  flex: 3;
  max-width: 900px;
`;

const ButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-right: 15px;
`;

const RoundButton = styled.button`
  width: 46px;
  height: 46px;
  min-height: 46px;
  border-radius: 50%;
  background-color: ${props => 
    props.disabled ? '#ccc' : 
    props.$isSelected ? '#FFD700' : '#008080'
  };
  color: ${props => props.$isSelected ? '#000' : '#fff'};
  border: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin: 1px 0;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => 
      props.disabled ? '#ccc' : 
      props.$isSelected ? '#FFD700' : '#006666'
    };
    opacity: ${props => props.$isSelected ? 1 : 0.9};
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #f0f0f0;
  padding: 1px;
  border-radius: 4px;
`;

const GridRow = styled.div`
  display: flex;
  gap: 1px;
`;

const GridCell = styled.div`
  width: 48px;
  height: 48px;
  border: 1px solid ${props => props.$hasLetter ? '#ccc' : '#fff'};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${props => {
    if (props.$isKeywordColumn) return '#FFF3E0';
    if (props.$hasLetter) return '#E3F2FD';
    return 'white';
  }};
`;

const Letter = styled.span`
  font-size: 1.7rem;
  color: #222;
  font-weight: bold;
`;

const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  max-width: 500px;
`;

const QuestionForm = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 2;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const QuestionBox = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  font-size: 1.6rem;
  line-height: 1.8;
  color: #333;
  flex: 1;
  border: 1px solid #ccc;
  margin-top: 10px;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const AnswerForm = styled.div`
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-height: 150px;
`;

const KeywordForm = styled(AnswerForm)``;

const InputBox = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 1.6rem;
  border-radius: 8px;
  border: 1px solid ${props => props.$showRedBorder ? '#ff4d4d' : '#ccc'};
  box-sizing: border-box;
  outline: none;
  margin-top: 10px;
  height: 60px;
  font-weight: bold;
  letter-spacing: 1px;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    border-color: ${props => props.$showRedBorder ? '#ff4d4d' : '#333'};
  }

  &::placeholder {
    font-size: 1.2rem;
    font-weight: normal;
    color: #999;
  }
`;
