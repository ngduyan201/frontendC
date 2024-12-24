import React, { useState, useEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ResetModal, HomeModal } from '../components/modals/PlayModal';
import { crosswordService } from '../services/crosswordService';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSound from 'use-sound';

// Thêm GlobalStyle để tùy chỉnh toast
const ToastStyle = createGlobalStyle`
  .Toastify__toast-container {
    width: auto;
    max-width: 800px;
    padding: 0;
    margin-top: 25vh !important;
  }
  
  .Toastify__toast {
    font-size: 2rem;
    min-height: 80px;
    padding: 20px 40px;
  }

  .Toastify__toast-icon {
    width: 32px;
    height: 32px;
  }

  .Toastify__progress-bar {
    height: 5px;
  }
`;

const TEAM_COLORS = {
  0: {
    background: '#f08080', // lightcoral
    border: '#b01030',
    text: 'white',
    hoverBg: '#c51236'
  },
  1: {
    background: '#f0e68c', // khaki
    border: '#d6ce7e',
    text: '#333',
    hoverBg: '#e6dc82'
  },
  2: {
    background: '#8a2be2', // blueviolet
    border: '#7525bf',
    text: 'white',
    hoverBg: '#7a26c9'
  },
  3: {
    background: '#7fffd4', // aquamarine
    border: '#72e6bf',
    text: '#333',
    hoverBg: '#72f5ca'
  }
};

const TeamPlay = () => {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(''); // Dữ liệu câu hỏi
  const [answer, setAnswer] = useState(''); // Đáp án nhập vào
  const [selectedButton, setSelectedButton] = useState(null); // Button được chọn

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

  // Lưu trữ tất cả đáp án đã nhập để kiểm tra tiến độ hoàn thành
  const [answers, setAnswers] = useState({});

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
    const loadPuzzleData = () => {
      try {
        const playData = JSON.parse(localStorage.getItem('crosswordPlayData'));
        if (playData?.success && playData?.data) {
          const title = playData.data.title || 'Ô chữ không có tên';
          setPuzzleTitle(title.toUpperCase());
          
          // Lấy số câu hỏi từ độ dài từ khóa được mã hóa
          const numberOfQuestions = playData.data.numberOfQuestions;
          setNumberOfQuestions(numberOfQuestions);
          
          // Khởi tạo letters array
          setLetters(
            Array(numberOfQuestions)
              .fill(null)
              .map(() => Array(17).fill(''))
          );
          
          // Lưu thông tin câu hỏi
          setQuestions(playData.data.mainKeyword[0].associatedHorizontalKeywords || []);
          
          console.log('Loaded puzzle data:', {
            title,
            numberOfQuestions,
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
      // Xóa secretKey trước khi rời trang
      secretKeyManager.setKey(null);
      console.log('Secret key cleared');

      // Gọi API để xóa session
      await crosswordService.clearPlaySession();
      setShowHomeModal(false);
      navigate('/library');
    } catch (error) {
      console.error('Error clearing session:', error);
      // Vẫn xóa key và chuyển trang ngay cả khi có lỗi
      secretKeyManager.setKey(null);
      setShowHomeModal(false);
      navigate('/library');
    }
  };

  const handleAnswerChange = (e) => {
    const value = e.target.value.toUpperCase();
    const expectedLength = questions[selectedButton]?.numberOfCharacters;
    
    // Chỉ cho phép nhập đến độ dài tối đa
    if (expectedLength && value.length <= expectedLength) {
      setAnswer(value);
      setIsAnswering(true);
    }
  };

  // Thêm hàm kiểm tra số lượng đội đã sẵn sàng
  const getReadyTeamsCount = () => editedTeams.size;

  // Cập nhật hàm handleReset
  const handleReset = () => {
    if (!isGameStarted) {
      // Kiểm tra số lượng đội
      if (getReadyTeamsCount() < 2) {
        toast.error('Cần ít nhất 2 đội để bắt đầu trò chơi!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
        return;
      }
      setIsGameStarted(true);
    } else {
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
    setIsGameStarted(false);
    setLetters(Array(numberOfQuestions).fill(null).map(() => Array(17).fill('')));
    setQuestionData('');
    setSubmitCounts({}); // Reset số lần submit
    setAnswers({}); // Reset các đáp án đã nhập
    setShowRedBorder(false); // Tắt hiệu ứng border đỏ nếu đang hiển thị
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
          newLetters[index][8] = {
            value: char,
            index: index,
            isKeyword: true // Đánh dấu là ký tự của từ khóa
          };
        }
      });
      return newLetters;
    });
  };

  // Thêm state mới
  const [isKeywordInputDisabled, setIsKeywordInputDisabled] = useState(false);

  // Thêm state mới
  const [isKeywordCorrect, setIsKeywordCorrect] = useState(false);

  // Khởi tạo các âm thanh
  const [playCorrect] = useSound('/sounds/crowd-cheer.mp3');
  const [playWrong] = useSound('/sounds/fail-jingle.mp3');
  const [playKeywordCorrect] = useSound('/sounds/goodresult.mp3');
  const [playKeywordWrong] = useSound('/sounds/buzzer2.mp3');

  // Hàm xử lý submit từ khóa
  const handleKeywordSubmit = async () => {
    try {
      setIsKeywordInputDisabled(true);

      const key = secretKeyManager.getKey();
      if (!key) {
        console.error('Secret key not found');
        return;
      }

      const userKeyword = keyword.toUpperCase();
      const playData = JSON.parse(localStorage.getItem('crosswordPlayData'));
      const encryptedKeyword = playData.data.mainKeyword[0].keyword;

      try {
        const bytes = CryptoJS.AES.decrypt(encryptedKeyword, key);
        const correctKeyword = bytes.toString(CryptoJS.enc.Utf8);

        if (userKeyword === correctKeyword) {
          playSound(playKeywordCorrect); // Tiếng goodresult khi từ khóa đúng
          toast.success(' Từ khóa chính xác!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });

          // Set state khi từ khóa đúng
          setIsKeywordCorrect(true);

          setTimeout(() => {
            displayKeywordOnGrid(userKeyword);
          }, 1000);
        } else {
          playSound(playKeywordWrong);
          toast.error(' Từ khóa không chính xác!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        }
      } catch (decryptError) {
        console.error('Error decrypting keyword:', decryptError);
      }

      setTimeout(() => {
        setIsKeywordInputDisabled(false);
      }, 3000);

    } catch (error) {
      console.error('Error processing keyword:', error);
      setIsKeywordInputDisabled(false);
    }
  };

  // Thêm hàm xử lý khi click button
  const handleButtonClick = (index) => {
    if (!isGameStarted) return;
    
    // Kiểm tra nếu câu hỏi đã được trả lời đúng
    if (answers[index]) {
      console.log('Câu hỏi này đã được trả lời đúng!');
      return;
    }
    
    // Kiểm tra nếu đã trả lời sai 2 lần
    if (hasReachedMaxAttempts(index)) {
      console.log('Câu hỏi này đã hết lượt trả lời!');
      return;
    }
    
    if (isAnswering) {
      // Nếu đang trả lời, hiện khung đỏ
      setShowRedBorder(true);
      setTimeout(() => {
        setShowRedBorder(false);
      }, 3000);
      return;
    }
    
    setSelectedButton(index);
    setQuestionData(questions[index]?.questionContent || '');
    setIsAnswering(true);
  };

  // Hàm hiển thị đáp án lên grid
  const displayAnswerOnGrid = (rowIndex, answer, startColumn) => {
    setLetters(prevLetters => {
      const newLetters = [...prevLetters];
      [...answer].forEach((char, index) => {
        if (newLetters[rowIndex]) {
          newLetters[rowIndex][startColumn + index] = {
            value: char,
            index: index // Thêm index để tạo delay
          };
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
        playSound(playCorrect); // Tiếng hò hét + vỗ tay khi trả lời đúng
        toast.success(' Chính xác!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });

        // Thêm độ trễ trước khi hiển thị đáp án trên grid
        setTimeout(() => {
          setAnswers(prev => ({
            ...prev,
            [selectedButton]: currentAnswer
          }));
          
          const startColumn = questions[selectedButton].columnPosition;
          displayAnswerOnGrid(selectedButton, currentAnswer, startColumn);
          
          setIsAnswering(false);
        }, 1000); // Đợi 1 giây sau khi toast hiện lên

        // Thêm điểm cho đội hiện tại (ví dụ: đội 0)
        handleTeamScoreChange(activeTeam, 10); // Cộng 10 điểm cho đội trả lời đúng
      } else {
        playSound(playWrong); // Tiếng fail jingle khi trả lời sai
        toast.error(` Sai rồi! Bạn còn ${1 - (submitCounts[selectedButton] || 0)} lần thử`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });
        // Tăng số lần submit và kiểm tra giới hạn
        setSubmitCounts(prev => {
          const newCount = (prev[selectedButton] || 0) + 1;
          if (newCount >= 2) {
            setIsAnswering(false);
          }
          return {
            ...prev,
            [selectedButton]: newCount
          };
        });
        
        setShowRedBorder(true);
        setTimeout(() => {
          setShowRedBorder(false);
        }, 3000);

        // Trừ điểm nếu trả lời sai (tùy chọn)
        handleTeamScoreChange(activeTeam, -5); // Trừ 5 điểm nếu trả lời sai
      }

      setAnswer('');

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

  // Thêm hàm kiểm tra số lần trả lời sai
  const hasReachedMaxAttempts = (index) => {
    return (submitCounts[index] || 0) >= 2;
  };

  // Thêm hàm kiểm tra tất cả câu hỏi đã được trả lời
  const isAllQuestionsAnswered = () => {
    return questions.every((_, index) => {
      const isAnsweredCorrectly = !!answers[index];  // Đã trả lời đúng
      const isMaxAttempts = hasReachedMaxAttempts(index);  // Đã trả lời sai 2 lần
      return isAnsweredCorrectly || isMaxAttempts;
    });
  };

  // Thêm useEffect để xử lý reset selectedButton
  useEffect(() => {
    if (isAllQuestionsAnswered()) {
      setSelectedButton(null);
    }
  }, [answers, submitCounts]); // Chạy khi answers hoặc submitCounts thay đổi

  // Thêm states mới sau các states hiện có
  const [teams, setTeams] = useState([
    { name: '', score: 0 },
    { name: '', score: 0 },
    { name: '', score: 0 },
    { name: '', score: 0 }
  ]);
  const [editingTeam, setEditingTeam] = useState(null);

  // Thêm state để theo dõi các đội đã được đổi tên
  const [editedTeams, setEditedTeams] = useState(new Set());

  // Cập nhật hàm handleTeamNameChange
  const handleTeamNameChange = (index, newName) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const trimmedName = newName.trim();
      
      // Nếu tên rỗng, xóa khỏi editedTeams
      if (!trimmedName) {
        setEditedTeams(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      } else {
        // Thêm vào editedTeams nếu có tên hợp lệ
        setEditedTeams(prev => new Set(prev).add(index));
      }
      
      newTeams[index] = { 
        ...newTeams[index], 
        name: newName
      };
      return newTeams;
    });
  };

  // Cập nhật hàm handleTeamNameBlur
  const handleTeamNameBlur = (index) => {
    const currentName = teams[index].name.trim();
    
    if (!currentName) {
      // Reset về rỗng nếu không có tên
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        newTeams[index] = { 
          ...newTeams[index], 
          name: '' 
        };
        return newTeams;
      });
      
      // Xóa khỏi editedTeams
      setEditedTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
    
    setEditingTeam(null);
  };

  const handleTeamScoreChange = (index, points) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[index] = { 
        ...newTeams[index], 
        score: Math.max(0, newTeams[index].score + points)
      };
      return newTeams;
    });
  };

  // Thêm state để theo dõi đội đang chơi
  const [activeTeam, setActiveTeam] = useState(0);

  // Thêm state để quản lý trạng thái âm thanh
  const [isMuted, setIsMuted] = useState(false);

  // Cập nhật hàm playSound để kiểm tra trạng thái mute
  const playSound = (soundFunction) => {
    if (!isMuted) {
      try {
        soundFunction();
      } catch (error) {
        console.log('Lỗi phát âm thanh:', error);
      }
    }
  };

  return (
    <PlayPageContainer>
      <ToastStyle />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={3}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
      <Banner>
        <BackButton onClick={handleGoBack}>Quay lại</BackButton>
        <PuzzleName>{puzzleTitle}</PuzzleName>
        <ButtonGroup>
          <StartButton 
            onClick={handleReset}
            $canStart={!isGameStarted ? getReadyTeamsCount() >= 2 : true}
          >
            {isGameStarted ? 'Chơi lại từ đầu' : 'Bắt đầu chơi'}
          </StartButton>
          <SoundButton onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? '🔇' : '🔊'}
          </SoundButton>
        </ButtonGroup>
      </Banner>

      <TeamScoreBoard>
        {teams.map((team, index) => (
          (!isGameStarted || editedTeams.has(index)) && (
            <TeamButton 
              key={index}
              $isActive={activeTeam === index}
              $teamIndex={index}
              onClick={() => {
                if (isGameStarted && editedTeams.has(index)) {
                  setActiveTeam(index);
                }
              }}
              $isEditable={!isGameStarted || editedTeams.has(index)}
            >
              {editingTeam === index && !isGameStarted ? (
                <TeamNameInput
                  type="text"
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  onBlur={() => handleTeamNameBlur(index)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTeamNameBlur(index);
                    }
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Tên đội ${index + 1}`}
                  $teamIndex={index}
                />
              ) : (
                <TeamName 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isGameStarted) {
                      setEditingTeam(index);
                    }
                  }}
                  $isEditable={!isGameStarted}
                  $teamIndex={index}
                >
                  {team.name || `Tên đội ${index + 1}`}
                </TeamName>
              )}
              <ScoreDisplay $teamIndex={index}>{team.score}</ScoreDisplay>
            </TeamButton>
          )
        ))}
      </TeamScoreBoard>

      {!isGameStarted && (
        <TeamCountInfo $isReady={getReadyTeamsCount() >= 2}>
          {getReadyTeamsCount() >= 2 
            ? '✅ Đã đủ số đội để bắt đầu!'
            : `⚠️ Cần thêm ${2 - getReadyTeamsCount()} đội để có thể bắt đầu`
          }
        </TeamCountInfo>
      )}

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
                $isAnswered={!!answers[index]}
                $maxAttempts={hasReachedMaxAttempts(index)}
                onClick={() => handleButtonClick(index)}
                disabled={!isGameStarted || (isAnswering && index !== selectedButton)}
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
                    $isSelected={rowIndex === selectedButton}
                    $index={rowIndex}
                  >
                    {letter && typeof letter === 'object' ? (
                      <Letter 
                        $index={letter.index}
                        $isKeyword={letter.isKeyword}
                      >
                        {letter.value}
                      </Letter>
                    ) : letter ? (
                      <Letter $index={0}>
                        {letter}
                      </Letter>
                    ) : null}
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
                : isAllQuestionsAnswered()
                  ? 'Hãy trả lời từ khóa chính để hoàn thành trò chơi'
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
            <AnswerInputBox 
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
                disabled={
                  !isGameStarted || 
                  !checkKeywordLength() || 
                  isKeywordInputDisabled || 
                  isKeywordCorrect  // Thêm điều kiện disable khi đã trả lời đúng
                }
              >
                Xác nhận
              </SubmitButton>
            </FormHeader>
            <InputBox 
              type="text" 
              placeholder={
                !isGameStarted 
                  ? "Vui lòng bắt đầu chơi..."
                  : isKeywordCorrect
                    ? "Từ khóa đã được trả lời đúng!"  // Thêm placeholder mới
                    : isKeywordInputDisabled
                      ? "Vui lòng đợi..."
                      : `Nhập từ khóa ${keyword.length}/${numberOfQuestions} ký tự...`
              }
              value={keyword}
              onChange={handleKeywordChange}
              disabled={!isGameStarted || isKeywordInputDisabled || isKeywordCorrect}  // Thêm điều kiện disable
              $showRedBorder={showRedBorder}
            />
          </KeywordForm>
        </RightPanel>
      </MainContent>
    </PlayPageContainer>
  );
};

export default TeamPlay;

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
  background-color: white;
  color: black;
  border: 2px solid black;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: ${props => props.$canStart ? 'pointer' : 'not-allowed'};
  background: ${props => props.$canStart ? '#4CAF50' : '#cccccc'};
  color: white;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$canStart ? '#45a049' : '#cccccc'};
    transform: ${props => props.$canStart && 'translateY(-2px)'};
  }
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
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
`;

const GridWrapper = styled.div`
  display: flex;
  gap: 3px;
  box-sizing: border-box;
  align-items: center;
  flex: 3;
  max-width: 900px;
  margin: auto 0;
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
    props.$isAnswered ? '#4CAF50' :  // Màu xanh lá cho câu đã trả lời đúng
    props.$maxAttempts ? '#ff4d4d' :  // Màu đỏ cho câu đã hết lượt
    props.$isSelected ? '#FFD700' : '#87CEEB'  // Thay đổi màu cơ bản thành xanh da trời nhạt
  };
  color: ${props => props.$isSelected ? '#000' : '#fff'};
  border: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => 
    props.disabled || props.$isAnswered || props.$maxAttempts ? 'not-allowed' : 'pointer'
  };
  margin: 1px 0;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => 
      props.disabled ? '#ccc' : 
      props.$isAnswered ? '#4CAF50' :
      props.$maxAttempts ? '#ff4d4d' :
      props.$isSelected ? '#FFD700' : '#7CB9E8'  // Màu hover cũng đổi sang xanh da trời đậm hơn một chút
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
  border: ${props => {
    if (props.$isGameStarted) {
      if (props.$isSelected) {
        // Viền đậm cho cả ô thường và ô vàng trong hàng được chọn
        return props.$isHighlighted || props.$isKeywordColumn 
          ? '2px solid #000' 
          : '1px solid #fff';
      }
      // Viền bình thường cho các ô khác
      if (props.$isKeywordColumn || props.$isHighlighted) return '1px solid #000';
    }
    if (props.$hasLetter) return '1px solid #ccc';
    return '1px solid #fff';
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

  // Thêm hiệu ứng nhấp nháy cho cột từ khóa khi hoàn thành
  ${props => props.$isKeywordColumn && props.$hasLetter && `
    animation: emphasis 2s ease-in-out;
    animation-delay: ${props => props.$index * 0.1 + 0.5}s;
    animation-fill-mode: forwards;
  `}

  @keyframes emphasis {
    0%, 100% {
      background-color: #FFF3E0;
    }
    50% {
      background-color: #FFD700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
  }
`;

const Letter = styled.span`
  font-size: 1.7rem;
  color: #222;
  font-weight: bold;
  position: relative;
  opacity: 0;
  animation: ${props => props.$isKeyword ? 'wipeDown' : 'wipeIn'} 0.5s ease-out;
  animation-delay: ${props => props.$index * 0.1}s;
  animation-fill-mode: forwards;

  @keyframes wipeIn {
    0% {
      opacity: 0;
      clip-path: inset(0 100% 0 0);
    }
    100% {
      opacity: 1;
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes wipeDown {
    0% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
    100% {
      opacity: 1;
      clip-path: inset(0 0 0 0);
    }
  }
`;

const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  max-width: 500px;
  margin: auto 0;
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
  border: 1px solid #ccc;
  box-sizing: border-box;
  outline: none;
  margin-top: 10px;
  height: 60px;
  font-weight: bold;
  letter-spacing: 1px;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    border-color: #333;
  }

  &::placeholder {
    font-size: 1.2rem;
    font-weight: normal;
    color: #999;
  }
`;

const AnswerInputBox = styled(InputBox)`
  border: ${props => props.$showRedBorder ? '3px solid #ff4d4d' : '1px solid #ccc'};

  &:focus {
    border-color: ${props => props.$showRedBorder ? '#ff4d4d' : '#333'};
  }
`;

const TeamName = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  min-width: 120px;
  color: ${props => TEAM_COLORS[props.$teamIndex].text};
  cursor: ${props => props.$isEditable ? 'pointer' : 'default'};
  
  &:hover {
    background: ${props => props.$isEditable && 'rgba(0,0,0,0.1)'};
  }
`;

const ScoreDisplay = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  padding: 8px 20px;
  border-radius: 4px;
  min-width: 50px;
  text-align: center;
  color: ${props => TEAM_COLORS[props.$teamIndex].text};
  background: ${props => `${TEAM_COLORS[props.$teamIndex].border}33`}; // Thêm độ trong suốt
`;

const TeamButton = styled.button`
  background: ${props => props.$isActive 
    ? TEAM_COLORS[props.$teamIndex].hoverBg 
    : TEAM_COLORS[props.$teamIndex].background};
  border: 2px solid ${props => TEAM_COLORS[props.$teamIndex].border};
  border-radius: 8px;
  padding: 12px 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  cursor: ${props => props.$isEditable ? 'pointer' : 'default'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.$isEditable && 'translateY(-2px)'};
    box-shadow: ${props => props.$isEditable && '0 4px 8px rgba(0,0,0,0.1)'};
    background: ${props => TEAM_COLORS[props.$teamIndex].hoverBg};
  }

  // Animation khi xuất hiện/biến mất
  animation: ${props => props.$isEditable ? 'slideIn' : 'slideOut'} 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

const TeamNameInput = styled.input`
  font-size: 1.3rem;
  font-weight: bold;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 150px;
  text-align: left;
  background: white;
  color: #333;
  cursor: text;

  &::placeholder {
    color: #999;
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${props => TEAM_COLORS[props.$teamIndex].border};
    box-shadow: 0 0 0 2px ${props => TEAM_COLORS[props.$teamIndex].background}33;
  }
`;

const TeamScoreBoard = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 60px;
  width: 100%;
  box-sizing: border-box;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;

  & > button {
    flex: 0 1 auto;
    min-width: 250px;
    max-width: 350px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SoundButton = styled.button`
  background-color: white;
  color: black;
  border: 2px solid black;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const TeamCountInfo = styled.div`
  text-align: center;
  padding: 10px;
  color: ${props => props.$isReady ? '#4CAF50' : '#666'};
  font-size: 1.1rem;
  font-weight: ${props => props.$isReady ? 'bold' : 'normal'};
`;
