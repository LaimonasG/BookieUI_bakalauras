import React, { useCallback, useRef, useState } from 'react';
import { Modal, Button, Overlay } from "react-bootstrap";
import { IBookToBuy, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from "../../../Interfaces";
import "./FinishedBooksView.css";
import { purchaseBook } from '../../../requests/BookController';
import { AxiosError } from 'axios';
import CommentList from '../../comments/CommentsList';
import { setBookStatus } from '../../../requests/AdminController';
import BlockBookPopover from '../BookBlockPopover';

type BookInformationModalProps = {
  book: IBookToBuy;
  isOpen: boolean;
  onClose: () => void;
  isBlocked: boolean;
  userRole: string;
};

const BookView: React.FC<BookInformationModalProps> = ({
  book,
  isOpen,
  onClose,
  isBlocked,
  userRole
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [blockReason, setBlockReason] = useState<string>('');
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const target = useRef<HTMLButtonElement | null>(null);

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

  const handleOpenComments = async () => {
    setIsCommentsOpen(true);
  }

  const handleChangeBookStatus = async (book: IBookToBuy) => {
    try {
      const response = await setBookStatus(2, blockReason, book.id);
      if (response === 'success') {
        handleConfirmed(`Knygos "${book.name}" statusas pakeistas į "Atmesta"`);
        setShowPopover(false);
        onClose();
      } else {
        handleDenied(response);
      }
      setBlockReason('');
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  }

  const handleBlockReasonChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockReason(event.target.value);
  }, []);


  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{book.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row book-info-row">
          <div className="col">
            <strong>Autorius:</strong> {book.author}
          </div>
        </div>
        <div className="row book-info-row">
          <div className="col">
            <strong>Aprašymas:</strong> {book.description}
          </div>
        </div>
        <div className="row book-info-row">
          <div className="col">
            <strong>Kaina:</strong> {book.bookPrice} {getPointsWord(book.bookPrice)}
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
        {userRole === 'Admin' &&
          <Button
            ref={target}
            variant="custom-block"
            className="btn-custom"
            onClick={showPopover ? () => handleChangeBookStatus(book) : () => setShowPopover(true)}
          >
            {showPopover ? 'Submit' : 'Block Book'}
          </Button>
        }
        <Overlay
          show={showPopover}
          target={target.current}
          placement="bottom"
          container={null}
          containerPadding={20}
          rootClose
          onHide={() => setShowPopover(false)}
          rootCloseEvent='mousedown'
        >
          {(props) => (
            <div {...props} style={{ ...props.style, zIndex: 9999 }}>
              <BlockBookPopover blockReason={blockReason} onChange={handleBlockReasonChange} />
            </div>
          )}
        </Overlay>

        <Button
          variant="custom-buy"
          className={`btn-custom ${isBlocked ? "btn-custom-buy-disabled" : ""}`}
          onClick={() => handleBuyBook(book)}
          disabled={isBlocked}
        >
          Pirkti
        </Button>
        <Button variant="custom-comments" className="btn-custom" onClick={handleOpenComments}>Komentarai</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookView;