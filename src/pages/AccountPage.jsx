import React, { useState, useEffect, useCallback, memo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import ChangePasswordModal from '../components/modals/ChangePWModal';
import { useAuth } from '../contexts/AuthContext';
import CrosswordCard from '../components/features/CrosswordCard';
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
      console.error('Error formatting date:', error);
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
      console.error('Error loading crosswords:', error);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
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
      console.log('Setting modal data:', modalData);
      setSelectedCrossword(modalData);
      setShowEditModal(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
    setTimeout(() => {
      setSelectedCrossword(null);
    }, 300);
  }, []);

  const handleUpdateCrossword = useCallback(async (updatedData) => {
    try {
      if (!selectedCrossword?._id) return;

      console.log('Received data from modal:', updatedData);

      // Format lại data cho đúng với yêu cầu của API
      const formattedData = {
        title: updatedData.title,
        status: updatedData.status === 'public' ? 'Công khai' : 'Không công khai',
        subject: updatedData.subject,
        grade: updatedData.grade
      };

      console.log('Formatted data for API:', formattedData);
      
      const response = await crosswordService.updateCrossword(selectedCrossword._id, formattedData);
      
      if (response.success) {
        toast.success('Cập nhật thông tin thành công');
        loadCrosswords();
        handleCloseModal();
      } else {
        toast.error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating crossword:', error);
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
            
            <InfoGroup>
              <Label>Họ và tên</Label>
              <Input
                name="fullName"
                value={userInfo.fullName || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập họ và tên"
              />
            </InfoGroup>

            <InfoGroup>
              <Label>Ngày sinh</Label>
              <Input
                type="date"
                name="birthDate"
                value={userInfo.birthDate || ''}
                onChange={handleChange}
                disabled={!isEditing}
                max={new Date().toISOString().split('T')[0]}
              />
            </InfoGroup>

            <InfoGroup>
              <Label>Nghề nghiệp</Label>
              <Select
                name="occupation"
                value={userInfo.occupation || ''}
                onChange={handleChange}
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
                onChange={handleChange}
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
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? 'Đang lưu...' : 'Lưu lại'}
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
                  onClick={handleEditClick}
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

export default memo(AccountPage);
