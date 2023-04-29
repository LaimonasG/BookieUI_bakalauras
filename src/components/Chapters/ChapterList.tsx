import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { IChapters, IBookBought } from '../../Interfaces';
import './ChapterList.css';

type BookInformationModalProps = {
  book: IBookBought;
  show: boolean;
  onHide: () => void;
};

const ChaptersModal: React.FC<BookInformationModalProps> = ({ book, show, onHide }) => {

  if (book.chapters?.length == 0) {
    return (<p>Knyga dar neturi skyrių.</p>)
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ maxWidth: '100%' }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {book.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {book.chapters?.map((chapter: IChapters, index: number) => (
          <div key={index}>
            <h5 className="chapter-title">{chapter.name}</h5>
            <pre className="chapter-content">{chapter.content}</pre>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChaptersModal;