import React from 'react';
import styled, { css } from 'styled-components';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';

const ModalInner = styled('div')`
  overflow-y: auto;
  border-radius: 5px;
  background-color: white;
  padding: 22px;
  position: relative;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100vw;
      height: 100vh;
    `}
`;

const CloseButton = styled('button')`
  position: absolute;
  top: 22px;
  right: 22px;
  background: transparent;
  border: none;
`;

interface IModalProps {
  title?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  header?: string;
}

const OurModal: React.FC<IModalProps> = ({ open, setOpen, header, children }) => (
  <Modal open={open} onClose={() => setOpen(false)}>
    <ModalInner>
      {header && <h2>{header}</h2>}
      <CloseButton onClick={() => setOpen(false)}>
        <CloseIcon />
      </CloseButton>
      {children}
    </ModalInner>
  </Modal>
);

export default OurModal;
