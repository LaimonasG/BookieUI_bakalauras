import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './AddBookForm.css';
import { IBookBought, IGenres } from '../../../Interfaces';

interface IBookFormModalProps {
  show: boolean;
  genrelist: IGenres[];
  onHide: () => void;
  onSubmit: (name: string, genre: string, description: string, chapterPrice: number, bookPrice: number, coverImage: File) => void;
  book?: IBookBought;
}

const BookFormModal: React.FC<IBookFormModalProps> = ({ show, onHide, onSubmit, genrelist, book }) => {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<IGenres[]>([]);
  const [genre, setGenre] = useState<IGenres>();
  const [description, setDescription] = useState('');
  const [chapterPrice, setChapterPrice] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [coverImage, setCoverImage] = useState<File>();
  const [validationError, setValidationError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGenres(genrelist);

    if (book) {
      setName(book.name);
      setGenre(genrelist.find(g => g.name === book.genreName));
      setDescription(book.description);
      setChapterPrice(book.chapterPrice.toString());
      setBookPrice(book.price.toString());
      setCoverImage(undefined);
    } else {
      setName('');
      setGenre(undefined);
      setDescription('');
      setChapterPrice('');
      setBookPrice('');
      setCoverImage(undefined);
    }
  }, [book, genrelist]);

  const handleSubmit = () => {
    if (!name || !description || !genre || !coverImage || !bookPrice || !chapterPrice) {
      setValidationError('Visi laukai yra privalomi.');
      return;
    }

    onSubmit(name, genre.name, description, parseFloat(chapterPrice), parseFloat(bookPrice), coverImage);
    onHide();
  };
  useEffect(() => {
    if (validationError) {
      const errorElement = document.getElementById('validation-error');
      errorElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [validationError]);

  return (
    <Modal show={show} onHide={onHide} ref={modalRef}>
      <Modal.Header closeButton>
        <Modal.Title>Knygos informacija</Modal.Title>
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
              maxLength={35}
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

          <Form.Group controlId="chapterPrice">
            <Form.Label>Skyriaus kaina</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={chapterPrice}
              onChange={(e) => setChapterPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="bookPrice">
            <Form.Label>Knygos kaina</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={bookPrice}
              onChange={(e) => setBookPrice(e.target.value)}
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