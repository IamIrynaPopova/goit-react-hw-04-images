import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

export const Modal = ({ closeModal, largeImageURL, closeESCModal }) => {
  const handleKeyDown = useCallback(
    ({ code }) => {
      if (code === 'Escape') {
        closeESCModal();
      }
    },
    [closeESCModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={css.overlay} onClick={closeModal}>
      <div className={css.modal}>
        <img className={css.image} src={largeImageURL} alt="" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  closeESCModal:PropTypes.func.isRequired,
};
