
import React, { Component, MouseEventHandler, useEffect, useState } from 'react';
import { getAllBooks, deleteBook, addToBasket } from "../../requests/GenresController";
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

interface IBook {
  id: number,
  "name": string,
  "genreID": number,
  "author": string,
  "created": string,
  "userId": string
  "price": number,
  "quality": string
}

interface MyToken {
  name: string;
  exp: number;
  sub: string;
}


export const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([])
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<Boolean | any>(false);
  const [currBook, setCurrBook] = useState<number>();

  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  const decodedToken = jwt_decode<MyToken>(user.accessToken);

  async function GetBooks() {
    const xd = await getAllBooks(parseInt(localStorage.getItem("genreId")!));
    setBooks(xd);
  }

  async function onBookDelete(BookId: number) {
    const genreId = parseInt(localStorage.getItem("genreId")!);
    await deleteBook(genreId, BookId);
  };

  async function onAddToBasket(BookId: number) {
    const genreId = parseInt(localStorage.getItem("genreId")!);
    await addToBasket(BookId, genreId);
  };

  function setAndToggle(bookId: number) {
    setCurrBook(bookId);
    toggleFormStatus();
  };

  function toggleFormStatus() {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    GetBooks();
  }, []);

  if (books.length === 0) {
    return (
      <h1>No books exist in genre {genreName}.</h1>
    )
  }
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
          </TableHead>
          <TableBody>
            {books.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.author}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.quality}</TableCell>
                <td>
                  {row.userId == decodedToken.sub || localStorage.getItem('Role') == 'Admin' ?
                    <button onClick={() => onBookDelete(row.id)} className='btn btn-danger btn-sm rounded-0'>
                      <FaTrash />
                    </button>
                    :
                    (
                      <button onClick={() => onAddToBasket(row.id)} className='btn btn-primary btn-sm rounded-0'>
                        <FaShoppingBasket />
                      </button>
                    )
                  }
                </td>
                <td>
                  <button onClick={() => setAndToggle(row.id)} className='btn'>
                    <FaComment />
                  </button>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal show={isOpen} onHide={toggleFormStatus}>
        <Modal.Header closeButton>
          <Modal.Title> Comments </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Comments
            bookId={currBook!}
            toggleModal={setAndToggle!}
          />
        </Modal.Body>
      </Modal>

    </div>
  )
}