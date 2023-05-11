import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { IBookBought, IStatus, getStatusString, handleConfirmed, handleDenied, useHandleAxiosError } from "../../Interfaces";
import BookInfoModal from "./BookInfoModal";
import { getAllBooks, setBookStatus } from "../../requests/AdminController";
import { AxiosError } from "axios";

const BookTable: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<IBookBought | null>(null);
  const [books, setBooks] = useState<IBookBought[]>([]);
  const [statusComment, setStatusComment] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<Map<number, number>>(new Map());
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleUpdateModalClose = () => setShowUpdateModal(false);

  //pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const booksPerPage = 5;
  const totalPages = Math.ceil(books.length / booksPerPage);

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const displayedBooks = books.slice(start, end);

  const handleAxiosError = useHandleAxiosError();

  const handleUpdateModalShow = (book: IBookBought) => {
    setSelectedBook(book);
    setShowUpdateModal(true);
  };

  const isUpdateDisabled = (bookId: number) => {
    const currentStatus = selectedStatuses.get(bookId);
    return currentStatus === IStatus.Pateikta || currentStatus === undefined;
  };


  useEffect(() => {
    async function fetchData() {
      const books = await getAllBooks();
      console.log()
      setBooks(books);
    }

    fetchData();
  }, []);

  const handleStatusChange = (bookId: number, newStatus: number) => {
    setSelectedStatuses((prevState) => {
      const updatedStatuses = new Map(prevState);
      updatedStatuses.set(bookId, newStatus);
      return updatedStatuses;
    });
  };

  const submitStatusChange = async (book: IBookBought) => {

    const currentStatus = selectedStatuses.get(book.id);
    if (currentStatus !== null) {
      try {
        const response = await setBookStatus(currentStatus!, statusComment, book.id);
        if (response === 'success') {
          handleConfirmed(`Knygos "${book.name}" statusas pakeistas į "${getStatusString(currentStatus as number)}"`);
          const books = await getAllBooks();
          setBooks(books);
        } else {
          handleDenied(response);
        }
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="book-table-container">
      <div className="table-header">
        <h2>Knygos</h2>
      </div>

      <Table striped bordered hover responsive className="book-table">
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th>Autorius</th>
            <th>Būsena</th>
            <th>Komentaras</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {displayedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.name}</td>
              <td>{book.author}</td>
              <td>
                <Form.Select
                  aria-label="Pasirinkite statusą"
                  value={selectedStatuses.get(book.id) ?? book.status}
                  onChange={(event) =>
                    handleStatusChange(book.id, parseInt(event.target.value, 10))
                  }
                >
                  {Object.values(IStatus)
                    .filter((value) => typeof value === 'number')
                    .map((status) => (
                      <option key={status} value={status}>
                        {getStatusString(status as number)}
                      </option>
                    ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Įveskite komentarą"
                  onChange={(event) => setStatusComment(event.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => submitStatusChange(book)}
                  disabled={isUpdateDisabled(book.id)}
                >
                  Atnaujinti
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleUpdateModalShow(book)}
                >
                  Peržiūrėti
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-container">
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? 'primary' : 'light'}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {selectedBook && (
        <BookInfoModal
          book={selectedBook}
          isOpen={showUpdateModal}
          onClose={handleUpdateModalClose}
        />
      )}
    </div>
  );
};

export default BookTable;
