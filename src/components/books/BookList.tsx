
import React, { Component, MouseEventHandler, useEffect, useState } from 'react';
import { getAllBooks, deleteBook, addToBasket } from "../../requests/BookController";
import { FaTrash, FaShoppingBasket } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import "./styles.css";
import { Modal } from 'react-bootstrap';
import Comments from '../comments/Comments';
import { FaComment } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MyToken, IBookToBuy } from "../../Interfaces"
import './BookList.css';
import BoughtBookView from './ToBuyBookView';

export const BookList = () => {
  const [books, setBooks] = useState<IBookToBuy[]>([])
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<Boolean | any>(false);
  const [currBook, setCurrBook] = useState<IBookToBuy>();

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
    const xd = await getAllBooks(localStorage.getItem("genreName")!);
    setBooks(xd);
  }

  const handleTileClick = (book: IBookToBuy) => {
    setCurrBook(book);
    toggleFormStatus();
  };

  function toggleFormStatus() {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    GetBooks();
  }, [Date.now()]);

  if (books.length === 0) {
    return (
      <h1>Žanras "{genreName}" dar neturi knygų.</h1>
    )
  }
  return (
    <div className="book-tiles-grid">
      {books.map((book, index) => (
        <div className="book-tile" key={index} onClick={() => handleTileClick(book)}>
          <img src={`/public/Hobbit.jpg`} alt={book.name} className="book-tile-image" />
          <div className="book-tile-details">
            <h2 className="book-tile-title">{book.name}</h2>
            <p className="book-tile-author">{book.author}</p>
            <p className="book-tile-description">{book.description}</p>
            <div className="book-tile-footer"></div>
          </div>
        </div>
      ))}
      <Modal show={isOpen} onHide={toggleFormStatus}>
        <BoughtBookView
          book={currBook!}
          isOpen={isOpen!}
          onClose={toggleFormStatus}
        />
      </Modal>
    </div>
  );
}