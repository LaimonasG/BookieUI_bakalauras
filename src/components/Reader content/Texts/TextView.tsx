import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IComment, ITextsToBuy, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from "../../../Interfaces";
import "./TextView.css";
import { purchaseText } from '../../../requests/TextsController';
import CommentList from '../../comments/CommentsList';
import { getTextComments } from '../../../requests/CommentsController';
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
  const [comments, setComments] = useState<IComment[]>([]);
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

  const handleOpenComments = async (text: ITextsToBuy) => {
    console.log("ID:", text.id);
    console.log("User:", localStorage.getItem("user"));
    try {
      const response = await getTextComments(text.id, text.genreName);
      if (response) {
        setComments(response);
      } else {
        setComments([]);
      }
      setIsCommentsOpen(true);
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{text.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="book-info">
          <p className="mb-2"><strong>Autorius:</strong> {text.author}</p>
          <p className="mb-2"><strong>Aprašymas:</strong> {text.description}</p>
          <p className="mb-2"><strong>Kaina:</strong> {text.price} {getPointsWord(text.price)} </p>
        </div>
        <div className="buttons-container">
          <Button variant="custom-buy"
            className={`btn-custom ${isBlocked ? "btn-custom-buy-disabled" : ""}`}
            onClick={() => handleBuyText(text)}
            disabled={isBlocked}
          >Pirkti</Button>
          <Button variant="custom-comments" className="btn-custom" onClick={() => handleOpenComments(text)}>Komentarai</Button>
        </div>
        <CommentList
          isOpen={isCommentsOpen}
          onClose={handleOnCommentsClose}
          isProfile={false}
          entityId={text.id}
          commentType='Text'
          genreName={text.genreName}
          bookId={0}
        />
      </Modal.Body>
    </Modal>
  );
};

export default TextView;