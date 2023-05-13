import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './AddChapterForm.css';

interface IBookFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (file: File, name: string, isFinished: number) => void;
}

const BookFormModal: React.FC<IBookFormModalProps> = ({ show, onHide, onSubmit }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File>();
  const [isFinished, setIsFinished] = useState<number>(0);
  const [validationError, setValidationError] = useState('');



  const handleSubmit = () => {
    if (!name || !file) {
      setValidationError('Visi laukai yra privalomi.');
      return;
    }

    onSubmit(file, name, isFinished);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Skyriaus informacija</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {validationError && <p className="text-danger">{validationError}</p>}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Pavadinimas</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={25}
            />
          </Form.Group>

          <Form.Group controlId="coverImage">
            <Form.Label>Skyriaus turinys</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </Form.Group>

          <Form.Group controlId="isFinished">
            <Form.Label>Ar tai paskutinis knygos skyrius?</Form.Label>
            <Form.Check
              type="switch"
              id="isFinished-switch"
              checked={isFinished === 1}
              onChange={(e) => setIsFinished(e.target.checked ? 1 : 0)}
              label={isFinished === 1 ? 'Taip' : 'Ne'}
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Pateikti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookFormModal;