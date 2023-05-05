import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IComment, ITextsToBuy, getPointsWord, handleConfirmed, handleDenied } from "../../../Interfaces";
import "./TextView.css";
import { purchaseText } from '../../../requests/TextsController';
import CommentList from '../../comments/CommentsList';
import { getTextComments } from '../../../requests/CommentsController';

type TextInformationModalProps = {
  text: ITextsToBuy;
  isOpen: boolean;
  onClose: () => void;
};

const TextView: React.FC<TextInformationModalProps> = ({
  text,
  isOpen,
  onClose,
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);

  const handleBuyText = async (text: ITextsToBuy) => {
    const response = await purchaseText(text.id, text.genreName);
    if (response === 'success') {
      handleConfirmed(`Tekstą "${text.name}" galite rasti savo profilyje.`);
      onClose();
    } else {
      handleDenied(response);
      onClose();
    }
  }

  const handleOnCommentsClose = () => {
    setIsCommentsOpen(false);
  }

  const handleOpenComments = async (text: ITextsToBuy) => {
    console.log("ID:", text.id);
    console.log("User:", localStorage.getItem("user"));
    const response = await getTextComments(text.id, text.genreName);
    if (response) {
      setComments(response);
    } else {
      setComments([]);
    }
    setIsCommentsOpen(true);
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
          <Button variant="custom-buy" className="btn-custom" onClick={() => handleBuyText(text)}>Pirkti</Button>
          <Button variant="custom-comments" className="btn-custom" onClick={() => handleOpenComments(text)}>Komentarai</Button>
        </div>
        <CommentList
          isOpen={isCommentsOpen}
          onClose={handleOnCommentsClose}
          isProfile={false}
          entityId={text.id}
          commentType='Text'
          genreName={text.genreName}
        />
      </Modal.Body>
    </Modal>
  );
};

export default TextView;