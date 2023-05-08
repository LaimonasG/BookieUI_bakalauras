import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IBookToBuy, IComment, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from "../../../Interfaces";
import "./BookView.css";
import { purchaseBook } from '../../../requests/BookController';
import { AxiosError } from 'axios';
import CommentList from '../../comments/CommentsList';
import { getBookComments } from '../../../requests/CommentsController';

type BookInformationModalProps = {
  book: IBookToBuy;
  isOpen: boolean;
  onClose: () => void;
  isBlocked: boolean;
};

const BookView: React.FC<BookInformationModalProps> = ({
  book,
  isOpen,
  onClose,
  isBlocked
}) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const handleAxiosError = useHandleAxiosError();

  const handleBuyBook = async (book: IBookToBuy) => {
    try {
      const response = await purchaseBook(book.id, book.genreName);
      if (response === 'success') {
        handleConfirmed(`Knygą "${book.name}" galite rasti savo profilyje.`);
        onClose();
      } else {
        handleDenied(response);
        onClose();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  };

  const handleOnCommentsClose = () => {
    setIsCommentsOpen(false);
  }

  const handleOpenComments = async (book: IBookToBuy) => {
    try {
      const response = await getBookComments(book.id, book.genreName);
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
        <Modal.Title>{book.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="book-info">
          <p className="mb-2"><strong>Autorius:</strong> {book.author}</p>
          <p className="mb-2"><strong>Aprašymas:</strong> {book.description}</p>
          <p className="mb-2"><strong>Kaina:</strong> {book.bookPrice} {getPointsWord(book.bookPrice)} </p>
        </div>
        <div className="buttons-container">
          <Button
            variant="custom-buy"
            className={`btn-custom ${isBlocked ? "btn-custom-buy-disabled" : ""}`}
            onClick={() => handleBuyBook(book)}
            disabled={isBlocked}
          >
            Pirkti
          </Button>
          <Button variant="custom-comments" className="btn-custom" onClick={() => handleOpenComments(book)}>Komentarai</Button>
        </div>
        <CommentList
          isOpen={isCommentsOpen}
          onClose={handleOnCommentsClose}
          isProfile={false}
          entityId={book.id}
          commentType='Book'
          genreName={book.genreName}
          bookId={0}
        />
      </Modal.Body>
    </Modal>
  );
};

export default BookView;