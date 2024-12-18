  import React, { useState, useRef, useEffect } from 'react';
  import styled from 'styled-components';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { HomeModal, SaveModal } from '../components/modals/PlayModal';
  import { crosswordService } from '../services/crosswordService';
  import { toast } from 'react-toastify';

  const MAX_KEYWORD_LENGTH = 16;
  const MAX_QUESTION_LENGTH = 150;
  const MAX_ANSWER_LENGTH = 14;

  const CreatePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [puzzleData, setPuzzleData] = useState({
      name: '',
      numQuestions: 0
    });

    const [questionsData, setQuestionsData] = useState([]);
    const [letters, setLetters] = useState([]);

    const [selectedButton, setSelectedButton] = useState(0);
    const [showHomeModal, setShowHomeModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const textareaRef = useRef(null);

    const [keywordPositions, setKeywordPositions] = useState([]);

    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const [showKeywordWarning, setShowKeywordWarning] = useState(false);
    const [keywordWarningMessage, setKeywordWarningMessage] = useState('');

    const [showEmptyQuestionWarning, setShowEmptyQuestionWarning] = useState(false);

    const [completionStatus, setCompletionStatus] = useState({
      keyword: false,
      question: false,
      answer: false
    });

    const [lastAutoSave, setLastAutoSave] = useState(null);

    const [crosswordId, setCrosswordId] = useState(null);

    useEffect(() => {
      // Lấy ID từ location state nếu có
      if (location.state?.crosswordId) {
        setCrosswordId(location.state.crosswordId);

      }
    }, [location]);

    const handleGoHome = () => {
      setShowHomeModal(true);
    };

    const handleCloseHomeModal = () => {
      setShowHomeModal(false);
    };

    const handleConfirmGoHome = async () => {
      try {
        // Kết thúc phiên và xóa cookie
        await crosswordService.endSession();
        
        setShowHomeModal(false);
        // Reset các state về giá trị ban đầu
        setPuzzleData({
          name: '',
          numQuestions: 0
        });
        setQuestionsData([]);
        setLetters([]);
        setKeywordPositions([]);
        setSelectedButton(0);
        
        // Xóa các cảnh báo
        setShowWarning(false);
        setWarningMessage('');
        setShowKeywordWarning(false);
        setKeywordWarningMessage('');
        setShowEmptyQuestionWarning(false);

        navigate('/account');
      } catch (error) {
        console.error('Lỗi khi kết thúc phiên:', error);
        toast.error('Có lỗi xảy ra khi kết thúc phiên làm việc');
      }
    };

    const handleSave = async () => {
      try {
        // Validate dữ liệu
        if (!puzzleData.name || questionsData.length === 0) {
          toast.error('Vui lòng điền đầy đủ từ khóa và câu hỏi');
          return;
        }

        // Kiểm tra xem tất cả câu hỏi và đáp án đã được điền chưa
        const isComplete = questionsData.every(q => 
          q.question.trim() !== '' && 
          q.answer.trim() !== '' &&
          q.answer.includes(q.keywordChar)
        );

        if (!isComplete) {
          toast.error('Vui lòng hoàn thành tất cả câu hỏi và đáp án');
          return;
        }

        // Format dữ liệu ô chữ và lấy startCol cuối cùng từ grid hiện tại
        const crosswordContent = {
          mainKeyword: [{
            keyword: puzzleData.name,
            associatedHorizontalKeywords: questionsData.map((q, index) => ({
              questionNumber: index + 1,
              questionContent: q.question,
              answer: q.answer,
              columnPosition: q.columnPosition // Lấy columnPosition đã được tính toán cuối cùng
            }))
          }]
        };

        // Gọi API lưu dữ liệu
        const response = await crosswordService.saveCrossword(crosswordContent);

        if (response.success) {
          toast.success('Lưu ô chữ thành công!');
          navigate('/account'); // Chuyển về trang account sau khi lưu thành công
        } else {
          toast.error(response.message || 'Có lỗi xảy ra khi lưu ô chữ');
        }
      } catch (error) {
        console.error('Save error:', error);
        if (error.code === 'ERR_NETWORK') {
          toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối và thử lại.');
        } else {
          toast.error(error.message || 'Có lỗi xảy ra khi lưu ô chữ');
        }
      }
    };

    const handleCloseSaveModal = () => {
      setShowSaveModal(false);
    };

    const handleConfirmSave = async () => {
      try {
        // Gửi dữ liệu lên server
        const response = await crosswordService.saveAndEndSession({
          mainKeyword: puzzleData.name,
          questions: questionsData
        });

        if (response.success) {
          // Reset tất cả state về giá trị ban đầu
          setPuzzleData({
            name: '',
            numQuestions: 0
          });
          setQuestionsData([]); // Xóa tất cả câu hỏi
          setLetters([]); // Xóa bảng chữ
          setKeywordPositions([]); // Xóa vị trí từ khóa
          setSelectedButton(0);
          
          // Xóa các cảnh báo
          setShowWarning(false);
          setWarningMessage('');
          setShowKeywordWarning(false);
          setKeywordWarningMessage('');
          setShowEmptyQuestionWarning(false);

          // Reset trạng thái hoàn thành
          setCompletionStatus({
            keyword: false,
            question: false,
            answer: false
          });

          console.log('Đã lưu ô chữ');
          setShowSaveModal(false);
          navigate('/account');
        }
      } catch (error) {
        console.error('Lỗi khi lưu ô chữ:', error);
        alert('Có lỗi xảy ra khi lưu ô chữ');
      }
    };

    const removeAccents = (str) => {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Za-z0-9]/g, '');
    };

    const handlePuzzleNameChange = (e) => {
      const value = removeAccents(e.target.value).toUpperCase();
      if (value.length <= MAX_KEYWORD_LENGTH) {
        setPuzzleData({
          name: value,
          numQuestions: value.length
        });

        if (value.length > 0 && value.length < 3) {
          setShowKeywordWarning(true);
          setKeywordWarningMessage('Từ khóa phải có ít nhất 3 ký tự');
        } else {
          setShowKeywordWarning(false);
          setKeywordWarningMessage('');
        }

        const newKeywordPositions = value.split('').map((char, index) => ({
          char,
          row: index,
          col: 8,
          isLocked: true
        }));
        setKeywordPositions(newKeywordPositions);

        const newLetters = Array(value.length).fill(null).map((_, rowIndex) => {
          const row = Array(17).fill('');
          row[8] = value[rowIndex];
          return row;
        });
        setLetters(newLetters);

        setQuestionsData(
          Array(value.length).fill(null).map((_, index) => ({
            question: '',
            answer: '',
            keywordChar: value[index],
            keywordPosition: 8
          }))
        );

        if (selectedButton >= value.length) {
          setSelectedButton(0);
        }
      }
    };

    const handleQuestionChange = (e) => {
      const value = e.target.value;
      if (value.length <= MAX_QUESTION_LENGTH) {
        const newQuestionsData = [...questionsData];
        newQuestionsData[selectedButton] = {
          ...newQuestionsData[selectedButton],
          question: value
        };
        setQuestionsData(newQuestionsData);
        setShowEmptyQuestionWarning(value.trim() === '');
        setTimeout(adjustFontSize, 0);
      }
    };

    const handleAnswerChange = (e) => {
      const value = removeAccents(e.target.value).toUpperCase();
      if (value.length <= MAX_ANSWER_LENGTH) {
        const newQuestionsData = [...questionsData];
        const currentQuestion = newQuestionsData[selectedButton];
        const keywordChar = currentQuestion.keywordChar;
        
        currentQuestion.answer = value;
        
        if (value.length > 0 && !value.includes(keywordChar)) {
          setShowWarning(true);
          setWarningMessage(`Đáp án phải có chữ ${keywordChar}`);
        } else if (value.includes(keywordChar)) {
          const positions = [];
          let pos = value.indexOf(keywordChar);
          while (pos !== -1) {
            positions.push(pos);
            pos = value.indexOf(keywordChar, pos + 1);
          }

          const middle = Math.floor(value.length / 2);
          const nearestToMiddle = positions.reduce((prev, curr) => 
            Math.abs(curr - middle) < Math.abs(prev - middle) ? curr : prev
          );

          const keywordCol = keywordPositions[selectedButton].col;
          const startCol = keywordCol - nearestToMiddle;
          const endCol = startCol + value.length - 1;

          if (startCol < 0) {
            setShowWarning(true);
            setWarningMessage(`Phần "${value.substring(0, -startCol)}" vượt quá giới hạn bên trái`);
          } else if (endCol > 16) {
            setShowWarning(true);
            setWarningMessage(`Phần "${value.substring(17 - startCol)}" vượt quá giới hạn bên phải`);
          } else {
            setShowWarning(false);
            setWarningMessage('');
            
            currentQuestion.columnPosition = startCol;
            
            const newLetters = [...letters];
            const currentRow = Array(17).fill('');
            value.split('').forEach((char, index) => {
              const col = startCol + index;
              if (col >= 0 && col < 17) {
                currentRow[col] = char;
              }
            });
            newLetters[selectedButton] = currentRow;
            setLetters(newLetters);
          }
        } else {
          setShowWarning(false);
          setWarningMessage('');
          
          const newLetters = [...letters];
          const currentRow = Array(17).fill('');
          currentRow[keywordPositions[selectedButton].col] = keywordChar;
          newLetters[selectedButton] = currentRow;
          setLetters(newLetters);
        }

        setQuestionsData(newQuestionsData);
      }
    };

    const handleButtonClick = (index) => {
      setSelectedButton(index);
      const newLetters = [...letters];
      if (!questionsData[index]?.answer) {
        const currentRow = Array(17).fill('');
        currentRow[8] = puzzleData.name[index];
        newLetters[index] = currentRow;
        setLetters(newLetters);
      }
    };

    const adjustFontSize = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.fontSize = '1.6rem';
      
      while (textarea.scrollHeight > textarea.clientHeight && parseFloat(getComputedStyle(textarea).fontSize) > 1) {
        const currentSize = parseFloat(getComputedStyle(textarea).fontSize);
        textarea.style.fontSize = `${currentSize - 0.1}rem`;
      }
    };

    useEffect(() => {
      adjustFontSize();
    }, [selectedButton]);

    const updateCompletionStatus = () => {
      setCompletionStatus({
        keyword: !showKeywordWarning && puzzleData.name.length >= 3,
        question: !showEmptyQuestionWarning && questionsData.every(q => q.question.trim() !== ''),
        answer: !showWarning && questionsData.every(q => 
          q.answer.includes(q.keywordChar) && q.answer.length >= 2
        )
      });
    };

    useEffect(() => {
      updateCompletionStatus();
    }, [puzzleData.name, questionsData, showKeywordWarning, showWarning, showEmptyQuestionWarning]);

    const autoSave = async () => {
      try {
        if (!puzzleData.name || questionsData.length === 0) return;

        const response = await crosswordService.autoSave({
          crosswordId: crosswordId,
          mainKeyword: puzzleData.name,
          questions: questionsData
        });

        if (response.success) {
          setLastAutoSave(new Date());
          console.log('Đã tự động lưu');
        }
      } catch (error) {
        console.error('Lỗi khi tự động lưu:', error);
      }
    };

    useEffect(() => {
      const autoSaveInterval = setInterval(autoSave, 300000); // 5 phút
      return () => clearInterval(autoSaveInterval);
    }, [puzzleData, questionsData]);

    const AutoSaveIndicator = () => {
      if (!lastAutoSave) return null;
      
      return (
        <div className="text-sm text-gray-500 mt-2">
          Lưu tự động lần cuối: {lastAutoSave.toLocaleTimeString()}
        </div>
      );
    };

    return (
      <CreatePageContainer>
        <Banner>
          <BackButton onClick={handleGoHome}>Quay lại</BackButton>
          <KeywordInputContainer>
            <PuzzleNameInput
              value={puzzleData.name}
              onChange={handlePuzzleNameChange}
              placeholder="NHẬP TỪ KHOÁ..."
              maxLength={MAX_KEYWORD_LENGTH}
              style={{ 
                textTransform: 'uppercase',
                borderColor: showKeywordWarning ? '#ff4d4d' : '#ccc'
              }}
            />
            <CheckIcon $visible={completionStatus.keyword}>✓</CheckIcon>
            {showKeywordWarning && (
              <KeywordWarningMessage>
                * {keywordWarningMessage}
              </KeywordWarningMessage>
            )}
            <KeywordLength>
              {puzzleData.name.length}/{MAX_KEYWORD_LENGTH}
            </KeywordLength>
          </KeywordInputContainer>
          <SaveButton 
            onClick={handleSave}
            disabled={!Object.values(completionStatus).every(status => status)}
          >
            Lưu lại
          </SaveButton>
        </Banner>

        <HomeModal 
          show={showHomeModal}
          onConfirm={handleConfirmGoHome}
          onClose={handleCloseHomeModal}
        />

        <SaveModal
          show={showSaveModal}
          onConfirm={handleConfirmSave}
          onClose={handleCloseSaveModal}
        />

        <MainContent>
          <GridWrapper>
            <ButtonColumn>
              {Array.from({ length: puzzleData.numQuestions || 0 }, (_, index) => (
                <RoundButton 
                  key={index} 
                  $isSelected={selectedButton === index}
                  onClick={() => handleButtonClick(index)}
                >
                  {index + 1}
                </RoundButton>
              ))}
            </ButtonColumn>

            <GridContainer>
              {Array.from({ length: puzzleData.numQuestions || 0 }, (_, rowIndex) => (
                <GridRow key={rowIndex}>
                  {Array.from({ length: 17 }, (_, colIndex) => (
                    <GridCell 
                      key={`${rowIndex}-${colIndex}`}
                      $isKeywordColumn={colIndex === 8}
                      $hasLetter={letters[rowIndex]?.[colIndex] !== ''}
                    >
                      {letters[rowIndex]?.[colIndex] && (
                        <Letter>{letters[rowIndex][colIndex]}</Letter>
                      )}
                    </GridCell>
                  ))}
                </GridRow>
              ))}
            </GridContainer>
          </GridWrapper>

          <RightPanel>
            {puzzleData.numQuestions > 0 ? (
              <>
                <QuestionForm>
                  <FormTitle>
                    Câu hỏi
                    <CheckIcon $visible={!showEmptyQuestionWarning && questionsData[selectedButton]?.question.trim() !== ''}>✓</CheckIcon>
                  </FormTitle>
                  <QuestionInput 
                    ref={textareaRef}
                    value={questionsData[selectedButton]?.question || ''}
                    onChange={handleQuestionChange}
                    placeholder="Nhập câu hỏi ở đây..."
                    maxLength={MAX_QUESTION_LENGTH}
                  />
                  <QuestionLength>
                    {(questionsData[selectedButton]?.question || '').length}/{MAX_QUESTION_LENGTH}
                  </QuestionLength>
                </QuestionForm>

                <AnswerForm>
                  <FormTitle>
                    Nhập đáp án (có ít nhất 2 kí tự)
                    <CheckIcon $visible={!showWarning && 
                      questionsData[selectedButton]?.answer.includes(questionsData[selectedButton]?.keywordChar) && 
                      questionsData[selectedButton]?.answer.length >= 2}>✓</CheckIcon>
                  </FormTitle>
                  <InputBox 
                    type="text" 
                    value={questionsData[selectedButton]?.answer || ''}
                    onChange={handleAnswerChange}
                    placeholder={`NHẬP ĐÁP ÁN CHỨA CHỮ ${questionsData[selectedButton]?.keywordChar}...`}
                    maxLength={MAX_ANSWER_LENGTH}
                    style={{ 
                      textTransform: 'uppercase',
                      borderColor: showWarning ? '#ff4d4d' : '#ccc'
                    }}
                  />
                  {showWarning && (
                    <WarningMessage style={{ color: '#ff4d4d' }}>
                      * {warningMessage}
                    </WarningMessage>
                  )}
                  <AnswerLength>
                    {(questionsData[selectedButton]?.answer || '').length}/{MAX_ANSWER_LENGTH}
                  </AnswerLength>
                </AnswerForm>
              </>
            ) : (
              <EmptyStateMessage>
                Hãy nhập từ khóa để bắt đầu
              </EmptyStateMessage>
            )}
          </RightPanel>
        </MainContent>
        <AutoSaveIndicator />
      </CreatePageContainer>
    );
  };

  const CreatePageContainer = styled.div`
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

  const SaveButton = styled(BackButton)`
    background-color: ${props => props.disabled ? '#cccccc' : '#FFA500'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    position: relative;

    &:hover::before {
      content: ${props => props.disabled ? '"Còn dữ liệu chưa nhập hoặc bạn nhập sai yêu cầu"' : '""'};
      position: absolute;
      top: 120%;
      right: 0;
      transform: none;
      padding: 8px 12px;
      background-color: #333;
      color: white;
      border-radius: 4px;
      font-size: 0.9rem;
      white-space: nowrap;
      z-index: 1000;
    }
  `;

  const KeywordInputContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0 40px;
    position: relative;
  `;

  const PuzzleNameInput = styled.input`
    width: 80%;
    text-align: center;
    font-size: 2.5rem;
    color: #333;
    padding: 5px 5px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: white;
    transition: all 0.3s ease;
    outline: none;
    font-weight: bold;

    &:hover, &:focus {
      border-color: #4CAF50;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    &::placeholder {
      color: #999;
      font-weight: normal;
      font-size: 1.8rem;
    }
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
    background-color: ${props => props.$isSelected ? '#FFD700' : '#008080'};
    color: ${props => props.$isSelected ? '#000' : '#fff'};
    border: none;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 1px 0;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${props => props.$isSelected ? '#FFD700' : '#006666'};
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
    border: 1px solid ${props => props.hasLetter ? '#ccc' : '#fff'};
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

  const FormTitle = styled.h3`
    margin: 0;
    color: #333;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
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

  const AnswerForm = styled.div`
    background-color: #f1f1f1;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-height: 150px;
    display: flex;
    flex-direction: column;
  `;

  const QuestionInput = styled.textarea`
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    font-size: 1.6rem;
    line-height: 1.8;
    color: #333;
    flex: 1;
    border: 1px solid #ccc;
    margin-top: 10px;
    resize: none;
    outline: none;
    min-height: 250px;
    overflow-y: hidden;
    transition: font-size 0.1s ease;

    &:focus {
      border-color: #333;
    }

    &::placeholder {
      font-size: 1.4rem;
      color: #999;
    }
  `;

  const InputBox = styled.input.attrs(props => ({
    onChange: props.onChange,
    value: props.value,
    onInput: (e) => {
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      props.onChange(e);
      
      setTimeout(() => {
        e.target.setSelectionRange(start, end);
      }, 0);
    }
  }))`
    width: 100%;
    padding: 15px;
    font-size: 1.6rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    outline: none;
    margin-top: 10px;
    height: 80px;
    max-height: 80px;
    font-weight: bold;
    letter-spacing: 1px;

    &:focus {
      border-color: #333;
    }

    &::placeholder {
      font-size: 1.2rem;
      font-weight: normal;
    }
  `;

  const KeywordLength = styled.span`
    color: #666;
    font-size: 0.9rem;
    margin-left: 10px;
    padding-bottom: 4px;
  `;

  const QuestionLength = styled.span`
    color: #666;
    font-size: 0.9rem;
    text-align: right;
    margin-top: 5px;
  `;

  const AnswerLength = styled.span`
    color: #666;
    font-size: 0.9rem;
    text-align: right;
    margin-top: 5px;
  `;

  const EmptyStateMessage = styled.div`
    text-align: center;
    color: #666;
    font-size: 1.6rem;
    padding: 40px;
    font-weight: 500;
  `;

  const WarningMessage = styled.div`
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: 5px;
    font-style: italic;
  `;

  const KeywordWarningMessage = styled.div`
    color: #ff4d4d;
    font-size: 1rem;
    position: absolute;
    bottom: 0;
    font-style: italic;
  `;

  const CheckIcon = styled.span`
    color: #4CAF50;
    margin-left: 10px;
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
  `;

  export default CreatePage;
