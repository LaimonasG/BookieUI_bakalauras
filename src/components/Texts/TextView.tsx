import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { ITextsBought } from "../../Interfaces";
import TextReadView from './TextReadView';
import "./TextView.css";

type TextInformationModalProps = {
  text: ITextsBought;
  isOpen: boolean;
  onClose: () => void;
};

function getPointsWord(points: number) {
  if (points % 10 === 1 && points % 100 !== 11) {
    return "taškas";
  } else if (points % 10 >= 2 && points % 10 <= 9 && (points % 100 < 10 || points % 100 >= 20)) {
    return "taškai";
  } else {
    return "taškų";
  }
}


const TextView: React.FC<TextInformationModalProps> = ({
  text,
  isOpen,
  onClose,
}) => {
  const [selectedText, setSelectedText] = useState<ITextsBought | null>(null);
  const [showTextModal, setShowTextModal] = useState(false);

  async function handleReadTextClick(text: ITextsBought) {
    setSelectedText(text);
    setShowTextModal(true);
  }

  const handleHideModal = () => {
    setShowTextModal(false);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{text.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-start justify-content-between">
          <div className="w-75">
            <p className="mb-2"><strong>Autorius:</strong> {text.author}</p>
            <p className="mb-2"><strong>Aprašymas:</strong> {text.description}</p>
            <p className="mb-2"><strong>Kaina:</strong> {text.price} {getPointsWord(text.price)} </p>
          </div>
          <div className="w-25 d-flex flex-column justify-content-between align-items-center">
            <div className="mb-4">
              <img
                src={text.coverImageUrl}
                alt={`Cover of ${text.name}`}
                className="text-cover"
              />
            </div>
            <div className="action-buttons">
              <Button variant="secondary" onClick={() => handleReadTextClick(text)}>Skaityti</Button>
              <Button variant="primary">Pirkti</Button>
            </div>
          </div>
        </div>
        {showTextModal && selectedText && (
          <TextReadView
            text={selectedText}
            show={showTextModal}
            onHide={handleHideModal}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TextView;