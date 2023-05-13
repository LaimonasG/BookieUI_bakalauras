import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Pagination } from 'react-bootstrap';
import { IComment, ICreateComment, handleConfirmed, handleDenied, useHandleAxiosError } from '../../Interfaces';
import AddComment from './AddComment';
import { addBookComment, addChapterComment, addTextComment, getBookComments, getChapterComments, getTextComments } from '../../requests/CommentsController';
import './CommentsList.css';
import { AxiosError } from 'axios';

interface CommentListProps {
  isOpen: boolean;
  onClose: () => void;
  isProfile: boolean;
  entityId: number;
  genreName: string;
  commentType: string;
  bookId: number; //only needed for chapters
}

const CommentList: React.FC<CommentListProps> = ({ isOpen, onClose, isProfile, entityId, genreName, commentType, bookId }) => {
  const [showAddComment, setShowAddComment] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 2;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedComments = comments.slice(startIndex, endIndex);
  const numPages = Math.ceil(comments.length / pageSize);

  const handleAxiosError = useHandleAxiosError();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const handleSubmitComment = async (content: string) => {
    const comment: ICreateComment = {
      Content: content
    };

    try {
      let response = "";
      if (commentType === "Text") {
        response = await addTextComment(genreName, entityId, comment);
      } else if (commentType === "Book") {
        response = await addBookComment(genreName, entityId, comment);
      } else if (commentType === "Chapter") {
        response = await addChapterComment(genreName, bookId, entityId, comment);
      } else {
        throw new Error("Invalid comment type");
      }

      if (response === 'success') {
        handleConfirmed(`Jūsų komentaras sėkmingai pridėtas.`);
        await fetchComments();
      } else {
        handleDenied(`Komentaro pridėti nepavyko. ${response}`)
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }

    setShowAddComment(false);
  };

  const fetchComments = async () => {
    try {
      let response;

      if (commentType === "Text") {
        response = await getTextComments(entityId, genreName);
      } else if (commentType === "Book") {
        response = await getBookComments(entityId, genreName);
      } else if (commentType === "Chapter") {
        response = await getChapterComments(entityId, bookId, genreName);
      }

      setComments(response || []);
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  };

  const handleAddComment = () => {
    setShowAddComment(true);
  };

  const handleCancelAddComment = () => {
    setShowAddComment(false);
  };

  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static" keyboard={false} centered size="lg">
      <ModalHeader closeButton>
        <Modal.Title>Komentarai</Modal.Title>
      </ModalHeader>
      <ModalBody>
        {showAddComment ? (
          <AddComment
            onSubmit={handleSubmitComment}
            onCancel={handleCancelAddComment}
            show={showAddComment}
          />
        ) : (
          <>
            {comments.length === 0 ? (
              <p>Komentarų dar nėra.</p>
            ) : (
              <>
                <div className="comments-tiles">
                  {pagedComments.map((comment) => (
                    <div key={comment.id} className="comment-tile">
                      <div className="comment-author">{comment.username}</div>
                      <div className="comment-content">{comment.content}</div>
                      <div className="comment-date">
                        {new Date(comment.date.toString()).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                {numPages > 1 && (
                  <div className="comments-pager">
                    <Pagination size="sm">
                      {Array.from(Array(numPages), (e, i) => (
                        <Pagination.Item
                          key={i}
                          active={i === page}
                          onClick={() => setPage(i)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          variant="custom-comment"
          className={`btn-custom ${!isProfile ? "btn-custom-comment-disabled" : ""}`}
          onClick={() => handleAddComment()}
          disabled={!isProfile}
        >
          Pridėti komentarą
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CommentList;