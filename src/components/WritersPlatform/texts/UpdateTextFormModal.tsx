import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './AddTextForm.css';
import { ITextsBought, IGenres } from '../../../Interfaces';

interface ITextFormModalProps {
  show: boolean;
  genrelist: IGenres[];
  onHide: () => void;
  onSubmit: (text: ITextsBought, coverImage: File, content: File) => void;
  text: ITextsBought;
}

const UpdateTextFormModal: React.FC<ITextFormModalProps> = ({ show, onHide, onSubmit, genrelist, text }) => {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<IGenres[]>([]);
  const [genre, setGenre] = useState<IGenres>();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState<File>();
  const [coverImage, setCoverImage] = useState<File>();
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setGenres(genrelist);
    setName(text.name);
    setGenre(genrelist.find(g => g.name === text.genreName));
    setDescription(text.description);
    setPrice(text.price.toString());
    setContent(undefined);
    setCoverImage(undefined);

  }, [text, genrelist]);


  const handleSubmit = () => {
    if (!name || !description || !genre || !coverImage || !content) {
      setValidationError('Visi laukai yra privalomi.');
      return;
    }

    const updatedtext: ITextsBought = {
      ...text,
      name,
      genreName: genre.name,
      description,
      price: parseFloat(price)
    };

    onSubmit(updatedtext, coverImage, content);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Teksto informacija</Modal.Title>
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
              maxLength={150}
            />
          </Form.Group>

          <Form.Group controlId="textPrice">
            <Form.Label>Kaina</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="content">
            <Form.Label>Turinys</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setContent(e.target.files[0]);
                }
              }}
            />
          </Form.Group>

          <Form.Group controlId="coverImage">
            <Form.Label>Viršelio nuotrauka</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setCoverImage(e.target.files[0]);
                }
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Atšaukti
        </Button>
        <Button variant="primary" onClick={() => {
          handleSubmit();
        }}>
          Pateikti
        </Button>

      </Modal.Footer>
    </Modal>
  );
};

export default UpdateTextFormModal;