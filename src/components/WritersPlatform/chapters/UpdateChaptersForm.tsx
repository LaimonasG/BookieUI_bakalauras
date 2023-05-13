import React, { useState } from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { IBookBought, IChapters } from '../../../Interfaces';
import "./UpdateChaptersForm.css";
import ChapterList from '../../chapters/ChapterList';

interface IBookFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (selectedChapters: IChapters[], book: IBookBought) => void;
  book: IBookBought;
  isBlocked: boolean;
}

const UpdateChaptersFormModal: React.FC<IBookFormModalProps> = ({ show, onHide, onSubmit, book, isBlocked }) => {
  const [showChapterList, setShowChapterList] = useState<boolean>(false);
  const [currentChapter, setCurrentChapter] = useState<IChapters>();
  const [selectedChapters, setSelectedChapters] = useState<IChapters[]>([]);

  const handleSubmit = () => {
    onSubmit(selectedChapters, book);
    onHide();
  };

  const handleHideModal = () => {
    setShowChapterList(false);
  };

  const handleViewContent = (chapter: IChapters) => {
    setCurrentChapter(chapter);
    setShowChapterList(true);
  };

  return (
    <div>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="custom-modal-title">Knygos skyriai</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <ListGroup className="custom-list-group">
            {book.chapters &&
              <div>
                {book.chapters.map((chapter) => (
                  <ListGroup.Item key={chapter.id} className="custom-list-group-item">
                    <div className="chapter-name">{chapter.name}</div>
                    <Button onClick={() => handleViewContent(chapter)} className="view-button">Peržiūrėti</Button>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedChapters.includes(chapter)}
                        onChange={() => {
                          if (selectedChapters.includes(chapter)) {
                            setSelectedChapters(selectedChapters.filter(c => c !== chapter));
                          } else {
                            setSelectedChapters([...selectedChapters, chapter]);
                          }
                        }}
                        className="chapter-checkbox"
                      />
                    </td>
                  </ListGroup.Item>
                ))}
              </div>
            }

          </ListGroup>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="primary" onClick={handleSubmit} className="submit-button">
            Pateikti
          </Button>
        </Modal.Footer>
      </Modal>

      {showChapterList && (
        <ChapterList
          book={book}
          show={showChapterList}
          onHide={handleHideModal}
          isBlocked={isBlocked}
          chapter={currentChapter}
        />
      )}
    </div>
  );
};

export default UpdateChaptersFormModal;