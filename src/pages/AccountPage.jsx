import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { userService } from '../services/userService';
import ChangePasswordModal from '../components/modals/ChangePWModal';

const AccountPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPWModal, setShowPWModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return dateString.split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setUserInfo({
          ...response.user,
          birthDate: formatDate(response.user.birthDate)
        });
      }
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
    }
  };

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
      setIsLoading(true);

      if (userInfo.phone && !/^\d{10}$/.test(userInfo.phone)) {
        toast.error('Số điện thoại không hợp lệ');
        return;
      }

      const dataToUpdate = {
        fullName: userInfo.fullName.trim(),
        birthDate: userInfo.birthDate,
        occupation: userInfo.occupation,
        phone: userInfo.phone.trim()
      };

      const response = await userService.updateProfile(dataToUpdate);

      if (response.success && response.user) {
        const updatedUser = {
          ...response.user,
          birthDate: formatDate(response.user.birthDate)
        };
        setUserInfo(updatedUser);
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công');
      } else {
        throw new Error(response.message || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Lỗi khi cập nhật thông tin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    fetchUserProfile();
    setIsEditing(false);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <CrosswordList>
          <SectionTitle>Danh sách ô chữ của tôi</SectionTitle>
          {/* Component danh sách ô chữ */}
        </CrosswordList>

        <AccountInfo>
          <SectionTitle>Thông tin tài khoản</SectionTitle>
          
          <InfoGroup>
            <Label>Họ và tên</Label>
            <Input
              name="fullName"
              value={userInfo.fullName}
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
              value={userInfo.birthDate}
              onChange={handleChange}
              disabled={!isEditing}
              max={new Date().toISOString().split('T')[0]}
            />
          </InfoGroup>

          <InfoGroup>
            <Label>Nghề nghiệp</Label>
            <Select
              name="occupation"
              value={userInfo.occupation}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="Giáo viên">Giáo viên</option>
              <option value="Học sinh">Học sinh</option>
              <option value="Sinh viên">Sinh viên</option>
              <option value="Khác">Khác</option>
            </Select>
          </InfoGroup>

          <InfoGroup>
            <Label>Số điện thoại</Label>
            <Input
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Nhập số điện thoại"
            />
          </InfoGroup>

          <InfoGroup>
            <Label>Ngày tạo tài khoản</Label>
            <Input value={userInfo.createdAt} disabled />
          </InfoGroup>

          <InfoGroup>
            <Label>Cập nhật lần cuối</Label>
            <Input value={userInfo.updatedAt} disabled />
          </InfoGroup>

          <ButtonGroup>
            {isEditing ? (
              <>
                <SaveButton 
                  onClick={handleSaveClick}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu lại'}
                </SaveButton>
                <CancelButton 
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Hủy
                </CancelButton>
              </>
            ) : (
              <EditButton 
                onClick={handleEditClick}
                disabled={isLoading}
              >
                Chỉnh sửa
              </EditButton>
            )}
            <ChangePasswordButton 
              onClick={() => setShowPWModal(true)}
              disabled={isLoading}
            >
              Đổi mật khẩu
            </ChangePasswordButton>
          </ButtonGroup>
        </AccountInfo>
      </ContentWrapper>

      <ChangePasswordModal 
        show={showPWModal} 
        onClose={() => setShowPWModal(false)} 
      />
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
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
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
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
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

export default AccountPage;
