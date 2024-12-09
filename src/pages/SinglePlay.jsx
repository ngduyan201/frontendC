// PlayPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ResetModal, HomeModal } from '../components/modals/PlayModal';

const PlayPage = () => {
  const navigate = useNavigate();
  const [puzzleData, setPuzzleData] = useState(null);
  const [questionData, setQuestionData] = useState(''); // Dữ liệu câu hỏi
  const [answer, setAnswer] = useState(''); // Đáp án nhập vào

  // Thêm state cho letters
  const [letters, setLetters] = useState(
    Array(12).fill(null).map(() => Array(16).fill(''))
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
    // Giả sử bạn sẽ gọi API hoặc lấy d liệu từ cơ sở dữ liệu để load tên ô chữ
    const fetchPuzzleData = async () => {
      const data = {
        name: 'Ô chữ thú vị',
        author: 'Tác giả 1',
        numQuestions: 5,
      };
      setPuzzleData(data);
    };

    // Giả lập lấy câu hỏi từ cơ sở dữ liệu
    const fetchQuestionData = async () => {
      const question = "Câu hỏi: Tên thành phố lớn nhất Việt Nam là gì?"; // Ví dụ câu hỏi
      setQuestionData(question);
    };

    // Giả lập dữ liệu letters (có thể thay bằng API call sau này)
    const initializeLetters = () => {
      const initialLetters = Array(12).fill(null).map(() => Array(16).fill(''));
      // Có thể thêm một số chữ mẫu để test
      // initialLetters[0][0] = 'H';
      // initialLetters[0][1] = 'E';
      // initialLetters[0][2] = 'L';
      // initialLetters[0][3] = 'L';
      // initialLetters[0][4] = 'O';
      setLetters(initialLetters);
    };

    fetchPuzzleData();
    fetchQuestionData();
    initializeLetters();
  }, []);

  // Hàm điều hướng về trang chủ
  const handleGoBack = () => {
    setShowHomeModal(true);
  };

  const handleCloseHomeModal = () => {
    setShowHomeModal(false);
  };

  const handleConfirmGoHome = () => {
    setShowHomeModal(false);
    navigate('/library');
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
    setLetters(Array(12).fill(null).map(() => Array(16).fill('')));
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

  const FormHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
  `;

  const FormTitle = styled.h2`
    font-size: 1.2rem;
    color: #333;
    font-weight: 500;
    text-align: left;
    margin: 0;
  `;

  const SubmitButton = styled.button`
    background-color: ${props => props.disabled ? '#ccc' : '#333'};
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${props => props.disabled ? '#ccc' : '#444'};
    }
  `;

  return (
    <PlayPageContainer>
      <Banner>
        <BackButton onClick={handleGoBack}>Quay lại</BackButton>
        <PuzzleName>{puzzleData ? puzzleData.name : 'Đang tải...'}</PuzzleName>
        <ResetButton onClick={handleReset}>
          {isGameStarted ? 'Chơi lại từ đầu' : 'Bắt đầu chơi'}
        </ResetButton>
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
                isSelected={selectedButton === index}
                onClick={() => handleButtonClick(index)}
                disabled={!isGameStarted}
              >
                {index + 1}
              </RoundButton>
            ))}
          </ButtonColumn>

          <GridContainer>
            {letters.map((row, rowIndex) => (
              row.map((letter, colIndex) => (
                <GridItem key={`${rowIndex}-${colIndex}`}>
                  {letter && <Letter>{letter}</Letter>}
                </GridItem>
              ))
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
              showRedBorder={showRedBorder}
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
  padding: 15px 30px;
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

const BackButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 150px;

  &:hover {
    background-color: #444;
  }
`;

const PuzzleName = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin: 0 20px;
`;

const ResetButton = styled(BackButton)`
  // Kế thừa style từ BackButton
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
  margin-right: 2px;
`;

const RoundButton = styled.button`
  width: 46px;
  height: 46px;
  min-height: 46px;
  border-radius: 50%;
  background-color: ${props => 
    props.disabled ? '#ccc' : 
    props.isSelected ? '#FFD700' : '#008080'
  };
  color: ${props => props.isSelected ? '#000' : '#fff'};
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
      props.isSelected ? '#FFD700' : '#006666'
    };
    opacity: ${props => props.isSelected ? 1 : 0.9};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(16, 48px);
  grid-template-rows: repeat(12, 48px);
  gap: 1px;
  box-sizing: border-box;
  margin: 0 auto;
`;

const GridItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  border: 2px solid #333;
  border-radius: 4px;
  height: 46px;
  width: 46px;
  box-sizing: border-box;
  opacity: 0.9;
  margin: 0;

  &:nth-child(odd) {
    background-color: #eee;
  }

  &:hover {
    border-color: #000;
    opacity: 1;
  }
`;

const Letter = styled.span`
  font-size: 1.7rem;
  color: #222;
  font-weight: bold;
`;

const QuestionForm = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const QuestionBox = styled.div`
  background-color: #e8e8e8;
  padding: 20px;
  border-radius: 4px;
  font-size: 1.4rem;
  color: #555;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #ccc;
  margin-top: 10px;
  line-height: 1.5;
`;

const AnswerForm = styled.div`
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 0.6;
  min-height: 120px;
  display: flex;
  flex-direction: column;
`;

const InputBox = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1.4rem;
  border-radius: 8px;
  border: 1px solid ${props => {
    if (props.showRedBorder) return 'red';
    if (props.disabled) return '#ccc';
    return '#ccc';
  }};
  box-sizing: border-box;
  outline: none;
  margin-top: 10px;
  height: 60px;
  max-height: 60px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    border-color: ${props => {
      if (props.showRedBorder) return 'red';
      if (props.disabled) return '#ccc';
      return '#333';
    }};
  }

  &::placeholder {
    font-size: 1.1rem;
    text-transform: none;
    font-weight: normal;
    color: ${props => props.disabled ? '#999' : '#666'};
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px 40px;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
`;

const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  max-width: 500px;
`;

const KeywordForm = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 0.6;
  min-height: 120px;
  display: flex;
  flex-direction: column;
`;
