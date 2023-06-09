import React, { useState } from 'react';
import { Modal, Button, Pagination } from 'react-bootstrap';
import { IChapters, IBookBought } from '../../Interfaces';
import './ChapterList.css';
import CommentList from '../comments/CommentsList';

type BookInformationModalProps = {
  book: IBookBought;
  show: boolean;
  onHide: () => void;
  isBlocked: boolean;
  chapter?: IChapters;
};

const ChaptersModal: React.FC<BookInformationModalProps> = ({ book, show, onHide, isBlocked, chapter }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<IChapters | null>(null);

  //pagination
  const [pageChapter, setChapterPage] = useState(0);
  const perPage = 1;
  let numChapterPages;
  let chaptersToDisplay: IChapters[] = [];
  if (book.chapters != null) {
    if (chapter != null) {
      chaptersToDisplay = [chapter];
      numChapterPages = 0;
    } else {
      numChapterPages = Math.ceil(book.chapters.length / perPage);
      chaptersToDisplay = book.chapters.slice(pageChapter * perPage, (pageChapter + 1) * perPage);
    }
  } else {
    numChapterPages = 0;
  }

  const handleHideModal = () => {
    setIsCommentsOpen(false);
  }

  const handleOpenComments = (chapter: IChapters) => {
    setSelectedChapter(chapter);
    setIsCommentsOpen(true);
  }

  if (book.chapters?.length == 0) {
    return (<p>Knyga dar neturi skyrių.</p>)
  } else if (chapter) {
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
          <div className="book-cover-container">
            <div className="mb-4">
              <img
                src={book.coverImageUrl}
                alt={`Knygos "${book.name}" viršelis.`}
                className="book-cover"
              />
            </div>
          </div>
          <div>
            <h5 className="chapter-title">{chapter.name}</h5>
            <p dangerouslySetInnerHTML={{ __html: chapter.content }} />
            <Button onClick={() => handleOpenComments(chapter)}>Komentarai</Button>
          </div>

        </Modal.Body>
        {isCommentsOpen && selectedChapter &&
          <CommentList
            isOpen={isCommentsOpen}
            onClose={handleHideModal}
            isProfile={!isBlocked}
            entityId={selectedChapter.id}
            commentType='Chapter'
            genreName={book.genreName}
            bookId={book.id}
          />
        }
      </Modal>
    );
  } else {
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
          {pageChapter === 0 && (
            <div className="book-cover-container">
              <div className="mb-4">
                <img
                  src={book.coverImageUrl}
                  alt={`Knygos "${book.name}" viršelis.`}
                  className="book-cover"
                />
              </div>
            </div>
          )}
          {chaptersToDisplay.map((chapter: IChapters, index: number) => (
            <div key={index}>
              <h5 className="chapter-title">{chapter.name}</h5>
              <p dangerouslySetInnerHTML={{ __html: chapter.content }} />
              <Button onClick={() => handleOpenComments(chapter)}>Komentarai</Button>
            </div>
          ))}

        </Modal.Body>
        <Modal.Footer>
          {numChapterPages > 1 && (
            <Pagination className="chapter-pagination" size="sm">
              {Array.from(Array(numChapterPages), (e, i) => (
                <Pagination.Item
                  key={i}
                  active={i === pageChapter}
                  onClick={() => setChapterPage(i)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Modal.Footer>
        {isCommentsOpen && selectedChapter &&
          <CommentList
            isOpen={isCommentsOpen}
            onClose={handleHideModal}
            isProfile={!isBlocked}
            entityId={selectedChapter.id}
            commentType='Chapter'
            genreName={book.genreName}
            bookId={book.id}
          />
        }
      </Modal>

    );
  }
};

export default ChaptersModal;