import React, { useEffect, useState } from 'react';
import { getAllBooksUnfinished } from "../../../requests/BookController";
import jwt_decode from "jwt-decode";
import { MyToken, IBookToBuy } from "../../../Interfaces";
import './BookList.css';
import BookView from './BookView';

export const UnfinBookList = () => {
  const [books, setBooks] = useState<IBookToBuy[]>([]);
  const [texts, setTexts] = useState<IBookToBuy[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<IBookToBuy[]>([]);
  const [subscribeBooks, setSubscribeBooks] = useState<IBookToBuy[]>([]);
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currBook, setCurrBook] = useState<IBookToBuy>();
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [showLeftArrowTexts, setShowLeftArrowTexts] = useState<boolean>(false);
  const [showRightArrowTexts, setShowRightArrowTexts] = useState<boolean>(true);
  const [scrollLeftAmount, setScrollLeftAmount] = useState<number>(0);

  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  let decodedToken: MyToken | undefined;
  try {
    decodedToken = jwt_decode<MyToken>(user.accessToken);
  } catch (error) {
    console.log('User does not have a token yet');
  }

  async function GetBooks() {
    const xd = await getAllBooksUnfinished(localStorage.getItem("genreName")!);
    setBooks(xd);
  }

  const handleTileClick = (event: React.MouseEvent<HTMLDivElement>, book: IBookToBuy) => {
    event.stopPropagation();
    setCurrBook(book);
    toggleFormStatus();
  };

  function toggleFormStatus() {
    setIsOpen(!isOpen);
  };

  function scrollRight() {
    const container = document.getElementById('book-tiles-scroll-container');
    const tileWidth = getTileWidth();

    if (container && tileWidth) {
      container.scrollTo({
        left: scrollLeftAmount + tileWidth,
        behavior: 'smooth'
      });
    }
  }

  function scrollLeft() {
    const container = document.getElementById('book-tiles-scroll-container');
    const tileWidth = getTileWidth();

    if (container && tileWidth) {
      container.scrollTo({
        left: scrollLeftAmount - tileWidth,
        behavior: 'smooth'
      });
    }
  }

  function getTileWidth(): number | null {
    const container = document.getElementById('book-tiles-scroll-container');
    if (!container) return null;

    const tile = container.querySelector('.book-tile');
    if (!tile) return null;

    const style = getComputedStyle(tile);
    const width = parseFloat(style.width);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);

    return width + marginLeft + marginRight;
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setScrollLeftAmount(scrollLeft);
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < maxScrollLeft);
  }

  useEffect(() => {
    GetBooks();
  }, [Date.now()]);

  if (books.length === 0) {
    return (
      <h1>Žanras "{genreName}" dar neturi knygų.</h1>
    )
  }
  return (
    <div className="book-tiles-scrollable">
      <div className="book-tiles-section">
        <h2 className="book-tiles-section-title">Šiuo metu rašomos knygos</h2>
        <div className="book-tiles-scroll-wrapper">
          {showLeftArrow && (
            <div className="book-tiles-scroll-arrow book-tiles-scroll-arrow-left" onClick={scrollLeft}>
              <i className="fas fa-chevron-left"></i>
            </div>
          )}
          <div className="book-tiles-scroll-container" onScroll={handleScroll}>
            <div className="book-tiles-grid">
              {books.map((book, index) => (
                <div className="book-tile" key={index} onClick={(event) => handleTileClick(event, book)}>
                  <img src={book.coverImageUrl} alt={book.name} className="book-tile-image" />
                  <div className="book-tile-details">
                    <h2 className="book-tile-title">{book.name}</h2>
                    <p className="book-tile-author">{book.author}</p>
                    <p className="book-tile-description">{book.description}</p>
                    <div className="book-tile-footer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showRightArrow && (
            <div className="book-tiles-scroll-arrow book-tiles-scroll-arrow-right" onClick={scrollRight}>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        </div>
        {currBook && (
          <BookView
            book={currBook}
            isOpen={isOpen}
            onClose={toggleFormStatus}
          />
        )}
      </div>
    </div>
  );
}