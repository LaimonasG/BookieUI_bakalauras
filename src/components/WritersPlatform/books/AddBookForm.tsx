import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { getAllGenres } from '../../../requests/GenresController';
import './AddBookForm.css';
import { IGenres } from '../../genres/GenresTable';

interface IBookFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (name: string, genre: string, description: string, chapterPrice: number, bookPrice: number, coverImage: File) => void;
}

const BookFormModal: React.FC<IBookFormModalProps> = ({ show, onHide, onSubmit }) => {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<IGenres[]>([]);
  const [genre, setGenre] = useState<IGenres>();
  const [description, setDescription] = useState('');
  const [chapterPrice, setChapterPrice] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [coverImage, setCoverImage] = useState<File>();
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      const fetchedGenres = await getAllGenres();
      setGenres(fetchedGenres);
    };

    fetchGenres();
  }, []);

  const handleSubmit = () => {
    if (!name || !description || name.length > 25 || description.length > 25 || !genre || !coverImage) {
      setValidationError('All fields are required, and name and description must be no longer than 25 symbols.');
      return;
    }

    onSubmit(name, genre.name, description, parseFloat(chapterPrice), parseFloat(bookPrice), coverImage);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Insert a book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {validationError && <p className="text-danger">{validationError}</p>}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={25}
            />
          </Form.Group>

          <Form.Group controlId="genre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              as="select"
              value={genre?.id}
              onChange={(e) => {
                const selectedGenre = genres.find((g) => g.id === parseInt(e.target.value));
                setGenre(selectedGenre);
              }}
            >
              <option value="">Select a genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={25}
            />
          </Form.Group>

          <Form.Group controlId="chapterPrice">
            <Form.Label>Chapter Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={chapterPrice}
              onChange={(e) => setChapterPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="bookPrice">
            <Form.Label>Book Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={bookPrice}
              onChange={(e) => setBookPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="coverImage">
            <Form.Label>Cover Image</Form.Label>
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
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookFormModal;