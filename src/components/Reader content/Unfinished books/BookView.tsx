import React, { useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IBookToBuy, getPointsWord, handleConfirmed, handleDenied } from "../../../Interfaces";
import "./BookView.css";
import { subscribeToBook } from '../../../requests/BookController';

type BookInformationModalProps = {
  book: IBookToBuy;
  isOpen: boolean;
  onClose: () => void;
};

const BookView: React.FC<BookInformationModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const handleSubscribeToBook = async (book: IBookToBuy) => {
    const response = await subscribeToBook(book.id, book.genreName);
    if (response === 'success') {
      handleConfirmed(`Knygos "${book.name}" prenumerata sėkmingai aktyvuota.`);
      onClose();
    } else {
      handleDenied(response);
      onClose();
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
          <p className="mb-2"><strong>Pradinė įmoka už skyrius:</strong> {book.chapterPrice * book.chapterCount} {getPointsWord(book.chapterPrice * book.chapterCount)} </p>
          <p className="mb-2"><strong>Skyriaus kaina:</strong> {book.chapterPrice} {getPointsWord(book.chapterPrice)} </p>
        </div>
        <div className="buttons-container">
          <Button variant="custom-subscribe" className="btn-custom" onClick={() => handleSubscribeToBook(book)}>Prenumeruoti</Button>
          <Button variant="custom-comments" className="btn-custom">Komentarai</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookView;