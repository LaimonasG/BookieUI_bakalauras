import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ITextsBought, getPointsWord } from '../../Interfaces';
import TextReadView from '../texts/TextReadView';
import "./TextInfoModal.css";

type TextInfoModalProps = {
  text: ITextsBought;
  isOpen: boolean;
  onClose: () => void;
};

const TextInfoModal: React.FC<TextInfoModalProps> = ({ text, isOpen, onClose }) => {
  const [showTextRead, setShowTextRead] = useState(false);

  const handleHide = () => {
    setShowTextRead(false);
  }

  const handleOpenReadModal = () => {
    setShowTextRead(true);
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static" dialogClassName="custom-modal-size">
      <Modal.Header closeButton>
        <Modal.Title>{text.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-info d-flex">
          <img src={text.coverImageUrl} alt={text.name} className="admin-text-cover" />
          <div className="text-details ml-3">
            <p className="mb-2"><strong>Autorius:</strong> {text.author}</p>
            <p className="mb-2"><strong>Žanras:</strong> {text.genreName}</p>
            <p className="mb-2"><strong>Aprašymas:</strong> {text.description}</p>
            <p className="mb-2"><strong>Teksto kaina:</strong> {text.price} {getPointsWord(text.price)}</p>
            <button onClick={handleOpenReadModal}>Skaityti</button>
          </div>
        </div>
      </Modal.Body>
      {showTextRead && (
        <TextReadView
          text={text}
          show={showTextRead}
          onHide={handleHide}
        />
      )}
    </Modal>

  );
};

export default TextInfoModal;