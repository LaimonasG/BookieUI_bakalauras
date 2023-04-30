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
        <div className="d-flex align-items-start justify-content-between">
          <div className="w-75">
            <p className="mb-2"><strong>Autorius:</strong> {book.author}</p>
            <p className="mb-2"><strong>Aprašymas:</strong> {book.description}</p>
            <p className="mb-2"><strong>Kaina:</strong> {book.bookPrice} {getPointsWord(book.bookPrice)} </p>
          </div>
          <div className="w-25 d-flex flex-column justify-content-between align-items-center">
            <div className="mb-4">
              <img
                src={book.coverImageUrl}
                alt={`Cover of ${book.name}`}
                className="book-cover"
              />
            </div>
            <div className="action-buttons">
              <Button variant="primary" onClick={() => handleBuyBook(book)}>Pirkti</Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookView;