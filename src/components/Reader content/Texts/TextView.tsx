import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { ITextsToBuy, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from "../../../Interfaces";
import "./TextView.css";
import { purchaseText } from '../../../requests/TextsController';
import CommentList from '../../comments/CommentsList';
import { AxiosError } from 'axios';

type TextInformationModalProps = {
  text: ITextsToBuy;
  isOpen: boolean;
  onClose: () => void;
  isBlocked: boolean;

};

const TextView: React.FC<TextInformationModalProps> = ({
  text,
  isOpen,
  onClose,
  isBlocked
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const handleAxiosError = useHandleAxiosError();

  const handleBuyText = async (text: ITextsToBuy) => {
    try {
      const response = await purchaseText(text.id, text.genreName);
      if (response === 'success') {
        handleConfirmed(`Tekstą "${text.name}" galite rasti savo profilyje.`);
        onClose();
      } else {
        handleDenied(response);
        onClose();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      onClose();
    }
  }

  const handleOnCommentsClose = () => {
    setIsCommentsOpen(false);
  }

  const handleOpenComments = async () => {
    setIsCommentsOpen(true);
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{text.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row text-info-row">
          <div className="col">
            <strong>Autorius:</strong> {text.author}
          </div>
        </div>
        <div className="row text-info-row">
          <div className="col">
            <strong>Aprašymas:</strong> {text.description}
          </div>
        </div>
        <div className="row text-info-row">
          <div className="col">
            <strong>Kaina:</strong> {text.price} {getPointsWord(text.price)}
          </div>
        </div>
        <CommentList
          isOpen={isCommentsOpen}
          onClose={handleOnCommentsClose}
          isProfile={false}
          entityId={text.id}
          commentType="Text"
          genreName={text.genreName}
          bookId={0}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="custom-comments"
          className="btn-custom"
          onClick={handleOpenComments}
        >
          Komentarai
        </Button>
        <Button
          variant="custom-buy"
          className={`btn-custom ${isBlocked ? "btn-custom-buy-disabled" : ""}`}
          onClick={() => handleBuyText(text)}
          disabled={isBlocked}
        >
          Pirkti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TextView;