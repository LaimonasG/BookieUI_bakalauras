import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface AddCommentProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  show: boolean;
}

const AddComment: React.FC<AddCommentProps> = ({ onSubmit, onCancel, show }) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    onSubmit(content);
    setContent('');
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pridėti komentarą</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="add-comment">
          <Form>
            <Form.Group controlId="commentContent">
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Parašykite savo komentarą čia..."
              />
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" className="mr-2" onClick={handleSubmit}>
          Pateikti
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Atšaukti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AddComment;