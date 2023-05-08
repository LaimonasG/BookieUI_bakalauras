import React, { useEffect, useState } from 'react';
import { getAllBooksUnfinished } from "../../../requests/BookController";
import jwt_decode from "jwt-decode";
import { MyToken, IBookToBuy, useHandleAxiosError } from "../../../Interfaces";
import '../Finished books/BookList.css';
import BookView from './BookView';
import { Pagination } from 'react-bootstrap';
import { AxiosError } from 'axios';
import { getUserBlockedStatus } from '../../../requests/AdminController';

export const UnfinBookList = () => {
  const [books, setBooks] = useState<IBookToBuy[]>([]);
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currBook, setCurrBook] = useState<IBookToBuy>();
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);


  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const paginatedBooks = books.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handleAxiosError = useHandleAxiosError();

  const handlePageClick = (selectedPage: number) => {
    setCurrentPage(selectedPage - 1);
  };

  async function GetBooks() {
    try {
      const xd = await getAllBooksUnfinished(localStorage.getItem("genreName")!);
      setBooks(xd);
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  }

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
      <h2 className="book-tiles-section-title">Šiuo metu rašomos knygos</h2>
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