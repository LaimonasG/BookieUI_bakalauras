import React from 'react';
import { Modal } from 'react-bootstrap';
import { IBookBought, getPointsWord } from '../../Interfaces';
import "./BookInfoModal.css";

type BookInfoModalProps = {
  book: IBookBought;
  isOpen: boolean;
  onClose: () => void;
};

const BookInfoModal: React.FC<BookInfoModalProps> = ({ book, isOpen, onClose }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static" dialogClassName="custom-modal-size">
      <Modal.Header closeButton>
        <Modal.Title>{book.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="book-info d-flex">
          <img src={book.coverImageUrl} alt={book.name} className="admin-book-cover" />
          <div className="book-details ml-3">
            <p className="mb-2"><strong>Autorius:</strong> {book.author}</p>
            <p className="mb-2"><strong>Žanras:</strong> {book.genreName}</p>
            <p className="mb-2"><strong>Aprašymas:</strong> {book.description}</p>
            <p className="mb-2"><strong>Skyriaus kaina:</strong> {book.chapterPrice} {getPointsWord(book.chapterPrice)}</p>
            <p className="mb-2"><strong>Knygos kaina:</strong> {book.price} {getPointsWord(book.price)}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookInfoModal;