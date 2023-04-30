import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BoughtbooksPanel.css';
import { IBookBought, getPointsWord } from '../../Interfaces';
import ChapterList from '../Chapters/ChapterList';
import { getProfileBooks } from '../../requests/ProfileController';


const BoughtBooks: React.FC = () => {
  const [books, setBooks] = useState<IBookBought[]>([]);
  const [showChapterList, setShowChapterList] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBookBought | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const xd = await getProfileBooks();
      setBooks(xd);
    }
    fetchBooks();
  }, []);

  const readBook = (book: IBookBought) => {
    setSelectedBook(book);
    setShowChapterList(true);
  };

  const handleHideModal = () => {
    setShowChapterList(false);
  }

  return (
    <div className="book-list">
      <h3>Knygos</h3>
      {books.length === 0 ? (
        <p>Knygų sąrašas tuščias</p>
      ) : (
        <div className="scrollable-panel">
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <p className="book-name"> Knygos pavadinimas: {book.name}</p>
                <p className="book-price"> Kaina: {book.price} {getPointsWord(book.price)}</p>
                <p className="book-description"> Įkelta: {new Date(book.created.toString()).toISOString().split('T')[0]}</p>

                <div>
                  <button className="view-content btn-color1" onClick={() => readBook(book)}>Peržiūrėti turinį</button>
                  <button className="comments btn-color3">Komentarai</button>
                  <span className="book-finished-indicator">{book.isFinished ? "●" : "○"}</span>
                </div>
              </li>
            ))}
            {showChapterList && selectedBook && (
              <ChapterList
                book={selectedBook}
                show={showChapterList}
                onHide={handleHideModal}
              />
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BoughtBooks;