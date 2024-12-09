import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ResetModal, HomeModal } from '../components/modals/PlayModal';

const TeamPlay = () => {
  const navigate = useNavigate();
  const [puzzleData, setPuzzleData] = useState(null);
  const [questionData, setQuestionData] = useState('');
  const [answer, setAnswer] = useState('');
  const [letters, setLetters] = useState(
    Array(12).fill(null).map(() => Array(16).fill(''))
  );
  const [showResetModal, setShowResetModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showRedBorder, setShowRedBorder] = useState(false);
  
  // State mới cho đội chơi
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Các màu sắc cho từng đội
  const teamColors = {
    1: '#FF6B6B', // Đỏ nhạt
    2: '#4ECDC4', // Xanh ngọc
    3: '#FFD93D', // Vàng
    4: '#95E1D3'  // Xanh mint
  };

  // Thêm state cho tên và điểm của các đội
  const [teams, setTeams] = useState([
    { id: 1, name: 'Đội 1', score: 0 },
    { id: 2, name: 'Đội 2', score: 0 },
    { id: 3, name: 'Đội 3', score: 0 },
    { id: 4, name: 'Đội 4', score: 0 }
  ]);

  const [isEditingNames, setIsEditingNames] = useState(true);

  useEffect(() => {
    const fetchPuzzleData = async () => {
      const data = {
        name: 'Ô chữ thú vị',
        author: 'Tác giả 1',
        numQuestions: 5,
      };
      setPuzzleData(data);
    };

    const fetchQuestionData = async () => {
      const question = "Câu hỏi: Tên thành phố lớn nhất Việt Nam là gì?";
      setQuestionData(question);
    };

    const initializeLetters = () => {
      const initialLetters = Array(12).fill(null).map(() => Array(16).fill(''));
      setLetters(initialLetters);
    };

    fetchPuzzleData();
    fetchQuestionData();
    initializeLetters();
  }, []);

  // Các handlers giống SinglePlay...
  const handleGoBack = () => setShowHomeModal(true);
  const handleCloseHomeModal = () => setShowHomeModal(false);
  const handleConfirmGoHome = () => {
    setShowHomeModal(false);
    navigate('/library');
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    setIsAnswering(true);
  };

  // Thêm hàm kiểm tra số đội hợp lệ
  const getValidTeams = () => {
    return teams.filter(team => team.name.trim() !== '');
  };

  // Chỉnh sửa handleReset
  const handleReset = () => {
    if (!isGameStarted) {
      const validTeams = getValidTeams();
      if (validTeams.length < 2) {
        alert('Cần ít nhất 2 đội để bắt đầu chơi');
        return;
      }
      setIsGameStarted(true);
      setIsEditingNames(false);
    } else {
      setShowResetModal(true);
    }
  };

  const handleCloseModal = () => setShowResetModal(false);

  const handleConfirmReset = () => {
    setShowResetModal(false);
    setSelectedButton(null);
    setAnswer('');
    setIsAnswering(false);
    setKeyword('');
    setIsGameStarted(false);
    setSelectedTeam(null);
    setIsEditingNames(true);
    setTeams(teams.map(team => ({ ...team, score: 0 })));
    setLetters(Array(12).fill(null).map(() => Array(16).fill('')));
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value.toUpperCase());
  };

  const handleButtonClick = (index) => {
    if (!isGameStarted) return;
    if (isAnswering) {
      setShowRedBorder(true);
      setTimeout(() => {
        setShowRedBorder(false);
      }, 3000);
      return;
    }
    setSelectedButton(index);
  };

  const handleAnswerSubmit = () => {
    setAnswer('');
    setIsAnswering(false);
  };

  // Handler mới cho việc chọn đội
  const handleTeamSelect = (teamNumber) => {
    if (!isGameStarted) return;
    setSelectedTeam(teamNumber);
  };

  // Thêm handler cho việc đổi tên đội
  const handleTeamNameChange = (teamId, newName) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, name: newName } : team
    ));
  };

  return (
    <PlayPageContainer>
      <Banner>
        <BackButton onClick={handleGoBack}>Quay lại</BackButton>
        <PuzzleName>{puzzleData ? puzzleData.name : 'Đang tải...'}</PuzzleName>
        <ResetButton onClick={handleReset}>
          {isGameStarted ? 'Chơi lại từ đầu' : 'Bắt đầu chơi'}
        </ResetButton>
      </Banner>

      <TeamButtonsContainer>
        {teams.map(team => (
          <TeamCard
            key={team.id}
            isSelected={selectedTeam === team.id}
            backgroundColor={teamColors[team.id]}
            disabled={!isGameStarted}
            onClick={() => !isGameStarted ? null : handleTeamSelect(team.id)}
            style={{ 
              display: !isGameStarted || team.name.trim() !== '' ? 'flex' : 'none'
            }}
          >
            <ScoreSection>
              <ScoreDisplay>{team.score}</ScoreDisplay>
            </ScoreSection>
            <TeamSection>
              <TeamNameInput
                type="text"
                value={team.name}
                onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                disabled={!isEditingNames}
                maxLength={20}
                placeholder="Nhập tên đội..."
                required
                onClick={(e) => e.stopPropagation()}
              />
            </TeamSection>
          </TeamCard>
        ))}
      </TeamButtonsContainer>

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
    </PlayPageContainer>
  );
};

// Styled components mới cho TeamPlay
const TeamButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px 35px;
  width: 100%;
  box-sizing: border-box;
  gap: 40px;
  margin: 12px 0 12px;
`;

const TeamCard = styled.div`
  flex: 1;
  max-width: 300px;
  min-width: 200px;
  display: flex;
  background-color: ${props => props.backgroundColor};
  border-radius: 12px;
  border: 4px solid ${props => 
    props.isSelected 
      ? 'rgba(0, 0, 0, 0.3)'
      : 'transparent'
  };
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const ScoreSection = styled.div`
  width: 120px;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-right: 2px solid rgba(0, 0, 0, 0.1);
  margin: -4px 0 -4px -4px;
  pointer-events: none;
`;

const ScoreDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  min-width: 90px;
  text-align: center;
`;

const TeamSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
  margin-right: -4px;
  pointer-events: none;
`;

const TeamNameInput = styled.input`
  flex: 1;
  background: ${props => props.disabled ? 'transparent' : 'rgba(255, 255, 255, 0.5)'};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 1.2rem;
  color: ${props => props.disabled ? '#333' : '#000'};
  font-weight: bold;
  outline: none;
  pointer-events: auto;

  &:disabled {
    border-color: transparent;
    cursor: default;
    opacity: 1;
    pointer-events: none;
  }

  &:focus {
    background: rgba(255, 255, 255, 0.6);
    border-color: rgba(0, 0, 0, 0.3);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:required:invalid {
    border-color: ${props => !props.disabled && 'red'};
  }
`;

// Thêm các styled components còn thiếu
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
  padding: 20px 30px;
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

const MainContent = styled.div`
  display: flex;
  gap: 30px;
  padding: 0 40px 20px;
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
  align-items: flex-start;
  flex: 3;
  max-width: 900px;
  margin-left: -20px;
  padding-top: 10px;
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

export default TeamPlay;
