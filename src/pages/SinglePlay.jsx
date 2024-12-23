import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ResetModal, HomeModal } from '../components/modals/PlayModal';
import { crosswordService } from '../services/crosswordService';
import CryptoJS from 'crypto-js';

const PlayPage = () => {
  const navigate = useNavigate();
  const [puzzleData, setPuzzleData] = useState(null);
  const [questionData, setQuestionData] = useState(''); // Dữ liệu câu hỏi
  const [answer, setAnswer] = useState(''); // Đáp án nhập vào
  const [selectedButton, setSelectedButton] = useState(null); // Button được chọn
  const [answers, setAnswers] = useState({}); // Object lưu đáp án theo số câu hỏi

  // Thêm state cho letters
  const [letters, setLetters] = useState([]);

  // Thêm state để quản lý modal
  const [showResetModal, setShowResetModal] = useState(false);

  // Thêm state mới cho từ khóa
  const [keyword, setKeyword] = useState('');

  // Thêm state quản lý modal cho nút quay lại trang chủ
  const [showHomeModal, setShowHomeModal] = useState(false);

  // Thêm states mới
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  // Thêm state để quản lý hiệu ứng khung đỏ
  const [showRedBorder, setShowRedBorder] = useState(false);

  const [puzzleTitle, setPuzzleTitle] = useState('Đang tải...');
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  const [questions, setQuestions] = useState([]);

  // Tạo closure để lưu và truy xuất secretKey
  const secretKeyManager = useMemo(() => {
    let key = null;
    
    return {
      setKey: (newKey) => {
        key = newKey;
        console.log('Key set:', !!key); // Log khi set key
      },
      getKey: () => {
        console.log('Key get:', !!key); // Log khi get key
        return key;
      }
    };
  }, []); // Đảm bảo closure chỉ được tạo một lần

  // Thêm useEffect để lấy secretKey khi component mount
  useEffect(() => {
    const fetchSecretKey = async () => {
      try {
        const key = await crosswordService.getSecretKey();
        secretKeyManager.setKey(key);
        console.log('Secret key loaded successfully');
      } catch (error) {
        console.error('Error fetching secret key:', error);
        navigate('/library');
      }
    };

    fetchSecretKey();
  }, [navigate, secretKeyManager]); // Thêm secretKeyManager vào dependencies

  useEffect(() => {
    const loadPuzzleData = async () => {
      try {
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

  useEffect(() => {
    const loadPuzzleData = () => {
      try {
        const playData = JSON.parse(localStorage.getItem('crosswordPlayData'));
        if (playData?.success && playData?.data) {
          // Lấy title từ data
          const title = playData.data.title || 'Ô chữ không có tên';
          setPuzzleTitle(title.toUpperCase());
          
          // Set số câu hỏi
          setNumberOfQuestions(playData.data.numberOfQuestions);
          
          // Khởi tạo lại letters array với số hàng bằng numberOfQuestions
          setLetters(
            Array(playData.data.numberOfQuestions)
              .fill(null)
              .map(() => Array(17).fill(''))
          );
          
          // Lưu thông tin câu hỏi từ đúng vị trí trong data
          setQuestions(playData.data.mainKeyword[0].associatedHorizontalKeywords || []);
          
          console.log('Loaded puzzle data:', {
            title,
            numberOfQuestions: playData.data.numberOfQuestions,
            questions: playData.data.mainKeyword[0].associatedHorizontalKeywords
          });
        }
      } catch (error) {
        console.error('Error loading puzzle data:', error);
        setPuzzleTitle('Không thể tải dữ liệu');
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
    const value = e.target.value.toUpperCase();
    const expectedLength = questions[selectedButton]?.numberOfCharacters;
    
    // Chỉ cho phép nhập đến độ dài tối đa
    if (expectedLength && value.length <= expectedLength) {
      setAnswer(value);
      setIsAnswering(true);

      if (selectedButton !== null) {
        setAnswers(prev => ({
          ...prev,
          [selectedButton]: value
        }));
      }
    }
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
    setLetters(Array(numberOfQuestions).fill(null).map(() => Array(17).fill('')));
  };

  // Thêm handler cho từ khóa
  const handleKeywordChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Chỉ cho phép nhập đến độ dài bằng số câu hỏi
    if (value.length <= numberOfQuestions) {
      setKeyword(value);
    }
  };

  // Hàm kiểm tra độ dài từ khóa
  const checkKeywordLength = () => {
    return keyword.length === numberOfQuestions;
  };

  // Hàm hiển thị từ khóa lên grid
  const displayKeywordOnGrid = (keyword) => {
    setLetters(prevLetters => {
      const newLetters = [...prevLetters];
      [...keyword].forEach((char, index) => {
        if (newLetters[index]) {
          newLetters[index][8] = char; // Cột 8 là cột giữa (màu vàng)
        }
      });
      return newLetters;
    });
  };

  // Hàm xử lý submit từ khóa
  const handleKeywordSubmit = async () => {
    try {
      const key = secretKeyManager.getKey();
      if (!key) {
        console.error('Secret key not found');
        return;
      }

      const userKeyword = keyword.toUpperCase();
      // Lấy keyword từ đúng vị trí trong cấu trúc dữ liệu
      const correctEncrypted = puzzleData.mainKeyword[0].associatedHorizontalKeywords[0].keyword;
      
      console.log('Encrypted keyword:', correctEncrypted);

      try {
        const bytes = CryptoJS.AES.decrypt(correctEncrypted, key);
        const correctKeyword = bytes.toString(CryptoJS.enc.Utf8);
        
        console.log('Decrypted keyword:', correctKeyword);
        console.log('User keyword:', userKeyword);

        if (userKeyword === correctKeyword) {
          console.log('Từ khóa đúng!');
          displayKeywordOnGrid(userKeyword);
        } else {
          console.log('Từ khóa sai!');
          setShowRedBorder(true);
          setTimeout(() => {
            setShowRedBorder(false);
          }, 3000);
        }
      } catch (decryptError) {
        console.error('Error decrypting keyword:', decryptError);
      }

    } catch (error) {
      console.error('Error processing keyword:', error);
    }
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
    // Set nội dung câu hỏi tương ứng
    setQuestionData(questions[index]?.questionContent || '');
  };

  // Hàm hiển thị đáp án lên grid
  const displayAnswerOnGrid = (rowIndex, answer, startColumn) => {
    setLetters(prevLetters => {
      const newLetters = [...prevLetters];
      // Đặt từng ký tự vào đúng vị trí trên grid
      [...answer].forEach((char, index) => {
        if (newLetters[rowIndex]) {
          newLetters[rowIndex][startColumn + index] = char;
        }
      });
      return newLetters;
    });
  };

  // Thêm state để theo dõi số lần submit của mỗi câu hỏi
  const [submitCounts, setSubmitCounts] = useState({});

  // Hàm kiểm tra số lần submit
  const checkSubmitLimit = (questionIndex) => {
    return (submitCounts[questionIndex] || 0) >= 2;
  };

  // Xử lý khi submit câu trả lời
  const handleAnswerSubmit = () => {
    if (selectedButton === null) return;

    // Kiểm tra giới hạn submit
    if (checkSubmitLimit(selectedButton)) {
      console.log('Đã hết lượt trả lời cho câu này');
      return;
    }

    try {
      const key = secretKeyManager.getKey();
      console.log('Submit - Key exists:', !!key);
      
      if (!key) {
        console.error('Secret key not found');
        return;
      }

      const currentAnswer = answer.toUpperCase();
      const correctEncrypted = questions[selectedButton]?.answer;

      const bytes = CryptoJS.AES.decrypt(correctEncrypted, key);
      const correctAnswer = bytes.toString(CryptoJS.enc.Utf8);

      const isCorrect = currentAnswer === correctAnswer;

      if (isCorrect) {
        console.log('Câu trả lời đúng!');
        setAnswers(prev => ({
          ...prev,
          [selectedButton]: currentAnswer
        }));
        
        const startColumn = questions[selectedButton].columnPosition;
        displayAnswerOnGrid(selectedButton, currentAnswer, startColumn);
        
      } else {
        console.log('Câu trả lời sai!');
        // Tăng số lần submit cho câu hỏi hiện tại
        setSubmitCounts(prev => ({
          ...prev,
          [selectedButton]: (prev[selectedButton] || 0) + 1
        }));
        
        setShowRedBorder(true);
        setTimeout(() => {
          setShowRedBorder(false);
        }, 3000);
      }

      setAnswer('');
      setIsAnswering(false);

    } catch (error) {
      console.error('Error processing answer:', error);
    }
  };

  // Hàm kiểm tra ô có được tô màu không
  const shouldHighlight = (rowIndex, colIndex) => {
    if (colIndex === 8) return false; // Không tô cột từ khóa
    
    const question = questions[rowIndex];
    if (!question) return false;

    const startCol = question.columnPosition;
    const endCol = startCol + question.numberOfCharacters;
    
    return colIndex >= startCol && colIndex < endCol;
  };

  // Hàm kiểm tra độ dài câu trả lời
  const checkAnswerLength = () => {
    if (selectedButton === null) return false;
    const expectedLength = questions[selectedButton]?.numberOfCharacters;
    return answer.length === expectedLength;
  };

  return (
    <PlayPageContainer>
      <Banner>
        <BackButton onClick={handleGoBack}>Quay lại</BackButton>
        <PuzzleName>{puzzleTitle}</PuzzleName>
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
            {Array.from({ length: numberOfQuestions }, (_, index) => (
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
                    $isHighlighted={shouldHighlight(rowIndex, colIndex)}
                    $isGameStarted={isGameStarted}
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
                disabled={
                  !isGameStarted || 
                  selectedButton === null || 
                  checkSubmitLimit(selectedButton) ||
                  !checkAnswerLength() // Thêm điều kiện kiểm tra độ dài
                }
              >
                Xác nhận
              </SubmitButton>
            </FormHeader>
            <InputBox 
              type="text" 
              value={answer} 
              onChange={handleAnswerChange} 
              placeholder={
                !isGameStarted 
                  ? "Vui lòng bắt đầu chơi..." 
                  : selectedButton === null 
                    ? "Vui lòng chọn câu hỏi..." 
                    : checkSubmitLimit(selectedButton)
                      ? "Bạn đã hết lượt trả lời"
                      : `Nhập đáp án ${answer.length}/${questions[selectedButton]?.numberOfCharacters || 0} ký tự...`
              }
              disabled={!isGameStarted || selectedButton === null || checkSubmitLimit(selectedButton)}
              $showRedBorder={showRedBorder}
            />
          </AnswerForm>

          <KeywordForm>
            <FormHeader>
              <FormTitle>Từ khóa</FormTitle>
              <SubmitButton 
                onClick={handleKeywordSubmit}
                disabled={!isGameStarted || !checkKeywordLength()}
              >
                Xác nhận
              </SubmitButton>
            </FormHeader>
            <InputBox 
              type="text" 
              placeholder={
                !isGameStarted 
                  ? "Vui lòng bắt đầu chơi..."
                  : `Nhập từ khóa ${keyword.length}/${numberOfQuestions} ký tự...`
              }
              value={keyword}
              onChange={handleKeywordChange}
              disabled={!isGameStarted}
              $showRedBorder={showRedBorder}
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
  border: 1px solid ${props => {
    if ((props.$isHighlighted || props.$isKeywordColumn) && props.$isGameStarted) return '#000';
    if (props.$hasLetter) return '#ccc';
    return '#fff';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${props => {
    if (props.$isKeywordColumn) return '#FFF3E0';
    if (props.$isHighlighted) return '#E3F2FD';
    if (props.$hasLetter) return '#fff';
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
