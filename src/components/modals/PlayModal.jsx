import React from 'react';
import styled from 'styled-components';

export const ResetModal = ({ show, onConfirm, onClose }) => {
  if (!show) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>
          Hệ thống sẽ làm mới tất cả tiến trình và chơi lại, bạn chắc chắn?
        </ModalText>
        <ModalButtons>
          <CancelButton onClick={onClose}>Quay lại</CancelButton>
          <ConfirmButton onClick={onConfirm}>Đồng ý</ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export const HomeModal = ({ show, onConfirm, onClose }) => {
  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>
          Bạn chắc chắn muốn quay lại? Mọi tiến trình hiện tại sẽ không được lưu.
        </ModalText>
        <ModalButtons>
          <CancelButton onClick={onClose}>Quay lại</CancelButton>
          <ConfirmButton onClick={onConfirm}>Đồng ý</ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export const SaveModal = ({ show, onConfirm, onClose }) => {
  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>
          Bạn có chắc chắn muốn lưu ô chữ này?
        </ModalText>
        <ModalButtons>
          <CancelButton onClick={onClose}>Quay lại</CancelButton>
          <ConfirmButton onClick={onConfirm}>Đồng ý</ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled components
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
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`;

const ModalText = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-direction: row;
`;

const ButtonBase = styled.button`
  padding: 10px 25px;
  border-radius: 8px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
`;

const CancelButton = styled(ButtonBase)`
  background-color: #e0e0e0;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const ConfirmButton = styled(ButtonBase)`
  background-color: #333;
  color: white;

  &:hover {
    background-color: #444;
  }
`;