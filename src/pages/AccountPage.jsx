import React, { useState, useEffect, useCallback, memo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import ChangePasswordModal from '../components/modals/ChangePWModal';
import { useAuth } from '../contexts/AuthContext';
import CrosswordCard from '../components/cards/CrosswordCard';
import { crosswordService } from '../services/crosswordService';
import EditModal from '../components/modals/Edit';

const VALID_OCCUPATIONS = ['Giáo viên', 'Học sinh', 'Sinh viên', 'Khác'];

const AccountPage = () => {
  const { user, fetchUserProfile } = useAuth();
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    birthDate: '',
    occupation: '',
    phone: '',
    createdAt: '',
    updatedAt: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPWModal, setShowPWModal] = useState(false);
  const [originalUserInfo, setOriginalUserInfo] = useState({
    fullName: '',
    birthDate: '',
    occupation: '',
    phone: '',
    createdAt: '',
    updatedAt: ''
  });
  const [allCrosswords, setAllCrosswords] = useState([]);
  const [crosswords, setCrosswords] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoadingCrosswords, setIsLoadingCrosswords] = useState(false);
  const [selectedCrossword, setSelectedCrossword] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [canSave, setCanSave] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Nếu dateString là định dạng locale từ backend (19:41:09 15/12/2024)
      if (dateString.includes('/')) {
        return dateString;
      }
      
      // Nếu là định dạng ISO hoặc timestamp
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        setIsLoadingProfile(true);
        
        if (!user?.fullName) {
          await fetchUserProfile();
        } else if (isMounted) {
          const formattedData = {
            fullName: user.fullName || '',
            birthDate: user.birthDate || '',
            occupation: user.occupation || '',
            phone: user.phone || '',
            createdAt: formatDate(user.createdAt) || '',
            updatedAt: formatDate(user.updatedAt) || ''
          };
          setUserInfo(formattedData);
          setOriginalUserInfo(formattedData);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [user?.fullName]);

  const loadCrosswords = useCallback(async () => {
    setIsLoadingCrosswords(true);
    try {
      const response = await crosswordService.fetchCrosswords();
      if (response.success) {
        setAllCrosswords(response.data);
      } else {
        toast.error('Không thể tải danh sách ô chữ');
      }
    } catch (error) {
      toast.error('Không thể tải danh sách ô chữ');
    } finally {
      setIsLoadingCrosswords(false);
    }
  }, []);

  useEffect(() => {
    loadCrosswords();
  }, [loadCrosswords]);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCrosswords(allCrosswords.slice(startIndex, endIndex));
  }, [page, allCrosswords, itemsPerPage]);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const checkDuplicateName = debounce(async (fullName) => {
    if (!fullName || fullName === originalUserInfo.fullName) {
      setNameError('');
      setCanSave(true);
      return;
    }

    setIsCheckingName(true);
    try {
      const response = await userService.checkDuplicateFullname(fullName);
      
      // Xử lý đơn giản dựa trên isDuplicate
      if (response.isDuplicate) {
        // Tên bị trùng
        setNameError('Tên này đã được sử dụng');
        setCanSave(false);
      } else {
        // Tên không trùng
        setNameError('');
        setCanSave(true);
      }
    } catch (error) {
      setNameError('Lỗi kiểm tra tên');
      setCanSave(false);
    } finally {
      setIsCheckingName(false);
    }
  }, 500);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'fullName') {
      checkDuplicateName(value);
    }
  };

  const handleSaveClick = async () => {
    if (!canSave) {
      toast.error('Vui lòng sử dụng tên khác');
      return;
    }

    try {
      setIsSavingProfile(true);
      const response = await userService.updateProfile({
        fullName: userInfo.fullName,
        birthDate: userInfo.birthDate || '',
        occupation: userInfo.occupation,
        phone: userInfo.phone || ''
      });

      if (response.success) {
        toast.success('Cập nhật thông tin thành công');
        const updatedData = {
          ...response.data,
          createdAt: formatDate(response.data.createdAt) || '',
          updatedAt: formatDate(response.data.updatedAt) || ''
        };
        setUserInfo(updatedData);
        setOriginalUserInfo(updatedData);
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    if (
      userInfo.fullName !== originalUserInfo.fullName ||
      userInfo.birthDate !== originalUserInfo.birthDate ||
      userInfo.occupation !== originalUserInfo.occupation ||
      userInfo.phone !== originalUserInfo.phone
    ) {
      if (window.confirm('Bạn có chắc muốn hủy các thay đổi?')) {
        setUserInfo(originalUserInfo);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCardClick = useCallback((crossword) => {
    if (crossword) {
      const modalData = {
        _id: crossword._id,
        title: crossword.title || '',
        status: crossword.status === 'Công khai' ? 'public' : 'private',
        grade: crossword.grade || '',
        subject: crossword.subject || '',
      };
      setSelectedCrossword(modalData);
      setShowEditModal(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
    loadCrosswords();
    setTimeout(() => {
      setSelectedCrossword(null);
    }, 300);
  }, [loadCrosswords]);

  const handleUpdateCrossword = useCallback(async (updatedData) => {
    try {
      if (!selectedCrossword?._id) return;

      // Format lại data cho đúng với yêu cầu của API
      const formattedData = {
        title: updatedData.title,
        status: updatedData.status === 'public' ? 'Công khai' : 'Không công khai',
        subject: updatedData.subject,
        grade: updatedData.grade
      };
      
      const response = await crosswordService.updateCrossword(selectedCrossword._id, formattedData);
      
      if (response.success) {
        toast.success('Cập nhật thông tin thành công');
        loadCrosswords();
        handleCloseModal();
      } else {
        toast.error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  }, [selectedCrossword, loadCrosswords, handleCloseModal]);

  const totalPages = Math.ceil(allCrosswords.length / itemsPerPage);

  return (
    <PageContainer>
      {isLoadingProfile ? (
        <LoadingSpinner>Đang tải thông tin...</LoadingSpinner>
      ) : (
        <ContentWrapper>
          <CrosswordList>
            <HeaderSection>
              <SectionTitle>Danh sách ô chữ của tôi</SectionTitle>
              <TotalItems>Tổng số: <strong>{allCrosswords.length}</strong></TotalItems>
            </HeaderSection>
            
            {isLoadingCrosswords ? (
              <LoadingSpinner>Đang tải danh sách ô chữ...</LoadingSpinner>
            ) : (
              <>
                <CrosswordGrid>
                  {crosswords.length > 0 ? (
                    crosswords.map((crossword) => {
                      return (
                        <CrosswordCard
                          key={crossword._id}
                          title={crossword.title || 'Ô chữ không có tên'}
                          questionCount={crossword.questionCount || 0}
                          timesPlayed={crossword.timesPlayed || 0}
                          completionCount={crossword.completionCount || 0}
                          isCompleted={crossword.isCompleted}
                          grade={crossword.grade}
                          author={crossword.author || 'Ẩn danh'}
                          onClick={() => handleCardClick(crossword)}
                        />
                      );
                    })
                  ) : (
                    <EmptyMessage>Bạn chưa có ô chữ nào</EmptyMessage>
                  )}
                </CrosswordGrid>
                
                {crosswords.length > 0 && (
                  <PaginationContainer>
                    <PageButton 
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                    >
                      Trang trước
                    </PageButton>
                    <PageInfo>Trang {page} / {totalPages}</PageInfo>
                    <PageButton 
                      onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages}
                    >
                      Trang kế
                    </PageButton>
                  </PaginationContainer>
                )}
              </>
            )}
          </CrosswordList>

          <AccountInfo>
            <SectionTitle>Thông tin tài khoản</SectionTitle>
            
            <FormGroup>
              <Label>
                Họ và tên {isEditing && <span className="required">*</span>}
              </Label>
              <InputWrapper>
                <Input
                  type="text"
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  $hasError={!!nameError}
                />
                {isEditing && (
                  <StatusMessage>
                    {isCheckingName && (
                      <CheckingStatus>
                        <i className="fas fa-spinner fa-spin" /> Đang kiểm tra...
                      </CheckingStatus>
                    )}
                    {nameError && (
                      <ErrorStatus>
                        <i className="fas fa-exclamation-circle" /> {nameError}
                      </ErrorStatus>
                    )}
                    {!isCheckingName && !nameError && userInfo.fullName !== originalUserInfo.fullName && (
                      <ValidStatus>
                        <i className="fas fa-check-circle" /> Tên hợp lệ
                      </ValidStatus>
                    )}
                  </StatusMessage>
                )}
              </InputWrapper>
            </FormGroup>

            <InfoGroup>
              <Label>Ngày sinh</Label>
              <Input
                type="date"
                name="birthDate"
                value={userInfo.birthDate || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                max={new Date().toISOString().split('T')[0]}
              />
            </InfoGroup>

            <InfoGroup>
              <Label>Nghề nghiệp</Label>
              <Select
                name="occupation"
                value={userInfo.occupation || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Chọn nghề nghiệp</option>
                {VALID_OCCUPATIONS.map(occupation => (
                  <option key={occupation} value={occupation}>
                    {occupation}
                  </option>
                ))}
              </Select>
            </InfoGroup>

            <InfoGroup>
              <Label>Số điện thoại</Label>
              <Input
                name="phone"
                value={userInfo.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Nhập số điện thoại"
              />
            </InfoGroup>

            <InfoGroup>
              <Label>Ngày tạo tài khoản</Label>
              <Input value={userInfo.createdAt || ''} disabled />
            </InfoGroup>

            <InfoGroup>
              <Label>Đăng nhập lần trước</Label>
              <Input value={userInfo.updatedAt || ''} disabled />
            </InfoGroup>

            <ButtonGroup>
              {isEditing ? (
                <>
                  <SaveButton 
                    onClick={handleSaveClick}
                    disabled={!canSave || isCheckingName}
                  >
                    {isSavingProfile ? 'Đang lưu...' : 'Lưu'}
                  </SaveButton>
                  <CancelButton 
                    onClick={handleCancelEdit}
                    disabled={isSavingProfile}
                  >
                    Hủy
                  </CancelButton>
                </>
              ) : (
                <EditButton 
                  onClick={() => setIsEditing(true)}
                  disabled={isSavingProfile}
                >
                  Chỉnh sửa
                </EditButton>
              )}
              <ChangePasswordButton 
                onClick={() => setShowPWModal(true)}
                disabled={isSavingProfile}
              >
                Đổi mật khẩu
              </ChangePasswordButton>
            </ButtonGroup>
          </AccountInfo>
        </ContentWrapper>
      )}

      <ChangePasswordModal 
        show={showPWModal} 
        onClose={() => setShowPWModal(false)} 
      />

      {selectedCrossword && (
        <EditModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          data={selectedCrossword}
          mode="edit"
          onSave={handleUpdateCrossword}
        />
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CrosswordList = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 500px;
`;

const AccountInfo = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin: 0;
`;

const InfoGroup = styled.div`
  margin-bottom: 10px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  color: #555;
  font-weight: 500;
  font-size: 0.85rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.disabled ? '#ddd' : '#ccc'};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid ${props => props.disabled ? '#ddd' : '#aaa'};
  border-radius: 6px;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const EditButton = styled(Button)`
  background: #4CAF50;
  color: white;
  &:hover {
    background: #45a049;
  }
`;

const SaveButton = styled(Button)`
  background: #2196F3;
  color: white;
  &:hover {
    background: #1976D2;
  }
`;

const CancelButton = styled(Button)`
  background: #f44336;
  color: white;
  &:hover {
    background: #d32f2f;
  }
`;

const ChangePasswordButton = styled(Button)`
  background: #666;
  color: white;
  &:hover {
    background: #555;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #f44336;
  border-radius: 4px;
  background-color: #ffebee;
`;

const CrosswordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: ${props => props.disabled ? '#ccc' : '#333'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #444;
  }
`;

const PageInfo = styled.span`
  color: #666;
  font-size: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 40px 0;
  font-style: italic;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const TotalItems = styled.span`
  color: #333;
  font-size: 1.3rem;
  font-weight: 500;
  
  strong {
    font-weight: 700;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StatusMessage = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    margin-right: 4px;
  }
`;

const CheckingStatus = styled.span`
  color: #666;
  animation: fadeIn 0.3s ease-in;
`;

const ErrorStatus = styled.span`
  color: #dc3545;
  animation: fadeIn 0.3s ease-in;
`;

const ValidStatus = styled.span`
  color: #28a745;
  animation: fadeIn 0.3s ease-in;
`;

// Thêm keyframes cho animation
const GlobalStyle = createGlobalStyle`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default memo(AccountPage);
