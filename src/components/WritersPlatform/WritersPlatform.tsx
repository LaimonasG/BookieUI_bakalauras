import React, { Component, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { LineChart, PieChart } from 'react-chartkick';
import { setUserRole } from "../../requests/AdminController";
import { IBookBought, ITextsBought, ISetRoleDto, ITexts } from '../../Interfaces';
import { getWriterBooks, getWriterTexts, getBookChapters } from "../../requests/WriterController";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ChapterList from '../Chapters/ChapterList';
import 'chartkick/chart.js';
import './WritersPlatform.css';

interface IConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

async function SetRole(dto: ISetRoleDto) {
  const xd = await setUserRole(dto);
  localStorage.setItem("role", "BookieWriter");
}

interface WritersPlatformProps {
  useNavigate: () => NavigateFunction;
}

interface IWritersPlatformState {
  isConfirmationOpen: boolean;
  isOpen: boolean;
  books: IBookBought[];
  texts: ITexts[];
  pieChartData: any[];
  lineChartData: any;
}

const ConfirmationModal: React.FC<IConfirmationModalProps> = ({ isOpen, onClose, onAgree }) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ar sutinkate su puslapio privatumo politika?</p>
        <p>Apie ją galite paskaityti čia: https://bookie.privatumas.lt</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Back to Home Page
        </Button>
        <Button variant="primary" onClick={onAgree}>
          Agree
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const WritersPlatform: React.FC<WritersPlatformProps> = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [books, setBooks] = useState<IBookBought[]>([]);
  const [texts, setTexts] = useState<ITextsBought[]>([]);
  const [selectedBook, setSelectedBook] = useState<IBookBought | null>(null);
  const [chapters, setChapters] = useState<IChapters[] | null>(null);
  const [showChapterList, setShowChapterList] = useState(false);
  const [userRole, setUserRole] = useState<string | null>("");
  const [pieChartData, setPieChartData] = useState<any[]>([
    ["Fantasy", 10],
    ["Mystery", 20],
    ["Romance", 15],
    ["Horror", 5]
  ]);
  const [lineChartData, setLineChartData] = useState<any>({
    "2022-01-01": 4,
    "2022-02-01": 2,
    "2022-03-01": 6,
    "2022-04-01": 8,
    "2022-05-01": 5
  });

  async function GetBooks() {
    const xd = await getWriterBooks();
    return xd;
  }

  async function GetTexts() {
    const xd = await getWriterTexts();
    setTexts(xd);
  }

  async function GetChaptersForBook(bookId: number, genreName: string): Promise<IChapters[]> {
    const data = await getBookChapters(bookId, genreName);
    return data;
  }

  useEffect(() => {
    async function fetchData() {
      const booksData = await GetBooks();
      setBooks(booksData);
      GetTexts();
    }
    fetchData();
    // setUserRole(localStorage.getItem("role"));
  }, []);

  const toggleFormStatus = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirmationClose = () => {
    const navigate = useNavigate();
    navigate("/");
  };

  const handleAgree = () => {
    const setRole: ISetRoleDto = {
      roleName: "BookieWriter"
    };
    SetRole(setRole);
    setIsConfirmationOpen(false);
  };

  const handleAddBook = () => {
    // handle add book logic here
  };

  const handleAddText = () => {
    // handle add text logic here
  };

  function handleCloseChapterListClick() {
    setSelectedBook(null);
  }

  async function handleReadBookClick(book: IBookBought) {
    const chapters = await GetChaptersForBook(book.id, book.genreName);
    setSelectedBook(book);
    setShowChapterList(true);
    setChapters(chapters);
  }

  return (
    <div>
      {/* {userRole !== "BookieWriter" &&
        userRole !== "Admin" && (
          <ConfirmationModal
            isOpen={isConfirmationOpen}
            onClose={handleConfirmationClose}
            onAgree={handleAgree}
          />
        )} */}


      <div className="writers-platform">
        <div className="textsAndBooks">
          <div className="books-and-texts">
            <h2>Jūsų knygos ir tekstai</h2>
            <div className="add-buttons">
              <Button variant="primary" onClick={handleAddBook}>
                Prdėti tekstą
              </Button>
              <Button variant="primary" onClick={handleAddText}>
                Pridėti knygą
              </Button>
            </div>
            <div className="book-list">
              <h3>Knygos</h3>
              {books.length === 0 ? (
                <p>Knygų sąrašas tuščias</p>
              ) : (
                <ul>
                  {books.map((book) => (
                    <li key={book.id}>
                      <p className="book-name"> Knygos pavadinimas: {book.name}</p>
                      <p className="book-price"> Kaina: {book.price} €</p>
                      <div>
                        <button onClick={() => handleReadBookClick(book)}>Peržiūrėti turinį</button>
                        <button>Komentarai</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {selectedBook && (
                <div className="chapter-list-overlay">
                  <div className="chapter-list-container">
                    <button onClick={handleCloseChapterListClick}>Uždaryti</button>
                    <ChapterList chapters={chapters} />
                  </div>
                </div>
              )}
            </div>

            <div className="text-list">
              <h3>Tekstai</h3>
              {texts.length === 0 ? (
                <p>Tekstų sąrašas tuščias</p>
              ) : (
                <ul>
                  {texts.map((text) => (
                    <li key={text.Id}>
                      <p>{text.Content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="statistics">
            <h2>Pardavimų statistika</h2>
            <div className="chart">
              <PieChart data={pieChartData} />
            </div>
            <div className="chart">
              <LineChart data={lineChartData} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WritersPlatform;