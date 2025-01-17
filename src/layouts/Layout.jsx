import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';  
import logo from '../assets/imgs/logo.png';
import backgroundImg from '../assets/imgs/bg4.jpg';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const Layout = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      console.log('Token before logout:', localStorage.getItem('token'));
      console.log('Refresh token before logout:', localStorage.getItem('refreshToken'));

      await authService.logout();

      authLogout();

      setShowModal(false);
      navigate('/', { replace: true });

      toast.success('Đăng xuất thành công');
    } catch (error) {

      authLogout();

      setShowModal(false);

      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Bạn đã được đăng xuất.');
      } else {
        toast.error('Không thể đăng xuất. Vui lòng thử lại sau.');
      }
    }
  };

  const handleLogoutCancel = () => {
    setShowModal(false);
  };

  return (
    <LayoutContainer>
      {/* Header */}
      <Header>
        <LogoContainer>
          <LogoImage src={logo} alt="Logo" />
          <LogoText>TRÒ CHƠI Ô CHỮ</LogoText>
        </LogoContainer>
        <Navigation>
          <NavButton 
            to="/homepage"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            TRANG CHỦ
          </NavButton>
          
          <NavButton 
            to="/library"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            THƯ VIỆN
          </NavButton>
          
          <NavButton 
            to="/guide"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            HƯỚNG DẪN
          </NavButton>
          
          <NavButton 
            to="/leaderboard"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            BXH
          </NavButton>
          
          <NavButton 
            to="/account"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            TÀI KHOẢN
          </NavButton>
          
          <LogoutLink onClick={handleLogoutClick}>ĐĂNG XUẤT</LogoutLink>
        </Navigation>
      </Header>

      {/* Nội dung chính */}
      <MainContent>
        <Outlet />
      </MainContent>

      {/* Footer */}
      <Footer>
        <p>Thông tin liên hệ:</p>
        <p>Email: ngduyan201@gmail.com </p>
        <p>
          Music Video by:{' '}
          <a 
            href="https://hypeddit.com/roamusic/walkaroundlofi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roa - Walk Around【LoFi ver.】
          </a>
          {' '}| License:{' '}
          <a 
            href="https://roa-music.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            roa-music.com
          </a>
        </p>
        <p>
          Sound Effect by{' '}
          <a 
            href="https://pixabay.com/vi/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=82807"
            target="_blank"
            rel="noopener noreferrer"
          >
            freesound_community
          </a>
          {' '}from{' '}
          <a 
            href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=82807"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pixabay
          </a>
        </p>
      </Footer>

      {/* Modal Đăng xuất */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalText>Bạn có chắc chắn muốn đăng xuất không?</ModalText>
            <ModalButtons>
              <CancelButton onClick={handleLogoutCancel}>Hủy</CancelButton>
              <ConfirmButton onClick={handleLogoutConfirm}>Đăng xuất</ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </LayoutContainer>
  );
};

export default Layout;

// Styled-components

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: url(${backgroundImg}) no-repeat center center fixed;
  background-size: cover;
  font-family: Arial, sans-serif;
  padding: 0;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
`;

const LogoText = styled.h1`
  font-family: 'Bungee Shade', cursive;
  font-size: 1.5rem;
  color: #444;
  margin-left: 15px;
  transition: color 0.3s ease;
  letter-spacing: 0.05em;

  &:hover {
    color: #339900;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-left: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 2.625rem;
    margin-left: 25px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  
  @media (min-width: 768px) {
    gap: 15px;
  }

  @media (min-width: 1024px) {
    flex-wrap: nowrap;
    margin-top: 0;
    gap: 20px;
  }
`;

const NavButton = styled(NavLink)`
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  background-color: #444;
  color: white;
  font-weight: bold;
  white-space: nowrap;
  display: inline-block;
  max-width: fit-content;
  width: auto;

  &:hover {
    background-color: #339900;
  }

  &.active {
    background-color: yellow;
    color: black;
    cursor: default;
    
    &:hover {
      background-color: yellow;
    }
  }

  @media (max-width: 1023px) {
    padding: 8px 15px;
    font-size: 0.9rem;
    max-width: min-content;
  }

  @media (max-width: 767px) {
    padding: 6px 10px;
    font-size: 0.8rem;
    max-width: min-content;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  
  @media (min-width: 768px) {
    padding: 30px;
  }
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 20px;
`;

const LogoutLink = styled.span`
  color: black;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  display: inline-block;
  max-width: fit-content;
  width: auto;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 1023px) {
    padding: 8px 15px;
    font-size: 0.9rem;
    max-width: min-content;
  }

  @media (max-width: 767px) {
    padding: 6px 10px;
    font-size: 0.8rem;
    max-width: min-content;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
`;

const ModalText = styled.p`
  margin-bottom: 20px;
  font-size: 1.1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-direction: row;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
`;

const ConfirmButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  &:hover {
    background-color: #5a6268;
  }
`;
