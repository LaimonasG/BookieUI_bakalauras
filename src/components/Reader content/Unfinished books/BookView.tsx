import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IBookToBuy, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from "../../../Interfaces";
import "./BookView.css";
import { subscribeToBook } from '../../../requests/BookController';
import { AxiosError } from 'axios';
import CommentList from '../../comments/CommentsList';

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
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const handleAxiosError = useHandleAxiosError();

  const handleSubscribeToBook = async (book: IBookToBuy) => {
    try {
      const response = await subscribeToBook(book.id, book.genreName);
      if (response === 'success') {
        handleConfirmed(`Knygos "${book.name}" prenumerata sėkmingai aktyvuota.`);
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
        <Modal.Title>{book.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row text-info-row">
          <div className="col">
            <strong>Autorius:</strong> {book.author}
          </div>
        </div>
        <div className="row text-info-row">
          <div className="col">
            <strong>Aprašymas:</strong> {book.description}
          </div>
        </div>
        <div className="row text-info-row">
          <div className="col">
            <strong>Pradinė įmoka už skyrius:</strong> {book.chapterPrice * book.chapterCount} {getPointsWord(book.chapterPrice * book.chapterCount)}
          </div>
        </div>
        <div className="row text-info-row">
          <div className="col">
            <strong>Skyriaus kaina:</strong> {book.chapterPrice} {getPointsWord(book.chapterPrice)}
          </div>
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
      <Modal.Footer>
        <Button variant="custom-subscribe"
          className={`btn-custom ${isBlocked ? "btn-custom-buy-disabled" : ""}`}
          onClick={() => handleSubscribeToBook(book)}
          disabled={isBlocked}
        >Prenumeruoti</Button>
        <Button variant="custom-comments" className="btn-custom" onClick={handleOpenComments}>Komentarai</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookView;