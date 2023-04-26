import React, { useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IBookToBuy } from "../../../Interfaces";
import "./BookView.css";

type BookInformationModalProps = {
  book: IBookToBuy;
  isOpen: boolean;
  onClose: () => void;
};

function getPointsWord(points: number) {
  if (points % 10 === 1 && points % 100 !== 11) {
    return "taškas";
  } else if (points % 10 >= 2 && points % 10 <= 9 && (points % 100 < 10 || points % 100 >= 20)) {
    return "taškai";
  } else {
    return "taškų";
  }
}

const BookView: React.FC<BookInformationModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    console.log(book.coverImageUrl);
  }, [book]);

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
            <p className="mb-2"><strong>Kaina:</strong> {book.price} {getPointsWord(book.price)} </p>
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
              <Button variant="secondary">Skaityti</Button>
              {book.isFinished === 1 ? <Button variant="primary">Pirkti</Button> : <Button variant="primary">Prenumeruoti</Button>}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookView;