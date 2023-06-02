import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './AddTextForm.css';
import { IGenres } from '../../../Interfaces';

interface ITextFormModalProps {
  show: boolean;
  genrelist: IGenres[];
  onHide: () => void;
  onSubmit: (name: string, genre: string, description: string, textPrice: number, coverImage: File, contentFile: File) => void;
}

const TextFormModal: React.FC<ITextFormModalProps> = ({ show, onHide, onSubmit, genrelist }) => {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<IGenres[]>([]);
  const [genre, setGenre] = useState<IGenres>();
  const [description, setDescription] = useState('');
  const [textPrice, setTextPrice] = useState('');
  const [coverImage, setCoverImage] = useState<File>();
  const [contentFile, setContentFile] = useState<File>();
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setGenres(genrelist);
  }, []);

  const handleSubmit = () => {
    if (!name || !description || !genre || !coverImage || !contentFile || !textPrice) {
      setValidationError('Visi laukai yra privalomi.');
      return;
    }

    onSubmit(name, genre.name, description, parseFloat(textPrice), coverImage, contentFile);
    onHide();
  };

  useEffect(() => {
    if (validationError) {
      const errorElement = document.getElementById('validation-error');
      errorElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [validationError]);

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Teksto informacija</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {validationError && <p id="validation-error" className="text-danger">{validationError}</p>}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Pavadinimas</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </Form.Group>

          <Form.Group controlId="genre">
            <Form.Label>Žanras</Form.Label>
            <Form.Control
              as="select"
              value={genre?.id}
              onChange={(e) => {
                const selectedGenre = genres.find((g) => g.id === parseInt(e.target.value));
                setGenre(selectedGenre);
              }}
            >
              <option value="">Pasirinkite žanrą</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Aprašymas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </Form.Group>

          <Form.Group controlId="chapterPrice">
            <Form.Label>Kaina</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={textPrice}
              onChange={(e) => setTextPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="coverImage">
            <Form.Label>Viršelio nuotrauka</Form.Label>
            <Form.Control
              type="file"
              accept=".png, .jpg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setCoverImage(e.target.files[0]);
                }
              }}
            />
          </Form.Group>

          <Form.Group controlId="coverImage">
            <Form.Label>Teksto turinys</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setContentFile(e.target.files[0]);
                }
              }}
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

export default TextFormModal;