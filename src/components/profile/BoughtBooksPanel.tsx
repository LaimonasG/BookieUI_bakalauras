import React, { useState, useEffect } from 'react';
import './BoughtBooksPanel.css';
import { IBookBought, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from '../../Interfaces';
import ChapterList from '../chapters/ChapterList';
import CommentList from '../comments/CommentsList';
import { getProfileBooks } from '../../requests/ProfileController';
import { unsubscribeToBook } from '../../requests/BookController';
import { Pagination } from 'react-bootstrap';
import { AxiosError } from 'axios';
import { getUserBlockedStatus } from '../../requests/AdminController';

const BoughtBooks: React.FC = () => {
  const [books, setBooks] = useState<IBookBought[]>([]);
  const [showChapterList, setShowChapterList] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBookBought>();
  const [isBookCommentsOpen, setIsBookCommentsOpen] = useState<boolean>(false);
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);


  const handleAxiosError = useHandleAxiosError();


  //pagination
  const [pageBook, setBookPage] = useState(0);
  const perPage = 2;
  const numBookPages = Math.ceil(books.length / perPage);
  const booksToDisplay = books.slice(pageBook * perPage, (pageBook + 1) * perPage);

  useEffect(() => {
    const fetchBooks = async () => {
      const isBlocked = await getUserBlockedStatus();
      setIsUserBlocked(isBlocked);
      try {
        const xd = await getProfileBooks();
        setBooks(xd);
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    };

    fetchBooks();
  }, []);

  const readBook = (book: IBookBought) => {
    setSelectedBook(book);
    setShowChapterList(true);
  };

  const unsubscribe = async (book: IBookBought) => {
    const response = await unsubscribeToBook(book.id, book.genreName);
    if (response === 'success') {
      handleConfirmed(`Knygos "${book.name}" prenumerata nutraukta.`);
      const xd = await getProfileBooks();
      setBooks(xd);
    } else {
      handleDenied(response);
    }
  };

  const handleHideModal = () => {
    setShowChapterList(false);
    setIsBookCommentsOpen(false);
  }

  const handleOpenBookComments = (book: IBookBought) => {
    setSelectedBook(book);
    setIsBookCommentsOpen(true);
  }


  return (
    <div className="book-list-container">
      <div className="book-list">
        <h3>Knygos</h3>
        {books.length === 0 ? (
          <p>Knygų sąrašas tuščias</p>
        ) : (
          <ul>
            {booksToDisplay.map((book) => (
              <li key={book.id}>
                <p className="book-name"> Knygos pavadinimas: {book.name}</p>
                {book.isFinished === 1 &&
                  <p className="book-price"> Kaina: {book.price} {getPointsWord(book.price)}</p>
                }
                {book.isFinished === 0 &&
                  <p className="book-price"> Skyriaus kaina: {book.chapterPrice} {getPointsWord(book.price)}</p>
                }
                <p className="book-description"> Įkelta: {new Date(book.created.toString()).toISOString().split('T')[0]}</p>
                <div>
                  {book.chapters?.length === 0 ? (
                    <button disabled={true} className="btn-disabled">Peržiūrėti turinį</button>
                  ) : (
                    <button className="view-content btn-color1" onClick={() => readBook(book)}>Peržiūrėti turinį</button>
                  )}
                  <button className="comments btn-color3" onClick={() => handleOpenBookComments(book)}>Komentarai</button>
                  {book.isFinished === 0 &&
                    <button className="btn-unsubscribe" onClick={() => unsubscribe(book)}>Nutraukti prenumeratą</button>
                  }
                </div>
              </li>
            ))}

            {showChapterList && selectedBook && (
              <ChapterList
                book={selectedBook}
                show={showChapterList}
                onHide={handleHideModal}
                isBlocked={isUserBlocked}
              />
            )}
            {isBookCommentsOpen && selectedBook &&
              <CommentList
                isOpen={isBookCommentsOpen}
                onClose={handleHideModal}
                isProfile={!isUserBlocked}
                entityId={selectedBook.id}
                commentType='Book'
                genreName={selectedBook.genreName}
                bookId={0}
              />
            }
          </ul>
        )}
      </div>
      <div >
        {numBookPages > 1 && (
          <Pagination
            size="sm"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0px"
            }}
          >
            {Array.from(Array(numBookPages), (e, i) => (
              <Pagination.Item
                key={i}
                active={i === pageBook}
                onClick={() => setBookPage(i)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
      </div>
    </div>

  );
};

export default BoughtBooks;