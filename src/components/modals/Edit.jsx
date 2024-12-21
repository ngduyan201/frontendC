import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { crosswordService } from '../../services/crosswordService';
import { toast } from 'react-toastify';

const EditModal = ({ isOpen, onClose, data, mode = 'edit', onSave }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(data || {
    title: '',
    status: '',
    grade: '',
    subject: '',
  });
  const [isEditing, setIsEditing] = useState(mode === 'create');

  useEffect(() => {
    if (mode === 'edit') {
      setFormData(data);
    }
  }, [data, mode]);

  const handlePlayClick = () => {
    navigate('/team-play');
    onClose();
  };

  const handleEditContentClick = async () => {
    try {
      // Gọi API để tạo edit session
      const response = await crosswordService.startEditSession(data._id);
      
      if (response.success) {
        navigate('/create'); // Cookie đã được set tự động
        onClose();
      } else {
        toast.error(response.message || 'Không thể bắt đầu chỉnh sửa');
      }
    } catch (error) {
      console.error('Error starting edit session:', error);
      toast.error('Có lỗi xảy ra khi bắt đầu chỉnh sửa');
    }
  };

  const handleEditInfoClick = () => {
    if (isEditing) {
      // Log data trước khi gửi đi
      console.log('Form data being sent:', formData);
      onSave(formData);
    }
    setIsEditing(!isEditing);
  };

  const getSubjectsByGrade = (grade) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateClick = async () => {
    try {
      // Validate dữ liệu
      if (!formData.title || !formData.status || !formData.grade || !formData.subject) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      // Chuyển đổi status chính xác
      const dbStatus = formData.status === 'public' ? 'Công khai' : 'Không công khai';
      
      // Tạo object data để gửi lên server
      const crosswordData = {
        title: formData.title,
        status: dbStatus,
        gradeLevel: formData.grade,
        subject: formData.subject
      };

      console.log('Creating crossword with data:', crosswordData);
      const response = await crosswordService.createCrossword(crosswordData);

      if (response.success) {
        // Cookie đã được set tự động bởi browser
        navigate('/create'); // Chuyển đến trang tạo nội dung
        onClose();
      }
    } catch (error) {
      console.error('Error in handleCreateClick:', error);
      alert('Có lỗi xảy ra khi tạo ô chữ');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            {mode === 'create' ? 'Tạo ô chữ mới' : 'Thông tin ô chữ'}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <InfoGroup>
            <InfoLabel>Tên ô chữ:</InfoLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tên ô chữ"
              disabled={!isEditing}
            />
          </InfoGroup>

          <InfoGroup>
            <InfoLabel>Trạng thái:</InfoLabel>
            <StatusButtonGroup>
              <StatusButton 
                $isSelected={formData.status === 'public'}
                onClick={() => !isEditing ? null : handleInputChange({
                  target: { name: 'status', value: 'public' }
                })}
                disabled={!isEditing}
                data-tooltip="Mọi người có thể tìm thấy và chơi ô chữ của bạn"
              >
                Công khai
              </StatusButton>
              <StatusButton 
                $isSelected={formData.status === 'private'}
                onClick={() => !isEditing ? null : handleInputChange({
                  target: { name: 'status', value: 'private' }
                })}
                disabled={!isEditing}
                data-tooltip="Chỉ một mình bạn mới có quyền chơi, người khác chỉ có thể chơi khi bạn tổ chức Chơi bằng mã"
              >
                Không công khai
              </StatusButton>
            </StatusButtonGroup>
          </InfoGroup>

          <InfoGroup>
            <InfoLabel>Cấp lớp:</InfoLabel>
            <Select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="">Chọn cấp lớp</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={`Lớp ${i + 1}`}>
                  Lớp {i + 1}
                </option>
              ))}
            </Select>
          </InfoGroup>

          <InfoGroup>
            <InfoLabel>Môn học:</InfoLabel>
            <Select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={!isEditing || !formData.grade}
            >
              <option value="">Chọn môn học</option>
              {formData.grade && getSubjectsByGrade(formData.grade).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
          </InfoGroup>
        </ModalContent>

        <ModalActions>
          {mode === 'create' ? (
            // Hiển thị nút cho chế độ tạo mới
            <ButtonGroup style={{ width: '100%', justifyContent: 'flex-end' }}>
              <BackButton onClick={onClose}>Huỷ</BackButton>
              <CreateButton onClick={handleCreateClick}>Tạo mới</CreateButton>
            </ButtonGroup>
          ) : (
            // Hiển thị các nút cho chế độ chỉnh sửa
            <>
              <ButtonGroup>
                <BackButton onClick={onClose}>Huỷ</BackButton>
                <EditInfoButton onClick={handleEditInfoClick}>
                  {isEditing ? 'Lưu lại' : 'Chỉnh sửa thông tin'}
                </EditInfoButton>
              </ButtonGroup>
              <ButtonGroup>
                <EditContentButton onClick={handleEditContentClick}>
                  Chỉnh sửa nội dung
                </EditContentButton>
                <PlayButton onClick={handlePlayClick}>Chơi</PlayButton>
              </ButtonGroup>
            </>
          )}
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 75vw;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.div`
  padding: 30px;
  flex-grow: 1;
  overflow-y: auto;
`;

const InfoGroup = styled.div`
  display: flex;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
  gap: 20px;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  flex: 1;
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;
  padding-top: 12px;
`;

const Input = styled.input`
  flex: 2;
  padding: 12px;
  font-size: 1.1rem;
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

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  flex: 2;
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  background-color: white;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 48px;
  line-height: 1.4;
  font-family: inherit;

  option {
    padding: 12px;
    line-height: 1.4;
    white-space: pre-wrap;
    font-family: inherit;
    max-width: 300px;
    word-wrap: break-word;
  }

  &:focus {
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(102, 102, 102, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 30px;
  border-top: 1px solid #eee;
  background-color: #f8f8f8;
  border-radius: 0 0 12px 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
`;

const BackButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const EditInfoButton = styled(Button)`
  background-color: ${props => props.children === 'Lưu lại' ? '#4CAF50' : '#333'};
  color: white;

  &:hover {
    background-color: ${props => props.children === 'Lưu lại' ? '#45a049' : '#444'};
  }
`;

const EditContentButton = styled(Button)`
  background-color: #2196F3;
  color: white;

  &:hover {
    background-color: #1976D2;
  }
`;

const PlayButton = styled(Button)`
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const CreateButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  min-width: 120px;

  &:hover {
    background-color: #45a049;
  }
`;

const StatusButtonGroup = styled.div`
  flex: 2;
  display: flex;
  gap: 10px;
`;

const StatusButton = styled.button`
  flex: 1;
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid ${props => props.$isSelected ? '#4CAF50' : '#ddd'};
  border-radius: 6px;
  background-color: ${props => props.$isSelected ? '#E8F5E9' : 'white'};
  color: ${props => props.$isSelected ? '#2E7D32' : '#666'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;

  &:hover:not(:disabled) {
    border-color: #4CAF50;
    background-color: ${props => props.$isSelected ? '#E8F5E9' : '#F5F5F5'};
  }

  &:disabled {
    opacity: 0.7;
    background-color: #f5f5f5;
  }

  /* Tooltip styles */
  &::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 12px;
    background-color: #333;
    color: white;
    font-size: 0.9rem;
    border-radius: 4px;
    white-space: normal;
    max-width: 250px;
    width: max-content;
    text-align: center;
    line-height: 1.4;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  /* Arrow for tooltip */
  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::before,
  &:hover::after {
    visibility: visible;
    opacity: 1;
    bottom: calc(100% + 10px);
  }
`;
