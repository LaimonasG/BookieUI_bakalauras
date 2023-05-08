import React, { useEffect, useState } from 'react';
import { getAllBooksFinished } from "../../../requests/BookController";
import jwt_decode from "jwt-decode";
import { MyToken, IBookToBuy, useHandleAxiosError } from "../../../Interfaces";
import './BookList.css';
import BookView from './BookView';
import { AxiosError } from 'axios';
import { getUserBlockedStatus } from '../../../requests/AdminController';
import { Pagination } from 'react-bootstrap';

export const FinBookList = () => {
  const [books, setBooks] = useState<IBookToBuy[]>([]);
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currBook, setCurrBook] = useState<IBookToBuy>();
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [scrollLeftAmount, setScrollLeftAmount] = useState<number>(0);
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);
  const handleAxiosError = useHandleAxiosError();

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const paginatedBooks = books.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  async function GetBooks() {
    try {
      const xd = await getAllBooksFinished(localStorage.getItem("genreName")!);
      setBooks(xd);
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  }

  const handlePageClick = (selectedPage: number) => {
    setCurrentPage(selectedPage - 1);
  };

  const handleTileClick = (event: React.MouseEvent<HTMLDivElement>, book: IBookToBuy) => {
    event.stopPropagation();
    setCurrBook(book);
    toggleFormStatus();
  };

  function toggleFormStatus() {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    GetBooks();
    SetUserBlockedStatus();
  }, []);

  async function SetUserBlockedStatus() {
    const isBlocked = await getUserBlockedStatus();
    setIsUserBlocked(isBlocked);
  }

  if (books.length === 0) {
    return (
      <div></div>
    )
  }
  return (
    <div className="book-tiles-section">
      <h2 className="book-tiles-section-title">Išleistos knygos</h2>
      <div className="book-tiles-grid">
        {paginatedBooks.map((book, index) => (
          <div className="book-tile" key={index} onClick={(event) => handleTileClick(event, book)}>
            <img src={book.coverImageUrl} alt={book.name} className="book-tile-image" />
            <div className="book-tile-details">
              <h2 className="book-tile-title">{book.name}</h2>
              <p className="book-tile-author">{book.author}</p>
              <div className="book-tile-footer"></div>
            </div>
          </div>
        ))}
      </div>
      <Pagination className="justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index === currentPage}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      {currBook && (
        <BookView
          book={currBook}
          isOpen={isOpen}
          onClose={toggleFormStatus}
          isBlocked={isUserBlocked}
        />
      )}
    </div>
  );
}