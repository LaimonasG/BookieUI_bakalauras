import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ITextsBought } from '../../Interfaces';
import './TextReadView.css';

type TextInformationModalProps = {
  text: ITextsBought;
  show: boolean;
  onHide: () => void;
};

const TextReadView: React.FC<TextInformationModalProps> = ({ text, show, onHide }) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (text.content.length === 0) {
    return <p>Tekstas tuščias.</p>;
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="text-read-view"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton onClick={handleContentClick}>
        <Modal.Title id="contained-modal-title-vcenter">{text.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body onClick={handleContentClick}>
        <div className="text-cover-container">
          <div className="mb-4">
            <img
              src={text.coverImageUrl}
              alt={`Tekstos "${text.name}" viršelis.`}
              className="text-cover"
            />
          </div>
        </div>
        <p dangerouslySetInnerHTML={{ __html: text.content }} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} className="text-read-view-close-btn">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TextReadView;