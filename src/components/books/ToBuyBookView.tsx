import { Modal, Button } from "react-bootstrap";
import { IBookToBuy } from "../../Interfaces";

type BookInformationModalProps = {
  book: IBookToBuy;
  isOpen: boolean;
  onClose: () => void;
};

const BookInformationModal: React.FC<BookInformationModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{book.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-start justify-content-between">
          <div className="w-75">
            <h4 className="mb-4">{book.name}</h4>
            <p className="mb-2"><strong>Autorius:</strong> {book.author}</p>
            <p className="mb-2"><strong>Aprašymas:</strong> {book.description}</p>
            <p className="mb-2"><strong>Kaina:</strong> {book.price} €</p>
          </div>
          <div className="w-25 d-flex flex-column justify-content-between align-items-center">
            <img src={book.coverImage} alt={`Cover of ${book.name}`} className="book-cover mb-4" />
            <div className="action-buttons">
              <Button variant="secondary">Skaityti</Button>
              <Button variant={book.isFinished ? "primary" : "success"}>
                {book.isFinished ? "Pirkti" : "Prenumeruoti"}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookInformationModal;