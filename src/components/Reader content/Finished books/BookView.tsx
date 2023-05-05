import React, { useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IBookToBuy, getPointsWord, handleConfirmed, handleDenied } from "../../../Interfaces";
import "./BookView.css";
import { purchaseBook } from '../../../requests/BookController';

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
  const handleBuyBook = async (book: IBookToBuy) => {
    const response = await purchaseBook(book.id, book.genreName);
    if (response === 'success') {
      handleConfirmed(`Knygą "${book.name}" galite rasti savo profilyje.`);
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
          <p className="mb-2"><strong>Kaina:</strong> {book.bookPrice} {getPointsWord(book.bookPrice)} </p>
        </div>
        <div className="buttons-container">
          <Button variant="custom-buy" className="btn-custom" onClick={() => handleBuyBook(book)}>Pirkti</Button>
          <Button variant="custom-comments" className="btn-custom">Komentarai</Button>
        </div>

      </Modal.Body>
    </Modal>
  );
};

export default BookView;